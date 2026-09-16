#!/usr/bin/env node
// Publica, actualiza y retira avisos de /status.
//
// Es la única vía de escritura. No hay panel web ni sesión de Supabase en el
// navegador a propósito: las tablas no tienen ninguna política de INSERT/UPDATE/
// DELETE y además se les revocaron esos privilegios a anon y authenticated, así
// que la superficie expuesta a internet es estrictamente de lectura.
//
// Uso:
//   npm run status:aviso -- nuevo --titulo "..." --cuerpo "..." [opciones]
//   npm run status:aviso -- actualizar <slug> --cuerpo "..." --ciclo monitoring
//   npm run status:aviso -- resolver <slug> [--cuerpo "..."]
//   npm run status:aviso -- publicar <slug>
//   npm run status:aviso -- retirar <slug>
//   npm run status:aviso -- componente <slug> --estado degraded
//   npm run status:aviso -- listar
//
// Por defecto `nuevo` crea el aviso en estado draft: se escribe con calma, se
// revisa, y solo entonces se publica. Con --publicar sale directo, para la prisa
// real de una incidencia.

import { createServiceClient } from '../seo/lib/supabase.mjs';

const SEVERITIES = ['none', 'minor', 'major', 'critical'];
const LIFECYCLES = ['investigating', 'identified', 'monitoring', 'resolved'];
const STATES = ['operational', 'maintenance', 'degraded', 'partial_outage', 'major_outage'];

const db = createServiceClient();

/** Convierte un título en slug con la fecha delante, que es como se ordenan solos. */
function slugify(title) {
  const body = title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${new Date().toISOString().slice(0, 10)}-${body}`;
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const name = arg.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        flags[name] = true;
      } else {
        flags[name] = next;
        i += 1;
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

function fail(message) {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

function requireOneOf(value, allowed, label) {
  if (!allowed.includes(value)) {
    fail(`${label} inválido: "${value}".\n    Valores permitidos: ${allowed.join(', ')}`);
  }
  return value;
}

async function findNotice(slug) {
  const { data, error } = await db
    .from('status_notices')
    .select('id, slug, title, lifecycle, status')
    .eq('slug', slug)
    .maybeSingle();
  if (error) fail(`consultando el aviso: ${error.message}`);
  if (!data) fail(`no existe ningún aviso con slug "${slug}". Prueba: listar`);
  return data;
}

// --- comandos ---------------------------------------------------------------

async function cmdNuevo(flags) {
  const title = flags.titulo;
  const body = flags.cuerpo;
  if (typeof title !== 'string' || !title.trim()) fail('falta --titulo "..."');
  if (typeof body !== 'string' || !body.trim()) fail('falta --cuerpo "..."');

  const severity = requireOneOf(flags.severidad ?? 'minor', SEVERITIES, '--severidad');
  const lifecycle = requireOneOf(flags.ciclo ?? 'investigating', LIFECYCLES, '--ciclo');
  if (lifecycle === 'resolved') {
    fail('un aviso no puede nacer resuelto. Créalo y luego usa: resolver <slug>');
  }

  const slug = typeof flags.slug === 'string' ? flags.slug : slugify(title);
  const status = flags.publicar ? 'published' : 'draft';

  const { error } = await db.from('status_notices').insert({
    slug,
    title: title.trim(),
    body: body.trim(),
    severity,
    lifecycle,
    status,
    started_at: flags.desde ?? new Date().toISOString(),
  });
  if (error) fail(`creando el aviso: ${error.message}`);

  if (typeof flags.componentes === 'string') {
    await linkComponents(slug, flags.componentes.split(',').map((s) => s.trim()));
  }

  console.log(`\n  ✓ Aviso creado: ${slug}  [${status}]`);
  if (status === 'draft') {
    console.log(`    Todavía NO es visible. Para publicarlo:`);
    console.log(`      npm run status:aviso -- publicar ${slug}\n`);
  } else {
    console.log(`    Visible en https://www.unicali.app/status en menos de 60 s.\n`);
  }
}

async function linkComponents(slug, slugs) {
  const notice = await findNotice(slug);
  const { data: components, error } = await db
    .from('status_components')
    .select('id, slug')
    .in('slug', slugs);
  if (error) fail(`consultando componentes: ${error.message}`);

  const found = new Set((components ?? []).map((c) => c.slug));
  const missing = slugs.filter((s) => !found.has(s));
  if (missing.length) fail(`estos componentes no existen: ${missing.join(', ')}`);

  const { error: linkError } = await db
    .from('status_notice_components')
    .upsert(
      (components ?? []).map((c) => ({ notice_id: notice.id, component_id: c.id })),
      { onConflict: 'notice_id,component_id' },
    );
  if (linkError) fail(`enlazando componentes: ${linkError.message}`);
}

