import { expect, test, type Page } from '@playwright/test'
import sharp from 'sharp'

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
    // La portada lo pinta dos veces, una por layout: el rol solo ve la del layout activo.
    const bloque = page.getByRole('img', { name: 'Gorras personalizadas en un estante del taller' })
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

  test('la portada usa la foto y el alt de la base, optimizada en el mismo dominio', async ({ page, request }) => {
    await page.goto('/')
    const bloque = page.getByRole('img', { name: 'Foto de prueba del bloque' })
    await expect(bloque).toHaveAttribute('src', /^\/_astro\/.*\.webp$/)
    const foto = await request.get((await bloque.getAttribute('src'))!)
    expect(foto.ok()).toBe(true)
    expect(foto.headers()['content-type']).toBe('image/webp')
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

    await page.getByText('Gorra acrílica', { exact: true }).click()
    await expect(page.getByText('Negra', { exact: true })).toBeVisible()
    expect(await colores(page)).toContain('negra')
  })

  test('las fotos de la base salen en dos anchos: cada pantalla baja solo la suya, y va de primera', async ({ page, request }) => {
    const html = await (await request.get('/personaliza')).text()
    const escritorio = html.match(/<source[^>]*srcset="([^"]+)"/i)![1]
    const movil = html.match(/<img[^>]*src="([^"]+)"[^>]*fetchpriority="high"/i)![1]
    expect(movil).toMatch(/^\/_astro\/.*\.webp$/)
    expect(escritorio).toMatch(/^\/_astro\/.*\.webp$/)
    const ancho = async (url: string) => (await sharp(await (await request.get(url)).body()).metadata()).width
    expect(await ancho(movil)).toBeLessThanOrEqual(720)
    expect(await ancho(escritorio)).toBeGreaterThan(await ancho(movil))

    const pedidas: string[] = []
    page.on('request', (r) => pedidas.push(new URL(r.url()).pathname))
    await abrirPersonaliza(page)
    const [suya, otra] = test.info().project.name === 'mobile' ? [movil, escritorio] : [escritorio, movil]
    await expect.poll(() => pedidas).toContain(suya)
    expect(pedidas).not.toContain(otra)
  })

  test('sin calibrar nada: el motor lee los píxeles de la foto de la base y el tamaño sale del valor por defecto', async ({ page }) => {
    await abrirPersonaliza(page)
    await page.locator('input[type=file]').first().setInputFiles({
      name: 'logo.png',
      mimeType: 'image/png',
      // Un PNG de 1 × 1, rojo.
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64'),
    })
    await expect(page.getByRole('group', { name: /Tu diseño, unos \d+ cm de ancho/ })).toBeVisible()
    await page.getByText('Espalda', { exact: true }).click()
    await expect(page.getByRole('group', { name: /Tu diseño, unos \d+ cm de ancho/ })).toBeVisible()
    await expect.poll(() => page.locator('.pf-pz-vista canvas').evaluate((c: HTMLCanvasElement) => c.toDataURL())).toMatch(/^data:image/)
  })
})
