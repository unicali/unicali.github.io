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

      {/* Ecosystem — Módulos */}
      <section id="features" className="section-standard">
        <div className="container">

          <div className="reveal" style={{ borderTop: '1px solid var(--border)', paddingTop: '4rem', marginBottom: '6rem' }}>
            <span className="meta-label">Módulos</span>
            <h2 style={{ marginTop: '1rem', maxWidth: '640px' }}>
              Un ecosistema académico completo
            </h2>
            <p style={{ marginTop: '1.5rem', color: 'var(--text-dim)', fontWeight: 300, maxWidth: '460px', lineHeight: 1.7 }}>
              Cada herramienta responde a un problema real de la vida universitaria.
            </p>
          </div>

          <div className="luxury-grid">
            <FeatureItem icon={<NotesIcon />} title="Gestión de Notas"
              desc="Visualiza calificaciones por curso y período con promedios ponderados calculados en tiempo real."
              stagger="stagger-1" />
            <FeatureItem icon={<TrendIcon />} title="Motor Predictivo"
              desc="Simula sustitutorios y calcula el techo máximo de nota alcanzable antes de cada examen."
              stagger="stagger-2" />
            <FeatureItem icon={<ShieldIcon />} title="Soberanía de Datos"
              desc="Tu información académica vive en tu dispositivo, cifrada y disponible sin conexión."
              stagger="stagger-3" />
          </div>

          <div className="luxury-grid" style={{ marginBottom: '2rem' }}>
            <FeatureItem icon={<LibraryIcon />} title="Biblioteca"
              desc="Repositorio personal de apuntes y materiales académicos con acceso y carga sin conexión."
              stagger="stagger-1" />
            <FeatureItem icon={<RecorderIcon />} title="Grabadora de Clases"
              desc="Graba el audio de tus sesiones académicas directamente desde la app para no perder ningún detalle."
              stagger="stagger-2" />
            <FeatureItem icon={<ReviewIcon />} title="Reseña de Docentes"
              desc="Consulta y comparte calificaciones anónimas y colaborativas del cuerpo docente de la UNSA."
              stagger="stagger-3" />
          </div>

          <CampusSocialCard />

          <div className="luxury-grid">
            <FeatureItem icon={<AIIcon />} title="IA para Consultas"
              desc="Asistente académico con comprensión de contexto y memoria de sesión para resolver tus dudas al instante."
              stagger="stagger-1" beta span={6} />
            <FeatureItem icon={<GroupCalIcon />} title="Planificación Grupal"
              desc="Coordina tareas y proyectos con tu equipo universitario desde un espacio compartido dentro de la app."
              stagger="stagger-2" beta span={6} />
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

/* ── Icons ─────────────────────────────────────────────────── */
const Ico: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const NotesIcon: React.FC = () => <Ico><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></Ico>;
const TrendIcon: React.FC = () => <Ico><polyline points="1 20 7 14 11 18 17 8 23 4"/><polyline points="17 4 23 4 23 10"/></Ico>;
const ShieldIcon: React.FC = () => <Ico><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Ico>;
const LibraryIcon: React.FC = () => <Ico><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/></Ico>;
const RecorderIcon: React.FC = () => <Ico><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></Ico>;
const ReviewIcon: React.FC = () => <Ico><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Ico>;
const CommunityIcon: React.FC = () => <Ico><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Ico>;
const AIIcon: React.FC = () => <Ico><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></Ico>;
const GroupCalIcon: React.FC = () => <Ico><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="8" y1="19" x2="12" y2="19"/></Ico>;

/* ── Feature Card ───────────────────────────────────────────── */
const FeatureItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  stagger: string;
  beta?: boolean;
  span?: 4 | 6;
}> = ({ icon, title, desc, stagger, beta = false, span = 4 }) => (
  <div className={`col-span-${span} minimal-card reveal ${stagger}`} style={{ position: 'relative' }}>
    {beta && (
      <span className="meta-label" style={{
        position: 'absolute', top: '1.5rem', right: '1.5rem',
        border: '1px solid var(--border)', padding: '0.2rem 0.7rem',
      }}>
        Beta
      </span>
    )}
    <div style={{ marginBottom: '1.5rem', color: 'var(--primary)', opacity: 0.65 }}>{icon}</div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.8rem', color: 'var(--primary)' }}>{title}</h3>
    <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 200, lineHeight: 1.75 }}>{desc}</p>
  </div>
);

/* ── Campus Social — Featured card ─────────────────────────── */
const CampusSocialCard: React.FC = () => (
  <div className="reveal" style={{
    border: '1px solid var(--border)',
    background: 'var(--bg-subtle)',
    padding: '4rem 3rem',
    marginBottom: '2rem',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '2rem',
    overflow: 'hidden',
  }}>
    <div style={{ flex: '1', minWidth: '260px' }}>
      <div style={{ marginBottom: '1.5rem', color: 'var(--primary)', opacity: 0.65 }}>
        <CommunityIcon />
      </div>
      <h3 style={{
        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
        marginBottom: '1.5rem',
        color: 'var(--primary)',
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
      }}>
        Campus Social
      </h3>
      <p style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 300, lineHeight: 1.8, maxWidth: '420px' }}>
        La comunidad universitaria en tu bolsillo. Publicaciones, foro en tiempo real, directorio de estudiantes y compartir materiales con tu red académica.
      </p>
    </div>
    <div aria-hidden="true" style={{ flexShrink: 0, pointerEvents: 'none' }}>
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(5rem, 14vw, 10rem)',
        fontStyle: 'italic',
        color: 'var(--primary)',
        opacity: 0.06,
        lineHeight: 0.9,
        userSelect: 'none',
        margin: 0,
      }}>
        Campus
      </p>
    </div>
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
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>{title}</h3>
      <p style={{ fontSize: '0.95rem', color: 'var(--text-dim)', fontWeight: 300 }}>{text}</p>
    </div>
  </div>
);

export default Home;
