/**
 * Contrato entre las funciones del Muro público (api/post.ts, api/wall.ts) y el
 * SPA (WallPost.tsx, WallHub.tsx).
 *
 * Igual que la Biblioteca: el servidor construye la vista completa (textos,
 * canónico, robots, JSON-LD) y el SPA solo la pinta. `head.robots` sale del
 * flag `indexable` de la base, la misma fuente que filtra el sitemap.
 *
 * Privacidad: nada de esto lleva uuid, avatar, carrera, lugar ni comentarios.
 * El autor de una publicación anónima es siempre «Anónimo».
 * Contrato: unsap/docs/architecture/muro-publico-2026-10.md
 */
export interface WallMedia {
  kind: 'image' | 'video';
  /** Miniatura (imagen) o póster (video). */
  thumb: string;
  /** Variante grande o el MP4. `null` si el video se purgó por retención. */
  url: string | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  durationMs: number | null;
}

export interface WallCrumb {
  name: string;
  path: string | null;
}

export interface WallPostCard {
  path: string;
  text: string;
  authorName: string;
  isAnonymous: boolean;
  verified: boolean;
  publishedAt: string;
  likes: number;
  comments: number;
  media: WallMedia[];
}

export interface WallPostPageData {
  status: 'ok' | 'removed' | 'not_found';
  head: { title: string; description: string; robots: string };
  canonical: string | null;
  breadcrumbs: WallCrumb[];
  post: (WallPostCard & { community: { name: string; path: string } }) | null;
  openInAppUrl: string | null;
  playStoreUrl: string;
  jsonLd: object | null;
}

export interface WallHubPageData {
  kind: 'university' | 'program' | 'not_found';
  head: { title: string; description: string; robots: string };
  canonical: string | null;
  breadcrumbs: WallCrumb[];
  heading: string;
  intro: string;
  posts: WallPostCard[];
  /** Escuelas con publicaciones (solo en el hub de la universidad). */
  children: Array<{ path: string; label: string; meta: string }>;
  /** Siguiente página (cursor keyset), o null si no hay más. */
  nextPath: string | null;
  playStoreUrl: string;
  jsonLd: object | null;
}

export const WALL_POST_DATA_ID = '__WALL_POST_DATA__';
export const WALL_HUB_DATA_ID = '__WALL_HUB_DATA__';

function readEmbedded<T>(id: string): T | null {
  if (typeof document === 'undefined') return null;
  const node = document.getElementById(id);
  if (!node?.textContent) return null;
  try {
    return JSON.parse(node.textContent) as T;
  } catch {
    return null;
  }
}

export const readEmbeddedWallPost = () => readEmbedded<WallPostPageData>(WALL_POST_DATA_ID);
export const readEmbeddedWallHub = () => readEmbedded<WallHubPageData>(WALL_HUB_DATA_ID);
