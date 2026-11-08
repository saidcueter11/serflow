import { expect, test, type Page } from '@playwright/test'
import { MODAL } from './promos/scenarios.mjs'

// PRI-433: el modal muestra lo que el admin le puso a la prenda y deja claro que hay más fotos y más prendas. Contra el
// catálogo sembrado de 4240 (e2e/promos/scenarios.mjs): una prenda con 3 fotos, nombre, descripción y precio, una sin
// nada de eso y una con precio en cero, en ese orden en el muro.
test.use({ baseURL: 'http://localhost:4240' })

const { categoria, completa } = MODAL
const dialog = (page: Page) => page.getByRole('dialog')
const href = (slug: string) => `/catalogo/${categoria.slug}/${slug}`
const puntos = (page: Page) => dialog(page).locator('.mx-puntos > span')

test('shows the name, price and whole description the admin set, and nothing broken when they are missing', async ({ page }) => {
  await page.goto(href(completa.slug))
  await expect(dialog(page).getByRole('heading', { level: 2 })).toHaveText(completa.name)
  await expect(dialog(page).getByText('$45.000', { exact: true })).toBeVisible()
  const desc = dialog(page).getByText(completa.description)
  await expect(desc).toBeVisible()
  // Entera: antes iba en una línea con puntos suspensivos.
  expect(await desc.evaluate((p) => p.scrollWidth <= p.clientWidth && p.scrollHeight <= p.clientHeight)).toBe(true)
  await expect(page).toHaveTitle(`${completa.name} — Serflow`)

  // Sin nombre, el de la foto; sin precio ni descripción, no queda hueco ni texto vacío.
  await dialog(page).getByRole('button', { name: 'Prenda siguiente' }).click()
  await expect(dialog(page).getByRole('heading', { level: 2 })).toHaveText(`${categoria.label} N.º 7`)
  await expect(dialog(page).locator('.mx-precio')).toBeHidden()
  await expect(dialog(page).locator('.mx-desc')).toBeHidden()

  // Precio en cero y descripción en blanco: tampoco se pintan.
  await dialog(page).getByRole('button', { name: 'Prenda siguiente' }).click()
  await expect(dialog(page).getByRole('heading', { level: 2 })).toHaveText(MODAL.cero.name)
  await expect(dialog(page).locator('.mx-precio')).toBeHidden()
  await expect(dialog(page).locator('.mx-desc')).toBeHidden()
})

test('photos of the same item are dots on the photo; the arrows by the counter jump between items', async ({ page }) => {
  await page.goto(href(completa.slug))
  const anterior = dialog(page).getByRole('button', { name: 'Prenda anterior' })
  const siguiente = dialog(page).getByRole('button', { name: 'Prenda siguiente' })
  await expect(dialog(page).getByText('1 / 3')).toBeVisible()
  await expect(puntos(page)).toHaveCount(3)
  await expect(puntos(page).nth(0)).toHaveClass('mx-punto-actual')
  await expect(anterior).toBeDisabled()

  // La foto siguiente es de la misma prenda: cambia el punto, no el contador.
  await dialog(page).getByRole('button', { name: 'Foto siguiente' }).click()
  await expect(puntos(page).nth(1)).toHaveClass('mx-punto-actual')
  await expect(dialog(page).getByText('1 / 3')).toBeVisible()
  await expect(dialog(page).locator('img.mx-foto')).toHaveAttribute('alt', /, foto 2 de 3$/)

  // La flecha de prenda salta las fotos que faltan: a la primera foto de la siguiente, que tiene una sola (sin puntos).
  await siguiente.click()
  await expect(dialog(page).getByText('2 / 3')).toBeVisible()
  await expect(page).toHaveURL(new RegExp(`${href(MODAL.vacia.slug)}$`))
  await expect(dialog(page).locator('.mx-puntos')).toBeHidden()
  await siguiente.click()
  await expect(siguiente).toBeDisabled()
  // Tocar la flecha apagada no cierra el modal.
  await siguiente.click({ force: true })
  await expect(dialog(page)).toBeVisible()

  await anterior.click()
  await anterior.click()
  await expect(dialog(page).getByText('1 / 3')).toBeVisible()
  await expect(puntos(page).nth(0)).toHaveClass('mx-punto-actual')
})

test('phone: the next photo peeks in at the edge and the first opening nudges toward it', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Las orillas y el asomo son del celular.')
  await page.goto(`/products/${categoria.slug}`)
  await page.locator('main a[data-foto]').first().click()
  await expect(dialog(page)).toBeVisible()

  const vw = page.viewportSize()!.width
  const orilla = (await dialog(page).locator('.mx-vecina-sig').boundingBox())!
  expect(vw - orilla.x).toBeGreaterThanOrEqual(20)
  await expect(dialog(page).locator('.mx-pista')).toHaveAttribute('data-asoma', '')

  // Una sola vez por página: al abrir otra foto ya no se corre.
  await dialog(page).getByRole('button', { name: 'Cerrar' }).click()
  await expect(dialog(page)).toBeHidden()
  await page.locator('main a[data-foto]').nth(1).click()
  await expect(dialog(page)).toBeVisible()
  await expect(dialog(page).locator('.mx-pista')).not.toHaveAttribute('data-asoma')
})
