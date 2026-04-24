/* que mira bobo, anda palla. Usa la app mejor. */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

interface UnitState {
  id: number;
  name: string;
  continua: number | '';
  parcial: number | '';
  wContinua: number;
  wParcial: number;
}

const GradeCalculator: React.FC = () => {
  const [expandedUnit, setExpandedUnit] = useState<number | null>(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasCelebrated = useRef(false);

  const [units, setUnits] = useState<UnitState[]>([
    { id: 0, name: 'Unidad 1', continua: '', parcial: '', wContinua: 20, wParcial: 13 },
    { id: 1, name: 'Unidad 2', continua: '', parcial: '', wContinua: 20, wParcial: 13 },
    { id: 2, name: 'Unidad 3', continua: '', parcial: '', wContinua: 20, wParcial: 14 },
  ]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const finalGrade = useMemo(() => {
    // esta logica de los pesos le tocaba a Juan pero se fue a tomar mate, asi que lo hice yo
    return units.reduce((acc, u) => {
      const c = u.continua === '' ? 0 : u.continua;
      const p = u.parcial === '' ? 0 : u.parcial;
      return acc + (c * u.wContinua / 100) + (p * u.wParcial / 100);
    }, 0);
  }, [units]);

  // Lógica de celebración (Confeti de alto rendimiento)
  useEffect(() => {
    if (finalGrade >= 11 && !hasCelebrated.current) {
      launchConfetti();
      hasCelebrated.current = true;
    } else if (finalGrade < 11) {
      hasCelebrated.current = false;
    }
  }, [finalGrade]);

  const launchConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#8b004a', '#c29958', '#f2efe7', '#d12b7a'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 6.28
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speed;
        p.x += Math.sin(p.angle) * 2;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      if (particles.some(p => p.y < canvas.height)) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    render();
  };

  const handleUpdate = (id: number, field: keyof UnitState, value: string) => {
    const num = value === '' ? '' : Math.round(Number(value));
    setUnits(prev => prev.map(u => u.id === id ? { ...u, [field]: num } : u));
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora Notas UNSA",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web, Android",
    "author": {
      "@type": "Organization",
      "name": "UniCali"
    },
    "description": "Herramienta gratuita para calcular el promedio ponderado de la Universidad Nacional de San Agustín (UNSA) en tiempo real.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "COP"
    }
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de Notas UNSA 2026 | Promedio Exacto al Instante</title>
        <meta name="description" content="Calcula tu promedio ponderado de la UNSA en segundos. Herramienta gratuita, sin lag y sin necesidad de escribir porcentajes. Descubre cuánto necesitas para aprobar." />
        
        {/* Open Graph / Social Viral Card */}
        <meta property="og:title" content="Calculadora de Notas UNSA 2026 | Promedio Exacto" />
        <meta property="og:description" content="¿Cuánto necesitas para aprobar? Calcula tu promedio de la UNSA en tiempo real con nuestra herramienta optimizada." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://unicali.github.io/herramientas/calculadora-unsa" />
        <meta property="og:image" content="https://unicali.github.io/og-calculadora.jpg" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      {/* Canvas para la celebración */}
      <canvas 
        ref={canvasRef} 
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2000 }}
      />

      <section style={{ padding: '6rem 0 12rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <span className="section-label">Matemática Académica</span>
          
          <div className="reveal" style={{ marginBottom: '4rem' }}>
            <span className="meta-label">Playground Digital</span>
            <h1 style={{ marginTop: '1.5rem', fontSize: 'clamp(2.5rem, 10vw, 5rem)', fontStyle: 'italic' }}>Calculadora de Notas UNSA</h1>
            <p style={{ color: 'var(--text-dim)', fontWeight: 300, marginTop: '1.5rem', maxWidth: '650px', lineHeight: 1.6 }}>
              Utiliza nuestra calculadora para obtener tu promedio ponderado final de forma instantánea. 
              Ideal para estudiantes de la Universidad Nacional de San Agustín que buscan precisión y rapidez sin configuraciones complejas.
            </p>
          </div>

          <div className="reveal stagger-1">
            <div className={isMobile ? "accordion-container" : "luxury-grid"}>
              {units.map((unit) => (
                <UnitCard 
                  key={unit.id}
                  unit={unit}
                  isMobile={isMobile}
                  isOpen={!isMobile || expandedUnit === unit.id}
                  onToggle={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                  onChange={(f, v) => handleUpdate(unit.id, f, v)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Result & CTA */}
      <div className="reveal" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: 'var(--glass)',
        backdropFilter: 'blur(25px)',
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 0',
        zIndex: 1000,
        boxShadow: '0 -10px 40px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{ maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="meta-label">Promedio Final Estimado</span>
            <div style={{ 
              fontSize: 'clamp(2rem, 8vw, 3.5rem)', 
              fontFamily: 'var(--font-serif)', 
              color: finalGrade >= 10.5 ? 'var(--primary)' : 'var(--text)',
              lineHeight: 1,
              marginTop: '0.2rem',
              transition: 'color 0.5s ease'
            }}>
              {finalGrade.toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.8rem', display: isMobile ? 'none' : 'block' }}>
              {finalGrade >= 11 ? 'Excelente desempeño!' : '¿Cansado de calcular a mano?'}
            </p>
            <Link to="/descargar" className="btn-minimal" style={{ padding: '0.8rem 1.8rem', fontSize: '0.7rem' }}>
              {isMobile ? 'App' : 'Descargar UniCali'}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const UnitCard: React.FC<{
  unit: UnitState;
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (field: keyof UnitState, value: string) => void;
}> = ({ unit, isMobile, isOpen, onToggle, onChange }) => {
  // todo: arreglar la animacion en safari cuando haya tiempo (nunca)
  
  const colors = {
    continua: '#c29958', // Dorado Envejecido
    parcial: '#8b004a'   // Guinda Original
  };

  return (
    <div className={`col-span-4`} style={{ 
      border: isMobile ? 'none' : '1px solid var(--border)',
      borderBottom: isMobile ? '1px solid var(--border)' : '1px solid var(--border)',
      background: isOpen && isMobile ? 'var(--bg-subtle)' : 'transparent',
      overflow: 'hidden',
      transition: 'background 0.4s var(--ease-out)'
    }}>
      <div 
        onClick={isMobile ? onToggle : undefined}
        style={{ 
          padding: isMobile ? '1.5rem' : '2.5rem 2rem 2rem',
          cursor: isMobile ? 'pointer' : 'default',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 500 }}>{unit.name}</h3>
        {isMobile && !isOpen && (
          <span style={{ fontSize: '0.65rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>
            C: {unit.continua || 0} | P: {unit.parcial || 0}
          </span>
        )}
      </div>

      <div style={{
        maxHeight: isOpen ? '600px' : '0',
        opacity: isOpen ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: isMobile ? (isOpen ? '0 1.5rem 2.5rem' : '0 1.5rem') : '0 2rem 2.5rem'
      }}>
        {/* Input Continua - Usando Dorado */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <span className="meta-label" style={{ opacity: 1, color: colors.continua }}>Evaluación Continua</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <input 
                type="number" 
                value={unit.wContinua}
                onChange={(e) => onChange('wContinua', e.target.value)}
                style={{ width: '30px', background: 'none', border: 'none', color: colors.continua, fontSize: '0.75rem', textAlign: 'right', outline: 'none' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <input 
              type="number" 
              className="input-minimal"
              style={{ width: '60px', fontSize: '1.5rem', textAlign: 'center', padding: '0.5rem 0', borderColor: colors.continua }}
              value={unit.continua}
              onChange={(e) => onChange('continua', e.target.value)}
              min="0" max="20" step="1" placeholder="0"
            />
            <input 
              type="range" 
              min="0" max="20" step="1"
              style={{ accentColor: colors.continua }}
              value={unit.continua || 0}
              onChange={(e) => onChange('continua', e.target.value)}
            />
          </div>
        </div>

        {/* Input Parcial - Usando Guinda */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <span className="meta-label" style={{ opacity: 1, color: colors.parcial }}>Examen Parcial</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <input 
                type="number" 
                value={unit.wParcial}
                onChange={(e) => onChange('wParcial', e.target.value)}
                style={{ width: '30px', background: 'none', border: 'none', color: colors.parcial, fontSize: '0.75rem', textAlign: 'right', outline: 'none' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <input 
              type="number" 
              className="input-minimal"
              style={{ width: '60px', fontSize: '1.5rem', textAlign: 'center', padding: '0.5rem 0', borderColor: colors.parcial }}
              value={unit.parcial}
              onChange={(e) => onChange('parcial', e.target.value)}
              min="0" max="20" step="1" placeholder="0"
            />
            <input 
              type="range" 
              min="0" max="20" step="1"
              style={{ accentColor: colors.parcial }}
              value={unit.parcial || 0}
              onChange={(e) => onChange('parcial', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;
