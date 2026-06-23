import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";

// Route-level code splitting — each page lands in its own chunk
const Home            = React.lazy(() => import('./pages/Home'));
const Privacy         = React.lazy(() => import('./pages/Privacy'));
const Terms           = React.lazy(() => import('./pages/Terms'));
const Download        = React.lazy(() => import('./pages/Download'));
const GuideTIF        = React.lazy(() => import('./pages/guides/GuideTIF'));
const GuideRSU        = React.lazy(() => import('./pages/guides/GuideRSU'));
const GradeCalculator = React.lazy(() => import('./pages/tools/GradeCalculator'));
const AboutUs         = React.lazy(() => import('./pages/AboutUs'));
const Developers      = React.lazy(() => import('./pages/Developers'));
const DevRoom         = React.lazy(() => import('./pages/DevRoom'));
const Versions        = React.lazy(() => import('./pages/Versions'));
const Reviews         = React.lazy(() => import('./pages/Reviews'));

const Experience3D = React.lazy(() => import('./components/Experience3D'));

const App: React.FC = () => {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const observeAll = () =>
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Pass inicial — elementos ya en el DOM (carga eagerly o caché)
    observeAll();

    // MutationObserver — detecta elementos .reveal que agregan los chunks lazy
    // después de que Suspense resuelve el import dinámico
    let rafId = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(observeAll);
    });
    mo.observe(document.getElementById('root') ?? document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app" style={{ position: 'relative' }}>
      <Analytics />
      <div id="scroll-progress" />
      
      <Suspense fallback={null}>
        <Experience3D />
      </Suspense>
      
      <nav className="nav-float" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="nav-logo" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--primary)', textDecoration: 'none', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
            UniCali
          </Link>
          <div className="nav-links-group" style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
            <a href="/#features" className="nav-link">Sistemas</a>
            <Link to="/descargar" className="nav-link" style={{ color: 'var(--primary)', fontWeight: 600 }}>Instalar</Link>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
              <ThemeIcon isDark={theme === 'dark'} />
            </button>
          </div>
        </div>
      </nav>

      {/* 
          LAYOUT-LAYERS:
          Contenido envuelto en zIndex 1 para flotar sobre el fondo 3D.
      */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacidad" element={<Privacy />} />
            <Route path="/terminos" element={<Terms />} />
            <Route path="/descargar" element={<Download />} />
            <Route path="/guias/que-es-un-tif-unsa" element={<GuideTIF />} />
            <Route path="/guias/que-es-rsu-unsa" element={<GuideRSU />} />
            <Route path="/herramientas/calculadora-unsa" element={<GradeCalculator />} />
            <Route path="/nosotros" element={<AboutUs />} />
            <Route path="/equipo" element={<Developers />} />
            <Route path="/reseñas" element={<Reviews />} />
            <Route path="/resenas" element={<Reviews />} />
            <Route path="/versiones" element={<Versions />} />
            <Route path="/dev" element={<DevRoom />} />
          </Routes>
        </Suspense>
      </main>

      <footer style={{ padding: '10rem 0 4rem', borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="luxury-grid">
            <div className="col-span-4 reveal">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>UniCali</h3>
              <p style={{ color: 'var(--text-dim)', maxWidth: '300px', fontSize: '0.9rem', lineHeight: '1.8' }}>
                Infraestructura independiente diseñada para potenciar la vida académica. Hecho por estudiantes para la comunidad.
              </p>
            </div>
            
            <div className="col-span-2 reveal stagger-1">
              <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Recursos</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link to="/guias/que-es-un-tif-unsa" className="nav-link" style={{ textTransform: 'none', letterSpacing: 'normal' }}>¿Qué es un TIF?</Link>
                <Link to="/guias/que-es-rsu-unsa" className="nav-link" style={{ textTransform: 'none', letterSpacing: 'normal' }}>¿Qué es la RSU?</Link>
                <Link to="/herramientas/calculadora-unsa" className="nav-link" style={{ textTransform: 'none', letterSpacing: 'normal' }}>Calculadora</Link>
              </div>
            </div>

            <div className="col-span-2 reveal stagger-2">
              <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Legal</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link to="/privacidad" className="nav-link">Privacidad</Link>
                <Link to="/terminos" className="nav-link">Términos</Link>
              </div>
            </div>

            <div className="col-span-2 reveal stagger-3">
              <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Social</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="https://github.com/unicali" className="nav-link" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="mailto:unicali@proton.me" className="nav-link" style={{ textTransform: 'none' }}>Email</a>
              </div>
            </div>

            <div className="col-span-2 reveal stagger-4">
              <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Desarrolladores</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link to="/nosotros" className="nav-link" style={{ textTransform: 'none', letterSpacing: 'normal' }}>¿Por qué surge UniCali?</Link>
                <Link to="/equipo" className="nav-link" style={{ textTransform: 'none', letterSpacing: 'normal' }}>¿Quiénes somos?</Link>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '8rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              © 2026 UniCali • Ingeniería Académica Independiente
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ThemeIcon: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
    {isDark ? (
      <><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>
    ) : (
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    )}
  </svg>
);

export default App;
