import { expect, test, type Page } from '@playwright/test'

// PRI-286: la foto se abre en un modal encima del catálogo (ya no hay página de detalle). Contra el catálogo real del
// build: entra por las pestañas y las fotos, sin depender de un producto concreto.
const SITE = 'https://serflowctg.netlify.app'

const tiles = (page: Page) => page.locator('main a[data-foto]')
const dialog = (page: Page) => page.getByRole('dialog')
const waText = async (page: Page) =>
  new URL((await dialog(page).getByRole('link', { name: 'Pedir por WhatsApp' }).getAttribute('href'))!).searchParams.get('text')

/** Un gesto de dedo de verdad (eventos táctiles de Chromium), de x1 a x2 a la altura y. */
async function swipe(page: Page, x1: number, x2: number, y: number) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y }] })
  for (let k = 1; k <= 5; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x1 + ((x2 - x1) * k) / 5, y }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
}

/** Abre la primera categoría con al menos 3 fotos y devuelve su nombre, su href y cuántas fotos tiene. */
async function openCategory(page: Page) {
  await page.goto('/products')
  const chips = page.getByRole('navigation', { name: 'Categorías' }).getByRole('link')
  for (let i = 1; i < (await chips.count()); i++) {
    const chip = chips.nth(i)
    const count = Number(await chip.locator('span').innerText())
    if (count < 3) continue
    const label = await chip.evaluate((a) => a.firstChild!.textContent!.trim())
    const href = (await chip.getAttribute('href'))!
    await page.goto(href)
    return { label, href, count }
  }
  throw new Error('No category with 3+ photos')
}

test('tapping a photo opens the modal: whole photo, counter, name and Pedir por WhatsApp with its own URL', async ({ page, isMobile }) => {
  const { label, href, count } = await openCategory(page)
  const tile = tiles(page).nth(1)
  const photo = (await tile.getAttribute('href'))!
  expect(photo).toMatch(new RegExp(`^/catalogo/${href.split('/').pop()}/[^/]+$`))
  await tile.click()

  await expect(dialog(page)).toBeVisible()
  await expect(dialog(page)).toHaveAttribute('aria-modal', 'true')
  await expect(page).toHaveURL(new RegExp(`${photo}$`))
  await expect(dialog(page).getByText(`2 / ${count}`)).toBeVisible()
  // El nombre del admin, o el de la foto si no tiene (PRI-433; lo exacto lo prueba e2e/modal-celular.spec.ts).
  const { titulo } = JSON.parse((await tile.getAttribute('data-foto'))!)
  await expect(dialog(page).getByRole('heading', { level: 2 })).toHaveText(titulo)
  const img = dialog(page).locator('img.mx-foto')
  await expect(img).toHaveCSS('object-fit', 'contain')
  await expect(img).toHaveAttribute('alt', /, foto N\.º \d+$|^Foto de /)
  expect(await waText(page)).toMatch(new RegExp(`^¡Hola! Me gustó esta de ${label}( \\(N\\.º \\d+\\))?\\. ¿Me hacen una así\\?\\n${SITE}${photo}$`))

  // 1280: la info va debajo de la foto, en una fila (nombre a la izquierda, Pedir a la derecha).
  // 390: pantalla completa con Pedir fijo abajo.
  const foto = (await img.boundingBox())!
  const pedir = (await dialog(page).getByRole('link', { name: 'Pedir por WhatsApp' }).boundingBox())!
  const nombre = (await dialog(page).getByRole('heading', { level: 2 }).boundingBox())!
  const vp = page.viewportSize()!
  expect(pedir.y).toBeGreaterThan(foto.y + foto.height)
  if (isMobile) {
    expect(pedir.y + pedir.height).toBeLessThanOrEqual(vp.height)
    expect(pedir.y + pedir.height).toBeGreaterThan(vp.height - 120)
    expect(pedir.width).toBeGreaterThan(vp.width - 60)
  } else {
    expect(pedir.x).toBeGreaterThan(nombre.x + nombre.width)
    expect(Math.abs(nombre.y - pedir.y)).toBeLessThan(40)
  }
})

