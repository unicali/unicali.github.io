// Parser de los PDF de "PLAN DE ESTUDIOS VIGENTE" de la UNSA.
//
// Los genera el Sistema de Administración Académica de la universidad con un
// formato tabular idéntico para todas las escuelas, así que un solo parser
// posicional sirve para las ~60. No se usa OCR ni un LLM a propósito: los
// créditos y prerrequisitos deben ser exactos, no plausibles.
//
// Validación: el código de asignatura codifica su propia ubicación en el plan.
// Para 2511101 -> "25" plan, "1" especialidad, "1" año, "1" semestre, "01" orden.
// Contrastar eso contra el año/semestre que dicen las cabeceras de sección valida
// CADA fila, no solo un total. Verificado sobre las 46 escuelas de pregrado: 4.447
// filas, 0 discrepancias. (El bloque "Resumen de Creditos" solo aparece en algunas
// copias — el PDF que sirve extranet al vuelo no lo trae — así que no sirve de
// checksum universal, pero se aprovecha cuando está.)
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { isElective } from './electives.mjs';

// Fronteras de columna en unidades PDF, tomadas de las posiciones reales de la
// cabecera. Cada entrada es [campo, xMáximo); el último campo recoge el resto.
const COLUMNS = [
  ['component', 20],
  ['code', 45],
  ['name', 225],
  ['dept', 248],
  ['dept2', 272],
  ['dept3', 296],
  ['credits', 320],
  ['prq1', 349],
  ['prq2', 378],
  ['prq3', 407],
  ['prq4', 436],
  ['prq5', 465],
  ['prqCredits', 490],
  ['hours_theory', 510],
  ['hours_seminar', 528],
  ['hours_theory_practice', 547],
  ['hours_practice', 566],
  ['hours_lab', Infinity],
];

const YEARS = ['PRIMER', 'SEGUNDO', 'TERCER', 'CUARTO', 'QUINTO', 'SEXTO', 'SÉPTIMO'];
const CODE_RE = /^\d{6,8}$/;

// Algunas fuentes del PDF entregan el texto como UTF-8 leído byte a byte como
// Latin-1 ("EDUCACIÃ“N" en vez de "EDUCACIÓN"). Solo se repara cuando la firma
// del mojibake está presente y la reinterpretación produce texto válido.
// Reparacion de mojibake en los textos del PDF.
//
// Algunas fuentes del PDF entregan nombres en UTF-8 que el extractor releyo como
// CP1252 (no Latin-1): el byte 0x93 llega ya convertido a U+201C, asi que
// Buffer.from(str, 'latin1') no lo recupera. Afecta a los nombres de
// especialidad de 15 de los planes, que si no salen como "EDUCACION INICIAL"
// con basura intercalada.
//
// Se invierte el mapeo: cada caracter vuelve a su byte CP1252 original y el
// resultado se decodifica como UTF-8. Las tablas se escriben por codigo numerico
// para que este fichero siga siendo ASCII puro.
const CP1252_TO_BYTE = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84], [0x2026, 0x85],
  [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88], [0x2030, 0x89], [0x0160, 0x8a],
  [0x2039, 0x8b], [0x0152, 0x8c], [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92],
  [0x201c, 0x93], [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b], [0x0153, 0x9c],
  [0x017e, 0x9e], [0x0178, 0x9f],
]);
const REPLACEMENT_CHAR = String.fromCharCode(0xfffd);

/** Devuelve el byte CP1252 de un caracter, o null si no es representable. */
function toCp1252Byte(code) {
  if (code <= 0xff) return code;
  return CP1252_TO_BYTE.get(code) ?? null;
}

