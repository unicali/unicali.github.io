import React from 'react';

type Review = {
  id: number;
  text: string;
  author: string;
  role?: string;
  rating?: number;
  date?: string;
  avatar?: string; // optional url or empty for initials
};

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1,
    text: 'Excelente herramienta — interfaz minimalista y flujo muy claro. Me ayudó a organizar mis materias en minutos.',
    author: 'Ana P.',
    role: 'Estudiante',
    rating: 5,
    date: '2026-06-01',
  },
  {
    id: 2,
    text: 'Diseño simple y elegante; el modo oscuro es muy cómodo para usar en la noche.',
    author: 'Carlos M.',
    role: 'Docente',
    rating: 4,
    date: '2026-05-28',
  },
  {
    id: 3,
    text: 'Buen rendimiento y accesibilidad. Recomendable para estudiantes que buscan orden y claridad.',
    author: 'María S.',
    role: 'Estudiante',
    rating: 4,
    date: '2026-05-15',
  },
];

const Stars: React.FC<{ value?: number }> = ({ value = 0 }) => {
  const filled = Math.round(value);
  const stars = Array.from({ length: 5 }).map((_, i) => (i < filled ? '★' : '☆'));
  return <span style={{ color: 'var(--primary)', letterSpacing: '0.05em' }}>{stars.join('')}</span>;
};

const Avatar: React.FC<{ name: string; avatar?: string }> = ({ name, avatar }) => {
  const initials = name.split(' ').map(n => n[0]).slice(0,2).join('');
  return (
    <div style={{ width: 48, height: 48, borderRadius: 999, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
      <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', fontWeight: 600 }}>{initials}</div>
    </div>
  );
};

const Reviews: React.FC = () => {
  return (
    <div className="container section-standard">
      <div className="reveal">
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Reseñas</h1>
        <p className="meta-label" style={{ opacity: 1, marginTop: 0 }}>Lo que la comunidad dice</p>
      </div>

      <div className="luxury-grid" style={{ marginTop: '2.5rem', gap: '1.6rem' }}>
        {SAMPLE_REVIEWS.map((r) => (
          <article key={r.id} className="minimal-card reveal col-span-4" style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Avatar name={r.author} avatar={r.avatar} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text)' }}>{r.author}</p>
                <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.8rem' }}>{r.role} • <span style={{ fontSize: '0.8rem' }}>{r.date}</span></p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Stars value={r.rating} />
              </div>
            </div>

            <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              “{r.text}”
            </p>
          </article>
        ))}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }} className="reveal">
        <a href="/descargar" className="btn-minimal">Probar UniCali</a>
      </div>
    </div>
  );
};

export default Reviews;
