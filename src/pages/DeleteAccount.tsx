import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const headingStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  color: 'var(--primary)',
  marginBottom: '1.5rem',
  fontFamily: 'var(--font-serif)',
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  lineHeight: '1.8',
  marginBottom: '1.5rem',
};

const DeleteAccount: React.FC = () => {
  const deletionMailto = 'mailto:soporte@unicali.app?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta%20UniCali&body=Solicito%20la%20eliminaci%C3%B3n%20de%20mi%20cuenta%20UniCali%20y%20de%20los%20datos%20personales%20asociados.%0A%0ACorreo%20asociado%20a%20la%20cuenta%3A%20%0ASeud%C3%B3nimo%20o%20c%C3%B3digo%20de%20estudiante%20%28si%20resulta%20necesario%29%3A%20';

  return (
    <>
      <Helmet>
        <title>Eliminación de Cuenta y Datos | UniCali</title>
        <meta name="description" content="Recurso público para solicitar la eliminación de una cuenta UniCali y de los datos personales asociados." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.unicali.app/eliminar-cuenta" />
        <meta property="og:title" content="Eliminación de Cuenta y Datos | UniCali" />
        <meta property="og:description" content="Procedimiento para solicitar la eliminación de una cuenta UniCali y sus datos asociados." />
        <meta property="og:url" content="https://www.unicali.app/eliminar-cuenta" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="section-standard">
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="section-label">Legal</span>
          <div className="reveal" style={{ marginBottom: '5rem' }}>
            <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Privacidad y Control</span>
            <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontStyle: 'italic', marginBottom: '1.5rem' }}>Eliminación de Cuenta</h1>
            <span style={{
              display: 'inline-block',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.55rem',
              textTransform: 'uppercase',
              letterSpacing: '0.4em',
              color: 'var(--text-dim)',
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
            }}>
              Recurso público de UniCali
            </span>
          </div>

          <div className="reveal stagger-1" style={{ color: 'var(--text-dim)', fontWeight: 300 }}>
            <p style={{ fontSize: '1.35rem', color: 'var(--text)', marginBottom: '5rem', fontFamily: 'var(--font-serif)', lineHeight: 1.6 }}>
              Toda persona titular de una cuenta UniCali puede solicitar su eliminación y la supresión de los datos personales asociados, incluso si ya no tiene instalada la aplicación.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              <article>
                <h2 style={headingStyle}>01. Cómo presentar la solicitud</h2>
                <ol style={{ fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                  <li>Utilice preferentemente el correo electrónico asociado a su cuenta UniCali.</li>
                  <li>Indique que solicita eliminar la cuenta y los datos personales asociados.</li>
                  <li>Incluya el correo de la cuenta y, solo si resulta necesario para identificarla, su seudónimo o código de estudiante.</li>
                  <li>No envíe contraseñas, datos de acceso ni fotografías de documentos de identidad.</li>
                </ol>
                <a
                  href={deletionMailto}
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--primary)',
                    paddingBottom: '0.35rem',
                  }}
                >
                  Solicitar eliminación por correo
                </a>
              </article>

              <article>
                <h2 style={headingStyle}>02. Verificación y plazo</h2>
                <p style={paragraphStyle}>
                  UniCali realizará una verificación razonable para impedir que una persona elimine una cuenta ajena. Si la solicitud procede, será atendida dentro de un plazo máximo de treinta días calendario. Se comunicará su conclusión al correo utilizado para presentar la solicitud.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Si la información remitida no permite identificar la cuenta, UniCali podrá solicitar datos adicionales estrictamente necesarios. La verificación nunca requerirá que el usuario revele su contraseña.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>03. Datos que serán eliminados o anonimizados</h2>
                <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }}>
                  <li>perfil, identificadores de cuenta y preferencias personales;</li>
                  <li>datos académicos asociados almacenados por UniCali;</li>
                  <li>identificadores de notificación y vínculos activos con la cuenta;</li>
                  <li>historiales, elementos guardados y participaciones privadas asociadas;</li>
                  <li>publicaciones, comentarios, reseñas y demás aportes, mediante eliminación o desvinculación razonable de la identidad;</li>
                  <li>otros datos personales cuya conservación ya no resulte necesaria.</li>
                </ul>
              </article>

              <article>
                <h2 style={headingStyle}>04. Conservación limitada</h2>
                <p style={paragraphStyle}>
                  Podrán conservarse temporalmente registros limitados de seguridad, soporte o moderación cuando sean necesarios para prevenir fraude, investigar abusos, atender reclamaciones, cumplir obligaciones legales o ejecutar una orden válida. Como regla general, estos registros no se conservarán por más de doce meses, salvo investigación activa, litigio o mandato legal.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Los datos estadísticos que no permitan vincular razonablemente la información con una persona podrán conservarse. Esta excepción no autoriza la conservación encubierta de la cuenta eliminada.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>05. Datos conservados fuera de UniCali</h2>
                <p style={paragraphStyle}>
                  La eliminación de la cuenta UniCali no suprime automáticamente archivos que el usuario haya guardado en servicios externos bajo su control, materiales descargados en su dispositivo ni información mantenida por la universidad u otros terceros independientes. El usuario deberá eliminarlos desde el servicio o dispositivo correspondiente.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Para mayor información consulte la{' '}
                  <Link to="/privacidad" style={{ color: 'var(--primary)' }}>Política de Privacidad</Link>{' '}
                  y los{' '}
                  <Link to="/terminos" style={{ color: 'var(--primary)' }}>Términos de Servicio</Link>.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DeleteAccount;
