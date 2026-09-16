# Página de estado (`/status`) — mapeo y análisis previo

Cómo funciona el tablón de avisos de `/status`, y por qué está hecho así.

**Estado: implementado.** Los avisos viven en Supabase (`zrothyfheizamsbmxskj`),
los sirve `api/status.ts` y se publican con `npm run status:aviso`. Las secciones
1 y 1.bis describen el sistema anterior y se conservan porque explican por qué se
cambió; la §10 es el manual de uso.

Fecha del análisis: 2026-09-04.

## Atajo

```bash
npm run status:aviso -- nuevo --titulo "..." --cuerpo "..." --publicar
npm run status:aviso -- actualizar <slug> --cuerpo "..." --ciclo monitoring
npm run status:aviso -- resolver <slug>
npm run status:aviso -- listar
```

Sin build y sin despliegue: el aviso sale en menos de 60 segundos.

---

## 1. Qué había antes

`src/pages/Status.tsx`, 120 líneas. Dos constantes escritas a mano:

```ts
const SYSTEM_STATUS = { overall: 'Problemas Menores', lastUpdated: '25 Agosto 2026, 10:30 AM' };
const INCIDENTS = [ { id: 1, date: '25 Agosto 2026', title: 'Aviso: Problemas con Autenticación de Google', ... }, ... ];
```

La ruta está en `src/data/routes.json` con `prerender: true` y en el sitemap con
`priority: 0.5, changefreq: weekly`. Se hornea a `dist/status/index.html` en el
build.

**La página no está rota.** `https://www.unicali.app/status` responde `200`, 16.9 KB,
y el HTML servido contiene «Estado Operativo», «Incidentes y Avisos» y los tres
incidentes. Se renderiza bien en servidor y en cliente.

Lo que no muestra es **nada real**. Y eso es peor que estar caída:

- Lleva desde el 25 de agosto diciendo **«Todos los sistemas problemas menores»**.
  Hoy es 4 de septiembre. Son diez días.
- Anuncia en público un fallo de autenticación de Google sin resolver, con el
  texto «la actualización que lo soluciona llegará en 24 horas». Esas 24 horas
  vencieron hace nueve días.
- «Última actualización» es un literal de código. Solo cambia si alguien edita el
  `.tsx` y redespliega. Por construcción no puede ser cierto salvo el día del deploy.
- `changefreq: weekly` le declara a Google que la página cambia cada semana. No
  cambia desde el último deploy.
- Los estados (`Resolviendo`, `Investigando`, `Resuelto`) son texto libre y el
  color es binario: `status === 'Resuelto' ? verde : naranja`. «Investigando» y
  «Resolviendo» se ven idénticos.
- `SYSTEM_STATUS.overall` se escribe a mano y no deriva de los incidentes. Nada
  impide que el banner diga «Operativo» con tres incidentes abiertos debajo.

---

## 1.bis Cómo se colocaban los avisos (y por qué no se colocaban)

Respuesta corta: **no se están colocando.** No hay proceso porque nunca ha habido
un segundo aviso.

La evidencia es limpia. `git log --follow -- src/pages/Status.tsx` devuelve **un
único commit en toda la historia del repositorio**:

```
fc45af4  2026-08-25 10:33:47 -0500  FEAT: Page tsx, status
 scripts/prerender.mjs |   1 +
 src/App.tsx           |   3 ++
 src/pages/Status.tsx  | 107 ++++++++++++++++++++++++++++++++++++++++++++++++++
```

Y el propio archivo dice:

```ts
lastUpdated: '25 Agosto 2026, 10:30 AM'
```

Las 10:30 del 25 de agosto, tres minutos antes del commit de las 10:33. Es decir:
los tres «incidentes» se escribieron **de una sentada, junto con el componente**,
como contenido de muestra para que la maqueta no saliera vacía. Nadie ha vuelto
a tocarlos. No son avisos: son un *placeholder* que lleva diez días en producción
presentándose como información operativa.

El «procedimiento» actual, si alguien quisiera publicar un aviso de verdad, sería:

