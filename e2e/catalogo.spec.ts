import { expect, test, type Locator, type Page } from '@playwright/test'

// PRI-130: catálogo como galería de fotos (dirección 2 "Pinterest / Unsplash") contra el catálogo real del build.
// No depende de un producto concreto: entra por los links de la galería y de las categorías.
const SITE = 'https://serflowctg.netlify.app'
const EMPTY = 'http://localhost:4232' // build con una categoría sin fotos, ver e2e/promos/scenarios.mjs

const tiles = (scope: Page | Locator) => scope.locator('a[id^="f-"]')
const chips = (page: Page) => page.getByRole('navigation', { name: 'Categorías' }).getByRole('link')
const waText = async (link: Locator) => new URL((await link.getAttribute('href'))!).searchParams.get('text')
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

test('masonry: welcome, chips with counts and photo columns of mixed heights without text', async ({ page, isMobile }) => {
  await page.goto('/products')
  await expect(page.getByRole('heading', { level: 1, name: 'Así quedan los trabajos' })).toBeVisible()
  await expect(chips(page).first()).toHaveText(/^Todo\s*\d+$/)
  await expect(chips(page).first()).toHaveAttribute('aria-current', 'page')

  const wall = tiles(page)
  await expect(wall.nth(7)).toBeAttached()
  // El orden baja por columna: las columnas se cuentan con todas las fotos, las alturas con las primeras 8.
  const boxes = await wall.evaluateAll((as) => as.map((a) => a.getBoundingClientRect()).map((r) => ({ x: Math.round(r.x), h: Math.round(r.height) })))
  expect(new Set(boxes.map((b) => b.x)).size).toBe(isMobile ? 2 : 4)
  expect(new Set(boxes.slice(0, 8).map((b) => b.h)).size).toBeGreaterThan(1)

  // Sin nombre ni descripción en la tarjeta: solo la foto (la categoría va en el alt y en el chip del hover).
  const first = wall.first()
  await expect(first.locator('h2, h3, p')).toHaveCount(0)
  await expect(first.locator('img')).toHaveAttribute('alt', /, foto N\.º \d+$|^Foto de /)
  await expect(first.locator('img')).toHaveAttribute('loading', 'lazy')
})

test('banner arriba: the category banner sits above the welcome and slides to the chosen category', async ({ page }) => {
  await page.goto('/products')
  const frame = page.locator('[data-banner-track]').locator('..')
  const h1 = page.getByRole('heading', { level: 1 })
  expect((await frame.boundingBox())!.y).toBeLessThan((await h1.boundingBox())!.y)
  await expect(page.locator('[data-banner-slide]:not([aria-hidden])')).toContainText('Todo')

  const { label } = await openCategory(page)
  const current = page.locator('[data-banner-slide]:not([aria-hidden])')
  await expect(current).toContainText(label)
  // La lámina de la categoría queda dentro del marco del banner (se deslizó hasta ella).
  await expect.poll(async () => Math.abs((await current.boundingBox())!.x - (await frame.boundingBox())!.x)).toBeLessThan(2)
  expect((await frame.boundingBox())!.y).toBeLessThan((await h1.boundingBox())!.y)
  await expect(chips(page).filter({ hasText: label })).toHaveAttribute('aria-current', 'page')
})

test('visor: big photo, Pedir por WhatsApp identifies the photo by category and link, no floating button', async ({ page }) => {
  const { label, href } = await openCategory(page)
  const tile = tiles(page).first()
  const photo = (await tile.getAttribute('href'))!
  await tile.click()
  await expect(page).toHaveURL(new RegExp(`${photo}/?$`))
  expect(photo.startsWith(`${href}/`)).toBe(true)

  await expect(page.getByRole('list', { name: /^Fotos de / }).locator('img').first()).toBeVisible()
  await expect(page.getByRole('main').getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href)
  const text = await waText(page.getByRole('link', { name: 'Pedir por WhatsApp' }))
  expect(text).toMatch(new RegExp(`^¡Hola! Me gustó esta de ${label}( \\(N\\.º \\d+\\))?\\. ¿Me hacen una así\\?\\n${SITE}${photo}$`))
  await expect(page.getByRole('link', { name: 'Escríbenos por WhatsApp' })).toHaveCount(0)

  // "Todas las fotos" vuelve a la galería, a esta misma foto.
  await page.getByRole('link', { name: 'Todas las fotos' }).click()
  await expect(page).toHaveURL(/\/products(\/pagina\/\d+)?\/?#f-/)
  await expect(page.locator(`a[href="${photo}"]`).first()).toBeInViewport()
})

test('Más de <categoría>: other photos of the same category and a link to all of them', async ({ page, isMobile }) => {
  const { label, href } = await openCategory(page)
  const count = Number(await chips(page).filter({ hasText: label }).locator('span').innerText())
  const photo = (await tiles(page).first().getAttribute('href'))!
  await tiles(page).first().click()
  await expect(page).toHaveURL(new RegExp(`${photo}/?$`))

  const mas = page.getByRole('region', { name: `Más de ${label}` })
  await expect(mas.getByRole('heading', { level: 2 })).toBeVisible()
  const others = tiles(mas)
  await expect(others).toHaveCount(Math.min(count - 1, 12))
  for (const h of await others.evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
    expect(h!.startsWith(`${href}/`)).toBe(true)
    expect(h).not.toBe(photo)
  }
  await expect(mas.locator('a[id^="f-"]:visible')).toHaveCount(Math.min(count - 1, isMobile ? 6 : 12))
  await expect(mas.getByRole('link', { name: `Ver las ${count} de ${label} →` })).toHaveAttribute('href', href)
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
    await expect(page.locator('[data-banner-slide]:not([aria-hidden])')).toContainText('Vacía de prueba')
    await expect(chips(page).filter({ hasText: 'Vacía de prueba' })).toHaveText(/Vacía de prueba\s*0/)
    await expect(page.getByText('Todavía no hay fotos de Vacía de prueba')).toBeVisible()
    await expect(tiles(page)).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Ver lo más nuevo' })).toHaveAttribute('href', '/products')
    // Aquí el WhatsApp es el flotante.
    await expect(page.getByRole('link', { name: 'Escríbenos por WhatsApp' })).toBeVisible()
  })
})
