import React from 'react';
import { Helmet } from 'react-helmet-async';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mantra.unsap';

const Download: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Instalar UniCali | Google Play</title>
        <meta name="description" content="UniCali ya está disponible en Google Play. Instala la app, crea tu cuenta y empieza a gestionar tu vida académica en minutos." />
      </Helmet>

      <section className="section-hero">
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>

          <div className="reveal">
            <span className="meta-label">Prueba Abierta</span>
            <h1 style={{ marginTop: '2rem', fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontStyle: 'italic' }}>
              Ya en Google Play
            </h1>
            <p style={{ color: 'var(--text-dim)', marginTop: '2rem', fontSize: '1.2rem', fontWeight: 300, lineHeight: 1.6 }}>
              UniCali está disponible para todos. Instala la app, regístrate con tus datos universitarios y empieza a usar todas las funciones académicas de inmediato.
            </p>
          </div>

          <div className="reveal stagger-1" style={{ marginTop: '6rem', padding: '4rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '3rem' }}>Tres pasos para empezar</h2>

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
              <a href={PLAY_STORE_URL} className="btn-minimal" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
                Abrir en Google Play
              </a>
              <p style={{ marginTop: '2rem', fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
                PRUEBA ABIERTA · ACCESO GRATUITO · ANDROID
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Download;
