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
        <title>UniCali | Plataforma Académica Inteligente</title>
      </Helmet>

      <main>
        {/* Hero Section */}
        <section style={{ padding: '10rem 0 6rem', textAlign: 'center', position: 'relative' }}>
          <div className="container">
            <div className="reveal stagger-1" style={{ marginBottom: '2rem' }}>
              <span style={{ 
                border: '1px solid var(--primary)', 
                color: 'var(--primary)', 
                padding: '0.4rem 1.2rem', 
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase'
              }}>
                Build 1.5.0 • Estabilidad Confirmada
              </span>
            </div>
            <h1 className="reveal stagger-2">
              UniCali
            </h1>
            <p className="reveal stagger-3" style={{ 
              maxWidth: '650px', 
              margin: '2rem auto', 
              fontSize: '1.2rem', 
              color: 'var(--text-dim)',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              La arquitectura académica definitiva para el estudiante contemporáneo. 
              Privacidad absoluta y rendimiento optimizado bajo un enfoque offline-first.
            </p>
            <div className="reveal stagger-4" style={{ marginTop: '3.5rem' }}>
              <a href="#descarga" className="btn-primary">Obtener Binario</a>
              <div style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                DISTRIBUCIÓN INDEPENDIENTE • 42MB
              </div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section id="funcionalidades" style={{ padding: '8rem 0' }}>
          <div className="container">
            <div className="reveal" style={{ marginBottom: '6rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '3.5rem' }}>Ecosistema de Herramientas</h2>
              <div style={{ width: '60px', height: '1px', background: 'var(--primary)', margin: '2rem auto 0' }} />
            </div>
            
            <div className="grid">
              <FeatureCard 
                title="Protocolo de Seguridad" 
                desc="Tus datos permanecen en el perímetro de tu dispositivo. Encriptación local sin persistencia en servidores externos."
                icon={<SecurityIcon />}
                className="col-span-4"
                stagger="stagger-1"
              />
              <FeatureCard 
                title="Núcleo Comunitario" 
                desc="Intercambio de recursos y sincronización de eventos académicos a través de una red distribuida."
                icon={<CommunityIcon />}
                className="col-span-4"
                stagger="stagger-2"
              />
              <FeatureCard 
                title="Motor Analítico" 
                desc="Cálculo predictivo de rendimiento y proyección de resultados con precisión algorítmica."
                icon={<ToolsIcon />}
                className="col-span-4"
                stagger="stagger-3"
              />
            </div>
          </div>
        </section>

        {/* Protocol Section */}
        <section id="descarga" style={{ padding: '10rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="grid" style={{ alignItems: 'start' }}>
              <div className="col-span-7 reveal">
                <h2 style={{ marginBottom: '3rem' }}>Protocolo de Instalación</h2>
                <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
                  <Step num="01" title="Suministro" text="Descarga del binario oficial app-release.apk desde la infraestructura de UniCali." />
                  <Step num="02" title="Autorización" text="Habilitación de permisos para orígenes externos en la configuración del sistema Android." />
                  <Step num="03" title="Despliegue" text="Validación de firma digital e inicialización del entorno académico local." />
                </div>
              </div>
              <div className="col-span-5 reveal stagger-2" style={{ textAlign: 'center' }}>
                <div style={{ 
                  padding: '4rem 2rem', 
                  border: '1px dashed var(--primary)', 
                  background: 'var(--bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <DeviceIcon />
                  <div style={{ height: '3rem' }} />
                  <a href="#" className="btn-primary" style={{ width: '100%' }}>Descargar APK</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const FeatureCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; className: string; stagger: string }> = ({ title, desc, icon, className, stagger }) => (
  <div className={`module-card reveal ${className} ${stagger}`}>
    <div style={{ marginBottom: '2rem', color: 'var(--primary)' }}>{icon}</div>
    <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>{title}</h3>
    <p style={{ color: 'var(--text-dim)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.7 }}>{desc}</p>
  </div>
);

const Step: React.FC<{ num: string; title: string; text: string }> = ({ num, title, text }) => (
  <div style={{ display: 'flex', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
    <div style={{ 
      fontFamily: 'var(--font-serif)',
      fontSize: '2rem',
      color: 'var(--primary)',
      opacity: 0.5,
      lineHeight: 1,
      minWidth: '3rem'
    }}>{num}</div>
    <div>
      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{title}</h4>
      <p style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 300 }}>{text}</p>
    </div>
  </div>
);

const SecurityIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CommunityIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ToolsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
  </svg>
);

const DeviceIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12" y2="18" />
  </svg>
);

export default Home;
