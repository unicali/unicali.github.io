import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import programIndex from '../../data/programs.json';
import { SITE_URL } from '../../data/routes';

/**
 * Índice del clúster programático: /calculadora.
 *
 * Cumple dos funciones que no se solapan. Para el estudiante, es la página desde
 * la que encuentra su carrera. Para el rastreador, es el nodo que conecta las 58
 * páginas con el resto del sitio: sin un índice enlazado desde la navegación,
 * las páginas programáticas dependerían solo del sitemap, y las páginas
 * huérfanas son la causa más común de que este tipo de contenido no se indexe.
 *
 * Además tiene intención de búsqueda propia ("calculadora de notas UNSA por
 * carrera"), así que no es solo plumbing.
 */
export default function CalculatorHub() {
  const programs = programIndex.programs;
  const canonical = `${SITE_URL}/calculadora`;
  const title = 'Calculadora de notas UNSA por escuela profesional | UniCali';
  const description =
    `Calculadora de promedio ponderado para las ${programs.length} escuelas profesionales de la ` +
    'UNSA, con las asignaturas y los créditos oficiales de cada plan de estudios ya cargados.';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Calculadoras UNSA', item: canonical },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Calculadoras de notas por escuela profesional de la UNSA',
        numberOfItems: programs.length,
        itemListElement: programs.map((program, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: program.name,
          url: SITE_URL + program.path,
        })),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UniCali" />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <article className="section-hero">
        <div className="container" style={{ maxWidth: '900px' }}>
          <nav
            aria-label="Migas de pan"
            style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '2rem' }}
          >
            <Link to="/">Inicio</Link> <span aria-hidden="true">/</span>{' '}
            <span>Calculadoras UNSA</span>
          </nav>

          <div className="reveal">
            <span className="meta-label">UNSA · Plan 2025</span>
            <h1
              style={{
                fontSize: 'clamp(2rem, 6vw, 3.6rem)',
                fontStyle: 'italic',
                marginTop: '1.5rem',
              }}
            >
              Calculadora de notas por escuela profesional
            </h1>
          </div>

          <div
            className="reveal stagger-1"
            style={{
              marginTop: '3rem',
              color: 'var(--text-dim)',
              fontWeight: 300,
              lineHeight: 1.9,
            }}
          >
            <p
              style={{
                fontSize: '1.2rem',
                color: 'var(--text)',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
              }}
            >
              Cada escuela de la UNSA tiene su propia calculadora, con las asignaturas y los
              créditos oficiales de su plan de estudios ya cargados. Elige la tuya y calcula tu
              promedio ponderado sin tener que copiar nada a mano.
            </p>

            <p style={{ marginTop: '2rem' }}>
              La cifra de créditos que verás en cada página cuenta solo las asignaturas
              obligatorias. Los planes de estudio publican además toda la oferta electiva, de la
              que cada estudiante cursa una parte, así que sumarlo todo daría un número que nadie
              llega a cursar.
            </p>

            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                marginTop: '4rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {programs.map((program) => (
                <li
                  key={program.path}
                  style={{ borderTop: '1px solid var(--border)', paddingTop: '0.9rem' }}
                >
                  <Link to={program.path} style={{ fontSize: '0.98rem', fontWeight: 500 }}>
                    {program.name}
                  </Link>
                  <span style={{ display: 'block', fontSize: '0.78rem', opacity: 0.65 }}>
                    {program.requiredCourses} asignaturas · {program.requiredCredits} créditos
                  </span>
                </li>
              ))}
            </ul>

            <section style={{ marginTop: '5rem', fontSize: '0.85rem', opacity: 0.75 }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                Fuente y aviso
              </h2>
              <p>
                Los datos provienen de los planes de estudio oficiales publicados por la
                Universidad Nacional de San Agustín de Arequipa. UniCali es un proyecto
                independiente hecho por estudiantes y <strong>no está afiliado a la UNSA</strong>.
              </p>
            </section>

            <div style={{ marginTop: '4rem' }}>
              <Link to="/herramientas/calculadora-unsa" className="btn-minimal">
                Calculadora por unidades
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
