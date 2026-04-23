import React from 'react';
import { Helmet } from 'react-helmet-async';

const Terms: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Términos | Marco Operativo UniCali</title>
      </Helmet>
      <section>
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="section-label">Legal</span>
          <div className="reveal" style={{ marginBottom: '6rem' }}>
            <span className="sub-header" style={{ display: 'block', marginBottom: '1.5rem' }}>Condiciones de Uso</span>
            <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontStyle: 'italic' }}>Términos</h1>
          </div>

          <div className="reveal stagger-1" style={{ color: 'var(--text-dim)', fontWeight: 300 }}>
            <p style={{ fontSize: '1.4rem', color: 'var(--text)', marginBottom: '4rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', lineHeight: 1.5 }}>
              El uso de la infraestructura digital de UniCali constituye la aceptación de los protocolos operativos 
              y descargos de responsabilidad aquí detallados.
            </p>

            <div className="editorial-grid" style={{ gap: '4rem 0' }}>
              <div className="col-span-12" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>01. Independencia</h2>
                <p style={{ fontSize: '1.1rem', maxWidth: '700px' }}>
                  UniCali es una iniciativa independiente desarrollada por estudiantes. 
                  <strong> No posee vinculación oficial,</strong> no es avalada, ni está afiliada con ninguna institución académica formal o gubernamental.
                </p>
              </div>

              <div className="col-span-12" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>02. Responsabilidad</h2>
                <p style={{ fontSize: '1.1rem', maxWidth: '700px' }}>
                  La plataforma actúa como una herramienta de visualización y organización personal. 
                  El usuario es el único responsable de validar la exactitud de sus registros académicos 
                  directamente en los canales oficiales proporcionados por su institución.
                </p>
              </div>

              <div className="col-span-12">
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>03. Limitación Técnica</h2>
                <p style={{ fontSize: '1.1rem', maxWidth: '700px' }}>
                  UniCali se suministra "tal cual", sin garantías de disponibilidad ininterrumpida. 
                  El equipo de desarrollo no se responsabiliza por decisiones académicas basadas en la información proyectada 
                  ni por posibles fallos técnicos derivados del entorno del dispositivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;
