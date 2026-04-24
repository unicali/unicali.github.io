import React from 'react';
import { Helmet } from 'react-helmet-async';

const Download: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Descargar UniCali | Instalación Segura</title>
        <meta name="description" content="Descarga UniCali v1.5.0 para Android. Sigue los pasos para una instalación segura y privada de tu ecosistema académico." />
      </Helmet>
      
      <section style={{ padding: '12rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div className="reveal">
            <span className="meta-label">Acceso Directo</span>
            <h1 style={{ marginTop: '2rem', fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontStyle: 'italic' }}>Confianza Digital</h1>
            <p style={{ color: 'var(--text-dim)', marginTop: '2rem', fontSize: '1.2rem', fontWeight: 300, lineHeight: 1.6 }}>
              Estás a un paso de optimizar tu vida universitaria. UniCali es un binario verificado, libre de rastreadores y diseñado para funcionar bajo tu total control.
            </p>
          </div>

          <div className="reveal stagger-1" style={{ marginTop: '6rem', padding: '4rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '3rem' }}>Protocolo de Despliegue</h2>
            
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 600 }}>01</div>
                <p style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>Descarga el archivo <strong>app-release.apk</strong> (42MB).</p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 600 }}>02</div>
                <p style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>Habilita "Instalar aplicaciones desconocidas" en los ajustes de tu navegador o gestor de archivos.</p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 600 }}>03</div>
                <p style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>Abre el archivo e inicia tu nuevo ecosistema académico.</p>
              </div>
            </div>

            <div style={{ marginTop: '4rem' }}>
              <a href="https://github.com/unicali/unicali.github.io/releases/tag/v1.0.2" className="btn-minimal" style={{ width: '100%' }}>
                Comenzar Descarga
              </a>
              <p style={{ marginTop: '2rem', fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
                SHA-256 VERIFICADO • BUILD 1.0.2
              </p>
            </div>
          </div>

          <div className="reveal stagger-2" style={{ marginTop: '4rem' }}>
            <a href="https://github.com/unicali/unicali.github.io/releases" className="secondary-link" target="_blank" rel="noopener noreferrer">
              Ver todas las versiones en GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Download;
