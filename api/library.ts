import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import shell from './_shell.json' with { type: 'json' };
import type {
  Crumb,
  HubSection,
  LibraryPageData,
  MaterialCard,
} from '../src/lib/libraryData.js';
import {
  describeKinds,
  displayCourseName,
  escapeHtml,
  escapeJson,
  kindLabel,
  termLabel,
  truncate,
} from '../src/lib/libraryText.js';

/**
 * Biblioteca pública (arquitectura de hubs tipo Studocu):
 *
 *   /biblioteca                              → índice (redirige a la única universidad)
 *   /biblioteca/[uni]                        → escuelas con materiales
 *   /biblioteca/[uni]/[escuela]              → cursos de la escuela, por año
 *   /biblioteca/[uni]/[escuela]/[curso-cod]  → materiales del curso (paginado)
 *
 * El hub, no la ficha suelta, es la página que posiciona para "exámenes de
 * Microeconomía I UNSA": agrega, enlaza hacia arriba/abajo/al lado y reparte
 * autoridad. Cada nivel solo existe si tiene materiales (404 si no) y solo se
 * indexa si la base lo marca `indexable` — la MISMA bandera que filtra el
 * sitemap, para que nunca listemos una URL con noindex.
 *
 * Datos: RPCs anónimas del proyecto Supabase de la APP (no el de esta web), con
 * lista blanca de columnas. Nunca el PDF. Contrato:
 * unsap/docs/architecture/biblioteca-seo-hubs-2026-10.md
 */

const SITE_URL = 'https://www.unicali.app';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mantra.unsap';
const PAGE_SIZE = 60;

// Proyecto de la APP: valores públicos por diseño (van en el APK). Ver api/material.ts.
const APP_SUPABASE_URL =
  process.env.APP_SUPABASE_URL ?? 'https://akxtzpcauoowumglbcdm.supabase.co';
const APP_SUPABASE_KEY =
  process.env.APP_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_gSkc2xjc3eddGvY23OvBrg_glbRRDAW';
// Proyecto de ESTA web: solo para saber si la escuela tiene calculadora publicada.
const WEB_SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const WEB_SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

interface IndexRow {
  university_slug: string;
  university_short_name: string;
  program_slug: string;
  program_name: string;
  material_count: number;
  course_count: number;
  last_material_at: string;
  indexable: boolean;
}

interface ProgramRow {
  university_slug: string;
  university_short_name: string;
  program_slug: string;
  program_name: string;
  course_code: string;
  course_slug: string;
  course_name: string;
  course_year: number | null;
  course_term: number | null;
  course_credits: number | null;
  is_elective: boolean;
  material_count: number;
  last_material_at: string;
  course_indexable: boolean;
}

interface CourseRow {
  university_slug: string;
  university_short_name: string;
  program_slug: string;
  program_name: string;
  course_code: string;
  course_slug: string;
  course_name: string;
  course_year: number | null;
  course_term: number | null;
  course_credits: number | null;
  is_elective: boolean;
  plan_year: number | null;
  total_count: number;
  indexable: boolean;
  public_id: string;
  slug: string | null;
  title: string;
  kind: string | null;
  academic_period: string | null;
  has_solutions: boolean;
  download_count: number;
  endorsement_count: number;
  created_at: string;
  uploader_nickname: string | null;
}

class RpcFailure extends Error {}

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const materialPath = (publicId: string, slug: string | null) =>
  `/d/${publicId}${slug ? `/${slug}` : ''}`;

async function rpc<T>(db: SupabaseClient, fn: string, args: Record<string, unknown>): Promise<T[]> {
  const { data, error } = await db.rpc(fn, args);
  // Un fallo de la base no es "no existe": se propaga como 503, nunca como 404
  // (Google desindexaría páginas buenas por un corte de minutos).
  if (error) throw new RpcFailure(error.code ?? 'rpc');
  return (data as T[] | null) ?? [];
}

