import { expect, test, type Page } from '@playwright/test'
import { MODAL } from './promos/scenarios.mjs'

// PRI-433: el modal deja claro que hay más fotos y más prendas. Desde PRI-529 el modal es de las promos: contra /promos
// del build sembrado de 3 promos (4234, e2e/promos/scenarios.mjs): "2x1 en gorras bordadas" con 4 fotos, "10% en
// camisetas para equipos" y una de una sola foto, en ese orden. Lo que el admin le pone a la prenda (nombre, precio,
// descripción) lo muestra su ficha (e2e/ficha.spec.ts).
test.use({ baseURL: 'http://localhost:4234' })

const dialog = (page: Page) => page.getByRole('dialog')
const puntos = (page: Page) => dialog(page).locator('.mx-puntos > span')
const tiles = (page: Page) => page.locator('main a[data-foto]')

test('the product page shows a name with a script in it as text, without running it', async ({ page }) => {
  // La URL propia de la prenda (la ficha): el nombre con "</script>" sale como texto en el título y en el JSON-LD.
  await page.goto(`http://localhost:4240/catalogo/${MODAL.categoria.slug}/${MODAL.cero.slug}/`)
  await expect(page).toHaveTitle(`${MODAL.cero.name} — Serflow`)
  const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((s) => s.map((e) => JSON.parse(e.textContent!)))
  expect(ld.some((x) => x.name === MODAL.cero.name)).toBe(true)
  expect(await page.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined()
})

test('photos of the same item are dots on the photo; the arrows by the counter jump between items', async ({ page }) => {
  await page.goto('/promos')
  await tiles(page).first().click()
  await expect(dialog(page)).toBeVisible()
  const anterior = dialog(page).getByRole('button', { name: 'Prenda anterior' })
  const siguiente = dialog(page).getByRole('button', { name: 'Prenda siguiente' })
  await expect(dialog(page).getByText('1 / 3')).toBeVisible()
  await expect(puntos(page)).toHaveCount(4)
  await expect(puntos(page).nth(0)).toHaveClass('mx-punto-actual')
  await expect(anterior).toBeDisabled()

  // La foto siguiente es de la misma prenda: cambia el punto, no el contador.
  await dialog(page).getByRole('button', { name: 'Foto siguiente' }).click()
  await expect(puntos(page).nth(1)).toHaveClass('mx-punto-actual')
  await expect(dialog(page).getByText('1 / 3')).toBeVisible()
  await expect(dialog(page).locator('img.mx-foto')).toHaveAttribute('alt', /, foto 2 de 4$/)

  // La flecha de prenda salta las fotos que faltan: a la primera foto de la siguiente.
  await siguiente.click()
  await expect(dialog(page).getByText('2 / 3')).toBeVisible()
  await expect(page).toHaveURL(/\/promos\/e2e-camisetas-equipos\/?$/)
  // La última tiene una sola foto: sin puntos.
  await siguiente.click()
  await expect(dialog(page).getByText('3 / 3')).toBeVisible()
  await expect(dialog(page).locator('.mx-puntos')).toBeHidden()
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
  await page.goto('/promos')
  await tiles(page).first().click()
  await expect(dialog(page)).toBeVisible()

  const vw = page.viewportSize()!.width
  const orilla = (await dialog(page).locator('.mx-vecina-sig').boundingBox())!
  expect(vw - orilla.x).toBeGreaterThanOrEqual(20)
  await expect(dialog(page).locator('.mx-pista')).toHaveAttribute('data-asoma', '')

  // Una sola vez por página: al abrir otra foto ya no se corre.
  await dialog(page).getByRole('button', { name: 'Cerrar' }).click()
  await expect(dialog(page)).toBeHidden()
  await tiles(page).nth(1).click()
  await expect(dialog(page)).toBeVisible()
  await expect(dialog(page).locator('.mx-pista')).not.toHaveAttribute('data-asoma')
})