1. Abrir `src/pages/Status.tsx`.
2. Añadir un objeto al array `INCIDENTS` y actualizar a mano `SYSTEM_STATUS.overall`
   y `SYSTEM_STATUS.lastUpdated`.
3. `git commit`, `git push`.
4. Esperar el build completo: `tsc -b` + `vite build` + `generate-shell` +
   `prerender` (que arranca Puppeteer) + `generate-og` + `generate-sitemap`.
5. Que el deploy salga bien.

Cinco pasos, un build de varios minutos y un despliegue de todo el sitio para
cambiar un párrafo. Ese coste es exactamente la razón por la que el paso 1 nunca
ha ocurrido una segunda vez. **El mecanismo no es que esté mal diseñado: es que
disuade de usarlo, y una página de avisos que disuade de publicar avisos es una
página que miente por omisión.**

Nota de contraste: hay un precedente en el repo de contenido-en-código que sí
funciona, `src/data/releases.ts` (`VERSIONS_DATA`, alimenta `/versiones`). Ahí el
patrón es correcto, porque una entrada de changelog no es urgente y puede esperar
al siguiente despliegue. Un aviso que dice «el login está caído» no puede.

---

## 2. La pregunta que nadie ha contestado: ¿estado de qué?

Esto es lo más importante del documento.

Los incidentes hablan de **login con Google**, **sincronización de notas** y
**servidores de la base de datos principal**. Nada de eso vive en este repositorio
ni en la base a la que este repositorio se conecta.

Contenido real de `zrothyfheizamsbmxskj` (medido, no supuesto):

| Tabla | Filas | Para qué |
|---|---:|---|
| `universities` | 1 | UNSA |
| `faculties` | 18 | |
| `programs` | 59 | planes de estudio |
| `courses` | 4 520 | |
| `course_prerequisites` | 2 630 | |
| `seo_pages` | 59 | 59 publicadas, 0 en borrador |
| `seo_sources` | 118 | |
| `seo_internal_links` | 354 | |
| `ingest_runs` | 292 | última: 2026-08-28 20:29 UTC |

Y además: **`auth.users` = 0**, **`storage.buckets` = 0**, **0 Edge Functions**,
4 migraciones (todas del 28 de agosto). Esta base es exclusivamente el corpus de
SEO/mallas. No hay usuarios, no hay sesiones, no hay sincronización, no hay
«base de datos principal» que pueda caerse.

El backend del que hablan los incidentes es el de la app Android UNIRANK — el
`README.MD` menciona Campus, Realtime y notificaciones. Es otro sistema.

**Son dos bases distintas y así se quedan** (confirmado por el autor del
proyecto): `UNSAP` (`akxtzpcauoowumglbcdm`) es la base de la app Android;
`zrothyfheizamsbmxskj` es la de esta web y es la que nos corresponde. No se
mezclan. Están además en cuentas de Supabase distintas — el MCP local ve
`zrothyfheizamsbmxskj`, y el listado de la otra credencial (org
`tzgnsifaupdwnorxxkzn`, donde vive `UNSAP`) **no lo incluye**.

**Conclusión operativa, que es la que manda sobre todo el diseño:** desde esta
web no se puede *medir* el estado de la app. Por tanto `/status` no es —ni puede
ser— una página de disponibilidad automática. Es **un tablón de avisos redactados
por una persona**. Todo lo que sigue asume eso, y el diseño debe dejarlo explícito
en la propia página en vez de insinuar medición con frases como «Todos los
sistemas operativos».

---

## 3. Cómo lo hacen las apps grandes

El patrón estándar (Stripe, GitHub, Cloudflare, Slack, Vercel, Atlassian) separa
la página de estado en **tres capas independientes**. Confundirlas es el fallo
número uno.

### Capa 1 — Sondas: la verdad de la máquina

Chequeos sintéticos que corren **fuera** de la infraestructura que vigilan, cada
30–60 s, desde varias regiones. Miden latencia y códigos de respuesta de endpoints
concretos, y de ahí sale un porcentaje de disponibilidad.

