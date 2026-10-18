import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import shell from './_shell.json' with { type: 'json' };
import type { WallPostPageData } from '../src/lib/wallData.js';
import { escapeHtml, escapeJson } from '../src/lib/libraryText.js';
import {
  PLAY_STORE_URL,
  SITE_URL,
  excerpt,
  formatDateEs,
  intentUrl,
  postPath,
  postingJsonLd,
  toWallCard,
  type PublicPostRow,
} from '../src/lib/wallView.js';

/**
 * Página pública de una publicación del Muro: /p/[public_id].
 *
 * Modelo de X sin sesión: el post, su autor (o «Anónimo»), medios, conteos y
 * fecha. Los comentarios NO salen: los escribieron otras personas dentro del
 * campus. Tampoco el lugar (Campus Vivo): un lugar con hora pública es un
 * riesgo de acecho.
 *
 * Datos: una sola RPC anónima del proyecto Supabase de la APP,
 * `get_public_post`, con lista blanca de columnas. Contrato:
 * unsap/docs/architecture/muro-publico-2026-10.md
 */

const EMBEDDED_DATA_ID = '__WALL_POST_DATA__'; // = WALL_POST_DATA_ID en src/lib/wallData.ts
const PUBLIC_ID = /^[1-9A-HJ-NP-Za-km-z]{10}$/;

// Proyecto de la APP: valores públicos por diseño (van en el APK). Ver api/material.ts.
const APP_SUPABASE_URL = process.env.APP_SUPABASE_URL ?? 'https://akxtzpcauoowumglbcdm.supabase.co';
const APP_SUPABASE_KEY =
  process.env.APP_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_gSkc2xjc3eddGvY23OvBrg_glbRRDAW';

interface PostRow extends PublicPostRow {
  availability: 'active' | 'removed';
  community_slug: string | null;
  community_name: string | null;
  community_kind: 'university' | 'program' | null;
  university_slug: string | null;
  university_short_name: string | null;
}

function gone(status: 'removed' | 'not_found'): WallPostPageData {
  return {
    status,
    head: {
      title: status === 'removed' ? 'Publicación eliminada | UniCali' : 'Publicación no encontrada | UniCali',
      description:
        status === 'removed'
          ? 'Esta publicación del Muro de UniCali fue eliminada.'
          : 'Esta publicación no existe o no es pública.',
      robots: 'noindex, follow',
    },
    canonical: null,
    breadcrumbs: [{ name: 'Inicio', path: '/' }, { name: 'Muro', path: '/muro' }],
    post: null,
    openInAppUrl: null,
    playStoreUrl: PLAY_STORE_URL,
    jsonLd: null,
  };
}

function buildPage(row: PostRow): WallPostPageData {
  const card = toWallCard(row);
  const canonical = SITE_URL + postPath(row.public_id);
  const uniPath = row.university_slug ? `/muro/${row.university_slug}` : '/muro';
  const communityPath =
    row.community_kind === 'program' && row.community_slug ? `${uniPath}/${row.community_slug}` : uniPath;
  const communityName =
    row.community_kind === 'program'
      ? row.community_name ?? 'Muro'
      : `Muro de la ${row.university_short_name ?? 'UNSA'}`;

  const snippet = excerpt(card.text, 70);
  // Como X: «Autor en UniCali: "texto"». Funciona para Google y para la tarjeta de WhatsApp.
  const title = `${card.authorName} en UniCali: “${snippet || 'Publicación'}”`;
  const description = excerpt(
    card.text || `${card.isAnonymous ? 'Confesión' : 'Publicación'} en el Muro de UniCali`,
    158,
  );

  const breadcrumbs = [
    { name: 'Inicio', path: '/' },
    { name: 'Muro', path: '/muro' },
    { name: row.university_short_name ?? 'UNSA', path: uniPath },
    ...(row.community_kind === 'program' && row.community_name
      ? [{ name: row.community_name, path: communityPath }]
      : []),
    { name: card.isAnonymous ? 'Confesión' : `Publicación de ${card.authorName}`, path: null },
  ];

  return {
    status: 'ok',
    head: {
      title: excerpt(title, 90),
      description,
      // `indexable` lo decide la base: elegibilidad (contenido propio) y menos de
      // N denunciantes distintos. La misma bandera filtra el sitemap.
      robots: row.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    },
    canonical,
    breadcrumbs,
    post: { ...card, community: { name: communityName, path: communityPath } },
    openInAppUrl: intentUrl(postPath(row.public_id)),
    playStoreUrl: PLAY_STORE_URL,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        postingJsonLd(card, canonical, SITE_URL + communityPath),
        {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: c.path ? SITE_URL + c.path : canonical,
          })),
        },
      ],
    },
  };
}

