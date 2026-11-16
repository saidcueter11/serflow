import { devices, expect, test, type Page } from '@playwright/test'

// PRI-526: en el celular, /promos/<slug> llega al final con el dedo, con fotos y sin fotos (builds sembrados de
// e2e/promos/scenarios.mjs). iPhone emulado en Chromium: CI solo instala Chromium.
const PROMOS = {
  'con fotos': 'http://localhost:4234/promos/e2e-2x1-gorras',
  'sin fotos': 'http://localhost:4238/promos/e2e-sin-fotos',
}

// Desliza el dedo hacia arriba hasta el final, como en el teléfono (eventos táctiles, no window.scrollTo). Mismo gesto
// que e2e/modal.spec.ts: Input.synthesizeScrollGesture no mueve la página en el Chromium headless de Linux (CI).
async function deslizarHastaElFinal(page: Page) {
  const cdp = await page.context().newCDPSession(page)
  const { height } = page.viewportSize()!
  const x = 200
  const [desde, hasta] = [height - 40, 60]
  const alto = () => page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  expect(await alto(), 'la página cabe en la pantalla: el test no probaría nada').toBeGreaterThan(200)
  const bloqueo = await page.evaluate(() =>
    [document.documentElement, document.body].map((el) => `${el.tagName}: overflow ${getComputedStyle(el).overflowY}, touch-action ${getComputedStyle(el).touchAction}`).join(' | '),
  )
  await expect
    .poll(async () => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: desde }] })
      for (let k = 1; k <= 10; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: desde + ((hasta - desde) * k) / 10 }] })
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      return (await alto()) - (await page.evaluate(() => scrollY))
    }, { message: `no llega al final (${bloqueo})` })
    .toBeLessThanOrEqual(1)
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