> **La regla de oro del sector: la página de estado nunca se aloja en la
> infraestructura sobre la que informa.** El status page de GitHub no está en
> GitHub; el de Vercel no está en Vercel. Si comparten destino, se caen juntos —
> exactamente en el minuto en que la página importa.

Herramientas: Atlassian Statuspage, Better Stack, Instatus, Checkly, UptimeRobot,
Cachet (autoalojado).

### Capa 2 — Incidentes: la verdad humana

Una máquina no sabe decir «estamos revirtiendo», «tus datos están a salvo» o
«ETA 24 h». Todos los sitios serios tienen incidentes redactados por una persona,
con **ciclo de vida cerrado**:

```
investigating → identified → monitoring → resolved
```

Y con estas propiedades:

- **Actualizaciones append-only.** Un incidente no se edita: se le añaden entradas
  fechadas. El histórico es lo que genera confianza; borrar es lo que la destruye.
- **Componentes afectados.** La página lista *componentes* (API, Auth, Sync,
  Notificaciones, Web) con estado propio.
- **El banner global se deriva**, no se escribe. `peor(estado de los componentes)`.
- **Severidad de impacto** separada del ciclo de vida: `none / minor / major / critical`.
- **Post-mortem** para los incidentes mayores.
- Timestamps en UTC ISO, formateados en el navegador a la zona del lector.

Esto es un CMS, no un monitor.

### Capa 3 — Presentación

- Página pública de solo lectura, cacheada agresivamente en el CDN.
- Endpoint legible por máquina (`/api/status.json`) — lo consume la propia app
  Android para mostrar un aviso dentro de la app.
- Suscripción opcional: email, RSS, webhook.
- **Degradación elegante:** si la fuente de datos no responde, la página sigue
  renderizando con un aviso explícito («no podemos leer el estado ahora mismo»),
  nunca en blanco.

---

## 4. ¿Debería controlarse desde Supabase?

Respuesta corta: **sí para la capa 2, no para la capa 1**, y hay un problema
previo en la capa 0.

### Sí — los incidentes encajan perfectamente

Y encajan porque **ya tienes ese pipeline funcionando y depurado** para
`/calculadora/*`:

```
tabla + RLS (status='published')  →  función Vercel con clave publicable  →  caché CDN
```

`api/seo.ts` y `api/sitemap.ts` son la plantilla literal. Unas tablas
`status_components` / `status_incidents` / `status_incident_updates` reutilizarían
la compuerta RLS ya probada, el `escapeHtml`/`escapeJson` ya escrito, las cabeceras
`s-maxage` + `stale-while-revalidate` ya ajustadas y la regla de «renderizar en los
dos sitios» que ya está documentada. Cero infraestructura nueva, cero proveedor
nuevo. Ésa es la respuesta eficiente.

Y publicar un incidente dejaría de requerir un redespliegue — que es exactamente
la razón por la que las páginas programáticas se sirven bajo demanda en vez de
prerenderizarse.

### No — la disponibilidad no debe medirse desde Supabase

Dependencia circular: si el backend de la app es Supabase y Supabase se cae, una
página de estado alimentada por Supabase se cae en el mismo instante en que hace
falta. Es el único error verdaderamente grave posible en este terreno.

Mitigación barata si aun así quieres mantenerlo en casa (recomendada):
`s-maxage` corto + `stale-while-revalidate` muy largo, de modo que el edge de
Vercel siga sirviendo la última copia conocida aunque Supabase no conteste, más
el `/status` prerenderizado actual como fallback estático.

### El problema previo: hoy nadie sabe si la app está bien

Escribir «Operativo» a mano es una afirmación que no puedes respaldar. El
`CLAUDE.md` de este proyecto fija su propia regla:

> «Es preferible no publicar una página a publicar un número que no se puede defender.»

Un semáforo en verde escrito a mano en la página de estado es justo lo que esa
regla prohíbe — y con más consecuencias que un crédito mal contado.

---

## 5. Seguridad

### 5.1 Lo que ya está bien y hay que copiar tal cual

Postura RLS actual, verificada en `pg_policies`:

