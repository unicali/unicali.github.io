// Post-build step: bakes the per-route <title>/canonical/OG/Twitter tags (set
// via react-helmet-async at runtime) directly into static HTML files, one per
// route. Without this, every route serves the same dist/index.html, so
// crawlers that don't execute JS (Bing, most social-share bots) always see
// the homepage's meta tags — see the canonical-duplication bug this fixes.
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { preview } from 'vite';

// El build de Vercel corre en un contenedor Linux minimalista al que le
// faltan librerías del sistema que Chrome necesita para arrancar
// (ej. libnspr4.so) — el Chromium normal de `puppeteer` no levanta ahí
// ("error while loading shared libraries"). @sparticuz/chromium es un build
// de Chromium empaquetado específicamente para correr en ese tipo de
// entornos serverless (Vercel/Lambda), así que solo se usa cuando el build
// corre en Vercel; en local se reutiliza el Chrome/Edge ya instalado.
async function resolveBrowserOptions() {
  if (process.env.VERCEL) {
    const { default: chromium } = await import('@sparticuz/chromium');
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    };
  }

  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const executablePath = candidates.find((p) => existsSync(p));
  if (!executablePath) {
    throw new Error(
      'No se encontró Chrome/Edge instalado localmente para el prerender. Define CHROME_PATH.'
    );
  }
  return { headless: true, executablePath };
}

const ROUTES = [
  '/',
  '/privacidad',
  '/terminos',
  '/descargar',
  '/guias/que-es-un-tif-unsa',
  '/guias/que-es-rsu-unsa',
  '/herramientas/calculadora-unsa',
  '/nosotros',
  '/equipo',
  '/reseñas',
  '/versiones',
];

const PORT = 4321;
const HOST = `http://localhost:${PORT}`;
const DIST = path.resolve(process.cwd(), 'dist');
// Debe calzar exacto con el <title> estático de index.html. Helmet no
// reemplaza ese nodo al montar — inserta el suyo propio y dos <title>
// conviven en el DOM (mismo mecanismo que causó la duplicación de
// <link rel="canonical">). Se limpia el estático tras capturar cada ruta.
const STATIC_FALLBACK_TITLE = 'UniCali | La herramienta definitiva para tu vida universitaria';

async function main() {
  console.log('[prerender] iniciando servidor de preview (Vite API, in-process)...');
  // Server programático en vez de child_process: evita procesos zombie de
  // `npx vite preview` que en Windows sobreviven a server.kill() y cuelgan
  // el build indefinidamente (visto en desarrollo: npx -> vite.js quedaba
  // huérfano). server.close() aquí sí termina el proceso limpiamente.
  const server = await preview({
    preview: { port: PORT, strictPort: true },
    build: { outDir: 'dist' },
  });

  try {
    const browser = await puppeteer.launch(await resolveBrowserOptions());
    const page = await browser.newPage();

    // Evita contaminar GA/GTM con visitas fantasma del build
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('googletagmanager.com') || url.includes('google-analytics.com')) {
        req.abort();
      } else {
        req.continue();
      }
    });

    for (const route of ROUTES) {
      console.log(`[prerender] renderizando ${route}`);
      await page.goto(HOST + route, { waitUntil: 'networkidle0', timeout: 30000 });
      await page
        .waitForFunction(() => !!document.querySelector('link[rel="canonical"]'), { timeout: 5000 })
        .catch(() => {});

      const html = await page.evaluate((fallbackTitle) => {
        const titles = [...document.querySelectorAll('title')];
        if (titles.length > 1) {
          titles.filter((t) => t.textContent === fallbackTitle).forEach((t) => t.remove());
        }

        // El bundle cliente monta con createRoot (no hydrateRoot) y su propio
        // <Helmet> no sabe nada de este HTML pre-renderizado — al montar
        // vuelve a insertar title/canonical/OG/etc., duplicándolos otra vez
        // para cualquier bot o usuario con JS activo. Se marcan aquí los
        // nodos administrados por Helmet para que main.tsx los limpie justo
        // antes de montar React (ver removePrerenderedHeadTags en main.tsx).
        const managed = [
          ...document.querySelectorAll('title'),
          ...document.querySelectorAll('link[rel="canonical"]'),
          ...document.querySelectorAll('meta[name="description"]'),
          ...document.querySelectorAll('meta[name="keywords"]'),
          ...document.querySelectorAll('meta[property^="og:"]'),
          ...document.querySelectorAll('meta[name^="twitter:"]'),
          ...document.querySelectorAll('script[type="application/ld+json"]:not(#schema-site)'),
        ];
        managed.forEach((el) => el.setAttribute('data-prerendered', 'true'));

        const doctype = document.doctype ? `<!doctype ${document.doctype.name}>` : '<!doctype html>';
        return `${doctype}\n${document.documentElement.outerHTML}`;
      }, STATIC_FALLBACK_TITLE);

      const titleCount = (html.match(/<title[ >]/g) || []).length;
      if (titleCount !== 1) {
        throw new Error(`${route}: se esperaba 1 <title>, se encontraron ${titleCount}`);
      }

      const outDir = route === '/' ? DIST : path.join(DIST, route);
      await mkdir(outDir, { recursive: true });
      await writeFile(path.join(outDir, 'index.html'), html, 'utf-8');
    }

    await browser.close();
    console.log(`[prerender] listo — ${ROUTES.length} rutas prerenderizadas`);
  } finally {
    await new Promise((resolve) => server.httpServer.close(resolve));
  }
}

main().catch((err) => {
  console.error('[prerender] falló:', err);
  process.exit(1);
});
