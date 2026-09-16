import {
  COMPONENT_STATE_LABEL,
  SEVERITY_RANK,
  STATE_RANK,
  isOpen,
  type ComponentState,
  type OverallStatus,
  type StatusNotice,
  type StatusPageData,
} from '../domain/Status';

/**
 * Reglas del tablón de estado. Sin React y sin Supabase dentro, para que la
 * derivación del banner sea comprobable y no dependa de dónde vengan los datos.
 */
export class GetStatusUseCase {
  /**
   * El titular de la página se DERIVA; nunca se escribe a mano.
   *
   * La versión anterior de /status tenía una constante `overall` escrita a mano
   * junto a la lista de incidentes, así que nada impedía que el banner dijera
   * "Operativo" con tres incidentes abiertos justo debajo. Ese fallo desaparece
   * si el titular no es un dato de entrada sino una consecuencia.
   *
   * Política actual: manda el peor componente, y un aviso abierto puede empeorar
   * el resultado pero nunca mejorarlo. Es deliberadamente pesimista — en una
   * página de estado, equivocarse hacia "algo va mal" cuesta credibilidad; hacia
   * "todo bien" cuesta la confianza del usuario, que es más cara.
   */
  static deriveOverall(data: StatusPageData): OverallStatus {
    // Sin datos no se afirma nada. Ver StatusPageData.available.
    if (!data.available) {
      return { headline: 'No podemos leer el estado ahora mismo', tone: 'unknown' };
    }

    const worstComponent = data.components.reduce<ComponentState>(
      (worst, component) =>
        STATE_RANK[component.state] > STATE_RANK[worst] ? component.state : worst,
      'operational',
    );

    const openNotices = data.notices.filter(isOpen);
    const worstOpenSeverity = openNotices.reduce(
      (worst, notice) => Math.max(worst, SEVERITY_RANK[notice.severity]),
      0,
    );

    // Un aviso crítico o mayor abierto arrastra el titular aunque nadie haya
    // tocado el estado de los componentes. Publicar el aviso es la señal; que
    // además haya que acordarse de mover el componente sería un paso más que
    // olvidar en mitad de una incidencia.
    const effective = Math.max(STATE_RANK[worstComponent], severityToStateRank(worstOpenSeverity));

    if (effective === 0) {
      return { headline: 'Todos los sistemas operativos', tone: 'ok' };
    }
    if (effective >= STATE_RANK.partial_outage) {
      return {
        headline:
          worstComponent === 'operational'
            ? 'Incidencia en curso'
            : COMPONENT_STATE_LABEL[worstComponent],
        tone: 'down',
      };
    }
    return {
      headline: openNotices.length ? 'Incidencias menores en curso' : 'Mantenimiento en curso',
      tone: 'warn',
    };
  }

  /** Abiertos primero, y dentro de cada grupo el más reciente arriba. */
  static sortNotices(notices: StatusNotice[]): StatusNotice[] {
    return [...notices].sort((a, b) => {
      if (isOpen(a) !== isOpen(b)) return isOpen(a) ? -1 : 1;
      return b.startedAt.localeCompare(a.startedAt);
    });
  }

  static openNotices(notices: StatusNotice[]): StatusNotice[] {
    return notices.filter(isOpen);
  }
}

/** Traduce la gravedad de un aviso abierto a la escala de estado de componente. */
function severityToStateRank(severity: number): number {
  if (severity >= SEVERITY_RANK.critical) return STATE_RANK.major_outage;
  if (severity >= SEVERITY_RANK.major) return STATE_RANK.partial_outage;
  if (severity >= SEVERITY_RANK.minor) return STATE_RANK.degraded;
  return STATE_RANK.operational;
}
