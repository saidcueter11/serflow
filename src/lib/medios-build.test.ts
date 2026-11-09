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
const { MAX_COLORES: MAX } = await import('./personaliza/base')

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
  it(`con más de ${MAX} colores activos por prenda, solo baja las fotos de los ${MAX} primeros`, async () => {
    const jpeg = await sharp({ create: { width: 80, height: 100, channels: 3, background: '#336699' } }).jpeg().toBuffer()
    const pedidas: string[] = []
    vi.stubGlobal('fetch', async (url: string) => {
      pedidas.push(url)
      return new Response(new Uint8Array(jpeg), { headers: { 'content-type': 'image/jpeg' } })
    })
    respuesta.data = [
      ...Array.from({ length: MAX + 2 }, (_, i) => fila(i, 'gorra', ['frente'])),
      ...Array.from({ length: MAX + 1 }, (_, i) => fila(100 + i, 'camiseta', ['frente', 'espalda'])),
    ]

    const colores = await coloresDeBase({ width: 80, widthMovil: 80 })

    expect(colores.gorra.map((c) => c.id)).toEqual(Array.from({ length: MAX }, (_, i) => `gorra-${i}`))
    expect(colores.camiseta).toHaveLength(MAX)
    expect(pedidas).toHaveLength(MAX + MAX * 2)
    expect(pedidas).not.toContain(foto(MAX, 'frente'))
    expect(pedidas).not.toContain(foto(100 + MAX, 'frente'))
  })

  it('las fotos sembradas salen del repo con el mapa de sombreado de su vista, sin bajar nada; una referencia desconocida no sale', async () => {
    const pedidas: string[] = []
    vi.stubGlobal('fetch', async (url: string) => {
      pedidas.push(url)
      return new Response(null, { status: 404 })
    })
    const repo = (garment: string, archivo: string, vistas: [string, string][]) => ({
      ...fila(0, garment, []),
      id: `${garment}-${archivo}`,
      garment_photos: vistas.map(([view, sufijo]) => ({ view, image_url: `repo:personalizador/${garment}-${archivo}${sufijo}.jpg`, print_area: null, print_width_cm: null })),
    })
    respuesta.data = [
      repo('camiseta', 'roja', [['frente', ''], ['espalda', '-espalda']]),
      repo('gorra', 'roja', [['frente', '']]),
      repo('gorra', 'no-existe', [['frente', '']]),
    ]

    const colores = await coloresDeBase({ width: 1080, widthMovil: 720 })

    expect(pedidas).toEqual([])
    expect(colores.camiseta[0].photos).toMatchObject([
      { view: 'frente', image_url: '/_astro/1080/camiseta-roja.jpg', image_url_movil: '/_astro/720/camiseta-roja.jpg', sombra_url: '/_astro/540/sombra-camiseta.png' },
      { view: 'espalda', image_url: '/_astro/1080/camiseta-roja-espalda.jpg', sombra_url: '/_astro/540/sombra-camiseta-espalda.png' },
    ])
    expect(colores.gorra.map((c) => c.id)).toEqual(['gorra-roja'])
    expect(colores.gorra[0].photos[0].sombra_url).toBe('/_astro/540/sombra-gorra.png')
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
