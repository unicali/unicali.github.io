// Genera las filas de seo_pages para el clúster /calculadora/[escuela].
//
//   node --env-file=.env.local scripts/seo/generate-pages.mjs
//
// Las páginas nacen en estado 'draft'. Publicarlas es un paso aparte
// (publish-pages.mjs) que aplica las compuertas de calidad. Nada se autopublica.
//
// El texto generado aquí es deliberadamente mínimo: encuadra y describe, pero la
// sustancia de la página son los datos oficiales (créditos, prerrequisitos,
// estructura del plan) y una herramienta que funciona. Generar párrafos de
// relleno por escuela es exactamente lo que la política de "scaled content
// abuse" de Google penaliza, y además no aporta nada al estudiante.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { createServiceClient } from './lib/supabase.mjs';

const SITE_URL = 'https://www.unicali.app';

// Reglamento que fija la escala y la nota aprobatoria. Se cita en cada página:
// sin fuente verificable, una calculadora de notas no merece confianza.
const REGULATION_SOURCE = {
  url: 'https://transparencia.unsa.edu.pe/bitstream/handle/123456789/571/RCU-0161-2021.pdf',
  title: 'Reglamento General de Evaluación del Proceso Enseñanza-Aprendizaje (RCU-0161-2021)',
  publisher: 'Universidad Nacional de San Agustín de Arequipa',
};

function buildPage(program, courses, breakdown) {
  const path = `/calculadora/${program.slug}`;
  const canonical = SITE_URL + path;
  const shortName = program.universities.short_name;
  const name = program.name;
  const years = Math.max(...courses.map((c) => c.year));
  const { requiredCourses, requiredCredits, electiveCourses } = breakdown;

  const title = `Calculadora de notas ${name} ${shortName} | UniCali`;
  const description =
    `Calcula tu promedio ponderado de ${name} en la ${shortName} con los créditos oficiales ` +
    `del plan ${program.plan_year}: ${requiredCourses} asignaturas obligatorias y ` +
    `${requiredCredits} créditos.`;

  const faq = [
    {
      question: `¿Cómo se calcula el promedio ponderado en ${name}?`,
      answer:
        `Se multiplica la nota de cada asignatura por sus créditos, se suman esos productos y se ` +
        `divide entre el total de créditos del semestre. Los créditos son el peso: una asignatura ` +
        `de 4 créditos pesa el doble que una de 2.`,
    },
    {
      question: `¿Cuántos créditos tiene la carrera de ${name} en la ${shortName}?`,
      answer:
        `El plan ${program.plan_year} de ${name} tiene ${requiredCredits} créditos ` +
        `obligatorios repartidos en ${requiredCourses} asignaturas a lo largo de ${years} años` +
        (electiveCourses
          ? `, más ${electiveCourses} asignaturas electivas de las que se cursa solo una parte.`
          : '.'),
    },
    {
      question: '¿Con qué nota se aprueba una asignatura?',
      answer:
        `La ${shortName} usa la escala vigesimal de 0 a 20. Se aprueba a partir de ` +
        `${Number(program.universities.passing_grade)}, que se redondea a 11 en el acta.`,
    },
    ...(electiveCourses
      ? [
          {
            question: `¿Por qué el plan de ${name} lista más asignaturas de las que voy a llevar?`,
            answer:
              `El plan publica toda la oferta electiva: ${electiveCourses} asignaturas marcadas ` +
              `con "(E)" de las que cada estudiante cursa solo una parte. Por eso la cifra que ` +
              `mostramos, ${requiredCredits} créditos, cuenta las obligatorias: es el recorrido ` +
              `que sí hace todo el mundo.`,
          },
        ]
      : []),
    {
      question: '¿Esta calculadora usa los pesos de mi sílabo?',
      answer:
        'No, y a propósito. Los pesos de evaluación continua y examen los fija el sílabo de cada ' +
        'curso y cambian según el docente y el semestre, así que no existe una fuente pública ' +
        'fiable. Esta página usa los créditos oficiales, que sí son un dato verificable y son ' +
        'el peso del promedio ponderado del semestre.',
    },
  ];

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Calculadora UNSA',
            item: `${SITE_URL}/herramientas/calculadora-unsa`,
          },
          { '@type': 'ListItem', position: 3, name, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'WebApplication',
        name: `Calculadora de notas ${name} ${shortName}`,
        url: canonical,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        inLanguage: 'es-PE',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'PEN' },
      },
    ],
  };

  return {
    path,
    cluster: 'calculadora',
    title,
    meta_description: description,
    h1: `Calculadora de notas de ${name}`,
    lede:
      `El plan ${program.plan_year} de ${name} tiene ${requiredCourses} asignaturas ` +
      `obligatorias y ${requiredCredits} créditos.`,
    blocks: [
      { type: 'calculator', mode: 'weighted-average' },
      { type: 'curriculum', courses: requiredCourses, credits: requiredCredits },
      { type: 'disclaimer', text: `UniCali no está afiliado a la ${shortName}.` },
    ],
    faq,
    jsonld,
    status: 'draft',
  };
}

