import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  COMPONENT_STATE_LABEL,
  LIFECYCLE_LABEL,
  isOpen,
  type NoticeLifecycle,
  type StatusNotice,
  type StatusPageData,
} from '../domain/Status';
import { GetStatusUseCase } from '../usecases/GetStatusUseCase';
import { fetchStatus, readEmbeddedStatus } from '../lib/statusData';

/**
 * Tablón de avisos operativos.
 *
 * Los avisos ya no viven en este archivo: están en Supabase y los publica
 * `npm run status:aviso`. Antes eran dos constantes literales, y el resultado
 * fue que en toda la historia del repositorio nunca se publicó un segundo aviso
 * — publicar exigía editar el .tsx, un build completo con Puppeteer y un
 * despliegue del sitio entero.
 *
 * El HTML de la primera carga lo sirve `api/status.ts`, que incrusta los mismos
 * datos como JSON. Aquí se leen de ahí; solo se consulta a Supabase al llegar
 * navegando dentro del SPA, donde ese bloque no existe.
 */

const TIMEZONE = 'America/Lima';

/**
 * Las fechas se formatean SIEMPRE en la zona de Arequipa, en servidor y en
 * cliente. Formatearlas en la zona del visitante daría un texto distinto en cada
 * sitio y el HTML servido cambiaría al montar React, que es justo el salto que
 * `api/seo.ts` documenta como error a evitar.
 */
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIMEZONE,
  }).format(new Date(iso));

const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE,
  }).format(new Date(iso));

const TONE_COLOR = {
  ok: '#4CAF50',
  warn: '#FF9800',
  down: '#E53935',
  // Gris deliberado: "no lo sé" no debe parecerse ni a bien ni a mal.
  unknown: '#9E9E9E',
} as const;

const lifecycleStyle = (lifecycle: NoticeLifecycle): React.CSSProperties => {
  const color = lifecycle === 'resolved' ? '#4CAF50' : '#FF9800';
  return {
    display: 'inline-block',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    background: `${color}1a`,
    color,
    border: `1px solid ${color}33`,
  };
};

const NoticeItem: React.FC<{ notice: StatusNotice }> = ({ notice }) => (
  <div style={{ paddingLeft: '2rem', borderLeft: '2px solid var(--border)', position: 'relative' }}>
    <div
      style={{
        position: 'absolute',
        left: '-5px',
        top: '5px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: isOpen(notice) ? '#FF9800' : 'var(--border)',
      }}
    />
    <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
      {formatDate(notice.startedAt)}
    </span>
    <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--text)' }}>
      {notice.title}
    </h3>
    <div style={{ marginBottom: '1rem' }}>
      <span style={lifecycleStyle(notice.lifecycle)}>{LIFECYCLE_LABEL[notice.lifecycle]}</span>
    </div>
    <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>{notice.body}</p>

    {notice.updates.length > 0 && (
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notice.updates.map((update) => (
          <div key={update.createdAt} style={{ fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>
              {formatDateTime(update.createdAt)} · {LIFECYCLE_LABEL[update.lifecycle]}
            </span>
            <p style={{ color: 'var(--text-dim)', lineHeight: '1.6', margin: '0.25rem 0 0' }}>
              {update.body}
            </p>
          </div>
        ))}
      </div>
    )}

    {notice.resolvedAt && (
      <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-dim)', opacity: 0.8 }}>
        Resuelto el {formatDateTime(notice.resolvedAt)}
      </p>
    )}
  </div>
);

const Status: React.FC = () => {
  const [data, setData] = useState<StatusPageData | null>(() => readEmbeddedStatus());
  // Solo hay "cargando" si no venían datos incrustados, es decir, al navegar
  // dentro del SPA. La carga directa nunca parpadea.
  const [loading, setLoading] = useState(() => readEmbeddedStatus() === null);

  useEffect(() => {
    if (data) return;
    let alive = true;
    fetchStatus()
      .then((result) => {
        if (alive) setData(result);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [data]);

  // Un fallo de lectura se trata como "no disponible", nunca como tablón vacío:
  // si no sabemos nada, la página no puede afirmar que todo está bien.
  const resolved: StatusPageData = data ?? {
    components: [],
    notices: [],
    lastUpdated: null,
    available: false,
  };
  const overall = GetStatusUseCase.deriveOverall(resolved);
  const notices = GetStatusUseCase.sortNotices(resolved.notices);
  const unavailable = !loading && !resolved.available;

  return (
    <>
      <Helmet>
        <title>Estado del Sistema | UniCali</title>
        <meta
          name="description"
          content="Consulta el estado operativo actual de la aplicación UniCali, avisos de mantenimiento y últimos incidentes reportados."
        />
        <link rel="canonical" href="https://www.unicali.app/status" />

        <meta property="og:title" content="Estado del Sistema | UniCali" />
        <meta
          property="og:description"
          content="Consulta el estado operativo actual y avisos importantes sobre la plataforma UniCali."
        />
        <meta property="og:url" content="https://www.unicali.app/status" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UniCali" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Estado del Sistema | UniCali" />
        <meta
          name="twitter:description"
          content="Consulta el estado operativo actual y avisos importantes sobre la plataforma UniCali."
        />
      </Helmet>

      <article className="section-hero">
        <div className="container" style={{ maxWidth: '850px' }}>
          <span className="section-label">Sistema</span>

          <div className="reveal">
            <h1 style={{ marginTop: '2rem', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontStyle: 'italic' }}>
              Estado Operativo
            </h1>
          </div>

          <div
            className="reveal stagger-1"
            style={{
              marginTop: '3rem',
              padding: '3rem',
              border: '1px solid var(--border)',
              background: 'var(--bg-subtle)',
              borderRadius: '12px',
            }}
          >
            <span className="meta-label">Estado Actual</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: TONE_COLOR[overall.tone],
                  boxShadow: `0 0 10px ${TONE_COLOR[overall.tone]}80`,
                }}
              />
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text)' }}>
                {overall.headline}
              </h2>
            </div>
            {resolved.available && resolved.lastUpdated && (
              <p style={{ marginTop: '1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                Última actualización: {formatDateTime(resolved.lastUpdated)}
              </p>
            )}

            {resolved.available && resolved.components.length > 0 && (
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resolved.components.map((component) => (
                  <div
                    key={component.slug}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ color: 'var(--text)', fontSize: '0.95rem' }}>{component.name}</span>
                    <span
                      style={{
                        color: component.state === 'operational' ? 'var(--text-dim)' : '#FF9800',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {COMPONENT_STATE_LABEL[component.state]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="reveal stagger-2" style={{ marginTop: '5rem', marginBottom: '5rem' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                color: 'var(--text)',
                marginBottom: '2rem',
                fontFamily: 'var(--font-serif)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Incidentes y Avisos
            </h2>

            {loading && <p style={{ color: 'var(--text-dim)' }}>Cargando avisos…</p>}

            {unavailable && (
              <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                No hemos podido consultar el tablón de avisos. Esto no significa que haya una
                incidencia, solo que ahora mismo no podemos confirmarlo. Vuelve a intentarlo en
                unos minutos.
              </p>
            )}

            {!loading && resolved.available && notices.length === 0 && (
              <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                No hay incidentes ni avisos reportados.
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {notices.map((notice) => (
                <NoticeItem key={notice.slug} notice={notice} />
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', opacity: 0.4, paddingBottom: '3rem' }}>
            <span className="meta-label">Avisos publicados por el equipo de UniCali</span>
          </div>
        </div>
      </article>
    </>
  );
};

export default Status;
