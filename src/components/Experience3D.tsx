import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const mouse = { x: 0, y: 0 };

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const [positions, colors] = useMemo(() => {
    const count = 650;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cPrimary   = new THREE.Color('#8b004a');
    const cSecondary = new THREE.Color('#c29958');

    for (let i = 0; i < count; i++) {
      // Distribución esférica — mejor sensación de profundidad 3D
      const phi    = Math.acos(2 * Math.random() - 1);
      const theta  = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 13;

      pos[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi) * 3.5; // Estirar eje Y para pantallas altas
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const c = Math.random() > 0.55 ? cPrimary : cSecondary;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();

    // Rotación base lenta
    pointsRef.current.rotation.y = t * 0.015;

    // Parallax suave siguiendo el cursor (tilt en X y Z)
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      mouse.y * 0.09,
      0.025
    );
    pointsRef.current.rotation.z = THREE.MathUtils.lerp(
      pointsRef.current.rotation.z,
      -mouse.x * 0.045,
      0.025
    );

    // Parallax de scroll vertical
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
        size={0.17}
        sizeAttenuation
        depthWrite={false}
        opacity={0.38}
      />
    </Points>
  );
};

const Experience3D: React.FC = () => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  }}>
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45 }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={1.5} />
      <ParticleField />
    </Canvas>
  </div>
);

export default Experience3D;
