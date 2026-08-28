import { createClient } from '@supabase/supabase-js';
import type { Course, Program } from '../domain/Curriculum';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  path: string;
  anchor: string;
}

export interface ProgramPageData {
  program: Program;
  courses: Course[];
  /** Se renderiza visible: Google exige que el contenido de FAQPage esté en la página. */
  faq: FaqItem[];
  /** Enlaces a escuelas hermanas. Sin ellos las páginas quedan huérfanas. */
  links: RelatedLink[];
  /**
   * Datos estructurados de la página. Viajan con los datos en vez de
   * reconstruirse aquí para que no puedan desincronizarse de lo que valida el
   * pipeline, y los repone el componente: main.tsx borra los nodos
   * data-prerendered antes de montar, así que sin esto Googlebot —que renderiza
   * JavaScript— se quedaría sin el FAQPage ni las migas.
   */
  jsonLd: object | null;
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
      `slug, name, depe_code, specialty_name, plan_year, required_credits, coded_credits,
       source_url,
       universities ( slug, name, short_name, passing_grade, grading_max ),
       courses ( code, name, credits, year, semester, component, dept, is_elective,
                 course_prerequisites ( prereq_code ) )`,
    )
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  // El FAQ y los enlaces viven en seo_pages, que RLS limita a las publicadas.
  const { data: page } = await client
    .from('seo_pages')
    .select('faq, jsonld, seo_internal_links!seo_internal_links_from_page_id_fkey ( anchor, seo_pages!seo_internal_links_to_page_id_fkey ( path ) )')
    .eq('path', `/calculadora/${slug}`)
    .maybeSingle();

  return shapeProgram(data, page);
}

/** Normaliza la fila anidada de Supabase al modelo de dominio. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shapeProgram(row: any, page?: any): ProgramPageData {
  const uni = Array.isArray(row.universities) ? row.universities[0] : row.universities;
  return {
    program: {
      slug: row.slug,
      name: row.name,
      depeCode: row.depe_code,
      specialtyName: row.specialty_name,
      planYear: row.plan_year,
      requiredCredits: Number(row.required_credits ?? 0),
      codedCredits: Number(row.coded_credits ?? 0),
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
        isElective: Boolean(c.is_elective),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prerequisites: (c.course_prerequisites ?? []).map((p: any) => p.prereq_code),
      }))
      .sort((a: Course, b: Course) => a.code.localeCompare(b.code)),
    faq: page?.faq ?? [],
    jsonLd: page?.jsonld ?? null,
    links: (page?.seo_internal_links ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((link: any) => {
        const target = Array.isArray(link.seo_pages) ? link.seo_pages[0] : link.seo_pages;
        return target ? { path: target.path, anchor: link.anchor } : null;
      })
      .filter(Boolean),
  };
}
