// Resolución del ejecutable de Chrome para los pasos de build que usan Puppeteer
// (prerender de rutas y generación de la imagen OG).
//
// El build de Vercel corre en un contenedor Linux minimalista al que le faltan
// librerías del sistema que Chrome necesita para arrancar (ej. libnspr4.so) — el
// Chromium normal de `puppeteer` no levanta ahí ("error while loading shared
// libraries"). @sparticuz/chromium es un build de Chromium empaquetado
// específicamente para entornos serverless (Vercel/Lambda), así que solo se usa
// cuando el build corre en Vercel; en local se reutiliza el Chrome/Edge instalado.
import { existsSync } from 'node:fs';

export async function resolveBrowserOptions() {
  if (process.env.VERCEL) {
    const { default: chromium } = await import('@sparticuz/chromium');
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    };
  }

  // String.raw evita tener que escapar las barras invertidas de Windows: escribir
  // 'C:\Program Files\...' con una sola barra produce secuencias de escape
  // inválidas que JS reduce silenciosamente a "C:Program Files...", una ruta que
  // no existe y que hace fallar el prerender con un mensaje engañoso.
  const candidates = [
    process.env.CHROME_PATH,
    String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`,
    String.raw`C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`,
    String.raw`C:\Program Files\Microsoft\Edge\Application\msedge.exe`,
    String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`,
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
