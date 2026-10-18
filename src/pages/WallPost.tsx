import { Helmet } from 'react-helmet-async';
import { readEmbeddedWallPost, type WallMedia } from '../lib/wallData';
import { useServerRendered } from '../lib/useServerRendered';

const dim = { color: 'var(--text-dim)' };

const dateEs = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' }).format(d);
};

function Media({ items }: { items: WallMedia[] }) {
  if (!items.length) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: items.length > 1 ? 'repeat(2, 1fr)' : '1fr',
        gap: '4px',
        marginTop: '1rem',
      }}
    >
      {items.map((m) =>
        m.kind === 'video' && m.url ? (
          <video
            key={m.url}
            controls
            playsInline
            preload="none"
            poster={m.thumb}
            src={m.url}
            style={{ width: '100%', maxHeight: '70vh', background: '#000' }}
          />
        ) : (
          <img
            key={m.thumb}
            src={m.url ?? m.thumb}
            alt={m.alt ?? ''}
            loading="lazy"
            width={m.width ?? undefined}
            height={m.height ?? undefined}
            style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'cover' }}
          />
        ),
      )}
    </div>
  );
}

/**
 * Publicación pública del Muro: /p/[public_id]. Pinta la vista de api/post.ts.
 * Comentarios y perfil quedan en la app (modelo de X sin sesión).
 */
export default function WallPost() {
  const { data: page, gaveUp } = useServerRendered(readEmbeddedWallPost);

  if (!page) {
    return gaveUp ? (
      <article className="section-hero">
        <Helmet>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h1>No pudimos cargar esta publicación</h1>
          <p style={dim}>Ábrela desde la app de UniCali.</p>
        </div>
      </article>
    ) : null;
  }

  const { head, post } = page;

  return (
    <article className="section-hero">
      <Helmet>
        <title>{head.title}</title>
        <meta name="description" content={head.description} />
        <meta name="robots" content={head.robots} />
        {page.canonical ? <link rel="canonical" href={page.canonical} /> : null}
        {page.jsonLd ? <script type="application/ld+json">{JSON.stringify(page.jsonLd)}</script> : null}
      </Helmet>

      <div className="container" style={{ maxWidth: '640px' }}>
        <nav aria-label="Migas de pan" style={dim}>
          {page.breadcrumbs.map((c, i) => (
            <span key={`${c.name}-${i}`}>
              {i > 0 ? ' / ' : ''}
              {c.path ? <a href={c.path}>{c.name}</a> : <span>{c.name}</span>}
            </span>
          ))}
        </nav>

        {post ? (
          <>
            <header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
              {/* La inicial, nunca la foto: avatar_url lleva el uuid del autor. */}
              <div
                aria-hidden="true"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  fontWeight: 600,
                }}
              >
                {post.isAnonymous ? '?' : post.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: '1.05rem', margin: 0 }}>
                  {post.authorName}
                  {post.verified ? <span title="Verificado"> ✓</span> : null}
                </h1>
                <small style={dim}>
                  <a href={post.community.path}>{post.community.name}</a> · {dateEs(post.publishedAt)}
                </small>
              </div>
            </header>

            <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.15rem', lineHeight: 1.5, marginTop: '1rem' }}>{post.text}</p>
            <Media items={post.media} />

            <p style={{ ...dim, marginTop: '1rem' }}>
              {post.likes} me gusta · {post.comments} comentarios
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
              <a className="btn-minimal" href={page.openInAppUrl ?? page.playStoreUrl}>
                Ver comentarios en UniCali
              </a>
              <a className="btn-minimal" href={page.playStoreUrl} rel="noopener">
                Descargar la app
              </a>
            </div>
          </>
        ) : (
          <>
            <h1>{page.status === 'removed' ? 'Esta publicación fue eliminada' : 'No encontramos esta publicación'}</h1>
            <p style={dim}>
              <a href="/muro">Ver el Muro de UniCali</a>
            </p>
          </>
        )}
      </div>
    </article>
  );
}
