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
        <title>UniCali | La herramienta definitiva para tu vida universitaria</title>
      </Helmet>

      <main>
        {/* Hero Section */}
        <section style={{ padding: '12rem 0 8rem', textAlign: 'center', position: 'relative' }}>
          <div className="container">
            <div className="reveal stagger-1" style={{ marginBottom: '2rem' }}>
              <span style={{ 
                background: 'rgba(255, 45, 146, 0.1)', 
                color: 'var(--primary)', 
                padding: '0.5rem 1.5rem', 
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                Nueva Versión 1.5.0 ya disponible
              </span>
            </div>
            <h1 className="reveal stagger-2">
              UniCali
            </h1>
            <p className="reveal stagger-3" style={{ 
              maxWidth: '600px', 
              margin: '2.5rem auto', 
              fontSize: '1.25rem', 
              color: 'var(--text-dim)',
              lineHeight: 1.6
            }}>
              La plataforma independiente que está transformando la experiencia universitaria. 
              Sin contraseñas, sin rastreo, solo tú y tu éxito académico.
            </p>
            <div className="reveal stagger-4" style={{ marginTop: '3rem' }}>
              <a href="#descarga" className="download-btn">Descargar para Android</a>
              <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Gratis • Código Abierto • Seguro
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="funcionalidades" style={{ padding: '6rem 0' }}>
          <div className="container">
            <div className="reveal" style={{ marginBottom: '5rem' }}>
              <h2 style={{ textAlign: 'center' }}>Diseñado para el Estudiante Moderno</h2>
            </div>
            
            <div className="grid">
              <FeatureCard 
                title="Seguridad" 
                desc="Tus datos nunca salen de tu dispositivo. Utilizamos almacenamiento local encriptado para garantizar que tu información personal sea solo tuya."
                icon={<SecurityIcon />}
                className="col-span-4"
              />
              <FeatureCard 
                title="Comunidad" 
                desc="Conecta con otros estudiantes de UniCali. Comparte recursos, participa en foros y mantente al día con lo que sucede en el campus."
                icon={<CommunityIcon />}
                className="col-span-4"
              />
              <FeatureCard 
                title="Herramientas" 
                desc="Calcula promedios, proyecta notas y organiza tu semestre con herramientas diseñadas específicamente para tu carrera."
                icon={<ToolsIcon />}
                className="col-span-4"
              />
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section id="descarga" style={{ padding: '8rem 0', background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="grid" style={{ alignItems: 'center' }}>
              <div className="col-span-6 reveal">
                <h2 style={{ marginBottom: '2rem' }}>Empieza Hoy</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginBottom: '3rem' }}>
                  Únete a miles de estudiantes que ya están usando UniCali para tomar el control de su vida académica. 
                  Instalación rápida, sin registros complicados.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  <Step num="1" title="Descarga" text="Obtén el archivo APK desde nuestros servidores seguros." />
                  <Step num="2" title="Instala" text="Habilita 'Orígenes desconocidos' en tu Android." />
                  <Step num="3" title="Disfruta" text="Abre la app y comienza a gestionar tu semestre." />
                </div>
              </div>
              <div className="col-span-6 reveal stagger-2" style={{ textAlign: 'center' }}>
                <div style={{ 
                  padding: '4rem', 
                  border: '1px solid var(--border)', 
                  borderRadius: '24px',
                  background: 'var(--bg)'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>📱</div>
                  <a href="#" className="download-btn" style={{ padding: '1.5rem 3rem', fontSize: '1.1rem' }}>
                    Descargar UniCali APK
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const FeatureCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; className: string }> = ({ title, desc, icon, className }) => (
  <div className={`module-card reveal ${className}`}>
    <div style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>{icon}</div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>{desc}</p>
  </div>
);

const Step: React.FC<{ num: string; title: string; text: string }> = ({ num, title, text }) => (
  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
    <div style={{ 
      width: '40px', 
      height: '40px', 
      borderRadius: '50%', 
      border: '1px solid var(--primary)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'var(--primary)',
      fontWeight: 'bold',
      flexShrink: 0
    }}>{num}</div>
    <div>
      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{title}</h4>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{text}</p>
    </div>
  </div>
);

const SecurityIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CommunityIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ToolsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export default Home;
