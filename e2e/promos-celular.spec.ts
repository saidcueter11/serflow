import { devices, expect, test, type Page } from '@playwright/test'

// PRI-526: en el celular, /promos/<slug> llega al final con el dedo, con fotos y sin fotos (builds sembrados de
// e2e/promos/scenarios.mjs). iPhone emulado en Chromium: CI solo instala Chromium.
const PROMOS = {
  'con fotos': 'http://localhost:4234/promos/e2e-2x1-gorras',
  'sin fotos': 'http://localhost:4238/promos/e2e-sin-fotos',
}

// Desliza el dedo hacia arriba hasta el final, como en el teléfono (gesto táctil de Chromium, no window.scrollTo).
async function deslizarHastaElFinal(page: Page) {
  const cdp = await page.context().newCDPSession(page)
  const alto = () => page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  expect(await alto(), 'la página cabe en la pantalla: el test no probaría nada').toBeGreaterThan(200)
  await expect
    .poll(async () => {
      await cdp.send('Input.synthesizeScrollGesture', { x: 200, y: 600, yDistance: -1500, speed: 3000, gestureSourceType: 'touch' })
      return (await alto()) - (await page.evaluate(() => scrollY))
    })
    .toBeLessThanOrEqual(1)
  await expect(page.locator('footer')).toBeInViewport()
}

for (const nombre of ['iPhone 13', 'Pixel 7']) {
  const { defaultBrowserType: _, ...celular } = devices[nombre]
  test.describe(nombre, () => {
    test.use(celular)

    for (const [caso, url] of Object.entries(PROMOS)) {
      test(`promo ${caso}: scrolls to the end`, async ({ page }) => {
        test.skip(test.info().project.name !== 'mobile', 'arma su propio celular: con un proyecto basta')
        await page.goto(url)
        await expect(page.locator('h1')).toBeVisible()
        await deslizarHastaElFinal(page)
      })
    }
  })
}
