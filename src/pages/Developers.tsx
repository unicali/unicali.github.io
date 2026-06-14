import React from 'react';
import { Helmet } from 'react-helmet-async';

const Developers: React.FC = () => {
  const team = [
    {
      role: "Ingeniería de Sistemas de Usuario",
      desc: "Arquitectos del código binario que da vida a la interfaz móvil y web. Su misión es garantizar que la lógica de negocio y la interacción visual coexistan en un entorno de alto rendimiento.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
          <path d="M12 18h.01"/>
        </svg>
      )
    },
    {
      role: "Arquitectura de Infraestructura y Datos",
      desc: "Guardianes de la disponibilidad. Responsables de la orquestación de sistemas y la integridad de la persistencia local, asegurando que UniCali sea un ecosistema inquebrantable.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
          <line x1="6" y1="6" x2="6.01" y2="6"/>
          <line x1="6" y1="18" x2="6.01" y2="18"/>
        </svg>
      )
    },
    {
      role: "Diseño de Experiencia y Estética Digital",
      desc: "Creadores del alma visual de la plataforma. Su enfoque trasciende lo estético, priorizando la ergonomía cognitiva y la simplicidad sofisticada en cada pixel.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"/>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
          <path d="M2 2l5 5"/>
          <path d="M9.5 14.5L16 18"/>
        </svg>
      )
    },
    {
      role: "Aseguramiento de Calidad y Resiliencia",
      desc: "La última línea de defensa contra la entropía técnica. Encargados de someter cada despliegue a pruebas de estrés y auditorías de seguridad antes de cada actualización.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Equipo de Desarrollo | El Genoma de UniCali</title>
        <meta name="description" content="Conoce las áreas de ingeniería que sostienen el ecosistema UniCali. Un grupo anónimo de estudiantes dedicados a la excelencia académica técnica." />
      </Helmet>

      <section className="section-hero">
        <div className="container">
          <span className="section-label">Estructura</span>
          <div className="reveal">
            <span className="meta-label">Organigrama Técnico</span>
            <h1 style={{ marginTop: '2rem', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontStyle: 'italic' }}>¿Quiénes somos?</h1>
            <p style={{ color: 'var(--text-dim)', maxWidth: '600px', marginTop: '2rem', fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.6 }}>
              Somos una unidad de desarrollo independiente. Operamos bajo el anonimato para que la autoridad resida en el código y no en los nombres. 
              UniCali es el resultado de la intersección entre cuatro dominios fundamentales:
            </p>
          </div>

          <div className="luxury-grid" style={{ marginTop: '8rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
            {team.map((member, i) => (
              <div key={i} className={`col-span-6 reveal stagger-${i+1}`} style={{ padding: '3rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '2rem', opacity: 0.8 }}>
                  {member.icon}
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>
                  {member.role}
                </h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: 1.8, maxWidth: '400px', fontWeight: 300 }}>
                  {member.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ marginTop: '10rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Sin jerarquías • Solo Ingeniería Estudiantil
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Developers;