function buildHead(page: WallPostPageData) {
  const { title, description, robots } = page.head;
  const tags = [
    `<title data-prerendered="true">${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" data-prerendered="true">`,
    `<meta name="robots" content="${robots}" data-prerendered="true">`,
  ];
  const post = page.post;
  if (page.canonical && post) {
    // Imagen del propio post para la tarjeta; si no tiene, la genérica del sitio.
    const image = post.media[0]?.thumb ?? `${SITE_URL}/og-image.png`;
    tags.push(
      `<link rel="canonical" href="${escapeHtml(page.canonical)}" data-prerendered="true">`,
      `<meta property="og:type" content="article" data-prerendered="true">`,
      `<meta property="og:title" content="${escapeHtml(title)}" data-prerendered="true">`,
      `<meta property="og:description" content="${escapeHtml(description)}" data-prerendered="true">`,
      `<meta property="og:url" content="${escapeHtml(page.canonical)}" data-prerendered="true">`,
      `<meta property="og:site_name" content="UniCali" data-prerendered="true">`,
      `<meta property="og:locale" content="es_PE" data-prerendered="true">`,
      `<meta property="og:image" content="${escapeHtml(image)}" data-prerendered="true">`,
      ...(post.media[0]?.alt
        ? [`<meta property="og:image:alt" content="${escapeHtml(post.media[0].alt)}" data-prerendered="true">`]
        : []),
      ...(post.publishedAt
        ? [`<meta property="article:published_time" content="${escapeHtml(post.publishedAt)}" data-prerendered="true">`]
        : []),
      `<meta name="twitter:card" content="${post.media.length ? 'summary_large_image' : 'summary'}" data-prerendered="true">`,
    );
  }
  if (page.jsonLd) {
    tags.push(`<script type="application/ld+json" data-prerendered="true">${escapeJson(page.jsonLd)}</script>`);
  }
  return tags.join('\n    ');
}

/** HTML previo a React; dice lo mismo que WallPost.tsx (Google renderiza ambos). */
function buildBody(page: WallPostPageData) {
  const crumbs = page.breadcrumbs
    .map((c) => (c.path ? `<a href="${escapeHtml(c.path)}">${escapeHtml(c.name)}</a>` : escapeHtml(c.name)))
    .join(' / ');
  const p = page.post;
  if (!p) {
    return (
      `<article class="section-hero"><div class="container"><nav aria-label="Migas de pan">${crumbs}</nav>` +
      `<h1>${page.status === 'removed' ? 'Esta publicación fue eliminada' : 'No encontramos esta publicación'}</h1>` +
      `<p><a href="/muro">Ver el Muro de UniCali</a> · <a href="${PLAY_STORE_URL}" rel="noopener">Descargar la app</a></p>` +
      `</div></article>`
    );
  }
  const media = p.media
    .map((m) =>
      m.kind === 'video' && m.url
        ? `<video controls preload="none" playsinline poster="${escapeHtml(m.thumb)}" src="${escapeHtml(m.url)}"></video>`
        : `<img src="${escapeHtml(m.url ?? m.thumb)}" alt="${escapeHtml(m.alt ?? '')}" loading="lazy">`,
    )
    .join('');
  return (
    `<article class="section-hero"><div class="container">` +
    `<nav aria-label="Migas de pan">${crumbs}</nav>` +
    `<h1>${escapeHtml(p.authorName)}${p.verified ? ' ✓' : ''}</h1>` +
    `<p style="white-space:pre-wrap">${escapeHtml(p.text)}</p>` +
    media +
    `<p>${escapeHtml(formatDateEs(p.publishedAt))} · ${p.likes} me gusta · ${p.comments} comentarios · ` +
    `<a href="${escapeHtml(p.community.path)}">${escapeHtml(p.community.name)}</a></p>` +
    `<p><a href="${escapeHtml(page.openInAppUrl ?? PLAY_STORE_URL)}">Ver comentarios en UniCali</a></p>` +
    `</div></article>`
  );
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const raw = request.query.pid;
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  const publicId = candidate && PUBLIC_ID.test(candidate) ? candidate : null;

  let page: WallPostPageData = gone('not_found');
  if (publicId) {
    const db = createClient(APP_SUPABASE_URL, APP_SUPABASE_KEY, { auth: { persistSession: false } });
    const { data, error } = await db.rpc('get_public_post', { p_public_id: publicId });
    if (error) {
      // Un fallo de la base no es "no existe": 503 para que el CDN y Google reintenten.
      response.setHeader('retry-after', '60');
      return response.status(503).send('Servicio no disponible');
    }
    const row = ((data as PostRow[] | null) ?? [])[0];
    if (row?.availability === 'active') page = buildPage(row);
    else if (row?.availability === 'removed') page = gone('removed');
  }

  let html = shell.html;
  html = html.replace(/<title>[\s\S]*?<\/title>\s*/, '');
  html = html.replace('</head>', `  ${buildHead(page)}\n  </head>`);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${buildBody(page)}</div>\n` +
      `<script type="application/json" id="${EMBEDDED_DATA_ID}">${escapeJson(page)}</script>`,
  );

  response.setHeader('content-type', 'text/html; charset=utf-8');
  if (page.status === 'ok') {
    // Los conteos pueden ir ≤ 10 min atrasados; a cambio la página se sirve del
    // CDN. Una identidad diferida revelada se refleja en el mismo plazo.
    response.setHeader('cache-control', 'public, s-maxage=600, stale-while-revalidate=3600');
    return response.status(200).send(html);
  }
  response.setHeader('cache-control', 'public, s-maxage=300');
  response.setHeader('x-robots-tag', 'noindex');
  return response.status(page.status === 'removed' ? 410 : 404).send(html);
}

