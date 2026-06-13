import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad | UniCali</title>
        <meta name="description"
              content="Conoce cómo UniCali protege tu información: tus credenciales nunca salen de tu teléfono, no vendemos datos y tú decides qué borrar." />
        <meta name="keywords"
              content="política de privacidad unicali, unicali privacidad, unicali protección de datos, unicali app privacidad estudiantes, unicali datos académicos" />
        <link rel="canonical" href="https://www.unicali.app/privacidad" />
        <meta property="og:title" content="Política de Privacidad | UniCali" />
        <meta property="og:description"
              content="Tus contraseñas nunca salen de tu teléfono. No vendemos tu información. Tú tienes el control total." />
        <meta property="og:url" content="https://www.unicali.app/privacidad" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="section-standard">
        <div className="container" style={{ maxWidth: '900px' }}>

          <span className="section-label">Legal</span>

          <div className="reveal" style={{ marginBottom: '5rem' }}>
            <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Centro de Privacidad</span>
            <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
              Privacidad
            </h1>
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
              Vigente desde junio de 2026
            </span>
          </div>

          <div className="reveal stagger-1" style={{ color: 'var(--text-dim)', fontWeight: 300 }}>
            <p style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', lineHeight: 1.5 }}>
              Queremos que uses UniCali con total tranquilidad. Por eso esta página existe: para explicarte, con claridad, qué hace la app con tu información y qué nunca hará.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '5rem' }}>
              La aplicación fue construida desde el principio bajo el principio de Privacidad por Diseño: la mayor parte de tu información académica vive en tu propio teléfono, no en nuestros servidores.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  01. Lo que guardamos para crear tu cuenta
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  Para que puedas acceder a la comunidad necesitamos los datos mínimos de registro: tu correo electrónico institucional, tu código de identificación estudiantil (CUI), la carrera a la que perteneces y el nombre de usuario que elijas. Eso es todo lo que pedimos para empezar.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  02. Tus notas y horarios viven en tu teléfono
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  Para mostrarte tus horarios, historial de notas y actividades pendientes, la app se conecta con los portales institucionales. Pero lo importante pasa en tu dispositivo: tus credenciales de acceso y las sesiones generadas se guardan exclusivamente en tu teléfono, encriptadas. Nosotros no las vemos ni las almacenamos en ningún servidor nuestro.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  Tu progreso académico y tus cursos también se guardan localmente, de modo que puedes consultarlos incluso sin conexión a internet. Si desinstals la app o cierras sesión, esa información desaparece completamente de tu dispositivo.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  03. Lo que tú decides publicar
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  Cuando participas en la comunidad —publicando en el muro del campus, dejando una reseña sobre un docente, comentando o reaccionando— ese contenido se guarda en nuestros servidores para que el resto de la comunidad pueda verlo. También registramos tu progreso en la plataforma (tu nivel, puntos y posición en rankings), siempre que decidas participar en ellos. Nada de esto ocurre sin que tú lo inicie.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  04. Tus reseñas y publicaciones son realmente anónimas
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  Nuestros sistemas están diseñados para desvincular tu identidad del contenido cuando publicas de forma anónima o evalúas a un docente. Esto significa que ni UniCali ni ningún otro usuario puede rastrear una publicación específica hasta tu nombre, correo o código de identificación. El anonimato no es una promesa: es parte de cómo funciona el sistema internamente.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  05. Para qué usamos tu información
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  <strong>No usamos tu información para mostrarte publicidad ni para construir perfiles comerciales.</strong> La usamos exclusivamente para darte el servicio: sincronizar tu malla curricular, calcular tu posición en los rankings si decides participar, otorgarte logros por tus hábitos de estudio, y moderar el contenido de la comunidad para que sea un espacio seguro.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  Cuando usas el asistente académico para resolver dudas sobre trámites o procesos, procesamos el texto de tu consulta para responderte. Esas preguntas no se utilizan para entrenar modelos de inteligencia artificial de terceros.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  06. Con quién trabajamos
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  <strong>No vendemos tu información a nadie, y nunca lo haremos.</strong> Para poder operar la plataforma trabajamos con proveedores de tecnología especializados —infraestructura en la nube, servicios de notificaciones, herramientas de seguridad y el motor del asistente académico— bajo acuerdos estrictos que les prohíben usar tus datos para cualquier fin que no sea prestarnos ese servicio concreto.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  Estos proveedores no tienen acceso a tus contraseñas ni a ningún dato que resida solo en tu dispositivo.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  07. Solo para estudiantes universitarios
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  UniCali está pensada exclusivamente para el ecosistema de educación superior. No recopilamos información de menores de 13 años. Si detectamos que un usuario es menor de esa edad, eliminaremos su cuenta y sus datos de forma inmediata.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  08. Por cuánto tiempo guardamos tus datos
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  Conservamos la información de tu perfil y tu participación en la comunidad mientras tu cuenta esté activa, porque es necesario para mantener la coherencia en foros y reseñas.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  La información académica guardada en tu teléfono —cursos, sesiones de plataformas virtuales, historial de notas— se conserva hasta que cierres sesión manualmente o desinstales la aplicación. En ese momento desaparece de tu dispositivo sin posibilidad de recuperación por nuestra parte.
                </p>
              </article>

              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  09. Tú decides qué pasa con tus datos
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  Desde la configuración de tu cuenta puedes elegir si tu progreso es visible en los rankings de la universidad o permanece completamente privado. Para borrar tu historial académico local basta con cerrar sesión o desinstalar la app.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  Si decides salir de UniCali por completo, escríbenos a{' '}
                  <a href="mailto:soporte@unicali.app" style={{ color: 'var(--primary)', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>
                    soporte@unicali.app
                  </a>{' '}
                  y eliminaremos permanentemente tu cuenta y todos tus datos personales de nuestros servidores. No hay formularios complicados ni períodos de espera arbitrarios.
                </p>
              </article>

              <article style={{ paddingBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  10. ¿Tienes alguna pregunta?
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                  Si algo no quedó claro, quieres saber más sobre cómo protegemos tu información, o necesitas ejercer cualquier derecho sobre tus datos, escríbenos. Estamos para ayudarte.
                </p>
                <a
                  href="mailto:soporte@unicali.app"
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.25em',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--primary)',
                    paddingBottom: '0.25rem',
                  }}
                >
                  soporte@unicali.app
                </a>
              </article>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
