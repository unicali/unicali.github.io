import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const GuideRSU: React.FC = () => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "¿Qué es la RSU en la UNSA? Guía Completa para Estudiantes",
    "description": "Todo lo que necesitas saber sobre la Responsabilidad Social Universitaria (RSU): obligatoriedad, tipos de proyectos y cómo cumplir tus horas.",
    "author": {
      "@type": "Organization",
      "name": "UniCali Engineering"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://unicali.github.io/guias/que-es-rsu-unsa"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Es obligatorio realizar proyectos de RSU?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, según la Ley Universitaria 30220, la Responsabilidad Social Universitaria es una función ética y obligatoria para la obtención de grados académicos."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuándo se deben presentar los informes de RSU?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Generalmente se presentan al finalizar cada semestre académico, pero la planificación debe realizarse desde las primeras semanas."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>¿Qué es RSU UNSA? | Guía de Responsabilidad Social</title>
        <meta name="description" content="Domina tus proyectos de RSU. Entiende los requisitos, el impacto social y cómo UniCali te ayuda a gestionar tus tiempos académicos." />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <article style={{ padding: '12rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-label">Reglamento</span>
          
          <div className="reveal">
            <span className="meta-label">Gestión Social</span>
            <h1 style={{ marginTop: '2rem', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontStyle: 'italic' }}>El Impacto de la RSU</h1>
          </div>

          <div className="reveal stagger-1" style={{ marginTop: '5rem', color: 'var(--text-dim)', fontWeight: 300, lineHeight: '1.9' }}>
            <p style={{ fontSize: '1.3rem', color: 'var(--text)', marginBottom: '3rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              La Responsabilidad Social Universitaria (RSU) no es un simple trámite; es el compromiso ético de la universidad con la sociedad arequipeña.
            </p>

            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Estructura del Proyecto</h2>
              <p>
                En el entorno de la UNSA, los proyectos de RSU buscan aplicar los conocimientos técnicos de cada carrera en la solución de problemas reales. 
                Ya seas de ingenierías, biomédicas o sociales, tu proyecto debe generar un cambio tangible en una comunidad específica.
              </p>
            </section>

            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Tipos de Impacto</h2>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li><strong>Impacto Educativo:</strong> Talleres de capacitación y transferencia de conocimiento.</li>
                <li><strong>Impacto Ambiental:</strong> Campañas de sostenibilidad y gestión de residuos.</li>
                <li><strong>Impacto Social:</strong> Proyectos de salud pública, asesoría legal y apoyo comunitario.</li>
              </ul>
            </section>

            <section style={{ padding: '6rem 4rem', background: 'var(--bg-subtle)', borderLeft: '2px solid var(--primary)', marginTop: '8rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Organiza tu Semestre</h3>
              <p style={{ marginBottom: '3rem' }}>
                Sabemos que el final del semestre es caótico entre exámenes y entregas de RSU. UniCali te permite centralizar tus recordatorios 
                y cronogramas para que no pierdas ni un solo crédito por falta de organización.
              </p>
              <Link to="/descargar" className="btn-minimal">
                Descargar UniCali
              </Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
};

export default GuideRSU;
