import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutUs: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Nosotros | Cómo nació UniCali</title>
        <meta name="description" content="UniCali nació de un problema simple: calcular un promedio o ver una nota tomaba demasiado tiempo. Esta es la historia de los estudiantes que decidieron resolverlo." />
        <link rel="canonical" href="https://www.unicali.app/nosotros" />

        <meta property="og:title" content="Nosotros | Cómo nació UniCali" />
        <meta property="og:description" content="UniCali nació de un problema simple: calcular un promedio tomaba demasiado tiempo. Esta es nuestra historia." />
        <meta property="og:url" content="https://www.unicali.app/nosotros" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="UniCali" />
        <meta property="og:image" content="https://www.unicali.app/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nosotros | Cómo nació UniCali" />
        <meta name="twitter:description" content="UniCali nació de un problema simple: calcular un promedio tomaba demasiado tiempo. Esta es nuestra historia." />
        <meta name="twitter:image" content="https://www.unicali.app/og-image.png" />
      </Helmet>

      <article className="section-hero">
        <div className="container" style={{ maxWidth: '850px' }}>
          <span className="section-label">Origen</span>
          
          <div className="reveal">
            <span className="meta-label">Sobre nosotros</span>
            <h1 style={{ marginTop: '2rem', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontStyle: 'italic' }}>Por qué creamos UniCali</h1>
          </div>

          <div className="reveal stagger-1" style={{ marginTop: '5rem', color: 'var(--text-dim)', fontWeight: 300, lineHeight: '2' }}>
            <p style={{ fontSize: '1.4rem', color: 'var(--text)', marginBottom: '4rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', lineHeight: 1.4 }}>
              "UniCali no nació en una oficina. Nació en un salón de clases, entre cuadernos, capturas de pantalla y cálculos a mano."
            </p>

            <section style={{ marginBottom: '5rem' }}>
              <p style={{ marginBottom: '2rem' }}>
                En la universidad aprendemos cosas nuevas todos los días, pero las tareas de siempre siguen siendo a mano: revisar notas en sistemas lentos, sumar promedios en una calculadora y preguntar por ahí qué docente conviene. Tiempo que debería ir a estudiar se pierde en trámites.
              </p>
              <p>
                Nos pasaba a nosotros y a nuestros compañeros: papel y calculadora para saber si aprobábamos un curso. Y las evaluaciones de los docentes existían, pero los estudiantes —quienes más las necesitamos al elegir cursos— no podíamos verlas. UniCali nació para juntar todo eso en un solo lugar.
              </p>
            </section>

            <div className="reveal" style={{ padding: '4rem', borderLeft: '1px solid var(--primary)', background: 'var(--bg-subtle)', marginBottom: '5rem' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', margin: 0 }}>
                "Queremos que cada estudiante pueda decidir con sus datos a la mano, no con rumores."
              </p>
            </div>

            <section style={{ marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cómo empezamos</h2>
              <p style={{ marginBottom: '2rem' }}>
                Los sistemas que usábamos eran lentos y poco claros. Esta app y esta web son nuestra respuesta, hecha desde cero por estudiantes. 
              </p>
              <p>
                Empezamos siendo un grupo con una idea a medias. En el camino hubo discusiones, noches sin dormir y momentos difíciles, pero también aprendimos lo más importante: la app debe cuidar los datos del estudiante, aunque eso nos tome más trabajo a nosotros.
              </p>
            </section>

            <section style={{ marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cómo trabajamos</h2>
              <p style={{ marginBottom: '2rem' }}>
                Le hemos dedicado muchas horas de nuestro tiempo libre, no por dinero, sino porque queremos que funcione bien. 
              </p>
              <p>
                Más de una vez pusimos una fecha de lanzamiento y la tuvimos que mover al encontrar un error o un problema de seguridad. Preferimos llegar tarde que publicar algo a medias. No buscamos hacernos virales; buscamos que la app te sirva.
              </p>
            </section>

            <section style={{ marginBottom: '6rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lo que aprendimos</h2>
              <p style={{ marginBottom: '2rem' }}>
                Al final, lo que nos mueve es todo lo que estamos aprendiendo: a equivocarnos, a corregir el código y a recordar que la tecnología debe ayudar a las personas, no al revés.
              </p>
              <p>
                Somos un equipo independiente de estudiantes, con formación en economía y en ingeniería de software. UniCali es nuestra prueba de que, cuando algo no funciona, los estudiantes también podemos construir la solución.
              </p>
            </section>

            <div style={{ textAlign: 'center', opacity: 0.4 }}>
              <span className="meta-label">Hecho por estudiantes, para estudiantes</span>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default AboutUs;
