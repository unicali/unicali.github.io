import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacidad | UniCali</title>
        <meta name="description"
              content="Política de privacidad de UniCali. Conoce qué información recopilamos, cómo la usamos y cómo puedes controlarla en todo momento." />
      </Helmet>

      <section className="section-standard">
        <div className="container" style={{ maxWidth: '900px' }}>

          <span className="section-label">Legal</span>

          <div className="reveal" style={{ marginBottom: '5rem' }}>
            <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Centro de Privacidad</span>
            <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontStyle: 'italic', marginBottom: '1.5rem' }}>Privacidad</h1>
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
              En UniCali, queremos que comprendas exactamente qué información recopilamos, cómo la usamos para mejorar tu vida universitaria y de qué manera la protegemos.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '5rem' }}>
              Hemos construido la aplicación bajo el principio de "Privacidad por Diseño": la soberanía de tu información académica reside en ti, y gran parte de ella vive directamente en tu dispositivo, no en nuestros servidores.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>

              {/* 01 */}
              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  01. ¿Qué información recopilamos?
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                  La información que recopilamos depende de los módulos que decidas usar. Solo procesamos lo necesario para brindarte el servicio.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingLeft: '1.25rem', borderLeft: '1px solid var(--border)' }}>

                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text)', fontWeight: 400, marginBottom: '0.6rem' }}>Tu cuenta y perfil</h3>
                    <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                      Para que puedas formar parte de la comunidad, recopilamos tu correo electrónico institucional, tu código de identificación estudiantil (CUI), la carrera a la que perteneces y el nombre de usuario que elijas.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text)', fontWeight: 400, marginBottom: '0.6rem' }}>Tu información académica</h3>
                    <p style={{ fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
                      Para mostrarte tus horarios, historial de notas y tareas pendientes, la aplicación se conecta con los portales institucionales. Lo más sensible ocurre solo en tu teléfono:
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
                      <li style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                        <strong>Bóveda segura:</strong> Tus credenciales y los accesos de sesión se guardan únicamente de forma local y encriptada en tu propio teléfono. No transmitimos ni almacenamos tus contraseñas en nuestros servidores.
                      </li>
                      <li style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                        <strong>Sin conexión:</strong> Tu progreso académico y tus cursos se guardan dentro de la app para que puedas consultarlos incluso sin internet.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text)', fontWeight: 400, marginBottom: '0.6rem' }}>Lo que publicas en la comunidad</h3>
                    <p style={{ fontSize: '1rem', lineHeight: '1.8', marginBottom: '0.85rem' }}>
                      Recopilamos el contenido que decides crear de forma pública o anónima:
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0 }}>
                      <li style={{ fontSize: '1rem', lineHeight: '1.8' }}>— Las evaluaciones y reseñas que dejas sobre docentes.</li>
                      <li style={{ fontSize: '1rem', lineHeight: '1.8' }}>— Tus publicaciones, comentarios, reacciones y reportes en el muro del campus.</li>
                      <li style={{ fontSize: '1rem', lineHeight: '1.8' }}>— Tu progreso: nivel, puntos, logros y posición en los rankings académicos.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text)', fontWeight: 400, marginBottom: '0.6rem' }}>Protección contra bots</h3>
                    <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                      Para proteger a la comunidad, trabajamos con servicios de seguridad integrados en tu sistema operativo que nos confirman que estás usando la versión oficial de la app, sin recopilar información personal sobre tu teléfono.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text)', fontWeight: 400, marginBottom: '0.6rem' }}>Ubicación — solo cuando la necesitas</h3>
                    <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                      Si participas en dinámicas de estudio presenciales (como los retos de biblioteca), pedimos acceso a tu ubicación únicamente en el momento en que inicias la sesión. La app no rastrea tu ubicación en segundo plano ni en ningún otro momento.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text)', fontWeight: 400, marginBottom: '0.6rem' }}>Notificaciones</h3>
                    <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                      Podemos pedirte permiso para enviarte avisos sobre actualizaciones académicas, respuestas en la comunidad o alertas importantes.
                    </p>
                  </div>

                </div>
              </article>

              {/* 02 */}
              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  02. ¿Cómo usamos tu información?
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.75rem' }}>
                  Usamos tu información para ofrecerte una experiencia universitaria integrada y segura. <strong>No utilizamos tus datos para perfilarte con fines publicitarios.</strong>
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.1rem', paddingLeft: '1.25rem', borderLeft: '1px solid var(--border)' }}>
                  <li style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>Sincronizar tu malla curricular y ayudarte a armar tus horarios.</li>
                  <li style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>Calcular tu posición en los rankings académicos, siempre que decidas participar en ellos.</li>
                  <li style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>Otorgarte logros y recompensas basadas en tu participación y hábitos de estudio.</li>
                  <li style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>Garantizar el anonimato al publicar reseñas o confesiones, desvinculando tu identidad del contenido publicado.</li>
                  <li style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>Moderar el contenido de la comunidad para mantener un entorno seguro y respetuoso.</li>
                  <li style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>Responder tus consultas a través del asistente académico. Tus preguntas no se usan para entrenar modelos de inteligencia artificial de terceros.</li>
                </ul>
              </article>

              {/* 03 */}
              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  03. ¿Compartimos tu información?
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.75rem' }}>
                  <strong>No vendemos tu información a nadie, y nunca lo haremos.</strong> Para operar y brindarte un servicio continuo, trabajamos con proveedores de tecnología bajo acuerdos estrictos de confidencialidad:
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingLeft: '1.25rem', borderLeft: '1px solid var(--border)' }}>
                  <li style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                    <strong>Infraestructura en la nube:</strong> Servidores que alojan la plataforma con cifrado y controles de acceso estrictos.
                  </li>
                  <li style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                    <strong>Asistente académico:</strong> Motores de procesamiento para responderte en tiempo real, con acuerdos que garantizan la confidencialidad de tus preguntas.
                  </li>
                  <li style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                    <strong>Seguridad y validación:</strong> Herramientas que protegen la plataforma contra accesos no autorizados.
                  </li>
                  <li style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                    <strong>Notificaciones:</strong> Servicios que nos permiten enviarte avisos a tu dispositivo de forma segura.
                  </li>
                </ul>
              </article>

              {/* 04 */}
              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  04. Menores de edad
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  UniCali está desarrollada exclusivamente para el ecosistema de educación superior, dirigida a estudiantes universitarios mayores de edad. No recopilamos información personal de menores de 13 años. Si detectamos que un usuario es menor de esa edad, eliminaremos su cuenta y sus datos de forma inmediata.
                </p>
              </article>

              {/* 05 */}
              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  05. ¿Por cuánto tiempo guardamos tu información?
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>
                  Conservamos la información de tu perfil y participación en la comunidad mientras tu cuenta esté activa, ya que es necesario para mantener la coherencia en foros y reseñas.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  La información guardada localmente en tu teléfono —como tus cursos o sesiones de plataformas virtuales— se conserva hasta que cierres sesión manualmente o desinstales la aplicación.
                </p>
              </article>

              {/* 06 */}
              <article>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  06. Tu control sobre tus datos
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.75rem' }}>
                  Tienes el control total sobre tu información en UniCali:
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2rem', paddingLeft: '1.25rem', borderLeft: '1px solid var(--border)' }}>
                  <li>
                    <strong style={{ display: 'block', fontSize: '1.05rem', marginBottom: '0.35rem', color: 'var(--text)' }}>Visibilidad en rankings</strong>
                    <span style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                      Desde la configuración de tu cuenta puedes elegir si tu progreso aparece en los rankings de la universidad o se mantiene completamente privado.
                    </span>
                  </li>
                  <li>
                    <strong style={{ display: 'block', fontSize: '1.05rem', marginBottom: '0.35rem', color: 'var(--text)' }}>Borrar datos locales</strong>
                    <span style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                      Puedes eliminar todo tu historial académico guardado en tu teléfono cerrando sesión o desinstalando la app.
                    </span>
                  </li>
                  <li>
                    <strong style={{ display: 'block', fontSize: '1.05rem', marginBottom: '0.35rem', color: 'var(--text)' }}>Eliminar tu cuenta</strong>
                    <span style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                      Si decides salir de UniCali, escríbenos a{' '}
                      <a href="mailto:soporte@unicali.app" style={{ color: 'var(--primary)', textDecoration: 'none', borderBottom: '1px solid var(--primary)' }}>
                        soporte@unicali.app
                      </a>{' '}
                      y eliminaremos permanentemente tu cuenta y todos tus datos personales de nuestros servidores.
                    </span>
                  </li>
                </ul>
              </article>

              {/* 07 */}
              <article style={{ paddingBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>
                  07. ¿Tienes dudas?
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                  Si tienes alguna pregunta sobre esta política, quieres conocer más sobre cómo protegemos tu información, o necesitas ejercer tus derechos sobre tus datos, estamos aquí para ayudarte.
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