| Tabla | Política | Roles | Condición |
|---|---|---|---|
| `universities`, `faculties`, `programs`, `courses`, `course_prerequisites` | `lectura publica` | anon, authenticated | `SELECT` · `true` |
| `seo_pages` | `lectura de publicadas` | anon, authenticated | `SELECT` · `status = 'published'` |
| `seo_internal_links` | `lectura de enlaces publicados` | anon, authenticated | `SELECT` · join a `seo_pages.status='published'` |
| `seo_sources` | `lectura de fuentes publicadas` | anon, authenticated | `SELECT` · join a `seo_pages.status='published'` |
| `ingest_runs` | *(ninguna)* | — | RLS activo, sin políticas |

Tres cosas correctas que una tabla de estado debe repetir sin discutir:

1. **No existe ni una sola política de `INSERT`/`UPDATE`/`DELETE`.** El anónimo no
   puede escribir porque no hay por dónde, no porque la app se lo impida.
2. Las escrituras van solo por service role, desde `scripts/seo/lib/supabase.mjs`,
   que lee `SUPABASE_SERVICE_ROLE_KEY` de `process.env` y **nunca** de una variable
   `VITE_*` (Vite las inlinea en el bundle público).
3. La compuerta editorial vive en RLS, no en un `WHERE` de la aplicación. Un
   borrador no puede servirse ni por error de código.

Además, el trigger de evento `public.rls_auto_enable()` activa RLS
automáticamente en cualquier tabla nueva de `public`. Una futura
`status_incidents` nacería con RLS puesto. Eso es una red de seguridad real.

### 5.2 Hallazgos del advisor — con una corrección importante

`get_advisors(security)` devuelve tres avisos:

- **2× WARN — `public.rls_auto_enable()` es `SECURITY DEFINER` y ejecutable por
  `anon` y `authenticated` vía `/rest/v1/rpc/rls_auto_enable`.**

  **Son falsos positivos.** La función devuelve `event_trigger`. Comprobado
  ejecutándola directamente contra la base:

  ```
  trigger functions can only be called as triggers
  ```

  Postgres rechaza la llamada directa, así que PostgREST tampoco puede invocarla.
  El linter mira `SECURITY DEFINER` + permisos de `EXECUTE` y no el tipo de retorno.
  Se puede silenciar con un `REVOKE EXECUTE ... FROM anon, authenticated` (limpio y
  sin coste), pero **no es una vía de explotación**. Vale la pena dejarlo escrito
  para no volver a investigarlo cada vez que alguien corre el advisor.

- **INFO — `public.ingest_runs` tiene RLS activo y cero políticas.**

  Hoy eso significa denegar todo al anónimo, que es lo correcto. Pero está
  protegida por la *ausencia* de una política, no por una decisión explícita. Y
  guarda datos operativos: 292 ejecuciones con `stats` y `error`. Esto pasa a ser
  directamente relevante: en cuanto haya página de estado, la tentación será
  exponer la salud de la ingesta desde esta tabla, y ése es justo el momento en
  que alguien añade una política que filtra cadenas de error internas.

`get_advisors(performance)`: 4 claves foráneas sin índice de cobertura
(`programs.faculty_id`, `seo_internal_links.to_page_id`, `seo_pages.program_id`,
`seo_pages.university_id`) y 3 índices nunca usados (`programs_university_idx`,
`faculties_university_idx`, `ingest_runs_program_idx`). Irrelevante con 59 filas,
pero si una tabla de estado une componentes con incidentes, ese índice se pone
desde el principio.

### 5.3 Riesgos nuevos que introduce una página de estado

1. **Filtración de borradores.** Un incidente en redacción («investigando un
   posible acceso indebido a…») no puede ser legible antes de publicarse. Misma
   compuerta que `seo_pages`: enum de estado en RLS, no un filtro de aplicación.
2. **Camino de escritura.** La versión peligrosa es un panel en `/dev` con sesión
   de Supabase escribiendo directo desde el navegador. Si se quiere UI: Supabase
   Auth + comprobación de rol **dentro de la política RLS**, jamás un
   `if (isAdmin)` en cliente. La alternativa sobria es mantener las escrituras en
   un script con service role, como ya se hace con la ingesta.