test('arrows, keys and swipe go through the category without wrapping', async ({ page, isMobile }) => {
  const { count } = await openCategory(page)
  const hrefs = await tiles(page).evaluateAll((as) => as.map((a) => a.getAttribute('href')))
  await tiles(page).first().click()
  await expect(dialog(page).getByText(`1 / ${count}`)).toBeVisible()
  // En la primera no se pinta "anterior".
  await expect(dialog(page).getByRole('button', { name: 'Foto anterior' })).toHaveCount(0)

  await dialog(page).getByRole('button', { name: 'Foto siguiente' }).click()
  await expect(dialog(page).getByText(`2 / ${count}`)).toBeVisible()
  await expect(page).toHaveURL(new RegExp(`${hrefs[1]}$`))

  if (isMobile) {
    // Deslizar con el dedo hacia la izquierda pasa a la siguiente; hacia la derecha, a la anterior.
    const foto = (await dialog(page).locator('img.mx-foto').boundingBox())!
    const y = foto.y + foto.height / 2
    await swipe(page, foto.x + foto.width - 20, foto.x + 20, y)
    await expect(dialog(page).getByText(`3 / ${count}`)).toBeVisible()
    await swipe(page, foto.x + 20, foto.x + foto.width - 20, y)
    await expect(dialog(page).getByText(`2 / ${count}`)).toBeVisible()
    // La orilla de la siguiente también es un botón.
    await dialog(page).getByRole('button', { name: 'Foto siguiente' }).click()
    await expect(dialog(page).getByText(`3 / ${count}`)).toBeVisible()
    await dialog(page).getByRole('button', { name: 'Foto anterior' }).click()
    await expect(dialog(page).getByText(`2 / ${count}`)).toBeVisible()
  } else {
    await page.keyboard.press('ArrowRight')
    await expect(dialog(page).getByText(`3 / ${count}`)).toBeVisible()
    await page.keyboard.press('ArrowLeft')
    await expect(dialog(page).getByText(`2 / ${count}`)).toBeVisible()
  }
  await expect(page).toHaveURL(new RegExp(`${hrefs[1]}$`))
})

test('Esc, the X and a click outside close it; the URL and the focus go back to the photo', async ({ page, isMobile }) => {
  const { href } = await openCategory(page)
  const tile = tiles(page).nth(2)

  await tile.click()
  await expect(dialog(page)).toBeVisible()
  // El foco queda en el modal: arranca en la X y Tab recorre sus botones.
  await expect(dialog(page).getByRole('button', { name: 'Cerrar' })).toBeFocused()
  for (let i = 0; i < 3; i++) await page.keyboard.press('Tab')
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog(page)).toBeHidden()
  await expect(page).toHaveURL(new RegExp(`${href}/?$`))
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
    await expect(page).toHaveURL(new RegExp(`${href}/?$`))
  }
})

test('the photo URL opens the catalog with the modal open, with its own preview for WhatsApp', async ({ page }) => {
  const { href } = await openCategory(page)
  const photo = (await tiles(page).nth(1).getAttribute('href'))!
  const alt = (await tiles(page).nth(1).locator('img').getAttribute('alt'))!

  await page.goto(photo)
  await expect(dialog(page)).toBeVisible()
  await expect(dialog(page).locator('img.mx-foto')).toHaveAttribute('alt', alt)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https?:\/\//)
  await expect(page.locator('meta[property="og:url"]').last()).toHaveAttribute('content', `${SITE}${photo}`)

  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(new RegExp(`${href}/?$`))
  await expect(page.locator(`main a[href="${photo}"]`)).toBeFocused()
})

test('Disponible ahora opens the modal over the home and goes through those photos', async ({ page }) => {
  await page.goto('/')
  const prendas = page.locator('#disponible a[data-foto]')
  const n = await prendas.count()
  expect(n).toBeGreaterThan(0)
  const photo = (await prendas.first().getAttribute('href'))!
  await prendas.first().click()
  await expect(dialog(page)).toBeVisible()
  await expect(dialog(page).getByText(`1 / ${n}`)).toBeVisible()
  await expect(page).toHaveURL(new RegExp(`${photo}$`))
  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
