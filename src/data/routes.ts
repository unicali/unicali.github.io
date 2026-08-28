import manifest from './routes.json';

export const SITE_URL = 'https://www.unicali.app';

export type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export interface SitemapEntry {
  priority: number;
  changefreq: ChangeFreq;
}

export interface RouteDef {
  /** Ruta de React Router, con el mismo texto que se prerenderiza y se publica. */
  path: string;
  /** Si el build debe hornear HTML estático para esta ruta (scripts/prerender.mjs). */
  prerender: boolean;
  /** `false` la excluye del sitemap; un objeto define cómo se publica. */
  sitemap: SitemapEntry | false;
}

export const ROUTES = manifest.routes as RouteDef[];

export const PRERENDER_ROUTES = ROUTES.filter((r) => r.prerender).map((r) => r.path);

export const SITEMAP_ROUTES = ROUTES.filter(
  (r): r is RouteDef & { sitemap: SitemapEntry } => r.sitemap !== false,
);

/**
 * `loc` para el sitemap. Los caracteres no ASCII deben ir percent-encoded: el
 * sitemap listaba "/reseñas" en UTF-8 crudo y esa forma no acierta el fichero
 * estático en Vercel, así que los crawlers recibían el HTML del home (200 con
 * el canonical del home) en lugar de la página de reseñas.
 */
export function absoluteUrl(routePath: string): string {
  return SITE_URL + routePath.split('/').map(encodeURIComponent).join('/');
}
