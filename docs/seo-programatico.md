# SEO programático de UniCali

Guía para retomar o ampliar este sistema. Está escrita para alguien que llega sin
contexto y necesita cambiar algo sin romper datos que la gente usa para planificar
su carrera.

**Estado actual:** 59 páginas publicadas en `/calculadora/[escuela]`, generadas
desde los planes de estudio oficiales de la UNSA. 48 escuelas de pregrado, 4.520
asignaturas, 2.610 prerrequisitos, 18 facultades.

---

## 1. La regla que ordena todo lo demás

> Cualquier cifra que salga en una página la va a usar un estudiante para tomar
> decisiones sobre su carrera. Es preferible no publicar una página a publicar un
> número que no se puede defender.

De ahí salen tres consecuencias que aparecen por todo el código:

- Los datos vienen de fuentes oficiales, no de un modelo de lenguaje. El texto
  generado sirve de encuadre; la sustancia son créditos, prerrequisitos y
  estructura del plan, todos verificables contra la fuente que se cita en la página.
- Todo se valida contra información redundante antes de escribir en la base.
- Nada se publica solo: el flujo es `draft → review → published` con compuertas.

Esto además es lo que mantiene el sitio fuera de la política de *scaled content
abuse* de Google: 59 páginas casi idénticas en estructura solo se sostienen si
cada una aporta datos propios y una herramienta que funciona.

---

## 2. De dónde salen los datos

### 2.1 SISACAD — la fuente buena

El sistema académico público de la UNSA. **Es la fuente preferida.** HTTP plano;
el host rechaza el puerto 443, así que `WebFetch` y cualquier cliente que fuerce
HTTPS fallan. Desde Node, `fetch` funciona sin más.

```
http://extranet.unsa.edu.pe/sisacad/escuela/index.php3
```
Directorio oficial: facultad → código de escuela (`depe`) → nombre. **Con esto no
hace falta adivinar códigos.** Los `href` de la página los rellena JavaScript, así
que el código se extrae del `onclick` (`escuela(401,...)`), no del enlace.

```
http://extranet.unsa.edu.pe/sisacad/escuela/plan_estudios_datos.php3?codi_depe=470
http://extranet.unsa.edu.pe/sisacad/escuela/plan_estudios_datos.php3?codi_depe=470&cplan=2017
```
Plan de estudios completo en tablas HTML. Sin `cplan` devuelve el vigente; el
`<select name=cplan>` de la respuesta lista los años disponibles (normalmente el
actual y uno histórico).

Cliente y parser: `scripts/seo/lib/sisacad.mjs`.

### 2.2 PDF — la fuente de respaldo

```
http://extranet.unsa.edu.pe/tmp/plan_{depe}_{año}.pdf
```
El mismo plan generado como PDF. Parser posicional en
`scripts/seo/lib/parse-plan.mjs`. **Ya no alimenta la ingesta**, pero se mantiene
por dos razones: `assertPlanIntegrity` vive ahí, y `compare-sources.mjs` lo usa
como segunda opinión independiente.

### 2.3 Por qué se cambió de PDF a HTML

| | PDF | HTML (SISACAD) |
|---|---|---|
| Columnas | fronteras por coordenada X, frágiles | celdas `<td>` explícitas |
| Prerrequisitos | 5 columnas (trunca) | 8 columnas |
| Acentos | **pierde la distinción Á/Í** | correctos |
| Descubrimiento | barrer códigos por fuerza bruta | directorio oficial |
| Planes históricos | no | sí, vía `cplan` |

El problema de los acentos era grave: el extractor de PDF colapsa `Á` e `Í` en el
mismo carácter (los bytes `0x81` y `0x8D` no existen en CP1252), lo que obligaba a
mantener a mano una tabla de correcciones para nombres como «FÍSICO MATEMÁTICA».
Con HTML esa tabla desapareció.

**Validación del cambio:** `compare-sources.mjs` contrastó las 46 escuelas que
existían en ambas fuentes. Códigos, créditos y ubicación de cada asignatura:
idénticos en las 46. El cambio de fuente no movió ni un número.

**Lo que el cambio además destapó:** el directorio oficial tiene 48 escuelas, dos
más de las que encontró la fuerza bruta. Una era **Medicina**, que se escapaba
porque su plan es de 2026 y la búsqueda estaba fijada en `plan_{depe}_2025.pdf`.

---

## 3. La codificación (léelo antes de tocar el parser)

La respuesta de `plan_estudios_datos.php3` **mezcla dos codificaciones**:

- Nombres de asignatura: UTF-8 (`Í` = `C3 8D`)
- `<h2>` con el nombre de la escuela: Latin-1 (`Í` = `CD`)

Decodificar el documento entero de una sola forma rompe la mitad de los campos,
se elija la que se elija. La solución en `sisacad.mjs`: leer el documento como
`latin1` —que es una correspondencia byte a byte sin pérdida— y reinterpretar
cada campo como UTF-8 solo si el resultado no contiene `U+FFFD`:

