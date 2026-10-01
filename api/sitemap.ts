import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * Sitemap servido desde la base, no desde el build.
 *
 * /sitemap.xml es un índice; cada trozo lo sirve esta función (`?chunk=`):
 *   - sitemap-core.xml            fichero estático del build (rutas fijas)
 *   - sitemap-calculadora[-N].xml  seo_pages publicadas (Supabase de ESTA web)
 *   - sitemap-biblioteca.xml       hubs indexables de la Biblioteca (Supabase de la APP)
 *   - sitemap-materiales[-N].xml   fichas /d/<id> de materiales activos (Supabase de la APP)
 *
 * Publicar o retirar una página se refleja sin redesplegar. Troceado a 5.000 URLs
 * (el estándar permite 50.000; trozos pequeños = respuestas rápidas y baratas).
 *
 * Solo se lista lo que la base marca indexable: la misma bandera que decide el
 * `robots` de cada página. Un sitemap que lista URLs con noindex es un error en
 * Search Console y gasta presupuesto de rastreo.
 */

const SITE_URL = 'https://www.unicali.app';
const CHUNK_SIZE = 5000;

const WEB_SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const WEB_SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
// Proyecto de la APP: valores públicos por diseño (ver api/material.ts).
const APP_SUPABASE_URL =
  process.env.APP_SUPABASE_URL ?? 'https://akxtzpcauoowumglbcdm.supabase.co';
const APP_SUPABASE_KEY =
  process.env.APP_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_gSkc2xjc3eddGvY23OvBrg_glbRRDAW';

const CHUNK = /^(core|calculadora|biblioteca|materiales)(?:-([1-9][0-9]{0,3}))?$/;

