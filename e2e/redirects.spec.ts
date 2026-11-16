import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { netlify } from './fixtures/netlify'
import { MODAL } from './promos/scenarios.mjs'

// PRI-286: las fichas viejas (/products/<categoría>/<id>) que circulan por WhatsApp redirigen con 301 a la URL propia de
// la foto. PRI-525: las categorías también se mudaron de /products a /catalogo, y una foto renombrada en el admin
// redirige desde su slug viejo. Las reglas las aplica Netlify; aquí, e2e/fixtures/netlify.ts sobre el build.

test('old /products links redirect with a 301 to /catalogo, and the photo opens in the modal', async ({ page, request, isMobile }) => {
  test.skip(isMobile, 'Same redirect on both viewports')
  const { origin, close } = await netlify('dist')
  const sigue = async (from: string, to: string) => {
    const res = await request.get(`${origin}${from}`, { maxRedirects: 0 })
    expect(res.status(), from).toBe(301)
    expect(res.headers().location, from).toBe(to)
  }
  try {
    // Una foto real: la primera de la primera categoría (su id es f-<slug>).
    await page.goto('/catalogo/')
    const category = (await page.getByRole('navigation', { name: 'Categorías' }).getByRole('link').nth(1).getAttribute('href'))!.split('/').pop()!
    await page.goto(`/catalogo/${category}/`)
    const slug = (await page.locator('main a[id^="f-"]').first().getAttribute('id'))!.slice(2)

    await sigue(`/products/${category}/${slug}`, `/catalogo/${category}/${slug}/`)
    await sigue('/products', '/catalogo/')
    await sigue('/products/', '/catalogo/')
    await sigue(`/products/${category}`, `/catalogo/${category}/`)
    await sigue(`/products/${category}/`, `/catalogo/${category}/`)
    await sigue('/products/pagina/2', '/catalogo/pagina/2/')
    await sigue(`/products/${category}/pagina/2`, `/catalogo/${category}/pagina/2/`)
    // /catalogo ya no da 404: es "Todo". Sus categorías y la segunda página existen.
    for (const path of ['/catalogo/', `/catalogo/${category}/`, '/catalogo/pagina/2/']) {
      expect((await request.get(`${origin}${path}`, { maxRedirects: 0 })).status(), path).toBe(200)
    }

    await page.goto(`/catalogo/${category}/${slug}/`)
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.locator(`main a[href="/catalogo/${category}/${slug}"]`)).toHaveCount(1)
  } finally {
    close()
  }
})

test.describe('slug viejo (build sembrado del modal)', () => {
  test.use({ baseURL: 'http://localhost:4240' })

  test('a renamed photo redirects with a 301 from its old slug; text that is not a slug never reaches _redirects', async ({ page, request, isMobile }) => {
    test.skip(isMobile, 'Same redirect on both viewports')
    const dist = '.e2e-builds/modal'
    expect(readFileSync(`${dist}/_redirects`, 'utf8')).not.toContain('evil')
    const { origin, close } = await netlify(dist)
    try {
      const nueva = `/catalogo/${MODAL.categoria.slug}/${MODAL.completa.slug}/`
      const res = await request.get(`${origin}/catalogo/${MODAL.categoria.slug}/${MODAL.slugViejo}`, { maxRedirects: 0 })
      expect(res.status()).toBe(301)
      expect(res.headers().location).toBe(nueva)
      await page.goto(nueva)
      await expect(page.getByRole('dialog')).toContainText(MODAL.completa.name)
    } finally {
      close()
    }
  })
})
