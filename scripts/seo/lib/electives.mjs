// Detección de asignaturas electivas en los planes de la UNSA.
//
// La UNSA marca las electivas con "(E)" al final del nombre de la asignatura.
// Separarlas bien no es un detalle cosmético: los planes listan TODA la oferta
// electiva, no lo que cursa un estudiante. En Artes-Música son 200 electivas de
// 259 asignaturas (un estudiante elige un instrumento, el plan lista todos), así
// que sumar todo da 974 créditos cuando el recorrido real ronda los 174.
//
// Publicar el total sin separar sería dar una cifra que ningún estudiante cursa,
// en una página donde alguien planifica su carrera.

/** Va al final y admite espacios y un punto sueltos: "(E)", "( E )", "(E )", "(E.)". */
export const ELECTIVE_PATTERN = /\(\s*E\s*\.?\s*\)\s*$/i;

export function isElective(courseName) {
  return ELECTIVE_PATTERN.test(courseName ?? '');
}

/** Nombre sin el marcador, para mostrarlo limpio en la interfaz. */
export function stripElectiveMarker(courseName) {
  return (courseName ?? '').replace(ELECTIVE_PATTERN, '').trim();
}
