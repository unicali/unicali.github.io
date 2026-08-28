// Herramienta de análisis de los planes de estudio ya descargados.
//
//   node scripts/seo/analyze-plans.mjs                # resumen de las 46 escuelas
//   node scripts/seo/analyze-plans.mjs --markers      # variantes del marcador de electiva
//   node scripts/seo/analyze-plans.mjs --detail 470   # desglose de una escuela
//
// Lee de SISACAD, la misma fuente que la ingesta, así que funciona en un clon
// limpio sin nada cacheado. Existe porque el número que importa —cuántos créditos
// cursa realmente un estudiante— no está escrito en ninguna parte del plan: hay
// que derivarlo, y derivarlo mal significa publicar una cifra falsa en la que
// alguien va a basar decisiones sobre su carrera.
import { fetchPlan, fetchSchoolDirectory } from './lib/sisacad.mjs';
import { isElective, ELECTIVE_PATTERN } from './lib/electives.mjs';

/** Desglose de créditos de una especialidad, separando obligatorio de electivo. */
export function creditBreakdown(courses) {
  const required = courses.filter((course) => !isElective(course.name));
  const elective = courses.filter((course) => isElective(course.name));
  const sum = (list) => list.reduce((total, course) => total + course.credits, 0);
  return {
    courses: courses.length,
    requiredCourses: required.length,
    electiveCourses: elective.length,
    requiredCredits: sum(required),
    electiveCredits: sum(elective),
    codedCredits: sum(courses),
  };
}

async function loadAll() {
  const directory = await fetchSchoolDirectory();
  const plans = [];
  for (const school of directory) {
    try {
      const plan = await fetchPlan(school.depe);
      if (!plan.courses.length) continue;
      plans.push({ depe: school.depe, plan });
    } catch (err) {
      console.error(`[analyze] ${school.depe} (${school.name}): ${err.message}`);
    }
  }
  return plans;
}

/**
 * Cataloga cómo aparece el marcador de electiva. Se hace explícito porque toda la
 * separación obligatorio/electivo depende de acertar con estas variantes, y el
 * PDF no es consistente: hay "(E)", "( E )", "(E )"...
 */
async function reportMarkers() {
  const variants = new Map();
  const suspicious = [];

  for (const { depe, plan } of await loadAll()) {
    for (const course of plan.courses) {
      const match = course.name.match(/\(([^)]*)\)\s*$/);
      if (match) {
        const key = `(${match[1]})`;
        variants.set(key, (variants.get(key) ?? 0) + 1);
      }
      // Paréntesis con una E en cualquier posición que el patrón no capture:
      // señal de que se está perdiendo una variante.
      if (/\(\s*E\s*\)/i.test(course.name) && !isElective(course.name)) {
        suspicious.push(`${depe} ${course.code} ${course.name}`);
      }
    }
  }

  console.log(`Patrón en uso: ${ELECTIVE_PATTERN}\n`);
  console.log('Variantes de paréntesis final encontradas:');
  for (const [variant, count] of [...variants].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(4)}  ${JSON.stringify(variant)}  ${isElective(`X ${variant}`) ? '-> ELECTIVA' : ''}`);
  }
  if (suspicious.length) {
    console.log(`\nNo capturadas por el patrón (${suspicious.length}):`);
    for (const item of suspicious.slice(0, 15)) console.log(`  ${item}`);
  } else {
    console.log('\nNinguna variante con E se escapa al patrón.');
  }
}

async function reportDetail(depe) {
  const plan = await fetchPlan(depe);

  console.log(`${plan.programName} — plan ${plan.planYear}\n`);
  for (const specialty of plan.specialties) {
    const courses = plan.courses.filter((c) => c.specialtyIndex === specialty.index);
    const b = creditBreakdown(courses);
    console.log(`Especialidad ${specialty.index}: ${specialty.name ?? '(única)'}`);
    console.log(`  obligatorias ${String(b.requiredCourses).padStart(3)} = ${String(b.requiredCredits).padStart(4)} créditos`);
    console.log(`  electivas    ${String(b.electiveCourses).padStart(3)} = ${String(b.electiveCredits).padStart(4)} créditos ofertados`);
    console.log(`  codificados  ${String(b.courses).padStart(3)} = ${String(b.codedCredits).padStart(4)} créditos`);

    const bySemester = new Map();
    for (const course of courses) {
      const key = `${course.year}-${course.semester}`;
      bySemester.set(key, (bySemester.get(key) ?? 0) + (isElective(course.name) ? 0 : course.credits));
    }
    const loads = [...bySemester.entries()].sort();
    console.log(`  carga obligatoria por semestre: ${loads.map(([k, v]) => `${k}:${v}`).join(' ')}`);
    console.log('');
  }
}

async function reportSummary() {
  const rows = [];
  for (const { depe, plan } of await loadAll()) {
    for (const specialty of plan.specialties) {
      const courses = plan.courses.filter((c) => c.specialtyIndex === specialty.index);
      const b = creditBreakdown(courses);
      rows.push({
        depe,
        name: `${plan.programName}${specialty.name ? ` / ${specialty.name}` : ''}`,
        ...b,
      });
    }
  }

  rows.sort((a, b) => b.codedCredits - a.codedCredits);
  console.log(
    'depe  obligatorias  cred.oblig  electivas  cred.elect  codificados  escuela',
  );
  for (const row of rows) {
    console.log(
      `${row.depe.padEnd(5)} ${String(row.requiredCourses).padStart(12)} ` +
        `${String(row.requiredCredits).padStart(11)} ${String(row.electiveCourses).padStart(10)} ` +
        `${String(row.electiveCredits).padStart(11)} ${String(row.codedCredits).padStart(12)}  ` +
        row.name.slice(0, 52),
    );
  }

  const required = rows.map((r) => r.requiredCredits);
  const outliers = rows.filter((r) => r.requiredCredits < 150 || r.requiredCredits > 300);
  console.log(`\nProgramas: ${rows.length}`);
  console.log(
    `Créditos obligatorios — min ${Math.min(...required)}, max ${Math.max(...required)}, ` +
      `mediana ${[...required].sort((a, b) => a - b)[Math.floor(required.length / 2)]}`,
  );
  console.log(`Fuera del rango 150-300 de créditos obligatorios: ${outliers.length}`);
  for (const row of outliers) {
    console.log(`  ${row.depe} ${row.name.slice(0, 46)} -> ${row.requiredCredits}`);
  }
}

const args = process.argv.slice(2);
const run = args.includes('--markers')
  ? reportMarkers()
  : args.includes('--detail')
    ? reportDetail(args[args.indexOf('--detail') + 1])
    : reportSummary();

run.catch((err) => {
  console.error('[analyze] error:', err.message);
  process.exit(1);
});
