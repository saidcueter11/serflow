import { expect, test } from '@playwright/test'
import { ADDRESS } from '../src/lib/business'

// PRI-413: fixed copy lives on the build with empty content tables, so a client edit can't turn these red.
test.use({ baseURL: 'http://localhost:4232' })

// PRI-129 ("B ajustada"): the business data shows up once, and WhatsApp has one generic entry (the floating button)
// plus the hero call to action. The header carries no WhatsApp button anymore.
test('home: address and hours once, map visible, WhatsApp only in the hero and the floating button', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Bienvenido a Serflow' })).toBeVisible()

  const visitanos = page.locator('#visitanos')
  await expect(visitanos.getByTitle('Mapa de Serflow en Cartagena')).toBeAttached()
  await expect(page.getByText(ADDRESS!, { exact: true })).toHaveCount(1)
  await expect(page.getByText('Lunes a sábado')).toHaveCount(1)

  await expect(page.locator('header a[href*="wa.me"]')).toHaveCount(0)
  await expect(page.locator('main a[href*="wa.me"]')).toHaveCount(1)
  await expect(page.getByRole('link', { name: 'Escríbenos por WhatsApp' }).last()).toBeVisible()
})

test('header "Visítanos" goes to the map', async ({ page, isMobile }) => {
  await page.goto('/')
  if (isMobile) await page.getByLabel('Abrir menú').click()
  await page.getByRole('link', { name: 'Visítanos' }).filter({ visible: true }).first().click()
  await expect(page).toHaveURL(/#visitanos$/)
  await expect(page.locator('#visitanos')).toBeInViewport()
})

test('with reduced motion the hero keeps its first photo and only its bar is full', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const slides = page.locator('.hero-carousel figure')
  await expect(slides.first()).toHaveCSS('opacity', '1')
  await expect(slides.first().locator('img')).toBeVisible()
  await expect(slides.nth(1)).toHaveCSS('opacity', '0')
  // PRI-286: la barra de la foto que se ve, llena; las de las demás, vacías (no las 4 llenas).
  const bars = page.locator('.hero-carousel .anim-bar')
  await expect(bars).toHaveCount(4)
  await expect(bars.first()).toHaveCSS('transform', 'none')
  await expect(bars.nth(1)).toHaveCSS('transform', 'matrix(0, 0, 0, 1, 0, 0)')
})

// PRI-286: portada nueva. Hero a sangre en carrusel (las 4 fotos), Diseña la tuya arriba, sin ticker ni "Nuevo", y
// Visítanos al final con el mapa plegado.
test('hero carousel full-bleed with 4 photos, sections in the new order, folded map', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('.hero-carousel')
  const box = (await hero.boundingBox())!
  expect(box.x).toBe(0)
  expect(box.width).toBeCloseTo(page.viewportSize()!.width, 0)
  await expect(hero.locator('figure img')).toHaveCount(4)
  await expect(hero.locator('.anim-bar')).toHaveCount(4)
  await expect(hero.locator('figcaption')).toHaveCount(0)

  const ys = []
  for (const id of ['#personaliza-titulo', '#que-hacemos', '#disponible', '#quienes-somos', '#visitanos']) {
    ys.push((await page.locator(id).boundingBox())!.y)
  }
  expect(ys).toEqual([...ys].sort((a, b) => a - b))
  expect(ys[0]).toBeGreaterThan(box.y + box.height)

  await expect(page.locator('.anim-ticker')).toHaveCount(0)
  await expect(page.locator('main').getByText('Nuevo', { exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Diseñar mi prenda' })).toHaveAttribute('href', '/personaliza')
  // Mapa plegado: el de Google no se pinta hasta tocarlo.
  await expect(page.locator('#visitanos details')).not.toHaveAttribute('open')
  await expect(page.locator('#visitanos').getByTitle('Mapa de Serflow en Cartagena')).toBeHidden()
})

// PRI-414: la foto de "Diseña la tuya" se renderiza dos veces (celular y desktop) y una siempre está en display: none.
// filter visible descarta esa y también una foto de 0x0, que es el bug: debe quedar exactamente una con tamaño.
for (const width of [390, 768]) {
  test(`"Diseña la tuya" shows its photo at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    const fotos = page.locator('section[aria-labelledby="personaliza-titulo"] img')
    await expect(fotos.filter({ visible: true })).toHaveCount(1)
  })
}
