import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

/**
 * Página 404. Se prerenderiza a `dist/404.html`, que es el fichero que Vercel
 * sirve —con status 404 real— para cualquier URL que no acierte el sistema de
 * ficheros. Antes no existía: `vercel.json` reescribía todo a `/index.html`, así
 * que cualquier URL inventada devolvía 200 con el contenido y el canonical del
 * home. Eso es un soft-404, y multiplicado por las rutas programáticas habría
 * generado contenido duplicado a escala.
 *
 * Lleva `noindex` pero `follow`: no queremos la página en el índice, pero sí que
 * el crawler siga los enlaces de salida hacia contenido real.
 */
export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Página no encontrada | UniCali</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="description" content="La página que buscas no existe o cambió de dirección." />
      </Helmet>

      <article className="section-hero">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="reveal">
            <span className="meta-label">Error 404</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontStyle: 'italic', marginTop: '1.5rem' }}>
              Esta página no existe
            </h1>
          </div>

          <div
            className="reveal stagger-1"
            style={{ marginTop: '3rem', color: 'var(--text-dim)', fontWeight: 300, lineHeight: '1.9' }}
          >
            <p style={{ fontSize: '1.3rem', color: 'var(--text)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              La dirección que abriste no corresponde a ninguna sección de UniCali. Puede que el enlace
              esté mal escrito o que el contenido haya cambiado de sitio.
            </p>

            <nav aria-label="Secciones principales" style={{ marginTop: '4rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                Quizá buscabas
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
                <li><Link to="/herramientas/calculadora-unsa">Calculadora de notas UNSA</Link></li>
                <li><Link to="/guias/que-es-un-tif-unsa">¿Qué es un TIF en la UNSA?</Link></li>
                <li><Link to="/guias/que-es-rsu-unsa">¿Qué es RSU en la UNSA?</Link></li>
                <li><Link to="/descargar">Descargar UniCali</Link></li>
              </ul>
            </nav>

            <div style={{ marginTop: '5rem' }}>
              <Link to="/" className="btn-minimal">Volver al inicio</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
