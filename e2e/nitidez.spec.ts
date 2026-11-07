import { expect, test } from '@playwright/test'

// PRI-150: el srcset de la portada no puede bajar una foto con menos píxeles de los que pinta. Con object-cover una
// foto horizontal se pinta más ancha que su caja; si `sizes` lo olvida, en celulares de 1x y 2x baja una más chica y se
// ve blanda. Solo puede quedar por debajo si ya baja la más grande del srcset.
for (const dpr of [1, 2, 3]) {
  test.describe(`celular de 390 px a ${dpr}x`, () => {
    test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: dpr, isMobile: true, hasTouch: true })

    test('cada foto con srcset de la portada baja al menos los píxeles que pinta', async ({ page }) => {
      test.skip(test.info().project.name !== 'mobile', 'arma su propio celular: con un proyecto basta')
      await page.goto('/')
      const fotos = page.locator('main img[srcset]').filter({ visible: true })
      await expect(fotos.first()).toBeVisible()
      const n = await fotos.count()
      for (let i = 0; i < n; i++) {
        const foto = fotos.nth(i)
        // El zoom del hero nunca para: scrollIntoViewIfNeeded esperaría a que quede quieto.
        await foto.evaluate((img) => img.scrollIntoView({ block: 'center' }))
        await expect.poll(() => foto.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
        const m = await foto.evaluate(async (img: HTMLImageElement) => {
          // naturalWidth viene dividido por la densidad del candidato: el ancho real sale del archivo.
          const archivo = await createImageBitmap(await (await fetch(img.currentSrc)).blob())
          const pintado = Math.max(img.clientWidth, (img.clientHeight * archivo.width) / archivo.height) * devicePixelRatio
          const mayor = Math.max(...img.srcset.split(',').map((c) => parseInt(c.trim().split(/\s+/)[1])))
          return { alt: img.alt, ancho: archivo.width, necesita: Math.min(Math.floor(pintado), mayor) }
        })
        expect(m.ancho, `${m.alt}: baja ${m.ancho} px y necesita ${m.necesita}`).toBeGreaterThanOrEqual(m.necesita)
      }
    })
  })
}
