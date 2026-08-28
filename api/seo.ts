import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import shell from './_shell.json' with { type: 'json' };

/**
 * Render bajo demanda de las páginas programáticas (/calculadora/[escuela]).
 *
 * Por qué una función y no prerender estático: el coste de build no crece con el
 * número de páginas y publicar contenido no exige un redeploy. La respuesta se
 * cachea en el CDN de Vercel con s-maxage + stale-while-revalidate, así que en
 * la práctica se sirve tan rápido como un fichero estático.
 *
 * Contrato con el cliente: los nodos de meta llevan data-prerendered="true", que
 * src/main.tsx elimina antes de montar con createRoot. Es el mismo mecanismo que
 * ya usa scripts/prerender.mjs — no se inventa nada nuevo aquí, y por eso no
 * hace falta hydrateRoot.
 *
 * Solo usa la clave publicable: RLS ya limita la lectura a datos públicos. La
 * service role key no debe existir en este runtime.
 */

const SITE_URL = 'https://www.unicali.app';
const EMBEDDED_DATA_ID = '__PROGRAM_DATA__';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const YEAR_LABELS = [
  '',
  'Primer año',
  'Segundo año',
  'Tercer año',
  'Cuarto año',
  'Quinto año',
  'Sexto año',
  'Séptimo año',
];

interface CourseRow {
  code: string;
  name: string;
  credits: number;
  year: number;
  semester: number;
  component: string | null;
  dept: string | null;
  prerequisites: string[];
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * El JSON incrustado se cierra con </script> si el contenido lo contiene, así que
 * se neutraliza la secuencia. Es la vía clásica de inyección en datos embebidos.
 */
const escapeJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/-->/g, '--\\u003e');

const semesterLabel = (year: number, semester: number) =>
  `${YEAR_LABELS[year] ?? `Año ${year}`} · ${semester === 1 ? 'primer' : 'segundo'} semestre`;

