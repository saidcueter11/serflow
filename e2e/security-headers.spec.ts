import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

// PRI-152: `astro preview` no sirve los headers de Netlify, así que el test le pone a cada documento la CSP de
// netlify.toml y recorre el sitio real. Una violación es un recurso que el sitio dejaría de cargar en prod.
const toml = readFileSync('netlify.toml', 'utf8')
const header = (name: string) => toml.match(new RegExp(`^\\s*${name} = "(.+)"$`, 'm'))?.[1]
const csp = header('Content-Security-Policy')

/** Sirve el sitio con la CSP y devuelve las violaciones que van saliendo en la consola. */
async function conCsp(page: Page) {
  const origen = new URL(test.info().project.use.baseURL!).origin
  await page.route(
    (url) => url.origin === origen,
    async (route) => {
      if (route.request().resourceType() !== 'document') return route.fallback()
      const response = await route.fetch()
      await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': csp! } })
    },
  )
  const violaciones: string[] = []
  page.on('console', (m) => {
    // Lo que Google loguee dentro de su iframe no es del sitio.
    if (m.text().includes('Content Security Policy') && !m.location().url.includes('google.com')) violaciones.push(m.text())
  })
  return violaciones
}

test('netlify.toml declara los headers de seguridad', () => {
  expect(csp).toContain("frame-ancestors 'none'")
  // Sin 'unsafe-inline' en script-src: es la barrera si algún día entra HTML sin escapar.
  expect(csp?.match(/script-src [^;]+/)?.[0]).not.toContain('unsafe')
  expect(header('X-Frame-Options')).toBe('DENY')
  expect(header('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
  expect(header('X-Content-Type-Options')).toBe('nosniff')
})

test('con la CSP el sitio carga entero: portada y mapa, catálogo y modal, promos, personalizador', async ({ page }) => {
  test.setTimeout(90_000)
  const violaciones = await conCsp(page)

  await page.goto('/')
  // fonts.load devuelve [] si la hoja de Google no entró.
  await expect.poll(() => page.evaluate(async () => (await document.fonts.load('16px "Plus Jakarta Sans"')).length)).toBeGreaterThan(0)
  await page.getByText('Toca para abrir el mapa').first().click()
  await expect(page.locator('iframe[title^="Mapa"]').first()).toBeVisible()

  // Navegación con el ClientRouter (view transition), no recarga.
  await page.locator('a[href^="/products"]').filter({ visible: true }).first().click()
  await expect(page).toHaveURL(/\/products/)
  await page.locator('main a[data-foto]').first().click()
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Pedir por WhatsApp' })).toBeVisible()
  await page.keyboard.press('Escape')

  await page.goto('/promos')
  await expect(page.locator('main')).toBeVisible()

  // La isla hidrata (scripts inline de Astro) y el diseño entra como blob: al canvas.
  await page.goto('/personaliza')
  await expect(page.getByText('Tu diseño va aquí')).toBeVisible({ timeout: 15_000 })
  await page.locator('input[type=file]').first().setInputFiles({
    name: 'logo-prueba.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><circle cx="400" cy="400" r="300" fill="red"/></svg>'),
  })
  await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible({ timeout: 15_000 })

  expect(violaciones).toEqual([])
})
