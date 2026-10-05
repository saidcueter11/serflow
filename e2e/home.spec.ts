import { expect, test } from '@playwright/test'
import { ADDRESS } from '../src/lib/business'

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

test('with reduced motion the hero keeps its first photo and hides the rest', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const slides = page.locator('.hero-carousel figure')
  await expect(slides.first()).toHaveCSS('opacity', '1')
  await expect(slides.first().locator('img')).toBeVisible()
  await expect(slides.nth(1)).toHaveCSS('opacity', '0')
})
