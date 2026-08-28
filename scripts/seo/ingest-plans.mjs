// Ingesta de los planes de estudio de la UNSA a Supabase.
//
//   node --env-file=.env.local scripts/seo/ingest-plans.mjs            # todas
//   node --env-file=.env.local scripts/seo/ingest-plans.mjs 470 446    # solo esas
//   DRY_RUN=1 node scripts/seo/ingest-plans.mjs                        # sin escribir
//
// Fuente: SISACAD, el sistema académico público de la universidad
// (scripts/seo/lib/sisacad.mjs). Las escuelas salen de su directorio oficial, no
// de una lista escrita a mano ni de barrer códigos por fuerza bruta: así aparecen
// solas las carreras nuevas y las que tienen un plan de año distinto —Medicina
// tiene plan 2026 y por eso se escapaba de una búsqueda fijada en 2025.
//
// Es idempotente: los upsert van por (university, slug) y (program, code), así
// que reprocesar un plan actualiza en vez de duplicar.
import { assertPlanIntegrity } from './lib/parse-plan.mjs';
import { fetchPlan, fetchSchoolDirectory, planUrl } from './lib/sisacad.mjs';
import { createServiceClient } from './lib/supabase.mjs';
import { specialtySlug, slugify, programShortName, titleCase } from './lib/slug.mjs';

const UNIVERSITY_SLUG = 'unsa';
const DRY_RUN = process.env.DRY_RUN === '1';

/**
 * Un plan de pregrado peruano ronda los 140-260 créditos obligatorios. Fuera de
 * ese rango casi siempre significa un plan histórico o descontinuado que no
 * describe lo que se cursa hoy, así que se ingiere pero no se publica: la
 * compuerta de publish-pages lo vuelve a comprobar.
 */
const PLAUSIBLE_REQUIRED_CREDITS = [120, 320];

/**
 * Antigüedad máxima del plan, en años. SISACAD sigue sirviendo planes de escuelas
 * descontinuadas —depe 439 devuelve uno de 1997— y publicarlos daría a un
 * estudiante una malla que nadie cursa desde hace décadas.
 */
const MAX_PLAN_AGE_YEARS = 8;

async function upsertFaculty(db, universityId, name, cache) {
  if (!name) return null;
  if (cache.has(name)) return cache.get(name);

  const { data, error } = await db
    .from('faculties')
    .upsert(
      { university_id: universityId, slug: slugify(name), name: titleCase(name) },
      { onConflict: 'university_id,slug' },
    )
    .select('id')
    .single();
  if (error) throw error;

  cache.set(name, data.id);
  return data.id;
}

