import { createClient } from '@supabase/supabase-js';
import type { Course, Program } from '../domain/Curriculum';

export interface ProgramPageData {
  program: Program;
  courses: Course[];
}

/**
 * Id del bloque JSON que la función de render (api/seo.ts) incrusta en el HTML.
 * Sirve para que la primera carga no necesite un viaje extra a la base: el
 * crawler ve el contenido en el HTML y el usuario no ve un salto de carga.
 */
export const EMBEDDED_DATA_ID = '__PROGRAM_DATA__';

/** Lee los datos incrustados por el servidor, si los hay. */
export function readEmbeddedProgram(): ProgramPageData | null {
  if (typeof document === 'undefined') return null;
  const node = document.getElementById(EMBEDDED_DATA_ID);
  if (!node?.textContent) return null;
  try {
    return JSON.parse(node.textContent) as ProgramPageData;
  } catch {
    // Un JSON corrupto no debe romper la página: se cae al fetch normal.
    return null;
  }
}

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// La clave publicable es pública por diseño; lo que protege los datos es RLS,
// que solo expone las tablas de malla y las páginas con status = 'published'.
const client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

/** Carga un programa al navegar dentro del SPA, donde no hay datos incrustados. */
export async function fetchProgram(slug: string): Promise<ProgramPageData | null> {
  if (!client) return null;

  const { data, error } = await client
    .from('programs')
    .select(
      `slug, name, depe_code, specialty_name, plan_year, total_credits, source_url,
       universities ( slug, name, short_name, passing_grade, grading_max ),
       courses ( code, name, credits, year, semester, component, dept,
                 course_prerequisites ( prereq_code ) )`,
    )
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return shapeProgram(data);
}

/** Normaliza la fila anidada de Supabase al modelo de dominio. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shapeProgram(row: any): ProgramPageData {
  const uni = Array.isArray(row.universities) ? row.universities[0] : row.universities;
  return {
    program: {
      slug: row.slug,
      name: row.name,
      depeCode: row.depe_code,
      specialtyName: row.specialty_name,
      planYear: row.plan_year,
      totalCredits: row.total_credits,
      sourceUrl: row.source_url,
      university: {
        slug: uni.slug,
        name: uni.name,
        shortName: uni.short_name,
        passingGrade: Number(uni.passing_grade),
        gradingMax: Number(uni.grading_max),
      },
    },
    courses: (row.courses ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((c: any) => ({
        code: c.code,
        name: c.name,
        credits: Number(c.credits),
        year: c.year,
        semester: c.semester,
        component: c.component,
        dept: c.dept,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prerequisites: (c.course_prerequisites ?? []).map((p: any) => p.prereq_code),
      }))
      .sort((a: Course, b: Course) => a.code.localeCompare(b.code)),
  };
}
