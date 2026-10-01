/**
 * Contrato entre api/library.ts (render en servidor) y LibraryHub.tsx.
 *
 * Igual que materialData.ts: el servidor construye la vista completa (textos,
 * canónico, robots, JSON-LD) y el SPA solo la pinta. La decisión de indexar
 * (`head.robots`) viene del flag `indexable` de la base, la misma fuente que usa
 * el sitemap — nunca se recalcula aquí.
 */
export interface Crumb {
  name: string;
  path: string | null;
}

export interface HubLink {
  path: string;
  label: string;
  meta?: string;
}

export interface HubSection {
  title: string;
  links: HubLink[];
}

export interface MaterialCard {
  path: string;
  title: string;
  kindLabel: string;
  academicPeriod: string | null;
  hasSolutions: boolean;
  downloads: number;
  uploaderNickname: string | null;
}

export interface LibraryPageData {
  kind: 'index' | 'university' | 'program' | 'course' | 'not_found';
  head: { title: string; description: string; robots: string };
  canonical: string | null;
  breadcrumbs: Crumb[];
  heading: string;
  intro: string;
  facts: Array<{ label: string; value: string }>;
  materials: MaterialCard[];
  sections: HubSection[];
  pagination: { page: number; pages: number; prevPath: string | null; nextPath: string | null } | null;
  calculatorPath: string | null;
  playStoreUrl: string;
  jsonLd: object | null;
}

export const LIBRARY_DATA_ID = '__LIBRARY_DATA__';

export function readEmbeddedLibrary(): LibraryPageData | null {
  if (typeof document === 'undefined') return null;
  const node = document.getElementById(LIBRARY_DATA_ID);
  if (!node?.textContent) return null;
  try {
    return JSON.parse(node.textContent) as LibraryPageData;
  } catch {
    return null;
  }
}
