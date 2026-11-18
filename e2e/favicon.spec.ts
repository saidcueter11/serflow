import { expect, test } from '@playwright/test'

// /favicon.ico daba 404 y algunos rastreadores de Google lo piden antes que el <link>. Es la S de icon-512.png en 16,
// 32 y 48 px; los íconos que ya había (icon-192, apple-touch-icon, manifest) siguen en el <head>.
test.describe('favicon', () => {
  test.skip(({ isMobile }) => isMobile, 'Mismo archivo y mismo <head> en los dos viewports')

  test('/favicon.ico responde un .ico de 16, 32 y 48 px', async ({ request }) => {
    const res = await request.get('/favicon.ico')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toMatch(/^image\/(x-icon|vnd\.microsoft\.icon)/)
    const ico = await res.body()
    // Cabecera ICONDIR (reservado 0, tipo 1 = ícono, cuántas imágenes) y una entrada de 16 bytes por imagen.
    expect([ico.readUInt16LE(0), ico.readUInt16LE(2)]).toEqual([0, 1])
    const lados = Array.from({ length: ico.readUInt16LE(4) }, (_, i) => ico[6 + i * 16])
    expect(lados.sort((a, b) => a - b)).toEqual([16, 32, 48])
  })

  test('la portada enlaza el .ico antes del png y conserva los otros íconos', async ({ page }) => {
    await page.goto('/')
    const iconos = await page
      .locator('head link[rel="icon"], head link[rel="apple-touch-icon"], head link[rel="manifest"]')
      .evaluateAll((ls) => ls.map((l) => `${l.getAttribute('rel')} ${l.getAttribute('href')} ${l.getAttribute('sizes') ?? ''}`.trim()))
    expect(iconos).toEqual([
      'icon /favicon.ico 48x48',
      'icon /icon-192.png 192x192',
      'apple-touch-icon /apple-touch-icon.png',
      'manifest /site.webmanifest',
    ])
  })
})
