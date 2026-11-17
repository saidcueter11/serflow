import { existsSync, readFileSync } from 'node:fs'
import http from 'node:http'
import type { AddressInfo } from 'node:net'

// PRI-286, PRI-525: `astro preview` no lee _redirects. Este servidor mínimo aplica <dist>/_redirects como Netlify: la
// primera regla que calza, sin importar la "/" final, y nunca donde hay un archivo salvo que sea forzada (301!).
// PRI-532: una regla con host (https://<host>/...) solo calza ese host exacto, y /* pasa el resto a :splat. Devuelve el
// origen y cómo cerrarlo; el host es el del encabezado Host de cada pedido.
export function reglas(dist: string, path: string, host = ''): { status: number; location?: string } {
  const archivo = existsSync(`${dist}${path.replace(/\/$/, '')}/index.html`)
  for (const line of readFileSync(`${dist}/_redirects`, 'utf8').split('\n')) {
    const [regla, to, status] = line.trim().split(/\s+/)
    if (!regla || regla.startsWith('#')) continue
    const conHost = regla.match(/^https?:\/\/([^/]+)(\/.*)$/)
    if (conHost && conHost[1] !== host) continue
    if (archivo && !status.endsWith('!')) continue
    const names: string[] = []
    let from = (conHost ? conHost[2] : regla).replace(/:(\w+)/g, (_, n) => (names.push(n), '([^/]+)'))
    if (from.endsWith('/*')) {
      names.push('splat')
      from = `${from.slice(0, -2)}(?:/(.*))?`
    }
    const m = path.match(new RegExp(`^${from}/?$`))
    if (m) return { status: parseInt(status), location: names.reduce((t, n, i) => t.replace(`:${n}`, m[i + 1] ?? ''), to) }
  }
  return { status: archivo ? 200 : 404 }
}

export async function netlify(dist: string) {
  const server = http.createServer((req, res) => {
    const r = reglas(dist, new URL(req.url!, 'http://x').pathname, req.headers.host?.replace(/:\d+$/, ''))
    res.writeHead(r.status, r.location ? { location: r.location } : {}).end()
  })
  await new Promise<void>((ok) => server.listen(0, '127.0.0.1', ok))
  return { origin: `http://127.0.0.1:${(server.address() as AddressInfo).port}`, close: () => server.close() }
}
