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

// Las minúsculas de enlace no se capitalizan salvo que abran el nombre. Sin esto
// los títulos saldrían como "Ingeniería De Sistemas", que se lee peor que el
// original en mayúsculas.
const MINOR_WORDS = new Set([
  'de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'en', 'a', 'con', 'para', 'por', 'u', 'o',
]);

/**
 * Los planes de la UNSA vienen enteramente en mayúsculas ("ECONOMÍA",
 * "INGENIERÍA DE SISTEMAS"). Mostrarlos así en un <title> o un <h1> se lee como
 * un grito y empeora el fragmento en resultados de búsqueda, así que se pasan a
 * capitalización de título en español.
 */
export function titleCase(str) {
  let isFirst = true;
  return str.toLocaleLowerCase('es').replace(/[\p{L}\p{N}]+/gu, (word) => {
    const minor = MINOR_WORDS.has(word);
    const capitalized = minor && !isFirst ? word : word[0].toLocaleUpperCase('es') + word.slice(1);
    isFirst = false;
    return capitalized;
  });
}
