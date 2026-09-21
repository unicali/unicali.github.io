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

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad | UniCali</title>
        <meta name="description" content="Política de Privacidad de UniCali: categorías de datos tratados, finalidades, ubicación, contenido de usuarios, conservación y ejercicio de derechos." />
        <meta name="keywords" content="política de privacidad UniCali, protección de datos personales, derechos ARCO, privacidad aplicación universitaria" />
        <link rel="canonical" href="https://www.unicali.app/privacidad" />
        <meta property="og:title" content="Política de Privacidad | UniCali" />
        <meta property="og:description" content="Información jurídica sobre el tratamiento de datos personales en los servicios de UniCali." />
        <meta property="og:url" content="https://www.unicali.app/privacidad" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="section-standard">
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="section-label">Legal</span>

          <div className="reveal" style={{ marginBottom: '5rem' }}>
            <span className="meta-label" style={{ display: 'block', marginBottom: '1.5rem' }}>Protección de Datos Personales</span>
            <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontStyle: 'italic', marginBottom: '1.5rem' }}>Política de Privacidad</h1>
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
              Vigente desde el 21 de septiembre de 2026
            </span>
          </div>

          <div className="reveal stagger-1" style={{ color: 'var(--text-dim)', fontWeight: 300 }}>
            <p style={{ fontSize: '1.35rem', color: 'var(--text)', marginBottom: '5rem', fontFamily: 'var(--font-serif)', lineHeight: 1.6 }}>
              La presente Política de Privacidad regula el tratamiento de datos personales efectuado por UniCali mediante su aplicación, sitio web y servicios relacionados, de conformidad con la Ley N.º 29733, Ley de Protección de Datos Personales, su Reglamento y las demás disposiciones aplicables en la República del Perú.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              <article>
                <h2 style={headingStyle}>01. Responsable del tratamiento</h2>
                <p style={paragraphStyle}>
                  UniCali, iniciativa académica independiente con domicilio de contacto en Arequipa, Perú, actúa como responsable del tratamiento respecto de los datos personales administrados directamente en sus servicios. Las consultas y solicitudes relacionadas con privacidad podrán dirigirse a{' '}
                  <a href="mailto:soporte@unicali.app" style={{ color: 'var(--primary)' }}>soporte@unicali.app</a>.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  UniCali no forma parte de la Universidad Nacional de San Agustín de Arequipa ni actúa en su representación. Cuando el usuario accede voluntariamente a servicios universitarios o de identidad ajenos a UniCali, dichos terceros tratarán la información bajo sus propias condiciones y políticas.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>02. Ámbito y aceptación</h2>
                <p style={paragraphStyle}>
                  Esta Política se aplica a los datos obtenidos al crear una cuenta, utilizar funciones académicas o comunitarias, comunicarse con soporte, acceder al sitio web o autorizar capacidades del dispositivo. El otorgamiento de permisos específicos es facultativo; su negativa únicamente impedirá el funcionamiento de la característica que requiera el dato correspondiente.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  El servicio está destinado a personas de catorce años o más vinculadas al ámbito universitario. No se admite deliberadamente el registro de menores de catorce años. Si se advierte un registro contrario a esta regla, la cuenta será suspendida y los datos serán suprimidos conforme a la normativa aplicable.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>03. Categorías de datos tratados</h2>
                <ul style={listStyle}>
                  <li><strong>Identificación y cuenta:</strong> nombre, correo electrónico, código de estudiante, seudónimo, carrera, facultad, fotografía, datos de perfil, nivel de verificación y preferencias.</li>
                  <li><strong>Información académica:</strong> cursos, horarios, calificaciones, historial, periodos, progreso curricular, promedios, actividades, docentes vinculados, materiales y participación voluntaria en clasificaciones.</li>
                  <li><strong>Contenido aportado:</strong> publicaciones, comentarios, reacciones, reseñas docentes, etiquetas, reportes, bloqueos, elementos guardados, materiales, nombres de lugares, tareas colaborativas y respuestas asociadas.</li>
                  <li><strong>Comunicaciones:</strong> consultas al asistente académico, solicitudes de soporte, respuestas, comentarios de moderación y demás textos remitidos por el usuario.</li>
                  <li><strong>Archivos y contenido audiovisual:</strong> fotografías de perfil, documentos académicos, códigos visuales, grabaciones de audio y archivos que el usuario decida cargar, descargar, compartir o respaldar.</li>
                  <li><strong>Ubicación y actividad contextual:</strong> ubicación precisa, precisión estimada, zona o celda derivada, presencia temporal, identificadores de red y señales de actividad utilizadas en funciones voluntarias de Campus Vivo o sesiones de estudio.</li>
                  <li><strong>Datos técnicos y de uso:</strong> modelo del dispositivo, sistema operativo, versión de la aplicación, plataforma, fecha de actividad, incidencias, diagnósticos, estado de permisos, identificadores de notificación y datos de navegación del sitio.</li>
                </ul>
              </article>

              <article>
                <h2 style={headingStyle}>04. Origen de la información</h2>
                <p style={paragraphStyle}>
                  Los datos pueden ser proporcionados directamente por el usuario, obtenidos de servicios académicos o de identidad a los que este decida vincularse, generados durante el uso de las funciones contratadas o derivados de permisos concedidos en el dispositivo.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  La información académica y las sesiones de terceros se obtienen exclusivamente a solicitud del usuario. UniCali no requiere que el usuario revele sus contraseñas por correo, soporte o formularios públicos.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>05. Finalidades del tratamiento</h2>
                <ul style={listStyle}>
                  <li>crear, autenticar, verificar, proteger y administrar cuentas;</li>
                  <li>presentar y sincronizar información académica solicitada por el usuario;</li>
                  <li>operar publicaciones, reseñas, comentarios, materiales, tareas, clasificaciones y notificaciones;</li>
                  <li>verificar presencia o pertenencia a una zona cuando se active voluntariamente una función basada en ubicación;</li>
                  <li>prestar soporte, resolver consultas y ofrecer respuestas académicas automatizadas;</li>
                  <li>prevenir fraude, suplantación, abuso, manipulación, incidentes y usos contrarios a los Términos;</li>
                  <li>medir estabilidad, corregir fallos, mantener compatibilidad y mejorar el servicio;</li>
                  <li>cumplir obligaciones legales, atender requerimientos válidos y proteger derechos de usuarios o terceros.</li>
                </ul>
              </article>

              <article>
                <h2 style={headingStyle}>06. Ubicación voluntaria y Campus Vivo</h2>
                <p style={paragraphStyle}>
                  La ubicación precisa se solicita únicamente cuando el usuario inicia una función que necesita comprobar su presencia, como asociar voluntariamente una publicación con una zona del campus o iniciar una sesión de estudio vinculada a un lugar. El usuario puede omitir, negar o revocar el permiso y continuar utilizando las funciones generales de UniCali.
                </p>
                <p style={paragraphStyle}>
                  La ubicación puede transmitirse para comprobar que corresponde a un área admitida, calcular distancia y precisión, prevenir simulaciones y derivar una zona aproximada. Cuando el usuario publica contenido asociado a un lugar, la coordenada precisa vinculada a esa publicación podrá conservarse hasta noventa días para ordenamiento, seguridad y prevención de fraude.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Asimismo, podrán conservarse muestras geográficas disociadas de la cuenta y de la publicación, agrupadas temporalmente y destinadas a estadísticas de densidad y planificación del servicio. La ubicación individual no se muestra a otros usuarios; las vistas comunitarias utilizan zonas, agregados o representaciones aproximadas.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>07. Almacenamiento en el dispositivo y servicios vinculados</h2>
                <p style={paragraphStyle}>
                  Parte de la información académica, archivos descargados, grabaciones, preferencias y copias temporales se conserva en el dispositivo para permitir disponibilidad sin conexión y continuidad del servicio. Determinadas funciones también requieren tratamiento remoto, por lo que no debe interpretarse que toda la información permanece exclusivamente en el dispositivo.
                </p>
                <p style={paragraphStyle}>
                  Las sesiones de servicios académicos o de identidad vinculados se conservan de forma protegida en el dispositivo. Cerrar la cuenta principal de UniCali no necesariamente desconecta cada servicio externo. El usuario deberá utilizar la opción de desconexión correspondiente o desinstalar la aplicación cuando desee eliminar dichas sesiones locales.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Los respaldos que el usuario ordene guardar en una cuenta externa permanecen bajo su control y deberán eliminarse desde esa cuenta cuando así lo desee. UniCali no conserva una copia independiente de esos archivos por el solo hecho de haber facilitado su transferencia.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>08. Contenido público, seudonimización y moderación</h2>
                <p style={paragraphStyle}>
                  Las publicaciones, comentarios, reseñas, materiales y demás aportes destinados a la comunidad serán accesibles para otros usuarios conforme a la visibilidad elegida y a las funciones del servicio. El uso de un seudónimo o de una modalidad presentada como anónima evita mostrar públicamente la identidad, pero no significa que el contenido sea técnicamente imposible de relacionar con una cuenta por UniCali cuando ello resulte necesario para seguridad, moderación, ejercicio de derechos o cumplimiento legal.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Los reportes, bloqueos, medidas disciplinarias y evidencias estrictamente necesarias podrán conservarse para investigar infracciones, proteger a la comunidad y atender reclamaciones.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>09. Encargados, destinatarios y transferencias</h2>
                <p style={paragraphStyle}>
                  UniCali podrá comunicar datos, en la medida estrictamente necesaria, a proveedores de alojamiento, almacenamiento, notificaciones, identidad, soporte, seguridad, medición y procesamiento automatizado que actúen por cuenta de UniCali y bajo obligaciones de confidencialidad y uso limitado.
                </p>
                <p style={paragraphStyle}>
                  También podrán producirse comunicaciones a servicios externos elegidos por el usuario, autoridades competentes, órganos jurisdiccionales o terceros cuando exista mandato válido, obligación legal, necesidad de proteger derechos o una reorganización legítima del servicio con las garantías correspondientes.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Algunos encargados pueden tratar información fuera del Perú. En esos casos se exigirán medidas contractuales, organizativas y de seguridad adecuadas. UniCali no vende datos personales ni los entrega a intermediarios de datos para publicidad comportamental.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>10. Conservación</h2>
                <ul style={listStyle}>
                  <li>Los datos de cuenta se conservan mientras esta permanezca activa y durante el periodo necesario para tramitar su cierre.</li>
                  <li>El contenido comunitario se conserva mientras permanezca publicado o hasta que corresponda eliminarlo o anonimizarlo.</li>
                  <li>La ubicación precisa vinculada a una publicación podrá conservarse hasta noventa días; los datos disociados podrán conservarse con fines estadísticos.</li>
                  <li>Los registros de seguridad, soporte y moderación se conservarán hasta doce meses, salvo investigación activa, reclamación, litigio u obligación legal.</li>
                  <li>La información local se conserva hasta que el usuario la elimine, desconecte el servicio aplicable o desinstale la aplicación.</li>
                </ul>
              </article>

              <article>
                <h2 style={headingStyle}>11. Seguridad</h2>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  UniCali aplica medidas razonables de carácter organizativo, contractual y de seguridad para limitar accesos no autorizados, alteración, pérdida o divulgación indebida. Ningún sistema ofrece seguridad absoluta; por ello, el usuario deberá proteger su dispositivo, sus cuentas vinculadas y sus medios de autenticación, y comunicar oportunamente cualquier incidente.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>12. Derechos del titular</h2>
                <p style={paragraphStyle}>
                  El titular podrá solicitar información, acceso, rectificación, actualización, cancelación, oposición, revocación del consentimiento y los demás derechos reconocidos por la legislación aplicable. La solicitud deberá enviarse a{' '}
                  <a href="mailto:soporte@unicali.app" style={{ color: 'var(--primary)' }}>soporte@unicali.app</a>{' '}
                  desde el correo asociado a la cuenta o mediante información suficiente para verificar legítimamente la identidad, sin incluir contraseñas.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Las solicitudes serán atendidas en los plazos legales. Si el titular considera insatisfactoria la respuesta, podrá acudir ante la Autoridad Nacional de Protección de Datos Personales del Perú.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>13. Eliminación de cuenta y datos</h2>
                <p style={paragraphStyle}>
                  El usuario puede solicitar la eliminación de su cuenta y de los datos asociados mediante la página pública de{' '}
                  <Link to="/eliminar-cuenta" style={{ color: 'var(--primary)' }}>eliminación de cuenta</Link>. La solicitud será tramitada dentro de un máximo de treinta días calendario, previa verificación razonable de identidad.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  El contenido público será eliminado o desvinculado razonablemente de la identidad. Podrá conservarse información limitada cuando sea necesaria para seguridad, prevención de fraude, defensa frente a reclamaciones, cumplimiento normativo o ejecución de una orden válida. La eliminación de la cuenta no borra automáticamente archivos que el usuario haya transferido a cuentas externas bajo su control.
                </p>
              </article>

              <article>
                <h2 style={headingStyle}>14. Modificaciones y contacto</h2>
                <p style={paragraphStyle}>
                  UniCali podrá modificar esta Política para reflejar cambios normativos o funcionales. Las modificaciones sustanciales serán comunicadas por medios razonables y regirán desde la fecha indicada en la versión publicada.
                </p>
                <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                  Para consultas o ejercicio de derechos: {' '}
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

export default Privacy;
