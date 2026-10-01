# Fichas públicas de materiales (`/d/<public_id>`)

Destino del botón "Compartir" de la Biblioteca en la app. El contrato completo vive en el
repo de la app: `unsap/docs/architecture/biblioteca-permalinks-2026-09.md`.

## Cómo funciona

1. `vercel.json` reescribe `/d/:pid` y `/d/:pid/:slug` → `api/material.ts`.
2. La función valida el formato (base58 × 10) y llama a la RPC `get_public_material`
   **del proyecto Supabase de la app** (`akxtzpcauoowumglbcdm`), no al de esta web.
3. Arma toda la vista: título, descripción, canónico con slug, OG y JSON-LD
   `LearningResource` + `BreadcrumbList`. La incrusta como `__MATERIAL_DATA__`.
4. `src/pages/MaterialPermalink.tsx` solo pinta esa vista. No consulta nada; si llega sin
   datos (navegación interna), recarga una vez para que la sirva la función.

| Caso | HTTP | Caché | Indexa |
|---|---|---|---|
| Activo | 200 | `s-maxage=3600, swr=86400` | sí |
| Retirado | 410 | `s-maxage=300` | no |
| Inexistente / malformado | 404 | `s-maxage=300` | no |
| Falla la base | 503 + `retry-after` | — | — |

## Reglas

- **Nunca** la service role aquí. Solo la clave publicable de la app (pública: va en el APK).
  Variables: `APP_SUPABASE_URL`, `APP_SUPABASE_PUBLISHABLE_KEY`, con default al valor público.
- La ficha nunca da acceso al PDF: se abre en la app, donde aplica la economía de tokens.
- `/d/` y `/.well-known/` están en `navigateFallbackDenylist` (`vite.config.ts`). Si no,
  el service worker sirve `index.html` sin datos a quien ya visitó el sitio.
- El redirect del apex a `www` excluye `/.well-known/`: Android no sigue redirects al
  verificar App Links.

## Pendiente

- OG dinámico por material.

## Hubs y sitemap (2026-10-01)

La biblioteca pública (`/biblioteca/<uni>/<escuela>/<curso>-<código>`) y los sitemaps
`biblioteca` y `materiales[-N]` están documentados en el repo de la app:
`unsap/docs/architecture/biblioteca-seo-hubs-2026-10.md`.

- `api/library.ts` es el render de los hubs y `src/pages/LibraryHub.tsx` lo pinta.
- `src/lib/libraryText.ts` es la única copia de los rótulos y del formato de nombres de
  curso. La importan tanto las funciones como el SPA.
- Indexable o no lo decide la base (`indexable`). La web nunca lo recalcula.
