import { expect, test, type Page } from '@playwright/test'
import { existsSync, readFileSync, statSync } from 'node:fs'
import http from 'node:http'
import type { AddressInfo } from 'node:net'

// PRI-127: el panel (serflow-admin, otro dominio) lee /build.json cada 15 s mientras publica para decir "Ya salió".
// `astro preview` no sirve los headers de Netlify, así que un servidor mínimo sirve dist/ con los de netlify.toml y el
// navegador lo lee desde otro origen, como el panel.
const reglas = readFileSync('netlify.toml', 'utf8')
  .split('[[headers]]')
  .slice(1)
  .map((bloque) => ({
    ruta: bloque.match(/for = "(.+)"/)![1],
    valores: [...bloque.matchAll(/^\s*([\w-]+) = "(.+)"$/gm)].filter((m) => m[1] !== 'for').map((m) => [m[1], m[2]]),
  }))

function netlify() {
  return http.createServer((req, res) => {
    const ruta = new URL(req.url!, 'http://x').pathname
    const archivo = ruta === '/' ? 'dist/index.html' : `dist${ruta}`
    if (!existsSync(archivo)) return res.writeHead(404).end()
    const headers = reglas.filter((r) => r.ruta === '/*' || r.ruta === ruta).flatMap((r) => r.valores) as [string, string][]
    res.writeHead(200, Object.fromEntries(headers)).end(readFileSync(archivo))
  })
}

/** Lo que ve el navegador al leer la URL desde la página abierta: el cuerpo, o 'bloqueado' si CORS no lo deja. */
const leer = (page: Page, url: string) =>
  page.evaluate((u) => fetch(u).then((r) => (r.ok ? r.text() : `HTTP ${r.status}`), () => 'bloqueado'), url)

test.describe('/build.json', () => {
  test.skip(({ isMobile }) => isMobile, 'Mismo archivo en los dos viewports')

  test('cada build publica la hora y nada más, tomada antes de escribir las páginas', async ({ request }) => {
    const res = await request.get('/build.json')
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(Object.keys(body)).toEqual(['builtAt'])
    expect(new Date(body.builtAt).toISOString()).toBe(body.builtAt)
    // Si fuera la hora del final, un build que leyó los datos antes de publicar haría decir "Ya salió" al panel.
    expect(Date.parse(body.builtAt)).toBeLessThan(statSync('dist/index.html').mtimeMs)
  })

  test('el panel lo lee desde otro dominio, sin caché y sin abrir CORS al resto del sitio', async ({ page }) => {
    const server = netlify()
    await new Promise<void>((ok) => server.listen(0, '127.0.0.1', ok))
    const sitio = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
    try {
      await page.goto('/')
      expect(new URL(page.url()).origin).not.toBe(sitio)

      expect(Object.keys(JSON.parse(await leer(page, `${sitio}/build.json`)))).toEqual(['builtAt'])
      expect(await leer(page, `${sitio}/`)).toBe('bloqueado')

      const { headers } = await fetch(`${sitio}/build.json`)
      expect(headers.get('cache-control')).toMatch(/max-age=0.*must-revalidate/)
      expect(headers.get('access-control-allow-origin')).toBe('*')
      expect(headers.get('access-control-allow-credentials')).toBeNull()
      // Los headers de #40 siguen aplicando a este archivo.
      expect(headers.get('content-security-policy')).toContain("default-src 'self'")
      expect(headers.get('x-content-type-options')).toBe('nosniff')
    } finally {
      server.close()
    }
  })
})
