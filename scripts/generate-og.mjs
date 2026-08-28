// Genera dist/og-image.png, la tarjeta que se ve al compartir el sitio.
//
// El fichero se referencia desde el <Helmet> de ~9 páginas (og:image y
// twitter:image) pero nunca existió, así que todas las vistas previas sociales
// salían rotas. Se dibuja con el mismo Chrome que ya usa el prerender, con la
// paleta y las tipografías de src/index.css, para no depender de un binario de
// diseño ni de un asset commiteado que se desactualiza.
//
// Tamaño 1200x630: la proporción que piden Open Graph y Twitter summary_large_image.
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { resolveBrowserOptions } from './lib/browser.mjs';

const DIST = path.resolve(process.cwd(), 'dist');
const WIDTH = 1200;
const HEIGHT = 630;

const card = () => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400&family=Inter:wght@300;400;500&display=swap">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${WIDTH}px;height:${HEIGHT}px;background:#f2efe7;color:#1a1a1a;
       font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column;
       justify-content:center;gap:34px;padding:88px 100px;position:relative;overflow:hidden}
  .accent{position:absolute;top:0;left:0;width:14px;height:100%;background:#8b004a}
  .halo{position:absolute;right:-180px;bottom:-260px;width:640px;height:640px;border-radius:50%;
        background:radial-gradient(circle,rgba(139,0,74,0.13),rgba(139,0,74,0) 70%)}
  .label{font-size:20px;letter-spacing:0.5em;text-transform:uppercase;color:#8b004a;font-weight:400}
  h1{font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-weight:400;
     font-size:86px;line-height:1.06;letter-spacing:-0.02em;max-width:14ch}
  p{font-size:27px;color:#666;font-weight:300;max-width:34ch;line-height:1.5}
  .foot{display:flex;align-items:baseline;gap:22px;margin-top:22px;
        border-top:1px solid rgba(139,0,74,0.16);padding-top:30px}
  .brand{font-size:30px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase}
  .url{font-size:23px;color:#666;font-weight:300}
</style></head>
<body>
  <div class="accent"></div><div class="halo"></div>
  <span class="label">UNSA · Arequipa</span>
  <h1>Tu vida universitaria, ordenada</h1>
  <p>Calculadora de notas, guías académicas y herramientas para estudiantes de la UNSA.</p>
  <div class="foot"><span class="brand">UniCali</span><span class="url">unicali.app</span></div>
</body></html>`;

async function main() {
  const browser = await puppeteer.launch(await resolveBrowserOptions());
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
    await page.setContent(card(), { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    const png = await page.screenshot({ type: 'png' });
    await writeFile(path.join(DIST, 'og-image.png'), png);
    console.log(`[og] listo — dist/og-image.png (${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(0)} KB)`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('[og] falló:', err);
  process.exit(1);
});
