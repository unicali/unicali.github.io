import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacidad | UniCali</title>
      </Helmet>
      <section style={{ padding: '8rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Política de Privacidad</h1>
          <div style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              En UniCali, la privacidad de los estudiantes es nuestra prioridad absoluta. 
              Como una plataforma independiente, hemos diseñado nuestra arquitectura bajo el principio de "Privacidad por Diseño".
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginTop: '2.5rem', marginBottom: '1rem' }}>1. No Recolección de Datos</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              UniCali no solicita, recolecta ni almacena tus contraseñas institucionales. 
              Toda la información académica que visualizas en la app se procesa localmente en tu dispositivo.
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginTop: '2.5rem', marginBottom: '1rem' }}>2. Almacenamiento Local</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Tus notas, horarios y configuraciones se guardan exclusivamente en el almacenamiento interno de tu teléfono. 
              Si desinstalas la aplicación, todos tus datos locales se eliminan permanentemente.
            </p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginTop: '2.5rem', marginBottom: '1rem' }}>3. Transparencia</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              UniCali es una iniciativa de código abierto. Cualquier persona puede auditar nuestro código para verificar 
              cómo manejamos la información y asegurar que no existan puertas traseras ni telemetría oculta.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
