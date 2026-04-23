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
      <div id="scroll-progress" />
      
      {/* Floating Navigation */}
      <nav className="nav-float">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ 
            fontSize: '0.85rem', 
            fontWeight: 500, 
            color: 'var(--primary)', 
            textDecoration: 'none',
            letterSpacing: '0.4em',
            textTransform: 'uppercase'
          }}>
            UniCali
          </Link>
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
            <a href="#features" className="nav-link">Sistemas</a>
            <a href="#install" className="nav-link">Despliegue</a>
            <button 
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center'
              }}
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

      {/* Minimalist Footer */}
      <footer style={{ padding: '8rem 0 4rem', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="luxury-grid">
            <div className="col-span-6 reveal">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>UniCali</h3>
              <p style={{ color: 'var(--text-dim)', maxWidth: '350px', fontSize: '0.9rem' }}>
                Infraestructura digital independiente para la optimización académica y la soberanía de datos del estudiante.
              </p>
            </div>
            <div className="col-span-3 reveal stagger-1">
              <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Marco Legal</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <Link to="/privacidad" className="nav-link">Privacidad</Link>
                <Link to="/terminos" className="nav-link">Términos</Link>
              </div>
            </div>
            <div className="col-span-3 reveal stagger-2">
              <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Ecosistema</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <a href="#" className="nav-link">Código Fuente</a>
                <a href="#" className="nav-link">Documentación</a>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              © 2026 UniCali • Ingeniería Independiente
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ThemeIcon: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    {isDark ? (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </>
    ) : (
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    )}
  </svg>
);

export default App;
