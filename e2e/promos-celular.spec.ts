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
  const bloqueo = await page.evaluate(() =>
    [document.documentElement, document.body].map((el) => `${el.tagName}: overflow ${getComputedStyle(el).overflowY}, touch-action ${getComputedStyle(el).touchAction}`).join(' · '),
  )
  await expect
    .poll(async () => {
      await cdp.send('Input.synthesizeScrollGesture', { x: 200, y: 600, yDistance: -1500, speed: 3000, gestureSourceType: 'touch' })
      return (await alto()) - (await page.evaluate(() => scrollY))
    }, { message: `no llega al final (${bloqueo})` })
    .toBeLessThanOrEqual(1)
}
}

for (const nombre of ['iPhone 13', 'Pixel 7']) {
  const { defaultBrowserType: _, ...celular } = devices[nombre]
  test.describe(nombre, () => {
    test.use(celular)

    // Control: si una página larga sin nada no baja con el mismo gesto, lo roto es el gesto, no el sitio.
    test('control: a plain long page scrolls with the same gesture', async ({ page }) => {
      test.skip(test.info().project.name !== 'mobile', 'arma su propio celular: con un proyecto basta')
      await page.setContent('<meta name="viewport" content="width=device-width"><div style="height:4000px"></div><footer>fin</footer>')
      await deslizarHastaElFinal(page)
    })

    for (const [caso, url] of Object.entries(PROMOS)) {
      test(`promo ${caso}: scrolls to the end`, async ({ page }) => {
        test.skip(test.info().project.name !== 'mobile', 'arma su propio celular: con un proyecto basta')
        await page.goto(url)
        await expect(page.locator('h1')).toBeVisible()
        await deslizarHastaElFinal(page)
        await expect(page.locator('footer')).toBeInViewport()
      })
    }
  })
}
