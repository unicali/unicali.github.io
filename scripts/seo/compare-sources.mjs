// Contrasta la fuente HTML (SISACAD) con la fuente PDF para las mismas escuelas.
//
//   node scripts/seo/compare-sources.mjs           # todas las cacheadas
//   node scripts/seo/compare-sources.mjs 470 461   # solo esas
//
// Dos extractores independientes leyendo el mismo plan tienen que coincidir en
// códigos, créditos y ubicación de cada asignatura. Cuando no coinciden, uno de
// los dos está mal y hay que saber cuál ANTES de publicar la cifra.
//
// Se mantiene aunque el pipeline ya use HTML: es la red de seguridad para
// detectar que la universidad ha cambiado el formato de una de las dos fuentes.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parsePlanPdf } from './lib/parse-plan.mjs';
import { fetchPlan, fetchSchoolDirectory } from './lib/sisacad.mjs';
import { isElective } from './lib/electives.mjs';

const CACHE_DIR = path.resolve(process.cwd(), '.cache/plans');
const PLAN_YEAR = 2025;

const sum = (courses) => courses.reduce((total, course) => total + course.credits, 0);
const required = (courses) => courses.filter((course) => !isElective(course.name));

/**
 * Descarga el PDF si no está cacheado, para que la comparación funcione en un
 * clon limpio. El PDF solo existe para el año que se le pida; si esa escuela no
 * lo tiene, se omite y se dice por qué.
 */
async function ensurePdf(depe) {
  const file = path.join(CACHE_DIR, `plan_${depe}_${PLAN_YEAR}.pdf`);
  if (existsSync(file)) return file;
  try {
    const url = `http://extranet.unsa.edu.pe/tmp/plan_${depe}_${PLAN_YEAR}.pdf`;
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) return null;
    if (!(response.headers.get('content-type') ?? '').includes('pdf')) return null;
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(file, Buffer.from(await response.arrayBuffer()));
    return file;
  } catch {
    return null;
  }
}

async function compare(depe) {
  const pdfPath = await ensurePdf(depe);
  if (!pdfPath) return { depe, skip: `sin PDF ${PLAN_YEAR} disponible` };

  const [pdf, html] = await Promise.all([
    parsePlanPdf(readFileSync(pdfPath)),
    fetchPlan(depe, PLAN_YEAR),
  ]);

  if (!pdf.courses.length) return { depe, skip: 'PDF sin asignaturas (posgrado)' };

  const pdfCodes = new Set(pdf.courses.map((course) => course.code));
  const htmlCodes = new Set(html.courses.map((course) => course.code));
  const onlyPdf = [...pdfCodes].filter((code) => !htmlCodes.has(code));
  const onlyHtml = [...htmlCodes].filter((code) => !pdfCodes.has(code));

  const htmlByCode = new Map(html.courses.map((course) => [course.code, course]));
  const creditMismatch = [];
  const placeMismatch = [];
  for (const course of pdf.courses) {
    const twin = htmlByCode.get(course.code);
    if (!twin) continue;
    if (Math.abs(course.credits - twin.credits) > 0.01) {
      creditMismatch.push(`${course.code} pdf=${course.credits} html=${twin.credits}`);
    }
    if (course.year !== twin.year || course.semester !== twin.semester) {
      placeMismatch.push(
        `${course.code} pdf=${course.year}-${course.semester} html=${twin.year}-${twin.semester}`,
      );
    }
  }

  const pdfPrereqs = pdf.courses.reduce((n, c) => n + c.prerequisites.length, 0);
  const htmlPrereqs = html.courses.reduce((n, c) => n + c.prerequisites.length, 0);

  return {
    depe,
    pdfCourses: pdf.courses.length,
    htmlCourses: html.courses.length,
    pdfCredits: sum(pdf.courses),
    htmlCredits: sum(html.courses),
    pdfRequired: sum(required(pdf.courses)),
    htmlRequired: sum(required(html.courses)),
    onlyPdf,
    onlyHtml,
    creditMismatch,
    placeMismatch,
    pdfPrereqs,
    htmlPrereqs,
  };
}

async function main() {
  const only = process.argv.slice(2);
  const codes = (only.length ? only : (await fetchSchoolDirectory()).map((s) => s.depe)).filter(
    Boolean,
  );

  let clean = 0;
  const problems = [];
  let extraPrereqs = 0;

  for (const depe of codes) {
    let result;
    try {
      result = await compare(depe);
    } catch (err) {
      console.log(`ERROR ${depe}: ${err.message}`);
      problems.push(depe);
      continue;
    }
    if (result.skip) continue;

    const issues = [
      result.onlyPdf.length && `${result.onlyPdf.length} solo en PDF`,
      result.onlyHtml.length && `${result.onlyHtml.length} solo en HTML`,
      result.creditMismatch.length && `${result.creditMismatch.length} créditos distintos`,
      result.placeMismatch.length && `${result.placeMismatch.length} ubicaciones distintas`,
    ].filter(Boolean);

    extraPrereqs += result.htmlPrereqs - result.pdfPrereqs;

    if (issues.length) {
      problems.push(depe);
      console.log(
        `DIFIERE ${depe}  pdf ${result.pdfCourses}/${result.pdfCredits}cr  ` +
          `html ${result.htmlCourses}/${result.htmlCredits}cr  -> ${issues.join(', ')}`,
      );
      for (const detail of [...result.creditMismatch, ...result.placeMismatch].slice(0, 4)) {
        console.log(`        ${detail}`);
      }
      if (result.onlyPdf.length) console.log(`        solo PDF: ${result.onlyPdf.slice(0, 6).join(', ')}`);
      if (result.onlyHtml.length) console.log(`        solo HTML: ${result.onlyHtml.slice(0, 6).join(', ')}`);
    } else {
      clean += 1;
    }
  }

  console.log(`\nEscuelas comparadas: ${clean + problems.length}`);
  console.log(`  idénticas en códigos, créditos y ubicación: ${clean}`);
  console.log(`  con diferencias: ${problems.length}${problems.length ? ` (${problems.join(', ')})` : ''}`);
  console.log(`  prerrequisitos extra que aporta el HTML: ${extraPrereqs}`);
  if (problems.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error('[compare] error:', err.message);
  process.exit(1);
});
