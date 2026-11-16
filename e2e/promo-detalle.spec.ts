import { expect, test, type Page } from '@playwright/test'

// PRI-535: el detalle de una promo con portada (banner) contra el build sembrado de 3 promos (e2e/promos/scenarios.mjs):
// "2x1 en gorras bordadas" tiene banner y 4 fotos de producto que sirven.
test.use({ baseURL: 'http://localhost:4234' })

const portada = (page: Page) => page.locator('.pf-promo-hero figure img')

/** Qué parte de la foto se ve en su caja (1 = entera), según object-fit. */
const parteVisible = (page: Page) =>
  portada(page).evaluate((img: HTMLImageElement) => {
    const { naturalWidth: nw, naturalHeight: nh, clientWidth: bw, clientHeight: bh } = img
    if (getComputedStyle(img).objectFit === 'contain') return 1
    const s = Math.max(bw / nw, bh / nh)
    return Math.min(1, bw / (nw * s)) * Math.min(1, bh / (nh * s))
  })

for (const ancho of [1280, 1920]) {
  test(`desktop ${ancho} px: the cover is shown whole, not a stretched band of it`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop widths')
    await page.setViewportSize({ width: ancho, height: 900 })
    await page.goto('/promos/e2e-2x1-gorras')
    await expect(portada(page)).toHaveJSProperty('complete', true)
    expect(await parteVisible(page)).toBeGreaterThan(0.99)
  })
}

test('mobile: the cover fills the hero and keeps most of the photo', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only')
  await page.goto('/promos/e2e-2x1-gorras')
  await expect(portada(page)).toHaveJSProperty('complete', true)
  expect(await parteVisible(page)).toBeGreaterThan(0.5)
})

test('the cover is not repeated in the photo modal: it walks only the product photos', async ({ page }) => {
  await page.goto('/promos/e2e-2x1-gorras')
  const cover = await portada(page).getAttribute('src')
  const fotos: { src: string }[] = JSON.parse((await page.locator('.pf-promo-hero a[data-foto]').getAttribute('data-foto'))!).fotos
  expect(fotos.map((f) => f.src)).not.toContain(cover)
  expect(fotos.map((f) => f.src)).toEqual(await page.locator('#mas-fotos img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src'))))

  await page.locator('.pf-promo-hero h1').click({ force: true })
  await expect(page.getByRole('dialog').locator('.mx-puntos span')).toHaveCount(4)
  await expect(page.getByRole('dialog').locator('.mx-foto')).not.toHaveAttribute('src', cover!)
})