3. **XSS almacenado.** El cuerpo de un incidente es prosa humana que se inyecta en
   HTML de servidor. `api/seo.ts` ya tiene `escapeHtml` y `escapeJson` (este
   último neutraliza `<` para que un `</script>` en los datos no cierre la
   etiqueta). Un renderizador de estado que no los use convierte el campo de
   incidente en vector de inyección hacia todos los visitantes.
4. **Divulgación de información en el texto del incidente.** Las páginas de estado
   son el sitio clásico donde alguien pega una traza, un hostname interno o un
   «el fallo permitía ver notas de otros usuarios». Hace falta una regla editorial
   explícita, escrita.
5. **`/dev` está sin proteger.** Hoy es inofensivo (386 líneas, sin Supabase, sin
   auth, sin `fetch`) y está fuera del prerender y del sitemap — pero `vercel.json`
   lo reescribe a `index.html`, así que se sirve a quien lo pida. Deja de ser
   inofensivo el día que sea el panel de estado.
6. **Higiene de claves.** `.env.local` guarda `SUPABASE_SERVICE_ROLE_KEY` y
   `VERCEL_TOKEN` en el mismo fichero que cargan los scripts vía
   `node --env-file=.env.local`. Está fuera de git (`.env*` en `.gitignore`), bien.
   Pero cada ejecución expone la service role key a todo lo que corra en ese
   proceso, dependencias transitivas incluidas. No es algo que arreglar hoy; es
   algo a tener presente al añadir un script de escritura de estado.

---

## 6. Eficiencia

- Una página de estado es la página de mayor abanico de tráfico que tienes,
  y su pico coincide exactamente con el incidente. Renderizarla por petición
  contra Supabase durante una caída es la peor forma de tráfico posible.
- Forma correcta, y ya tienes las piezas: función Vercel → una lectura a Supabase →
  `cache-control: public, s-maxage=60, stale-while-revalidate=86400`. Los 60 s
  hacen que una actualización de incidente salga en menos de un minuto; la ventana
  SWR larga hace que el CDN siga sirviendo aunque Supabase no conteste.
- Contraste con `api/seo.ts`, que usa `s-maxage=86400, swr=604800`: correcto allí
  (una malla no cambia), inadecuado para estado.
- **Una consulta, no cuatro.** El handler de SEO hace 2 en paralelo + 1 secuencial.
  Una lectura de estado debe ser un único `select` embebido
  (`components`, `incidents(updates)`) o una vista.
- **El respaldo va dentro de la función, no en un fichero aparte.** Ver §9.2: no
  se puede tener a la vez `/status` prerenderizado y `/status` servido por una
  función. El fallback tiene que ser una constante dentro del propio handler.
- Coste en Supabase: despreciable. Son decenas de filas y una lectura cada 60 s
  por región de CDN.

---

## 7. Crítica

Lo que pediste explícitamente. Sin suavizar:

1. **Tal como está, la página resta en vez de sumar.** Un `/status` que lleva diez
   días diciendo «Problemas Menores» enseña a los usuarios a ignorarlo, y de paso
   anuncia en público un fallo de autenticación que, según su propio texto, debía
   estar resuelto hace nueve días. **La acción de mayor valor no requiere Supabase
   ni arquitectura: es borrar los incidentes caducados y poner el banner en un
   estado defendible.** Eso se puede hacer hoy, en diez minutos, antes de decidir
   nada más.

2. **Esta página incumple la regla fundacional del proyecto más que ningún otro
   sitio del código.** El pipeline SEO tiene compuertas `draft → review → published`
   y validación redundante contra dos fuentes… para contar créditos. La página que
   hace afirmaciones sobre seguridad, autenticación e integridad de datos de los
   estudiantes no tiene ninguna compuerta: es un array literal.

3. **No construyas monitorización.** Es una persona sacando un sitio; un CMS de
   componentes e incidentes actualizado a mano es alcanzable y honesto. Los
   semáforos verdes automáticos no lo son, porque este repositorio no puede
   observar el backend de Android — y menos aún estando en otra cuenta.

