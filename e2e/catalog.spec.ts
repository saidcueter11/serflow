import { expect, test } from '@playwright/test'

// Smoke of the public catalog against the real Supabase data baked into the build.
// PRI-129: the home has no category grid anymore; it reaches the catalog through "Disponible ahora".
// PRI-123: what is in "Disponible ahora" is up to the client, so the home tests use the build of 4232, with 4 real
// products switched on (e2e/promos/scenarios.mjs).
const HOME = 'http://localhost:4232/'

test('home -> product opens its photo with the WhatsApp CTA, and Ver todo opens a category', async ({ page }) => {
  await page.goto(HOME)
  await expect(page.locator('#disponible-titulo')).toBeVisible()
  await expect(page.locator('#visitanos')).toBeVisible()

  const verTodo = page.getByRole('link', { name: 'Ver todo →' })
  await expect(verTodo).toHaveAttribute('href', /^\/products\/[^/]+$/)

  // PRI-286: la prenda se abre en el modal, encima de la portada.
  const productLink = page.locator('#disponible a[href^="/catalogo/"]').filter({ has: page.locator('h3') }).first()
  const productHref = await productLink.getAttribute('href')
  await productLink.click()
  await expect(page).toHaveURL(new RegExp(`${productHref}/?$`))
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Pedir por WhatsApp' })).toHaveAttribute('href', /^https:\/\/wa\.me\//)
})

test('unknown route shows the 404 page', async ({ page }) => {
  const res = await page.goto('/no-existe')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'Esta página no existe' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Escríbenos por WhatsApp' }).first()).toHaveAttribute('href', /^https:\/\/wa\.me\//)
  await expect(page.getByRole('link', { name: 'Ir al inicio' })).toHaveAttribute('href', '/')
})

// PRI-120: touch has no hover, so links must be prefetched before the tap or navigation waits on the network.
// PRI-286: the products open in the modal (no navigation), so the link to check is the one to the catalog.
test('the visible catalog link is prefetched before the tap', async ({ page }) => {
  await page.goto(HOME)
  const catalogLink = page.getByRole('link', { name: 'Ver todo →' })
  await catalogLink.scrollIntoViewIfNeeded()
  const href = (await catalogLink.getAttribute('href'))!.replace(/\/$/, '')
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
