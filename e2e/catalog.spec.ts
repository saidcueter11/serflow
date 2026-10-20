import { expect, test } from '@playwright/test'

// Smoke of the public catalog against the real Supabase data baked into the build.
// PRI-129: the home has no category grid anymore; it reaches the catalog through "Disponible ahora".
test('home -> product -> WhatsApp CTA, and Ver todo opens a category', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Disponible ahora' })).toBeVisible()
  await expect(page.getByText('Mercado Bazurto, C.C. Bazurtico, local 31').first()).toBeVisible()

  const verTodo = page.getByRole('link', { name: 'Ver todo →' })
  await expect(verTodo).toHaveAttribute('href', /^\/products\/[^/]+$/)

  const productLink = page.locator('#disponible a[href^="/products/"]').filter({ has: page.locator('h3') }).first()
  const productHref = await productLink.getAttribute('href')
  await productLink.click()
  await expect(page).toHaveURL(new RegExp(`${productHref}/?$`))
  await expect(page.getByRole('button', { name: 'Contactar por WhatsApp' })).toBeVisible()
})

test('unknown route shows the 404 page', async ({ page }) => {
  const res = await page.goto('/no-existe')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'Esta página no existe' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Escríbenos por WhatsApp' }).first()).toHaveAttribute('href', /^https:\/\/wa\.me\//)
  await expect(page.getByRole('link', { name: 'Ir al inicio' })).toHaveAttribute('href', '/')
})

// PRI-120: touch has no hover, so links must be prefetched before the tap or navigation waits on the network.
test('visible product links are prefetched before the tap', async ({ page }) => {
  await page.goto('/')
  const productLink = page.locator('#disponible a[href^="/products/"]').filter({ has: page.locator('h3') }).first()
  await productLink.scrollIntoViewIfNeeded()
  const href = (await productLink.getAttribute('href'))!.replace(/\/$/, '')
  await expect
    .poll(() =>
      page.evaluate(
        (h) =>
          performance
            .getEntriesByType('resource')
            .some((e) => new URL(e.name).pathname.replace(/\/$/, '') === h),
        href,
      ),
    )
    .toBe(true)
})
