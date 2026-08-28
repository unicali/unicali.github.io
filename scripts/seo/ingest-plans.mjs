// Ingesta de los planes de estudio de la UNSA a Supabase.
//
//   node --env-file=.env.local scripts/seo/ingest-plans.mjs            # todas
//   node --env-file=.env.local scripts/seo/ingest-plans.mjs 470 446    # solo esas
//   DRY_RUN=1 node scripts/seo/ingest-plans.mjs                        # sin escribir
//
// Es idempotente: los upsert van por (university, slug) y (program, code), así
// que reprocesar un plan actualiza en vez de duplicar. Los PDF se cachean en
// .cache/plans para no volver a pedirlos al servidor de la universidad.
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parsePlanPdf, assertPlanIntegrity } from './lib/parse-plan.mjs';
import { createServiceClient } from './lib/supabase.mjs';
import { specialtySlug, slugify, programShortName, titleCase } from './lib/slug.mjs';

const UNIVERSITY_SLUG = 'unsa';
const PLAN_YEAR = 2025;
const CACHE_DIR = path.resolve(process.cwd(), '.cache/plans');
const DRY_RUN = process.env.DRY_RUN === '1';

const catalog = JSON.parse(
  readFileSync(new URL('./data/unsa-programs.json', import.meta.url), 'utf-8'),
);
const overrides = JSON.parse(
  readFileSync(new URL('./data/specialty-names.json', import.meta.url), 'utf-8'),
).names;

const planUrl = (depe) => `http://extranet.unsa.edu.pe/tmp/plan_${depe}_${PLAN_YEAR}.pdf`;

// El servidor de la UNSA solo responde por HTTP (rechaza el 443), y es un Apache
// antiguo: se pide en serie y con timeout generoso en vez de en paralelo.
async function fetchPlan(depe) {
  const cached = path.join(CACHE_DIR, `plan_${depe}_${PLAN_YEAR}.pdf`);
  if (existsSync(cached)) return readFileSync(cached);

  const res = await fetch(planUrl(depe), { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar el plan ${depe}`);
  const type = res.headers.get('content-type') ?? '';
  if (!type.includes('pdf')) throw new Error(`El plan ${depe} no devolvió un PDF sino ${type}`);

  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cached, buf);
  return buf;
}

async function ingestProgram(db, universityId, depe) {
  const started = new Date().toISOString();
  const buffer = await fetchPlan(depe);
  const plan = await parsePlanPdf(buffer);
  // Falla antes de escribir nada si los datos no son consistentes.
  assertPlanIntegrity(plan, { source: `depe ${depe}` });

  const short = programShortName(plan.programName);
  const results = [];

  for (const specialty of plan.specialties) {
    const name = overrides[`${depe}:${specialty.index}`] ?? specialty.name;
    const slug = name ? specialtySlug(plan.programName, name) : slugify(short);
    const courses = plan.courses.filter((c) => c.specialtyIndex === specialty.index);

    if (DRY_RUN) {
      results.push({ slug, courses: courses.length, credits: specialty.credits, dryRun: true });
      continue;
    }

    const { data: program, error: pErr } = await db
      .from('programs')
      .upsert(
        {
          university_id: universityId,
          slug,
          // Se guarda ya capitalizado: es el texto que acaba en el <title> y el <h1>.
          name: titleCase(name ? `${short} - ${name}` : short),
          depe_code: depe,
          specialty_index: specialty.index,
          specialty_name: name ? titleCase(name) : null,
          plan_year: plan.planYear,
          total_credits: specialty.credits,
          source_url: planUrl(depe),
          source_fetched_at: new Date().toISOString(),
        },
        { onConflict: 'university_id,slug' },
      )
      .select('id')
      .single();
    if (pErr) throw pErr;

    const { error: cErr } = await db.from('courses').upsert(
      courses.map((c) => ({
        program_id: program.id,
        code: c.code,
        name: c.name,
        credits: c.credits,
        year: c.year,
        semester: c.semester,
        component: c.component,
        dept: c.dept,
        hours_theory: c.hours_theory,
        hours_seminar: c.hours_seminar,
        hours_theory_practice: c.hours_theory_practice,
        hours_practice: c.hours_practice,
        hours_lab: c.hours_lab,
      })),
      { onConflict: 'program_id,code' },
    );
    if (cErr) throw cErr;

    // Los prerrequisitos se reemplazan enteros: es más simple y seguro que
    // intentar reconciliar altas y bajas cuando la universidad cambia el plan.
    const { data: saved, error: sErr } = await db
      .from('courses')
      .select('id, code')
      .eq('program_id', program.id);
    if (sErr) throw sErr;

    const idByCode = new Map(saved.map((c) => [c.code, c.id]));
    const links = courses.flatMap((c) =>
      c.prerequisites.map((prereq) => ({ course_id: idByCode.get(c.code), prereq_code: prereq })),
    );
    await db.from('course_prerequisites').delete().in('course_id', [...idByCode.values()]);
    if (links.length) {
      const { error: prErr } = await db.from('course_prerequisites').insert(links);
      if (prErr) throw prErr;
    }

    results.push({ slug, courses: courses.length, credits: specialty.credits });

    await db.from('ingest_runs').insert({
      source: `unsa:plan:${depe}:${specialty.index}`,
      program_id: program.id,
      status: 'ok',
      stats: { courses: courses.length, credits: specialty.credits, prerequisites: links.length },
      started_at: started,
      finished_at: new Date().toISOString(),
    });
  }

  return results;
}

async function main() {
  const only = process.argv.slice(2);
  const codes = [...new Set(catalog.programs.map((p) => p.depe))].filter(
    (c) => only.length === 0 || only.includes(c),
  );
  if (!codes.length) throw new Error(`Sin códigos que procesar (argumentos: ${only.join(', ')})`);

  let db = null;
  let universityId = null;
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
  for (const depe of codes) {
    try {
      const results = await ingestProgram(db, universityId, depe);
      for (const r of results) {
        console.log(`[ingest] ${r.slug.padEnd(50)} ${String(r.courses).padStart(3)} asig  ${String(r.credits).padStart(4)} cred${r.dryRun ? '  (dry-run)' : ''}`);
      }
      ok += 1;
    } catch (err) {
      failures.push({ depe, message: err.message });
      console.error(`[ingest] FALLA ${depe}: ${err.message}`);
    }
  }

  console.log(`\n[ingest] escuelas procesadas: ${ok}/${codes.length}`);
  if (failures.length) {
    console.error(`[ingest] fallaron ${failures.length}: ${failures.map((f) => f.depe).join(', ')}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('[ingest] error fatal:', err.message);
  process.exit(1);
});
