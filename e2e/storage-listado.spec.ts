import 'dotenv/config'
import { expect, test } from '@playwright/test'

// PRI-426: el catálogo se sirve por URL pública; listar un bucket con la anon key no debe devolver nada.
// PRI-430: corre siempre contra prod. Rojo = alguien reabrió el listado (o hay una policy de SELECT hecha a mano).
const url = process.env.PUBLIC_SUPABASE_URL!
const key = process.env.PUBLIC_SUPABASE_ANON_KEY!
const headers = { apikey: key, Authorization: `Bearer ${key}` }

test('las fotos del catálogo cargan por URL pública, sin sesión', async ({ request }) => {
  const res = await request.get(`${url}/rest/v1/products?select=image_urls&is_active=eq.true&slug=neq.prueba&limit=5`, { headers })
  const fotos: string[] = (await res.json()).flatMap((p: { image_urls: string[] }) => p.image_urls).slice(0, 5)
  expect(fotos.length).toBeGreaterThan(0)
  for (const foto of fotos) {
    const r = await request.get(foto)
    expect(r.status()).toBe(200)
    expect(r.headers()['content-type']).toMatch(/^image\//)
  }
})

for (const bucket of ['product-images', 'category-images', 'promo-images', 'site-media']) {
  test(`la anon key no lista ${bucket}`, async ({ request }) => {
    const data = { prefix: '', limit: 100 }
    const res = await request.post(`${url}/storage/v1/object/list/${bucket}`, { headers, data })
    expect(await res.json()).toEqual([])
    const v2 = await (await request.post(`${url}/storage/v1/object/list-v2/${bucket}`, { headers, data })).json()
    expect(v2.objects ?? []).toEqual([])
    expect(v2.folders ?? []).toEqual([])
  })
}
