import sharp from 'sharp'
import { afterEach, describe, expect, it, vi } from 'vitest'

const respuesta: { data: unknown; error: unknown } = { data: [], error: null }

vi.mock('./supabase', () => ({
  supabase: {
    from: () => {
      const q: Record<string, unknown> = { then: (resolve: (r: typeof respuesta) => unknown) => resolve(respuesta) }
      for (const m of ['select', 'eq', 'order']) q[m] = () => q
      return q
    },
  },
}))
vi.mock('astro:assets', () => ({ getImage: async ({ src, width }: { src: string; width: number }) => ({ src: `/_astro/${width}/${src.split('/').pop()}`, srcSet: { attribute: '' } }) }))

vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://x.supabase.co')
vi.stubEnv('PUBLIC_SUPABASE_FOTOS_URL', '')

const { coloresDeBase } = await import('./medios-build')

const foto = (color: number, view: string) => `https://x.supabase.co/storage/v1/object/public/site-media/${color}-${view}.jpg`
const fila = (i: number, garment: string, vistas: string[]) => ({
  id: `${garment}-${i}`,
  garment,
  name: `Color ${i}`,
  hex: '#336699',
  garment_photos: vistas.map((view) => ({ view, image_url: foto(i, view), print_area: null, print_width_cm: null })),
})

afterEach(() => vi.unstubAllGlobals())

describe('coloresDeBase', () => {
  it('con más de 12 colores activos por prenda, solo baja las fotos de los 12 primeros', async () => {
    const jpeg = await sharp({ create: { width: 80, height: 100, channels: 3, background: '#336699' } }).jpeg().toBuffer()
    const pedidas: string[] = []
    vi.stubGlobal('fetch', async (url: string) => {
      pedidas.push(url)
      return new Response(new Uint8Array(jpeg), { headers: { 'content-type': 'image/jpeg' } })
    })
    respuesta.data = [
      ...Array.from({ length: 14 }, (_, i) => fila(i, 'gorra', ['frente'])),
      ...Array.from({ length: 13 }, (_, i) => fila(100 + i, 'camiseta', ['frente', 'espalda'])),
    ]

    const colores = await coloresDeBase({ width: 80, widthMovil: 80 })

    expect(colores.gorra.map((c) => c.id)).toEqual(Array.from({ length: 12 }, (_, i) => `gorra-${i}`))
    expect(colores.camiseta).toHaveLength(12)
    expect(pedidas).toHaveLength(12 + 12 * 2)
    expect(pedidas).not.toContain(foto(12, 'frente'))
    expect(pedidas).not.toContain(foto(112, 'frente'))
  })

  it('cada foto sale en sus dos anchos con una sola descarga, y una foto pequeña no se agranda', async () => {
    const jpeg = await sharp({ create: { width: 800, height: 1000, channels: 3, background: '#336699' } }).jpeg().toBuffer()
    const pedidas: string[] = []
    vi.stubGlobal('fetch', async (url: string) => {
      pedidas.push(url)
      return new Response(new Uint8Array(jpeg), { headers: { 'content-type': 'image/jpeg' } })
    })
    respuesta.data = [fila(200, 'gorra', ['frente'])]

    const { gorra } = await coloresDeBase({ width: 1080, widthMovil: 720 })

    expect(gorra[0].photos[0]).toMatchObject({ image_url: '/_astro/800/200-frente.jpg', image_url_movil: '/_astro/720/200-frente.jpg' })
    expect(pedidas).toEqual([foto(200, 'frente')])
  })
})
