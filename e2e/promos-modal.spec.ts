import { expect, test, type Page } from '@playwright/test'

// PRI-523: las fotos de las promos abren el mismo modal de foto que el catálogo (PhotoModal). Contra el build sembrado de
// 3 promos (e2e/promos/scenarios.mjs): "2x1 en gorras bordadas" tiene portada y 4 fotos más que sirven (5 en total).
test.use({ baseURL: 'http://localhost:4234' })

const dialog = (page: Page) => page.getByRole('dialog')
const foto = (page: Page) => dialog(page).locator('.mx-foto')
const waText = async (page: Page) =>
  new URL((await dialog(page).getByRole('link', { name: 'Pedir por WhatsApp' }).getAttribute('href'))!).searchParams.get('text')

test('detail: a photo of Más fotos opens the modal on that photo and walks the promo photos', async ({ page }) => {
  await page.goto('/promos/e2e-2x1-gorras')
  await page.locator('#mas-fotos a').nth(1).click()

  await expect(dialog(page)).toBeVisible()
  // La segunda de Más fotos es la tercera de la promo: la portada es la primera.
  await expect(foto(page)).toHaveAttribute('alt', '2x1 en gorras bordadas, foto 3 de 5')
  await expect(dialog(page).getByRole('heading', { name: '2x1 en gorras bordadas' })).toBeVisible()
  await expect(dialog(page).getByText('Llevas dos gorras con el mismo bordado y pagas una.')).toBeVisible()
  await expect(dialog(page).locator('.mx-cat')).toHaveText('Promo')
  await expect(dialog(page).locator('.mx-precio')).toBeHidden()
  expect(await waText(page)).toBe('¡Hola! Me interesa la promo "2x1 en gorras bordadas". https://serflowctg.netlify.app/promos/e2e-2x1-gorras')
  // Una sola promo en su página: sin contador de prendas; los puntos son sus 5 fotos.
  await expect(dialog(page).locator('.mx-barra')).toBeHidden()
  await expect(dialog(page).locator('.mx-puntos span')).toHaveCount(5)

  await page.keyboard.press('ArrowRight')
  await expect(foto(page)).toHaveAttribute('alt', '2x1 en gorras bordadas, foto 4 de 5')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await expect(foto(page)).toHaveAttribute('alt', '2x1 en gorras bordadas')

  await page.keyboard.press('Escape')
  await expect(dialog(page)).toBeHidden()
  await expect(page).toHaveURL(/\/promos\/e2e-2x1-gorras\/?$/)
})

test('detail: the hero photo opens the modal on the cover, and its WhatsApp button still goes to WhatsApp', async ({ page }) => {
  await page.goto('/promos/e2e-2x1-gorras')
  // trial: el botón recibe el toque (el link de la foto no lo tapa), sin abrir WhatsApp.
  await page.locator('.pf-promo-hero').getByRole('link', { name: 'Pedir esta promo por WhatsApp' }).click({ trial: true })
  // Encima del título: el texto del hero deja pasar el toque a la foto (force: el click cae en el link que la cubre).
  await page.locator('.pf-promo-hero h1').click({ force: true })

  await expect(dialog(page)).toBeVisible()
  await expect(foto(page)).toHaveAttribute('alt', '2x1 en gorras bordadas')
  await expect(dialog(page).locator('.mx-puntos span')).toHaveCount(5)
  await expect(dialog(page).locator('.mx-barra')).toBeHidden()
  await page.keyboard.press('ArrowRight')
  await expect(foto(page)).toHaveAttribute('alt', '2x1 en gorras bordadas, foto 2 de 5')
})

test('/promos: the photo of a promo opens the modal and the arrows go to the next promo', async ({ page }) => {
  await page.goto('/promos')
  await page.locator('main section').first().locator('a[data-foto]').click()

  await expect(dialog(page)).toBeVisible()
  await expect(foto(page)).toHaveAttribute('alt', '2x1 en gorras bordadas')
  await expect(dialog(page).locator('.mx-contador')).toHaveText('1 / 3')
  await expect(page).toHaveURL(/\/promos\/e2e-2x1-gorras$/)

  await dialog(page).getByRole('button', { name: 'Prenda siguiente' }).click()
  await expect(dialog(page).getByRole('heading', { name: '10% en camisetas para equipos' })).toBeVisible()
  await expect(dialog(page).getByText('Desde 10 camisetas con nombre y número.')).toBeVisible()
  expect(await waText(page)).toContain('"10% en camisetas para equipos"')
  await expect(page).toHaveURL(/\/promos\/e2e-camisetas-equipos$/)

  await dialog(page).getByRole('button', { name: 'Cerrar' }).click()
  await expect(dialog(page)).toBeHidden()
  await expect(page).toHaveURL(/\/promos\/?$/)
})
