import { expect, test, type Page } from '@playwright/test'
import { MODAL } from './promos/scenarios.mjs'

// PRI-525: SEO técnico. Cada página tiene imagen al compartir, su JSON-LD pasa un validador local (los campos que Google
// pide para cada tipo) y ninguna <img> queda sin alt. Contra el build real (4231), el de una promo (4233) y el del modal
// (4240, prendas con precio y sin él).

const SCHEMA = 'https://schema.org'
const absoluta = (u: unknown) => typeof u === 'string' && /^https:\/\/[^/]+\//.test(u)

/** Errores de un bloque JSON-LD: vacío si es válido. */
function validar(ld: Record<string, any>, canonical: string): string[] {
  const e: string[] = []
  const pide = (ok: unknown, msg: string) => !ok && e.push(`${ld['@type']}: ${msg}`)
  pide(ld['@context'] === SCHEMA, '@context')
  switch (ld['@type']) {
    case 'ClothingStore':
      pide(ld.name, 'name')
      pide(absoluta(ld.url), 'url')
      pide(absoluta(ld.image) && !String(ld.image).endsWith('.svg'), 'image (foto o logo, no favicon)')
      pide(absoluta(ld.logo), 'logo')
      pide(ld.address?.['@type'] === 'PostalAddress' && ld.address.addressLocality && ld.address.addressCountry === 'CO', 'address')
      pide(ld.geo?.['@type'] === 'GeoCoordinates' && Math.abs(ld.geo.latitude) <= 90 && Math.abs(ld.geo.longitude) <= 180, 'geo')
      pide(Array.isArray(ld.sameAs) && ld.sameAs.length && ld.sameAs.every(absoluta), 'sameAs')
      pide(ld.priceRange === undefined || (typeof ld.priceRange === 'string' && ld.priceRange.length < 100), 'priceRange')
      break
    case 'Product': {
      const o = ld.offers
      pide(ld.name, 'name')
      pide(Array.isArray(ld.image) && ld.image.length && ld.image.every(absoluta), 'image')
      pide(ld.url === canonical, `url = canonical (${ld.url} != ${canonical})`)
      pide(o?.['@type'] === 'Offer' && o.priceCurrency === 'COP' && o.url === canonical, 'offers')
      pide(o?.price === undefined || (typeof o.price === 'number' && o.price > 0), 'offers.price')
      pide(o?.availability === undefined || [`${SCHEMA}/InStock`, `${SCHEMA}/OutOfStock`].includes(o.availability), 'offers.availability')
      break
    }
    case 'BreadcrumbList': {
      const items = ld.itemListElement ?? []
      pide(items.length >= 2, 'itemListElement')
      items.forEach((it: any, i: number) => pide(it['@type'] === 'ListItem' && it.position === i + 1 && it.name && absoluta(it.item), `item ${i + 1}`))
      pide(items.at(-1)?.item === canonical, 'el último es la página')
      break
    }
    default:
      e.push(`tipo inesperado ${ld['@type']}`)
  }
  return e
}

async function revisar(page: Page, path: string) {
  await page.goto(path)
  const canonical = (await page.locator('link[rel="canonical"]').getAttribute('href'))!
  // Imagen al compartir: absoluta, y el archivo existe en el build.
  const og = await page.locator('meta[property="og:image"]').getAttribute('content')
  expect(absoluta(og), `${path} og:image`).toBe(true)
  expect(await page.locator('meta[name="twitter:image"]').getAttribute('content')).toBe(og)
  const img = await page.request.get(new URL(og!).pathname)
  expect(img.status(), `${path} og:image ${og}`).toBe(200)
  expect(img.headers()['content-type']).toMatch(/^image\/(jpeg|png)/)
  // JSON-LD válido.
  const lds = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t))
  expect(lds.flatMap((ld) => validar(ld, canonical)), path).toEqual([])
  // Sin <img> sin alt; las fotos del muro dicen qué son.
  expect(await page.locator('img:not([alt])').count(), `${path} img sin alt`).toBe(0)
  for (const alt of await page.locator('main a[data-foto] img').evaluateAll((els) => els.map((el) => el.getAttribute('alt')))) {
    expect(alt?.trim(), `${path} foto del muro sin alt`).toBeTruthy()
  }
  return { canonical, og: og!, lds }
}

test.describe('build real', () => {
  test.skip(({ isMobile }) => isMobile, 'Same HTML on both viewports')

  test('every page has a share image, valid JSON-LD and no image without alt', async ({ page }) => {
    test.setTimeout(90_000)
    const portada = await revisar(page, '/')
    expect(portada.og).toMatch(/\/og-serflow\.jpg$/)
    expect(portada.lds.map((l) => l['@type'])).toEqual(['ClothingStore'])

    const todo = await revisar(page, '/catalogo/')
    expect(todo.lds.map((l) => l['@type'])).toEqual(['BreadcrumbList'])
    const category = (await page.getByRole('navigation', { name: 'Categorías' }).getByRole('link').nth(1).getAttribute('href'))!
    await revisar(page, `${category}/`)
    const foto = (await page.locator('main a[data-foto]').first().getAttribute('href'))!

    const ficha = await revisar(page, `${foto}/`)
    expect(ficha.og, 'la ficha comparte su foto, no la de la marca').not.toMatch(/og-serflow/)
    expect(ficha.lds.map((l) => l['@type'])).toEqual(['Product', 'BreadcrumbList'])

    await revisar(page, '/promos/')
    await revisar(page, '/personaliza/')
  })

  test('sitemap with lastmod, robots.txt from the site constant, and the web manifest', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap-0.xml')).text()
    const fotos = [...sitemap.matchAll(/<url><loc>([^<]+\/catalogo\/[^/]+\/[^/<]+\/)<\/loc>(<lastmod>[^<]+<\/lastmod>)?/g)]
    expect(fotos.length).toBeGreaterThan(0)
    expect(fotos.filter((m) => !m[2]).map((m) => m[1]), 'fotos sin lastmod').toEqual([])
    expect(sitemap).not.toContain('/products')

    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toMatch(/^Sitemap: https:\/\/[^/]+\/sitemap-index\.xml$/m)

    const manifest = await (await request.get('/site.webmanifest')).json()
    expect(manifest.name).toContain('Serflow')
    for (const icon of manifest.icons) expect((await request.get(icon.src)).status(), icon.src).toBe(200)
  })
})

test.describe('promo sembrada', () => {
  test.use({ baseURL: 'http://localhost:4233' })
  test('a promo shares its own photo', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Same HTML on both viewports')
    const promo = await revisar(page, '/promos/e2e-2x1-gorras/')
    expect(promo.og).not.toMatch(/og-serflow/)
  })
})

test.describe('precio en el JSON-LD (build del modal)', () => {
  test.use({ baseURL: 'http://localhost:4240' })
  test('offers carries the admin price in COP, and no price when there is none', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Same HTML on both viewports')
    const base = `/catalogo/${MODAL.categoria.slug}`
    const conPrecio = (await revisar(page, `${base}/${MODAL.completa.slug}/`)).lds.find((l) => l['@type'] === 'Product')
    expect(conPrecio.offers).toMatchObject({ priceCurrency: 'COP', price: MODAL.completa.price })
    const sinPrecio = (await revisar(page, `${base}/${MODAL.cero.slug}/`)).lds.find((l) => l['@type'] === 'Product')
    expect(sinPrecio.offers.price).toBeUndefined()
  })
})
