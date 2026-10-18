import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Páginas que renderiza una función (api/*): el SPA solo pinta la vista que el
 * servidor incrustó. Si se llega navegando dentro del SPA no hay datos
 * incrustados, así que se recarga la URL UNA vez para que la sirva la función.
 *
 * La marca en sessionStorage corta el bucle cuando la función no responde
 * (vite dev, una reescritura sin desplegar): sin ella recargaría para siempre.
 * Se decide al montar (solo lectura) y se escribe en el efecto, porque React en
 * modo estricto invoca dos veces el inicializador.
 */
export function useServerRendered<T>(read: () => T | null): { data: T | null; gaveUp: boolean } {
  const { pathname, search } = useLocation();
  const [data] = useState<T | null>(read);
  const target = pathname + search;
  const key = `ssr-reload:${target}`;

  const [gaveUp] = useState(() => {
    if (data) return false;
    try {
      return sessionStorage.getItem(key) === '1';
    } catch {
      return true; // sin storage no hay forma segura de cortar el bucle
    }
  });

  useEffect(() => {
    if (data || gaveUp) return;
    try {
      sessionStorage.setItem(key, '1');
    } catch {
      return;
    }
    window.location.replace(target);
  }, [data, gaveUp, key, target]);

  return { data, gaveUp };
}
