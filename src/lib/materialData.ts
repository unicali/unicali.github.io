/**
 * Contrato entre api/material.ts (render en servidor) y MaterialPermalink.tsx.
 *
 * El servidor construye la vista completa —textos, canónico, JSON-LD— y la
 * incrusta; el SPA solo la pinta. Así no existen dos copias de la lógica que
 * puedan derivar (el fallo que ya se corrigió en el prerender de /calculadora).
 */
export interface MaterialPageData {
  status: 'ok' | 'removed' | 'not_found';
  publicId: string | null;
  canonical: string | null;
  openInAppUrl: string | null;
  playStoreUrl: string;
  head: { title: string; description: string; robots: string };
  material: null | {
    title: string;
    kindLabel: string;
    courseName: string;
    programName: string | null;
    academicPeriod: string | null;
    topic: string | null;
    description: string | null;
    hasSolutions: boolean;
    downloads: number;
    endorsements: number;
    createdAt: string | null;
    uploaderNickname: string | null;
  };
  jsonLd: object | null;
  /** Ruta a los hubs (Inicio › Biblioteca › UNSA › Escuela › Curso). Enlaces internos = SEO. */
  breadcrumbs: Array<{ name: string; path: string | null }>;
  /** Hub del curso, si el material está vinculado a la malla. */
  coursePath: string | null;
  /** Otros materiales del mismo curso (enlazado lateral). */
  related: Array<{ path: string; title: string; meta: string }>;
}


/** Id del bloque JSON que incrusta api/material.ts. */
export const MATERIAL_DATA_ID = '__MATERIAL_DATA__';

/** Lee los datos incrustados por el servidor, si los hay. */
export function readEmbeddedMaterial(): MaterialPageData | null {
  if (typeof document === 'undefined') return null;
  const node = document.getElementById(MATERIAL_DATA_ID);
  if (!node?.textContent) return null;
  try {
    return JSON.parse(node.textContent) as MaterialPageData;
  } catch {
    return null;
  }
}
