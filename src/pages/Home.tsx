import React, { useState, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPhone = React.lazy(() => import('../components/PrivacyPhone'));

const Home: React.FC = () => {
  const [formState, setFormState] = useState<{
    submitting: boolean;
    succeeded: boolean;
    errors: string | null;
  }>({
    submitting: false,
    succeeded: false,
    errors: null,
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ submitting: true, succeeded: false, errors: null });
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://formspree.io/f/xeevvvze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setFormState({ submitting: false, succeeded: true, errors: null });
      } else {
        const errorData = await response.json();
        setFormState({ submitting: false, succeeded: false, errors: errorData.errors || 'Error en el envío.' });
      }
    } catch (error) {
      setFormState({ submitting: false, succeeded: false, errors: 'Ocurrió un error de red.' });
    }
  };

  return (
    <>
      <Helmet>
        <title>UniCali | Arquitectura Académica Minimalista</title>
      </Helmet>

      {/* Hero Section */}
      <section className="section-hero">
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
          <div className="reveal stagger-4" style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href="https://play.google.com/store/apps/details?id=com.mantra.unsap" className="btn-minimal" target="_blank" rel="noopener noreferrer">
              Instalar App
            </a>
            <a href="#early-access" className="btn-minimal" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
              Acceso Anticipado
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Section - Interactive 3D Phone */}
      <section className="gallery-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal" style={{ marginBottom: '4rem' }}>
            <span className="meta-label">Privacidad por Diseño</span>
            <h2 style={{ marginTop: '0.5rem' }}>Ecosistema Visual 3D</h2>
            <p style={{ color: 'var(--text-dim)', maxWidth: '500px', margin: '2rem auto', fontWeight: 300 }}>
              Mueve tu cursor para interactuar con la arquitectura UniCali. Observa cómo el filtro de privacidad protege tus datos desde ángulos laterales.
            </p>
          </div>
          
          <div className="reveal stagger-2">
            <Suspense fallback={<div style={{ height: '500px' }} />}>
              <PrivacyPhone />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section id="features" className="section-standard">
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

      {/* Early Access Section */}
      <section id="early-access" className="section-standard" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span className="meta-label">Beta Program</span>
            <h2 style={{ marginTop: '1rem' }}>Forma parte del equipo</h2>
            <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '1.5rem auto', fontWeight: 300 }}>
              Accede a funciones experimentales antes que nadie y ayúdanos a construir la mejor herramienta académica.
            </p>
          </div>

          <div className="form-container reveal stagger-2">
            {formState.succeeded ? (
              <div className="success-message">
                <h3 style={{ marginBottom: '1.5rem' }}>Registro Completado</h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem' }}>
                  Gracias por unirte. Ahora puedes acceder al canal de pruebas oficial.
                </p>
                <a href="https://play.google.com/apps/testing/com.mantra.unsap" className="btn-minimal" target="_blank" rel="noopener noreferrer">
                  Acceder a la Beta en Google Play
                </a>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="input-group">
                  <input type="text" name="name" id="name" className="input-minimal" placeholder=" " required />
                  <label htmlFor="name" className="input-label">Nombre Completo</label>
                </div>
                <div className="input-group">
                  <input type="email" name="email" id="email" className="input-minimal" placeholder=" " required />
                  <label htmlFor="email" className="input-label">Correo Institucional / Personal</label>
                </div>
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                  <button type="submit" className="btn-minimal" disabled={formState.submitting} style={{ border: 'none', cursor: 'pointer' }}>
                    {formState.submitting ? 'Registrando...' : 'Solicitar Acceso'}
                  </button>
                  <div style={{ marginTop: '2.5rem' }}>
                    <a href="https://play.google.com/apps/testing/com.mantra.unsap" className="secondary-link" target="_blank" rel="noopener noreferrer">
                      ¿Ya eres verificador? Acceso Directo
                    </a>
                  </div>
                </div>
                {formState.errors && (
                  <p style={{ color: 'var(--primary)', fontSize: '0.8rem', marginTop: '1.5rem', textAlign: 'center' }}>
                    {formState.errors}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Install Section */}
      <section id="install" className="section-standard" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div className="luxury-grid">
            <div className="col-span-6 reveal">
              <h2 style={{ marginBottom: '4rem' }}>Tres pasos para empezar</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <Step num="01" title="Instalar" text="Abre Google Play, busca UniCali e instala la app de forma segura." />
                <Step num="02" title="Registrarse" text="Crea tu cuenta con tu correo institucional y tu código de estudiante." />
                <Step num="03" title="Explorar" text="Accede a tus notas, horarios, comunidad y todas las funciones académicas." />
              </div>
            </div>
            <div className="col-span-6 reveal stagger-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <a
                href="https://play.google.com/store/apps/details?id=com.mantra.unsap"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  aspectRatio: '1',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg)',
                  textDecoration: 'none',
                  transition: 'background var(--duration-fast) var(--ease-out)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--primary)" aria-hidden="true">
                  <path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l16 8.5-16 8.5c-.5.33-1.5.33-1.5-.5z" />
                </svg>
                <div style={{ height: '2rem' }} />
                <span className="meta-label">Google Play</span>
                <div style={{ height: '1rem' }} />
                <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.2em' }}>PRUEBA ABIERTA · GRATIS</p>
              </a>
            </div>
          </div>
        </div>
      </section>
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
