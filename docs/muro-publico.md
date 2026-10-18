# Muro público (`/p/<id>`, `/muro/...`)

Publicaciones del Muro de la app, públicas e indexables. El contrato completo vive en el repo de la
app: `unsap/docs/architecture/muro-publico-2026-10.md`.

## Rutas

| Ruta | Función | Notas |
|---|---|---|
| `/p/:pid` | `api/post.ts` | 200 / 404 (no existe o no es pública) / 410 (borrada) / 503 (falla la base) |
| `/muro` | `api/wall.ts` | 308 → `/muro/unsa` mientras haya una sola universidad |
| `/muro/:uni` | `api/wall.ts` | hub de la universidad (agrega sus escuelas) |
| `/muro/:uni/:community` | `api/wall.ts` | 404 hasta que la escuela tenga publicaciones |
| `?antes=<public_id>` | `api/wall.ts` | página siguiente por keyset; `noindex, follow` |
| `sitemap-muro.xml`, `sitemap-posts-AAAA-MM[-N].xml` | `api/sitemap.ts` | buckets mensuales, porciones de ≤ 5.000 |

## Reglas

- **Datos:** RPCs anónimas del proyecto Supabase de la **app** (`get_public_post`,
  `get_public_wall_community`, `list_public_wall_hubs`, `list_public_post_sitemap*`). Solo la clave
  publicable, nunca la service role.
- **Privacidad:** nunca uuid, `avatar_url` (lleva el uuid), carrera, lugar ni comentarios. El autor
  de lo anónimo es «Anónimo». El avatar se pinta con la inicial.
- **Indexabilidad:** la decide la base (`indexable`, `hub_indexable`); la web nunca la recalcula.
- **Construcción de la vista:** `src/lib/wallView.ts`, compartido por las dos funciones.
  `WallPost.tsx` y `WallHub.tsx` solo pintan los datos incrustados (`useServerRendered`).
- `/p/` y `/muro` están en el `navigateFallbackDenylist` del service worker.
