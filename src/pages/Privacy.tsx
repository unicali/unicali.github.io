import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Protocolo de Privacidad | UniCali</title>
      </Helmet>
      <section style={{ padding: '8rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '3rem', fontFamily: 'var(--font-serif)' }}>Protocolo de Privacidad</h1>
          <div style={{ color: 'var(--text-dim)', lineHeight: '1.8', fontWeight: 300 }}>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
              La infraestructura de UniCali ha sido diseñada bajo el paradigma de soberanía de datos. 
              La privacidad no es una funcionalidad, sino la base arquitectónica de nuestro sistema.
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginTop: '3rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>01. Perímetro Local</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              UniCali no requiere, captura ni procesa credenciales institucionales en servidores externos. 
              Toda la lógica de autenticación y visualización académica ocurre dentro del entorno seguro de tu dispositivo.
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginTop: '3rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>02. Persistencia Encriptada</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Los registros de calificaciones y promedios se almacenan mediante protocolos de persistencia local encriptada. 
              La eliminación de la aplicación resulta en la purga inmediata de toda la información residual.
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginTop: '3rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>03. Transparencia de Código</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Como iniciativa de código abierto, UniCali permite la auditoría pública de sus binarios para garantizar 
              la ausencia de telemetría, rastreadores o puertas traseras de terceros.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
