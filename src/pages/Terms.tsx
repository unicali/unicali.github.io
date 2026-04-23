import React from 'react';
import { Helmet } from 'react-helmet-async';

const Terms: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Términos de Servicio | UniCali</title>
      </Helmet>
      <section style={{ padding: '8rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '3rem', fontFamily: 'var(--font-serif)' }}>Términos de Servicio</h1>
          <div style={{ color: 'var(--text-dim)', lineHeight: '1.8', fontWeight: 300 }}>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
              El uso del ecosistema UniCali implica la aceptación de los protocolos operativos detallados a continuación.
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginTop: '3rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>01. Autonomía Operativa</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              UniCali es una plataforma de distribución independiente desarrollada por estudiantes. 
              <strong> No posee filiación, aval ni vinculación oficial</strong> con instituciones académicas formales.
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginTop: '3rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>02. Integridad de la Información</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              La aplicación funciona como un visor de datos académicos para uso personal. 
              Es responsabilidad del usuario contrastar la información proyectada con los sistemas institucionales oficiales.
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginTop: '3rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>03. Descargo de Responsabilidad</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              El equipo de desarrollo no se responsabiliza por decisiones académicas derivadas del uso de la herramienta 
              ni por interrupciones técnicas que puedan afectar la visualización de datos en tiempo real.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;
