import { existsSync, readFileSync } from 'node:fs'
import http from 'node:http'
import type { AddressInfo } from 'node:net'

// PRI-286, PRI-525: `astro preview` no lee _redirects. Este servidor mínimo aplica <dist>/_redirects como Netlify: la
// primera regla que calza, sin importar la "/" final, y nunca donde hay un archivo. Devuelve el origen y cómo cerrarlo.
export function reglas(dist: string, path: string): { status: number; location?: string } {
  if (existsSync(`${dist}${path.replace(/\/$/, '')}/index.html`)) return { status: 200 }
  for (const line of readFileSync(`${dist}/_redirects`, 'utf8').split('\n')) {
    const [from, to, status] = line.trim().split(/\s+/)
    if (!from || from.startsWith('#')) continue
    const names: string[] = []
    const re = new RegExp(`^${from.replace(/:(\w+)/g, (_, n) => (names.push(n), '([^/]+)'))}/?$`)
    const m = path.match(re)
    if (m) return { status: Number(status), location: names.reduce((t, n, i) => t.replace(`:${n}`, m[i + 1]), to) }
  }
  return { status: 404 }
}

export async function netlify(dist: string) {
  const server = http.createServer((req, res) => {
    const r = reglas(dist, new URL(req.url!, 'http://x').pathname)
    res.writeHead(r.status, r.location ? { location: r.location } : {}).end()
  })
  await new Promise<void>((ok) => server.listen(0, '127.0.0.1', ok))
  return { origin: `http://127.0.0.1:${(server.address() as AddressInfo).port}`, close: () => server.close() }
}