async function main() {
  const db = createServiceClient();

  const { data: programs, error } = await db
    .from('programs')
    .select(
      `id, university_id, slug, name, plan_year, required_credits, coded_credits, source_url,
       universities ( short_name, passing_grade ),
       courses ( code, year, credits, is_elective )`,
    )
    .order('slug');
  if (error) throw error;

  let created = 0;
  for (const program of programs) {
    const courses = program.courses ?? [];
    if (!courses.length) {
      console.warn(`[pages] ${program.slug}: sin asignaturas, se omite`);
      continue;
    }

    const required = courses.filter((c) => !c.is_elective);
    const breakdown = {
      requiredCourses: required.length,
      requiredCredits: required.reduce((total, c) => total + Number(c.credits), 0),
      electiveCourses: courses.length - required.length,
    };
    const page = buildPage(program, courses, breakdown);
    // Huella del contenido publicable. Si cambia en una pagina ya publicada, la
    // pagina vuelve a 'review': regenerar contenido no debe saltarse la revision
    // solo porque la pagina ya estuviera viva.
    const contentHash = createHash('sha256')
      .update(JSON.stringify([page.title, page.meta_description, page.h1, page.lede, page.blocks, page.faq]))
      .digest('hex')
      .slice(0, 32);

    const { data: existing } = await db
      .from('seo_pages')
      .select('status, content_hash')
      .eq('path', page.path)
      .maybeSingle();

    const changed = existing != null && existing.content_hash !== contentHash;
    const status =
      existing == null ? 'draft' : changed && existing.status === 'published' ? 'review' : existing.status;

    const { data: saved, error: pageError } = await db
      .from('seo_pages')
      .upsert(
        {
          university_id: program.university_id,
          program_id: program.id,
          cluster: page.cluster,
          path: page.path,
          title: page.title,
          meta_description: page.meta_description,
          h1: page.h1,
          lede: page.lede,
          blocks: page.blocks,
          faq: page.faq,
          jsonld: page.jsonld,
          content_hash: contentHash,
          status,
        },
        { onConflict: 'path' },
      )
      .select('id')
      .single();
    if (pageError) throw pageError;

    // Fuentes: el plan oficial de esa escuela y el reglamento de evaluación.
    // publish-pages.mjs exige al menos dos para promover la página.
    await db.from('seo_sources').delete().eq('page_id', saved.id);
    const { error: sourceError } = await db.from('seo_sources').insert([
      {
        page_id: saved.id,
        url: program.source_url,
        title: `Plan de estudios ${program.plan_year} — ${program.name}`,
        publisher: 'Universidad Nacional de San Agustín de Arequipa',
      },
      { page_id: saved.id, ...REGULATION_SOURCE },
    ]);
    if (sourceError) throw sourceError;

    created += 1;
    if (changed && existing.status === 'published') {
      console.log(`[pages] ${page.path}: contenido cambiado, vuelve a 'review'`);
    }
  }

  // Índice para el bundle cliente: sin un enlace desde una página existente, el
  // clúster solo sería alcanzable por el sitemap, y las páginas huérfanas son la
  // causa más común de que el SEO programático nunca llegue a indexarse.
  const { data: published } = await db
    .from('seo_pages')
    .select('path, programs ( name, required_credits, courses ( is_elective ) )')
    .eq('cluster', 'calculadora')
    .eq('status', 'published')
    .order('path');

  writeFileSync(
    new URL('../../src/data/programs.json', import.meta.url),
    `${JSON.stringify(
      {
        $comment:
          'Generado por scripts/seo/generate-pages.mjs. Es el indice que enlaza la ' +
          'calculadora general con el cluster programatico; no editar a mano.',
        programs: (published ?? []).map((page) => ({
          path: page.path,
          name: page.programs.name,
          requiredCredits: page.programs.required_credits,
          requiredCourses: (page.programs.courses ?? []).filter((c) => !c.is_elective).length,
        })),
      },
      null,
      2,
    )}\n`,
    'utf-8',
  );

  console.log(`[pages] listo — ${created} páginas generadas, ${(published ?? []).length} en el índice`);
}

main().catch((err) => {
  console.error('[pages] error:', err.message);
  process.exit(1);
});
