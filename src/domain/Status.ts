/**
 * Modelo del tablón de avisos operativos que se publica en /status.
 *
 * Deliberadamente NO es un modelo de disponibilidad medida: desde esta web no se
 * puede observar el backend de la app Android, que vive en otro proyecto de
 * Supabase. Todo lo que hay aquí lo escribe una persona, y por eso la página
 * tiene que decirlo en vez de insinuar que hay sondas detrás.
 */

/** Estado de una pieza del servicio. Ordenados de mejor a peor a propósito. */
export type ComponentState =
  | 'operational'
  | 'maintenance'
  | 'degraded'
  | 'partial_outage'
  | 'major_outage';

/** Cuánto molesta el aviso al estudiante. Independiente del ciclo de vida. */
export type NoticeSeverity = 'none' | 'minor' | 'major' | 'critical';

/** En qué punto de su resolución está el aviso. */
export type NoticeLifecycle = 'investigating' | 'identified' | 'monitoring' | 'resolved';

export interface StatusComponent {
  slug: string;
  name: string;
  description: string | null;
  state: ComponentState;
}

/** Una entrada del historial de un aviso. Se añaden, no se reescriben. */
export interface NoticeUpdate {
  body: string;
  lifecycle: NoticeLifecycle;
  /** ISO 8601 en UTC. El formato humano se calcula en el navegador. */
  createdAt: string;
}

export interface StatusNotice {
  slug: string;
  title: string;
  body: string;
  severity: NoticeSeverity;
  lifecycle: NoticeLifecycle;
  /** ISO 8601 en UTC. */
  startedAt: string;
  /** ISO 8601 en UTC. Nunca null si `lifecycle` es 'resolved' (lo garantiza un CHECK). */
  resolvedAt: string | null;
  /** Slugs de los componentes afectados. */
  components: string[];
  updates: NoticeUpdate[];
}

export interface StatusPageData {
  components: StatusComponent[];
  notices: StatusNotice[];
  /** ISO 8601 del aviso o componente tocado más recientemente; null si no hay nada. */
  lastUpdated: string | null;
  /**
   * `false` cuando no se pudo leer la base. Existe porque un tablón vacío y un
   * tablón ilegible son indistinguibles por su contenido, y colapsarlos hace que
   * la página anuncie "Todos los sistemas operativos" justo cuando no tiene ni
   * idea de si lo están. Un semáforo en verde que no se puede defender es el
   * error más caro que puede cometer una página de estado.
   */
  available: boolean;
}

/** Un aviso sigue abierto mientras no esté resuelto. */
export const isOpen = (notice: StatusNotice) => notice.lifecycle !== 'resolved';

export const COMPONENT_STATE_LABEL: Record<ComponentState, string> = {
  operational: 'Operativo',
  maintenance: 'En mantenimiento',
  degraded: 'Rendimiento degradado',
  partial_outage: 'Interrupción parcial',
  major_outage: 'Interrupción mayor',
};

export const LIFECYCLE_LABEL: Record<NoticeLifecycle, string> = {
  investigating: 'Investigando',
  identified: 'Causa identificada',
  monitoring: 'En observación',
  resolved: 'Resuelto',
};

/**
 * Gravedad de cada estado, de menor a mayor. Sirve para ordenar y comparar sin
 * repartir cadenas mágicas por los componentes.
 */
export const STATE_RANK: Record<ComponentState, number> = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  partial_outage: 3,
  major_outage: 4,
};

export const SEVERITY_RANK: Record<NoticeSeverity, number> = {
  none: 0,
  minor: 1,
  major: 2,
  critical: 3,
};

/** Resumen que encabeza la página. `tone` decide el color del semáforo. */
export interface OverallStatus {
  headline: string;
  tone: 'ok' | 'warn' | 'down' | 'unknown';
}
