import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Download from './pages/Download';
import GuideTIF from './pages/guides/GuideTIF';

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
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal');
      elements.forEach(el => observer.observe(el));
    };

    const timeoutId = setTimeout(observeElements, 100);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app">
      <div id="scroll-progress" />
      
      <nav className="nav-float">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--primary)', textDecoration: 'none', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
            UniCali
          </Link>
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
            <a href="/#features" className="nav-link">Sistemas</a>
            <Link to="/descargar" className="nav-link" style={{ color: 'var(--primary)', fontWeight: 600 }}>Descargar</Link>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
              <ThemeIcon isDark={theme === 'dark'} />
            </button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="/terminos" element={<Terms />} />
        <Route path="/descargar" element={<Download />} />
        <Route path="/guias/que-es-un-tif-unsa" element={<GuideTIF />} />
      </Routes>

      <footer style={{ padding: '10rem 0 4rem', borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div className="luxury-grid">
            <div className="col-span-4 reveal">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>UniCali</h3>
              <p style={{ color: 'var(--text-dim)', maxWidth: '300px', fontSize: '0.9rem', lineHeight: '1.8' }}>
                Infraestructura independiente diseñada para potenciar la vida académica. Hecho por estudiantes para la comunidad.
              </p>
            </div>
            
            <div className="col-span-3 reveal stagger-1">
              <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Recursos Académicos</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link to="/guias/que-es-un-tif-unsa" className="nav-link" style={{ textTransform: 'none', letterSpacing: 'normal' }}>¿Qué es un TIF?</Link>
                <span className="nav-link" style={{ opacity: 0.4, cursor: 'default', textTransform: 'none', letterSpacing: 'normal' }}>Guía sobre RSU</span>
                <span className="nav-link" style={{ opacity: 0.4, cursor: 'default', textTransform: 'none', letterSpacing: 'normal' }}>Calculadora Ponderada</span>
              </div>
            </div>

            <div className="col-span-3 reveal stagger-2">
              <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Soporte & Legal</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link to="/privacidad" className="nav-link">Privacidad</Link>
                <Link to="/terminos" className="nav-link">Términos</Link>
                <a href="mailto:soporte@unicali.io" className="nav-link">Contacto</a>
              </div>
            </div>

            <div className="col-span-2 reveal stagger-3">
              <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Social</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="#" className="nav-link">GitHub</a>
                <a href="#" className="nav-link">Comunidad</a>
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
