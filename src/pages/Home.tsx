import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const screenshots = [
    { src: '/screenshots/login.png', label: 'Acceso Seguro' },
    { src: '/screenshots/campus.png', label: 'Campus Virtual' },
    { src: '/screenshots/notas.png', label: 'Gestión Académica' },
    { src: '/screenshots/estadisticas.png', label: 'Análisis de Rendimiento' },
    { src: '/screenshots/perfil.png', label: 'Identidad Digital' },
    { src: '/screenshots/lab.png', label: 'Laboratorio de Datos' },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  }, [screenshots.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  return (
    <>
      <Helmet>
        <title>UniCali | Arquitectura Académica Minimalista</title>
      </Helmet>

      <main>
        {/* Hero Section */}
        <section style={{ padding: '8rem 0 4rem' }}>
          <div className="container">
            <div className="reveal stagger-1" style={{ marginBottom: '1.5rem' }}>
              <span className="meta-label">Versión 1.5.0</span>
            </div>
            <h1 className="reveal stagger-2" style={{ marginBottom: '2rem' }}>
              UniCali
            </h1>
            <p className="reveal stagger-3" style={{ 
              maxWidth: '500px', 
              fontSize: '1.25rem', 
              color: 'var(--text-dim)',
              lineHeight: 1.6,
              fontWeight: 200,
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic'
            }}>
              Un ecosistema académico de alto rendimiento. Privacidad total, persistencia local y diseño orientado a la autonomía estudiantil.
            </p>
            <div className="reveal stagger-4" style={{ marginTop: '4rem' }}>
              <a href="#install" className="btn-minimal">
                Obtener APK
              </a>
            </div>
          </div>
        </section>

        {/* Improved Single Display Gallery */}
        <section className="gallery-section">
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="reveal" style={{ marginBottom: '2rem' }}>
              <span className="meta-label">Interfaz</span>
              <h2 style={{ marginTop: '0.5rem' }}>Ecosistema Visual</h2>
            </div>
          </div>
          
          <div 
            className="phone-display-wrapper reveal stagger-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={nextSlide}
            style={{ cursor: 'pointer' }}
          >
            <div className="phone-container">
              <div className="phone-notch"></div>
              <div className="phone-inner">
                <div className="phone-screen-wrapper">
                  {screenshots.map((shot, i) => (
                    <img 
                      key={i}
                      src={shot.src} 
                      alt={shot.label} 
                      className={`phone-screen ${currentIndex === i ? 'active' : ''}`} 
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="gallery-label-container reveal">
            {screenshots.map((shot, i) => (
              <span key={i} className={`gallery-label ${currentIndex === i ? 'active' : ''}`}>
                {shot.label}
              </span>
            ))}
          </div>

          <div className="gallery-indicators reveal">
            {screenshots.map((_, i) => (
              <div 
                key={i} 
                className={`indicator ${currentIndex === i ? 'active' : ''}`}
                onClick={() => setCurrentIndex(i)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </section>

        {/* Modules Grid */}
        <section id="features" style={{ padding: '6rem 0' }}>
          <div className="container">
            <div className="luxury-grid" style={{ borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
              <FeatureItem 
                title="Gestión de Notas" 
                desc="Visualización estructurada y cálculo de promedios ponderados en tiempo real."
                stagger="stagger-1"
              />
              <FeatureItem 
                title="Motor Predictivo" 
                desc="Algoritmos de proyección para metas académicas y simulación de resultados."
                stagger="stagger-2"
              />
              <FeatureItem 
                title="Soberanía de Datos" 
                desc="Almacenamiento local encriptado sin dependencia de servidores externos."
                stagger="stagger-3"
              />
            </div>
          </div>
        </section>

        {/* Protocol Section */}
        <section id="install" style={{ padding: '8rem 0', background: 'var(--bg-subtle)' }}>
          <div className="container">
            <div className="luxury-grid">
              <div className="col-span-6 reveal">
                <h2 style={{ marginBottom: '4rem' }}>Protocolo de Instalación</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  <Step num="01" title="Suministro" text="Descarga del binario oficial desde la infraestructura segura de UniCali." />
                  <Step num="02" title="Autorización" text="Habilitación de orígenes desconocidos en la configuración de Android." />
                  <Step num="03" title="Despliegue" text="Validación de integridad de firma e inicialización del entorno académico." />
                </div>
              </div>
              <div className="col-span-6 reveal stagger-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  maxWidth: '400px', 
                  aspectRatio: '1', 
                  border: '1px solid var(--border)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'var(--bg)'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="0.75">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <circle cx="12" cy="18" r="1" />
                  </svg>
                  <div style={{ height: '3rem' }} />
                  <span className="meta-label">app-release.apk</span>
                  <div style={{ height: '1.5rem' }} />
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.2em' }}>42 MB • ESTABLE</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const FeatureItem: React.FC<{ title: string; desc: string; stagger: string }> = ({ title, desc, stagger }) => (
  <div className={`col-span-4 minimal-card reveal ${stagger}`}>
    <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>{title}</h3>
    <p style={{ fontSize: '0.95rem', color: 'var(--text-dim)', fontWeight: 200 }}>{desc}</p>
  </div>
);

const Step: React.FC<{ num: string; title: string; text: string }> = ({ num, title, text }) => (
  <div style={{ display: 'flex', gap: '2.5rem' }}>
    <span style={{ 
      fontFamily: 'var(--font-serif)', 
      fontSize: '2rem', 
      color: 'var(--primary)', 
      opacity: 0.3,
      lineHeight: 1
    }}>{num}</span>
    <div>
      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h4>
      <p style={{ fontSize: '0.95rem', color: 'var(--text-dim)', fontWeight: 300 }}>{text}</p>
    </div>
  </div>
);

export default Home;
