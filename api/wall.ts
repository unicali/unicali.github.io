import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import shell from './_shell.json' with { type: 'json' };
import type { WallCrumb, WallHubPageData } from '../src/lib/wallData.js';
import { escapeHtml, escapeJson, truncate } from '../src/lib/libraryText.js';
import {
  PLAY_STORE_URL,
  SITE_URL,
  excerpt,
  formatDateEs,
  toWallCard,
  type PublicPostRow,
} from '../src/lib/wallView.js';

/**
 * Hubs del Muro público: /muro, /muro/[uni], /muro/[uni]/[comunidad].
 *
 * La URL jerárquica es una vía de DESCUBRIMIENTO, no la identidad del post
 * (que es /p/<id>, como en X y Reddit). La comunidad es la que el autor ELIGIÓ
 * al publicar, nunca su carrera: un hub construido con la carrera del autor
 * publicaría la escuela de quien escribe cada confesión.
 *
 * Paginación por keyset (`?antes=<public_id>`): los posts nuevos no desplazan
 * las páginas siguientes (con OFFSET, un post nuevo duplicaba uno entre página
 * 1 y 2). La página 1 es la indexable; las de cursor van `noindex, follow`
 * porque los posts ya llegan a Google por el sitemap.
 *
 * Contrato: unsap/docs/architecture/muro-publico-2026-10.md
 */

const EMBEDDED_DATA_ID = '__WALL_HUB_DATA__'; // = WALL_HUB_DATA_ID en src/lib/wallData.ts
const PAGE_SIZE = 30;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PUBLIC_ID = /^[1-9A-HJ-NP-Za-km-z]{10}$/;

const APP_SUPABASE_URL = process.env.APP_SUPABASE_URL ?? 'https://akxtzpcauoowumglbcdm.supabase.co';
const APP_SUPABASE_KEY =
  process.env.APP_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_gSkc2xjc3eddGvY23OvBrg_glbRRDAW';

interface HubRow {
  community_kind: 'university' | 'program';
  university_slug: string;
  university_short_name: string;
  community_slug: string | null;
  community_name: string;
  post_count: number;
  indexable_post_count: number;
  lastmod: string;
  hub_indexable: boolean;
}

class RpcFailure extends Error {}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

async function rpc<T>(db: SupabaseClient, fn: string, args: Record<string, unknown> = {}): Promise<T[]> {
  const { data, error } = await db.rpc(fn, args);
  if (error) throw new RpcFailure(error.code ?? 'rpc');
  return (data as T[] | null) ?? [];
}

function notFound(): WallHubPageData {
  return {
    kind: 'not_found',
    head: {
      title: 'Muro no encontrado | UniCali',
      description: 'Esta sección del Muro de UniCali no existe o aún no tiene publicaciones.',
      robots: 'noindex, follow',
    },
    canonical: null,
    breadcrumbs: [{ name: 'Inicio', path: '/' }, { name: 'Muro', path: '/muro' }],
    heading: 'Aún no hay publicaciones aquí',
    intro: 'Sé el primero: publica desde la app UniCali.',
    posts: [],
    children: [],
    nextPath: null,
    playStoreUrl: PLAY_STORE_URL,
    jsonLd: null,
  };
}

function buildHub(
  hub: HubRow,
  children: HubRow[],
  rows: PublicPostRow[],
  basePath: string,
  cursor: string | null,
): WallHubPageData {
  const isUniversity = hub.community_kind === 'university';
  const hasMore = rows.length > PAGE_SIZE;
  const pageRows = rows.slice(0, PAGE_SIZE);
  const posts = pageRows.map(toWallCard);
  const last = pageRows[pageRows.length - 1];
  const selfPath = cursor ? `${basePath}?antes=${cursor}` : basePath;

  const crumbs: WallCrumb[] = [
    { name: 'Inicio', path: '/' },
    { name: 'Muro', path: '/muro' },
    { name: hub.university_short_name, path: `/muro/${hub.university_slug}` },
    ...(isUniversity ? [] : [{ name: hub.community_name, path: basePath }]),
  ];

  const name = isUniversity ? `la ${hub.university_short_name}` : `${hub.community_name} (${hub.university_short_name})`;
  const heading = isUniversity ? `Muro de la ${hub.university_short_name}` : `Muro de ${hub.community_name}`;
  const title = truncate(`${heading}: lo que dicen los estudiantes`, 60) + ' | UniCali';
  const description = truncate(
    `${hub.post_count} publicaciones y confesiones de estudiantes de ${name} en UniCali. ` +
      (posts[0] ? `Lo último: “${excerpt(posts[0].text, 70)}”.` : ''),
    158,
  );

  return {
    kind: isUniversity ? 'university' : 'program',
    head: {
      title: cursor ? `${title} · anteriores` : title,
      description,
      robots: hub.hub_indexable && !cursor ? 'index, follow' : 'noindex, follow',
    },
    canonical: SITE_URL + selfPath,
    breadcrumbs: crumbs,
    heading,
    intro: isUniversity
      ? `Publicaciones del campus de la ${hub.university_short_name}. Lo anónimo aparece como «Anónimo»: ` +
        'el autor elige qué firma.'
      : `Publicaciones que sus autores dirigieron a ${hub.community_name}.`,
    posts,
    children: isUniversity
      ? children.map((c) => ({
          path: `/muro/${c.university_slug}/${c.community_slug}`,
          label: c.community_name,
          meta: `${c.post_count} publicaciones`,
        }))
      : [],
    nextPath: hasMore && last ? `${basePath}?antes=${last.public_id}` : null,
    playStoreUrl: PLAY_STORE_URL,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: heading,
          url: SITE_URL + selfPath,
          inLanguage: 'es-PE',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: posts.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: SITE_URL + p.path,
            })),
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: crumbs.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            ...(c.path ? { item: SITE_URL + c.path } : {}),
          })),
        },
      ],
    },
  };
}

