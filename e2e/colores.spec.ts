import { expect, test, type Locator, type Page } from '@playwright/test'

// PRI-455: colores disponibles de cada producto, en la card de "Disponible ahora" y en su ficha. Contra el catálogo
// sembrado (e2e/promos/scenarios.mjs, puerto 4239): "Categoría A 1" viene en Negro y Azul rey, "Categoría A 2" en ninguno.
test.use({ baseURL: 'http://localhost:4239' })

const colores = (scope: Page | Locator) => scope.getByRole('list', { name: 'Colores disponibles' })
const card = (page: Page, nombre: string) =>
  page.locator('#disponible .pf-prendas > a').filter({ has: page.getByRole('heading', { name: nombre, exact: true }) })

test('un producto con colores los muestra con su nombre en la card y en su ficha', async ({ page }) => {
  await page.goto('/')
  const conColores = card(page, 'Categoría A 1')
  await expect(colores(conColores).getByRole('listitem')).toHaveText(['Negro', 'Azul rey'])

  await conColores.click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Categoría A 1')
  await expect(colores(page.locator('main')).getByRole('listitem')).toHaveText(['Negro', 'Azul rey'])
})

test('un producto sin colores no muestra nada, ni en la card ni en su ficha', async ({ page }) => {
  await page.goto('/')
  const sinColores = card(page, 'Categoría A 2')
  await expect(sinColores).toBeVisible()
  await expect(colores(sinColores)).toHaveCount(0)

  await sinColores.click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Categoría A 2')
  await expect(colores(page.locator('main'))).toHaveCount(0)
})