async function hasCalculator(programSlug: string): Promise<boolean> {
  if (!WEB_SUPABASE_URL || !WEB_SUPABASE_KEY) return false;
  try {
    const web = createClient(WEB_SUPABASE_URL, WEB_SUPABASE_KEY, { auth: { persistSession: false } });
    const { data } = await web
      .from('seo_pages')
      .select('path')
      .eq('path', `/calculadora/${programSlug}`)
      .eq('status', 'published')
      .maybeSingle();
    return Boolean(data);
  } catch {
    return false; // el enlace es un extra: su ausencia no rompe la página
  }
}

function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      ...(crumb.path ? { item: SITE_URL + crumb.path } : {}),
    })),
  };
}

function notFound(): LibraryPageData {
  return {
    kind: 'not_found',
    head: {
      title: 'Página no encontrada | Biblioteca UniCali',
      description: 'Esta sección de la Biblioteca de UniCali no existe o aún no tiene materiales.',
      robots: 'noindex, follow',
    },
    canonical: null,
    breadcrumbs: [{ name: 'Inicio', path: '/' }, { name: 'Biblioteca', path: '/biblioteca' }],
    heading: 'Aún no hay materiales aquí',
    intro:
      'Esta sección no existe o todavía nadie subió materiales. Sé el primero: sube tus ' +
      'exámenes y apuntes desde la app UniCali.',
    facts: [],
    materials: [],
    sections: [],
    pagination: null,
    calculatorPath: null,
    playStoreUrl: PLAY_STORE_URL,
    jsonLd: null,
  };
}

function buildUniversity(rows: IndexRow[], uni: string): LibraryPageData | null {
  const programs = rows.filter((r) => r.university_slug === uni);
  if (!programs.length) return null;
  const shortName = programs[0].university_short_name;
  const total = programs.reduce((n, p) => n + Number(p.material_count), 0);
  const path = `/biblioteca/${uni}`;
  const crumbs: Crumb[] = [
    { name: 'Inicio', path: '/' },
    { name: 'Biblioteca', path: '/biblioteca' },
    { name: shortName, path },
  ];
  const title = `Exámenes y apuntes de la ${shortName} por escuela | UniCali`;
  const description = truncate(
    `${total} exámenes, apuntes y materiales de ${programs.length} escuelas de la ${shortName}, ` +
      'compartidos por estudiantes. Encuéntralos por carrera y curso en la Biblioteca de UniCali.',
    158,
  );
  return {
    kind: 'university',
    head: { title, description, robots: programs.some((p) => p.indexable) ? 'index, follow' : 'noindex, follow' },
    canonical: SITE_URL + path,
    breadcrumbs: crumbs,
    heading: `Biblioteca de la ${shortName}`,
    intro:
      `Exámenes, prácticas y apuntes de la ${shortName} que los propios estudiantes comparten ` +
      'en UniCali, ordenados por escuela profesional y curso.',
    facts: [
      { label: 'Materiales', value: String(total) },
      { label: 'Escuelas', value: String(programs.length) },
    ],
    materials: [],
    sections: [
      {
        title: 'Escuelas profesionales',
        links: programs.map((p) => ({
          path: `${path}/${p.program_slug}`,
          label: p.program_name,
          meta: `${p.material_count} materiales · ${p.course_count} cursos`,
        })),
      },
    ],
    pagination: null,
    calculatorPath: null,
    playStoreUrl: PLAY_STORE_URL,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: `Biblioteca de la ${shortName}`,
          url: SITE_URL + path,
          inLanguage: 'es-PE',
          about: { '@type': 'CollegeOrUniversity', name: shortName },
        },
        breadcrumbJsonLd(crumbs),
      ],
    },
  };
}

