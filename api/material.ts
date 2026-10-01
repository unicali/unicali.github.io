import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import shell from './_shell.json' with { type: 'json' };
// Solo tipos (se borran al compilar): el contrato vive junto a quien lo lee.
import type { MaterialPageData } from '../src/lib/materialData.js';
import {
  displayCourseName,
  escapeHtml,
  escapeJson,
  kindLabel as labelForKind,
  truncate,
} from '../src/lib/libraryText.js';

/**
 * Ficha pública de un material de la Biblioteca: /d/[public_id] y /d/[public_id]/[slug].
 *
 * Es el destino de "Compartir" en la app (unicali/unsap). Tres públicos:
 *   · quien recibe el enlace sin la app → ve qué es y cómo abrirlo;
 *   · WhatsApp/Telegram/Facebook → leen el Open Graph para armar la tarjeta;
 *   · Google → indexa la ficha (JSON-LD LearningResource + migas).
 *
 * Mismo patrón que api/seo.ts: render en función + CDN con s-maxage, el HTML
 * reproduce lo que pinta el SPA y los datos viajan incrustados para que React no
 * vuelva a pedirlos. Aquí el servidor construye TODA la vista (títulos, textos,
 * JSON-LD) y el SPA solo la pinta: una única fuente, sin dos copias que deriven.
 *
 * Seguridad: solo la clave publicable y una única RPC, `get_public_material`,
 * que devuelve una lista blanca de columnas y no depende de App Check. Nunca
 * llega aquí el PDF, el uuid ni la clave de R2. Contrato:
 * unsap/docs/architecture/biblioteca-permalinks-2026-09.md
 */

const SITE_URL = 'https://www.unicali.app';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mantra.unsap';
const ANDROID_PACKAGE = 'com.mantra.unsap';
// Debe coincidir con MATERIAL_DATA_ID en src/lib/materialData.ts.
const EMBEDDED_DATA_ID = '__MATERIAL_DATA__';

// Espejo del CHECK academic_materials_public_id_format (base58 × 10). Validar
// antes de consultar ahorra la llamada con basura y no filtra nada.
const PUBLIC_ID = /^[1-9A-HJ-NP-Za-km-z]{10}$/;

// OJO: la Biblioteca vive en el proyecto Supabase de la APP (akxtzpcauoowumglbcdm),
// no en el de esta web (SUPABASE_URL, que guarda mallas, seo_pages y status).
// Por eso estas variables son distintas a las de api/seo.ts. Los valores por
// defecto son la URL y la clave PUBLICABLE de la app —públicas por diseño, ya van
// dentro del APK—; la variable de entorno solo sirve para rotarlas sin commit.
// Nunca pongas aquí una service role key.
const SUPABASE_URL =
  process.env.APP_SUPABASE_URL ?? 'https://akxtzpcauoowumglbcdm.supabase.co';
const SUPABASE_KEY =
  process.env.APP_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_gSkc2xjc3eddGvY23OvBrg_glbRRDAW';

interface PublicMaterialRow {
  public_id: string;
  availability: 'active' | 'removed';
  slug: string | null;
  title: string | null;
  kind: string | null;
  assessment_number: number | null;
  has_solutions: boolean | null;
  academic_period: string | null;
  topic: string | null;
  description: string | null;
  course_name: string | null;
  program_name: string | null;
  download_count: number | null;
  endorsement_count: number | null;
  created_at: string | null;
  uploader_nickname: string | null;
  university_slug: string | null;
  university_short_name: string | null;
  program_slug: string | null;
  course_code: string | null;
  course_slug: string | null;
  course_name_official: string | null;
}

interface RelatedRow {
  public_id: string;
  slug: string | null;
  title: string;
  kind: string | null;
  academic_period: string | null;
  has_solutions: boolean;
}

/**
 * Abre la app si está instalada aunque el App Link no esté verificado (Chrome
 * Android entiende intent://); si no, el navegador sigue al fallback de Play.
 */
