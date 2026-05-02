import React, { useEffect, useRef, useState } from 'react';

const PrivacyPhone: React.FC = () => {
  const phoneRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [privacyOpacity, setPrivOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      // Limitar rotación para elegancia
      const targetRy = x * 25; 
      const targetRx = -y * 20;

      setRotation({ x: targetRx, y: targetRy });

      // Cálculo del efecto de privacidad basado en el ángulo lateral
      const angle = Math.abs(targetRy);
      const priv = Math.max(0, (angle - 10) / 15);
      setPrivOpacity(priv);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="phone-scene-3d" style={{ perspective: '1200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div 
        ref={phoneRef}
        className="phone-3d-body"
        style={{
          width: '240px',
          height: '500px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out',
          borderRadius: '30px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.2)'
        }}
      >
        {/* Lados del teléfono (CSS 3D) */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #c29958, #8b004a)', borderRadius: '30px', transform: 'translateZ(-12px)' }} />
        
        {/* Pantalla Frontal */}
        <div style={{
          position: 'absolute',
          inset: '4px',
          background: '#080808',
          borderRadius: '26px',
          overflow: 'hidden',
          transform: 'translateZ(1px)',
          border: '2px solid rgba(255,255,255,0.05)'
        }}>
          {/* Capa de Privacidad */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#000',
            opacity: privacyOpacity,
            zIndex: 10,
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease'
          }} />

          {/* Contenido (App Screenshot) */}
          <img 
            src="/screenshots/campus.png" 
            alt="UniCali Interface"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Notch sutil */}
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
        </div>
      </div>
    </div>
  );
};

export default PrivacyPhone;
