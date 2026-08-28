// Genera dist/sitemap-core.xml desde el manifiesto de rutas (src/data/routes.json),
// que es la misma fuente que consumen src/App.tsx y scripts/prerender.mjs.
//
// Sustituye al public/sitemap.xml escrito a mano, que tenía tres defectos:
//   - /status faltaba (estaba prerenderizado pero no publicado),
//   - /reseñas iba en UTF-8 crudo, forma que no acierta el fichero estático en
//     Vercel, así que los crawlers recibían el HTML del home,
//   - todos los lastmod congelados en 2026-07-11.
//
// El lastmod sale de la fecha del último commit que tocó el fichero de la
// página, no de la fecha de build: así solo cambia cuando el contenido cambia.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://www.unicali.app';
const DIST = path.resolve(process.cwd(), 'dist');

const manifest = JSON.parse(readFileSync(new URL('../src/data/routes.json', import.meta.url), 'utf-8'));

// Los caracteres no ASCII van percent-encoded; encodeURIComponent por segmento
// para no destrozar las barras.
const absoluteUrl = (routePath) => SITE_URL + routePath.split('/').map(encodeURIComponent).join('/');

const BUILD_DATE = new Date().toISOString().slice(0, 10);

function lastModified(sourceFile) {
  if (!sourceFile) return BUILD_DATE;
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', sourceFile], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return iso ? iso.slice(0, 10) : BUILD_DATE;
  } catch {
    // Sin git (o fichero sin commits todavía): la fecha de build es suficiente.
    return BUILD_DATE;
  }
}

const entries = manifest.routes
  .filter((r) => r.sitemap)
  .map((r) => ({ ...r, lastmod: lastModified(r.source) }))
  .sort((a, b) => b.sitemap.priority - a.sitemap.priority);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map((r) =>
    [
      '  <url>',
      `    <loc>${absoluteUrl(r.path)}</loc>`,
      `    <lastmod>${r.lastmod}</lastmod>`,
      `    <changefreq>${r.sitemap.changefreq}</changefreq>`,
      `    <priority>${r.sitemap.priority.toFixed(1)}</priority>`,
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n');

// Es un trozo del indice: /sitemap.xml lo sirve api/sitemap.ts, que ademas lista
// el trozo de las paginas programaticas leyendolas de la base. Asi publicar
// contenido nuevo no exige un redeploy para que aparezca en el sitemap.
writeFileSync(path.join(DIST, 'sitemap-core.xml'), xml, 'utf-8');
console.log(`[sitemap] listo — dist/sitemap-core.xml con ${entries.length} URLs`);
