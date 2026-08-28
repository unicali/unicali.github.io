# scripts/seo

Pipeline de SEO programático: de los planes de estudio oficiales de la UNSA a las
páginas publicadas en `/calculadora/[escuela]`.

**La documentación completa está en [`docs/seo-programatico.md`](../../docs/seo-programatico.md).**
Léela antes de modificar nada de aquí: varias decisiones que parecen arbitrarias
responden a fallos concretos que costaron datos incorrectos en producción.

## Qué hay en cada fichero

| Fichero | Responsabilidad |
|---|---|
| `lib/sisacad.mjs` | Cliente y parser del sistema académico público. **Fuente principal.** |
| `lib/parse-plan.mjs` | Parser de los PDF y `assertPlanIntegrity`. Segunda opinión. |
| `lib/electives.mjs` | Detección de asignaturas electivas por el marcador `(E)`. |
| `lib/slug.mjs` | Slugs de URL y capitalización de títulos en español. |
| `lib/supabase.mjs` | Cliente con service role para los scripts de ingesta. |
| `ingest-plans.mjs` | SISACAD → Supabase. Idempotente. |
| `generate-pages.mjs` | Contenido de `seo_pages` + índice para el cliente. |
| `publish-pages.mjs` | Compuertas de calidad y promoción a `published`. |
| `build-links.mjs` | Grafo de enlazado interno entre páginas publicadas. |
| `analyze-plans.mjs` | Análisis de créditos y variantes del marcador de electiva. |
| `compare-sources.mjs` | Contrasta la fuente HTML con la fuente PDF. |
| `verify-rendered.mjs` | Comprueba el DOM **después** de que React monte. |

## Secuencia habitual

```bash
npm run seo:ingest
npm run seo:pages
npm run seo:publish -- --apply
npm run seo:pages          # recoge en el índice lo recién publicado
npm run seo:links
npm run build
```

Requiere `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`; los scripts
se ejecutan con `node --env-file=.env.local` (los `npm run seo:*` ya lo incluyen).
