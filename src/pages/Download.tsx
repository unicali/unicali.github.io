import React from 'react';
import { Helmet } from 'react-helmet-async';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mantra.unsap';

const SCHEMA = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'UniCali',
  description: 'Ecosistema académico para estudiantes universitarios de la UNSA. Gestiona tus notas, horarios, comunidad del campus y más desde tu dispositivo Android.',
  operatingSystem: 'Android',
  applicationCategory: 'EducationApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'PEN',
    availability: 'https://schema.org/InStock',
  },
  downloadUrl: PLAY_STORE_URL,
  installUrl: PLAY_STORE_URL,
  softwareVersion: '1.5',
  datePublished: '2025-12-01',
  releaseNotes: 'https://www.unicali.app/versiones',
  author: {
    '@type': 'Organization',
    name: 'UniCali',
    url: 'https://www.unicali.app',
  },
  url: 'https://www.unicali.app/descargar',
});

const Download: React.FC = () => {
  return (
    <>
      <Helmet>
        {/* ── Primary SEO ─────────────────────────────── */}
        <title>Descargar UniCali para Android | Google Play</title>
        <meta name="description"
              content="Descarga UniCali gratis en Google Play. Gestiona tus notas, horarios y comunidad universitaria desde tu Android. Disponible ahora — sin costo." />
        <meta name="keywords"
              content="descargar unicali, unicali android, unicali app descarga, unicali play store, descargar unicali gratis, unicali para android, unicali unsa" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.unicali.app/descargar" />

        {/* ── Open Graph ──────────────────────────────── */}
        <meta property="og:title" content="Descargar UniCali para Android | Google Play" />
        <meta property="og:description"
              content="Descarga UniCali gratis desde Google Play. La app académica diseñada para estudiantes de la UNSA." />
        <meta property="og:url" content="https://www.unicali.app/descargar" />
        <meta property="og:type" content="website" />

        {/* ── Structured Data: SoftwareApplication ────── */}
        <script type="application/ld+json">{SCHEMA}</script>
      </Helmet>

      <section className="section-hero">
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>

          <div className="reveal">
            <span className="meta-label">Descarga Gratuita · Android</span>
            <h1 style={{ marginTop: '2rem', fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontStyle: 'italic' }}>
              Descarga UniCali
            </h1>
            <p style={{ color: 'var(--text-dim)', marginTop: '2rem', fontSize: '1.2rem', fontWeight: 300, lineHeight: 1.6 }}>
              Descarga UniCali gratis desde Google Play, regístrate con tus datos universitarios y empieza a gestionar tu vida académica desde el primer inicio.
            </p>
          </div>

          <div className="reveal stagger-1" style={{ marginTop: '6rem', padding: '4rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '3rem' }}>Cómo descargar UniCali en Android</h2>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 600, flexShrink: 0 }}>01</div>
                <p style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>
                  Abre Google Play e instala <strong>UniCali</strong> — es gratis y no requiere ninguna configuración especial.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 600, flexShrink: 0 }}>02</div>
                <p style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>
                  Crea tu cuenta con tu correo institucional y tu código de estudiante (CUI). El proceso toma menos de un minuto.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 600, flexShrink: 0 }}>03</div>
                <p style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>
                  Listo. Accede a tus notas, horarios, comunidad del campus y todas las funciones académicas desde el primer inicio.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '4rem' }}>
              <a
                href={PLAY_STORE_URL}
                className="btn-minimal"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block' }}
                aria-label="Descargar UniCali en Google Play"
              >
                Abrir en Google Play
              </a>
              <p style={{ marginTop: '2rem', fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
                GRATIS · ANDROID · PRUEBA ABIERTA
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Download;
