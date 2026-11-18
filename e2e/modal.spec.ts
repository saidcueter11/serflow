import { expect, test, type Page } from '@playwright/test'
import { SITE_URL } from '../src/lib/site.mjs'

// PRI-286: la foto abierta en un modal (PhotoModal). Desde PRI-529 el muro del catálogo y "Disponible ahora" llevan a la
// ficha (e2e/muro-ficha.spec.ts) y el modal queda para las promos: su mecánica se prueba en /promos del build sembrado
// de 3 promos (4234, e2e/promos/scenarios.mjs), la primera con 4 fotos. La última prueba va contra el catálogo real.
const SITE = SITE_URL
const PROMOS = 'http://localhost:4234/promos'

const tiles = (page: Page) => page.locator('main a[data-foto]')
const dialog = (page: Page) => page.getByRole('dialog')
const foto = (page: Page) => dialog(page).locator('img.mx-foto')

/** Un gesto de dedo de verdad (eventos táctiles de Chromium), de x1 a x2 a la altura y. */
async function swipe(page: Page, x1: number, x2: number, y: number) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y }] })
  for (let k = 1; k <= 5; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x1 + ((x2 - x1) * k) / 5, y }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
}

/** Abre la primera categoría con al menos 3 fotos. */
async function openCategory(page: Page) {
  await page.goto('/catalogo')
  const chips = page.getByRole('navigation', { name: 'Categorías' }).getByRole('link')
  for (let i = 1; i < (await chips.count()); i++) {
    const chip = chips.nth(i)
    if (Number(await chip.locator('span').innerText()) < 3) continue
    await page.goto((await chip.getAttribute('href'))!)
    return
  }
  throw new Error('No category with 3+ photos')
}

test('tapping a promo photo opens the modal: whole photo, counter, name and Pedir por WhatsApp', async ({ page, isMobile }) => {
  await page.goto(PROMOS)
  const tile = tiles(page).first()
  const photo = (await tile.getAttribute('href'))!
  await tile.click()

  await expect(dialog(page)).toBeVisible()
  await expect(dialog(page)).toHaveAttribute('aria-modal', 'true')
  await expect(page).toHaveURL(new RegExp(`${photo}$`))
  await expect(dialog(page).getByText(`1 / ${await tiles(page).count()}`)).toBeVisible()
  const { titulo, alt } = JSON.parse((await tile.getAttribute('data-foto'))!)
  await expect(dialog(page).getByRole('heading', { level: 2 })).toHaveText(titulo)
  await expect(foto(page)).toHaveCSS('object-fit', 'contain')
  expect(alt).toMatch(/\S/)
  await expect(foto(page)).toHaveAttribute('alt', alt)

  // 1280: la info va debajo de la foto, en una fila (nombre a la izquierda, Pedir a la derecha).
  // 390: pantalla completa con Pedir fijo abajo. Se mide quieto, cuando la foto terminó de crecer.
  await dialog(page).evaluate((d) => Promise.allSettled(d.getAnimations({ subtree: true }).map((a) => a.finished)))
  const f = (await foto(page).boundingBox())!
  const pedir = (await dialog(page).getByRole('link', { name: 'Pedir por WhatsApp' }).boundingBox())!
  const nombre = (await dialog(page).getByRole('heading', { level: 2 }).boundingBox())!
  const vp = page.viewportSize()!
  expect(pedir.y).toBeGreaterThan(f.y + f.height)
  if (isMobile) {
    expect(pedir.y + pedir.height).toBeLessThanOrEqual(vp.height)
    expect(pedir.y + pedir.height).toBeGreaterThan(vp.height - 120)
    expect(pedir.width).toBeGreaterThan(vp.width - 60)
  } else {
    expect(pedir.x).toBeGreaterThan(nombre.x + nombre.width)
    expect(Math.abs(nombre.y - pedir.y)).toBeLessThan(40)
  }
})

