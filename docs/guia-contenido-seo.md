# Guía de contenido y SEO de UniCali

Cómo se escribe el texto de esta web: qué palabras se usan, cuáles no, y por qué.
Está escrita para cualquier persona —o agente de IA— que vaya a tocar un texto
del sitio y necesite hacerlo bien sin contexto previo.

**Origen:** en noviembre de 2026 se detectó que varias páginas de marca (Home,
Nosotros, Equipo, Versiones) estaban escritas con lenguaje inflado y metafórico
(«Arquitectura Académica Minimalista», «ecosistema de alto rendimiento»,
«Soberanía de Datos») que no dice qué hace la app, no lo busca nadie en Google y
suena a texto generado. Esta guía existe para que eso no vuelva a pasar.

---

## 1. La regla que ordena todo lo demás

> Cada frase del sitio debe responder, en palabras que un estudiante de la UNSA
> usaría al buscar en Google, a una de estas preguntas: ¿qué hace la app?,
> ¿qué gano yo?, ¿qué toco ahora?

Si una frase no responde ninguna, se borra o se reescribe. No hay excepciones
«porque suena profesional»: lo que suena profesional y no se entiende es
exactamente el problema.

Referencia viva de este tono: la portada de WhatsApp abre con «mensajería y
llamadas privadas, simples, confiables y gratis» y cada bloque es una frase de
beneficio concreto. Ningún «ecosistema», ninguna «arquitectura».

---

## 2. En qué estándares se apoya esta guía

No son gustos del equipo; son las guías públicas de quienes ordenan la web:

1. **Google — SEO Starter Guide.** Pensar en las palabras que un usuario
   buscaría para encontrar el contenido; quien no conoce el tema busca con
   palabras distintas (y más simples) que el experto. Nada de repetir palabras
   para rellenar: el *keyword stuffing* va contra las políticas de spam de
   Google y la metaetiqueta de palabras clave no se usa.
   https://developers.google.com/search/docs/fundamentals/seo-starter-guide
2. **Google — Contenido útil, confiable y pensado para las personas.** El
   título principal debe resumir el contenido de forma descriptiva y útil, sin
   exagerar; el contenido se crea primero para las personas, no para el
   buscador; y debe dejar una experiencia satisfactoria, sin afirmaciones que
   no se puedan sostener.
   https://developers.google.com/search/docs/fundamentals/creating-helpful-content
3. **Microsoft — Guía de estilo.** Lenguaje cotidiano: las palabras que la
   gente usa; oraciones cortas y concisas; tono informal y amable, como hablar
   con alguien cara a cara; centrarse en la tarea del usuario, no en la
   presentación técnica.
   https://learn.microsoft.com/es-es/contribute/content/style-quick-start
4. **Federal Plain Language Guidelines (plainlanguage.gov).** Escribir para la
   audiencia; preferir la palabra familiar a la rebuscada, la concreta a la
   abstracta, la corta a la larga; ser conciso; tono conversacional; voz
   activa; dirigirse al lector con «tú».
   https://www.plainlanguage.gov/guidelines/
5. **W3C WAI — Escritura clara y simple (accesibilidad cognitiva).** Palabras
   cotidianas que la gente conoce, evitar vocabulario abstracto y poco
   familiar, una idea por oración, oraciones cortas, encabezados claros que
   describan su sección.
   https://www.w3.org/WAI/GL/task-forces/coga/wiki/Clear_and_simple_writing

Y la guía interna que ya existía: `docs/seo-programatico.md` (la regla de no
publicar cifras que no se puedan defender aplica también a las palabras:
ninguna afirmación sin respaldo).

---

## 3. Las reglas de escritura

1. **Beneficio antes que descripción.** «Calcula qué nota necesitas en tu
   final» sí; «Motor Predictivo» no. Primero lo que el estudiante gana,
   después —si hace falta— cómo se llama por dentro.
2. **Las palabras del estudiante, no las del equipo.** El vocabulario válido
   es el de la sección 4: lo que se teclea en Google y se dice en el pasillo.
   La jerga interna del proyecto no sale a la web.
3. **Oraciones cortas.** Una idea por oración; como referencia, menos de
   20 palabras. Si una frase necesita dos comas y un «orientado a», se parte.
