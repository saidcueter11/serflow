import { expect, test, type Page } from '@playwright/test'
import { MODAL } from './promos/scenarios.mjs'

// PRI-555: el <head> de una ficha. La description (meta, og y JSON-LD) es la que escribió el admin; sin ella, una plantilla
// con el nombre del producto, distinta en cada ficha. Sin precio no hay offers. Contra el catálogo sembrado de 4240.
test.use({ baseURL: 'http://localhost:4240' })
test.skip(({ isMobile }) => isMobile, 'Same HTML on both viewports')

const { categoria, completa, vacia, cero } = MODAL
const ficha = (slug: string) => `/catalogo/${categoria.slug}/${slug}/`

async function head(page: Page, slug: string) {
  await page.goto(ficha(slug))
  const meta = (sel: string) => page.locator(`head meta[${sel}]`).getAttribute('content')
  const lds = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t))
  return {
    description: await meta('name="description"'),
    og: await meta('property="og:description"'),
    twitter: await meta('name="twitter:description"'),
    product: lds.find((l) => l['@type'] === 'Product'),
  }
}

test('with a description, the head uses it everywhere and offers carries the price', async ({ page }) => {
  const h = await head(page, completa.slug)
  expect(h.description).toBe(completa.description)
  expect(h.og).toBe(completa.description)
  expect(h.twitter).toBe(completa.description)
  expect(h.product.description).toBe(completa.description)
  expect(h.product.offers).toMatchObject({ '@type': 'Offer', priceCurrency: 'COP', price: completa.price })
})

test('without a description or price, a template with the product name and no offers', async ({ page }) => {
  // Sin nombre: el de la foto ("Modal de prueba N.º 7").
  const sinDatos = await head(page, vacia.slug)
  expect(sinDatos.description).toMatch(new RegExp(`^${categoria.label} N\\.º ${vacia.legacy_id}: un trabajo de ${categoria.label} hecho en el taller de Serflow`))
  expect(sinDatos.og).toBe(sinDatos.description)
  expect(sinDatos.product.description).toBe(sinDatos.description)
  expect(sinDatos.product).not.toHaveProperty('offers')

  // Descripción en blanco y precio en cero: tampoco cuentan. La plantilla cambia con el nombre: no es la misma en cada ficha.
  const enCero = await head(page, cero.slug)
  expect(enCero.description).toContain(cero.name)
  expect(enCero.description).not.toBe(sinDatos.description)
  expect(enCero.product).not.toHaveProperty('offers')
})
