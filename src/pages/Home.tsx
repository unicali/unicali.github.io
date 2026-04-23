import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const Home: React.FC = () => {
  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>UniCali | Digital Boutique for Students</title>
      </Helmet>

      <main>
        {/* Hero Section */}
        <section style={{ padding: '14rem 0 8rem', textAlign: 'center' }}>
          <div className="container">
            <span className="section-label">Introducción</span>
            <div className="reveal stagger-1" style={{ marginBottom: '3rem' }}>
              <span className="sub-header">Compilación Estable</span>
            </div>
            <h1 className="reveal stagger-2" style={{ marginBottom: '2rem' }}>
              v1.5.0
            </h1>
            <p className="reveal stagger-3" style={{ 
              maxWidth: '550px', 
              margin: '0 auto', 
              fontSize: '1.4rem', 
              color: 'var(--text-dim)',
              lineHeight: 1.5,
              fontWeight: 200,
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic'
            }}>
              Arquitectura orientada a la autonomía y persistencia bajo un enfoque Offline-First. 
              El portal académico de alto rendimiento para el estudiante contemporáneo.
            </p>
          </div>
        </section>

        {/* Assets Section */}
        <section id="assets">
          <div className="container">
            <span className="section-label">Módulos</span>
            <div className="reveal" style={{ marginBottom: '8rem', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Ecosistema de Sistemas</h2>
              <div style={{ width: '40px', height: '1px', background: 'var(--primary)', margin: '0 auto' }} />
            </div>
            
            <div className="editorial-grid">
              <ModuleCard 
                title="Gestión Académica" 
                desc="Visualización estructurada de registros y promedios ponderados en tiempo real."
                icon={<GridIcon />}
                stagger="stagger-1"
              />
              <ModuleCard 
                title="Motor de Proyección" 
                desc="Algoritmos predictivos para el cálculo de metas y evaluación de desempeño."
                icon={<PulseIcon />}
                stagger="stagger-2"
              />
              <ModuleCard 
                title="Núcleo de Privacidad" 
                desc="Persistencia local encriptada sin dependencia de servidores externos."
                icon={<LockIcon />}
                stagger="stagger-3"
              />
              <ModuleCard 
                title="Protocolo Social" 
                desc="Red distribuida para el intercambio de recursos y eventos de campus."
                icon={<ShareIcon />}
                stagger="stagger-1"
              />
              <ModuleCard 
                title="Gamificación" 
                desc="Sistemas de reconocimiento basados en la actividad y méritos académicos."
                icon={<MedalIcon />}
                stagger="stagger-2"
              />
              <ModuleCard 
                title="Seguridad Base" 
                desc="Binarios firmados digitalmente bajo protocolos de arquitectura soberana."
                icon={<ShieldIcon />}
                stagger="stagger-3"
              />
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section id="protocol" style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <span className="section-label">Despliegue</span>
            <div className="editorial-grid" style={{ alignItems: 'center' }}>
              <div className="col-span-7 reveal">
                <h2 style={{ marginBottom: '4rem', lineHeight: 1.1 }}>Protocolo de Instalación</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  <Step num="01" title="Suministro" text="Descarga del binario app-release.apk desde la infraestructura oficial." />
                  <Step num="02" title="Autorización" text="Habilitación de orígenes desconocidos en la configuración de Android." />
                  <Step num="03" title="Validación" text="Verificación de integridad de firma e inicialización del entorno." />
                </div>
              </div>
              <div className="col-span-5 reveal stagger-2" style={{ textAlign: 'center' }}>
                <div style={{ 
                  padding: '5rem 3rem', 
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <DeviceIcon />
                  <div style={{ height: '4rem' }} />
                  <a href="#" className="btn-editorial">
                    <span>Obtener APK</span>
                  </a>
                  <p style={{ marginTop: '2rem', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.3em' }}>
                    DISTRIBUCIÓN ESTABLE • 42MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const ModuleCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; stagger: string }> = ({ title, desc, icon, stagger }) => (
  <div className={`module-card reveal ${stagger} col-span-4`}>
    <div style={{ marginBottom: '2.5rem', color: 'var(--primary)', opacity: 0.8 }}>{icon}</div>
    <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: 400 }}>{title}</h3>
    <p style={{ fontSize: '0.95rem', color: 'var(--text-dim)', fontWeight: 300, lineHeight: 1.7 }}>{desc}</p>
  </div>
);

const Step: React.FC<{ num: string; title: string; text: string }> = ({ num, title, text }) => (
  <div className="reveal" style={{ display: 'flex', gap: '3rem' }}>
    <span style={{ 
      fontFamily: 'var(--font-serif)', 
      fontSize: '2.5rem', 
      color: 'var(--primary)', 
      opacity: 0.4,
      lineHeight: 0.8
    }}>{num}</span>
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem', width: '100%' }}>
      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h4>
      <p style={{ fontSize: '1.1rem', fontWeight: 200, color: 'var(--text-dim)' }}>{text}</p>
    </div>
  </div>
);

/* SVG Components */
const GridIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="3" y="3" width="18" height="18" rx="0.5" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);

const PulseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const LockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ShareIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const MedalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const DeviceIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="0.5">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

export default Home;
