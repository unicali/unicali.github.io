import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * Sitemap servido desde la base, no desde el build.
 *
 * /sitemap.xml devuelve un índice con dos trozos:
 *   - /sitemap-core.xml       fichero estático generado en el build (rutas fijas)
 *   - /sitemap-calculadora.xml  esta misma función, leyendo seo_pages publicadas
 *
 * Se hace así para que publicar o despublicar una página programática se refleje
 * en el sitemap sin necesidad de redesplegar, que es la razón de haber elegido
 * render bajo demanda en lugar de prerender estático para este clúster.
 *
 * El troceado a 5.000 URLs deja margen de sobra frente al límite de 50.000 del
 * estándar y mantiene cada respuesta pequeña.
 */

const SITE_URL = 'https://www.unicali.app';
const CHUNK_SIZE = 5000;

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const xmlHeaders = {
  'content-type': 'application/xml; charset=utf-8',
  'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

/** Los caracteres no ASCII van percent-encoded, por segmento. */
const absoluteUrl = (routePath: string) =>
  SITE_URL + routePath.split('/').map(encodeURIComponent).join('/');

function indexXml(chunks: Array<{ loc: string; lastmod?: string }>) {
  const body = chunks
    .map(
      (chunk) =>
        `  <sitemap>\n    <loc>${chunk.loc}</loc>` +
        (chunk.lastmod ? `\n    <lastmod>${chunk.lastmod}</lastmod>` : '') +
        `\n  </sitemap>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

function urlsetXml(urls: Array<{ path: string; lastmod: string }>) {
  const body = urls
    .map(
      (url) =>
        `  <url>\n    <loc>${absoluteUrl(url.path)}</loc>\n` +
        `    <lastmod>${url.lastmod}</lastmod>\n` +
        `    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return response.status(500).send('Supabase no configurado');
  }

  // Firma Node: request.url es relativa, asi que el parametro se lee de query.
  const rawChunk = request.query.chunk;
  const chunk = Array.isArray(rawChunk) ? rawChunk[0] : rawChunk;
  const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

  // RLS ya limita el select a status = 'published', pero se filtra también aquí
  // para que la intención quede explícita en el código.
  const { data, error } = await db
    .from('seo_pages')
    .select('path, updated_at')
    .eq('status', 'published')
    .order('path');

  if (error) {
    return response.status(500).send(`Error consultando el sitemap: ${error.message}`);
  }

  const pages = (data ?? []).map((page) => ({
    path: page.path,
    lastmod: String(page.updated_at).slice(0, 10),
  }));

  const send = (body: string) => {
    for (const [name, value] of Object.entries(xmlHeaders)) response.setHeader(name, value);
    return response.status(200).send(body);
  };

  if (chunk === 'calculadora') return send(urlsetXml(pages));

  const chunkCount = Math.max(1, Math.ceil(pages.length / CHUNK_SIZE));
  const latest = pages.reduce((max, page) => (page.lastmod > max ? page.lastmod : max), '');

  return send(
    indexXml([
      { loc: `${SITE_URL}/sitemap-core.xml` },
      ...Array.from({ length: chunkCount }, (_, index) => ({
        loc:
          index === 0
            ? `${SITE_URL}/sitemap-calculadora.xml`
            : `${SITE_URL}/sitemap-calculadora-${index + 1}.xml`,
        lastmod: latest || undefined,
      })),
    ]),
  );
}
