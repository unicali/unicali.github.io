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

const listStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  lineHeight: '1.8',
  paddingLeft: '1.5rem',
  margin: 0,
};

const Terms: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Términos de Servicio | UniCali</title>
        <meta name="description" content="Términos de Servicio de UniCali: reglas de uso, contenido comunitario, reseñas docentes, moderación, responsabilidad y descargos aplicables." />
        <meta name="keywords" content="términos de servicio UniCali, condiciones de uso, normas de la comunidad, reseñas docentes" />
        <link rel="canonical" href="https://www.unicali.app/terminos" />
        <meta property="og:title" content="Términos de Servicio | UniCali" />
        <meta property="og:description" content="Condiciones jurídicas aplicables al acceso y uso de los servicios de UniCali." />
        <meta property="og:url" content="https://www.unicali.app/terminos" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="section-standard">
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="section-label">Legal</span>
          <div className="reveal" style={{ marginBottom: '5rem' }}>
            <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Condiciones de Uso</span>
            <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontStyle: 'italic', marginBottom: '1.5rem' }}>Términos de Servicio</h1>
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
              Vigentes desde el 21 de septiembre de 2026
            </span>
          </div>

          <div className="reveal stagger-1" style={{ color: 'var(--text-dim)', fontWeight: 300 }}>
            <p style={{ fontSize: '1.35rem', color: 'var(--text)', marginBottom: '5rem', fontFamily: 'var(--font-serif)', lineHeight: 1.6 }}>
              Los presentes Términos constituyen un acuerdo jurídicamente vinculante entre el usuario y UniCali. El registro, acceso o utilización del servicio implica la aceptación íntegra de estas condiciones y de la Política de Privacidad.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              <article>
                <h2 style={headingStyle}>01. Identificación, naturaleza e independencia</h2>
                <p style={paragraphStyle}>
                  UniCali es una iniciativa académica independiente con domicilio de contacto en Arequipa, Perú. No es un servicio oficial, dependencia, representante, concesionario ni entidad patrocinada por la Universidad Nacional de San Agustín de Arequipa.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Las denominaciones institucionales se utilizan únicamente para identificar servicios, programas y fuentes académicas de interés para el usuario. Ninguna referencia implica afiliación, aprobación o garantía por parte de la universidad o de sus autoridades.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>02. Elegibilidad y aceptación</h2>
                <p style={paragraphStyle}>
                  El servicio está destinado a personas de catorce años o más vinculadas al entorno universitario. Queda prohibido el registro de menores de catorce años. Los usuarios adolescentes deberán utilizar el servicio de conformidad con la legislación aplicable y bajo las salvaguardas que correspondan a su edad.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Antes de publicar, comentar, cargar materiales o emitir reseñas, el usuario deberá haber aceptado estos Términos. Si no está de acuerdo con cualquiera de sus disposiciones, deberá abstenerse de crear una cuenta o utilizar el servicio.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>03. Cuenta y deberes de seguridad</h2>
                <p style={paragraphStyle}>
                  El usuario deberá proporcionar información verdadera, actual y suficiente, mantener la confidencialidad de sus medios de acceso y comunicar sin demora cualquier uso no autorizado. No podrá ceder, vender, prestar ni utilizar cuentas ajenas.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  UniCali podrá exigir verificaciones razonables para prevenir suplantaciones, abuso, manipulación o acceso indebido. El usuario responde por las actividades realizadas desde su cuenta cuando sean imputables al incumplimiento de sus deberes de custodia.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>04. Finalidad y uso permitido</h2>
                <p style={paragraphStyle}>
                  UniCali facilita organización académica, consulta de información, comunicación comunitaria, intercambio de materiales, reseñas, ubicación voluntaria dentro del campus, coordinación colaborativa y funciones de apoyo al estudio.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Se concede al usuario una autorización personal, limitada, revocable, no exclusiva e intransferible para utilizar el servicio conforme a estos Términos. Queda prohibido interferir con su funcionamiento, eludir controles, obtener acceso no autorizado, extraer información de forma masiva o utilizar el servicio con fines ilícitos o comerciales no autorizados.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>05. Contenido generado por los usuarios</h2>
                <p style={paragraphStyle}>
                  El usuario conserva los derechos que legalmente le correspondan sobre el contenido que aporte. Al publicarlo, concede a UniCali una licencia no exclusiva, gratuita, revocable mediante eliminación cuando proceda y limitada a alojar, reproducir, adaptar al formato, mostrar, distribuir dentro del servicio, moderar y conservar dicho contenido en la medida necesaria para operar y proteger la comunidad.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  El usuario declara que dispone de los derechos y autorizaciones necesarios y que su aporte no vulnera derechos de autor, honor, intimidad, imagen, protección de datos, secretos, contratos ni otros derechos de terceros.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>06. Conductas y contenidos prohibidos</h2>
                <p style={paragraphStyle}>Se prohíbe publicar, promover o facilitar contenido o conductas que:</p>
                <ul style={listStyle}>
                  <li>sean ilícitos, fraudulentos, engañosos o manifiestamente falsos;</li>
                  <li>constituyan amenazas, hostigamiento, intimidación, humillación, acoso o incitación al odio;</li>
                  <li>sean difamatorios, calumniosos o atribuyan hechos perjudiciales sin base razonable;</li>
                  <li>contengan explotación de menores, desnudez sexual, actos sexuales explícitos o captación sexual;</li>
                  <li>revelen domicilios, teléfonos, credenciales, ubicaciones individuales u otros datos personales sin autorización;</li>
                  <li>suplanten identidades, manipulen votaciones, coordinen ataques o eludan sanciones;</li>
                  <li>infrinjan propiedad intelectual, confidencialidad académica o derechos de imagen;</li>
                  <li>incluyan publicidad masiva, archivos dañinos o mecanismos destinados a perturbar el servicio.</li>
                </ul>
              </article>

              <article>
                <h2 style={headingStyle}>07. Reseñas y opiniones sobre docentes</h2>
                <p style={paragraphStyle}>
                  Las reseñas deberán referirse a experiencias académicas reales, expresarse de buena fe y limitarse a aspectos pertinentes de la actividad docente. No podrán incluir acusaciones delictivas sin sustento, insultos, campañas de hostigamiento, información privada, datos sensibles ni afirmaciones presentadas como hechos cuando sean meras conjeturas.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  La modalidad seudónima o anónima protege la identidad frente al público, pero no autoriza abusos ni impide que UniCali adopte medidas de moderación o atienda requerimientos legalmente válidos.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>08. Moderación, reportes y bloqueo</h2>
                <p style={paragraphStyle}>
                  Los usuarios podrán reportar contenidos, reseñas o cuentas y bloquear a otros participantes mediante las funciones habilitadas. UniCali evaluará los reportes de forma razonable y podrá retirar, limitar, conservar como evidencia, desindexar o restaurar contenido; advertir, restringir, suspender o cancelar cuentas; y adoptar medidas destinadas a proteger a personas afectadas.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  La moderación puede ser preventiva o posterior y considerar contexto, reiteración, gravedad, riesgo y evidencia disponible. UniCali no garantiza revisión previa de cada aporte ni resolución inmediata, pero atenderá los reportes conforme a su naturaleza y a las obligaciones aplicables. Las consultas sobre medidas de moderación podrán dirigirse a soporte@unicali.app.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>09. Descargo sobre opiniones de usuarios</h2>
                <p style={paragraphStyle}>
                  Las publicaciones, comentarios, calificaciones y reseñas son manifestaciones exclusivas de sus respectivos autores. UniCali no las redacta, adopta, ratifica, certifica ni presenta como declaraciones institucionales, y su disponibilidad no constituye aprobación de su veracidad, exactitud, equidad o legalidad.
                </p>
                <p style={paragraphStyle}>
                  Cada autor asume responsabilidad por sus expresiones y por los daños que pudieran derivarse de contenido ilícito. Las personas afectadas podrán utilizar los mecanismos de reporte o dirigirse a soporte@unicali.app para solicitar revisión, aportando información suficiente para identificar el contenido y explicar el fundamento de la solicitud.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  La facultad de moderar no convierte a UniCali en autor del contenido ni supone una garantía general de vigilancia. Este descargo se aplicará únicamente en la máxima medida permitida por la ley y no excluirá obligaciones o responsabilidades que jurídicamente no puedan limitarse.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>10. Ubicación y funciones voluntarias</h2>
                <p style={paragraphStyle}>
                  Las funciones basadas en ubicación son voluntarias. El usuario decide cuándo solicitar la verificación de presencia y podrá continuar utilizando las funciones generales si niega o revoca el permiso. Cuando asocie una publicación con una zona, dicha referencia será visible como lugar aproximado y podrá utilizarse para ordenar contenidos o elaborar estadísticas.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  La información de presencia es orientativa y no constituye prueba oficial de asistencia, permanencia, identidad o seguridad física. El usuario no deberá emplearla para vigilar, acosar, localizar individualmente o inferir rutinas de otras personas.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>11. Información académica y servicios externos</h2>
                <p style={paragraphStyle}>
                  UniCali es una herramienta complementaria. Las calificaciones, horarios, fechas, tareas, materiales, promedios, predicciones y respuestas automatizadas pueden contener retrasos, omisiones o diferencias respecto de las fuentes oficiales.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  El usuario deberá verificar toda decisión académica, administrativa o económica en los canales oficiales correspondientes. UniCali no controla la disponibilidad, contenido, seguridad ni decisiones de servicios externos y no responde por interrupciones o modificaciones imputables a estos.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>12. Grabaciones, archivos y materiales</h2>
                <p style={paragraphStyle}>
                  El usuario es responsable de obtener las autorizaciones necesarias antes de grabar clases, voces, exposiciones o conversaciones, así como de respetar derechos de autor, imagen, intimidad y normas universitarias. La existencia de una función de grabación o intercambio no constituye autorización de UniCali para registrar o distribuir contenidos protegidos.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Quien cargue materiales declara estar facultado para compartirlos. UniCali podrá retirar archivos ante reportes razonables, riesgo de daño o evidencia de infracción.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>13. Propiedad intelectual de UniCali</h2>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  La denominación, identidad visual, textos propios, diseño y demás elementos originales de UniCali se encuentran protegidos por la legislación aplicable. Salvo autorización expresa, no podrán reproducirse, comercializarse, modificarse ni utilizarse para aparentar asociación o respaldo institucional.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>14. Disponibilidad y garantías</h2>
                <p style={paragraphStyle}>
                  El servicio se ofrece según su disponibilidad. UniCali procurará mantenerlo operativo y seguro, pero no garantiza funcionamiento ininterrumpido, ausencia absoluta de errores, compatibilidad con todo dispositivo, conservación indefinida de contenidos ni resultados académicos específicos.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  En la medida permitida por la ley, UniCali no será responsable por daños indirectos, pérdida de oportunidades, decisiones académicas adoptadas sin verificación, fallos de servicios externos o usos contrarios a estos Términos. Esta limitación no comprende responsabilidad que legalmente no pueda excluirse.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>15. Suspensión, terminación y eliminación</h2>
                <p style={paragraphStyle}>
                  UniCali podrá limitar, suspender o cancelar cuentas cuando exista incumplimiento, riesgo para terceros, fraude, requerimiento legal o necesidad de proteger el servicio. Cuando sea razonable, se informará al usuario sobre la medida y el canal disponible para solicitar revisión.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  El usuario podrá dejar de utilizar el servicio y solicitar la eliminación de su cuenta en la página de{' '}
                  <Link to="/eliminar-cuenta" style={{ color: 'var(--primary)' }}>eliminación de cuenta</Link>. La supresión se regirá por la Política de Privacidad y por las excepciones legales de conservación.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>16. Modificaciones</h2>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  UniCali podrá modificar estos Términos por razones normativas, de seguridad o de evolución del servicio. Los cambios sustanciales se comunicarán por medios razonables y podrán requerir una nueva aceptación antes de continuar utilizando funciones comunitarias.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>17. Legislación y contacto</h2>
                <p style={paragraphStyle}>
                  Estos Términos se rigen por las leyes de la República del Perú. Las partes procurarán resolver de buena fe cualquier controversia mediante comunicación directa antes de acudir a la autoridad competente, sin afectar los derechos irrenunciables del consumidor o del titular de datos personales.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Contacto legal y de soporte: {' '}
                  <a href="mailto:soporte@unicali.app" style={{ color: 'var(--primary)' }}>soporte@unicali.app</a>.
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
