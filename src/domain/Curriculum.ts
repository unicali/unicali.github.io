/** Una asignatura del plan de estudios, tal como la publica la universidad. */
export interface Course {
  code: string;
  name: string;
  /** Créditos oficiales. Son el peso real del promedio ponderado semestral. */
  credits: number;
  year: number;
  semester: number;
  /** Componente formativo del plan (A..G en la leyenda del PDF de la UNSA). */
  component: string | null;
  dept: string | null;
  /** Los planes listan toda la oferta electiva; un estudiante cursa solo una parte. */
  isElective: boolean;
  prerequisites: string[];
}

export interface Program {
  slug: string;
  name: string;
  depeCode: string;
  specialtyName: string | null;
  planYear: number;
  /** Créditos de asignaturas obligatorias: el recorrido que hace todo estudiante. */
  requiredCredits: number;
  /** Todo lo codificado en el plan, incluida la oferta electiva completa. */
  codedCredits: number;
  sourceUrl: string;
  university: {
    slug: string;
    name: string;
    shortName: string;
    passingGrade: number;
    gradingMax: number;
  };
}

/** Una asignatura con la nota que el estudiante introdujo. */
export interface CourseGrade {
  code: string;
  credits: number;
  /** Vacío mientras no se ha escrito nada; no cuenta para el promedio. */
  grade: number | '';
}
