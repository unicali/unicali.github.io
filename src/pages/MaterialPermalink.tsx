import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { readEmbeddedMaterial, type MaterialPageData } from '../lib/materialData';

const dim = { color: 'var(--text-dim)' };

/**
 * Ficha pública de un material de la Biblioteca: /d/[public_id]/[slug?].
 *
 * No consulta nada: pinta la vista que api/material.ts construyó e incrustó.
 * Si se llega navegando dentro del SPA (sin datos incrustados), recarga la URL
 * para que la sirva la función — es la única fuente de la vista, y así el SPA
 * nunca necesita la RPC ni duplica su lógica.
 *
 * El PDF nunca está aquí: se abre en la app, donde aplica la economía de tokens.
 */
export default function MaterialPermalink() {
  const { pathname } = useLocation();
  const [page] = useState<MaterialPageData | null>(() => readEmbeddedMaterial());

  // Una sola recarga por ruta: si la función no responde (vite dev, rewrite sin
  // desplegar) el HTML vuelve sin datos y sin esta marca recargaría para siempre.
  // Se decide al montar (solo lectura); la escritura va en el efecto.
  const reloadKey = `material-reload:${pathname}`;
  const [gaveUp] = useState(() => {
    if (page) return false;
    try {
      return sessionStorage.getItem(reloadKey) === '1';
    } catch {
      return true; // sin storage no hay forma segura de cortar el bucle
    }
  });
  useEffect(() => {
    if (page || gaveUp) return;
    try {
      sessionStorage.setItem(reloadKey, '1');
    } catch {
      return;
    }
    window.location.replace(pathname);
  }, [page, gaveUp, reloadKey, pathname]);

  if (!page) {
    return gaveUp ? (
      <article className="section-hero">
        <Helmet>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="container" style={{ maxWidth: '760px' }}>
          <h1>No pudimos cargar este material</h1>
          <p style={dim}>Ábrelo desde la app de UniCali.</p>
        </div>
      </article>
    ) : null;
  }

  const { head, material } = page;

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
        {page.canonical ? <meta property="og:type" content="article" /> : null}
        {page.jsonLd ? (
          <script type="application/ld+json">{JSON.stringify(page.jsonLd)}</script>
        ) : null}
      </Helmet>

      <div className="container" style={{ maxWidth: '760px' }}>
        {material ? (
          <>
            {/* <a> y no <Link>: los hubs los renderiza una función; una navegación
                completa trae su HTML con datos en vez de un SPA vacío. */}
            <nav aria-label="Migas de pan" style={dim}>
              {(page.breadcrumbs ?? []).map((crumb, i) => (
                <span key={`${crumb.name}-${i}`}>
                  {i > 0 ? ' / ' : ''}
                  {crumb.path ? <a href={crumb.path}>{crumb.name}</a> : <span>{crumb.name}</span>}
                </span>
              ))}
            </nav>
            <span className="meta-label">
              {material.kindLabel}
              {material.hasSolutions ? ' · Con solucionario' : ''}
            </span>
            <h1>{material.title}</h1>
            <p style={{ fontSize: '1.15rem' }}>{material.courseName}</p>
            {material.description ? <p style={dim}>{material.description}</p> : null}

            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.4rem 1.2rem', marginTop: '1.5rem' }}>
              {material.academicPeriod ? (
                <>
                  <dt style={dim}>Periodo</dt>
                  <dd>{material.academicPeriod}</dd>
                </>
              ) : null}
              {material.programName ? (
                <>
                  <dt style={dim}>Escuela</dt>
                  <dd>{material.programName}</dd>
                </>
              ) : null}
              {material.topic ? (
                <>
                  <dt style={dim}>Tema</dt>
                  <dd>{material.topic}</dd>
                </>
              ) : null}
              {material.uploaderNickname ? (
                <>
                  <dt style={dim}>Compartido por</dt>
                  <dd>{material.uploaderNickname}</dd>
                </>
              ) : null}
              <dt style={dim}>Descargas</dt>
              <dd>{material.downloads}</dd>
            </dl>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem' }}>
              <a className="btn-minimal" href={page.openInAppUrl ?? page.playStoreUrl}>
                Abrir en UniCali
              </a>
              <a className="btn-minimal" href={page.playStoreUrl} rel="noopener">
                Descargar la app
              </a>
            </div>
            <p style={{ ...dim, marginTop: '1rem', fontSize: '0.9rem' }}>
              El archivo se abre dentro de la app, en la Biblioteca de UniCali.
            </p>
            {page.related?.length ? (
              <section style={{ marginTop: '2.5rem' }}>
                <h2 style={{ fontSize: '1.2rem' }}>Más materiales de {material.courseName}</h2>
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.6rem' }}>
                  {page.related.map((r) => (
                    <li key={r.path}>
                      <a href={r.path}>{r.title}</a>
                      <span style={dim}> · {r.meta}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {page.coursePath ? (
              <p style={{ marginTop: '1rem' }}>
                <a href={page.coursePath}>Ver todos los materiales de {material.courseName} →</a>
              </p>
            ) : null}
          </>
        ) : (
          <>
            <h1>
              {page.status === 'removed' ? 'Este material fue retirado' : 'No encontramos este material'}
            </h1>
            <p style={dim}>
              Explora la Biblioteca de UniCali en la app: apuntes, exámenes y más de tu escuela.
            </p>
            <p style={{ marginTop: '2rem' }}>
              <a className="btn-minimal" href={page.playStoreUrl} rel="noopener">
                Descargar UniCali
              </a>
            </p>
          </>
        )}
      </div>
    </article>
  );
}
