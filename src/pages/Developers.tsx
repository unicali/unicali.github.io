import React from 'react';
import { Helmet } from 'react-helmet-async';
import { QRCodeSVG } from 'qrcode.react';

const Developers: React.FC = () => {
  const team = [
    {
      pseudonym: "Mantra",
      realName: "Sebastián V.",
      role: "User Systems Engineering",
      desc: "Responsable de la lógica binaria y la integración del ecosistema React/Vite. Orquesta la sincronización entre el estado global y el renderizado 3D.",
      id: "UC-01-MNTR",
      secret: "¿A",
      avatar: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
          <path d="M12 11l2 2-2 2-2-2 2-2z" fill="var(--primary)" fillOpacity="0.2"/>
        </svg>
      )
    },
    {
      pseudonym: "Nexus",
      realName: "Mateo G.",
      role: "Infrastructure Architect",
      desc: "Guardian de la persistencia y la disponibilidad. Especialista en la optimización de recursos y seguridad de la infraestructura independiente.",
      id: "UC-02-NEXS",
      secret: "quién",
      avatar: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
          <path d="M12 5v4M10 7h4" stroke="var(--primary)" strokeWidth="2"/>
        </svg>
      )
    },
    {
      pseudonym: "Apex",
      realName: "Julián S.",
      role: "Aesthetic Design & UX",
      desc: "Arquitecto visual. Define la paleta 'Silent Luxury' y la ergonomía de la interfaz, asegurando que la complejidad técnica sea invisible al usuario.",
      id: "UC-03-APEX",
      secret: "intentas",
      avatar: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
          <path d="M9 7h6" stroke="var(--primary)" strokeWidth="2"/>
        </svg>
      )
    },
    {
      pseudonym: "Ghost",
      realName: "Daniela L.",
      role: "QA & Resilience Engineering",
      desc: "Somete cada build a auditorías de seguridad y estrés. Su meta es la entropía cero y la detección proactiva de fallas antes del despliegue.",
      id: "UC-04-GHST",
      secret: "buscar?",
      avatar: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
          <path d="M12 9l-2-2 2-2 2 2-2 2z" fill="var(--primary)" fillOpacity="0.4"/>
        </svg>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Equipo de Desarrollo | El Genoma de UniCali</title>
        <meta name="description" content="Conoce a las mentes detrás de UniCali. Células de desarrollo independientes operando bajo anonimato estratégico." />
      </Helmet>

      <section className="section-hero">
        <div className="container">
          <span className="section-label">Identidad</span>
          <div className="reveal">
            <span className="meta-label">Nivel de Acceso: Encifrado</span>
            <h1 style={{ marginTop: '2rem', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontStyle: 'italic' }}>Célula UniCali</h1>
            <p style={{ color: 'var(--text-dim)', maxWidth: '600px', marginTop: '2rem', fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.6 }}>
              La descentralización es nuestro pilar. Cada ficha de identificación contiene metadatos ocultos que revelan nuestra intención.
            </p>
          </div>

          <div className="luxury-grid" style={{ marginTop: '8rem' }}>
            {team.map((member, i) => (
              <div key={i} className={`col-span-6 reveal stagger-${i+1}`} style={{ marginBottom: '4rem' }}>
                <IDCard member={member} />
              </div>
            ))}
          </div>

          <div className="reveal" style={{ marginTop: '10rem', textAlign: 'center' }}>
            <span className="meta-label">Sistema de Verificación Distribuido</span>
          </div>
        </div>
      </section>
    </>
  );
};

const IDCard: React.FC<{ member: any }> = ({ member }) => {
  return (
    <div style={{
      background: 'var(--bg-subtle)',
      border: '1px solid var(--border)',
      padding: '2.5rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out)',
      cursor: 'default'
    }} className="interactive-hover">
      
      {/* QR Code Section (Tactical) */}
      <div style={{
        position: 'absolute',
        top: '2.5rem',
        right: '2.5rem',
        padding: '8px',
        background: '#fff',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        zIndex: 2
      }}>
        <QRCodeSVG 
          value={member.secret} 
          size={48} 
          bgColor="#ffffff" 
          fgColor="#1a1a1a"
          level="L"
          marginSize={0}
        />
        <div style={{ fontSize: '10px', textAlign: 'center', marginTop: '4px', color: '#1a1a1a', fontWeight: 700, fontFamily: 'monospace' }}>SCAN</div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'var(--bg)', 
          border: '1px solid var(--border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--text-dim)'
        }}>
          {member.avatar}
        </div>
        <div>
          <span className="meta-label" style={{ fontSize: '0.5rem', opacity: 0.8 }}>ID: {member.id}</span>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', margin: '0.2rem 0', color: 'var(--primary)' }}>
            {member.pseudonym}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
             <span style={{ 
               fontFamily: 'monospace', 
               fontSize: '0.75rem', 
               color: 'var(--text)',
               textTransform: 'uppercase',
               position: 'relative',
               overflow: 'hidden'
             }}>
               {member.realName}
               {/* Efecto de Desfoque de Censura */}
               <span style={{
                 position: 'absolute',
                 inset: 0,
                 background: 'rgba(0,0,0,0.1)',
                 backdropFilter: 'blur(4px)',
                 borderRadius: '2px'
               }} />
             </span>
             <div style={{ width: '30px', height: '1px', background: 'var(--primary)', opacity: 0.3 }} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '3.5rem', position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text)', marginBottom: '1rem', fontWeight: 600 }}>
          {member.role}
        </h3>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: 1.8, fontWeight: 300 }}>
          {member.desc}
        </p>
      </div>

      <div style={{ 
        marginTop: '2.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)'
      }}>
        <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.2em' }}>STATUS: ACTIVE_CELL</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1,2,3,4,5].map(b => <div key={b} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.1 * b }} />)}
        </div>
      </div>
    </div>
  );
};

export default Developers;
