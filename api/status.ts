import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import shell from './_shell.json' with { type: 'json' };

/**
 * Render bajo demanda de /status.
 *
 * Por qué una función y no prerender: publicar un aviso no puede exigir un build
 * completo con Puppeteer y un despliegue del sitio entero. Ése era exactamente el
 * coste que hizo que, en toda la historia del repositorio, nunca se publicara un
 * segundo aviso.
 *
 * OJO al orden de enrutado de Vercel: `redirects → filesystem → rewrites`. De la
 * documentación, textual: «The source property should NOT be a file because
 * precedence is given to the filesystem prior to rewrites being applied». Por eso
 * `/status` está marcado `prerender: false` en src/data/routes.json — si el build
 * generara dist/status/index.html, el fichero estático ganaría y esta función no
 * llegaría a ejecutarse nunca.
 *
 * Consecuencia de lo anterior: no puede haber fichero de respaldo en esta ruta.
 * Si Supabase no responde se sirve FALLBACK, aquí abajo, con 200 y caché corta —
 * nunca un 500 en blanco, porque el momento en que esta página falla es
 * precisamente el momento en que la gente entra a mirarla.
 *
 * Solo usa la clave publicable: RLS limita la lectura a los avisos publicados.
 * La service role key no debe existir en este runtime.
 */

const SITE_URL = 'https://www.unicali.app';
const EMBEDDED_DATA_ID = '__STATUS_DATA__';
const TIMEZONE = 'America/Lima';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const TITLE = 'Estado del Sistema | UniCali';
const DESCRIPTION =
  'Consulta el estado operativo actual de la aplicación UniCali, avisos de mantenimiento y últimos incidentes reportados.';

type ComponentState =
  | 'operational'
  | 'maintenance'
  | 'degraded'
  | 'partial_outage'
  | 'major_outage';
type NoticeSeverity = 'none' | 'minor' | 'major' | 'critical';
type NoticeLifecycle = 'investigating' | 'identified' | 'monitoring' | 'resolved';

const COMPONENT_STATE_LABEL: Record<ComponentState, string> = {
  operational: 'Operativo',
  maintenance: 'En mantenimiento',
  degraded: 'Rendimiento degradado',
  partial_outage: 'Interrupción parcial',
  major_outage: 'Interrupción mayor',
};

const LIFECYCLE_LABEL: Record<NoticeLifecycle, string> = {
  investigating: 'Investigando',
  identified: 'Causa identificada',
  monitoring: 'En observación',
  resolved: 'Resuelto',
};

const STATE_RANK: Record<ComponentState, number> = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  partial_outage: 3,
  major_outage: 4,
};

const SEVERITY_RANK: Record<NoticeSeverity, number> = {
  none: 0,
  minor: 1,
  major: 2,
  critical: 3,
};

interface Component {
  slug: string;
  name: string;
  description: string | null;
  state: ComponentState;
}

interface Update {
  body: string;
  lifecycle: NoticeLifecycle;
  createdAt: string;
}

interface Notice {
  slug: string;
  title: string;
  body: string;
  severity: NoticeSeverity;
  lifecycle: NoticeLifecycle;
  startedAt: string;
  resolvedAt: string | null;
  components: string[];
  updates: Update[];
}

interface StatusData {
  components: Component[];
  notices: Notice[];
  lastUpdated: string | null;
  /** Ver el comentario en src/domain/Status.ts. Debe viajar en el JSON incrustado. */
  available: boolean;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Neutraliza `<` en el JSON incrustado: sin esto, un `</script>` dentro del
 * cuerpo de un aviso cerraría la etiqueta antes de tiempo. El cuerpo de un aviso
 * es prosa escrita a mano, así que es el campo con más probabilidad de contener
 * algo raro en todo el sitio.
 */
const escapeJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/-->/g, '--\\u003e');

// Fechas siempre en la zona de Arequipa, igual que en src/pages/Status.tsx.
// Formatearlas en la zona del visitante produciría un texto distinto aquí y en
// el cliente, y el HTML cambiaría al montar React.
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIMEZONE,
  }).format(new Date(iso));

const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE,
  }).format(new Date(iso));

const isOpen = (notice: Notice) => notice.lifecycle !== 'resolved';

function severityToStateRank(severity: number): number {
  if (severity >= SEVERITY_RANK.critical) return STATE_RANK.major_outage;
  if (severity >= SEVERITY_RANK.major) return STATE_RANK.partial_outage;
  if (severity >= SEVERITY_RANK.minor) return STATE_RANK.degraded;
  return STATE_RANK.operational;
}

