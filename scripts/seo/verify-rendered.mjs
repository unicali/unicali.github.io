// Verifica el DOM DESPUÉS de que React monte, no el HTML que llega por la red.
//
//   node scripts/seo/verify-rendered.mjs http://localhost:4400/calculadora/economia
//   node scripts/seo/verify-rendered.mjs https://www.unicali.app/calculadora/derecho
//
// Existe por un fallo concreto: el servidor pintaba el FAQ y los enlaces internos
// dentro de #root, pero el cliente monta con createRoot, que vacía el contenedor.
// El contenido existía en el HTML crudo y desaparecía en cuanto arrancaba el
// JavaScript. Como Googlebot renderiza JavaScript, tampoco lo veía: un curl
// satisfecho y un ranking que nunca llega.
//
// Comprobar el HTML servido no basta. Hay que comprobar el DOM renderizado.
import puppeteer from 'puppeteer-core';
import { resolveBrowserOptions } from '../lib/browser.mjs';

const CHECKS = [
  { name: 'un solo <title>', run: (d) => d.titles === 1, detail: (d) => `${d.titles} títulos` },
  { name: 'canonical único', run: (d) => d.canonicals === 1, detail: (d) => `${d.canonicals} canonical` },
  { name: 'un solo <h1>', run: (d) => d.h1s === 1, detail: (d) => `${d.h1s} h1: ${d.h1Text}` },
  { name: 'malla renderizada', run: (d) => d.courseItems >= 6, detail: (d) => `${d.courseItems} asignaturas` },
  { name: 'FAQ visible', run: (d) => d.faqHeadings >= 1, detail: (d) => `${d.faqHeadings} preguntas` },
  { name: 'enlaces internos', run: (d) => d.internalLinks >= 1, detail: (d) => `${d.internalLinks} enlaces` },
  { name: 'migas de pan', run: (d) => d.breadcrumb, detail: (d) => (d.breadcrumb ? 'presentes' : 'ausentes') },
  { name: 'descargo de no afiliación', run: (d) => d.disclaimer, detail: (d) => (d.disclaimer ? 'presente' : 'AUSENTE') },
  { name: 'JSON-LD de página', run: (d) => d.jsonLd >= 1, detail: (d) => `${d.jsonLd} bloques` },
];

async function inspect(page) {
  return page.evaluate(() => {
    const text = document.body.innerText;
    const headings = [...document.querySelectorAll('h2, h3')].map((h) => h.textContent ?? '');
    return {
      titles: document.querySelectorAll('title').length,
      canonicals: document.querySelectorAll('link[rel="canonical"]').length,
      h1s: document.querySelectorAll('h1').length,
      h1Text: document.querySelector('h1')?.textContent?.slice(0, 60) ?? '',
      // Las filas de la malla y de la calculadora son la sustancia de la página.
      courseItems: document.querySelectorAll('main li, main tbody tr').length,
      faqHeadings: headings.filter((h) => h.trim().startsWith('¿')).length,
      internalLinks: document.querySelectorAll('a[href^="/calculadora/"]').length,
      breadcrumb: !!document.querySelector('nav[aria-label="Migas de pan"]'),
      disclaimer: /no está afiliado/i.test(text),
      jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
    };
  });
}

async function main() {
  const url = process.argv[2];
  if (!url) throw new Error('Falta la URL a verificar');

  const browser = await puppeteer.launch(await resolveBrowserOptions());
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const target = request.url();
      // No se contamina analítica con visitas del verificador.
      if (target.includes('googletagmanager.com') || target.includes('google-analytics.com')) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
    // El contenido llega tras montar React y, si no hay datos incrustados,
    // después de consultar la base.
    await page
      .waitForFunction(() => document.querySelectorAll('main li, main tbody tr').length > 5, {
        timeout: 15000,
      })
      .catch(() => {});

    const data = await inspect(page);
    console.log(`\n${url}\n`);

    let failed = 0;
    for (const check of CHECKS) {
      const ok = check.run(data);
      if (!ok) failed += 1;
      console.log(`  ${ok ? 'OK  ' : 'FALLA'} ${check.name.padEnd(28)} ${check.detail(data)}`);
    }

    console.log(failed ? `\n${failed} comprobación(es) fallan tras el render.` : '\nTodo correcto tras el render.');
    if (failed) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('[verify] error:', err.message);
  process.exit(1);
});
