// Cliente del Sistema Académico público de la UNSA (SISACAD).
//
// Es la fuente PREFERIDA para planes de estudio. Sustituye al parseo posicional
// de los PDF, que sigue disponible como respaldo en lib/parse-plan.mjs.
//
// Endpoints (HTTP plano; el host rechaza el puerto 443):
//
//   /sisacad/escuela/index.php3
//       Directorio oficial: facultad -> código de escuela -> nombre. Evita tener
//       que barrer el espacio de códigos por fuerza bruta.
//
//   /sisacad/escuela/plan_estudios_datos.php3?codi_depe=<codigo>[&cplan=<año>]
//       Plan de estudios completo en tablas HTML. Sin cplan devuelve el vigente;
//       el <select name=cplan> de la respuesta lista los años disponibles.
//
// Por qué es mejor que el PDF, con nombres y apellidos:
//
//   - UTF-8 limpio. El PDF pierde la distinción entre Á e Í (los bytes 0x81 y
//     0x8D no existen en CP1252 y el extractor los colapsa), lo que obligaba a
//     corregir a mano nombres como "FÍSICO MATEMÁTICA".
//   - 8 columnas de prerrequisitos en lugar de 5: el PDF los trunca.
//   - Celdas HTML explícitas, sin adivinar fronteras de columna por coordenada X.
//   - Planes históricos vía cplan.
//
// Aviso sobre la codificación: la página MEZCLA dos codificaciones. Los nombres
// de asignatura vienen en UTF-8 (Í = C3 8D) y el <h2> con el nombre de la
// escuela viene en Latin-1 (Í = CD). Por eso el documento se lee como latin1
// —que es una correspondencia byte a byte sin pérdida— y cada campo se
// reinterpreta como UTF-8 solo si el resultado es válido. Decodificar el
// documento entero de una sola forma rompe la mitad de los campos, se elija la
// que se elija.

import { isElective } from './electives.mjs';

const BASE = 'http://extranet.unsa.edu.pe/sisacad/escuela';
const TIMEOUT_MS = 30_000;

async function getText(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`HTTP ${response.status} en ${url}`);
  // latin1 mapea cada byte a un carácter sin pérdida, así que el buffer original
  // se puede reconstruir campo a campo. decodeField hace el resto.
  return Buffer.from(await response.arrayBuffer()).toString('latin1');
}

const REPLACEMENT_CHAR = String.fromCharCode(0xfffd);

/**
 * Reinterpreta un campo como UTF-8 si sus bytes forman UTF-8 válido; si no, lo
 * deja como Latin-1. Es lo que permite que "LINGÜÍSTICA" (UTF-8) y "ECONOMÍA"
 * (Latin-1) salgan ambos bien del mismo documento.
 */
function decodeField(value) {
  const asUtf8 = Buffer.from(value, 'latin1').toString('utf8');
  return asUtf8.includes(REPLACEMENT_CHAR) ? value : asUtf8;
}

export const planUrl = (depe, planYear) =>
  `${BASE}/plan_estudios_datos.php3?codi_depe=${depe}` + (planYear ? `&cplan=${planYear}` : '');

export const directoryUrl = () => `${BASE}/index.php3`;

