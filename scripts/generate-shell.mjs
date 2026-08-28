// Congela el HTML que produce Vite en api/_shell.json, para que la función de
// render (api/seo.ts) sirva las páginas programáticas con exactamente la misma
// cabecera que las estáticas: mismas fuentes, mismo GA/GTM, mismos assets con
// hash, mismo JSON-LD de sitio.
//
// Sin esto habría que duplicar a mano el <head> dentro de la función, y cada
// cambio en index.html o cada rebuild (que cambia el hash de los assets) dejaría
// las páginas programáticas rotas o desincronizadas en silencio.
//
// IMPORTANTE: corre justo después de `vite build` y ANTES de
// scripts/prerender.mjs, que sobrescribe dist/index.html con el <head> ya
// horneado de la home. Si se ejecutase después, todas las páginas
// programáticas heredarían el title y el canonical de la home.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');
const API = path.resolve(process.cwd(), 'api');

const html = readFileSync(path.join(DIST, 'index.html'), 'utf-8');

// Comprobaciones de forma: si Vite cambia su salida, es mejor romper el build
// que publicar cientos de páginas sin CSS o sin punto de montaje.
const assertContains = (needle, hint) => {
  if (!html.includes(needle)) {
    throw new Error(`[shell] no se encontró ${needle} en dist/index.html — ${hint}`);
  }
};

assertContains('<div id="root">', 'la función necesita un punto de montaje donde inyectar el contenido');
assertContains('</head>', 'la función necesita insertar el meta por ruta antes del cierre de head');

if (html.includes('data-prerendered')) {
  throw new Error(
    '[shell] dist/index.html ya viene prerenderizado. generate-shell debe ejecutarse ' +
      'antes que prerender.mjs, o las páginas programáticas heredarían el meta de la home.',
  );
}

mkdirSync(API, { recursive: true });
writeFileSync(
  path.join(API, '_shell.json'),
  `${JSON.stringify({ html, generatedAt: new Date().toISOString() }, null, 0)}\n`,
  'utf-8',
);

console.log(`[shell] listo — api/_shell.json (${(html.length / 1024).toFixed(1)} KB)`);
