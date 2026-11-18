import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { MODAL } from './promos/scenarios.mjs'

// PRI-529: /catalogo/<categoría>/<slug>/ es la ficha propia del producto (antes, el muro con el modal abierto). Contra el
// catálogo sembrado de 4240 (e2e/promos/scenarios.mjs): una prenda con 3 fotos, nombre, precio, colores y descripción;
// una sin nombre ni precio y una con precio en cero.
test.use({ baseURL: 'http://localhost:4240' })

const { categoria, completa } = MODAL
const ficha = (slug: string) => `/catalogo/${categoria.slug}/${slug}/`
const foto = (page: Page) => page.getByRole('button', { name: `Ampliar: ${completa.name}, ${categoria.label}, foto 1 de 3` })
const visor = (page: Page) => page.getByRole('dialog', { name: `${completa.name}, fotos` })
/** Sin scroll de lado: si la página se ensancha, la BarraPedir del celular queda fuera de la pantalla. */
const sinScrollDeLado = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)

test('the product page shows name, price, colors and description, with a single WhatsApp button', async ({ page, isMobile }) => {
  await page.goto(ficha(completa.slug))
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(completa.name)
  await expect(page).toHaveTitle(`${completa.name} — Serflow`)
  await expect(page.getByText('$45.000', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Viene en 4 colores' })).toBeVisible()
  await expect(page.getByRole('list', { name: 'Colores disponibles' }).getByRole('listitem')).toHaveText(MODAL.colores.map((c) => c.name))
  await expect(page.getByText(completa.description)).toBeVisible()
  // Es la página, no el muro con el modal.
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('link', { name: categoria.label }).first()).toHaveAttribute('href', `/catalogo/${categoria.slug}`)

  // Un solo WhatsApp por pantalla: el botón (escritorio) o la barra fija (celular), sin el flotante.
  const pedir = page.getByRole('link', { name: 'Pedir por WhatsApp' })
  await expect(pedir.filter({ visible: true })).toHaveCount(1)
  expect(await sinScrollDeLado(page)).toBe(true)
  if (isMobile) await expect(pedir.filter({ visible: true })).toBeInViewport()
  await expect(page.getByRole('link', { name: 'Escríbenos por WhatsApp' })).toHaveCount(0)
  const texto = new URL((await pedir.filter({ visible: true }).getAttribute('href'))!).searchParams.get('text')!
  expect(texto).toContain(`/catalogo/${categoria.slug}/${completa.slug}`)

  // "Más de <categoría>": las otras dos del muro.
  const mas = page.locator('section').filter({ has: page.getByRole('heading', { name: `Más de ${categoria.label}` }) })
  await expect(mas.getByRole('link', { name: `${categoria.label} N.º 7` })).toBeVisible()
})

test('without a price nothing is shown in its place', async ({ page }) => {
  for (const [slug, nombre] of [
    [MODAL.vacia.slug, `${categoria.label} N.º 7`],
    [MODAL.cero.slug, MODAL.cero.name],
  ]) {
    await page.goto(ficha(slug))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(nombre)
    await expect(page.locator('main').getByText(/^\$\s?\d/)).toHaveCount(0)
    await expect(page.getByRole('list', { name: 'Colores disponibles' })).toHaveCount(0)
    expect(await sinScrollDeLado(page), slug).toBe(true)
  }
})

test('desktop: hovering the photo turns the magnifier on beside it', async ({ page, isMobile }) => {
  test.skip(isMobile, 'La lupa al lado es del mouse.')
  await page.goto(ficha(completa.slug))
  const lupa = page.locator('.lupa')
  await expect(lupa).toBeHidden()
  await foto(page).hover()
  await expect(lupa).toBeVisible()
  await page.mouse.move(5, 5)
  await expect(lupa).toBeHidden()
})

test('desktop: the magnifier panel shows the zone under the frame, opaque and without blinking', async ({ page, isMobile }) => {
  test.skip(isMobile, 'La lupa al lado es del mouse.')
  await page.goto(ficha(completa.slug))
  const lupa = page.locator('.lupa')
  // Cuenta cada vez que el panel se apaga.
  await lupa.evaluate((el) => {
    const w = window as unknown as { apagadas: number }
    w.apagadas = 0
    new MutationObserver(() => !el.hasAttribute('data-on') && w.apagadas++).observe(el, { attributeFilter: ['data-on'] })
  })
  const caja = (await foto(page).boundingBox())!
  /** Dónde debería ir el fondo del panel: el recuadro por 2,5, con la foto a cover (centrada si desborda). */
  const esperado = () =>
    page.evaluate(() => {
      const f = document.querySelector<HTMLElement>('.gp-foto')!
      const img = f.querySelector('img')!
      const l = getComputedStyle(f.querySelector('.gp-lente')!)
      const c = Math.max(f.offsetWidth / img.naturalWidth, f.offsetHeight / img.naturalHeight)
      const ox = (f.offsetWidth - img.naturalWidth * c) / 2
      const oy = (f.offsetHeight - img.naturalHeight * c) / 2
      return [(ox - parseFloat(l.left)) * 2.5, (oy - parseFloat(l.top)) * 2.5]
    })
  const fondo = () => lupa.evaluate((el) => getComputedStyle(el).backgroundPosition.split(' ').map(parseFloat))

  const posiciones = []
  for (const [fx, fy] of [
    [0.3, 0.3],
    [0.65, 0.6],
  ]) {
    await page.mouse.move(caja.x + caja.width * fx, caja.y + caja.height * fy, { steps: 6 })
    await expect(lupa).toBeVisible()
    const e = await esperado()
    // A menos de un píxel: el navegador redondea las posiciones.
    await expect.poll(async () => (await fondo()).every((v, i) => Math.abs(v - e[i]) < 1)).toBe(true)
    posiciones.push(e)
  }
  expect(posiciones[0]).not.toEqual(posiciones[1])
  // El panel tapa la información entero: opaco, sin la entrada que lo funde desde 0.
  expect(await lupa.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
  expect(await page.evaluate(() => (window as unknown as { apagadas: number }).apagadas)).toBe(0)

  await page.mouse.move(5, 5)
  await expect(lupa).toBeHidden()
})

test('the viewer opens, zooms in, closes with Esc and gives focus back to the photo', async ({ page, isMobile }) => {
  await page.goto(ficha(completa.slug))
  if (isMobile) await foto(page).tap()
  else await foto(page).click()
  await expect(visor(page)).toBeVisible()
  await expect(visor(page).getByText('1 / 3')).toBeVisible()

  const zona = visor(page).locator('[data-vf-zona]')
  await zona.focus()
  await page.keyboard.press('Enter')
  await expect(zona).toHaveAttribute('data-z', '')
  if (!isMobile) {
    await visor(page).getByRole('button', { name: 'Ajustar' }).click()
    await expect(zona).not.toHaveAttribute('data-z')
    await visor(page).getByRole('button', { name: 'Acercar' }).click()
    await expect(visor(page).locator('[data-vf-pct]')).not.toHaveText('100 %')
  }

  await page.keyboard.press('Escape')
  await expect(visor(page)).toBeHidden()
  await expect(foto(page)).toBeFocused()
})

test('phone: holding the photo zooms in and does not open the viewer', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mantén para acercar es del celular.')
  await page.goto(ficha(completa.slug))
  const b = (await foto(page).boundingBox())!
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2)
  await page.mouse.down()
  await expect(foto(page)).toHaveAttribute('data-cerca', '')
  await page.mouse.up()
  await expect(foto(page)).not.toHaveAttribute('data-cerca')
  await expect(visor(page)).toBeHidden()
})

test('axe finds no violations on the product page, with the viewer closed and open', async ({ page, isMobile }) => {
  // Sin animaciones de entrada: el contraste se mide con el texto ya quieto.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(ficha(completa.slug))
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])

  if (isMobile) await foto(page).tap()
  else await foto(page).click()
  await expect(visor(page)).toBeVisible()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})
