import { expect, test, type Page } from '@playwright/test'
import { MODAL } from './promos/scenarios.mjs'

// PRI-123: "Disponible ahora" muestra solo lo que el cliente prendió en serflow-admin (products.available_now). Con
// los builds sembrados de e2e/promos/scenarios.mjs: en 4240, la prenda completa y la de precio en cero prendidas y la
// sin datos apagada; en 4233, ninguna prendida.
const { categoria, completa, vacia, cero } = MODAL
const href = (slug: string) => `/catalogo/${categoria.slug}/${slug}`
const seccion = (page: Page) => page.locator('#disponible')
const linkDeLaNav = (page: Page) => page.locator('header a[href="/#disponible"]')

test('only the products switched on show up, and they open the same modal as the catalog', async ({ page }) => {
  await page.goto('http://localhost:4240/')
  const prendas = seccion(page).locator('a[data-foto]')
  await expect(prendas).toHaveCount(2)
  await expect(prendas.nth(0)).toHaveAttribute('href', href(completa.slug))
  await expect(prendas.nth(1)).toHaveAttribute('href', href(cero.slug))
  await expect(seccion(page).locator(`a[href="${href(vacia.slug)}"]`)).toHaveCount(0)
  await expect(linkDeLaNav(page).first()).toBeAttached()

  await prendas.first().click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(completa.name)
  await expect(dialog.getByText('$45.000', { exact: true })).toBeVisible()
  await expect(dialog.getByText(completa.description)).toBeVisible()
  await expect(page).toHaveURL(new RegExp(`${href(completa.slug)}/?$`))
})

test('with nothing switched on, the home has no Disponible ahora section and the nav no link to it', async ({ page }) => {
  await page.goto('http://localhost:4233/')
  await expect(page.locator('#visitanos')).toBeVisible()
  await expect(seccion(page)).toHaveCount(0)
  await expect(linkDeLaNav(page)).toHaveCount(0)
  await expect(page.locator('header a[href="/#que-hacemos"]').first()).toBeAttached()
})
