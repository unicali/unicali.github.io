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
  prerequisites: string[];
}

export interface Program {
  slug: string;
  name: string;
  depeCode: string;
  specialtyName: string | null;
  planYear: number;
  totalCredits: number;
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