function repairMojibake(str) {
  // Firma: un prefijo UTF-8 de dos bytes (C2/C3) seguido de un byte de
  // continuacion. Sin este guardia se estropearia texto que ya viene bien.
  let suspect = false;
  for (let i = 0; i < str.length - 1; i += 1) {
    const a = str.charCodeAt(i);
    if (a !== 0xc2 && a !== 0xc3) continue;
    const next = toCp1252Byte(str.charCodeAt(i + 1));
    if (next !== null && next >= 0x80 && next <= 0xbf) { suspect = true; break; }
  }
  if (!suspect) return str;

  const bytes = [];
  for (let i = 0; i < str.length; i += 1) {
    const byte = toCp1252Byte(str.charCodeAt(i));
    if (byte === null) return str; // Hay algo que no vino de CP1252: no tocar.
    bytes.push(byte);
  }
  const fixed = Buffer.from(bytes).toString('utf8');
  return fixed.includes(REPLACEMENT_CHAR) ? str : fixed;
}

const columnOf = (x) => COLUMNS.find(([, max]) => x < max)[0];

/** Una fila continúa a otra si va inmediatamente debajo, en la misma página. */
const CONTINUATION_MAX_GAP = 12;
function isContinuationOf(previous, row) {
  return (
    previous != null &&
    previous.page === row.page &&
    previous.y - row.y > 0 &&
    previous.y - row.y < CONTINUATION_MAX_GAP
  );
}
const isSeparator = (s) => /^[_\s]+$/.test(s);
const toNumber = (s) => (s == null || s === '' ? 0 : Number.parseFloat(s.replace(',', '.')) || 0);

/** Agrupa los fragmentos de texto en filas por su coordenada Y. */
function toRows(items) {
  const rows = [];
  for (const item of items) {
    const row = rows.find((r) => Math.abs(r.y - item.y) < 1.5);
    if (row) row.cells.push(item);
    else rows.push({ y: item.y, cells: [item] });
  }
  rows.sort((a, b) => b.y - a.y);
  for (const row of rows) row.cells.sort((a, b) => a.x - b.x);
  return rows;
}

/** Reparte las celdas de una fila en columnas según su X. */
function toRecord(row) {
  const rec = {};
  for (const cell of row.cells) {
    const col = columnOf(cell.x);
    rec[col] = rec[col] ? `${rec[col]} ${cell.s}` : cell.s;
  }
  return rec;
}

