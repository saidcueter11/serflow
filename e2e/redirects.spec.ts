import { expect, test } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import http from 'node:http'
import type { AddressInfo } from 'node:net'

// PRI-286: las fichas viejas (/products/<categoría>/<id>) que circulan por WhatsApp redirigen con 301 a la URL propia
// de la foto. La regla vive en public/_redirects y la aplica Netlify; `astro preview` no la lee, así que aquí un servidor
// mínimo aplica dist/_redirects como Netlify (la regla no tapa un archivo que existe) y el destino se abre en el build.
const DIST = 'dist'

function netlify(path: string): { status: number; location?: string } {
  if (existsSync(`${DIST}${path}/index.html`)) return { status: 200 }
  for (const line of readFileSync(`${DIST}/_redirects`, 'utf8').split('\n')) {
    const [from, to, status] = line.trim().split(/\s+/)
    if (!from || from.startsWith('#')) continue
    const names: string[] = []
    const re = new RegExp(`^${from.replace(/:(\w+)/g, (_, n) => (names.push(n), '([^/]+)'))}/?$`)
    const m = path.match(re)
    if (m) return { status: Number(status), location: names.reduce((t, n, i) => t.replace(`:${n}`, m[i + 1]), to) }
  }
  return { status: 404 }
}

test('old /products/<category>/<id> links redirect with a 301 to the photo, which opens in the modal', async ({ page, request, isMobile }) => {
  test.skip(isMobile, 'Same redirect on both viewports')
  const server = http.createServer((req, res) => {
    const r = netlify(new URL(req.url!, 'http://x').pathname)
    res.writeHead(r.status, r.location ? { location: r.location } : {}).end()
  })
  await new Promise<void>((ok) => server.listen(0, '127.0.0.1', ok))
  const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
  try {
    // Una foto real: la primera de la primera categoría (su id es f-<slug>).
    await page.goto('/products')
    const category = (await page.getByRole('navigation', { name: 'Categorías' }).getByRole('link').nth(1).getAttribute('href'))!.split('/').pop()!
    await page.goto(`/products/${category}`)
    const slug = (await page.locator('main a[id^="f-"]').first().getAttribute('id'))!.slice(2)
    const res = await request.get(`${origin}/products/${category}/${slug}`, { maxRedirects: 0 })
    expect(res.status()).toBe(301)
    expect(res.headers().location).toBe(`/catalogo/${category}/${slug}`)
    // Las páginas que existen no se redirigen (Netlify no aplica la regla donde hay archivo).
    expect((await request.get(`${origin}/products/${category}`, { maxRedirects: 0 })).status()).toBe(200)

    await page.goto(res.headers().location)
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.locator(`main a[href="/catalogo/${category}/${slug}"]`)).toHaveCount(1)
  } finally {
    server.close()
  }
})
