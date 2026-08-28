// Reconstruye el grafo de enlazado interno del clúster programático.
//
//   node --env-file=.env.local scripts/seo/build-links.mjs
//
// Tiene que ser un paso del pipeline y no un SQL suelto: el grafo depende de qué
// páginas están publicadas en ese momento, así que publicar una escuela nueva
// deja los enlaces desactualizados y esa escuela sin enlaces de salida.
//
// Las páginas huérfanas son la causa más común de que el SEO programático no
// llegue a indexarse: sin enlaces entrantes, Google las descubre solo por el
// sitemap y les asigna muy poca prioridad de rastreo.
import { createServiceClient } from './lib/supabase.mjs';

// Vecinas por orden alfabético. Suficiente para que el grafo sea conexo (cada
// página enlaza y es enlazada) sin convertir el pie en un muro de enlaces, que
// diluye el valor de cada uno.
const NEIGHBOURS = 6;

async function main() {
  const db = createServiceClient();

  const { data: pages, error } = await db
    .from('seo_pages')
    .select('id, path, title, programs ( name )')
    .eq('cluster', 'calculadora')
    .eq('status', 'published')
    .order('path');
  if (error) throw error;

  if (pages.length < 2) {
    console.log(`[links] solo ${pages.length} página(s) publicada(s): no hay grafo que construir`);
    return;
  }

  const links = [];
  for (const [index, page] of pages.entries()) {
    for (let step = 1; step <= Math.min(NEIGHBOURS, pages.length - 1); step += 1) {
      const target = pages[(index + step) % pages.length];
      links.push({
        from_page_id: page.id,
        to_page_id: target.id,
        // El anclaje es el nombre de la carrera, no "haz clic aquí": el texto del
        // enlace es una de las señales más directas de sobre qué va el destino.
        anchor: target.programs?.name ?? target.title,
      });
    }
  }

  // Se reemplaza el grafo entero: reconciliar altas y bajas cuando cambia el
  // conjunto de páginas publicadas es más frágil que rehacerlo.
  const { error: deleteError } = await db
    .from('seo_internal_links')
    .delete()
    .in(
      'from_page_id',
      pages.map((page) => page.id),
    );
  if (deleteError) throw deleteError;

  const { error: insertError } = await db.from('seo_internal_links').insert(links);
  if (insertError) throw insertError;

  const orphans = pages.filter((page) => !links.some((link) => link.to_page_id === page.id));
  console.log(`[links] ${links.length} enlaces entre ${pages.length} páginas publicadas`);
  if (orphans.length) {
    console.error(`[links] AVISO: ${orphans.length} página(s) sin enlaces entrantes:`);
    for (const orphan of orphans) console.error(`  ${orphan.path}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('[links] error:', err.message);
  process.exit(1);
});
