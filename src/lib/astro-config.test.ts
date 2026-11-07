import sharp from 'sharp'
import { beforeAll, describe, expect, it, vi } from 'vitest'

// Prueba el astro.config.mjs de verdad: quitar el bloqueo o volver a *.supabase.co pone esto en rojo. Sin anon key: no lee la base.
vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://propio.supabase.co')
vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', '')
vi.stubEnv('PUBLIC_SUPABASE_FOTOS_URL', '')

const base = sharp({ create: { width: 16, height: 16, channels: 3, background: '#336699' } })
const buenas = { jpeg: await base.clone().jpeg().toBuffer(), png: await base.clone().png().toBuffer(), webp: await base.clone().webp().toBuffer() }
// Se generan antes de cargar el config: el bloqueo también aplica a decodificar estas muestras después.
const bloqueadas = {
  avif: await base.clone().avif().toBuffer(),
  gif: await base.clone().gif().toBuffer(),
  tiff: await base.clone().tiff().toBuffer(),
  svg: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16"/></svg>'),
}

let config: { image?: { remotePatterns?: unknown[] } }
beforeAll(async () => {
  config = (await import('../../astro.config.mjs')).default
}, 30_000)

describe('astro.config.mjs', () => {
  it('Astro solo optimiza fotos remotas del proyecto propio', () => {
    expect(config.image?.remotePatterns).toEqual([{ protocol: 'https', hostname: 'propio.supabase.co' }])
  })

  it.each(Object.entries(buenas))('sharp sigue decodificando %s', async (_, foto) => {
    await expect(sharp(foto).stats()).resolves.toBeDefined()
  })

  it.each(Object.entries(bloqueadas))('sharp ya no decodifica %s, aunque venga disfrazado de foto', async (_, foto) => {
    await expect(sharp(foto).stats()).rejects.toThrow(/unsupported image format/)
  })
})
