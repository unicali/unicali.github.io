import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { GetVersionsUseCase } from '../usecases/GetReleasesUseCase';
import type { AppVersion } from '../domain/Release';
import './Versions.css';

/* ── Arrow icons ────────────────────────────────────── */

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
       stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M9 2L4 7l5 5" />
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
       stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M5 2l5 5-5 5" />
  </svg>
);

/* ── Version panel ──────────────────────────────────── */

const VersionPanel: React.FC<{ version: AppVersion }> = ({ version }) => (
  <>
    <div className="versions-version-header">
      <span className="versions-version-label">{version.label}</span>
      <span className="versions-version-period">{version.period}</span>
    </div>
    <p className="versions-headline">{version.headline}</p>
    <ul className="versions-highlights">
      {version.highlights.map((h, i) => (
        <li key={i} className="versions-highlight-item">
          <span className="versions-highlight-marker" aria-hidden="true">—</span>
          <span>{h}</span>
        </li>
      ))}
    </ul>
    {version.isFoundational && (
      <div className="versions-foundational-marker">
        <span className="meta-label">El origen — Dic 2024</span>
      </div>
    )}
  </>
);

/* ── Main page ──────────────────────────────────────── */

interface ViewState { idx: number; anim: string; }

const Versions: React.FC = () => {
  const versions = GetVersionsUseCase.getAll();

  const [view, setView]   = useState<ViewState>({ idx: 0, anim: '' });
  const animating         = useRef(false);
  const touchStartX       = useRef(0);
  const navScrollRef      = useRef<HTMLDivElement>(null);

  /* Navigate to a given version index */
  const navigateTo = useCallback((next: number) => {
    if (next < 0 || next >= versions.length) return;
    if (animating.current) return;

    setView(cur => {
      if (next === cur.idx) return cur;
      animating.current = true;
      const dir = next > cur.idx ? 'left' : 'right';

      setTimeout(() => {
        setView({ idx: next, anim: `vx-enter-${dir}` });
        setTimeout(() => {
          setView({ idx: next, anim: '' });
          animating.current = false;
        }, 380);
      }, 175);

      return { idx: cur.idx, anim: `vx-exit-${dir}` };
    });
  }, [versions.length]);

  /* Scroll active pill into view */
  useEffect(() => {
    const container = navScrollRef.current;
    if (!container) return;
    const btn = container.querySelector<HTMLElement>(`[data-idx="${view.idx}"]`);
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [view.idx]);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigateTo(view.idx + 1);
      if (e.key === 'ArrowLeft')  navigateTo(view.idx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view.idx, navigateTo]);

  /* Touch / swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 55) {
      navigateTo(delta > 0 ? view.idx + 1 : view.idx - 1);
    }
  };

  const isFirst = view.idx === 0;
  const isLast  = view.idx === versions.length - 1;
  const current = versions[view.idx];

  return (
    <>
      <Helmet>
        <title>Versiones | UniCali</title>
        <meta name="description"
              content="Historial de versiones de UniCali — cada mejora documentada desde el primer día." />
        <link rel="canonical" href="https://www.unicali.app/versiones" />

        <meta property="og:title" content="Versiones | UniCali" />
        <meta property="og:description" content="Historial de versiones de UniCali — cada mejora documentada desde el primer día." />
        <meta property="og:url" content="https://www.unicali.app/versiones" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UniCali" />
        <meta property="og:image" content="https://www.unicali.app/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Versiones | UniCali" />
        <meta name="twitter:description" content="Historial de versiones de UniCali — cada mejora documentada desde el primer día." />
        <meta name="twitter:image" content="https://www.unicali.app/og-image.png" />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="section-hero">
        <div className="container">
          <div className="versions-hero-label reveal stagger-1">
            <span className="meta-label">Historial de Versiones</span>
          </div>
          <h1 className="versions-hero-title reveal stagger-2">
            Versiones
          </h1>
          <p className="versions-hero-description reveal stagger-3">
            Cada mejora, cada corrección, documentada desde el primer día.
          </p>

          <div className="versions-stats reveal stagger-3">
            <div>
              <span className="stat-value">7</span>
              <span className="stat-label">versiones</span>
            </div>
            <div>
              <span className="stat-value stat-value--date">Dic 2024</span>
              <span className="stat-label">inicio del proyecto</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Version navigator (sticky) ────────────────── */}
      <div className="versions-nav-outer">
        <div className="versions-nav-scroll" ref={navScrollRef}>
          {versions.map((v, i) => (
            <button
              key={v.id}
              data-idx={i}
              type="button"
              className={[
                'versions-nav-btn',
                i === view.idx ? 'active' : '',
                v.isFoundational ? 'versions-nav-btn--foundational' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => navigateTo(i)}
              aria-label={v.label}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content panel ─────────────────────────────── */}
      <section
        className="section-standard versions-content"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="container">

          <div className={`versions-panel ${view.anim}`}>
            <VersionPanel version={current} />
          </div>

          {/* ── Bottom navigation ───────────────────────── */}
          <div className="versions-bottom-nav">
            <button
              type="button"
              className="versions-bottom-btn"
              onClick={() => navigateTo(view.idx - 1)}
              disabled={isFirst}
              aria-label="Versión anterior"
            >
              <ArrowLeft />
              {!isFirst && <span>{versions[view.idx - 1].label}</span>}
            </button>

            <span className="versions-page-indicator">
              {current.label}
            </span>

            <button
              type="button"
              className="versions-bottom-btn next-btn"
              onClick={() => navigateTo(view.idx + 1)}
              disabled={isLast}
              aria-label="Versión siguiente"
            >
              {!isLast && <span>{versions[view.idx + 1].label}</span>}
              <ArrowRight />
            </button>
          </div>

        </div>
      </section>
    </>
  );
};

export default Versions;