/** Misma política que GetStatusUseCase.deriveOverall — deben moverse juntas. */
function deriveOverall(data: StatusData): { headline: string; tone: 'ok' | 'warn' | 'down' | 'unknown' } {
  if (!data.available) {
    return { headline: 'No podemos leer el estado ahora mismo', tone: 'unknown' };
  }
  const worstComponent = data.components.reduce<ComponentState>(
    (worst, component) => (STATE_RANK[component.state] > STATE_RANK[worst] ? component.state : worst),
    'operational',
  );
  const openNotices = data.notices.filter(isOpen);
  const worstOpenSeverity = openNotices.reduce(
    (worst, notice) => Math.max(worst, SEVERITY_RANK[notice.severity]),
    0,
  );
  const effective = Math.max(STATE_RANK[worstComponent], severityToStateRank(worstOpenSeverity));

  if (effective === 0) return { headline: 'Todos los sistemas operativos', tone: 'ok' };
  if (effective >= STATE_RANK.partial_outage) {
    return {
      headline:
        worstComponent === 'operational' ? 'Incidencia en curso' : COMPONENT_STATE_LABEL[worstComponent],
      tone: 'down',
    };
  }
  return {
    headline: openNotices.length ? 'Incidencias menores en curso' : 'Mantenimiento en curso',
    tone: 'warn',
  };
}

const sortNotices = (notices: Notice[]) =>
  [...notices].sort((a, b) => {
    if (isOpen(a) !== isOpen(b)) return isOpen(a) ? -1 : 1;
    return b.startedAt.localeCompare(a.startedAt);
  });