```js
function decodeField(value) {
  const asUtf8 = Buffer.from(value, 'latin1').toString('utf8');
  return asUtf8.includes(REPLACEMENT_CHAR) ? value : asUtf8;
}
```

Las cabeceras de sección van con las letras separadas y con entidades HTML
(`P R I M E R&nbsp;&nbsp;&nbsp;A &Ntilde; O`), así que se comparan tras quitar
acentos y todo lo que no sea una letra (`headerKey`).

---

## 4. Los créditos: la parte que más fácil se hace mal

### 4.1 Tres cifras distintas, solo una publicable

Los planes publican **toda la oferta electiva**, no lo que cursa un estudiante.
En Artes-Música son 200 electivas de 259 asignaturas: el plan enumera el catálogo
completo de instrumentos y cada estudiante elige uno. Sumarlo todo da **974
créditos** frente a un recorrido real de **174**.

`programs` guarda las tres:

| Columna | Qué es | ¿Se muestra? |
|---|---|---|
| `required_credits` | créditos de asignaturas obligatorias | **Sí. Es la única honesta.** |
| `coded_credits` | todo lo codificado, con la oferta electiva entera | no |
| `elective_credits` | solo la oferta electiva | como contexto |

Medido sobre las 48 escuelas, `required_credits` cae entre 167 y 286 (Medicina,
que dura 7 años). `coded_credits` llega a 974.

### 4.2 Cómo se detecta una electiva

La UNSA las marca con `(E)` al final del nombre. Hay cuatro variantes de espaciado
más una con punto: `(E)`, `( E )`, `( E)`, `(E )`, `(E.)`.
Patrón en `scripts/seo/lib/electives.mjs`.

```bash
node scripts/seo/analyze-plans.mjs --markers
```
cataloga las variantes presentes y **lista las que el patrón no captura**. Si
tocas ese regex, ejecútalo.

### 4.3 Asignaturas anuales

Medicina tiene asignaturas que duran el año entero. Se codifican con **semestre
`0`**, y la tabla las coloca bajo la cabecera de un semestre cualquiera. El
código manda; la cabecera, ahí, no significa nada. Son 22 asignaturas.

En la interfaz se etiquetan «asignaturas anuales», nunca como un semestre
concreto.

### 4.4 Lo que deliberadamente NO se publica

**Los pesos de evaluación de cada asignatura.** Viven en el sílabo, cambian por
docente y por semestre, y no existe fuente pública fiable. Publicar pesos
inventados o desfasados sería el peor daño posible a la credibilidad del dominio.

Lo que sí es oficial son los créditos, que son exactamente el peso del promedio
ponderado del semestre. Por eso la calculadora funciona con créditos y el
simulador por unidades pide al estudiante los pesos de su propio sílabo.

---

## 5. Validación

### 5.1 El código de asignatura se valida a sí mismo

Un código de 7 dígitos codifica su ubicación:

```
2 5 1 1 1 0 1
│ │ │ │ │ └─┴─ correlativo
│ │ │ │ └───── semestre (0 = anual)
│ │ │ └─────── año
│ │ └───────── especialidad (0 si la escuela tiene un solo plan)
└─┴─────────── prefijo de plan
```

`assertPlanIntegrity` contrasta eso contra el año y semestre que dicen las
cabeceras de sección, **fila a fila**. Verificado sobre las 46 escuelas del PDF:
4.447 filas, 0 discrepancias. Es la comprobación fuerte del sistema; no la
debilites.

El bloque «Resumen de Creditos» del PDF **no** sirve como checksum universal: la
copia que genera extranet al vuelo no lo trae, solo las alojadas en las webs de
facultad. Se aprovecha cuando está.

### 5.2 Compuertas de publicación

`publish-pages.mjs` bloquea una página si:

- tiene menos de 6 asignaturas obligatorias
- cita menos de 2 fuentes
- los créditos por año caen fuera de 28–52 (**normalizado por año**: un rango
  absoluto habría bloqueado Medicina por durar 7 años, no por estar mal)
- los créditos de las asignaturas no cuadran con `required_credits`
- el título o el H1 se repiten con otra página
- falta el descargo de no afiliación o el FAQ

Regenerar contenido de una página **ya publicada** la devuelve a `review` si su
hash cambia. Publicar no es un estado del que se salga sin querer.

---

## 6. Herramientas

| Comando | Para qué |
|---|---|
| `npm run seo:ingest` | SISACAD → Supabase. Idempotente. Acepta códigos: `-- 470 446` |
| `npm run seo:pages` | Genera el contenido de `seo_pages` y el índice del cliente |
| `npm run seo:publish` | Simulación de las compuertas. `-- --apply` para publicar |
| `npm run seo:links` | Reconstruye el grafo de enlazado interno |
| `npm run seo:analyze` | Desglose de créditos de todos los planes cacheados |
| `node scripts/seo/analyze-plans.mjs --markers` | Variantes del marcador de electiva |
| `node scripts/seo/analyze-plans.mjs --detail 471` | Una escuela, carga por semestre |
| `node scripts/seo/compare-sources.mjs` | HTML contra PDF, escuela por escuela |
| `node scripts/seo/verify-rendered.mjs <url>` | El DOM **después** de que React monte |

