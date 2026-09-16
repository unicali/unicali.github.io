import { createClient } from '@supabase/supabase-js';
import type { StatusNotice, StatusPageData } from '../domain/Status';

/**
 * Id del bloque JSON que api/status.ts incrusta en el HTML servido. La primera
 * carga no necesita un viaje extra a la base y el crawler ve el contenido sin
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

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Clave publicable: lo que protege los datos es RLS, que solo expone los avisos
// con status = 'published'. Un borrador no viaja hasta aquí.
const client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

const SELECT = `slug, title, body, severity, lifecycle, started_at, resolved_at,
  status_notice_components ( status_components ( slug ) ),
  status_notice_updates ( body, lifecycle, created_at )`;

/** Carga el tablón al navegar dentro del SPA, donde no hay datos incrustados. */
export async function fetchStatus(): Promise<StatusPageData | null> {
  if (!client) return null;

  const [{ data: components, error: componentsError }, { data: notices, error: noticesError }] =
    await Promise.all([
      client
        .from('status_components')
        .select('slug, name, description, state')
        .order('position'),
      client
        .from('status_notices')
        .select(SELECT)
        .eq('status', 'published')
        .order('started_at', { ascending: false }),
    ]);

  if (componentsError || noticesError) return null;

  return shapeStatus(components ?? [], notices ?? []);
}

/**
 * Normaliza las filas anidadas de Supabase al modelo de dominio.
 *
 * Se exporta porque api/status.ts hace la misma consulta en el servidor y debe
 * producir exactamente la misma forma: si las dos rutas divergen, el HTML servido
 * y lo que React pinta al montar dejan de coincidir.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function shapeStatus(components: any[], notices: any[]): StatusPageData {
  const shapedNotices: StatusNotice[] = (notices ?? []).map((notice: any) => ({
    slug: notice.slug,
    title: notice.title,
    body: notice.body,
    severity: notice.severity,
    lifecycle: notice.lifecycle,
    startedAt: new Date(notice.started_at).toISOString(),
    resolvedAt: notice.resolved_at ? new Date(notice.resolved_at).toISOString() : null,
    components: (notice.status_notice_components ?? [])
      .map((link: any) => {
        const target = Array.isArray(link.status_components)
          ? link.status_components[0]
          : link.status_components;
        return target?.slug ?? null;
      })
      .filter((slug: string | null): slug is string => slug !== null),
    updates: (notice.status_notice_updates ?? [])
      .map((update: any) => ({
        body: update.body,
        lifecycle: update.lifecycle,
        createdAt: new Date(update.created_at).toISOString(),
      }))
      // Más reciente arriba, que es como se lee un hilo de incidencia.
      .sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt)),
  }));

  const shapedComponents = (components ?? []).map((component: any) => ({
    slug: component.slug,
    name: component.name,
    description: component.description,
    state: component.state,
  }));

  // La fecha que se muestra sale del dato más reciente, no de una constante que
  // alguien tiene que acordarse de tocar. Si no hay nada que mostrar, es null y
  // la página omite la línea en vez de inventarse una hora.
  const stamps = shapedNotices.flatMap((notice) => [
    notice.startedAt,
    notice.resolvedAt,
    ...notice.updates.map((update) => update.createdAt),
  ]);
  const lastUpdated = stamps
    .filter((stamp): stamp is string => Boolean(stamp))
    .sort()
    .pop();

  return {
    components: shapedComponents,
    notices: shapedNotices,
    lastUpdated: lastUpdated ?? null,
    available: true,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const STATUS_SELECT = SELECT;