async function ingestProgram(db, universityId, school, facultyCache) {
  const started = new Date().toISOString();
  const plan = await fetchPlan(school.depe);

  const age = new Date().getFullYear() - plan.planYear;
  if (age > MAX_PLAN_AGE_YEARS) {
    return [{ skipped: `plan ${plan.planYear}, ${age} años de antigüedad` }];
  }

  // Falla antes de escribir nada si los datos no son consistentes.
  assertPlanIntegrity(plan, { source: `depe ${school.depe}` });

  // El nombre bueno es el del directorio; el <h2> del plan viene sin el prefijo
  // "ESCUELA PROFESIONAL DE" y a veces con la codificación mezclada.
  const short = programShortName(school.name ?? plan.programName ?? `Escuela ${school.depe}`);
  const results = [];

  const facultyId = DRY_RUN ? null : await upsertFaculty(db, universityId, school.faculty, facultyCache);

  // Dos especialidades de la misma escuela no pueden compartir slug: el upsert va
  // por (university, slug) y una sobrescribiría a la otra sin avisar.
  const slugs = plan.specialties.map((specialty) =>
    specialty.name ? specialtySlug(short, specialty.name) : slugify(short),
  );
  const duplicated = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  if (duplicated.length) {
    throw new Error(
      `especialidades con slug repetido (${[...new Set(duplicated)].join(', ')}): ` +
        'una sobrescribiría a la otra',
    );
  }

  for (const specialty of plan.specialties) {
    const name = specialty.name;
    const slug = name ? specialtySlug(short, name) : slugify(short);
    const courses = plan.courses.filter((course) => course.specialtyIndex === specialty.index);

    const [min, max] = PLAUSIBLE_REQUIRED_CREDITS;
    const suspicious =
      specialty.requiredCredits < min || specialty.requiredCredits > max
        ? `créditos obligatorios fuera de rango (${specialty.requiredCredits})`
        : null;

    if (DRY_RUN) {
      results.push({ slug, courses: courses.length, credits: specialty.requiredCredits, suspicious, dryRun: true });
      continue;
    }

    const { data: program, error: pErr } = await db
      .from('programs')
      .upsert(
        {
          university_id: universityId,
          faculty_id: facultyId,
          slug,
          name: titleCase(name ? `${short} - ${name}` : short),
          depe_code: school.depe,
          specialty_index: specialty.index,
          specialty_name: name ? titleCase(name) : null,
          plan_year: plan.planYear,
          // coded_credits es lo que declara el plan (incluye toda la oferta
          // electiva); required_credits es lo que cursa un estudiante y es la
          // cifra que se muestra en las páginas.
          coded_credits: specialty.credits,
          required_credits: specialty.requiredCredits,
          elective_credits: specialty.electiveCredits,
          source_url: planUrl(school.depe, plan.planYear),
          source_fetched_at: new Date().toISOString(),
        },
        { onConflict: 'university_id,slug' },
      )
      .select('id')
      .single();
    if (pErr) throw pErr;

    const { error: cErr } = await db.from('courses').upsert(
      courses.map((course) => ({
        program_id: program.id,
        code: course.code,
        name: course.name,
        credits: course.credits,
        year: course.year,
        // 0 significa asignatura anual: existe en Medicina y es un valor válido.
        semester: course.semester,
        component: course.component,
        dept: course.dept,
        is_elective: course.isElective ?? false,
        hours_theory: course.hours_theory,
        hours_seminar: course.hours_seminar,
        hours_theory_practice: course.hours_theory_practice,
        hours_practice: course.hours_practice,
        hours_lab: course.hours_lab,
      })),
      { onConflict: 'program_id,code' },
    );
    if (cErr) throw cErr;

    // Los prerrequisitos se reemplazan enteros: es más simple y seguro que
    // reconciliar altas y bajas cuando la universidad cambia el plan.
    const { data: saved, error: sErr } = await db
      .from('courses')
      .select('id, code')
      .eq('program_id', program.id);
    if (sErr) throw sErr;

    const idByCode = new Map(saved.map((course) => [course.code, course.id]));
    const links = courses.flatMap((course) =>
      course.prerequisites.map((prereq) => ({
        course_id: idByCode.get(course.code),
        prereq_code: prereq,
      })),
    );
    await db.from('course_prerequisites').delete().in('course_id', [...idByCode.values()]);
    if (links.length) {
      const { error: prErr } = await db.from('course_prerequisites').insert(links);
      if (prErr) throw prErr;
    }

    results.push({ slug, courses: courses.length, credits: specialty.requiredCredits, suspicious });

    await db.from('ingest_runs').insert({
      source: `unsa:sisacad:${school.depe}:${specialty.index}`,
      program_id: program.id,
      status: 'ok',
      stats: {
        planYear: plan.planYear,
        courses: courses.length,
        requiredCredits: specialty.requiredCredits,
        electiveCredits: specialty.electiveCredits,
        codedCredits: specialty.credits,
        prerequisites: links.length,
        warning: suspicious,
      },
      started_at: started,
      finished_at: new Date().toISOString(),
    });
  }

  return results;
}

async function main() {
  const only = process.argv.slice(2);

  const directory = await fetchSchoolDirectory();
  const schools = directory.filter((school) => only.length === 0 || only.includes(school.depe));
  if (!schools.length) throw new Error(`Sin escuelas que procesar (argumentos: ${only.join(', ')})`);
  console.log(`[ingest] ${schools.length} escuelas en el directorio de SISACAD`);

  let db = null;
  let universityId = null;
  const facultyCache = new Map();
  if (!DRY_RUN) {
    db = createServiceClient();
    const { data, error } = await db
      .from('universities')
      .select('id')
      .eq('slug', UNIVERSITY_SLUG)
      .single();
    if (error) throw error;
    universityId = data.id;
  }

  let ok = 0;
  const failures = [];
  const warnings = [];

  for (const school of schools) {
    try {
      const results = await ingestProgram(db, universityId, school, facultyCache);
      for (const result of results) {
        if (result.skipped) {
          console.log(`[ingest] OMITIDA ${String(school.name).slice(0, 46).padEnd(47)} ${result.skipped}`);
          continue;
        }
        console.log(
          `[ingest] ${result.slug.padEnd(50)} ${String(result.courses).padStart(3)} asig  ` +
            `${String(result.credits).padStart(4)} cred${result.dryRun ? '  (dry-run)' : ''}` +
            (result.suspicious ? `  AVISO: ${result.suspicious}` : ''),
        );
        if (result.suspicious) warnings.push(`${result.slug}: ${result.suspicious}`);
      }
      ok += 1;
    } catch (err) {
      failures.push({ depe: school.depe, message: err.message });
      console.error(`[ingest] FALLA ${school.depe} (${school.name}): ${err.message.split('\n')[0]}`);
    }
  }

  console.log(`\n[ingest] escuelas procesadas: ${ok}/${schools.length}`);
  if (warnings.length) console.log(`[ingest] ${warnings.length} con avisos (no se publicarán solas)`);
  if (failures.length) {
    console.error(`[ingest] fallaron ${failures.length}: ${failures.map((f) => f.depe).join(', ')}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('[ingest] error fatal:', err.message);
  process.exit(1);
});
