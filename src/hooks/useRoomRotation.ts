import { useEffect, useRef } from 'react';

/**
 * useRoomRotation
 * Hook para manejar la rotación 3D del cuarto basada en el movimiento del puntero.
 * Optimizado para rendimiento directo en el DOM.
 */
export const useRoomRotation = () => {
  const roomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!roomRef.current) return;

      const x = e.pageX / window.innerWidth - 0.5;
      const y = e.pageY / window.innerHeight - 0.5;

      const rotateX = y * 10 + 75;
      const rotateZ = -x * 25 + 45;

      roomRef.current.style.transform = `
        perspective(90vw)
        rotateX(${rotateX}deg)
        rotateZ(${rotateZ}deg)
        translateZ(-9vw)
      `;
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return roomRef;
};
