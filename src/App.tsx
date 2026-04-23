import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

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
    const handleScroll = () => {
      const scrollProgress = document.getElementById('scroll-progress');
      if (scrollProgress) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app">
      <div className="dots-overlay" />
      <div id="scroll-progress" />
      
      {/* Navigation */}
      <nav style={{ 
        padding: '2rem 0', 
        position: 'sticky', 
        top: 0, 
        background: 'var(--glass)', 
        backdropFilter: 'blur(20px)',
        zIndex: 100,
        transition: 'background-color 0.6s var(--easing-slow)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ 
            fontSize: '1rem', 
            fontWeight: 600, 
            color: 'var(--primary)', 
            textDecoration: 'none',
            letterSpacing: '0.3em',
            textTransform: 'uppercase'
          }}>
            UniCali
          </Link>
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
            <a href="#assets" className="nav-link">Recursos</a>
            <a href="#protocol" className="nav-link">Protocolo</a>
            <button 
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle Theme"
            >
              <ThemeIcon isDark={theme === 'dark'} />
            </button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="/terminos" element={<Terms />} />
      </Routes>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="editorial-grid">
            <div className="col-span-6 reveal">
              <h3 style={{ marginBottom: '2rem', fontSize: '2rem' }}>UniCali</h3>
              <p style={{ color: 'var(--text-dim)', maxWidth: '400px', fontWeight: 300 }}>
                Arquitectura de alto rendimiento para la gestión académica independiente. 
                Soberanía de datos y persistencia descentralizada.
              </p>
            </div>
            <div className="col-span-3 reveal stagger-1">
              <span className="sub-header" style={{ display: 'block', marginBottom: '1.5rem' }}>Ecosistema</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link to="/privacidad" className="nav-link">Privacidad</Link>
                <Link to="/terminos" className="nav-link">Términos</Link>
              </div>
            </div>
            <div className="col-span-3 reveal stagger-2">
              <span className="sub-header" style={{ display: 'block', marginBottom: '1.5rem' }}>Desarrollo</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="#" className="nav-link">Repositorio</a>
                <a href="#" className="nav-link">Versiones</a>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '8rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              © 2026 UNICALI • INDEPENDENT ACADEMIC INFRASTRUCTURE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ThemeIcon: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {isDark ? (
      <>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </>
    ) : (
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    )}
  </svg>
);

export default App;
