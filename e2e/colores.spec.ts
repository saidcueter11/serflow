import { expect, test, type Locator, type Page } from '@playwright/test'
import { MODAL } from './promos/scenarios.mjs'

// PRI-455: colores disponibles de cada producto, en la ficha (Disponible ahora) y en el modal. Contra el catálogo
// sembrado (e2e/promos/scenarios.mjs, puerto 4239): "Categoría A 1" viene en Negro y Azul rey, "Categoría A 2" en ninguno.
test.use({ baseURL: 'http://localhost:4239' })

const colores = (scope: Page | Locator) => scope.getByRole('list', { name: 'Colores disponibles' })
const ficha = (page: Page, nombre: string) =>
  page.locator('#disponible a[data-foto]').filter({ has: page.getByRole('heading', { name: nombre, exact: true }) })

test('un producto con colores los muestra con su nombre en la ficha y en el modal', async ({ page }) => {
  await page.goto('/')
  const conColores = ficha(page, 'Categoría A 1')
  await expect(colores(conColores).getByRole('listitem')).toHaveText(['Negro', 'Azul rey'])

  await conColores.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(colores(dialog).getByRole('listitem')).toHaveText(['Negro', 'Azul rey'])
})

test('un producto sin colores no muestra nada, ni en la ficha ni en el modal', async ({ page }) => {
  await page.goto('/')
  const sinColores = ficha(page, 'Categoría A 2')
  await expect(sinColores).toBeVisible()
  await expect(colores(sinColores)).toHaveCount(0)

  await sinColores.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('Categoría A 2')
  await expect(colores(dialog)).toBeHidden()
})

test('la URL propia de la foto abre el modal con sus colores; al pasar a una sin colores se van', async ({ page }) => {
  await page.goto('/catalogo/e2e-a/e2e-a-1')
  const dialog = page.getByRole('dialog')
  await expect(colores(dialog).getByRole('listitem')).toHaveText(['Negro', 'Azul rey'])

  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/catalogo\/e2e-a\/e2e-a-2$/)
  await expect(colores(dialog)).toBeHidden()
})

// El caso más alto de la franja (#58 la mide entera): nombre, precio, colores y descripción juntos, sin tapar "Pedir".
test.describe('con precio y descripción (catálogo del modal, puerto 4240)', () => {
  test.use({ baseURL: 'http://localhost:4240' })

  test('los colores caben en la franja junto al precio y la descripción, y Pedir sigue a la vista', async ({ page }) => {
    await page.goto(`/catalogo/${MODAL.categoria.slug}/${MODAL.completa.slug}`)
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(MODAL.completa.name)
    await expect(dialog.getByText('$45.000', { exact: true })).toBeVisible()
    await expect(colores(dialog).getByRole('listitem')).toHaveText(MODAL.colores.map((c) => c.name))
    await expect(colores(dialog)).toBeInViewport()
    await expect(dialog.getByRole('link', { name: /Pedir por WhatsApp/ })).toBeInViewport()
  })
})
