import React, { useEffect } from 'react';

const App: React.FC = () => {
  // Lógica para animaciones de scroll y barra de progreso
  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = document.getElementById('scroll-progress');
      if (scrollProgress) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
      }
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="app">
      <div id="scroll-progress" />
      
      {/* Navigation */}
      <nav className="border-b" style={{ 
        padding: '1.2rem 0', 
        position: 'sticky', 
        top: 0, 
        background: 'rgba(242, 239, 231, 0.8)', 
        backdropFilter: 'blur(15px)',
        zIndex: 100 
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo reveal" style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '3px', color: 'var(--primary)' }}>
            UNIRANK
          </div>
          <div className="links reveal stagger-1" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 500 }}>
            <a href="#assets" className="nav-link" style={{ marginLeft: '2.5rem' }}>Recursos</a>
            <a href="#protocol" className="nav-link" style={{ marginLeft: '2.5rem' }}>Protocolo</a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section style={{ padding: '10rem 0 6rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="container">
            <h4 className="reveal stagger-1" style={{ textTransform: 'uppercase', letterSpacing: '5px', marginBottom: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
              Compilación Estable
            </h4>
            <h1 className="reveal stagger-2" style={{ 
              fontSize: 'clamp(5rem, 18vw, 12rem)', 
              lineHeight: 0.85, 
              marginBottom: '2.5rem',
              fontVariantNumeric: 'tabular-nums'
            }}>
              v1.5.0
            </h1>
            <p className="reveal stagger-3" style={{ 
              maxWidth: '550px', 
              margin: '0 auto', 
              fontSize: '1.25rem', 
              color: '#333',
              lineHeight: 1.5,
              fontWeight: 300
            }}>
              Portal académico de alto rendimiento. Arquitectura orientada a la autonomía y persistencia bajo un enfoque Offline-First.
            </p>
          </div>
        </section>

        {/* Modules Section */}
        <section id="assets" style={{ padding: '8rem 0' }}>
          <div className="container">
            <div className="reveal" style={{ marginBottom: '5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Módulos del Sistema</h2>
              <div style={{ width: '40px', height: '1px', background: 'var(--primary)', margin: '0 auto' }} />
            </div>
            
            <div className="grid">
              <ModuleCard 
                title="Gestión Académica" 
                desc="Visualización estructurada de calificaciones y promedios ponderados en tiempo real."
                stagger="stagger-1"
              />
              <ModuleCard 
                title="Motor de Proyección" 
                desc="Simulador integrado para el cálculo de notas finales y evaluación predictiva."
                stagger="stagger-2"
              />
              <ModuleCard 
                title="Arquitectura Offline" 
                desc="Acceso ininterrumpido a registros académicos sin dependencia de conexión."
                stagger="stagger-3"
              />
              <ModuleCard 
                title="Campus Social" 
                desc="Entorno interactivo con sistema de publicaciones y directorio unificado."
                stagger="stagger-1"
              />
              <ModuleCard 
                title="Gamificación" 
                desc="Medallas de reconocimiento y badges de verificación basados en la actividad."
                stagger="stagger-2"
              />
              <ModuleCard 
                title="Seguridad Base" 
                desc="Binarios firmados digitalmente y respaldados por protocolos de arquitectura base."
                stagger="stagger-3"
              />
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section id="protocol" style={{ padding: '10rem 0', background: 'rgba(139, 0, 74, 0.02)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="grid" style={{ alignItems: 'center' }}>
              <div className="col reveal" style={{ gridColumn: 'span 7' }}>
                <h2 style={{ fontSize: '4rem', marginBottom: '2.5rem', lineHeight: 1.1 }}>Protocolo de Instalación</h2>
                <div className="protocol-steps">
                  <Step num="01" text="Descarga del binario app-release.apk desde los assets oficiales." />
                  <Step num="02" text="Autorización de orígenes desconocidos en la configuración de Android." />
                  <Step num="03" text="Validación de firma digital e instalación del paquete." />
                </div>
              </div>
              <div className="col reveal stagger-2" style={{ gridColumn: 'span 5', textAlign: 'center' }}>
                <div style={{ 
                  padding: '3rem', 
                  border: '1px dashed var(--border)',
                  borderRadius: '2px',
                  display: 'inline-block'
                }}>
                  <a 
                    href="#" 
                    className="download-btn"
                    style={{
                      display: 'inline-block',
                      padding: '1.5rem 3.5rem',
                      background: 'var(--primary)',
                      color: '#fff',
                      fontSize: '1rem',
                      fontWeight: 600,
                      letterSpacing: '1.5px',
                      textDecoration: 'none',
                      textTransform: 'uppercase'
                    }}
                  >
                    Descargar APK
                  </a>
                  <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', opacity: 0.5, letterSpacing: '1px' }}>
                    VERSION ESTABLE - 42MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '6rem 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
          <div className="container reveal">
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '1px' }}>
              UNIRANK
            </p>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', marginTop: '1rem', opacity: 0.4 }}>
              Plataforma Independiente
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

const ModuleCard: React.FC<{ title: string; desc: string; stagger: string }> = ({ title, desc, stagger }) => (
  <div className={`module-card reveal ${stagger}`} style={{ 
    padding: '3rem 2rem', 
    border: '1px solid var(--border)',
    gridColumn: 'span 4',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  }}>
    <div className="icon" style={{ marginBottom: '2rem', opacity: 0.8 }}>
       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1">
         <rect x="3" y="3" width="18" height="18" rx="0.5" />
         <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
       </svg>
    </div>
    <h3 style={{ fontSize: '1.4rem', marginBottom: '1.2rem', fontWeight: 500 }}>{title}</h3>
    <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6 }}>{desc}</p>
  </div>
);

const Step: React.FC<{ num: string; text: string }> = ({ num, text }) => (
  <div className="reveal" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
    <span style={{ 
      fontFamily: 'var(--font-serif)', 
      fontSize: '1.8rem', 
      color: 'var(--primary)', 
      marginRight: '2rem',
      opacity: 0.6,
      lineHeight: 1
    }}>{num}</span>
    <p style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', width: '100%', fontWeight: 300 }}>
      {text}
    </p>
  </div>
);

export default App;
