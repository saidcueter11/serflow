import { expect, test, type Page } from '@playwright/test'

// PRI-532 (#9 de la auditoría SEO): cada /promos/<slug>/ lleva su JSON-LD Offer con la url del canonical y su vigencia.
// Build sembrado con 3 promos vigentes (4234, e2e/promos/scenarios.mjs).
test.use({ baseURL: 'http://localhost:4234' })

const DAY = 24 * 60 * 60 * 1000

async function offer(page: Page, slug: string) {
  await page.goto(`/promos/${slug}/`)
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
  const offers = scripts.map((s) => JSON.parse(s)).filter((s) => s['@type'] === 'Offer')
  expect(offers).toHaveLength(1)
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
  expect(offers[0].url).toBe(canonical)
  expect(offers[0].url).toMatch(new RegExp(`^https://serflowctg\\.com/promos/${slug}/$`))
  return offers[0]
}

test('a promo without weekdays is valid from its creation until ends_at, with its photo and description', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Same markup on both viewports')
  const o = await offer(page, 'e2e-2x1-gorras')
  expect(o).toMatchObject({
    '@context': 'https://schema.org',
    name: '2x1 en gorras bordadas',
    description: 'Llevas dos gorras con el mismo bordado y pagas una.',
    validFrom: '2026-10-01T00:00:00.000Z',
    seller: { '@type': 'Organization', name: 'Serflow' },
  })
  expect(o.image).toMatch(/^https:\/\/serflowctg\.com\/.+\.jpg$/)
  // ends_at es 30 días después del build.
  expect(new Date(o.validThrough).getTime()).toBeGreaterThan(Date.now() + 29 * DAY)
})

test('weekdays do not narrow the validity (PRI-538); without description or end, none', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Same markup on both viewports')
  const o = await offer(page, 'e2e-camisetas-equipos')
  expect(o.validFrom).toBe('2026-10-01T00:00:00.000Z')

  const sinNada = await offer(page, 'e2e-gorras-ninos')
  expect(sinNada).not.toHaveProperty('description')
  expect(sinNada).not.toHaveProperty('validThrough')
})
