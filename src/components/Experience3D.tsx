import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const count = 500; 
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorPrimary = new THREE.Color('#8b004a'); 
    const colorSecondary = new THREE.Color('#c29958'); 
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 40; 
      const radius = 4 + Math.random() * 12;
      
      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = radius * Math.sin(theta);
      
      const mixedColor = Math.random() > 0.6 ? colorPrimary : colorSecondary;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.015;
    // Parallax ultra-lento para estabilidad
    pointsRef.current.position.y = THREE.MathUtils.lerp(
      pointsRef.current.position.y,
      window.scrollY * 0.0003, 
      0.05
    );
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial 
        transparent 
        vertexColors 
        size={0.18} 
        sizeAttenuation={true} 
        depthWrite={false}
        opacity={0.35}
      />
    </Points>
  );
};

const Experience3D: React.FC = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 0, // Nivel base
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={[1, 1.5]} // Limitar DPR para mayor estabilidad
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: "high-performance" 
        }}
      >
        <ambientLight intensity={1.5} />
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default Experience3D;