async function cmdActualizar(slug, flags) {
  const body = flags.cuerpo;
  if (typeof body !== 'string' || !body.trim()) fail('falta --cuerpo "..."');
  const notice = await findNotice(slug);
  const lifecycle = requireOneOf(flags.ciclo ?? notice.lifecycle, LIFECYCLES, '--ciclo');
  if (lifecycle === 'resolved') fail('para cerrar un aviso usa: resolver <slug>');

  // La entrada se añade al historial; el cuerpo original NO se toca. El archivo
  // es lo que da credibilidad a la página: reescribir lo que se dijo antes la
  // destruye.
  const { error } = await db
    .from('status_notice_updates')
    .insert({ notice_id: notice.id, body: body.trim(), lifecycle });
  if (error) fail(`añadiendo la actualización: ${error.message}`);

  if (lifecycle !== notice.lifecycle) {
    const { error: updateError } = await db
      .from('status_notices')
      .update({ lifecycle })
      .eq('id', notice.id);
    if (updateError) fail(`moviendo el ciclo de vida: ${updateError.message}`);
  }

  console.log(`\n  ✓ Actualización añadida a ${slug}  [${lifecycle}]\n`);
}

async function cmdResolver(slug, flags) {
  const notice = await findNotice(slug);
  const resolvedAt = flags.cuando ?? new Date().toISOString();

  const { error } = await db
    .from('status_notices')
    .update({ lifecycle: 'resolved', resolved_at: resolvedAt })
    .eq('id', notice.id);
  if (error) fail(`resolviendo: ${error.message}`);

  const body = typeof flags.cuerpo === 'string' ? flags.cuerpo.trim() : 'Incidencia resuelta.';
  const { error: updateError } = await db
    .from('status_notice_updates')
    .insert({ notice_id: notice.id, body, lifecycle: 'resolved' });
  if (updateError) fail(`añadiendo la nota de cierre: ${updateError.message}`);

  console.log(`\n  ✓ ${slug} resuelto.\n`);
}

async function cmdEstado(slug, status) {
  const notice = await findNotice(slug);
  const { error } = await db.from('status_notices').update({ status }).eq('id', notice.id);
  if (error) fail(`cambiando el estado: ${error.message}`);
  console.log(`\n  ✓ ${slug} → ${status}\n`);
}

async function cmdComponente(slug, flags) {
  const state = requireOneOf(flags.estado, STATES, '--estado');
  const { data, error } = await db
    .from('status_components')
    .update({ state })
    .eq('slug', slug)
    .select('slug');
  if (error) fail(`actualizando el componente: ${error.message}`);
  if (!data?.length) fail(`no existe el componente "${slug}"`);
  console.log(`\n  ✓ Componente ${slug} → ${state}\n`);
}

async function cmdListar() {
  const [{ data: notices }, { data: components }] = await Promise.all([
    db
      .from('status_notices')
      .select('slug, title, severity, lifecycle, status, started_at')
      .order('started_at', { ascending: false }),
    db.from('status_components').select('slug, name, state').order('position'),
  ]);

  console.log('\n  COMPONENTES');
  for (const component of components ?? []) {
    const mark = component.state === 'operational' ? '·' : '!';
    console.log(`   ${mark} ${component.slug.padEnd(16)} ${component.state}`);
  }

  console.log('\n  AVISOS');
  for (const notice of notices ?? []) {
    const visible = notice.status === 'published' ? 'público ' : `${notice.status.padEnd(8)}`;
    const open = notice.lifecycle === 'resolved' ? ' ' : '!';
    console.log(
      `   ${open} [${visible}] ${notice.started_at.slice(0, 10)}  ${notice.lifecycle.padEnd(14)} ${notice.slug}`,
    );
  }
  console.log('');
}

function usage() {
  console.log(`
  Avisos de /status

    npm run status:aviso -- nuevo --titulo "..." --cuerpo "..."
        [--severidad none|minor|major|critical]   (por defecto: minor)
        [--ciclo investigating|identified|monitoring]
        [--componentes app,autenticacion]
        [--publicar]        publica de inmediato en vez de dejarlo en borrador
        [--slug mi-slug]    por defecto se deriva del título con la fecha delante

    npm run status:aviso -- actualizar <slug> --cuerpo "..." [--ciclo monitoring]
    npm run status:aviso -- resolver   <slug> [--cuerpo "..."]
    npm run status:aviso -- publicar   <slug>
    npm run status:aviso -- retirar    <slug>
    npm run status:aviso -- componente <slug> --estado degraded
    npm run status:aviso -- listar
`);
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const [command, target] = positional;

switch (command) {
  case 'nuevo':
    await cmdNuevo(flags);
    break;
  case 'actualizar':
    if (!target) fail('falta el slug del aviso');
    await cmdActualizar(target, flags);
    break;
  case 'resolver':
    if (!target) fail('falta el slug del aviso');
    await cmdResolver(target, flags);
    break;
  case 'publicar':
    if (!target) fail('falta el slug del aviso');
    await cmdEstado(target, 'published');
    break;
  case 'retirar':
    if (!target) fail('falta el slug del aviso');
    await cmdEstado(target, 'archived');
    break;
  case 'componente':
    if (!target) fail('falta el slug del componente');
    await cmdComponente(target, flags);
    break;
  case 'listar':
    await cmdListar();
    break;
  default:
    usage();
}