function buildHead(page: WallHubPageData) {
  const { title, description, robots } = page.head;
  const tags = [
    `<title data-prerendered="true">${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" data-prerendered="true">`,
    `<meta name="robots" content="${robots}" data-prerendered="true">`,
  ];
  if (page.canonical) {
    tags.push(
      `<link rel="canonical" href="${escapeHtml(page.canonical)}" data-prerendered="true">`,
      `<meta property="og:type" content="website" data-prerendered="true">`,
      `<meta property="og:title" content="${escapeHtml(title)}" data-prerendered="true">`,
      `<meta property="og:description" content="${escapeHtml(description)}" data-prerendered="true">`,
      `<meta property="og:url" content="${escapeHtml(page.canonical)}" data-prerendered="true">`,
      `<meta property="og:site_name" content="UniCali" data-prerendered="true">`,
      `<meta property="og:image" content="${SITE_URL}/og-image.png" data-prerendered="true">`,
      `<meta name="twitter:card" content="summary_large_image" data-prerendered="true">`,
    );
  }
  if (page.jsonLd) {
    tags.push(`<script type="application/ld+json" data-prerendered="true">${escapeJson(page.jsonLd)}</script>`);
  }
  return tags.join('\n    ');
}

function buildBody(page: WallHubPageData) {
  const crumbs = page.breadcrumbs
    .map((c) => (c.path ? `<a href="${escapeHtml(c.path)}">${escapeHtml(c.name)}</a>` : escapeHtml(c.name)))
    .join(' / ');
  const posts = page.posts
    .map(
      (p) =>
        `<li><a href="${escapeHtml(p.path)}"><strong>${escapeHtml(p.authorName)}</strong>: ` +
        `${escapeHtml(excerpt(p.text, 200))}</a> · ${escapeHtml(formatDateEs(p.publishedAt))}</li>`,
    )
    .join('');
  const children = page.children.length
    ? `<h2>Escuelas</h2><ul>${page.children
        .map((c) => `<li><a href="${escapeHtml(c.path)}">${escapeHtml(c.label)}</a> · ${escapeHtml(c.meta)}</li>`)
        .join('')}</ul>`
    : '';
  return (
    `<article class="section-hero"><div class="container">` +
    `<nav aria-label="Migas de pan">${crumbs}</nav>` +
    `<h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.intro)}</p>` +
    (posts ? `<ul>${posts}</ul>` : '') +
    (page.nextPath ? `<p><a href="${escapeHtml(page.nextPath)}">Publicaciones anteriores</a></p>` : '') +
    children +
    `<p><a href="${PLAY_STORE_URL}" rel="noopener">Descarga UniCali</a> para comentar y publicar.</p>` +
    `</div></article>`
  );
}

function send(response: VercelResponse, page: WallHubPageData, status: number) {
  let html = shell.html;
  html = html.replace(/<title>[\s\S]*?<\/title>\s*/, '');
  html = html.replace('</head>', `  ${buildHead(page)}\n  </head>`);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${buildBody(page)}</div>\n` +
      `<script type="application/json" id="${EMBEDDED_DATA_ID}">${escapeJson(page)}</script>`,
  );
  response.setHeader('content-type', 'text/html; charset=utf-8');
  if (status === 200) {
    response.setHeader('cache-control', 'public, s-maxage=300, stale-while-revalidate=3600');
  } else {
    response.setHeader('cache-control', 'public, s-maxage=300');
    response.setHeader('x-robots-tag', 'noindex');
  }
  return response.status(status).send(html);
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const uni = one(request.query.uni);
  const community = one(request.query.community);
  const cursor = one(request.query.antes) ?? null;

  if (
    [uni, community].some((s) => s !== undefined && (!SLUG.test(s) || s.length > 100)) ||
    (cursor !== null && !PUBLIC_ID.test(cursor))
  ) {
    return send(response, notFound(), 404);
  }

  const db = createClient(APP_SUPABASE_URL, APP_SUPABASE_KEY, { auth: { persistSession: false } });

  try {
    const hubs = await rpc<HubRow>(db, 'list_public_wall_hubs');

    if (!uni) {
      const universities = hubs.filter((h) => h.community_kind === 'university');
      if (universities.length === 1) {
        // Con una sola universidad, /muro y /muro/unsa serían la misma página.
        response.setHeader('cache-control', 'public, s-maxage=3600');
        return response.redirect(308, `/muro/${universities[0].university_slug}`);
      }
      // Varias universidades: el índice llegará con la segunda (documentado).
      return send(response, notFound(), 404);
    }

    const hub = hubs.find((h) =>
      community
        ? h.community_kind === 'program' && h.university_slug === uni && h.community_slug === community
        : h.community_kind === 'university' && h.university_slug === uni,
    );
    if (!hub) return send(response, notFound(), 404);

    const rows = await rpc<PublicPostRow>(db, 'get_public_wall_community', {
      p_university_slug: uni,
      p_community_slug: community ?? null,
      p_limit: PAGE_SIZE,
      p_before: cursor,
    });
    if (!rows.length) return send(response, notFound(), 404);

    const basePath = community ? `/muro/${uni}/${community}` : `/muro/${uni}`;
    const children = hubs.filter((h) => h.community_kind === 'program' && h.university_slug === uni);
    return send(response, buildHub(hub, children, rows, basePath, cursor), 200);
  } catch (error) {
    if (error instanceof RpcFailure) {
      response.setHeader('retry-after', '60');
      return response.status(503).send('Servicio no disponible');
    }
    throw error;
  }
}
