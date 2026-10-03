import { expect, test } from '@playwright/test'

// Smoke of the public catalog against the real Supabase data baked into the build.
test('home -> category -> product -> WhatsApp CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Nuestras Categorías' })).toBeVisible()

  const categoryLink = page.locator('a[href^="/products/"]').filter({ has: page.locator('h3') }).first()
  const categoryHref = await categoryLink.getAttribute('href')
  await categoryLink.click()
  await expect(page).toHaveURL(new RegExp(`${categoryHref}/?$`))
  const productLink = page.locator(`a[href^="${categoryHref}/"]`).first()
  await expect(productLink).toBeVisible()
  const productHref = await productLink.getAttribute('href')
  await productLink.click()
  await expect(page).toHaveURL(new RegExp(`${productHref}/?$`))
  await expect(page.getByRole('button', { name: 'Contactar por WhatsApp' })).toBeVisible()
})

test('unknown route shows the 404 page', async ({ page }) => {
  const res = await page.goto('/no-existe')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'Página no encontrada' })).toBeVisible()
})
