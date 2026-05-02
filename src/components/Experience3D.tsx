import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = ({ isMobile }: { isMobile: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const count = isMobile ? 150 : 400; // Rendimiento: menos partículas en móvil
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorPrimary = new THREE.Color('#8b004a'); // Guinda
    const colorSecondary = new THREE.Color('#c29958'); // Dorado
    
    for (let i = 0; i < count; i++) {
      // Distribución cilíndrica sutil
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 20;
      const radius = 4 + Math.random() * 8;
      
      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = radius * Math.sin(theta);
      
      // Intercalar colores
      const mixedColor = Math.random() > 0.7 ? colorPrimary : colorSecondary;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    
    return [positions, colors];
  }, [isMobile]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    // Rotación constante y suave
    pointsRef.current.rotation.y = time * 0.03;
    // Movimiento sutil con el scroll
    pointsRef.current.position.y = THREE.MathUtils.lerp(
      pointsRef.current.position.y,
      window.scrollY * 0.002,
      0.05
    );
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial 
        transparent 
        vertexColors 
        size={isMobile ? 0.2 : 0.15} 
        sizeAttenuation={true} 
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
};

const Experience3D: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        dpr={isMobile ? 1 : [1, 2]} // Rendimiento estricto
        performance={{ min: 0.5 }}
        gl={{ antialias: !isMobile, powerPreference: "high-performance", alpha: true }}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#c29958" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#8b004a" />
        
        <ParticleField isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default Experience3D;
