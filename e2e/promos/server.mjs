// E2E de promos con datos sembrados sin escribir en la base (PRI-131): un proxy local de Supabase reenvía todo a la
// base real menos /rest/v1/promos, que responde con el escenario. Se construye el sitio una vez por escenario
// (0, 1 y 3 promos) y se sirve cada build en su puerto. Lo arranca Playwright (webServer en playwright.config.ts).
import 'dotenv/config'
import { spawn } from 'node:child_process'
import http from 'node:http'
import { SCENARIOS } from './scenarios.mjs'

const REAL = process.env.PUBLIC_SUPABASE_URL
const KEY = process.env.PUBLIC_SUPABASE_ANON_KEY
if (!REAL || !KEY) throw new Error('Missing PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY')

// Fotos de productos reales: así las promos sembradas pasan por la misma optimización de imágenes que en prod.
// Sin el producto "prueba": su foto tiene datos personales y el repo es público (capturas de PR, PRI-159).
const res = await fetch(`${REAL}/rest/v1/products?select=id,image_urls&is_active=eq.true&slug=neq.prueba&order=sort_order,id&limit=30`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
})
const reales = await res.json()
const photos = reales.flatMap((p) => p.image_urls)
if (photos.length < 6) throw new Error(`Need 6 product photos for the seeded promos, got ${photos.length}`)
// PRI-123: productos reales con foto, para prenderlos en "Disponible ahora" sin escribir en la base.
const conFoto = reales.filter((p) => p.image_urls.length).map((p) => p.id)

let promos = []
let categories = []
// PRI-150: filas sembradas de las tablas del admin. Sin sembrar, van a la base real: vacías, o sin tabla antes de la migración.
let medios = {}
let disponibles = []
const proxy = http.createServer(async (req, out) => {
  const tabla = req.url.split('?')[0].replace('/rest/v1/', '')
  // PRI-123: la consulta de "Disponible ahora" (available_now=eq.true) nunca va a la base: lo que prendió el cliente
  // no debe mover el E2E, y antes de la migración la columna no existe. Sin sembrar, no hay nada disponible.
  const esDisponibles = tabla === 'products' && new URL(req.url, 'http://x').searchParams.get('available_now') === 'eq.true'
  const sembrado = esDisponibles ? disponibles : tabla === 'promos' ? promos : medios[tabla]
  if (sembrado) {
    // Como la RLS: una fila sembrada con is_active false no sale (PRI-427, un color oculto en el admin).
    const activas = req.url.includes('is_active=eq.true') ? sembrado.filter((r) => r.is_active !== false) : sembrado
    out.writeHead(200, { 'content-type': 'application/json' })
    out.end(JSON.stringify(activas))
    return
  }
  const headers = { ...req.headers }
  for (const k of ['host', 'connection', 'keep-alive']) delete headers[k]
  const r = await fetch(REAL + req.url, { method: req.method, headers })
  let body = Buffer.from(await r.arrayBuffer())
  // PRI-130: categorías sembradas (p. ej. una sin fotos) al final de la lista de categorías.
  if (categories.length && req.url.startsWith('/rest/v1/categories') && r.ok) {
    const rows = JSON.parse(body.toString())
    if (Array.isArray(rows)) body = Buffer.from(JSON.stringify([...rows, ...categories]))
  }
  const h = Object.fromEntries(r.headers)
  delete h['content-encoding']
  delete h['content-length']
  delete h['transfer-encoding']
  out.writeHead(r.status, h)
  out.end(body)
})
await new Promise((ok) => proxy.listen(0, '127.0.0.1', ok))
const proxyUrl = `http://127.0.0.1:${proxy.address().port}`

const run = (args, env = {}) =>
  new Promise((ok, fail) =>
    spawn('npx', ['astro', ...args], { stdio: 'inherit', env: { ...process.env, ...env } }).on('exit', (code) =>
      code === 0 ? ok() : fail(new Error(`astro ${args.join(' ')} exited ${code}`)),
    ),
  )

for (const s of SCENARIOS) {
  promos = s.promos(photos, new Date())
  categories = s.categories ?? []
  medios = s.medios?.(photos, REAL) ?? {}
  disponibles = (s.disponibles?.(conFoto) ?? []).map((id) => ({ id }))
  // Las filas se leen por el proxy, pero las fotos siguen en el host real: el único del que el build puede bajarlas (PRI-423).
  await run(['build', '--outDir', s.outDir], { PUBLIC_SUPABASE_URL: proxyUrl, PUBLIC_SUPABASE_FOTOS_URL: REAL })
}
proxy.close()

// Uno tras otro: cuando Playwright ve el último puerto, los anteriores ya responden. Desde astro 7 hay un solo preview
// por proyecto (el de 4231); --ignore-lock deja correr estos a su lado.
for (const s of SCENARIOS) {
  spawn('npx', ['astro', 'preview', '--ignore-lock', '--outDir', s.outDir, '--port', String(s.port)], { stdio: 'inherit' })
  while (!(await fetch(`http://localhost:${s.port}/`).then((r) => r.ok, () => false))) {
    await new Promise((ok) => setTimeout(ok, 300))
  }
}