4. **Decide qué es `/status` antes de tocar el esquema.** Si es un boletín humano,
   dilo en la propia página («avisos publicados por el equipo») y quita el lenguaje
   de disponibilidad («Todos los sistemas…»), que promete medición. Si va a ser
   medición de verdad, hay que hablar antes de dónde se aloja la sonda.

5. **Detalles menores con coste real:** `changefreq: weekly` en una página que
   cambia dos veces al año es crédito que se gasta con Google; los estados en
   texto libre deberían ser un enum en base desde el día uno; y el banner global
   debe derivarse de los componentes en vez de escribirse, porque hoy nada impide
   que se contradiga con la lista que tiene debajo.

---

## 8. Decisiones tomadas

| Pregunta | Respuesta |
|---|---|
| ¿La base de la app y la de la web se mezclan? | No. `UNSAP` es de la app; `zrothyfheizamsbmxskj` es de la web y es la única que tocamos. |
| ¿`/status` mide disponibilidad? | No, y no puede. Es un tablón humano (§2). |
| ¿Dónde viven los avisos? | Supabase (§9.2), publicados con `npm run status:aviso`. |
| ¿Panel web para escribir? | No. Solo service role desde script (§5.3.2). |
| ¿Qué pasa con los tres avisos actuales? | Se dejaron como estaban, sembrados tal cual (§10.5). |

Sigue abierto, sin bloquear nada:

- ¿Se mantienen los cuatro componentes (App, Inicio de sesión, Sincronización,
  Web) o basta con una lista plana de avisos? Los componentes solo valen la pena
  si de verdad se van a mantener al día; hoy su estado también se escribe a mano.
- ¿Hace falta `/api/status.json` para que la app Android muestre el aviso dentro
  de la app? Con el esquema actual sería una función de veinte líneas.

---

## 9. El mecanismo para publicar avisos

Esta es la pieza que falta. Dos caminos reales; el tercero (panel web con sesión
de Supabase en el navegador) queda descartado por §5.3.2.

### 9.1 Opción A — Avisos en el repositorio

`src/data/avisos.ts` con su interfaz en `src/domain/Aviso.ts`, exactamente el
patrón de `releases.ts` → `domain/Release.ts` que ya funciona para `/versiones`.
Se edita el array, se commitea, se despliega. `/status` sigue prerenderizado.

- **A favor:** cero infraestructura nueva, cero superficie de ataque nueva, cero
  coste de runtime, la página sigue siendo un fichero estático servido desde el
  CDN, y el aviso queda versionado en git con autor y fecha reales.
- **En contra:** publicar exige un build completo (incluido Puppeteer en el
  prerender) y un despliegue de todo el sitio. Si el build está roto, no puedes
  publicar el aviso — y el momento en que más falta hace un aviso correlaciona
  con el momento en que algo está roto.

### 9.2 Opción B — Avisos en Supabase

Tabla + RLS + `api/status.ts`, calcado de `api/seo.ts`. Publicar un aviso pasa a
ser una escritura en base; el sitio no se redespliega.

**Restricción dura que hay que conocer antes de elegir esto.** Documentación de
Vercel, textual:

> «The `source` property should **NOT** be a file because precedence is given to
> the filesystem prior to rewrites being applied. Instead, you should rename your
> static file or Vercel Function.»

El orden de enrutado es `redirects → filesystem → rewrites`. Como el build genera
`dist/status/index.html`, un `rewrite` de `/status` a `/api/status` **nunca se
dispararía**: el fichero estático gana siempre. Por eso `/calculadora/:escuela`
funciona (no existe fichero en esa ruta) y `/status` no funcionaría sin más.

Consecuencias:

1. Hay que quitar `/status` de la lista de prerender en `src/data/routes.json`
   (`prerender: false`), y solo entonces añadir el rewrite. Es un cambio de una
   línea, pero omitirlo produce el fallo más desconcertante posible: todo bien
   configurado y la función jamás se ejecuta.