4. **Voz activa y segunda persona.** «Tus notas se guardan en tu celular»,
   no «la persistencia local garantiza la autonomía estudiantil».
5. **Títulos que resumen, no que decoran.** El `<title>` y el H1 dicen qué
   hay en la página con sus palabras de búsqueda: tema + UNSA cuando aplique.
   «UniCali | Arquitectura Académica Minimalista» no posiciona ni informa;
   «UniCali | Notas, horarios y comunidad para estudiantes de la UNSA» sí.
6. **Sin superlativos sin prueba.** «La herramienta definitiva», «privacidad
   total», «alto rendimiento», «nivel profesional» solo si hay un dato que lo
   sostenga en la misma página. Si no, se escribe el hecho: qué hace y ya.
7. **Sin metáforas de marca.** Nada de campos de batalla, genomas, células,
   cicatrices, génesis ni ecosistemas para hablar de una app de notas. La
   metáfora no se busca en Google, no se traduce y no la entiende un lector
   que llega por primera vez.
8. **Español completo en la interfaz.** Etiquetas, estados y botones en
   español: «Programa beta», no «Beta Program»; «Estado: Activo», no
   «STATUS: ACTIVE_CELL». Los nombres propios y las siglas reales (CUI, TIF,
   RSU, UNSA) se quedan.
9. **Sin cifras ni testimonios inventados.** Igual que en
   `docs/seo-programatico.md`: una reseña citada se reproduce tal cual o no
   se publica; un número va con su fuente o no va.
10. **Cada página, un tema y una intención de búsqueda.** Si dos textos
    compiten por la misma búsqueda, se fusionan; si una frase sirve para
    cualquier app del mundo, no sirve para esta web.

### Excepciones (donde NO se simplifica)

- **Páginas legales** (`/privacidad`, `/terminos`, `/eliminar-cuenta`): manda
  la precisión jurídica. Se pueden ordenar y hacer legibles, pero ningún
  término legal se «traduce» a lenguaje llano si eso cambia su alcance.
- **Citas y reseñas reales:** se reproducen tal cual; solo se corrige el
  texto que las rodea (títulos, descripciones, metadatos).
- **Texto técnico interno** (código, comentarios, documentos de `docs/`):
  ahí «arquitectura» y «persistencia» son palabras correctas. La prohibición
  es para el texto que lee el visitante.

---

## 4. Vocabulario que sí: el que busca el estudiante

Estas son las palabras que traen visitas y que el sitio debe usar en títulos,
encabezados, descripciones y textos de enlace, de forma natural (sin repetir
por rellenar):

| Intención de búsqueda | Palabras a usar |
| :--- | :--- |
| Notas | notas, promedio ponderado, calculadora de notas, qué nota necesito, nota mínima, sustitutorio, examen final |
| Carrera | calculadora por carrera, plan de estudios, malla curricular, créditos, prerrequisitos, [nombre de la escuela], UNSA |
| Horario | horario, armar mi horario, docente, sección |
| Materiales | biblioteca de exámenes, exámenes pasados, apuntes, materiales, [curso] |
| Docentes | reseñas de docentes, opiniones de docentes |
| Descarga | descargar UniCali, app gratis, Google Play, Android |
| Trámites y guías | CUI, código de estudiante, TIF, RSU, correo institucional |
| Comunidad | muro, publicaciones, comunidad de estudiantes |

Reglas de uso: la palabra de búsqueda va en el título, el H1 o el primer
párrafo de su página; cada página apunta a una intención; y se escribe para
la persona primero — Google ignora el relleno y sanciona la repetición
forzada (ver fuente 1).

---

## 5. Vocabulario que no: lista prohibida en texto público

Detectadas en la auditoría de noviembre de 2026 (entre paréntesis, el
reemplazo aplicado). Antes de publicar, cualquier aparición de esta lista en
`src/` fuera de las excepciones de la sección 3 es un error:

