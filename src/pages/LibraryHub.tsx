import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { readEmbeddedLibrary, type LibraryPageData } from '../lib/libraryData';

const dim = { color: 'var(--text-dim)' };

/**
 * Hubs de la Biblioteca pública: /biblioteca/[uni]/[escuela]/[curso].
 *
 * Igual que MaterialPermalink: no consulta nada, pinta la vista que construyó
 * api/library.ts. Si llega sin datos (navegación interna del SPA), recarga UNA
 * vez para que la sirva la función. Los enlaces entre hubs son <a> y no <Link>
 * por la misma razón: cada nivel lo renderiza el servidor.
 */
export default function LibraryHub() {
  const { pathname, search } = useLocation();
  const [page] = useState<LibraryPageData | null>(() => readEmbeddedLibrary());

  const target = pathname + search;
  const reloadKey = `library-reload:${target}`;
  const [gaveUp] = useState(() => {
    if (page) return false;
    try {
      return sessionStorage.getItem(reloadKey) === '1';
    } catch {
      return true;
    }
  });
  useEffect(() => {
    if (page || gaveUp) return;
    try {
      sessionStorage.setItem(reloadKey, '1');
    } catch {
      return;
    }
    window.location.replace(target);
  }, [page, gaveUp, reloadKey, target]);

  if (!page) {
    return gaveUp ? (
      <article className="section-hero">
        <Helmet>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="container" style={{ maxWidth: '820px' }}>
          <h1>No pudimos cargar la Biblioteca</h1>
          <p style={dim}>Inténtalo de nuevo en unos minutos.</p>
        </div>
      </article>
    ) : null;
  }

  const { head } = page;

  return (
    <article className="section-hero">
      <Helmet>
        <title>{head.title}</title>
        <meta name="description" content={head.description} />
        <meta name="robots" content={head.robots} />
        {page.canonical ? <link rel="canonical" href={page.canonical} /> : null}
        {page.canonical ? <meta property="og:title" content={head.title} /> : null}
        {page.canonical ? <meta property="og:description" content={head.description} /> : null}
        {page.canonical ? <meta property="og:url" content={page.canonical} /> : null}
        {page.jsonLd ? <script type="application/ld+json">{JSON.stringify(page.jsonLd)}</script> : null}
      </Helmet>

      <div className="container" style={{ maxWidth: '820px' }}>
        <nav aria-label="Migas de pan" style={dim}>
          {page.breadcrumbs.map((crumb, i) => (
            <span key={`${crumb.name}-${i}`}>
              {i > 0 ? ' / ' : ''}
              {crumb.path && i < page.breadcrumbs.length - 1 ? (
                <a href={crumb.path}>{crumb.name}</a>
              ) : (
                <span>{crumb.name}</span>
              )}
            </span>
          ))}
        </nav>

        <h1>{page.heading}</h1>
        <p style={{ fontSize: '1.05rem' }}>{page.intro}</p>

        {page.facts.length ? (
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '0.4rem 1.2rem',
              marginTop: '1.5rem',
            }}
          >
            {page.facts.map((fact) => (
              <div key={fact.label} style={{ display: 'contents' }}>
                <dt style={dim}>{fact.label}</dt>
                <dd style={{ margin: 0 }}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {page.materials.length ? (
          <section style={{ marginTop: '2.5rem' }}>
            <h2 style={{ fontSize: '1.3rem' }}>Materiales</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
              {page.materials.map((m) => (
                <li
                  key={m.path}
                  style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '0.9rem 1rem' }}
                >
                  <span className="meta-label">
                    {m.kindLabel}
                    {m.hasSolutions ? ' · Con solucionario' : ''}
                  </span>
                  <div>
                    <a href={m.path} style={{ fontWeight: 600 }}>
                      {m.title}
                    </a>
                  </div>
                  <small style={dim}>
                    {[
                      m.academicPeriod,
                      m.uploaderNickname ? `por ${m.uploaderNickname}` : null,
                      `${m.downloads} descargas`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </small>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {page.pagination ? (
          <nav aria-label="Paginación" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {page.pagination.prevPath ? <a href={page.pagination.prevPath}>← Anterior</a> : null}
            <span style={dim}>
              Página {page.pagination.page} de {page.pagination.pages}
            </span>
            {page.pagination.nextPath ? <a href={page.pagination.nextPath}>Siguiente →</a> : null}
          </nav>
        ) : null}

        {page.sections.map((section) => (
          <section key={section.title} style={{ marginTop: '2.5rem' }}>
            <h2 style={{ fontSize: '1.2rem' }}>{section.title}</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.5rem' }}>
              {section.links.map((link) => (
                <li key={link.path}>
                  <a href={link.path}>{link.label}</a>
                  {link.meta ? <span style={dim}> · {link.meta}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2.5rem' }}>
          {page.calculatorPath ? (
            <a className="btn-minimal" href={page.calculatorPath}>
              Calculadora de notas de esta escuela
            </a>
          ) : null}
          <a className="btn-minimal" href={page.playStoreUrl} rel="noopener">
            Descargar UniCali
          </a>
        </div>
        <p style={{ ...dim, marginTop: '1rem', fontSize: '0.9rem' }}>
          Los archivos se abren en la app. ¿Tienes exámenes o apuntes de tu curso? Súbelos desde UniCali.
        </p>
      </div>
    </article>
  );
}
