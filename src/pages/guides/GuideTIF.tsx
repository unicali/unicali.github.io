import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const GuideTIF: React.FC = () => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué es un TIF en la UNSA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El TIF (Trabajo de Investigación Formativa) es una modalidad académica de la Universidad Nacional de San Agustín que busca fomentar el pensamiento crítico y la investigación desde los primeros semestres."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo organizar mi TIF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Organizar un TIF requiere seguimiento de cronogramas y gestión de referencias. UniCali te ayuda a centralizar estas fechas y tareas académicas."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>¿Qué es un TIF UNSA? | Guía Académica UniCali</title>
        <meta name="description" content="Descubre qué es el Trabajo de Investigación Formativa (TIF) en la UNSA, su importancia y cómo organizarlo con éxito." />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <article style={{ padding: '12rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-label">Guía UNSA</span>
          
          <div className="reveal">
            <span className="meta-label">Recursos Estudiantiles</span>
            <h1 style={{ marginTop: '2rem', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontStyle: 'italic' }}>¿Qué es un TIF?</h1>
          </div>

          <div className="reveal stagger-1" style={{ marginTop: '5rem', color: 'var(--text-dim)', fontWeight: 300, lineHeight: '1.9' }}>
            <p style={{ fontSize: '1.3rem', color: 'var(--text)', marginBottom: '3rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              El Trabajo de Investigación Formativa (TIF) es más que un requisito; es la piedra angular del desarrollo científico en la vida universitaria.
            </p>

            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Definición Operativa</h2>
              <p>
                En la Universidad Nacional de San Agustín, el TIF es una estrategia de enseñanza-aprendizaje que permite a los estudiantes 
                desarrollar competencias investigativas. No se trata solo de un informe final, sino de un proceso que abarca desde 
                el planteamiento del problema hasta la defensa de resultados.
              </p>
            </section>

            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Estructura del Proceso</h2>
              <p>
                Cada facultad puede tener variaciones, pero generalmente un TIF exitoso se divide en:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li><strong>Planificación:</strong> Selección del tema y revisión de literatura inicial.</li>
                <li><strong>Ejecución:</strong> Recolección de datos y trabajo de campo según el cronograma.</li>
                <li><strong>Sistematización:</strong> Análisis de hallazgos y redacción del informe bajo normas APA o Vancouver.</li>
              </ul>
            </section>

            <section style={{ padding: '6rem 4rem', background: 'var(--bg-subtle)', borderLeft: '2px solid var(--primary)', marginTop: '8rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Optimiza tu rendimiento</h3>
              <p style={{ marginBottom: '3rem' }}>
                Gestionar un TIF junto a tus otras materias puede ser abrumador. UniCali fue diseñado precisamente para ayudarte a 
                centralizar estos hitos académicos, proyectar tus notas y asegurar que ninguna entrega se pase por alto.
              </p>
              <Link to="/descargar" className="btn-minimal">
                Descargar UniCali para mi TIF
              </Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
};

export default GuideTIF;
