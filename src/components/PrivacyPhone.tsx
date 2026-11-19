import React, { useEffect, useRef, useState } from 'react';

const screenshots = [
  { src: '/screenshots/login.jpeg', alt: 'Inicio de sesión de UniCali' },
  { src: '/screenshots/unicali-profile.png', alt: 'Perfil académico de UniCali' },
  { src: '/screenshots/unicali-notes.png', alt: 'Notas y promedios de UniCali' },
  { src: '/screenshots/unicali-statistics.png', alt: 'Estadísticas académicas de UniCali' },
  { src: '/screenshots/unicali-lab.png', alt: 'Laboratorio de UniCali' },
  { src: '/screenshots/unicali-simulator.png', alt: 'Simulador de notas de UniCali' },
  { src: '/screenshots/unicali-library.png', alt: 'Biblioteca de UniCali' },
  { src: '/screenshots/unicali-campus.png', alt: 'Comunidad de UniCali' },
  { src: '/screenshots/campus-gente.png', alt: 'Estudiantes de UniCali' },
  { src: '/screenshots/rese%C3%B1as-docente.png', alt: 'Reseñas docentes de UniCali' },
];

const PrivacyPhone: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [rotation, setRotation] = useState({ x: -7, y: -16 });
  const interacting = useRef(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!interacting.current) setIndex((i) => (i + 1) % screenshots.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, []);

  const go = (next: number) => {
    setOffset(0);
    setIndex((next + screenshots.length) % screenshots.length);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    start.current = { x: e.clientX, y: e.clientY };
    interacting.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (Math.abs(dx) > Math.abs(dy)) setOffset(Math.max(-50, Math.min(50, dx)));
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    start.current = null;
    interacting.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setOffset(0);
    if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.2) go(index + (dx < 0 ? 1 : -1));
    else if (Math.abs(dy) > 38 && Math.abs(dy) > Math.abs(dx) * 1.2) go(index + (dy < 0 ? 1 : -1));
  };

  return <div className="phone-scene-3d" onPointerMove={(e) => {
    if (e.pointerType !== 'mouse' || interacting.current || reducedMotion) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    setRotation({ x: -7 - ((e.clientY - bounds.top) / bounds.height - .5) * 22, y: -16 + ((e.clientX - bounds.left) / bounds.width - .5) * 32 });
  }} onPointerLeave={() => setRotation({ x: -7, y: -16 })} style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '16px 0 30px', overflow: 'visible', perspective: 850 }}>
    <div className="phone-3d-float" style={{ transformStyle: 'preserve-3d', animation: reducedMotion ? 'none' : 'phone-float-3d 6s ease-in-out infinite' }}>
    <div className="phone-3d-body" style={{ width: 240, height: 500, position: 'relative', transformStyle: 'preserve-3d', transform: reducedMotion ? 'none' : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`, transition: 'transform 180ms ease-out', borderRadius: 32, padding: 4, background: 'linear-gradient(135deg, var(--gold), #242220 25%, #242220 75%, var(--action))', boxShadow: '20px 25px 55px rgba(0,0,0,.24), 0 3px 12px rgba(0,0,0,.12)', border: '1px solid rgba(255,255,255,.25)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', width: 12, height: 455, left: -7, top: 22, borderRadius: 7, background: 'linear-gradient(90deg, #171615, #9b8254 60%, #30291e)', transform: 'rotateY(-90deg)', transformOrigin: 'right center' }} />
      <div aria-hidden="true" style={{ position: 'absolute', width: 12, height: 455, right: -7, top: 22, borderRadius: 7, background: 'linear-gradient(90deg, #171615, #9b8254 60%, #30291e)', transform: 'rotateY(90deg)', transformOrigin: 'left center' }} />
      <div role="region" aria-label="Vista interactiva de la aplicación UniCali" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={() => { start.current = null; interacting.current = false; setOffset(0); }} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 27, background: '#111', touchAction: 'pan-y', userSelect: 'none', transform: 'translateZ(2px)' }}>
        <div style={{ display: 'flex', width: `${screenshots.length * 100}%`, height: '100%', transform: `translate3d(calc(${-index * (100 / screenshots.length)}% + ${offset}px),0,0)`, transition: offset || reducedMotion ? 'none' : 'transform 500ms ease' }}>
          {screenshots.map(({ src, alt }, i) => <img key={src} src={src} alt={alt} width="1080" height="2400" loading={i <= index + 1 && i >= index - 1 ? 'eager' : 'lazy'} draggable={false} style={{ width: `${100 / screenshots.length}%`, height: '100%', flex: '0 0 auto', objectFit: 'cover', display: 'block' }} />)}
        </div>
        <div style={{ position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)', width: 60, height: 17, borderRadius: 12, background: '#000', pointerEvents: 'none' }} />
      </div>
      <div aria-label="Navegación de capturas" style={{ position: 'absolute', bottom: -22, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
        {screenshots.map(({ src, alt }, i) => <button key={src} type="button" aria-label={`Mostrar ${alt}`} aria-current={i === index ? 'true' : undefined} onClick={() => go(i)} style={{ width: i === index ? 18 : 6, height: 6, border: 0, borderRadius: 8, padding: 0, background: i === index ? 'var(--action)' : 'rgba(120,120,120,.5)', cursor: 'pointer' }} />)}
      </div>
    </div>
    </div>
  </div>;
};

export default PrivacyPhone;
