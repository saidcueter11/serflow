import { expect, test, type Locator, type Page } from '@playwright/test'

// PRI-130: catálogo como galería de fotos contra el catálogo real del build (rejilla pareja en PRI-286; la foto abierta
// es el modal, ver e2e/modal.spec.ts). No depende de un producto concreto: entra por los links de las categorías.
const EMPTY = 'http://localhost:4232' // build con una categoría sin fotos, ver e2e/promos/scenarios.mjs

const tiles = (scope: Page | Locator) => scope.locator('a[id^="f-"]')
const chips = (page: Page) => page.getByRole('navigation', { name: 'Categorías' }).getByRole('link')
/** El nombre de la categoría de un chip ("Beisbol 23" -> "Beisbol"). */
const chipLabel = (chip: Locator) => chip.evaluate((a) => a.firstChild!.textContent!.trim())

/** Abre la primera categoría con al menos 2 fotos y devuelve su nombre y su href. */
async function openCategory(page: Page) {
  await page.goto('/products')
  const all = chips(page)
  for (let i = 1; i < (await all.count()); i++) {
    const chip = all.nth(i)
    if (Number(await chip.locator('span').innerText()) < 2) continue
    const label = await chipLabel(chip)
    const href = (await chip.getAttribute('href'))!
    await chip.click()
    await expect(page).toHaveURL(new RegExp(`${href}/?$`))
    return { label, href }
  }
  throw new Error('No category with 2+ photos')
}

test('wall: chips with counts and an even grid of 4:5 photos without text', async ({ page, isMobile }) => {
  await page.goto('/products')
  // Sin eslogan: el h1 es el nombre de la vista ("Catálogo" en Todo), uno solo.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Catálogo')
  await expect(page.getByText('Así quedan los trabajos')).toHaveCount(0)
  await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content', /Así quedan/)
  await expect(chips(page).first()).toHaveText(/^Todo\s*\d+$/)
  await expect(chips(page).first()).toHaveAttribute('aria-current', 'page')

  const wall = tiles(page)
  await expect(wall.nth(7)).toBeAttached()
  // Rejilla pareja (PRI-286): 2 columnas en el celular y 4 en desktop, todas las fotos 4:5 y del mismo alto.
  const boxes = await wall.evaluateAll((as) => as.map((a) => a.getBoundingClientRect()).map((r) => ({ x: Math.round(r.x), w: r.width, h: Math.round(r.height) })))
  expect(new Set(boxes.map((b) => b.x)).size).toBe(isMobile ? 2 : 4)
  expect(new Set(boxes.map((b) => b.h)).size).toBe(1)
  expect(boxes[0].w / boxes[0].h).toBeCloseTo(0.8, 1)

  // Sin nombre ni descripción en la tarjeta: solo la foto (la categoría va en el alt y en el chip del hover), sin
  // "Nuevo" y con el círculo con flecha que dice que se abre.
  const first = wall.first()
  await expect(first.locator('h2, h3, p')).toHaveCount(0)
  await expect(first.getByText('Nuevo')).toHaveCount(0)
  await expect(first.locator('svg path[d="M9 5l7 7-7 7"]')).toBeVisible()
  await expect(first.locator('img')).toHaveAttribute('alt', /, foto N\.º \d+$|^Foto de /)
  await expect(first.locator('img')).toHaveAttribute('loading', 'lazy')
})

test('banner arriba: full-bleed banner with the name on it, above the chips, slides to the chosen category', async ({ page }) => {
  await page.goto('/products')
  const frame = page.locator('[data-banner-track]').locator('..')
  const nav = page.getByRole('navigation', { name: 'Categorías' })
  expect((await frame.boundingBox())!.y).toBeLessThan((await nav.boundingBox())!.y)
  expect((await frame.boundingBox())!.width).toBeCloseTo(page.viewportSize()!.width, 0)
  // El nombre (h1) va encima del banner, dentro de su marco.
  const h1 = (await page.getByRole('heading', { level: 1 }).boundingBox())!
  const box = (await frame.boundingBox())!
  expect(h1.y).toBeGreaterThan(box.y)
  expect(h1.y + h1.height).toBeLessThan(box.y + box.height)

  const { label } = await openCategory(page)
  const current = page.locator('[data-banner-slide]:not([aria-hidden])')
  // La lámina de la categoría queda dentro del marco del banner (se deslizó hasta ella).
  await expect.poll(async () => Math.abs((await current.boundingBox())!.x - (await frame.boundingBox())!.x)).toBeLessThan(2)
  expect((await frame.boundingBox())!.y).toBeLessThan((await nav.boundingBox())!.y)
  await expect(chips(page).filter({ hasText: label })).toHaveAttribute('aria-current', 'page')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(label)
})

test('hundreds of photos: blocks of 60 with a link to the next block', async ({ page }) => {
  await page.goto('/products')
  const total = Number(await chips(page).first().locator('span').innerText())
  test.skip(total <= 60, `Only ${total} photos: a single block`)
  await expect(tiles(page)).toHaveCount(60)
  const more = page.getByRole('link', { name: `Ver ${Math.min(total - 60, 60)} más` })
  await expect(more).toHaveAttribute('href', '/products/pagina/2')
  await more.click()
  await expect(page).toHaveURL(/\/products\/pagina\/2\/?$/)
  await expect(tiles(page)).toHaveCount(Math.min(total - 60, 60))
})

test.describe('categoría vacía', () => {
  test.use({ baseURL: EMPTY })

  test('shows the empty state with a way out, and the chip says 0', async ({ page }) => {
    await page.goto('/products/e2e-vacia')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Vacía de prueba')
    await expect(chips(page).filter({ hasText: 'Vacía de prueba' })).toHaveText(/Vacía de prueba\s*0/)
    await expect(page.getByText('Todavía no hay fotos de Vacía de prueba')).toBeVisible()
    await expect(tiles(page)).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Ver lo más nuevo' })).toHaveAttribute('href', '/products')
    // Aquí el WhatsApp es el flotante.
    await expect(page.getByRole('link', { name: 'Escríbenos por WhatsApp' })).toBeVisible()
  })
})