| Prohibido | Usar en su lugar |
| :--- | :--- |
| Arquitectura Académica Minimalista | Notas, horarios y comunidad para estudiantes de la UNSA |
| ecosistema (académico / de alto rendimiento) | app; «todo en una sola app» |
| alto rendimiento | rápido (solo si se midió); si no, nada |
| la herramienta definitiva | la app de notas de la UNSA (el hecho, sin corona) |
| privacidad total | tus datos se guardan en tu celular (y lo que diga `/privacidad`) |
| Soberanía de Datos | Tus datos en tu celular |
| Motor Predictivo | ¿Qué nota necesitas? |
| persistencia local | se guarda en tu celular / funciona sin conexión |
| autonomía estudiantil | (borrar; decir qué puede hacer el estudiante) |
| infraestructura independiente / potenciar la vida académica | app gratuita hecha por estudiantes de la UNSA |
| Interactivo / Arquitectura Visual (como etiqueta) | la acción real: «Desliza para ver la app» |
| Beta Program, ACTIVE_CELL y códigos en inglés | Programa beta, Estado: Activo |
| asimetría de información, contradicción sistémica | el problema concreto, en una frase |
| El Genoma / La Génesis / Manifiesto (como títulos) | Equipo / Nosotros / Cómo nació UniCali |
| célula, campo de batalla, cicatriz, resistencia técnica, obsesión | equipo, trabajo, lo que aprendimos |
| confianza cero, nivel profesional (sin explicar) | la medida concreta: «verificación extra al iniciar sesión» |
| optimizar tu rendimiento académico | mejorar tus notas / calcular tu promedio |
| gestión de notas, visualización de calificaciones | tus notas, mira tus notas |

La lista crece: si al revisar un texto aparece una palabra que un estudiante
no diría en voz alta, entra aquí con su reemplazo en el mismo commit.

---

## 6. El error que no se repite

El fallo de 2026 no fue una palabra suelta; fue un patrón completo, típico de
texto generado sin revisión. Queda registrado para reconocerlo a la primera:

1. **Inventar lenguaje de marca metafórico** para parecer profundo
   (génesis, genoma, manifiesto, asimetría) en vez de describir el producto.
2. **Nombrar funciones por su implementación** («Motor Predictivo»,
   «Soberanía de Datos», «persistencia») en vez de por su beneficio.
3. **Afirmar sin respaldo**: superlativos y absolutos («total», «definitiva»,
   «alto rendimiento») sin un dato en la página que los sostenga — y en el
   caso de «privacidad total», contradiciendo la propia política de
   privacidad.
4. **Mezclar registros**: inglés decorativo y códigos internos
   (`ACTIVE_CELL`) en una interfaz en español para estudiantes.
5. **Escribir para impresionar al equipo**, no para el estudiante que llega
   desde Google con una pregunta concreta.

Cualquiera de los cinco, en un PR, es motivo de devolución.

---

## 7. Lista de verificación antes de publicar un texto

- [ ] ¿El título y el H1 dicen qué hay, con palabras de la sección 4?
- [ ] ¿La primera frase responde qué hace / qué gano / qué toco?
- [ ] ¿Ninguna palabra de la lista prohibida (sección 5)?
- [ ] ¿Ningún superlativo ni cifra sin respaldo en la misma página?
- [ ] ¿Oraciones cortas, voz activa, «tú»?
- [ ] ¿Todo en español salvo nombres propios y siglas reales?
- [ ] ¿Lo entendería en una lectura un estudiante de primer ciclo?
- [ ] Si cambiaste el `<title>` de `index.html`: actualiza también la
  constante `STATIC_FALLBACK_TITLE` de `scripts/prerender.mjs` (deben
  coincidir exacto, y el título de respaldo debe ser distinto del título
  Helmet de la home). Si no calzan, el prerender deja 2 títulos —o 0— y el
  build completo falla en Vercel y en GitHub Pages. Verifica con el build
  completo (`npm run build`), no solo con `tsc`.

Comprobación rápida de la lista prohibida sobre el código:

```bash
grep -rniE "ecosistema|soberanía|alto rendimiento|definitiv|génesis|genoma|asimetría|sistémic|minimalista|persistencia local|autonomía estudiantil|ACTIVE_CELL|confianza cero" src/ index.html
```

(Si salta una coincidencia legítima —una cita textual o un término legal— se
deja constancia en el PR de por qué es una excepción de la sección 3.)
