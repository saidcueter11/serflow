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
const res = await fetch(`${REAL}/rest/v1/products?select=image_urls&is_active=eq.true&limit=30`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
})
const photos = (await res.json()).flatMap((p) => p.image_urls)
if (photos.length < 6) throw new Error(`Need 6 product photos for the seeded promos, got ${photos.length}`)

let promos = []
const proxy = http.createServer(async (req, out) => {
  if (req.url.startsWith('/rest/v1/promos')) {
    out.writeHead(200, { 'content-type': 'application/json' })
    out.end(JSON.stringify(promos))
    return
  }
  const headers = { ...req.headers }
  for (const k of ['host', 'connection', 'keep-alive']) delete headers[k]
  const r = await fetch(REAL + req.url, { method: req.method, headers })
  const body = Buffer.from(await r.arrayBuffer())
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
  await run(['build', '--outDir', s.outDir], { PUBLIC_SUPABASE_URL: proxyUrl })
}
proxy.close()

// Uno tras otro: cuando Playwright ve el último puerto, los anteriores ya responden.
for (const s of SCENARIOS) {
  spawn('npx', ['astro', 'preview', '--outDir', s.outDir, '--port', String(s.port)], { stdio: 'inherit' })
  while (!(await fetch(`http://localhost:${s.port}/`).then((r) => r.ok, () => false))) {
    await new Promise((ok) => setTimeout(ok, 300))
  }
}