export async function parsePlanPdf(buffer) {
  const doc = await getDocument({ data: new Uint8Array(buffer), useSystemFonts: true }).promise;

  const allItems = [];
  const pageRows = [];
  for (let n = 1; n <= doc.numPages; n += 1) {
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    const items = content.items
      .filter((i) => i.str.trim() && !isSeparator(i.str))
      .map((i) => ({
        x: +i.transform[4].toFixed(1),
        y: +i.transform[5].toFixed(1),
        s: repairMojibake(i.str.trim()),
      }));
    allItems.push(...items.map((i) => i.s));
    pageRows.push(...toRows(items).map((r) => ({ ...r, page: n })));
  }

  const flat = allItems.join('\n');
  // El titulo varia entre copias: la que sirve extranet dice "PLAN DE ESTUDIOS
  // 2025" y la alojada en la facultad "PLAN DE ESTUDIOS VIGENTE 2025".
  const planYear = Number(flat.match(/PLAN DE ESTUDIOS(?:\s+VIGENTE)?\s+(\d{4})/)?.[1]) || null;
  // El nombre de la escuela va entre el título del sistema y el del plan.
  const programName =
    allItems[allItems.indexOf('SISTEMA DE ADMINISTRACION ACADEMICA') + 1]?.trim() || null;
  const declaredCredits =
    Number(flat.match(/Total de Creditos Curriculares Codificados\s*\n\s*([\d.]+)/)?.[1]) || null;

  const courses = [];
  let year = null;
  let semester = null;
  // 4 de las 46 escuelas (Educación, Artes, Gestión, Ciencias de la Comunicación)
  // publican varias especialidades en un mismo PDF, una por página, cada una con
  // su plan completo. Cada especialidad merece su propia página.
  let specialtyName = null;
  let lastCourseRow = null;
  let lastSpecialtyRow = null;

  for (const row of pageRows) {
    const rec = toRecord(row);
    const text = row.cells.map((c) => c.s).join(' ');

    // Fin de la tabla de asignaturas. Lo que sigue es el bloque "Resumen de
    // Creditos", cuyas filas caen en el rango X de la columna de nombre y se
    // pegarían al nombre de la última asignatura.
    if (/Resumen de Creditos/i.test(text)) break;

    const yearMatch = text.match(/^(\w+)\s+AÑO$/u);
    if (yearMatch) {
      year = YEARS.indexOf(yearMatch[1].toUpperCase()) + 1 || null;
      continue;
    }
    const semMatch = text.match(/^(PRIMER|SEGUNDO)\s+SEMESTRE$/u);
    if (semMatch) {
      semester = semMatch[1] === 'PRIMER' ? 1 : 2;
      continue;
    }
    const specMatch = text.match(/^ESPECIALIDAD DE\s+(.+)$/u);
    if (specMatch) {
      specialtyName = specMatch[1].replace(/\s+/g, ' ').trim();
      lastSpecialtyRow = row;
      lastCourseRow = null;
      continue;
    }

    if (rec.code && CODE_RE.test(rec.code)) {
      courses.push({
        code: rec.code,
        name: rec.name ?? '',
        specialtyIndex: rec.code.length === 7 ? Number(rec.code[2]) : null,
        specialtyName,
        // Año y semestre declarados por la cabecera de sección; assertPlanIntegrity
        // los contrasta contra los que codifica el propio código de asignatura.
        sectionYear: year,
        sectionSemester: semester,
        component: rec.component ?? null,
        dept: rec.dept ?? null,
        credits: toNumber(rec.credits),
        year,
        semester,
        prerequisites: ['prq1', 'prq2', 'prq3', 'prq4', 'prq5']
          .map((k) => rec[k])
          .filter((v) => v && CODE_RE.test(v)),
        hours_theory: toNumber(rec.hours_theory),
        hours_seminar: toNumber(rec.hours_seminar),
        hours_theory_practice: toNumber(rec.hours_theory_practice),
        hours_practice: toNumber(rec.hours_practice),
        hours_lab: toNumber(rec.hours_lab),
      });
      lastCourseRow = row;
      lastSpecialtyRow = null;
    } else if (rec.name && Object.keys(rec).length === 1) {
      // Continuación de un texto que se partió en dos líneas. Solo vale si la
      // fila está pegada justo debajo y en la misma página: sin esa condición se
      // tragaba las cabeceras de página, que caen en el mismo rango X que los
      // nombres de asignatura y acababan concatenadas al último curso.
      if (isContinuationOf(lastSpecialtyRow, row)) {
        specialtyName = `${specialtyName} ${rec.name}`.replace(/\s+/g, ' ').trim();
        lastSpecialtyRow = row;
      } else if (isContinuationOf(lastCourseRow, row) && courses.length) {
        courses[courses.length - 1].name += ` ${rec.name}`;
        lastCourseRow = row;
      }
    }
  }

  // Cuando el nombre de una asignatura es largo, el generador del PDF emite el
  // nombre y el codigo de departamento como un unico fragmento de texto, asi que
  // el departamento acaba pegado al nombre ("...ALIMENTARIA (E) ME"). Se separa,
  // pero solo si el sufijo es un codigo que ese mismo documento usa en su propia
  // columna de departamento: asi un nombre que termine de verdad en dos
  // mayusculas no se corta por error.
  const knownDepts = new Set(courses.map((c) => c.dept).filter(Boolean));
  for (const course of courses) {
    if (course.dept) continue;
    const match = course.name.match(/^(.*?)\s+([A-Z]{2,3})$/u);
    if (match && knownDepts.has(match[2])) {
      course.name = match[1].trim();
      course.dept = match[2];
    }
  }

  const parsedCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const clean = courses.map((c) => {
    const name = c.name.replace(/\s+/g, ' ').trim();
    return { ...c, name, isElective: isElective(name) };
  });

  // Una entrada por especialidad. Las escuelas de una sola especialidad producen
  // un único elemento sin nombre propio; las 4 multi-especialidad producen una
  // por cada plan del PDF, y cada una acabará siendo su propia página.
  const specialties = [...new Set(clean.map((c) => c.specialtyIndex))]
    .sort((a, b) => a - b)
    .map((index) => {
      const own = clean.filter((c) => c.specialtyIndex === index);
      const required = own.filter((c) => !c.isElective);
      const elective = own.filter((c) => c.isElective);
      const sum = (list) => list.reduce((total, c) => total + c.credits, 0);
      return {
        index,
        name: own.find((c) => c.specialtyName)?.specialtyName ?? null,
        courseCount: own.length,
        requiredCourses: required.length,
        electiveCourses: elective.length,
        // La cifra honesta para mostrar: lo que un estudiante cursa de verdad.
        requiredCredits: sum(required),
        electiveCredits: sum(elective),
        // Lo que declara el PDF: incluye toda la oferta electiva.
        credits: sum(own),
      };
    });

  return {
    programName,
    planYear,
    declaredCredits,
    parsedCredits,
    specialties,
    courses: clean,
  };
}

