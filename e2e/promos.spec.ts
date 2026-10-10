import { expect, test, type Locator, type Page } from '@playwright/test'

// PRI-131: promos sembradas por e2e/promos/server.mjs (ver scenarios.mjs). Cada escenario es un build aparte.
const SITE = { 0: 'http://localhost:4232', 1: 'http://localhost:4233', 3: 'http://localhost:4234' }

const waText = async (link: Locator) => new URL((await link.getAttribute('href'))!).searchParams.get('text')

// "Sin huecos": en desktop la última foto de "Más fotos" llega al borde derecho de la rejilla.
async function expectPhotosFillRow(page: Page) {
  const photos = page.locator('main h2:has-text("Más fotos") + div img')
  const grid = await page.locator('main h2:has-text("Más fotos") + div').boundingBox()
  const last = await photos.last().boundingBox()
  expect(Math.abs(last!.x + last!.width - (grid!.x + grid!.width))).toBeLessThan(2)
}

test.describe('3 promos vigentes y 1 vencida', () => {
  test.use({ baseURL: SITE[3] })

  test('home: the bar rotates the 3 and the whole bar goes to /promos', async ({ page }) => {
    await page.goto('/')
    const bar = page.getByRole('link', { name: 'Ver las 3 promos de hoy' })
    await expect(bar).toHaveAttribute('href', '/promos')
    await bar.click()
    await expect(page).toHaveURL(/\/promos\/?$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Promos de hoy' })).toBeVisible()
  })

  test('/promos: 3 posters by sort_order, each with its own prefilled WhatsApp; the expired one is gone', async ({ page }) => {
    await page.goto('/promos')
    await expect(page.getByText('3 promos activas')).toBeVisible()
    await expect(page.locator('main article h2')).toHaveText([
      '2x1 en gorras bordadas',
      '10% en camisetas para equipos',
      'Gorras para niños con su nombre',
    ])
    await expect(page.getByText('Promo vencida de prueba')).toHaveCount(0)

    const first = page.locator('main article').first()
    expect(await waText(first.getByRole('link', { name: /Pedir por WhatsApp/ }))).toBe(
      '¡Hola! Me interesa la promo "2x1 en gorras bordadas". https://serflowctg.netlify.app/promos/e2e-2x1-gorras',
    )
    await expect(first.getByText(/^Válida hasta el /)).toBeVisible()
    await first.getByRole('link', { name: /Ver las 5 fotos/ }).click()
    await expect(page).toHaveURL(/\/promos\/e2e-2x1-gorras\/?$/)
  })

  test('detail: title, end date, WhatsApp, photos without gaps and the other promos', async ({ page, isMobile }) => {
    await page.goto('/promos/e2e-2x1-gorras')
    await expect(page.getByText('Campaña', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: '2x1 en gorras bordadas' })).toBeVisible()
    await expect(page.getByText(/^Válida hasta el /)).toBeVisible()
    expect(await waText(page.getByRole('link', { name: 'Pedir esta promo por WhatsApp' }))).toContain('"2x1 en gorras bordadas"')
    // El botón flotante también lleva el mensaje de esta promo.
    expect(await waText(page.getByRole('link', { name: 'Escríbenos por WhatsApp' }))).toContain('"2x1 en gorras bordadas"')
    await expect(page.locator('main h2:has-text("Más fotos") + div img')).toHaveCount(4)
    if (!isMobile) await expectPhotosFillRow(page)

    await expect(page.getByRole('heading', { level: 2, name: 'Otras promos' })).toBeVisible()
    await expect(page.locator('main h3')).toHaveText(['10% en camisetas para equipos', 'Gorras para niños con su nombre'])
    await page.getByRole('link', { name: '← Volver a las promos' }).click()
    await expect(page).toHaveURL(/\/promos\/?$/)
  })

  test('detail with 2 extra photos fills the row too', async ({ page, isMobile }) => {
    await page.goto('/promos/e2e-camisetas-equipos')
    await expect(page.locator('main h2:has-text("Más fotos") + div img')).toHaveCount(2)
    if (!isMobile) await expectPhotosFillRow(page)
  })

  test('the expired promo has no page', async ({ page }) => {
    const res = await page.goto('/promos/e2e-vencida')
    expect(res?.status()).toBe(404)
  })

  test('404 offers today\'s promos', async ({ page }) => {
    const res = await page.goto('/no-existe')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1, name: 'Esta página no existe' })).toBeVisible()
    const section = page.getByRole('region', { name: 'Promos de hoy' })
    await expect(section.getByRole('link')).toHaveCount(3)
    await expect(page.getByRole('heading', { name: 'Lo que sí está' })).toHaveCount(0)
  })
})

test.describe('1 promo vigente', () => {
  test.use({ baseURL: SITE[1] })

  test('home: the bar goes straight to the promo', async ({ page }) => {
    await page.goto('/')
    const bar = page.locator('.promo-bar a')
    await expect(bar).toHaveAttribute('href', '/promos/e2e-2x1-gorras')
    await expect(bar).toContainText('2x1 en gorras bordadas')
  })

  test('/promos shows one poster and its detail goes back home', async ({ page }) => {
    await page.goto('/promos')
    await expect(page.getByText('1 promo activa')).toBeVisible()
    await expect(page.locator('main article')).toHaveCount(1)
    await page.locator('main article').getByRole('link', { name: /Ver las 5 fotos/ }).click()
    await expect(page.getByRole('heading', { level: 1, name: '2x1 en gorras bordadas' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Otras promos' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: '← Volver al inicio' })).toHaveAttribute('href', '/')
  })
})

test.describe('0 promos vigentes (solo una vencida)', () => {
  test.use({ baseURL: SITE[0] })

  test('home has no promo bar', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Bienvenido a Serflow' })).toBeVisible()
    await expect(page.locator('.promo-bar')).toHaveCount(0)
  })

  test('/promos shows the empty state with a way out to WhatsApp', async ({ page }) => {
    await page.goto('/promos')
    await expect(page.getByText('Hoy no hay promos')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Pregunta por WhatsApp' })).toHaveAttribute('href', /^https:\/\/wa\.me\//)
    await expect(page.getByText('Promo vencida de prueba')).toHaveCount(0)
    expect((await page.goto('/promos/e2e-vencida'))?.status()).toBe(404)
  })

  test('404 without promos offers the site sections', async ({ page }) => {
    await page.goto('/no-existe')
    await expect(page.getByRole('heading', { name: 'Lo que sí está' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Promos de hoy' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Ir al inicio' })).toHaveAttribute('href', '/')
  })
})
