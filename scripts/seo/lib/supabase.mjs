// Cliente de Supabase para los scripts de ingesta.
//
// Usa la service role key: la ingesta escribe en tablas cuyas políticas RLS solo
// permiten lectura pública. Esa clave NUNCA debe acabar en el bundle del cliente
// ni en una variable VITE_*, que Vite inlinea en el JavaScript público.
import { createClient } from '@supabase/supabase-js';

export function createServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY.\n' +
        'En local: ponlas en .env.local (que ya está en .gitignore) y ejecuta con --env-file=.env.local\n' +
        'En CI/Vercel: configúralas como variables de entorno del proyecto.',
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