function buildProgram(rows: ProgramRow[], calculator: boolean): LibraryPageData {
  const first = rows[0];
  const { university_slug: uni, university_short_name: shortName, program_slug: program, program_name: name } = first;
  const path = `/biblioteca/${uni}/${program}`;
  const total = rows.reduce((n, r) => n + Number(r.material_count), 0);
  const crumbs: Crumb[] = [
    { name: 'Inicio', path: '/' },
    { name: 'Biblioteca', path: '/biblioteca' },
    { name: shortName, path: `/biblioteca/${uni}` },
    { name: name, path },
  ];

  // Agrupado por año y semestre de la malla: así lo busca un estudiante.
  const groups = new Map<string, ProgramRow[]>();
  for (const row of rows) {
    const key = row.course_year ? `${row.course_year}-${row.course_term ?? 0}` : 'otros';
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  const sections: HubSection[] = [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, courses]) => {
      const [y, t] = key.split('-').map(Number);
      const label = key === 'otros' ? 'Otros cursos' : termLabel(y, t || null);
      return {
        title: label.charAt(0).toUpperCase() + label.slice(1),
        links: courses.map((c) => ({
          path: `${path}/${c.course_slug}`,
          label: displayCourseName(c.course_name) + (c.is_elective ? ' (electivo)' : ''),
          meta: `${c.material_count} ${Number(c.material_count) === 1 ? 'material' : 'materiales'}`,
        })),
      };
    });

  const indexable = total >= 1 && rows.some((r) => r.course_indexable);
  const title = truncate(`${name} ${shortName}: exámenes y apuntes por curso`, 60) + ' | UniCali';
  const description = truncate(
    `${total} exámenes, prácticas y apuntes de ${rows.length} cursos de ${name} en la ` +
      `${shortName}, compartidos por estudiantes. Ordenados por año de la malla.`,
    158,
  );

  return {
    kind: 'program',
    head: { title, description, robots: indexable ? 'index, follow' : 'noindex, follow' },
    canonical: SITE_URL + path,
    breadcrumbs: crumbs,
    heading: `Biblioteca de ${name} — ${shortName}`,
    intro:
      `Materiales de ${name} que los estudiantes de la ${shortName} comparten en UniCali, ` +
      'ordenados por el año y semestre del plan de estudios.',
    facts: [
      { label: 'Materiales', value: String(total) },
      { label: 'Cursos con material', value: String(rows.length) },
    ],
    materials: [],
    sections,
    pagination: null,
    calculatorPath: calculator ? `/calculadora/${program}` : null,
    playStoreUrl: PLAY_STORE_URL,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: `Biblioteca de ${name} — ${shortName}`,
          url: SITE_URL + path,
          inLanguage: 'es-PE',
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: rows.length,
            itemListElement: rows.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${SITE_URL}${path}/${c.course_slug}`,
              name: displayCourseName(c.course_name),
            })),
          },
        },
        breadcrumbJsonLd(crumbs),
      ],
    },
  };
}

function buildCourse(
  rows: CourseRow[],
  siblings: ProgramRow[],
  page: number,
  calculator: boolean,
): LibraryPageData {
  const c = rows[0];
  const shortName = c.university_short_name;
  const courseName = displayCourseName(c.course_name);
  const programPath = `/biblioteca/${c.university_slug}/${c.program_slug}`;
  const path = `${programPath}/${c.course_slug}`;
  const total = Number(c.total_count);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pagePath = (n: number) => (n <= 1 ? path : `${path}?pagina=${n}`);
  const crumbs: Crumb[] = [
    { name: 'Inicio', path: '/' },
    { name: 'Biblioteca', path: '/biblioteca' },
    { name: shortName, path: `/biblioteca/${c.university_slug}` },
    { name: c.program_name, path: programPath },
    { name: courseName, path },
  ];

  const kinds: Record<string, number> = {};
  const periods = new Set<string>();
  for (const r of rows) {
    kinds[r.kind ?? 'other'] = (kinds[r.kind ?? 'other'] ?? 0) + 1;
    if (r.academic_period) periods.add(r.academic_period);
  }
  const periodList = [...periods].sort().reverse();
  const where = termLabel(c.course_year, c.course_term);

  const materials: MaterialCard[] = rows.map((r) => ({
    path: materialPath(r.public_id, r.slug),
    title: r.title,
    kindLabel: kindLabel(r.kind),
    academicPeriod: r.academic_period,
    hasSolutions: r.has_solutions,
    downloads: Number(r.download_count),
    uploaderNickname: r.uploader_nickname,
  }));

  const facts = [
    { label: 'Materiales', value: String(total) },
    ...(where ? [{ label: 'Ubicación en la malla', value: where.charAt(0).toUpperCase() + where.slice(1) }] : []),
    ...(c.course_credits ? [{ label: 'Créditos', value: String(Number(c.course_credits)) }] : []),
    ...(c.is_elective ? [{ label: 'Tipo', value: 'Electivo' }] : []),
    ...(c.plan_year ? [{ label: 'Plan de estudios', value: String(c.plan_year) }] : []),
    { label: 'Código', value: c.course_code },
  ];

  const others = siblings
    .filter((s) => s.course_code !== c.course_code)
    .sort((a, b) => Number(b.material_count) - Number(a.material_count))
    .slice(0, 8);

  const title = truncate(`${courseName} ${shortName}: exámenes y apuntes`, 60) + ' | UniCali';
  const description = truncate(
    `${total} ${total === 1 ? 'material' : 'materiales'} de ${courseName} (${c.program_name}, ` +
      `${shortName})` +
      (Object.keys(kinds).length ? `: ${describeKinds(kinds)}` : '') +
      (periodList.length ? `. Periodos ${periodList.slice(0, 3).join(', ')}` : '') +
      '. Ábrelos en la app UniCali.',
    158,
  );

  return {
    kind: 'course',
    head: {
      // Página 2+ también se indexa (contenido distinto) con canónico propio.
      title: page > 1 ? `${title} · página ${page}` : title,
      description,
      robots: c.indexable ? 'index, follow' : 'noindex, follow',
    },
    canonical: SITE_URL + pagePath(page),
    breadcrumbs: crumbs,
    heading: `Exámenes y apuntes de ${courseName}`,
    intro:
      `${courseName} es un curso de ${c.program_name} en la ${shortName}` +
      (where ? `, del ${where}` : '') +
      (c.course_credits ? `, con ${Number(c.course_credits)} créditos` : '') +
      `. Aquí están los materiales que sus estudiantes compartieron en UniCali` +
      (Object.keys(kinds).length ? `: ${describeKinds(kinds)}` : '') +
      (periodList.length ? `, de los periodos ${periodList.join(', ')}` : '') +
      '.',
    facts,
    materials,
    sections: others.length
      ? [
          {
            title: `Otros cursos de ${c.program_name}`,
            links: others.map((s) => ({
              path: `${programPath}/${s.course_slug}`,
              label: displayCourseName(s.course_name),
              meta: `${s.material_count} ${Number(s.material_count) === 1 ? 'material' : 'materiales'}`,
            })),
          },
        ]
      : [],
    pagination:
      pages > 1
        ? {
            page,
            pages,
            prevPath: page > 1 ? pagePath(page - 1) : null,
            nextPath: page < pages ? pagePath(page + 1) : null,
          }
        : null,
    calculatorPath: calculator ? `/calculadora/${c.program_slug}` : null,
    playStoreUrl: PLAY_STORE_URL,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: `Exámenes y apuntes de ${courseName} — ${c.program_name}, ${shortName}`,
          url: SITE_URL + pagePath(page),
          inLanguage: 'es-PE',
          about: { '@type': 'Thing', name: courseName },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: total,
            itemListElement: materials.map((m, i) => ({
              '@type': 'ListItem',
              position: (page - 1) * PAGE_SIZE + i + 1,
              url: SITE_URL + m.path,
              name: m.title,
            })),
          },
        },
        breadcrumbJsonLd(crumbs),
      ],
    },
  };
}

function buildHead(page: LibraryPageData) {
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
      `<meta property="og:type" content="website" data-prerendered="true">`,
      `<meta property="og:site_name" content="UniCali" data-prerendered="true">`,
      `<meta property="og:locale" content="es_PE" data-prerendered="true">`,
      `<meta property="og:image" content="${SITE_URL}/og-image.png" data-prerendered="true">`,
      `<meta name="twitter:card" content="summary_large_image" data-prerendered="true">`,
    );
  }
  if (page.jsonLd) {
    tags.push(`<script type="application/ld+json" data-prerendered="true">${escapeJson(page.jsonLd)}</script>`);
  }
  return tags.join('\n    ');
}

/** HTML previo a React. Dice lo mismo que LibraryHub.tsx (Google renderiza ambos). */
function buildBody(page: LibraryPageData) {
  const crumbs = page.breadcrumbs
    .map((c) => (c.path ? `<a href="${escapeHtml(c.path)}">${escapeHtml(c.name)}</a>` : escapeHtml(c.name)))
    .join(' / ');
  const facts = page.facts.length
    ? `<dl>${page.facts.map((f) => `<dt>${escapeHtml(f.label)}</dt><dd>${escapeHtml(f.value)}</dd>`).join('')}</dl>`
    : '';
  const materials = page.materials.length
    ? `<h2>Materiales</h2><ul>${page.materials
        .map(
          (m) =>
            `<li><a href="${escapeHtml(m.path)}">${escapeHtml(m.title)}</a> · ${escapeHtml(m.kindLabel)}` +
            (m.academicPeriod ? ` · ${escapeHtml(m.academicPeriod)}` : '') +
            (m.hasSolutions ? ' · con solucionario' : '') +
            `</li>`,
        )
        .join('')}</ul>`
    : '';
  const sections = page.sections
    .map(
      (s) =>
        `<h2>${escapeHtml(s.title)}</h2><ul>${s.links
          .map(
            (l) =>
              `<li><a href="${escapeHtml(l.path)}">${escapeHtml(l.label)}</a>` +
              (l.meta ? ` · ${escapeHtml(l.meta)}` : '') +
              `</li>`,
          )
          .join('')}</ul>`,
    )
    .join('');
  const pager = page.pagination
    ? `<nav aria-label="Paginación">` +
      (page.pagination.prevPath ? `<a href="${escapeHtml(page.pagination.prevPath)}">Anterior</a> ` : '') +
      `Página ${page.pagination.page} de ${page.pagination.pages}` +
      (page.pagination.nextPath ? ` <a href="${escapeHtml(page.pagination.nextPath)}">Siguiente</a>` : '') +
      `</nav>`
    : '';
  const calculator = page.calculatorPath
    ? `<p><a href="${escapeHtml(page.calculatorPath)}">Calculadora de notas de esta escuela</a></p>`
    : '';
  return (
    `<article class="section-hero"><div class="container">` +
    `<nav aria-label="Migas de pan">${crumbs}</nav>` +
    `<h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.intro)}</p>` +
    facts +
    materials +
    pager +
    sections +
    calculator +
    `<p><a href="${PLAY_STORE_URL}" rel="noopener">Descarga UniCali</a> para abrir los materiales o subir los tuyos.</p>` +
    `</div></article>`
  );
}

function send(response: VercelResponse, page: LibraryPageData, status: number) {
  let html = shell.html;
  html = html.replace(/<title>[\s\S]*?<\/title>\s*/, '');
  html = html.replace('</head>', `  ${buildHead(page)}\n  </head>`);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${buildBody(page)}</div>\n` +
      `<script type="application/json" id="__LIBRARY_DATA__">${escapeJson(page)}</script>`,
  );
  response.setHeader('content-type', 'text/html; charset=utf-8');
  if (status === 200) {
    response.setHeader('cache-control', 'public, s-maxage=1800, stale-while-revalidate=86400');
  } else {
    response.setHeader('cache-control', 'public, s-maxage=300');
    response.setHeader('x-robots-tag', 'noindex');
  }
  return response.status(status).send(html);
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const uni = one(request.query.uni);
  const program = one(request.query.program);
  const course = one(request.query.course);
  const pageParam = Number(one(request.query.pagina) ?? '1');
  const page = Number.isInteger(pageParam) && pageParam >= 1 && pageParam <= 200 ? pageParam : 0;

  if ([uni, program].some((s) => s !== undefined && (!SLUG.test(s) || s.length > 100)) || page === 0) {
    return send(response, notFound(), 404);
  }

  const db = createClient(APP_SUPABASE_URL, APP_SUPABASE_KEY, { auth: { persistSession: false } });

  try {
    if (!uni) {
      const rows = await rpc<IndexRow>(db, 'get_public_library_index', {});
      const universities = [...new Set(rows.map((r) => r.university_slug))];
      if (universities.length === 1) {
        // Con una sola universidad, /biblioteca y /biblioteca/unsa serían la
        // misma página: 308 al nivel que lleva la palabra clave ("unsa").
        response.setHeader('cache-control', 'public, s-maxage=3600');
        return response.redirect(308, `/biblioteca/${universities[0]}`);
      }
      if (!universities.length) return send(response, notFound(), 404);
      const pageData: LibraryPageData = {
        ...notFound(),
        kind: 'index',
        head: {
          title: 'Biblioteca de exámenes y apuntes universitarios | UniCali',
          description: 'Exámenes, prácticas y apuntes compartidos por estudiantes, por universidad, escuela y curso.',
          robots: 'index, follow',
        },
        canonical: `${SITE_URL}/biblioteca`,
        breadcrumbs: [{ name: 'Inicio', path: '/' }, { name: 'Biblioteca', path: '/biblioteca' }],
        heading: 'Biblioteca UniCali',
        intro: 'Elige tu universidad.',
        sections: [
          {
            title: 'Universidades',
            links: universities.map((u) => ({
              path: `/biblioteca/${u}`,
              label: rows.find((r) => r.university_slug === u)?.university_short_name ?? u,
            })),
          },
        ],
      };
      return send(response, pageData, 200);
    }

    if (!program) {
      const rows = await rpc<IndexRow>(db, 'get_public_library_index', {});
      const pageData = buildUniversity(rows, uni);
      return pageData ? send(response, pageData, 200) : send(response, notFound(), 404);
    }

    if (!course) {
      const [rows, calculator] = await Promise.all([
        rpc<ProgramRow>(db, 'get_public_library_program', { p_university_slug: uni, p_program_slug: program }),
        hasCalculator(program),
      ]);
      if (!rows.length) return send(response, notFound(), 404);
      return send(response, buildProgram(rows, calculator), 200);
    }

    // /…/[nombre-del-curso]-[código]: el código decide, el nombre es decorativo.
    const match = /^(?:[a-z0-9-]*-)?([a-z0-9]{3,12})$/.exec(course);
    if (!match) return send(response, notFound(), 404);
    const code = match[1];

    const [rows, siblings, calculator] = await Promise.all([
      rpc<CourseRow>(db, 'get_public_library_course', {
        p_university_slug: uni,
        p_program_slug: program,
        p_course_code: code,
        p_limit: PAGE_SIZE,
        p_offset: (page - 1) * PAGE_SIZE,
      }),
      rpc<ProgramRow>(db, 'get_public_library_program', { p_university_slug: uni, p_program_slug: program }),
      hasCalculator(program),
    ]);
    if (!rows.length) return send(response, notFound(), 404);

    // Nombre de curso desactualizado o mal escrito → 308 al canónico (el enlace
    // sigue funcionando y Google consolida la señal en una sola URL).
    if (rows[0].course_slug !== course) {
      const target = `/biblioteca/${uni}/${program}/${rows[0].course_slug}${page > 1 ? `?pagina=${page}` : ''}`;
      response.setHeader('cache-control', 'public, s-maxage=3600');
      return response.redirect(308, target);
    }
    return send(response, buildCourse(rows, siblings, page, calculator), 200);
  } catch (error) {
    if (error instanceof RpcFailure) {
      response.setHeader('retry-after', '60');
      return response.status(503).send('Servicio no disponible');
    }
    throw error;
  }
}