const stripTags = (html) =>
  decodeField(html)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&Ntilde;/g, 'Ñ')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&Aacute;/g, 'Á')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó')
    .replace(/&Uacute;/g, 'Ú')
    .replace(/�/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Directorio de escuelas de pregrado: facultad, código y nombre.
 *
 * El nombre que devuelve el directorio viene truncado por el servidor, así que
 * sirve para orientarse pero el nombre bueno sale del propio plan.
 */
export async function fetchSchoolDirectory() {
  const html = await getText(directoryUrl());
  const schools = [];
  let faculty = null;

  for (const row of html.split(/<tr\b/i).slice(1)) {
    // El nombre de facultad va en una celda con rowspan que abarca sus escuelas.
    const facultyMatch = row.match(/rowspan=\d+[^>]*>.*?<font color="#990000" size=-1>([^<]+)/is);
    if (facultyMatch) faculty = stripTags(facultyMatch[1]);

    const match = row.match(/escuela\((\d+),/);
    if (!match) continue;
    const nameMatch = row.match(/<a href=javascript:escuela\(\d+,[^>]*>([^<]*)<\/a>/i);
    schools.push({
      depe: match[1],
      faculty,
      name: nameMatch ? stripTags(nameMatch[1]) : null,
    });
  }

  return schools;
}

// Orden real de las columnas de la tabla. Difiere del PDF en las horas: aquí es
// TEOR, PRAC, T.PR, SEMI, LAB; en el PDF es TEOR, SEMI, T.PR, PRAC, LAB.
// Confundirlas asigna horas de práctica a seminario sin que nada falle.
const COLUMNS = [
  'component',
  'code',
  'name',
  'dept',
  'dept2',
  'dept3',
  'credits',
  'prq1',
  'prq2',
  'prq3',
  'prq4',
  'prq5',
  'prq6',
  'prq7',
  'prq8',
  'prqCredits',
  'hours_theory',
  'hours_practice',
  'hours_theory_practice',
  'hours_seminar',
  'hours_lab',
];

const YEARS = ['PRIMER', 'SEGUNDO', 'TERCER', 'CUARTO', 'QUINTO', 'SEXTO', 'SEPTIMO'];

/**
 * Normaliza una cabecera para compararla: la tabla escribe los rótulos con las
 * letras separadas ("P R I M E R   A Ñ O") y con entidades HTML, así que hay que
 * quitar espacios y acentos antes de comparar.
 */
const headerKey = (text) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase();
const CODE_RE = /^\d{6,8}$/;
const toNumber = (value) =>
  value == null || value === '' ? 0 : Number.parseFloat(String(value).replace(',', '.')) || 0;

/** Años de plan que ofrece el desplegable de la respuesta. */
export function availablePlanYears(html) {
  const select = html.match(/<select[^>]*name=cplan[\s\S]*?<\/select>/i)?.[0] ?? '';
  return [...select.matchAll(/value="(\d{4})"/g)].map((m) => Number(m[1]));
}

/**
 * Parsea la respuesta de plan_estudios_datos.php3.
 *
 * Devuelve la misma forma que parsePlanPdf, para que el resto del pipeline no
 * tenga que saber de qué fuente vinieron los datos.
 */
export function parsePlanHtml(html) {
  // El <h2> viene en Latin-1 mientras las asignaturas vienen en UTF-8; stripTags
  // resuelve cada campo por separado.
  const programName = stripTags(html.match(/<h2>([\s\S]*?)<\/h2>/i)?.[1] ?? '') || null;
  const planYear = Number(
    html.match(/<option SELECTED value="(\d{4})"/i)?.[1] ?? availablePlanYears(html)[0] ?? 0,
  );

  const courses = [];
  let year = null;
  let semester = null;
  let specialtyName = null;

  for (const rawRow of html.split(/<tr\b/i).slice(1)) {
    const cells = [...rawRow.matchAll(/<td\b[^>]*>([\s\S]*?)(?=<\/td>|<td\b|<\/tr>|$)/gi)].map((m) =>
      stripTags(m[1]),
    );
    if (!cells.length) continue;

    const rowText = cells.join(' ').replace(/\s+/g, ' ').trim();

    // Las cabeceras de sección son una única celda con colspan.
    if (cells.filter(Boolean).length === 1) {
      const key = headerKey(rowText);
      const yearMatch = YEARS.findIndex((label) => key === `${label}ANO`);
      if (yearMatch >= 0) {
        year = yearMatch + 1;
        continue;
      }
      if (key === 'PRIMERSEMESTRE') {
        semester = 1;
        continue;
      }
      if (key === 'SEGUNDOSEMESTRE') {
        semester = 2;
        continue;
      }
      const specialty = rowText.match(/^ESPECIALIDAD DE\s+(.+)$/iu);
      if (specialty) {
        const value = specialty[1].trim();
        // Los planes antiguos escriben "ESPECIALIDAD DE NINGUNO" cuando no hay
        // ninguna; tomarlo al pie de la letra produce slugs como
        // "ingenieria-mecanica-electrica-ninguno".
        specialtyName = /^ningun[oa]$/i.test(value) ? null : value;
        continue;
      }
    }

    const record = {};
    COLUMNS.forEach((column, index) => {
      record[column] = cells[index] ?? '';
    });

    if (!CODE_RE.test(record.code)) continue;

    courses.push({
      code: record.code,
      name: record.name,
      // Se marca aquí, en cada asignatura, y no solo en el resumen: la ingesta
      // guarda este campo y sin él todas las electivas entran como obligatorias.
      isElective: isElective(record.name),
      component: record.component || null,
      dept: record.dept || null,
      credits: toNumber(record.credits),
      // El código es la fuente canónica de la ubicación; la cabecera se conserva
      // aparte para poder contrastarla (ver assertPlanIntegrity). Importa en
      // Medicina, cuyas asignaturas anuales llevan semestre 0 en el código pero
      // la tabla las coloca bajo una cabecera de semestre cualquiera.
      year: record.code.length === 7 ? Number(record.code[3]) : year,
      semester: record.code.length === 7 ? Number(record.code[4]) : semester,
      sectionYear: year,
      sectionSemester: semester,
      specialtyIndex: record.code.length === 7 ? Number(record.code[2]) : null,
      specialtyName,
      prerequisites: ['prq1', 'prq2', 'prq3', 'prq4', 'prq5', 'prq6', 'prq7', 'prq8']
        .map((key) => record[key])
        .filter((value) => value && CODE_RE.test(value)),
      hours_theory: toNumber(record.hours_theory),
      hours_seminar: toNumber(record.hours_seminar),
      hours_theory_practice: toNumber(record.hours_theory_practice),
      hours_practice: toNumber(record.hours_practice),
      hours_lab: toNumber(record.hours_lab),
    });
  }

  // Mismo resumen por especialidad que produce parsePlanPdf, para que el resto
  // del pipeline no tenga que saber de qué fuente vinieron los datos.
  const specialties = [...new Set(courses.map((course) => course.specialtyIndex))]
    .sort((a, b) => a - b)
    .map((index) => {
      const own = courses.filter((course) => course.specialtyIndex === index);
      const req = own.filter((course) => !isElective(course.name));
      const ele = own.filter((course) => isElective(course.name));
      const total = (list) => list.reduce((acc, course) => acc + course.credits, 0);
      return {
        index,
        name: own.find((course) => course.specialtyName)?.specialtyName ?? null,
        courseCount: own.length,
        requiredCourses: req.length,
        electiveCourses: ele.length,
        requiredCredits: total(req),
        electiveCredits: total(ele),
        credits: total(own),
      };
    });

  return {
    programName,
    planYear,
    specialties,
    courses,
    parsedCredits: courses.reduce((total, course) => total + course.credits, 0),
    availableYears: availablePlanYears(html),
    // El HTML no trae el bloque "Resumen de Creditos" del PDF; assertPlanIntegrity
    // lo trata como opcional y valida fila a fila, que es la comprobación fuerte.
    declaredCredits: null,
  };
}

export async function fetchPlan(depe, planYear) {
  const html = await getText(planUrl(depe, planYear));
  return { html, ...parsePlanHtml(html) };
}
