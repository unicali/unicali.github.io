import { Helmet } from 'react-helmet-async';
import { readEmbeddedWallHub } from '../lib/wallData';
import { useServerRendered } from '../lib/useServerRendered';

const dim = { color: 'var(--text-dim)' };

const excerpt = (text: string, max: number) => {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).trimEnd()}…`;
};

/**
 * Hubs del Muro público: /muro/[uni] y /muro/[uni]/[comunidad]. Pinta la vista
 * de api/wall.ts. Enlaces con <a> y no <Link>: cada página la sirve la función.
 */
export default function WallHub() {
  const { data: page, gaveUp } = useServerRendered(readEmbeddedWallHub);

  if (!page) {
    return gaveUp ? (
      <article className="section-hero">
        <Helmet>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h1>No pudimos cargar el Muro</h1>
          <p style={dim}>Inténtalo de nuevo en unos minutos.</p>
        </div>
      </article>
    ) : null;
  }

  return (
    <article className="section-hero">
      <Helmet>
        <title>{page.head.title}</title>
        <meta name="description" content={page.head.description} />
        <meta name="robots" content={page.head.robots} />
        {page.canonical ? <link rel="canonical" href={page.canonical} /> : null}
        {page.jsonLd ? <script type="application/ld+json">{JSON.stringify(page.jsonLd)}</script> : null}
      </Helmet>

      <div className="container" style={{ maxWidth: '720px' }}>
        <nav aria-label="Migas de pan" style={dim}>
          {page.breadcrumbs.map((c, i) => (
            <span key={`${c.name}-${i}`}>
              {i > 0 ? ' / ' : ''}
              {c.path && i < page.breadcrumbs.length - 1 ? <a href={c.path}>{c.name}</a> : <span>{c.name}</span>}
            </span>
          ))}
        </nav>

        <h1>{page.heading}</h1>
        <p style={dim}>{page.intro}</p>

        {page.posts.length ? (
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem', marginTop: '1.5rem' }}>
            {page.posts.map((p) => (
              <li key={p.path} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <a href={p.path} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
                  <strong>
                    {p.authorName}
                    {p.verified ? ' ✓' : ''}
                  </strong>
                  <p style={{ margin: '0.25rem 0', whiteSpace: 'pre-wrap' }}>{excerpt(p.text, 280)}</p>
                  {p.media[0] ? (
                    <img
                      src={p.media[0].thumb}
                      alt={p.media[0].alt ?? ''}
                      loading="lazy"
                      style={{ width: '100%', maxHeight: 320, objectFit: 'cover', marginTop: '0.25rem' }}
                    />
                  ) : null}
                  <small style={dim}>
                    {p.likes} me gusta · {p.comments} comentarios
                  </small>
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        {page.nextPath ? (
          <p style={{ marginTop: '1.5rem' }}>
            <a href={page.nextPath}>Publicaciones anteriores →</a>
          </p>
        ) : null}

        {page.children.length ? (
          <section style={{ marginTop: '2.5rem' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Escuelas</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.5rem' }}>
              {page.children.map((c) => (
                <li key={c.path}>
                  <a href={c.path}>{c.label}</a>
                  <span style={dim}> · {c.meta}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p style={{ marginTop: '2.5rem' }}>
          <a className="btn-minimal" href={page.playStoreUrl} rel="noopener">
            Descarga UniCali para comentar y publicar
          </a>
        </p>
      </div>
    </article>
  );
}