2. **No puede haber fichero estático de respaldo en la misma ruta.** El fallback
   ante un fallo de Supabase tiene que ser una constante dentro del propio
   handler: si la consulta falla, se renderiza un cascarón honesto («no podemos
   leer el estado ahora mismo») con 200 y caché corta, nunca un 500 en blanco.

Esquema mínimo propuesto (tres tablas, siguiendo el modelo estándar de §3):

```
status_components   (id, slug, name, position, state)
                    state: operational | degraded | partial_outage | major_outage | maintenance

status_notices      (id, slug, title, body, severity, lifecycle, component_ids[],
                     status, started_at, resolved_at, created_at, updated_at)
                    severity:  none | minor | major | critical
                    lifecycle: investigating | identified | monitoring | resolved
                    status:    draft | published | archived     ← la compuerta RLS

status_notice_updates (id, notice_id, body, lifecycle, created_at)   -- append-only
```

Postura de seguridad, idéntica a la que ya está probada en `seo_pages`:

- Una sola política por tabla: `SELECT` para `anon`/`authenticated`, con
  `status = 'published'` en `status_notices` y un join al padre publicado en
  `status_notice_updates`.
- **Ninguna** política de `INSERT`/`UPDATE`/`DELETE`. Las escrituras van por
  service role desde un script, como ya hace `scripts/seo/lib/supabase.mjs`.
- `rls_auto_enable()` activará RLS solo al crear las tablas (§5.1), pero conviene
  ponerlo explícito en la migración y no confiar en el trigger.
- El cuerpo del aviso es prosa humana inyectada en HTML de servidor: **obligatorio**
  pasar por `escapeHtml`/`escapeJson`, que ya existen en `api/seo.ts`.
- Caché: `public, s-maxage=60, stale-while-revalidate=86400` (§6).

Interfaz de escritura: `npm run status:aviso`, un script en `scripts/status/` que
carga `.env.local`, valida el aviso contra el enum y escribe con service role.
Sin panel, sin sesión en el navegador, sin superficie nueva expuesta a internet.

### 9.3 Lo que se eligió

**Opción B.** La razón que pesó sobre todas: la Opción A ya existía de facto —el
array en el `.tsx` era exactamente eso— y llevaba diez días demostrando que nadie
la usa. El problema no era dónde vivían los datos, era que publicar costaba cinco
pasos y un build.

---

## 10. Manual: publicar un aviso

### 10.1 Comandos

```bash
# Crear. Por defecto queda en BORRADOR: no es visible hasta publicarlo.
npm run status:aviso -- nuevo --titulo "Login con Google intermitente"   --cuerpo "Algunos usuarios no pueden entrar con Google. Estamos en ello."   --severidad major --componentes autenticacion

# ...o publicar de inmediato, para la prisa real de una incidencia:
npm run status:aviso -- nuevo --titulo "..." --cuerpo "..." --publicar

npm run status:aviso -- publicar   <slug>
npm run status:aviso -- actualizar <slug> --cuerpo "Causa identificada." --ciclo monitoring
npm run status:aviso -- resolver   <slug> --cuerpo "Corregido en la v1.5.1."
npm run status:aviso -- retirar    <slug>          # -> archived, deja de verse
npm run status:aviso -- componente autenticacion --estado degraded
npm run status:aviso -- listar
```

`--severidad`: `none | minor | major | critical` (por defecto `minor`).
`--ciclo`: `investigating | identified | monitoring` (`resolved` solo vía `resolver`).
`--estado` de componente: `operational | maintenance | degraded | partial_outage | major_outage`.

El slug se deriva del título con la fecha delante (`2026-09-04-login-con-google-…`)
salvo que se pase `--slug`.

### 10.2 Cosas que el sistema no te deja hacer

Son deliberadas; si te topas con una, no la rodees:

- **Crear un aviso ya resuelto.** Un aviso nace abierto y se cierra con `resolver`;
  así siempre queda constancia de que existió.
- **Marcar `resolved` sin fecha de resolución**, o poner fecha de resolución en un
  aviso abierto. Lo impide el CHECK `resolved_iff_timestamp` en la base, no el
  script: es un invariante, no una validación de formulario.
