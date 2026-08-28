import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";

// Route-level code splitting — each page lands in its own chunk
const Home            = React.lazy(() => import('./pages/Home'));
const Status          = React.lazy(() => import('./pages/Status'));
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
const NotFound        = React.lazy(() => import('./pages/NotFound'));
const ProgramCalculator = React.lazy(() => import('./pages/tools/ProgramCalculator'));
const CalculatorHub   = React.lazy(() => import('./pages/tools/CalculatorHub'));

const Experience3D = React.lazy(() => import('./components/Experience3D'));

const App: React.FC = () => {
  const { pathname } = useLocation();
  const isProgrammaticRoute = pathname.startsWith('/calculadora');
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
      
      {/*
          El fondo 3D son ~885 KB de JavaScript. En las paginas programaticas
          —que es donde llega trafico de busqueda, mayoritariamente movil— ese
          coste castiga LCP e INP, y Core Web Vitals es senal de posicionamiento.
          El fondo es decorativo, asi que ahi simplemente no se carga.
      */}
      {!isProgrammaticRoute && (
        <Suspense fallback={null}>
          <Experience3D />
        </Suspense>
      )}
      
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
            <Route path="/status" element={<Status />} />
            {/* /404 se prerenderiza a dist/404.html, el fichero que Vercel sirve con
                status 404 real. El comodín cubre la navegación cliente dentro del SPA. */}
            {/* Rutas programaticas: el HTML lo sirve api/seo.ts desde Supabase;
                esta ruta cubre la navegacion cliente dentro del SPA. */}
            <Route path="/calculadora" element={<CalculatorHub />} />
            <Route path="/calculadora/:escuela" element={<ProgramCalculator />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <footer style={{ padding: '5rem 0 4rem', borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)', position: 'relative', zIndex: 1 }}>
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
                <Link to="/calculadora" className="nav-link" style={{ textTransform: 'none', letterSpacing: 'normal' }}>Calculadora por carrera</Link>
                <Link to="/status" className="nav-link" style={{ textTransform: 'none', letterSpacing: 'normal' }}>Estado del Sistema</Link>
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
              <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Desarrollo</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link to="/nosotros" className="nav-link" style={{ textTransform: 'none', letterSpacing: 'normal' }}>¿Por qué surge UniCali?</Link>
                <a href="https://www.unicali.app/versiones" className="nav-link" style={{ textTransform: 'none', letterSpacing: 'normal' }}>Versiones</a>
                <a href="https://github.com/unicali" className="nav-link" target="_blank" rel="noopener noreferrer" style={{ textTransform: 'none', letterSpacing: 'normal' }}>GitHub</a>
              </div>
            </div>
          </div>
          
          <div className="luxury-grid" style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
            <div className="col-span-6">
              <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0 }}>
                © 2026 UniCali • Ingeniería Académica Independiente
              </p>
            </div>
            <div className="col-span-4 footer-social-block">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 300, marginRight: '0.2rem' }}>Síguenos en:</span>
              <a href="https://www.facebook.com/profile.php?id=61592454906217" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-dim)', transition: 'all 0.3s ease', display: 'flex' }} onMouseEnter={e => { e.currentTarget.style.color = '#1877F2'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.transform = 'translateY(0)'; }} aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/unicali.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-dim)', transition: 'all 0.3s ease', display: 'flex' }} onMouseEnter={e => { e.currentTarget.style.color = '#E1306C'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.transform = 'translateY(0)'; }} aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://www.tiktok.com/@unicali.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-dim)', transition: 'all 0.3s ease', display: 'flex' }} onMouseEnter={e => { e.currentTarget.style.color = '#ff0050'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.transform = 'translateY(0)'; }} aria-label="TikTok">
                <TikTokIcon />
              </a>
              <a href="https://www.linkedin.com/in/unicali-inc-75b859405/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-dim)', transition: 'all 0.3s ease', display: 'flex' }} onMouseEnter={e => { e.currentTarget.style.color = '#0A66C2'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.transform = 'translateY(0)'; }} aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="mailto:soporte@unicali.app" style={{ color: 'var(--text-dim)', transition: 'all 0.3s ease', display: 'flex' }} onMouseEnter={e => { e.currentTarget.style.color = '#EA4335'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.transform = 'translateY(0)'; }} aria-label="Email">
                <EmailIcon />
              </a>
            </div>
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

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

export default App;
