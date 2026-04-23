import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

const App: React.FC = () => {
  const { pathname } = useLocation();

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

  return (
    <div className="app">
      <div id="scroll-progress" />
      
      {/* Navigation */}
      <nav style={{ 
        padding: '1.5rem 0', 
        position: 'sticky', 
        top: 0, 
        background: 'rgba(5, 5, 5, 0.8)', 
        backdropFilter: 'blur(20px)',
        zIndex: 100,
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ 
            fontSize: '1.25rem', 
            fontWeight: 600, 
            color: 'var(--text)', 
            textDecoration: 'none',
            letterSpacing: '-0.02em'
          }}>
            UniCali
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#funcionalidades" className="nav-link">Funciones</a>
            <a href="#descarga" className="nav-link">Descarga</a>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="/terminos" element={<Terms />} />
      </Routes>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="grid">
            <div className="col-span-6">
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>UniCali</h3>
              <p style={{ color: 'var(--text-dim)', maxWidth: '400px' }}>
                Plataforma independiente diseñada para potenciar la vida académica de los estudiantes.
              </p>
            </div>
            <div className="col-span-3">
              <h4 style={{ color: 'var(--text)', marginBottom: '1rem', fontSize: '1rem' }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/privacidad" className="nav-link">Privacidad</Link>
                <Link to="/terminos" className="nav-link">Términos</Link>
              </div>
            </div>
            <div className="col-span-3">
              <h4 style={{ color: 'var(--text)', marginBottom: '1rem', fontSize: '1rem' }}>Comunidad</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#" className="nav-link">GitHub</a>
                <a href="#" className="nav-link">Discord</a>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              © 2026 UniCali. Sin afiliación institucional oficial.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
