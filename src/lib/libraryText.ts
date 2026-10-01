/**
 * Texto de la Biblioteca pública: rótulos y formato de nombres.
 *
 * Puro y sin dependencias para que lo importen tanto las funciones de render
 * (api/material.ts, api/library.ts) como el SPA. Una sola copia: si el rótulo de
 * un tipo cambiara en un sitio y no en otro, el HTML del servidor y el que pinta
 * React dirían cosas distintas (y Google renderiza ambos).
 */

/** Espejo de MaterialKind.label (unsap/lib/features/library/domain/entities/material_facets.dart). */
export const KIND_LABELS: Record<string, string> = {
  exam: 'Examen',
  continuous_assessment: 'Evaluación continua',
  lab: 'Laboratorio',
  tif: 'TIF',
  assignment: 'Trabajo',
  notes: 'Apuntes',
  summary: 'Resumen',
  slides: 'Diapositivas',
  syllabus: 'Sílabo',
  reading: 'Lectura',
  other: 'Material',
};

const KIND_PLURALS: Record<string, string> = {
  exam: 'exámenes',
  continuous_assessment: 'evaluaciones continuas',
  lab: 'laboratorios',
  tif: 'TIF',
  assignment: 'trabajos',
  notes: 'apuntes',
  summary: 'resúmenes',
  slides: 'diapositivas',
  syllabus: 'sílabos',
  reading: 'lecturas',
  other: 'otros materiales',
};

export const kindLabel = (kind: string | null | undefined) =>
  KIND_LABELS[kind ?? 'other'] ?? 'Material';

/** "3 exámenes, 2 apuntes y 1 sílabo" — de un mapa tipo → cantidad. */
export function describeKinds(counts: Record<string, number>): string {
  const parts = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([kind, n]) =>
      n === 1 ? `1 ${kindLabel(kind).toLowerCase()}` : `${n} ${KIND_PLURALS[kind] ?? 'materiales'}`,
    );
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}`;
}

const SMALL_WORDS = new Set([
  'a', 'al', 'ante', 'con', 'de', 'del', 'e', 'el', 'en', 'la', 'las', 'lo', 'los',
  'o', 'para', 'por', 'sin', 'sobre', 'u', 'y',
]);
const ROMAN = /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/i;
// Marca de electiva de la UNSA: "(E)", "( E )", "(E.)"… (ver scripts/seo/lib/electives.mjs).
const ELECTIVE_MARK = /\(\s*e\s*\.?\s*\)/gi;

/**
 * Los planes oficiales vienen en MAYÚSCULAS ("MATEMÁTICAS PARA ECONOMISTAS III
 * (E)"). En un título de página eso se lee como grito y Google lo reescribe.
 * Aquí: minúsculas, mayúscula inicial salvo palabras cortas, romanos en
 * mayúscula, sin la marca de electiva (se muestra aparte).
 */
export function displayCourseName(raw: string | null | undefined): string {
  const clean = (raw ?? '').replace(ELECTIVE_MARK, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  // Si ya viene en mayúsculas y minúsculas, alguien lo escribió a mano: se respeta.
  if (clean !== clean.toUpperCase()) return clean;
  return clean
    .toLowerCase()
    .split(' ')
    .map((word, i) => {
      if (ROMAN.test(word)) return word.toUpperCase();
      if (i > 0 && SMALL_WORDS.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

const YEAR_ORDINALS = ['', 'primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto', 'séptimo'];

/** "2.º año · 1.er semestre" en prosa: "segundo año, primer semestre". */
export function termLabel(year: number | null, term: number | null): string {
  if (!year) return '';
  const y = YEAR_ORDINALS[year] ?? `${year}.º`;
  if (!term) return `${y} año`;
  return `${y} año, ${term === 1 ? 'primer' : 'segundo'} semestre`;
}

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Neutraliza `</script>` dentro de JSON incrustado en HTML. */
export const escapeJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/-->/g, '--\\u003e');

export const truncate = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
