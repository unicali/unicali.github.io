import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Protocolo de Privacidad | UniCali Architecture</title>
      </Helmet>
      <section style={{ padding: '10rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="section-label">Protección</span>
          <div className="reveal" style={{ marginBottom: '8rem' }}>
            <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Estructura de Datos</span>
            <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontStyle: 'italic' }}>Privacidad</h1>
          </div>

          <div className="reveal stagger-1" style={{ color: 'var(--text-dim)', fontWeight: 300 }}>
            <p style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '5rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', lineHeight: 1.5 }}>
              En el ecosistema UniCali, la soberanía de la información académica reside exclusivamente en el estudiante. 
              Nuestra arquitectura ha sido diseñada bajo el paradigma de "Privacidad por Diseño".
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>01. Persistencia Local (Offline-First)</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  La integridad de sus datos (horarios, registros académicos y directorios personalizados) se gestiona mediante almacenamiento local encriptado. 
                  UniCali carece de infraestructuras centralizadas de recolección de datos, garantizando que su historial nunca sea monetizado ni analizado por entidades externas. 
                  Al remover la aplicación, la purga de datos es absoluta y definitiva.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>02. Integración con Entornos Virtuales</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  Para la sincronización de actividades pendientes, la aplicación establece una conexión directa con las plataformas institucionales bajo estrictos protocolos de seguridad:
                </p>
                <ul style={{ listStyle: 'none', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
                  <li style={{ marginBottom: '1rem' }}>
                    <strong>Cero Captura de Credenciales:</strong> El acceso se realiza mediante el flujo oficial de autenticación de Google en un entorno aislado. UniCali nunca intercepta ni almacena sus contraseñas.
                  </li>
                  <li>
                    <strong>Bóveda de Sesión:</strong> Se utiliza un token criptográfico temporal almacenado en el Secure Storage del dispositivo, destinado exclusivamente a la consulta de metadatos académicos.
                  </li>
                </ul>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>03. Red de Evaluación Docente</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  El módulo de "Comunidad Docente" permite valoraciones anónimas protegidas por hashes criptográficos. 
                  Aunque los promedios globales se procesan de forma distribuida, el sistema garantiza la imposibilidad de vincular una identidad (nombre, CUI o correo) con una evaluación específica, preservando el anonimato absoluto del emisor.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>04. Gestión de Permisos</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  La aplicación solicita acceso a servicios del sistema (conectividad y notificaciones) únicamente cuando la funcionalidad operativa lo requiere. 
                  No implementamos sistemas de rastreo geográfico ni acceso a sistemas de archivos personales ajenos al entorno de la app.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
