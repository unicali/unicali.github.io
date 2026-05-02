import type { GradeUnit } from '../domain/GradeUnit';

export class GradeCalculatorUseCase {
  static calculateFinalGrade(units: GradeUnit[]): number {
    return units.reduce((acc, u) => {
      const c = u.continua === '' ? 0 : u.continua;
      const p = u.parcial === '' ? 0 : u.parcial;
      return acc + (c * u.wContinua / 100) + (p * u.wParcial / 100);
    }, 0);
  }

  static isApproved(grade: number): boolean {
    return grade >= 10.5;
  }
}
