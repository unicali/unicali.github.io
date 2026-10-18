import type { StatusPageData } from '../domain/Status';

/**
 * Id del bloque JSON que api/status.ts incrusta en el HTML servido. La primera
 * carga no necesita un viaje extra a la red y el crawler ve el contenido sin
 * ejecutar JavaScript; el cliente lo relee al montar para que React pinte
 * exactamente lo mismo que ya estaba en el HTML.
 */
export const EMBEDDED_STATUS_ID = '__STATUS_DATA__';

export function readEmbeddedStatus(): StatusPageData | null {
  if (typeof document === 'undefined') return null;
  const node = document.getElementById(EMBEDDED_STATUS_ID);
  if (!node?.textContent) return null;
  try {
    return JSON.parse(node.textContent) as StatusPageData;
  } catch {
    // Un JSON corrupto no debe dejar la página en blanco: se cae al fetch.
    return null;
  }
}

/**
 * Carga el tablón al navegar dentro del SPA, donde no hay datos incrustados.
 *
 * Pide el JSON a la propia función (`/status?format=json`) en vez de hablar con
 * Supabase. Los avisos viven en el proyecto de la APP, y así su clave no tiene
 * que viajar en el bundle del navegador: el único sitio que la conoce es el
 * servidor. De paso, cliente y servidor leen por fuerza la misma forma de datos,
 * que es lo que evita que el HTML servido y lo que pinta React se desincronicen.
 *
 * El rewrite de /status conserva la query string, así que no hace falta una ruta
 * aparte.
 */
export async function fetchStatus(): Promise<StatusPageData | null> {
  try {
    const response = await fetch('/status?format=json', {
      headers: { accept: 'application/json' },
    });
    if (!response.ok) return null;
    return (await response.json()) as StatusPageData;
  } catch {
    // Sin red: la página muestra "no podemos leer el estado", nunca un verde
    // que no puede defender.
    return null;
  }
}