/* eslint-disable @typescript-eslint/no-explicit-any */
function shapeStatus(components: any[], notices: any[]): StatusData {
  const shapedNotices: Notice[] = (notices ?? []).map((notice: any) => ({
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
      .sort((a: Update, b: Update) => b.createdAt.localeCompare(a.createdAt)),
  }));

  const stamps = shapedNotices.flatMap((notice) => [
    notice.startedAt,
    notice.resolvedAt,
    ...notice.updates.map((update) => update.createdAt),
  ]);
  const lastUpdated = stamps.filter((stamp): stamp is string => Boolean(stamp)).sort().pop();

  return {
    components: (components ?? []).map((component: any) => ({
      slug: component.slug,
      name: component.name,
      description: component.description,
      state: component.state,
    })),
    notices: shapedNotices,
    lastUpdated: lastUpdated ?? null,
    available: true,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function buildHead() {
  const canonical = `${SITE_URL}/status`;
  return [
    `<title data-prerendered="true">${escapeHtml(TITLE)}</title>`,
    `<meta name="description" content="${escapeHtml(DESCRIPTION)}" data-prerendered="true">`,
    `<link rel="canonical" href="${canonical}" data-prerendered="true">`,
    `<meta property="og:title" content="${escapeHtml(TITLE)}" data-prerendered="true">`,
    `<meta property="og:description" content="${escapeHtml(DESCRIPTION)}" data-prerendered="true">`,
    `<meta property="og:url" content="${canonical}" data-prerendered="true">`,
    `<meta property="og:type" content="website" data-prerendered="true">`,
    `<meta property="og:site_name" content="UniCali" data-prerendered="true">`,
    `<meta property="og:locale" content="es_PE" data-prerendered="true">`,
    `<meta property="og:image" content="${SITE_URL}/og-image.png" data-prerendered="true">`,
    `<meta name="twitter:card" content="summary_large_image" data-prerendered="true">`,
  ].join('\n    ');
}

/**
 * El HTML debe reproducir lo que el usuario acaba viendo. El cliente monta con
 * createRoot y reemplaza #root, así que cualquier cosa que exista solo aquí
 * desaparece en cuanto React arranca — y Googlebot renderiza JavaScript, con lo
 * que tampoco la vería.
 */
function buildBody(data: StatusData) {
  const overall = deriveOverall(data);
  const notices = sortNotices(data.notices);

  const componentsHtml = data.components.length
    ? `<ul>` +
      data.components
        .map(
          (component) =>
            `<li>${escapeHtml(component.name)} — ` +
            `${escapeHtml(COMPONENT_STATE_LABEL[component.state])}</li>`,
        )
        .join('') +
      `</ul>`
    : '';

  if (!data.available) {
    return (
      `<article class="section-hero"><div class="container">` +
      `<span class="meta-label">Sistema</span>` +
      `<h1>Estado Operativo</h1>` +
      `<h2>${escapeHtml(overall.headline)}</h2>` +
      `<p>No hemos podido consultar el tablón de avisos. Esto no significa que haya ` +
      `una incidencia, solo que ahora mismo no podemos confirmarlo. Vuelve a ` +
      `intentarlo en unos minutos.</p>` +
      `</div></article>`
    );
  }

  const noticesHtml = notices.length
    ? notices
        .map((notice) => {
          const updates = notice.updates
            .map(
              (update) =>
                `<li><strong>${escapeHtml(formatDateTime(update.createdAt))} · ` +
                `${escapeHtml(LIFECYCLE_LABEL[update.lifecycle])}</strong> ` +
                `${escapeHtml(update.body)}</li>`,
            )
            .join('');
          return (
            `<section>` +
            `<span>${escapeHtml(formatDate(notice.startedAt))}</span>` +
            `<h3>${escapeHtml(notice.title)}</h3>` +
            `<p><strong>${escapeHtml(LIFECYCLE_LABEL[notice.lifecycle])}</strong></p>` +
            `<p>${escapeHtml(notice.body)}</p>` +
            (updates ? `<ul>${updates}</ul>` : '') +
            (notice.resolvedAt
              ? `<p>Resuelto el ${escapeHtml(formatDateTime(notice.resolvedAt))}</p>`
              : '') +
            `</section>`
          );
        })
        .join('')
    : `<p>No hay incidentes ni avisos reportados.</p>`;

  return (
    `<article class="section-hero"><div class="container">` +
    `<span class="meta-label">Sistema</span>` +
    `<h1>Estado Operativo</h1>` +
    `<h2>${escapeHtml(overall.headline)}</h2>` +
    (data.lastUpdated
      ? `<p>Última actualización: ${escapeHtml(formatDateTime(data.lastUpdated))}</p>`
      : '') +
    componentsHtml +
    `<h2>Incidentes y Avisos</h2>${noticesHtml}` +
    `<p>Avisos publicados por el equipo de UniCali.</p>` +
    `</div></article>`
  );
}

/**
 * Cascarón honesto para cuando no se puede leer la base. Ver cabecera.
 *
 * `available: false` es lo que impide que la página anuncie "Todos los sistemas
 * operativos" cuando en realidad no ha podido consultar nada: un tablón vacío y
 * uno ilegible tienen el mismo contenido, y sin esta marca serían el mismo HTML.
 */
const FALLBACK: StatusData = {
  components: [],
  notices: [],
  lastUpdated: null,
  available: false,
};

function render(data: StatusData) {
  let html = shell.html;
  // El <title> estático de index.html es solo un fallback; dejarlo produciría dos
  // <title> en el DOM.
  html = html.replace(/<title>[\s\S]*?<\/title>\s*/, '');
  html = html.replace('</head>', `  ${buildHead()}\n  </head>`);
  return html.replace(
    '<div id="root"></div>',
    `<div id="root">${buildBody(data)}</div>\n` +
      `<script type="application/json" id="${EMBEDDED_DATA_ID}">${escapeJson(data)}</script>`,
  );
}

export default async function handler(_request: VercelRequest, response: VercelResponse) {
  response.setHeader('content-type', 'text/html; charset=utf-8');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    response.setHeader('cache-control', 'public, s-maxage=30');
    return response.status(200).send(render(FALLBACK));
  }

  const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

  const [{ data: components, error: componentsError }, { data: notices, error: noticesError }] =
    await Promise.all([
      db.from('status_components').select('slug, name, description, state').order('position'),
      db
        .from('status_notices')
        .select(
          `slug, title, body, severity, lifecycle, started_at, resolved_at,
           status_notice_components ( status_components ( slug ) ),
           status_notice_updates ( body, lifecycle, created_at )`,
        )
        // RLS ya limita el select a status = 'published', pero se filtra también
        // aquí para que la intención quede explícita en el código.
        .eq('status', 'published')
        .order('started_at', { ascending: false }),
    ]);

  if (componentsError || noticesError) {
    // Caché corta: se reintenta pronto, pero se evita una estampida contra
    // Supabase justo cuando algo va mal.
    response.setHeader('cache-control', 'public, s-maxage=30');
    return response.status(200).send(render(FALLBACK));
  }

  // 60 s para que un aviso nuevo salga en menos de un minuto; la ventana larga de
  // stale-while-revalidate hace que el CDN siga sirviendo la última copia buena
  // aunque Supabase deje de responder.
  response.setHeader('cache-control', 'public, s-maxage=60, stale-while-revalidate=86400');
  return response.status(200).send(render(shapeStatus(components ?? [], notices ?? [])));
}