function buildHead(page: {
  title: string;
  description: string;
  canonical: string;
  jsonLd: unknown;
}) {
  return [
    `<title data-prerendered="true">${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" data-prerendered="true">`,
    `<link rel="canonical" href="${page.canonical}" data-prerendered="true">`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" data-prerendered="true">`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" data-prerendered="true">`,
    `<meta property="og:url" content="${page.canonical}" data-prerendered="true">`,
    `<meta property="og:type" content="website" data-prerendered="true">`,
    `<meta property="og:site_name" content="UniCali" data-prerendered="true">`,
    `<meta property="og:locale" content="es_PE" data-prerendered="true">`,
    `<meta property="og:image" content="${SITE_URL}/og-image.png" data-prerendered="true">`,
    `<meta name="twitter:card" content="summary_large_image" data-prerendered="true">`,
    `<script type="application/ld+json" data-prerendered="true">${escapeJson(page.jsonLd)}</script>`,
  ].join('\n    ');
}

/**
 * Contenido servido en el HTML. Reproduce lo esencial de
 * src/pages/tools/ProgramCalculator.tsx: los crawlers ven la malla completa sin
 * ejecutar JavaScript, que es justamente lo que un SPA no les da.
 */
function buildBody(program: ProgramRow, courses: CourseRow[], links: LinkRow[]) {
  const groups = new Map<string, CourseRow[]>();
  for (const course of courses) {
    const key = `${course.year}-${course.semester}`;
    groups.set(key, [...(groups.get(key) ?? []), course]);
  }

  const sections = [...groups.keys()]
    .sort()
    .map((key) => {
      const group = groups.get(key) ?? [];
      const [year, semester] = key.split('-').map(Number);
      const credits = group.reduce((total, course) => total + course.credits, 0);
      const items = group
        .map(
          (course) =>
            `<li><strong>${escapeHtml(course.name)}</strong> · ${course.credits} créd.` +
            (course.prerequisites.length
              ? ` · requiere ${course.prerequisites.map(escapeHtml).join(', ')}`
              : '') +
            `</li>`,
        )
        .join('');
      return (
        `<section><h3>${escapeHtml(semesterLabel(year, semester))} — ${credits} créditos</h3>` +
        `<ul>${items}</ul></section>`
      );
    })
    .join('');

  const shortName = program.universities.short_name;

  return (
    `<article class="section-hero"><div class="container">` +
    `<span class="meta-label">${escapeHtml(shortName)} · Plan ${program.plan_year}</span>` +
    `<h1>Calculadora de notas de ${escapeHtml(program.name)}</h1>` +
    `<p>El plan ${program.plan_year} de ${escapeHtml(program.name)} tiene ${courses.length} ` +
    `asignaturas y ${program.total_credits} créditos. Esta calculadora usa esos créditos ` +
    `oficiales como peso, que es exactamente como se obtiene el promedio ponderado del semestre.</p>` +
    `<h2>Malla curricular completa</h2>${sections}` +
    `<h2>Fuente y aviso</h2><p>Datos extraídos del plan de estudios oficial publicado por la ` +
    `${escapeHtml(program.universities.name)}: <a href="${escapeHtml(program.source_url)}" ` +
    `rel="nofollow noopener external">plan ${program.plan_year} de ${escapeHtml(program.name)}</a>. ` +
    `UniCali es un proyecto independiente hecho por estudiantes y <strong>no está afiliado a la ` +
    `${escapeHtml(shortName)}</strong>. Los pesos de evaluación de cada asignatura los define el ` +
    `sílabo del curso, no este sitio.</p>` +
    (links.length
      ? `<h2>Otras escuelas</h2><ul>` +
        links
          .map((link) => {
            const target = Array.isArray(link.seo_pages) ? link.seo_pages[0] : link.seo_pages;
            return target
              ? `<li><a href="${escapeHtml(target.path)}">${escapeHtml(link.anchor)}</a></li>`
              : '';
          })
          .join('') +
        `</ul>`
      : '') +
    `</div></article>`
  );
}

interface LinkRow {
  anchor: string;
  seo_pages: { path: string } | Array<{ path: string }> | null;
}

interface ProgramRow {
  slug: string;
  name: string;
  depe_code: string;
  specialty_name: string | null;
  plan_year: number;
  total_credits: number;
  source_url: string;
  universities: {
    slug: string;
    name: string;
    short_name: string;
    passing_grade: number;
    grading_max: number;
  };
  courses: Array<
    Omit<CourseRow, 'prerequisites'> & { course_prerequisites: Array<{ prereq_code: string }> }
  >;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Vercel invoca con la firma Node, no con Request/Response del estandar web:
  // request.url llega como ruta relativa y construir un URL con ella lanza
  // ERR_INVALID_URL. El slug ademas ya viene como parametro, porque la
  // reescritura de vercel.json es /calculadora/:escuela.
  const raw = request.query.escuela;
  const slug = Array.isArray(raw) ? raw[0] : raw;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return response.status(404).send('Not found');
  }
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    // Falta configuracion: un 500 honesto, no un 404 que Google memorizaria.
    return response.status(500).send('Supabase no configurado');
  }

  const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

  const [{ data: program }, { data: page }] = await Promise.all([
    db
      .from('programs')
      .select(
        `slug, name, depe_code, specialty_name, plan_year, total_credits, source_url,
         universities ( slug, name, short_name, passing_grade, grading_max ),
         courses ( code, name, credits, year, semester, component, dept,
                   course_prerequisites ( prereq_code ) )`,
      )
      .eq('slug', slug)
      .maybeSingle<ProgramRow>(),
    // La fila de seo_pages es la compuerta editorial: RLS solo devuelve las
    // publicadas, así que un borrador nunca puede llegar a servirse.
    db
      .from('seo_pages')
      .select('id, title, meta_description, jsonld')
      .eq('path', `/calculadora/${slug}`)
      .maybeSingle(),
  ]);

  if (!program || !page) {
    // 404 real: una URL inexistente nunca debe devolver 200 con contenido ajeno.
    response.setHeader('content-type', 'text/plain; charset=utf-8');
    return response.status(404).send('Not found');
  }

  // Enlaces a paginas hermanas. RLS solo devuelve las publicadas, asi que nunca
  // se enlaza a un borrador. Sin enlazado interno las paginas quedan huerfanas.
  const { data: links } = await db
    .from('seo_internal_links')
    .select('anchor, seo_pages!seo_internal_links_to_page_id_fkey ( path )')
    .eq('from_page_id', (page as { id: string }).id)
    .limit(6);

  const courses: CourseRow[] = (program.courses ?? [])
    .map((course) => ({
      code: course.code,
      name: course.name,
      credits: Number(course.credits),
      year: course.year,
      semester: course.semester,
      component: course.component,
      dept: course.dept,
      prerequisites: (course.course_prerequisites ?? []).map((p) => p.prereq_code),
    }))
    .sort((a, b) => a.code.localeCompare(b.code));

  const canonical = `${SITE_URL}/calculadora/${slug}`;
  const embedded = {
    program: {
      slug: program.slug,
      name: program.name,
      depeCode: program.depe_code,
      specialtyName: program.specialty_name,
      planYear: program.plan_year,
      totalCredits: program.total_credits,
      sourceUrl: program.source_url,
      university: {
        slug: program.universities.slug,
        name: program.universities.name,
        shortName: program.universities.short_name,
        passingGrade: Number(program.universities.passing_grade),
        gradingMax: Number(program.universities.grading_max),
      },
    },
    courses,
  };

  let html = shell.html;

  // El <title> estático de index.html es solo un fallback; dejarlo produciría dos
  // <title> en el DOM, el mismo fallo que ya se corrigió en el prerender.
  html = html.replace(/<title>[\s\S]*?<\/title>\s*/, '');
  html = html.replace(
    '</head>',
    `  ${buildHead({
      title: page.title,
      description: page.meta_description,
      canonical,
      jsonLd: page.jsonld,
    })}\n  </head>`,
  );
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${buildBody(program, courses, links ?? [])}</div>\n` +
      `<script type="application/json" id="${EMBEDDED_DATA_ID}">${escapeJson(embedded)}</script>`,
  );

  response.setHeader('content-type', 'text/html; charset=utf-8');
  // El CDN sirve la copia cacheada un dia y revalida en segundo plano durante una
  // semana, asi que publicar contenido nuevo no exige un redeploy.
  response.setHeader('cache-control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  return response.status(200).send(html);
}
