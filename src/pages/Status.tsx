import React from 'react';
import { Helmet } from 'react-helmet-async';

// Estructura para escalabilidad. Puede ser reemplazado por llamadas a un API en el futuro.
const SYSTEM_STATUS = {
  overall: 'Problemas Menores', // Operativo, Problemas Menores, Interrupción Mayor
  lastUpdated: '25 Agosto 2026, 10:30 AM'
};

const INCIDENTS = [
  {
    id: 1,
    date: '25 Agosto 2026',
    title: 'Aviso: Problemas con Autenticación de Google',
    status: 'Resolviendo',
    description: 'Se ha detectado un error con los usuarios que fueron autenticados mediante Google. Aclaramos que NO es un problema de seguridad, es un inconveniente estrictamente de autenticación. El problema está siendo resuelto desde el 24 de agosto y la actualización que lo soluciona llegará en 24 horas.'
  },
  {
    id: 2,
    date: '24 Agosto 2026',
    title: 'Mantenimiento Programado',
    status: 'Resuelto',
    description: 'Se realizó una actualización en los servidores de la base de datos principal, causando intermitencia en el inicio de sesión durante 30 minutos.'
  },
  {
    id: 3,
    date: '15 Agosto 2026',
    title: 'Aviso: Lentitud en sincronización de notas',
    status: 'Investigando',
    description: 'Hemos detectado que algunos usuarios están experimentando retrasos al sincronizar sus promedios. El equipo técnico está investigando la causa raíz.'
  }
];

const Status: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Estado del Sistema | UniCali</title>
        <meta name="description" content="Consulta el estado operativo actual de la aplicación UniCali, avisos de mantenimiento y últimos incidentes reportados." />
        <link rel="canonical" href="https://www.unicali.app/status" />
        
        <meta property="og:title" content="Estado del Sistema | UniCali" />
        <meta property="og:description" content="Consulta el estado operativo actual y avisos importantes sobre la plataforma UniCali." />
        <meta property="og:url" content="https://www.unicali.app/status" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UniCali" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Estado del Sistema | UniCali" />
        <meta name="twitter:description" content="Consulta el estado operativo actual y avisos importantes sobre la plataforma UniCali." />
      </Helmet>

      <article className="section-hero">
        <div className="container" style={{ maxWidth: '850px' }}>
          <span className="section-label">Sistema</span>
          
          <div className="reveal">
            <h1 style={{ marginTop: '2rem', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontStyle: 'italic' }}>
              Estado Operativo
            </h1>
          </div>

          <div className="reveal stagger-1" style={{ marginTop: '3rem', padding: '3rem', border: '1px solid var(--border)', background: 'var(--bg-subtle)', borderRadius: '12px' }}>
            <span className="meta-label">Estado Actual</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: SYSTEM_STATUS.overall === 'Operativo' ? '#4CAF50' : '#FF9800', boxShadow: SYSTEM_STATUS.overall === 'Operativo' ? '0 0 10px rgba(76, 175, 80, 0.5)' : '0 0 10px rgba(255, 152, 0, 0.5)' }}></div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text)' }}>
                Todos los sistemas {SYSTEM_STATUS.overall.toLowerCase()}
              </h2>
            </div>
            <p style={{ marginTop: '1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              Última actualización: {SYSTEM_STATUS.lastUpdated}
            </p>
          </div>

          <div className="reveal stagger-2" style={{ marginTop: '5rem', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '2rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Incidentes y Avisos
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {INCIDENTS.map((incident) => (
                <div key={incident.id} style={{ paddingLeft: '2rem', borderLeft: '2px solid var(--border)', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--border)' }}></div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>{incident.date}</span>
                  <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--text)' }}>{incident.title}</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: incident.status === 'Resuelto' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)', color: incident.status === 'Resuelto' ? '#4CAF50' : '#FF9800', border: incident.status === 'Resuelto' ? '1px solid rgba(76, 175, 80, 0.2)' : '1px solid rgba(255, 152, 0, 0.2)' }}>
                      {incident.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>{incident.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ textAlign: 'center', opacity: 0.4, paddingBottom: '3rem' }}>
            <span className="meta-label">Transparencia y Operatividad</span>
          </div>
        </div>
      </article>
    </>
  );
};

export default Status;
