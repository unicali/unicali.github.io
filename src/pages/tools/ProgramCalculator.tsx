import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import type { Course, CourseGrade } from '../../domain/Curriculum';
import { WeightedAverageUseCase } from '../../usecases/WeightedAverageUseCase';
import { fetchProgram, readEmbeddedProgram, type ProgramPageData } from '../../lib/programData';
import { SITE_URL } from '../../data/routes';

const YEAR_LABELS = [
  '',
  'Primer año',
  'Segundo año',
  'Tercer año',
  'Cuarto año',
  'Quinto año',
  'Sexto año',
  'Séptimo año',
];

const semesterLabel = (key: string) => {
  const [year, semester] = key.split('-');
  return `${YEAR_LABELS[Number(year)]} · ${semester === '1' ? 'primer' : 'segundo'} semestre`;
};

/**
 * Página programática por escuela profesional: /calculadora/[escuela].
 *
 * Lo sustantivo de la página son datos oficiales verificables (créditos,
 * prerrequisitos, estructura del plan) más una herramienta que funciona, no
 * prosa generada. Esa es la diferencia entre SEO programático útil y el
 * contenido masivo de relleno que penaliza Google.
 *
 * Los pesos de evaluación de cada asignatura NO se publican aquí a propósito:
 * viven en el sílabo, cambian por docente y por semestre, y no existe fuente
 * pública fiable. Lo que sí es oficial son los créditos, que son exactamente el
 * peso con el que se calcula el promedio ponderado del semestre.
 */
