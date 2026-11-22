import { expect, test, type Page } from '@playwright/test'

// PRI-566: el detalle de una promo contra el build sembrado de 3 promos (e2e/promos/scenarios.mjs): "2x1 en gorras
// bordadas" tiene banner y 4 fotos de producto. Medidas del reporte: escritorio 1440 x 900 y celular 390 x 844.
test.use({ baseURL: 'http://localhost:4234' })

const dialog = (page: Page) => page.getByRole('dialog')
const marco = (page: Page) => dialog(page).locator('.mx-marco')

test.beforeEach(async ({ page, isMobile }) => {
  await page.setViewportSize(isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 })
  await page.goto('/promos/e2e-2x1-gorras')
})

/** La foto del visor ya bajó y ya terminó de crecer o deslizarse. */
async function quieta(page: Page) {
  await expect(marco(page)).not.toHaveAttribute('data-cargando')
  await dialog(page).evaluate((d) => Promise.all(d.getAnimations({ subtree: true }).map((a) => a.finished)))
}

const caja = (page: Page, sel: string) =>
  dialog(page)
    .locator(sel)
    .evaluate((el) => {
      const r = el.getBoundingClientRect()
      // height: el de la maqueta, sin la escala de la animación al crecer.
      return { top: r.top, bottom: r.bottom, height: (el as HTMLElement).offsetHeight }
    })

test('the cover is not a link or a button: touching it opens nothing', async ({ page }) => {
  const hero = page.locator('.pf-promo-hero')
  await expect(hero.getByRole('link')).toHaveCount(1)
  await expect(hero.getByRole('link', { name: 'Pedir esta promo por WhatsApp' })).toBeVisible()
  await expect(hero.getByRole('button')).toHaveCount(0)

  // Arriba de la foto, lejos del texto y del botón.
  const foto = (await hero.locator('figure img').boundingBox())!
  const x = foto.x + foto.width / 2
  const y = Math.max(foto.y, 0) + 24
  expect(await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('a, button, [role="button"]'), [x, y])).toBe(false)
  await page.mouse.click(x, y)
  await expect(dialog(page)).toBeHidden()
})

test('Más fotos shows each photo whole, in its own proportion', async ({ page }) => {
  const fotos = page.locator('#mas-fotos img')
  await expect(fotos).toHaveCount(4)
  for (const img of await fotos.all()) {
    await img.scrollIntoViewIfNeeded()
    await expect(img).toHaveJSProperty('complete', true)
    const m = await img.evaluate((i: HTMLImageElement) => {
      const { r } = JSON.parse(i.closest('a')!.dataset.foto!).fotos[Number(i.closest('a')!.dataset.fotoJ)]
      return { caja: i.clientWidth / i.clientHeight, foto: i.naturalWidth / i.naturalHeight, r }
    })
    // La caja tiene la proporción de la foto que bajó, y esa es la de la foto original (r, medida en el build): ±2 %.
    expect(Math.abs(m.caja / m.foto - 1)).toBeLessThan(0.02)
    expect(Math.abs(m.foto / m.r - 1)).toBeLessThan(0.02)
  }
})

test('the viewer fits the screen, with "Promo" and the WhatsApp button in view, photo after photo', async ({ page }) => {
  await page.locator('#mas-fotos a').first().click()
  await expect(dialog(page)).toBeVisible()
  const alto = page.viewportSize()!.height
  for (let k = 0; k < 4; k++) {
    await quieta(page)
    for (const sel of ['.mx-marco', '.mx-foto', '.mx-cat', '.mx-pedir a']) {
      const c = await caja(page, sel)
      expect(c.top, `${sel}, foto ${k + 1}`).toBeGreaterThanOrEqual(0)
      expect(c.bottom, `${sel}, foto ${k + 1}`).toBeLessThanOrEqual(alto)
    }
    await expect(dialog(page).locator('.mx-cat')).toHaveText('Promo')
    if (k < 3) await page.keyboard.press('ArrowRight')
  }
})

test('mobile: the viewer keeps its height from the thumbnail to the big photo and from photo to photo', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only')
  await page.locator('#mas-fotos a').first().click()
  await expect(dialog(page)).toBeVisible()
  // Mientras crece, la miniatura (mx-mini) va debajo de la grande: el marco ya tiene su alto final.
  const altos = [(await caja(page, '.mx-marco')).height]
  for (let k = 0; k < 4; k++) {
    await quieta(page)
    altos.push((await caja(page, '.mx-marco')).height, (await caja(page, '.mx-foto')).height)
    if (k < 3) await page.keyboard.press('ArrowRight')
  }
  for (const h of altos) expect(h).toBeCloseTo(altos[0], 0)
})

test('mobile: photos of different proportions keep the same viewer height', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only')
  // Las fotos sembradas son todas 3:4; las de una promo real no (en "Especial Navidad" van de 0,56 a 0,79). Se cambia
  // la proporción declarada de la segunda, como la de una foto más angosta.
  await page.locator('#mas-fotos a').evaluateAll((as) =>
    as.forEach((a) => {
      const f = JSON.parse(a.dataset.foto!)
      f.fotos[1].r = 0.563
      a.dataset.foto = JSON.stringify(f)
    }),
  )
  await page.locator('#mas-fotos a').first().click()
  await quieta(page)
  const antes = (await caja(page, '.mx-marco')).height
  await page.keyboard.press('ArrowRight')
  await quieta(page)
  expect((await caja(page, '.mx-marco')).height).toBeCloseTo(antes, 0)
})