test('arrows, keys and swipe go through the photos without wrapping', async ({ page, isMobile }) => {
  await page.goto(PROMOS)
  const photo = (await tiles(page).first().getAttribute('href'))!
  await tiles(page).first().click()
  await expect(foto(page)).not.toHaveAttribute('alt', /, foto \d/)
  // En la primera no se pinta "anterior".
  await expect(dialog(page).getByRole('button', { name: 'Foto anterior' })).toHaveCount(0)

  await dialog(page).getByRole('button', { name: 'Foto siguiente' }).click()
  await expect(foto(page)).toHaveAttribute('alt', /, foto 2 de \d+$/)

  if (isMobile) {
    // Deslizar con el dedo hacia la izquierda pasa a la siguiente; hacia la derecha, a la anterior.
    const caja = (await foto(page).boundingBox())!
    const y = caja.y + caja.height / 2
    await swipe(page, caja.x + caja.width - 20, caja.x + 20, y)
    await expect(foto(page)).toHaveAttribute('alt', /, foto 3 de \d+$/)
    await swipe(page, caja.x + 20, caja.x + caja.width - 20, y)
    await expect(foto(page)).toHaveAttribute('alt', /, foto 2 de \d+$/)
    // La orilla de la siguiente también es un botón.
    await dialog(page).getByRole('button', { name: 'Foto siguiente' }).click()
    await expect(foto(page)).toHaveAttribute('alt', /, foto 3 de \d+$/)
    await dialog(page).getByRole('button', { name: 'Foto anterior' }).click()
    await expect(foto(page)).toHaveAttribute('alt', /, foto 2 de \d+$/)
  } else {
    await page.keyboard.press('ArrowRight')
    await expect(foto(page)).toHaveAttribute('alt', /, foto 3 de \d+$/)
    await page.keyboard.press('ArrowLeft')
    await expect(foto(page)).toHaveAttribute('alt', /, foto 2 de \d+$/)
  }
  // Fotos de la misma promo: la URL no cambia.
  await expect(page).toHaveURL(new RegExp(`${photo}$`))
})

test('Esc, the X and a click outside close it; the URL and the focus go back to the photo', async ({ page, isMobile }) => {
  await page.goto(PROMOS)
  const tile = tiles(page).first()

  await tile.click()
  await expect(dialog(page)).toBeVisible()
  // El foco queda en el modal: arranca en la X y Tab recorre sus botones (en la primera: Foto siguiente y Pedir).
  await expect(dialog(page).getByRole('button', { name: 'Cerrar' })).toBeFocused()
  for (let i = 0; i < 2; i++) await page.keyboard.press('Tab')
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog(page)).toBeHidden()
  await expect(page).toHaveURL(/\/promos\/?$/)
  await expect(tile).toBeFocused()

  await tile.click()
  await dialog(page).getByRole('button', { name: 'Cerrar' }).click()
  await expect(dialog(page)).toBeHidden()
  await expect(tile).toBeFocused()

  if (!isMobile) {
    await tile.click()
    await expect(dialog(page)).toBeVisible()
    await page.mouse.click(10, page.viewportSize()!.height - 10)
    await expect(dialog(page)).toBeHidden()
    await expect(page).toHaveURL(/\/promos\/?$/)
  }
})

test('the photo URL on the catalog wall is the product page, with its own preview for WhatsApp', async ({ page }) => {
  await openCategory(page)
  const tile = page.locator('main [data-fotos] a').nth(1)
  const photo = (await tile.getAttribute('href'))!
  const alt = (await tile.locator('img').getAttribute('alt'))!
  // PRI-529: con la "/" final del canonical, la misma del mensaje de WhatsApp.
  expect(photo).toMatch(/^\/catalogo\/[^/]+\/[^/]+\/$/)

  await page.goto(photo)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(dialog(page)).toHaveCount(0)
  // Con varias fotos lleva ", foto 1 de N" al final.
  await expect(page.locator('[data-gp-pista] img').first()).toBeVisible()
  expect((await page.locator('[data-gp-pista] img').first().getAttribute('alt'))!.startsWith(alt)).toBe(true)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https?:\/\//)
  await expect(page.locator('meta[property="og:url"]').last()).toHaveAttribute('content', `${SITE}${photo}`)
  const texto = new URL((await page.getByRole('link', { name: 'Pedir por WhatsApp' }).first().getAttribute('href'))!).searchParams.get('text')
  expect(texto).toMatch(new RegExp(`\\n${SITE}${photo}$`))
})
