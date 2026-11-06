import { expect, test, type Page } from '@playwright/test'

// PRI-150: fotos del sitio y colores del personalizador que publica el admin. El de 4232 no tiene nada publicado
// (respaldo); el de e2e/promos/server.mjs en 4235 tiene filas sembradas (scenarios.mjs), buenas y rotas.
const SEMBRADO = 'http://localhost:4235'

const colores = (page: Page) => page.locator('input[name=color]').evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value))

async function abrirPersonaliza(page: Page) {
  await page.goto('/personaliza')
  await expect(page.getByText('Tu diseño va aquí')).toBeVisible({ timeout: 15_000 })
}

test.describe('sin nada publicado', () => {
  // PRI-413: el build con tablas vacías, para que una publicación del cliente no ponga esto rojo.
  test.use({ baseURL: 'http://localhost:4232' })

  test('la portada, el catálogo y el personalizador salen con las fotos del repo', async ({ page }) => {
    await page.goto('/')
    const bloque = page.getByRole('img', { name: 'Gorras personalizadas en un estante del taller' }).filter({ visible: true })
    await expect(bloque).toHaveAttribute('src', /gorras-estante.*\.webp$/)
    await expect(bloque).toHaveAttribute('srcset', /640w.*1200w/)

    await page.goto('/products')
    await expect(page.locator('img[src*="gorras-estante"]').first()).toBeAttached()

    await abrirPersonaliza(page)
    expect(await colores(page)).toContain('negra')
  })
})

test.describe('con fotos y colores publicados', () => {
  test.use({ baseURL: SEMBRADO })

  test('la portada usa la foto y el alt de la base, optimizada en el mismo dominio', async ({ page }) => {
    await page.goto('/')
    const bloque = page.getByRole('img', { name: 'Foto de prueba del bloque' }).filter({ visible: true })
    await expect(bloque).toHaveAttribute('src', /^\/_astro\/.*\.webp$/)
    await bloque.scrollIntoViewIfNeeded()
    await expect.poll(() => bloque.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
    await expect(page.getByRole('img', { name: 'Gorras personalizadas en un estante del taller' })).toHaveCount(0)
  })

  test('una foto que ya no existe no tumba el build: ese lugar vuelve a la foto del repo', async ({ page }) => {
    await page.goto('/products')
    await expect(page.locator('img[src*="gorras-estante"]').first()).toBeAttached()
  })

  test('el personalizador saca solo los colores completos; la prenda sin colores usa la muestra', async ({ page }) => {
    await abrirPersonaliza(page)
    expect(await colores(page)).toEqual(['e2e-verde'])
    await expect(page.getByText('Verde', { exact: true })).toBeVisible()
    await expect(page.getByText('Sin espalda', { exact: true })).toHaveCount(0)
    await expect(page.getByText('Foto rota', { exact: true })).toHaveCount(0)

    await page.getByText('Gorra', { exact: true }).click()
    await expect(page.getByText('Negra', { exact: true })).toBeVisible()
    expect(await colores(page)).toContain('negra')
  })

  test('sin calibrar nada: el motor lee los píxeles de la foto de la base y el tamaño sale del valor por defecto', async ({ page }) => {
    await abrirPersonaliza(page)
    await page.locator('input[type=file]').first().setInputFiles({
      name: 'logo.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="#1e3cb4"/></svg>'),
    })
    await expect(page.getByRole('group', { name: /Tu diseño, unos \d+ cm de ancho/ })).toBeVisible()
    await page.getByText('Espalda', { exact: true }).click()
    await expect(page.getByRole('group', { name: /Tu diseño, unos \d+ cm de ancho/ })).toBeVisible()
    await expect.poll(() => page.locator('.pf-pz-vista canvas').evaluate((c: HTMLCanvasElement) => c.toDataURL())).toMatch(/^data:image/)
  })
})