const intentUrl = (publicId: string) =>
  `intent://www.unicali.app/d/${publicId}#Intent;scheme=https;package=${ANDROID_PACKAGE};` +
  `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;

function buildPage(
  row: PublicMaterialRow | null,
  publicId: string | null,
  relatedRows: RelatedRow[] = [],
): MaterialPageData {
  if (!row || !publicId) {
    return {
      status: 'not_found',
      publicId,
      canonical: null,
      openInAppUrl: null,
      playStoreUrl: PLAY_STORE_URL,
      head: {
        title: 'Material no encontrado | UniCali',
        description: 'Este enlace de la Biblioteca de UniCali no existe.',
        robots: 'noindex, follow',
      },
      material: null,
      jsonLd: null,
      breadcrumbs: [],
      coursePath: null,
      related: [],
    };
  }

  if (row.availability !== 'active') {
    // 410 + noindex: Google desindexa más rápido que con 404 y no insiste.
    return {
      status: 'removed',
      publicId,
      canonical: null,
      openInAppUrl: null,
      playStoreUrl: PLAY_STORE_URL,
      head: {
        title: 'Material retirado | UniCali',
        description: 'Este material ya no está disponible en la Biblioteca de UniCali.',
        robots: 'noindex, follow',
      },
      material: null,
      jsonLd: null,
      breadcrumbs: [],
      coursePath: null,
      related: [],
    };
  }

  const kindLabel = labelForKind(row.kind);
  const title = row.title ?? kindLabel;
  // El nombre de la malla oficial manda; el texto libre del autor es el respaldo.
  const courseName = displayCourseName(row.course_name_official ?? row.course_name);
  const uniPath = row.university_slug ? `/biblioteca/${row.university_slug}` : null;
  const programPath = uniPath && row.program_slug ? `${uniPath}/${row.program_slug}` : null;
  const coursePath = programPath && row.course_slug ? `${programPath}/${row.course_slug}` : null;
  const breadcrumbs = [
    { name: 'Inicio', path: '/' },
    { name: 'Biblioteca', path: '/biblioteca' },
    ...(uniPath ? [{ name: row.university_short_name ?? 'UNSA', path: uniPath }] : []),
    ...(programPath && row.program_name ? [{ name: row.program_name, path: programPath }] : []),
    ...(coursePath ? [{ name: courseName, path: coursePath }] : []),
    { name: title, path: null },
  ];
  const canonical = `${SITE_URL}/d/${publicId}${row.slug ? `/${row.slug}` : ''}`;
  const downloads = Number(row.download_count ?? 0);
  const endorsements = Number(row.endorsement_count ?? 0);

  const shortUni = row.university_short_name ?? '';
  const pageTitle =
    truncate(`${title} · ${courseName}${shortUni ? ` ${shortUni}` : ''}`, 60) + ' | UniCali';
  const description = truncate(
    [
      `${kindLabel} de ${courseName}` +
        (row.academic_period ? ` (${row.academic_period})` : '') +
        (row.uploader_nickname ? `, compartido por ${row.uploader_nickname}` : '') +
        ' en la Biblioteca de UniCali.',
      row.has_solutions ? 'Incluye solucionario.' : '',
      downloads > 0 ? `${downloads} estudiantes ya lo descargaron.` : '',
      'Ábrelo gratis en la app.',
    ]
      .filter(Boolean)
      .join(' '),
    158,
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${canonical}#recurso`,
        name: title,
        url: canonical,
        learningResourceType: kindLabel,
        educationalLevel: 'Universitario',
        inLanguage: 'es-PE',
        about: courseName ? { '@type': 'Thing', name: courseName } : undefined,
        isPartOf: coursePath
          ? { '@type': 'CollectionPage', url: SITE_URL + coursePath, name: courseName }
          : undefined,
        teaches: row.topic ?? undefined,
        description: row.description ?? undefined,
        dateCreated: row.created_at ?? undefined,
        author: row.uploader_nickname
          ? { '@type': 'Person', name: row.uploader_nickname }
          : undefined,
        publisher: { '@type': 'Organization', name: 'UniCali', url: SITE_URL },
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/DownloadAction',
          userInteractionCount: downloads,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: crumb.path ? SITE_URL + crumb.path : canonical,
        })),
      },
    ],
  };

  return {
    status: 'ok',
    publicId,
    canonical,
    openInAppUrl: intentUrl(publicId),
    playStoreUrl: PLAY_STORE_URL,
    head: { title: pageTitle, description, robots: 'index, follow' },
    material: {
      title,
      kindLabel,
      courseName,
      programName: row.program_name,
      academicPeriod: row.academic_period,
      topic: row.topic,
      description: row.description,
      hasSolutions: Boolean(row.has_solutions),
      downloads,
      endorsements,
      createdAt: row.created_at,
      uploaderNickname: row.uploader_nickname,
    },
    jsonLd,
    breadcrumbs,
    coursePath,
    related: relatedRows
      .filter((r) => r.public_id !== publicId)
      .slice(0, 6)
      .map((r) => ({
        path: `/d/${r.public_id}${r.slug ? `/${r.slug}` : ''}`,
        title: r.title,
        meta: [labelForKind(r.kind), r.academic_period, r.has_solutions ? 'con solucionario' : null]
          .filter(Boolean)
          .join(' · '),
      })),
  };
}

function buildHead(page: MaterialPageData) {
  const { title, description, robots } = page.head;
  const tags = [
    `<title data-prerendered="true">${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" data-prerendered="true">`,
    `<meta name="robots" content="${robots}" data-prerendered="true">`,
  ];
  if (page.canonical) {
    tags.push(
      `<link rel="canonical" href="${escapeHtml(page.canonical)}" data-prerendered="true">`,
      `<meta property="og:title" content="${escapeHtml(title)}" data-prerendered="true">`,
      `<meta property="og:description" content="${escapeHtml(description)}" data-prerendered="true">`,
      `<meta property="og:url" content="${escapeHtml(page.canonical)}" data-prerendered="true">`,
      `<meta property="og:type" content="article" data-prerendered="true">`,
      `<meta property="og:site_name" content="UniCali" data-prerendered="true">`,
      `<meta property="og:locale" content="es_PE" data-prerendered="true">`,
      `<meta property="og:image" content="${SITE_URL}/og-image.png" data-prerendered="true">`,
      `<meta name="twitter:card" content="summary_large_image" data-prerendered="true">`,
    );
  }
  if (page.jsonLd) {
    tags.push(
      `<script type="application/ld+json" data-prerendered="true">${escapeJson(page.jsonLd)}</script>`,
    );
  }
  return tags.join('\n    ');
}

