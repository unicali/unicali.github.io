import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Points, PointMaterial, MeshTransmissionMaterial } from '@react-three/drei';
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

const LuxuryShape = ({ isMobile }: { isMobile: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const scrollY = window.scrollY;

    // Rotación base + influencia del ratón
    const targetRotX = (state.mouse.y * Math.PI) / 6 + scrollY * 0.001;
    const targetRotY = (state.mouse.x * Math.PI) / 6 + t * 0.2 + scrollY * 0.002;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);
    
    // Efecto parallax con el scroll
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -scrollY * 0.005, 0.05);
  });

  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.8, 0.6, isMobile ? 64 : 128, isMobile ? 16 : 32]} />
        {/* Material de lujo: Vidrio esmerilado en desktop, wireframe dorado en móvil para rendimiento */}
        {!isMobile ? (
          <MeshTransmissionMaterial 
            backside={false}
            thickness={0.5}
            roughness={0.1}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.04}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#f2efe7"
            attenuationColor="#8b004a"
            attenuationDistance={2}
          />
        ) : (
          <meshPhysicalMaterial 
            color="#c29958" 
            wireframe={true} 
            roughness={0.2} 
            metalness={1}
            transparent
            opacity={0.3}
          />
        )}
      </mesh>
    </Float>
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
        <LuxuryShape isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default Experience3D;
