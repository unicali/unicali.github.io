import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacidad | Protocolo UniCali</title>
      </Helmet>
      <section>
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="section-label">Protección</span>
          <div className="reveal" style={{ marginBottom: '6rem' }}>
            <span className="sub-header" style={{ display: 'block', marginBottom: '1.5rem' }}>Estructura de Datos</span>
            <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontStyle: 'italic' }}>Privacidad</h1>
          </div>

          <div className="reveal stagger-1" style={{ color: 'var(--text-dim)', fontWeight: 300 }}>
            <p style={{ fontSize: '1.4rem', color: 'var(--text)', marginBottom: '4rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', lineHeight: 1.5 }}>
              La soberanía de la información es el pilar de nuestra arquitectura. 
              En UniCali, el usuario es el único propietario y custodio de su rastro académico.
            </p>

            <div className="editorial-grid" style={{ gap: '4rem 0' }}>
              <div className="col-span-12" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>01. Residencia Local</h2>
                <p style={{ fontSize: '1.1rem', maxWidth: '700px' }}>
                  UniCali opera bajo un modelo de persistencia local. Toda la información académica 
                  se procesa y almacena exclusivamente en el almacenamiento encriptado de su dispositivo móvil. 
                  No existe replicación en infraestructuras de terceros.
                </p>
              </div>

              <div className="col-span-12" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>02. Cero Telemetría</h2>
                <p style={{ fontSize: '1.1rem', maxWidth: '700px' }}>
                  Nuestra plataforma no implementa sistemas de rastreo, analíticas de comportamiento ni 
                  herramientas de telemetría. Su actividad dentro de la aplicación es invisible para nosotros y para cualquier entidad externa.
                </p>
              </div>

              <div className="col-span-12">
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>03. Código Abierto</h2>
                <p style={{ fontSize: '1.1rem', maxWidth: '700px' }}>
                  La integridad de nuestros protocolos de privacidad es auditable. El código fuente de UniCali 
                  es público, permitiendo la verificación independiente de nuestras promesas de seguridad y transparencia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