/** HTML visible antes de que React monte; debe decir lo mismo que el componente. */
function buildBody(page: MaterialPageData) {
  const m = page.material;
  if (!m) {
    const heading =
      page.status === 'removed' ? 'Este material fue retirado' : 'No encontramos este material';
    return (
      `<article class="section-hero"><div class="container">` +
      `<h1>${heading}</h1>` +
      `<p>Explora la Biblioteca de UniCali en la app: apuntes, exámenes y más de tu escuela.</p>` +
      `<p><a href="${PLAY_STORE_URL}" rel="noopener">Descargar UniCali</a></p>` +
      `</div></article>`
    );
  }
  const facts = [
    m.academicPeriod ? `<dt>Periodo</dt><dd>${escapeHtml(m.academicPeriod)}</dd>` : '',
    m.programName ? `<dt>Escuela</dt><dd>${escapeHtml(m.programName)}</dd>` : '',
    m.topic ? `<dt>Tema</dt><dd>${escapeHtml(m.topic)}</dd>` : '',
    m.uploaderNickname ? `<dt>Compartido por</dt><dd>${escapeHtml(m.uploaderNickname)}</dd>` : '',
    `<dt>Descargas</dt><dd>${m.downloads}</dd>`,
  ].join('');
  return (
    `<article class="section-hero"><div class="container">` +
    `<nav aria-label="Migas de pan">${page.breadcrumbs
      .map((c) => (c.path ? `<a href="${escapeHtml(c.path)}">${escapeHtml(c.name)}</a>` : escapeHtml(c.name)))
      .join(' / ')}</nav>` +
    `<span class="meta-label">${escapeHtml(m.kindLabel)}${m.hasSolutions ? ' · Con solucionario' : ''}</span>` +
    `<h1>${escapeHtml(m.title)}</h1>` +
    `<p>${escapeHtml(m.courseName)}</p>` +
    (m.description ? `<p>${escapeHtml(m.description)}</p>` : '') +
    `<dl>${facts}</dl>` +
    `<p><a href="${escapeHtml(page.openInAppUrl ?? PLAY_STORE_URL)}">Abrir en UniCali</a> · ` +
    `<a href="${PLAY_STORE_URL}" rel="noopener">Descargar la app</a></p>` +
    (page.related.length
      ? `<h2>Más materiales de ${escapeHtml(m.courseName)}</h2><ul>${page.related
          .map((r) => `<li><a href="${escapeHtml(r.path)}">${escapeHtml(r.title)}</a> · ${escapeHtml(r.meta)}</li>`)
          .join('')}</ul>`
      : '') +
    (page.coursePath
      ? `<p><a href="${escapeHtml(page.coursePath)}">Ver todos los materiales de ${escapeHtml(m.courseName)}</a></p>`
      : '') +
    `</div></article>`
  );
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // La reescritura de vercel.json es /d/:pid(/:slug); el slug es decorativo y se
  // ignora: el id decide. Así un título editado no rompe enlaces ya compartidos.
  const raw = request.query.pid;
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  const publicId = candidate && PUBLIC_ID.test(candidate) ? candidate : null;

  let row: PublicMaterialRow | null = null;
  if (publicId) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      // Falta configuración: 500 honesto, no un 404 que Google memorizaría.
      return response.status(500).send('Supabase no configurado');
    }
    const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
    const { data, error } = await db.rpc('get_public_material', { p_public_id: publicId });
    if (error) {
      // Un fallo de la base no es "no existe": 503 para que el CDN y Google reintenten.
      response.setHeader('retry-after', '60');
      return response.status(503).send('Servicio no disponible');
    }
    row = ((data as PublicMaterialRow[] | null) ?? [])[0] ?? null;
  }

  // Enlazado lateral: otros materiales del mismo curso. Es un extra: si falla,
  // la ficha sale igual (sin la lista), nunca con error.
  let related: RelatedRow[] = [];
  if (row?.availability === 'active' && row.university_slug && row.program_slug && row.course_code) {
    const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
    const { data } = await db.rpc('get_public_library_course', {
      p_university_slug: row.university_slug,
      p_program_slug: row.program_slug,
      p_course_code: row.course_code,
      p_limit: 7,
      p_offset: 0,
    });
    related = (data as RelatedRow[] | null) ?? [];
  }

  const page = buildPage(row, publicId, related);

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
    // Contadores (descargas) pueden ir una hora atrasados; a cambio la ficha se
    // sirve desde el CDN. Un material retirado deja de verse en ≤ 1 h.
    response.setHeader('cache-control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return response.status(200).send(html);
  }
  response.setHeader('cache-control', 'public, s-maxage=300');
  response.setHeader('x-robots-tag', 'noindex');
  return response.status(page.status === 'removed' ? 410 : 404).send(html);
}