const xmlHeaders = {
  'content-type': 'application/xml; charset=utf-8',
  'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

/** Los caracteres no ASCII van percent-encoded, por segmento. */
const absoluteUrl = (routePath: string) =>
  SITE_URL + routePath.split('/').map(encodeURIComponent).join('/');

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function indexXml(chunks: Array<{ loc: string; lastmod?: string }>) {
  const body = chunks
    .map(
      (chunk) =>
        `  <sitemap>\n    <loc>${xmlEscape(chunk.loc)}</loc>` +
        (chunk.lastmod ? `\n    <lastmod>${chunk.lastmod}</lastmod>` : '') +
        `\n  </sitemap>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

// Sin changefreq ni priority: Google los ignora; solo lee <loc> y un <lastmod> fiable.
function urlsetXml(urls: Array<{ path: string; lastmod?: string }>) {
  const body = urls
    .map(
      (url) =>
        `  <url>\n    <loc>${xmlEscape(absoluteUrl(url.path))}</loc>` +
        (url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : '') +
        `\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

class SitemapFailure extends Error {}

const maxDate = (dates: Array<string | undefined>) =>
  dates.reduce<string>((max, d) => (d && d > max ? d : max), '') || undefined;

async function calculatorPages() {
  if (!WEB_SUPABASE_URL || !WEB_SUPABASE_KEY) throw new SitemapFailure('web');
  const db = createClient(WEB_SUPABASE_URL, WEB_SUPABASE_KEY, { auth: { persistSession: false } });
  // RLS ya limita a status = 'published'; el filtro deja explícita la intención.
  const { data, error } = await db
    .from('seo_pages')
    .select('path, updated_at')
    .eq('status', 'published')
    .order('path');
  if (error) throw new SitemapFailure('seo_pages');
  return (data ?? []).map((page) => ({
    path: page.path as string,
    lastmod: String(page.updated_at).slice(0, 10),
  }));
}

const appDb = () => createClient(APP_SUPABASE_URL, APP_SUPABASE_KEY, { auth: { persistSession: false } });

interface HubRow {
  hub_kind: 'program' | 'course';
  university_slug: string;
  program_slug: string;
  course_slug: string | null;
  lastmod: string;
}

async function libraryHubs() {
  const { data, error } = await appDb().rpc('list_public_library_hubs');
  if (error) throw new SitemapFailure('hubs');
  const rows = (data as HubRow[] | null) ?? [];
  const urls = rows.map((r) => ({
    path:
      `/biblioteca/${r.university_slug}/${r.program_slug}` +
      (r.hub_kind === 'course' && r.course_slug ? `/${r.course_slug}` : ''),
    lastmod: r.lastmod,
  }));
  // El hub de universidad existe si alguna de sus escuelas es indexable.
  for (const uni of new Set(rows.map((r) => r.university_slug))) {
    urls.unshift({
      path: `/biblioteca/${uni}`,
      lastmod: maxDate(rows.filter((r) => r.university_slug === uni).map((r) => r.lastmod)) ?? '',
    });
  }
  return urls;
}

async function materialCount(): Promise<number> {
  const { data, error } = await appDb().rpc('count_public_materials');
  if (error) throw new SitemapFailure('count');
  return Number(data ?? 0);
}

async function materialPage(index: number) {
  const { data, error } = await appDb().rpc('list_public_material_sitemap', {
    p_offset: (index - 1) * CHUNK_SIZE,
    p_limit: CHUNK_SIZE,
  });
  if (error) throw new SitemapFailure('materials');
  return ((data as Array<{ public_id: string; slug: string | null; lastmod: string }> | null) ?? []).map(
    (r) => ({ path: `/d/${r.public_id}${r.slug ? `/${r.slug}` : ''}`, lastmod: r.lastmod }),
  );
}

const chunkLoc = (name: string, index: number) =>
  `${SITE_URL}/sitemap-${name}${index > 1 ? `-${index}` : ''}.xml`;

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const rawChunk = request.query.chunk;
  const chunk = Array.isArray(rawChunk) ? rawChunk[0] : rawChunk;

  const send = (body: string) => {
    for (const [name, value] of Object.entries(xmlHeaders)) response.setHeader(name, value);
    return response.status(200).send(body);
  };

  try {
    if (chunk) {
      const match = CHUNK.exec(chunk);
      // 'core' es un fichero estático: si llega aquí, es que no existe.
      if (!match || match[1] === 'core') return response.status(404).send('Not found');
      const [, name, rawIndex] = match;
      const index = rawIndex ? Number(rawIndex) : 1;

      if (name === 'calculadora') {
        const slice = (await calculatorPages()).slice((index - 1) * CHUNK_SIZE, index * CHUNK_SIZE);
        return slice.length ? send(urlsetXml(slice)) : response.status(404).send('Not found');
      }
      if (name === 'biblioteca') {
        if (index > 1) return response.status(404).send('Not found');
        return send(urlsetXml(await libraryHubs()));
      }
      const urls = await materialPage(index);
      return urls.length ? send(urlsetXml(urls)) : response.status(404).send('Not found');
    }

    const [calculator, hubs, materials] = await Promise.all([
      calculatorPages(),
      libraryHubs(),
      materialCount(),
    ]);
    const calcChunks = Math.max(1, Math.ceil(calculator.length / CHUNK_SIZE));
    const materialChunks = Math.ceil(materials / CHUNK_SIZE);
    const calcLatest = maxDate(calculator.map((p) => p.lastmod));
    const hubsLatest = maxDate(hubs.map((h) => h.lastmod));

    return send(
      indexXml([
        { loc: `${SITE_URL}/sitemap-core.xml` },
        ...Array.from({ length: calcChunks }, (_, i) => ({ loc: chunkLoc('calculadora', i + 1), lastmod: calcLatest })),
        ...(hubs.length ? [{ loc: chunkLoc('biblioteca', 1), lastmod: hubsLatest }] : []),
        // Sin lastmod por trozo de materiales: saberlo exigiría leer el trozo entero.
        ...Array.from({ length: materialChunks }, (_, i) => ({ loc: chunkLoc('materiales', i + 1) })),
      ]),
    );
  } catch (error) {
    if (error instanceof SitemapFailure) {
      // Nunca el mensaje de la base hacia fuera. 503: Googlebot reintenta luego.
      response.setHeader('retry-after', '300');
      return response.status(503).send('Sitemap no disponible temporalmente');
    }
    throw error;
  }
}