- **Reescribir el cuerpo de un aviso ya publicado.** `actualizar` añade una entrada
  al historial y deja intacto lo que se dijo antes. El archivo es lo que da
  credibilidad a la página.
- **Escribir desde el navegador.** No hay panel. Las tablas no tienen políticas de
  escritura y además se revocaron los privilegios a `anon`/`authenticated`.

### 10.3 Qué se construyó

| Pieza | Fichero |
|---|---|
| Migración (4 tablas, 3 enums, RLS, REVOKE) | `status_notices_schema` |
| Modelo y etiquetas | `src/domain/Status.ts` |
| Derivación del banner y orden | `src/usecases/GetStatusUseCase.ts` |
| Lectura desde el navegador | `src/lib/statusData.ts` |
| Render de servidor + JSON incrustado | `api/status.ts` |
| Página | `src/pages/Status.tsx` |
| Publicación (service role) | `scripts/status/publish-aviso.mjs` |
| Enrutado | `vercel.json` (rewrite) + `src/data/routes.json` (`prerender: false`) |

Esquema real en producción:

```
status_components         (slug, name, description, position, state)
status_notices            (slug, title, body, severity, lifecycle, status,
                           started_at, resolved_at)
status_notice_components  (notice_id, component_id)
status_notice_updates     (notice_id, body, lifecycle, created_at)
```

### 10.4 Verificaciones hechas contra producción

No son suposiciones; se ejecutaron:

| Comprobación | Resultado |
|---|---|
| `anon` solo ve los avisos `published` | ✅ el borrador devuelve `[]` |
| `anon` no ve un borrador ni pidiéndolo por slug | ✅ `[]` |
| `POST` a `status_notices` como `anon` | ✅ HTTP 401 |
| `DELETE` como `anon` | ✅ HTTP 401 |
| CHECK impide `resolved` sin `resolved_at` | ✅ rechazado por la base |
| Ciclo completo crear→publicar→actualizar→resolver | ✅ |
| Cuerpo con `</script><img onerror=…>` | ✅ escapado en HTML y en el JSON; 6 `<script>` abiertos y 6 cerrados |
| La función con Supabase caído | ✅ HTTP 200, «No podemos leer el estado», nunca «operativo» |
| Un solo `<title>` en el HTML servido | ✅ |
| El build ya no genera `dist/status/` | ✅ (si lo generara, el rewrite no se dispararía) |
| `/status` sigue en el sitemap | ✅ |
| Advisor de seguridad tras la migración | ✅ 0 hallazgos nuevos |

### 10.5 Deuda conocida

- Los tres avisos actuales son el **placeholder original**, sembrado tal cual por
  decisión explícita. Sus horas son inventadas (el original solo tenía fecha); el
  de mantenimiento muestra «12:30 a. m.». Para retirarlos:
  `npm run status:aviso -- retirar <slug>` por cada uno.
- `deriveOverall` está duplicada en `src/usecases/GetStatusUseCase.ts` y en
  `api/status.ts`. Es el patrón que ya usa `api/seo.ts` (la función no importa de
  `src/`), pero **si cambias una, cambia la otra**: si divergen, el HTML servido y
  lo que pinta React dejan de coincidir.
- El aviso de `ingest_runs` sin políticas (§5.2) sigue abierto; no lo toca este
  trabajo.

---

## 11. Referencias del propio repositorio

| Qué | Dónde |
|---|---|
| Página actual | `src/pages/Status.tsx` |
| Registro de rutas (fuente única) | `src/data/routes.json` |
| Plantilla de función + render SSR | `api/seo.ts` |
| Plantilla de lectura simple + caché | `api/sitemap.ts` |
| Cliente service role para escrituras | `scripts/seo/lib/supabase.mjs` |
| Cliente público para el navegador | `src/lib/programData.ts` |
| Reglas de datos y compuertas | `docs/seo-programatico.md` |
| Trampa del `createRoot` que borra el HTML de servidor | `src/main.tsx`, `docs/seo-programatico.md` §7 |
