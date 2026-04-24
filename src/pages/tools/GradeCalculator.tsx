/* que mira bobo, anda palla. Usa la app mejor. */

import React, { useState, useMemo, useEffect } from 'react';
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

  const handleUpdate = (id: number, field: keyof UnitState, value: string) => {
    const num = value === '' ? '' : Math.round(Number(value));
    setUnits(prev => prev.map(u => u.id === id ? { ...u, [field]: num } : u));
  };

  return (
    <>
      <Helmet>
        <title>Calculadora UNSA | Ingeniería Académica</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>

      <section style={{ padding: '6rem 0 12rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <span className="section-label">Matemática Académica</span>
          
          <div className="reveal" style={{ marginBottom: '4rem' }}>
            <span className="meta-label">Versión Web</span>
            <h1 style={{ marginTop: '1.5rem', fontSize: 'clamp(2.5rem, 10vw, 5rem)', fontStyle: 'italic' }}>Calculadora</h1>
            <p style={{ color: 'var(--text-dim)', fontWeight: 300, marginTop: '1.5rem', maxWidth: '600px' }}>
              Optimización de promedios para el sistema UNSA. Ajuste de pesos libre y visualización adaptativa.
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
            <span className="meta-label">Promedio Final</span>
            <div style={{ 
              fontSize: 'clamp(2rem, 8vw, 3.5rem)', 
              fontFamily: 'var(--font-serif)', 
              color: finalGrade >= 10.5 ? 'var(--primary)' : 'var(--text)',
              lineHeight: 1,
              marginTop: '0.2rem'
            }}>
              {finalGrade.toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.8rem', display: isMobile ? 'none' : 'block' }}>
              Cansado de calcular a mano?
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
        {/* Input Continua */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <span className="meta-label" style={{ opacity: 1 }}>Evaluación Continua</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <input 
                type="number" 
                value={unit.wContinua}
                onChange={(e) => onChange('wContinua', e.target.value)}
                style={{ width: '30px', background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', textAlign: 'right', outline: 'none' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <input 
              type="number" 
              className="input-minimal"
              style={{ width: '60px', fontSize: '1.5rem', textAlign: 'center', padding: '0.5rem 0' }}
              value={unit.continua}
              onChange={(e) => onChange('continua', e.target.value)}
              min="0" max="20" step="1" placeholder="0"
            />
            <input 
              type="range" 
              min="0" max="20" step="1"
              value={unit.continua || 0}
              onChange={(e) => onChange('continua', e.target.value)}
            />
          </div>
        </div>

        {/* Input Parcial */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <span className="meta-label" style={{ opacity: 1 }}>Examen Parcial</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <input 
                type="number" 
                value={unit.wParcial}
                onChange={(e) => onChange('wParcial', e.target.value)}
                style={{ width: '30px', background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', textAlign: 'right', outline: 'none' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <input 
              type="number" 
              className="input-minimal"
              style={{ width: '60px', fontSize: '1.5rem', textAlign: 'center', padding: '0.5rem 0' }}
              value={unit.parcial}
              onChange={(e) => onChange('parcial', e.target.value)}
              min="0" max="20" step="1" placeholder="0"
            />
            <input 
              type="range" 
              min="0" max="20" step="1"
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
