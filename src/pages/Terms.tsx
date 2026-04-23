import React from 'react';
import { Helmet } from 'react-helmet-async';

const Terms: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Términos de Servicio | Marco Operativo UniCali</title>
      </Helmet>
      <section style={{ padding: '10rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="section-label">Legal</span>
          <div className="reveal" style={{ marginBottom: '8rem' }}>
            <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Condiciones de Uso</span>
            <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontStyle: 'italic' }}>Términos</h1>
          </div>

          <div className="reveal stagger-1" style={{ color: 'var(--text-dim)', fontWeight: 300 }}>
            <p style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '5rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', lineHeight: 1.5 }}>
              El acceso a la infraestructura digital de UniCali implica la adhesión incondicional a los protocolos 
              operativos y límites de responsabilidad detallados en el presente marco de servicio.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>01. Naturaleza e Independencia</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  UniCali y su ecosistema de aplicaciones conforman una iniciativa de ingeniería independiente desarrollada por y para la comunidad estudiantil. 
                  <strong> No existe vínculo oficial, aval ni patrocinio</strong> por parte de la Universidad Nacional de San Agustín (UNSA). 
                  Cualquier referencia a marcas, logotipos o portales institucionales se realiza bajo criterios de interoperabilidad tecnológica y uso referencial.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>02. Responsabilidad Académica</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  UniCali funciona exclusivamente como una herramienta de optimización y apoyo. 
                  El usuario asume la responsabilidad total de verificar fechas críticas y compromisos académicos en los canales oficiales de la universidad. 
                  UniCali no se responsabiliza por discrepancias derivadas de interrupciones en sistemas externos o fallos en la sincronización de datos de terceros.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>03. Código de Conducta Comunitaria</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  La participación en los sistemas de evaluación docente exige honestidad y objetividad. 
                  Nuestro marco técnico emplea métricas cuantitativas para mitigar el acoso y la difamación. 
                  Cualquier intento de subvertir la integridad del sistema de votaciones resultará en la revocación del acceso a las funciones distribuidas.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>04. Propiedad Intelectual y Uso</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  El diseño, la arquitectura de marca y el código fuente de UniCali están protegidos bajo leyes de propiedad intelectual. 
                  Se autoriza su uso personal y gratuito, prohibiéndose estrictamente cualquier forma de distribución comercial no autorizada o ingeniería inversa con fines maliciosos.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;
