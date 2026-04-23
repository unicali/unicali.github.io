import React from 'react';
import { Helmet } from 'react-helmet-async';

const Terms: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Términos y Condiciones | UniCali</title>
      </Helmet>
      <section style={{ padding: '8rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Términos y Condiciones</h1>
          <div style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Al utilizar UniCali, aceptas los siguientes términos de uso. Por favor, léelos cuidadosamente.
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginTop: '2.5rem', marginBottom: '1rem' }}>1. Independencia Institucional</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              UniCali es una plataforma desarrollada de manera independiente por estudiantes y para estudiantes. 
              <strong> NO tiene vinculación oficial,</strong> no es avalada, ni está afiliada con ninguna institución educativa formal.
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginTop: '2.5rem', marginBottom: '1rem' }}>2. Uso de la Información</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              La aplicación actúa como una herramienta de visualización y organización personal. 
              El usuario es responsable de verificar la exactitud de sus datos académicos directamente en los canales oficiales de su institución.
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginTop: '2.5rem', marginBottom: '1rem' }}>3. Limitación de Responsabilidad</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Los desarrolladores de UniCali no se hacen responsables por decisiones académicas tomadas basadas en la información 
              proyectada en la app, ni por fallos técnicos que puedan ocurrir durante su uso.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;
