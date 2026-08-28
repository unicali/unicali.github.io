// Promueve páginas de 'draft' a 'published' solo si pasan las compuertas.
//
//   node --env-file=.env.local scripts/seo/publish-pages.mjs          # informe
//   node --env-file=.env.local scripts/seo/publish-pages.mjs --apply  # publica
//   node --env-file=.env.local scripts/seo/publish-pages.mjs --apply economia
//
// Sin este paso el pipeline sería autopublicación masiva, que es justo lo que la
// política de "scaled content abuse" de Google penaliza. Las compuertas no son
// burocracia: cada una corresponde a un fallo real que haría daño si se publica.
import { createServiceClient } from './lib/supabase.mjs';

// Se valida sobre créditos OBLIGATORIOS, no sobre el total codificado: los
// codificados llegan a 974 porque incluyen toda la oferta electiva.
//
// Y se normaliza POR AÑO de carrera, no en absoluto. Las carreras de 5 años
// rondan los 194 créditos y Medicina, que dura 7, llega a 286; un rango fijo
// habría bloqueado Medicina por ser larga, no por estar mal. Por año, ambas caen
// en la misma banda (~39 y ~41).
const CREDITS_PER_YEAR_MIN = 28;
const CREDITS_PER_YEAR_MAX = 52;
const MIN_COURSES = 6;
const MIN_SOURCES = 2;

function evaluate(page, seen) {
  const failures = [];
  const allCourses = page.programs?.courses ?? [];
  const courses = allCourses.filter((course) => !course.is_elective);
  const credits = courses.reduce((total, course) => total + Number(course.credits), 0);

  if (courses.length < MIN_COURSES) {
    failures.push(`solo ${courses.length} asignaturas (mínimo ${MIN_COURSES})`);
  }
  if ((page.seo_sources ?? []).length < MIN_SOURCES) {
    failures.push(`solo ${(page.seo_sources ?? []).length} fuentes citadas (mínimo ${MIN_SOURCES})`);
  }
  const years = Math.max(1, ...courses.map((course) => course.year ?? 1));
  const perYear = credits / years;
  if (perYear < CREDITS_PER_YEAR_MIN || perYear > CREDITS_PER_YEAR_MAX) {
    failures.push(
      `${credits} créditos obligatorios en ${years} años = ${perYear.toFixed(1)}/año, ` +
        `fuera de la banda ${CREDITS_PER_YEAR_MIN}-${CREDITS_PER_YEAR_MAX}`,
    );
  }
  if (Math.abs(credits - Number(page.programs?.required_credits ?? 0)) > 0.01) {
    failures.push(
      `los créditos obligatorios de las asignaturas (${credits}) no cuadran con el ` +
        `required_credits del programa (${page.programs?.required_credits})`,
    );
  }
  // Un título repetido convierte el clúster en contenido duplicado a ojos de Google.
  if (seen.titles.has(page.title)) failures.push('título duplicado con otra página');
  if (seen.h1s.has(page.h1)) failures.push('H1 duplicado con otra página');
  // El descargo protege legalmente y evita que la página parezca oficial.
  const hasDisclaimer = (page.blocks ?? []).some((block) => block.type === 'disclaimer');
  if (!hasDisclaimer) failures.push('sin bloque de descargo de responsabilidad');
  if (!(page.faq ?? []).length) failures.push('sin preguntas frecuentes');

  seen.titles.add(page.title);
  seen.h1s.add(page.h1);

  return { failures, credits, courses: courses.length };
}

async function main() {
  const apply = process.argv.includes('--apply');
  const only = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

  const db = createServiceClient();
  const { data: pages, error } = await db
    .from('seo_pages')
    .select(
      `id, path, title, h1, blocks, faq, status,
       seo_sources ( id ),
       programs ( slug, required_credits, courses ( credits, is_elective, year ) )`,
    )
    .eq('cluster', 'calculadora')
    .order('path');
  if (error) throw error;

  const seen = { titles: new Set(), h1s: new Set() };
  const passed = [];
  const blocked = [];

  for (const page of pages) {
    const result = evaluate(page, seen);
    if (only.length && !only.includes(page.programs?.slug)) continue;
    if (result.failures.length) blocked.push({ page, ...result });
    else passed.push({ page, ...result });
  }

  for (const item of blocked) {
    console.log(`BLOQUEADA  ${item.page.path}`);
    for (const failure of item.failures) console.log(`           - ${failure}`);
  }

  if (!apply) {
    console.log(`\n[publish] simulación — pasan ${passed.length}, bloqueadas ${blocked.length}`);
    console.log('[publish] usa --apply para publicar las que pasan');
    return;
  }

  const ids = passed.map((item) => item.page.id);
  if (ids.length) {
    const { error: updateError } = await db
      .from('seo_pages')
      .update({ status: 'published', published_at: new Date().toISOString(), quality_score: 100 })
      .in('id', ids);
    if (updateError) throw updateError;
  }

  console.log(`\n[publish] publicadas ${ids.length}, bloqueadas ${blocked.length}`);
}

main().catch((err) => {
  console.error('[publish] error:', err.message);
  process.exit(1);
});
