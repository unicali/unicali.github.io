/**
 * Construcción pura de la vista pública del Muro, compartida por api/post.ts y
 * api/wall.ts (y por eso aquí y no en cada función: una tarjeta de post se
 * pinta igual en su página y en el hub).
 *
 * Lee SOLO lo que devuelven las RPCs públicas (`get_public_post`,
 * `get_public_wall_community`), que ya son una lista blanca. Nunca recibe ni
 * produce uuid, avatar, carrera, lugar o comentarios.
 */
import type { WallMedia, WallPostCard } from './wallData.js';

export const SITE_URL = 'https://www.unicali.app';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mantra.unsap';
export const ANDROID_PACKAGE = 'com.mantra.unsap';
export const ANONYMOUS_NAME = 'Anónimo';

/** Fila tal como la devuelven las RPCs públicas del Muro. */
export interface PublicPostRow {
  public_id: string;
  content: string | null;
  published_at: string | null;
  likes_count: number | null;
  comments_count: number | null;
  is_anonymous: boolean | null;
  author_nickname: string | null;
  author_verification_level: number | null;
  media: unknown;
  indexable: boolean | null;
}

/** La insignia marca distinción (nivel ≥ 2), igual que en la app (verification_tier.dart). */
const BADGE_FROM = 2;

export const postPath = (publicId: string) => `/p/${publicId}`;

export function toWallMedia(raw: unknown): WallMedia[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((m) => {
    if (!m || typeof m !== 'object') return [];
    const r = m as Record<string, unknown>;
    const kind = r.kind === 'video' ? 'video' : r.kind === 'image' ? 'image' : null;
    // Solo URLs de nuestro CDN de medios: nada que el contenido pueda inyectar.
    const thumb = typeof r.thumb === 'string' && r.thumb.startsWith('https://') ? r.thumb : null;
    if (!kind || !thumb) return [];
    const url = typeof r.url === 'string' && r.url.startsWith('https://') ? r.url : null;
    return [{
      kind,
      thumb,
      url,
      width: typeof r.width === 'number' ? r.width : null,
      height: typeof r.height === 'number' ? r.height : null,
      alt: typeof r.alt === 'string' ? r.alt : null,
      durationMs: typeof r.duration_ms === 'number' ? r.duration_ms : null,
    }];
  });
}

export function toWallCard(row: PublicPostRow): WallPostCard {
  const anonymous = row.is_anonymous !== false || !row.author_nickname;
  return {
    path: postPath(row.public_id),
    text: row.content ?? '',
    authorName: anonymous ? ANONYMOUS_NAME : (row.author_nickname as string),
    isAnonymous: anonymous,
    verified: !anonymous && Number(row.author_verification_level ?? 0) >= BADGE_FROM,
    publishedAt: row.published_at ?? '',
    likes: Number(row.likes_count ?? 0),
    comments: Number(row.comments_count ?? 0),
    media: toWallMedia(row.media),
  };
}

/** Primera línea útil del post, sin saltos, para títulos y descripciones. */
export function excerpt(text: string, max: number): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).trimEnd()}…`;
}

/** "17 de octubre de 2026" (zona de Arequipa: la fecha que vio el estudiante). */
export function formatDateEs(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Lima',
  }).format(d);
}

/** Abre la app aunque el App Link no esté verificado; si no está, va a Play. */
export const intentUrl = (path: string) =>
  `intent://www.unicali.app${path}#Intent;scheme=https;package=${ANDROID_PACKAGE};` +
  `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;

/** DiscussionForumPosting: lo que Google recomienda para contenido de usuarios. */
export function postingJsonLd(card: WallPostCard, canonical: string, hubUrl: string | null) {
  const images = card.media.map((m) => m.thumb);
  const videos = card.media
    .filter((m) => m.kind === 'video' && m.url)
    .map((m) => ({
      '@type': 'VideoObject',
      name: excerpt(card.text, 80) || 'Video en el Muro de UniCali',
      thumbnailUrl: m.thumb,
      contentUrl: m.url,
      uploadDate: card.publishedAt || undefined,
      duration: m.durationMs ? `PT${Math.round(m.durationMs / 1000)}S` : undefined,
    }));
  return {
    '@type': 'DiscussionForumPosting',
    '@id': `${canonical}#post`,
    url: canonical,
    mainEntityOfPage: canonical,
    text: card.text,
    headline: excerpt(card.text, 110) || undefined,
    datePublished: card.publishedAt || undefined,
    author: { '@type': 'Person', name: card.authorName },
    image: images.length ? images : undefined,
    video: videos.length ? videos : undefined,
    interactionStatistic: [
      { '@type': 'InteractionCounter', interactionType: 'https://schema.org/LikeAction', userInteractionCount: card.likes },
      { '@type': 'InteractionCounter', interactionType: 'https://schema.org/CommentAction', userInteractionCount: card.comments },
    ],
    isPartOf: hubUrl ? { '@type': 'CollectionPage', url: hubUrl } : undefined,
  };
}
