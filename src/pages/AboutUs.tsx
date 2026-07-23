import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutUs: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Manifiesto | La Génesis de UniCali</title>
        <meta name="description" content="UniCali surge de una contradicción sistémica. Una historia de resistencia técnica, honestidad brutal y la búsqueda de la asimetría cero de información." />
        <link rel="canonical" href="https://www.unicali.app/nosotros" />

        <meta property="og:title" content="Manifiesto | La Génesis de UniCali" />
        <meta property="og:description" content="UniCali surge de una contradicción sistémica. Una historia de resistencia técnica y honestidad brutal." />
        <meta property="og:url" content="https://www.unicali.app/nosotros" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="UniCali" />
        <meta property="og:image" content="https://www.unicali.app/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Manifiesto | La Génesis de UniCali" />
        <meta name="twitter:description" content="UniCali surge de una contradicción sistémica. Una historia de resistencia técnica y honestidad brutal." />
        <meta name="twitter:image" content="https://www.unicali.app/og-image.png" />
      </Helmet>

      <article className="section-hero">
        <div className="container" style={{ maxWidth: '850px' }}>
          <span className="section-label">Origen</span>
          
          <div className="reveal">
            <span className="meta-label">Sobre Los Desarrolladores</span>
            <h1 style={{ marginTop: '2rem', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontStyle: 'italic' }}>El Absurdo de lo Analógico</h1>
          </div>

          <div className="reveal stagger-1" style={{ marginTop: '5rem', color: 'var(--text-dim)', fontWeight: 300, lineHeight: '2' }}>
            <p style={{ fontSize: '1.4rem', color: 'var(--text)', marginBottom: '4rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', lineHeight: 1.4 }}>
              "UniCali no nació en un laboratorio de innovación, sino de una contradicción sistémica."
            </p>

            <section style={{ marginBottom: '5rem' }}>
              <p style={{ marginBottom: '2rem' }}>
                Nos dimos cuenta de que, mientras la academia nos enseña teorías de vanguardia, el día a día del estudiante está atrapado en la prehistoria administrativa. Nos frustraba ver cómo la energía que debería destinarse a la comprensión de una clase magistral se disipaba en tareas mecánicas.
              </p>
              <p>
                Surgimos del conflicto de vernos a nosotros mismos —y a nuestros compañeros— recurriendo a la hoja, el papel y la calculadora para proyectar un promedio o entender una situación académica, cuando ese debería ser un proceso invisible e integrado. Surgimos de la indignación de saber que las evaluaciones docentes existen, pero que el actor que más las necesita —el estudiante que debe elegir su camino— es precisamente quien no tiene acceso a ellas.
              </p>
            </section>

            <div className="reveal" style={{ padding: '4rem', borderLeft: '1px solid var(--primary)', background: 'var(--bg-subtle)', marginBottom: '5rem' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', margin: 0 }}>
                "UniCali nace para romper la asimetría de información. No es solo una herramienta; es el derecho del estudiante a decidir con datos, no con rumores."
              </p>
            </div>

            <section style={{ marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>La Resistencia Técnica</h2>
              <p style={{ marginBottom: '2rem' }}>
                Como estudiantes, nos enfrentamos a la fricción de sistemas arcaicos que parecen diseñados para el control y no para el servicio. Esta web y esta aplicación son nuestra respuesta. 
              </p>
              <p>
                Empezamos siendo un grupo con una idea vaga, pero el proceso de construir una solución real nos transformó. Nuestra narrativa no es de éxito lineal; es una de discusiones agrias, de noches de sacrificio y de momentos donde el silencio en el equipo pesaba más que el código. Esas mismas fricciones fueron las que forjaron la arquitectura de lo que hoy construimos: un sistema que prioriza la ética del usuario sobre la facilidad del desarrollador.
              </p>
            </section>

            <section style={{ marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>La Obsesión por el Detalle</h2>
              <p style={{ marginBottom: '2rem' }}>
                Hemos invertido incontables horas robadas al descanso, no por ambición comercial, sino por una honestidad técnica brutal. 
              </p>
              <p>
                Cada vez que fijamos una fecha de lanzamiento, encontramos una vulnerabilidad o una falla de lógica que nos obliga a retroceder. Hemos aprendido a aceptar el retraso como una declaración de principios: en un mundo de software desechable, UniCali no entregará algo en lo que no creamos plenamente. No buscamos la viralidad; buscamos la utilidad.
              </p>
            </section>

            <section style={{ marginBottom: '6rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nuestra Cicatriz en el Código</h2>
              <p style={{ marginBottom: '2rem' }}>
                Al final del día, lo que nos impulsa es el proceso de aprendizaje al que nos hemos sometido. Estamos aprendiendo a fallar, a refactorizar y a entender que la tecnología debe servir al humano, y no al revés.
              </p>
              <p>
                Bajo el pseudónimo de UniCali, operamos como una célula de desarrollo independiente, fusionando el análisis económico con la ingeniería de software. UniCali es nuestro campo de batalla, y cada línea de código es una prueba de que, cuando el sistema falla, los estudiantes construimos nuestras propias soluciones.
              </p>
            </section>

            <div style={{ textAlign: 'center', opacity: 0.4 }}>
              <span className="meta-label">Ingeniería Académica Independiente</span>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default AboutUs;
