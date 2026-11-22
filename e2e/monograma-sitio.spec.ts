import { expect, test, type Page } from '@playwright/test'
import { MODAL } from './promos/scenarios.mjs'

// PRI-562: la S de Serflow (Monograma) grande y quieta en el 404 y como sello dorado quieto junto al logo del pie. La
// del brillo sigue sola en la ficha; la portada no tiene otra S que el sello. Contra el catálogo sembrado de 4240.
test.use({ baseURL: 'http://localhost:4240' })

const ficha = `/catalogo/${MODAL.categoria.slug}/${MODAL.completa.slug}/`
const sinScrollDeLado = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)
/** Las S de la página por variante, cada una con si es decorativa y si se mueve. */
const eses = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('.monograma')].map((el) => ({
      variante: el.getAttribute('data-variante'),
      oculta: el.getAttribute('aria-hidden') === 'true',
      quieta: [getComputedStyle(el), getComputedStyle(el, '::before')].every((s) => s.animationName === 'none'),
    })),
  )

test('the 404 shows a large still S behind the title', async ({ page }) => {
  expect((await page.goto('/no-existe'))?.status()).toBe(404)
  const s = page.locator('.pf-pagina-titulo > .monograma')
  await expect(s).toHaveAttribute('data-variante', 'quieta')
  await expect(s).toHaveAttribute('aria-hidden', 'true')
  expect((await s.boundingBox())!.height).toBeGreaterThan(150)
  expect(await eses(page)).toEqual([
    { variante: 'quieta', oculta: true, quieta: true },
    { variante: 'sello', oculta: true, quieta: true },
  ])
  // El texto va encima de la S.
  await expect(page.getByRole('heading', { level: 1, name: 'Esta página no existe' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ir al inicio' })).toBeVisible()
  expect(await sinScrollDeLado(page)).toBe(true)
})

for (const [pagina, url, esperadas] of [
  ['home', '/', ['sello']],
  ['catalog', '/catalogo/', ['sello']],
  ['product page', ficha, ['brillo', 'sello']],
] as const) {
  test(`the footer signs the ${pagina} with a small still S next to the logo`, async ({ page }) => {
    await page.goto(url)
    const pie = page.locator('footer')
    const sello = pie.locator('.monograma')
    await expect(sello).toHaveAttribute('data-variante', 'sello')
    await expect(sello).toHaveAttribute('aria-hidden', 'true')
    const [logo, s] = [(await pie.getByRole('img', { name: 'Serflow' }).boundingBox())!, (await sello.boundingBox())!]
    expect(s.height).toBeLessThanOrEqual(logo.height)
    expect(s.x).toBeGreaterThan(logo.x + logo.width)
    expect(Math.abs(s.y + s.height / 2 - (logo.y + logo.height / 2))).toBeLessThan(2)
    expect((await eses(page)).map((e) => e.variante)).toEqual(esperadas)
    expect((await eses(page)).find((e) => e.variante === 'sello')?.quieta).toBe(true)
    expect(await sinScrollDeLado(page)).toBe(true)
  })
}
