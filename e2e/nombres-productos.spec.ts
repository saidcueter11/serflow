import { expect, test } from '@playwright/test'
import { netlify } from './fixtures/netlify'
import { RENOMBRADAS } from './promos/scenarios.mjs'

// PRI-536: la migración de nombres cambia el slug de los 129 productos y los links viejos circulan por WhatsApp. El
// trigger de PRI-525 guarda cada slug viejo y el build publica su 301; aquí, tres renombres reales de la migración sobre
// el build sembrado del modal, con las reglas de Netlify (e2e/fixtures/netlify.ts).
test.use({ baseURL: 'http://localhost:4240' })

test('old product links from before the rename redirect with a 301 to the new slug', async ({ request, isMobile }) => {
  test.skip(isMobile, 'Same redirect on both viewports')
  expect(RENOMBRADAS.map((r) => r.viejo).sort()).toEqual(['basketball-50', 'mi-tierra-querida-5', 'sombreros-94'])
  const { origin, close } = await netlify('.e2e-builds/modal')
  try {
    for (const r of RENOMBRADAS) {
      for (const viejo of [`/catalogo/${r.categoria}/${r.viejo}`, `/catalogo/${r.categoria}/${r.viejo}/`]) {
        const res = await request.get(`${origin}${viejo}`, { maxRedirects: 0 })
        expect(res.status(), viejo).toBe(301)
        expect(res.headers().location, viejo).toBe(`/catalogo/${r.categoria}/${r.nuevo}/`)
      }
    }
  } finally {
    close()
  }
})
