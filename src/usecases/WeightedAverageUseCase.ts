import type { CourseGrade } from '../domain/Curriculum';

/**
 * Promedio ponderado por créditos, que es como la UNSA calcula el promedio
 * semestral y el ponderado acumulado.
 *
 * Es distinto del cálculo de `GradeCalculatorUseCase`, que resuelve la nota
 * final de UNA asignatura a partir de sus unidades y de los pesos del sílabo.
 * Aquí los pesos no los pone el estudiante: son los créditos oficiales de cada
 * asignatura, que sí son un dato público y verificable.
 */
export class WeightedAverageUseCase {
  /**
   * Σ(nota × créditos) / Σ(créditos), contando solo las asignaturas con nota.
   * Devuelve null si todavía no hay ninguna: un 0 sería engañoso.
   */
  static calculate(grades: CourseGrade[]): number | null {
    const scored = grades.filter((g) => g.grade !== '' && g.credits > 0);
    if (!scored.length) return null;

    const totalCredits = scored.reduce((sum, g) => sum + g.credits, 0);
    if (totalCredits <= 0) return null;

    const weighted = scored.reduce((sum, g) => sum + Number(g.grade) * g.credits, 0);
    return weighted / totalCredits;
  }

  /** Créditos que se aprobarían con las notas introducidas. */
  static approvedCredits(grades: CourseGrade[], passingGrade: number): number {
    return grades
      .filter((g) => g.grade !== '' && Number(g.grade) >= passingGrade)
      .reduce((sum, g) => sum + g.credits, 0);
  }

  /**
   * Nota mínima que hace falta en las asignaturas aún sin nota para alcanzar un
   * promedio objetivo. Devuelve null si ya no quedan asignaturas pendientes, e
   * indica cuándo el objetivo es inalcanzable para no dar una falsa esperanza.
   */
  static requiredForTarget(
    grades: CourseGrade[],
    target: number,
    gradingMax: number,
  ): { required: number; reachable: boolean } | null {
    const pending = grades.filter((g) => g.grade === '' && g.credits > 0);
    if (!pending.length) return null;

    const scored = grades.filter((g) => g.grade !== '' && g.credits > 0);
    const pendingCredits = pending.reduce((sum, g) => sum + g.credits, 0);
    const scoredCredits = scored.reduce((sum, g) => sum + g.credits, 0);
    const scoredWeighted = scored.reduce((sum, g) => sum + Number(g.grade) * g.credits, 0);

    const required = (target * (scoredCredits + pendingCredits) - scoredWeighted) / pendingCredits;
    return { required, reachable: required <= gradingMax };
  }
}