`DRY_RUN=1` en la ingesta para no escribir nada.

### Secuencia completa

```bash
npm run seo:ingest
npm run seo:pages
npm run seo:publish -- --apply
npm run seo:pages          # regenera el índice con lo recién publicado
npm run seo:links
npm run build
vercel deploy --prod
```

`seo:pages` se ejecuta dos veces a propósito: la primera crea el contenido, la
segunda recoge en el índice del cliente lo que acaba de publicarse.

---

## 7. Render

`/calculadora/*` lo sirve `api/seo.ts`, una función de Vercel, no el build. El
coste de build no crece con el número de páginas y publicar contenido no exige
redesplegar. Cache: `s-maxage=86400, stale-while-revalidate=604800`.

Tres cosas que cuestan tiempo si no se saben:

1. **La firma es Node** (`request`, `response`), no `Request`/`Response` del
   estándar web. `request.url` llega relativa y `new URL(request.url)` lanza
   `ERR_INVALID_URL`. El slug viene en `request.query.escuela`.

2. **`api/_shell.json`** es el `dist/index.html` congelado, que produce
   `scripts/generate-shell.mjs`. Ese script **debe** correr después de
   `vite build` y **antes** de `scripts/prerender.mjs`, porque el prerender
   sobrescribe `dist/index.html` con la cabecera de la home. El generador lanza
   un error si detecta `data-prerendered`, precisamente para que ese fallo no
   pase inadvertido y acabe poniendo el canonical de la home en 59 páginas.

3. **Solo la clave publicable** llega a este runtime. Lo que protege los datos es
   RLS. La service role key no debe existir como variable de entorno en Vercel.

### La trampa del render que cuesta rankings

El cliente monta con `createRoot`, que **vacía `#root`**. Cualquier cosa que
exista solo en el HTML del servidor desaparece en cuanto arranca el JavaScript — y
Googlebot renderiza JavaScript, así que tampoco la ve. Un `curl` satisfecho y un
ranking que nunca llega.

Pasó dos veces: con el FAQ, las migas y los enlaces internos; y con el JSON-LD de
página, que se inyecta marcado como `data-prerendered` y `src/main.tsx` lo borra
antes de montar.

**Todo lo que importe para SEO tiene que existir en el HTML del servidor Y en el
árbol de React.** `verify-rendered.mjs` existe para comprobar exactamente eso.
Ejecútalo contra cualquier página que toques.

---

## 8. Cómo añadir cosas

### Otra universidad

El esquema es multi-universidad desde el primer día. `universities` guarda escala
de notas y nota aprobatoria porque no son universales.

1. Inserta la fila en `universities`.
2. Escribe un cliente equivalente a `sisacad.mjs` para su fuente.
3. Reutiliza `assertPlanIntegrity` si sus códigos codifican la ubicación; si no,
   escribe la validación redundante que corresponda. **No la omitas.**
4. El resto del pipeline (páginas, compuertas, enlaces, render) no cambia.

### Otro clúster de contenido

`seo_pages.cluster` ya separa clústeres. Para uno nuevo, por ejemplo guías o
trámites:

1. Un generador equivalente a `generate-pages.mjs` que escriba con su `cluster`.
2. Compuertas propias en `publish-pages.mjs` — las actuales son específicas de
   currículos.
3. Una ruta en `vercel.json` hacia una función de render, o rutas estáticas en
   `src/data/routes.json` si el volumen es bajo.
4. `build-links.mjs` enlaza dentro de un clúster; para enlazar entre clústeres
   hay que ampliarlo.

### Una escuela nueva en la UNSA

Nada que hacer: sale del directorio de SISACAD en la siguiente ingesta.

---

## 9. Invariantes

Romper cualquiera de estos publica datos falsos o pierde posiciones:

- `required_credits` es lo que se muestra. `coded_credits` no se muestra nunca.
- La validación código↔cabecera se ejecuta antes de escribir en la base.
- Ninguna página se publica sin pasar las compuertas.
- Todo contenido relevante para SEO existe en el HTML del servidor y en React.
- Cada página cita sus fuentes y lleva el descargo de no afiliación a la UNSA.
- `generate-shell.mjs` corre entre `vite build` y `prerender.mjs`.
- Ninguna página publicada queda sin enlaces entrantes.
- La service role key no llega al bundle del cliente ni al runtime de la función.

---

## 10. Legal y privacidad

Se publican datos **ya públicos** en dominios de la UNSA, derivados y
estructurados, citando y enlazando la fuente. No se republican los PDF completos.

Nunca se publica nada procedente de sistemas autenticados (DUTIC, SISACAD con
sesión) ni dato personal alguno de estudiantes o docentes.

Cada página declara que UniCali es un proyecto independiente sin afiliación con la
universidad. Eso protege legalmente y evita que la página se lea como oficial.
