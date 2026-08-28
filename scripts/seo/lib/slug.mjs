// Slugs de URL a partir de nombres de escuela/especialidad de la UNSA.

const STRIP_PREFIX = /^ESCUELA PROFESIONAL DE\s+/iu;

export function deaccent(str) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function slugify(str) {
  return deaccent(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** "ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS" -> "Ingeniería de Sistemas" */
export function programShortName(programName) {
  return programName.replace(STRIP_PREFIX, '').trim();
}

/**
 * Slug de una especialidad dentro de una escuela. Se combinan ambos nombres y se
 * eliminan los tokens repetidos, para que "Educación" + "Educación Inicial" dé
 * "educacion-inicial" en vez de "educacion-educacion-inicial", pero "Educación" +
 * "Físico Matemática" siga dando "educacion-fisico-matematica", que sin el
 * nombre de la escuela sería ambiguo.
 */
export function specialtySlug(programName, specialtyName) {
  const tokens = [
    ...slugify(programShortName(programName)).split('-'),
    ...slugify(specialtyName).split('-'),
  ].filter(Boolean);

  const seen = new Set();
  return tokens.filter((t) => (seen.has(t) ? false : seen.add(t))).join('-');
}
