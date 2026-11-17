import { expect, test } from '@playwright/test'
import { INTRO } from './promos/scenarios.mjs'

// PRI-532: el texto de la categoría que el cliente escribe en el admin sale entre las pestañas y el muro, y en el <title>
// y la meta description. Build sembrado de la rejilla (4239): A con texto, B solo con espacios, C sin nada.
test.use({ baseURL: 'http://localhost:4239' })

test('a category with text shows it between the tabs and the wall, and in the title and description', async ({ page }) => {
  await page.goto('/catalogo/e2e-a/')
  const intro = page.locator('main .pf-cat-intro')
  await expect(intro).toHaveText(INTRO.intro)
  // Es texto: la etiqueta del admin no se vuelve HTML.
  await expect(intro.locator('b')).toHaveCount(0)
  const [tabs, texto, foto] = await Promise.all([
    page.getByRole('navigation', { name: 'Categorías' }).boundingBox(),
    intro.boundingBox(),
    page.locator('main a[id^="f-"]').first().boundingBox(),
  ])
  expect(texto!.y).toBeGreaterThanOrEqual(tabs!.y + tabs!.height)
  expect(foto!.y).toBeGreaterThanOrEqual(texto!.y + texto!.height)
  await expect(page).toHaveTitle(`${INTRO.seoTitle} — Serflow`)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', INTRO.intro)
})

test('a category without text, or with only spaces, shows nothing and keeps its name as the title', async ({ page }) => {
  for (const slug of ['b', 'c']) {
    await page.goto(`/catalogo/e2e-${slug}/`)
    await expect(page.locator('main a[id^="f-"]').first()).toBeVisible()
    await expect(page.locator('.pf-cat-intro')).toHaveCount(0)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /^Explora la colección de Categoría /)
  }
  await expect(page).toHaveTitle(/^Categoría C .* — Serflow$/)
  await page.goto('/catalogo/e2e-b/')
  await expect(page).toHaveTitle('Categoría B — Serflow')
})