export default function ProgramCalculator() {
  const { escuela } = useParams<{ escuela: string }>();
  const [data, setData] = useState<ProgramPageData | null>(() => readEmbeddedProgram());
  const [notFound, setNotFound] = useState(false);
  const [semester, setSemester] = useState('1-1');
  const [grades, setGrades] = useState<Record<string, number | ''>>({});

  // Solo se consulta la base al navegar dentro del SPA: en la primera carga el
  // HTML que sirve api/seo.ts ya trae los datos incrustados.
  useEffect(() => {
    if (!escuela || data?.program.slug === escuela) return;
    let active = true;
    fetchProgram(escuela).then((result) => {
      if (!active) return;
      if (result) setData(result);
      else setNotFound(true);
    });
    return () => {
      active = false;
    };
  }, [escuela, data]);

  const bySemester = useMemo(() => {
    const groups = new Map<string, Course[]>();
    for (const course of data?.courses ?? []) {
      const key = `${course.year}-${course.semester}`;
      groups.set(key, [...(groups.get(key) ?? []), course]);
    }
    return groups;
  }, [data]);

  if (notFound) {
    return (
      <article className="section-hero">
        <Helmet>
          <title>Escuela no encontrada | UniCali</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1>No encontramos esa escuela</h1>
          <p style={{ marginTop: '2rem' }}>
            <Link to="/herramientas/calculadora-unsa">Ir a la calculadora general de la UNSA</Link>
          </p>
        </div>
      </article>
    );
  }

  if (!data) return null;

  const { program, courses } = data;
  const { passingGrade, gradingMax, shortName } = program.university;

  const canonical = `${SITE_URL}/calculadora/${program.slug}`;
  const title = `Calculadora de notas ${program.name} ${shortName} | UniCali`;
  const description =
    `Calcula tu promedio ponderado de ${program.name} en la ${shortName} con los créditos ` +
    `oficiales del plan ${program.planYear}: ${courses.length} asignaturas y ` +
    `${program.totalCredits} créditos.`;

  const semesterKeys = [...bySemester.keys()].sort();
  const current = bySemester.get(semester) ?? [];
  const currentGrades: CourseGrade[] = current.map((course) => ({
    code: course.code,
    credits: course.credits,
    grade: grades[course.code] ?? '',
  }));

  const average = WeightedAverageUseCase.calculate(currentGrades);
  const approvedCredits = WeightedAverageUseCase.approvedCredits(currentGrades, passingGrade);
  const needed = WeightedAverageUseCase.requiredForTarget(currentGrades, passingGrade, gradingMax);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UniCali" />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <article className="section-hero">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="reveal">
            <span className="meta-label">
              {shortName} · Plan {program.planYear}
            </span>
            <h1
              style={{
                fontSize: 'clamp(2rem, 6vw, 3.6rem)',
                fontStyle: 'italic',
                marginTop: '1.5rem',
              }}
            >
              Calculadora de notas de {program.name}
            </h1>
          </div>

          <div
            className="reveal stagger-1"
            style={{
              marginTop: '3rem',
              color: 'var(--text-dim)',
              fontWeight: 300,
              lineHeight: 1.9,
            }}
          >
            <p
              style={{
                fontSize: '1.2rem',
                color: 'var(--text)',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
              }}
            >
              El plan {program.planYear} de {program.name} tiene {courses.length} asignaturas y{' '}
              {program.totalCredits} créditos. Esta calculadora usa esos créditos oficiales como
              peso, que es exactamente como se obtiene el promedio ponderado del semestre.
            </p>

            <section style={{ marginTop: '4rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                Tu promedio ponderado
              </h2>

              <label
                htmlFor="semestre"
                style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem' }}
              >
                Semestre
              </label>
              <select
                id="semestre"
                value={semester}
                onChange={(event) => setSemester(event.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  width: '100%',
                  maxWidth: '360px',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                }}
              >
                {semesterKeys.map((key) => (
                  <option key={key} value={key}>
                    {semesterLabel(key)}
                  </option>
                ))}
              </select>

              <table
                style={{
                  width: '100%',
                  marginTop: '2rem',
                  borderCollapse: 'collapse',
                  fontSize: '0.92rem',
                }}
              >
                <caption style={{ textAlign: 'left', paddingBottom: '1rem' }}>
                  Introduce las notas que ya tengas. Las asignaturas sin nota no entran en el
                  promedio.
                </caption>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th scope="col" style={{ padding: '0.6rem 0' }}>
                      Asignatura
                    </th>
                    <th scope="col" style={{ padding: '0.6rem 0', width: '5rem' }}>
                      Créd.
                    </th>
                    <th scope="col" style={{ padding: '0.6rem 0', width: '7rem' }}>
                      Nota
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {current.map((course) => (
                    <tr key={course.code} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.6rem 0' }}>
                        {course.name}
                        <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6 }}>
                          {course.code}
                        </span>
                      </td>
                      <td style={{ padding: '0.6rem 0' }}>{course.credits}</td>
                      <td style={{ padding: '0.6rem 0' }}>
                        <input
                          type="number"
                          min={0}
                          max={gradingMax}
                          step={1}
                          inputMode="numeric"
                          aria-label={`Nota de ${course.name}`}
                          value={grades[course.code] ?? ''}
                          onChange={(event) =>
                            setGrades((previous) => ({
                              ...previous,
                              [course.code]:
                                event.target.value === '' ? '' : Number(event.target.value),
                            }))
                          }
                          style={{
                            width: '5rem',
                            padding: '0.4rem',
                            fontFamily: 'inherit',
                            background: 'var(--bg)',
                            color: 'var(--text)',
                            border: '1px solid var(--border)',
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  marginTop: '2.5rem',
                  padding: '2rem',
                  background: 'var(--bg-subtle)',
                  borderLeft: '2px solid var(--primary)',
                }}
              >
                <p
                  style={{
                    fontSize: '2.4rem',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-serif)',
                    margin: 0,
                  }}
                >
                  {average === null ? '—' : average.toFixed(2)}
                </p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                  Promedio ponderado del semestre · {approvedCredits} créditos aprobados
                  {average !== null &&
                    (average >= passingGrade
                      ? ' · aprobado'
                      : ` · por debajo de ${passingGrade}`)}
                </p>
                {needed && (
                  <p style={{ margin: '0.75rem 0 0', fontSize: '0.9rem' }}>
                    {needed.reachable
                      ? `Necesitas ${needed.required.toFixed(2)} en las asignaturas que faltan para llegar a ${passingGrade}.`
                      : `Con las notas actuales ya no es posible alcanzar ${passingGrade} este semestre.`}
                  </p>
                )}
              </div>
            </section>

            <section style={{ marginTop: '5rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                Malla curricular completa
              </h2>
              {semesterKeys.map((key) => {
                const group = bySemester.get(key) ?? [];
                const credits = group.reduce((total, course) => total + course.credits, 0);
                return (
                  <div key={key} style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>
                      {semesterLabel(key)}
                      <span style={{ opacity: 0.6, fontWeight: 300 }}> — {credits} créditos</span>
                    </h3>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                      }}
                    >
                      {group.map((course) => (
                        <li key={course.code} style={{ fontSize: '0.9rem' }}>
                          <strong style={{ fontWeight: 500 }}>{course.name}</strong> ·{' '}
                          {course.credits} créd.
                          {course.prerequisites.length > 0 && (
                            <span style={{ opacity: 0.65 }}>
                              {' '}
                              · requiere {course.prerequisites.join(', ')}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </section>

            <section style={{ marginTop: '4rem', fontSize: '0.85rem', opacity: 0.75 }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                Fuente y aviso
              </h2>
              <p>
                Datos extraídos del plan de estudios oficial publicado por la{' '}
                {program.university.name}:{' '}
                <a href={program.sourceUrl} rel="nofollow noopener external" target="_blank">
                  plan {program.planYear} de {program.name}
                </a>
                . UniCali es un proyecto independiente hecho por estudiantes y{' '}
                <strong>no está afiliado a la {shortName}</strong>. Los pesos de evaluación de cada
                asignatura los define el sílabo del curso, no este sitio.
              </p>
            </section>

            <div style={{ marginTop: '4rem' }}>
              <Link to="/descargar" className="btn-minimal">
                Descargar UniCali
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
