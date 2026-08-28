// Post-build step: bakes the per-route <title>/canonical/OG/Twitter tags (set
// via react-helmet-async at runtime) directly into static HTML files, one per
// route. Without this, every route serves the same dist/index.html, so
// crawlers that don't execute JS (Bing, most social-share bots) always see
// the homepage's meta tags — see the canonical-duplication bug this fixes.
import { readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { preview } from 'vite';
import { resolveBrowserOptions } from './lib/browser.mjs';


// Fuente única de verdad compartida con src/App.tsx y scripts/generate-sitemap.mjs.
// Antes esta lista estaba escrita a mano aquí y ya había derivado respecto al
// sitemap (/status se prerenderizaba pero no se publicaba).
const manifest = JSON.parse(readFileSync(new URL('../src/data/routes.json', import.meta.url), 'utf-8'));
const ROUTES = manifest.routes.filter((r) => r.prerender).map((r) => r.path);

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
        .waitForFunction(() => !!document.querySelector('link[rel="canonical"], meta[name="robots"]'), { timeout: 5000 })
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
          ...document.querySelectorAll('meta[name="robots"]'),
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

      // Vercel sirve dist/404.html con status 404 para todo lo que no acierte el
      // sistema de ficheros; el resto de rutas van como <ruta>/index.html.
      if (route === '/404') {
        await writeFile(path.join(DIST, '404.html'), html, 'utf-8');
      } else {
        const outDir = route === '/' ? DIST : path.join(DIST, route);
        await mkdir(outDir, { recursive: true });
        await writeFile(path.join(outDir, 'index.html'), html, 'utf-8');
      }
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
