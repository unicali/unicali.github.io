import React, { useEffect, useRef, useState } from 'react';

const screenshots = [
  { src: '/screenshots/login.jpg', alt: 'UniCali - inicio de sesion' },
  { src: '/screenshots/campus.png', alt: 'UniCali - campus universitario' },
  { src: '/screenshots/campus-gente.png', alt: 'UniCali - comunidad universitaria' },
  { src: '/screenshots/notas.png', alt: 'UniCali - notas academicas' },
  { src: '/screenshots/estadisticas.png', alt: 'UniCali - estadisticas academicas' },
  { src: '/screenshots/perfil.png', alt: 'UniCali - perfil de estudiante' },
  { src: '/screenshots/lab.png', alt: 'UniCali - laboratorio de simulacion' },
  { src: '/screenshots/calculadora.png', alt: 'UniCali - calculadora academica' },
  { src: '/screenshots/rese%C3%B1as-docente.png', alt: 'UniCali - resenas de docente' },
];

const PrivacyPhone: React.FC = () => {
  const phoneRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [privacyOpacity, setPrivOpacity] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setScale(0.8);
      else if (width < 768) setScale(0.9);
      else setScale(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Desktop: tilt siguiendo el cursor
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      const ry = x * 25;
      setRotation({ x: -y * 20, y: ry });
      setPrivOpacity(Math.max(0, (Math.abs(ry) - 10) / 15));
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Móvil: tilt siguiendo el toque — misma experiencia sin cursor
    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const t = e.touches[0];
      const x = (t.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (t.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      const ry = x * 25;
      setRotation({ x: -y * 20, y: ry });
      setPrivOpacity(Math.max(0, (Math.abs(ry) - 10) / 15));
    };
    const handleTouchEnd = () => {
      setRotation({ x: 0, y: 0 });
      setPrivOpacity(0);
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
      setSwipeOffset(0);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const goToIndex = (index: number) => {
    setCurrentIndex((index + screenshots.length) % screenshots.length);
    setSwipeOffset(0);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    touchStartX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = e.clientX - touchStartX.current;
    setSwipeOffset(Math.max(-48, Math.min(48, delta)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = e.clientX - touchStartX.current;
    touchStartX.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (Math.abs(delta) > 42) {
      goToIndex(currentIndex + (delta < 0 ? 1 : -1));
      return;
    }

    setSwipeOffset(0);
  };

  return (
    <div className="phone-scene-3d" style={{ perspective: '1200px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
      <div 
        ref={phoneRef}
        className="phone-3d-body"
        style={{
          width: '240px',
          height: '500px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `scale(${scale}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out',
          borderRadius: '30px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
          userSelect: 'none'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #c29958, #8b004a)', borderRadius: '30px', transform: 'translateZ(-12px)' }} />
        
        <div style={{
          position: 'absolute',
          inset: '4px',
          background: '#080808',
          borderRadius: '26px',
          overflow: 'hidden',
          transform: 'translateZ(1px)',
          border: '2px solid rgba(255,255,255,0.05)'
        }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            touchStartX.current = null;
            setSwipeOffset(0);
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#000',
            opacity: privacyOpacity,
            zIndex: 10,
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease'
          }} />

          <div
            style={{
              display: 'flex',
              width: `${screenshots.length * 100}%`,
              height: '100%',
              transform: `translate3d(calc(${-currentIndex * (100 / screenshots.length)}% + ${swipeOffset}px), 0, 0)`,
              transition: swipeOffset === 0 ? 'transform 850ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
              willChange: 'transform'
            }}
          >
            {screenshots.map(({ src, alt }, index) => (
              <img
                key={src}
                src={src}
                alt={alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                draggable={false}
                style={{
                  width: `${100 / screenshots.length}%`,
                  height: '100%',
                  flex: '0 0 auto',
                  objectFit: 'cover',
                  transform: currentIndex === index ? 'scale(1)' : 'scale(1.015)',
                  transition: 'transform 850ms cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              />
            ))}
          </div>

          <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '18px',
            background: '#000',
            borderRadius: '10px',
            zIndex: 20
          }} />

          <div style={{
            position: 'absolute',
            left: '50%',
            bottom: '14px',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '5px',
            zIndex: 20,
            padding: '6px 8px',
            borderRadius: '999px',
            background: 'rgba(0,0,0,0.34)',
            backdropFilter: 'blur(10px)'
          }}>
            {screenshots.map(({ src }, index) => (
              <button
                key={`${src}-indicator`}
                type="button"
                aria-label={`Ver captura ${index + 1}`}
                onClick={() => goToIndex(index)}
                style={{
                  width: currentIndex === index ? '16px' : '5px',
                  height: '5px',
                  border: 0,
                  borderRadius: '999px',
                  padding: 0,
                  background: currentIndex === index ? '#f2efe7' : 'rgba(242,239,231,0.45)',
                  transition: 'width 300ms ease, background 300ms ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPhone;