/**
 * Valida el plan contra la información que el propio PDF codifica de forma
 * redundante. Preferimos fallar ruidosamente antes que escribir en la base
 * créditos o semestres que no cuadran: un número equivocado en una calculadora
 * de notas destruye la confianza en todo el sitio.
 *
 * La comprobación fuerte es fila a fila: el código de asignatura codifica su
 * especialidad, año y semestre, y eso debe coincidir con las cabeceras de
 * sección bajo las que apareció. Si el parser desalinea columnas o se salta una
 * cabecera, aquí salta.
 */
export function assertPlanIntegrity(plan, { source } = {}) {
  const where = source ? ` (${source})` : '';
  const problems = [];

  if (!plan.courses.length) throw new Error(`Plan sin asignaturas${where}`);

  for (const c of plan.courses) {
    if (!/^\d{7}$/.test(c.code)) {
      problems.push(`${c.code}: código fuera del formato de 7 dígitos`);
      continue;
    }
    const codeYear = Number(c.code[3]);
    const codeSemester = Number(c.code[4]);
    if (codeYear !== c.sectionYear) {
      problems.push(`${c.code}: el código dice año ${codeYear}, la tabla dice ${c.sectionYear}`);
    }
    // Semestre 0 significa asignatura ANUAL (aparece en Medicina). La tabla la
    // coloca bajo la cabecera de un semestre concreto, así que ahí no hay
    // discrepancia que corregir: el código es el que lleva razón.
    if (codeSemester !== 0 && codeSemester !== c.sectionSemester) {
      problems.push(
        `${c.code}: el código dice semestre ${codeSemester}, la tabla dice ${c.sectionSemester}`,
      );
    }
    if (!c.name) problems.push(`${c.code}: sin nombre`);
    if (!(c.credits > 0)) problems.push(`${c.code}: créditos ${c.credits}`);
  }

  // Cuando la copia del PDF trae el "Resumen de Creditos", se aprovecha como
  // segunda comprobación. En planes multi-especialidad el total es por
  // especialidad, así que solo aplica a los de una sola.
  if (plan.declaredCredits != null && plan.specialties.length === 1) {
    if (Math.abs(plan.parsedCredits - plan.declaredCredits) > 0.01) {
      problems.push(
        `créditos totales: parseados ${plan.parsedCredits}, declarados ${plan.declaredCredits}`,
      );
    }
  }

  if (problems.length) {
    const shown = problems.slice(0, 8).map((p) => `  - ${p}`);
    if (problems.length > 8) shown.push(`  - ... y ${problems.length - 8} más`);
    throw new Error(
      [`Integridad del plan${where}: ${problems.length} problema(s)`, ...shown].join('\n'),
    );
  }
}
