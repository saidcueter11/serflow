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

const { esUrlPermitida, getGarmentColors, leerFotoRemota } = await import('./medios')

const jpeg = sharp({ create: { width: 800, height: 600, channels: 3, background: '#336699' } }).jpeg()
let n = 0
/** leerFotoRemota recuerda cada URL en el build: cada caso usa la suya. */
const url = () => `https://x.supabase.co/storage/v1/object/public/site-media/${++n}.jpg`
const servir = (cuerpo: Buffer, { status = 200, tipo = 'image/jpeg' } = {}) =>
  vi.stubGlobal('fetch', async () => new Response(new Uint8Array(cuerpo), { status, headers: { 'content-type': tipo } }))

afterEach(() => vi.unstubAllGlobals())

describe('esUrlPermitida', () => {
  it('solo https de *.supabase.co', () => {
    expect(esUrlPermitida('https://abc.supabase.co/a.jpg')).toBe(true)
    expect(esUrlPermitida('http://abc.supabase.co/a.jpg')).toBe(false)
    expect(esUrlPermitida('https://abc.supabase.co.evil.com/a.jpg')).toBe(false)
    expect(esUrlPermitida('no es url')).toBe(false)
  })
})

describe('leerFotoRemota', () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})

  it('devuelve las medidas de una foto buena', async () => {
    servir(await jpeg.clone().toBuffer())
    expect(await leerFotoRemota(url())).toEqual({ width: 800, height: 600 })
  })

  it('una foto de celular girada por EXIF mide como se ve', async () => {
    servir(await jpeg.clone().withMetadata({ orientation: 6 }).toBuffer())
    expect(await leerFotoRemota(url())).toEqual({ width: 600, height: 800 })
  })

  it('descarta 404, otro tipo, archivo corrupto o cortado, y un host ajeno sin siquiera pedirlo', async () => {
    const buena = await sharp({ create: { width: 2000, height: 2000, channels: 3, background: '#336699' } }).png({ compressionLevel: 0 }).toBuffer()
    servir(buena, { status: 404 })
    expect(await leerFotoRemota(url())).toBeNull()
    servir(buena, { tipo: 'image/gif' })
    expect(await leerFotoRemota(url())).toBeNull()
    servir(Buffer.from('esto no es una imagen'))
    expect(await leerFotoRemota(url())).toBeNull()
    servir(buena.subarray(0, buena.length >> 1), { tipo: 'image/png' })
    expect(await leerFotoRemota(url())).toBeNull()

    const pedir = vi.fn()
    vi.stubGlobal('fetch', pedir)
    expect(await leerFotoRemota('https://otro.com/a.jpg')).toBeNull()
    expect(pedir).not.toHaveBeenCalled()
  })

  it('descarta lo que pasa de 5 MB y lo que pasa del tope de píxeles', async () => {
    servir(Buffer.alloc(5 * 1024 * 1024 + 1))
    expect(await leerFotoRemota(url())).toBeNull()
    servir(await sharp({ create: { width: 7000, height: 7000, channels: 3, background: '#336699' } }).jpeg({ quality: 10 }).toBuffer())
    expect(await leerFotoRemota(url())).toBeNull()
  })
})

describe('getGarmentColors', () => {
  it('tabla que todavía no existe: vacía, sin tumbar el build', async () => {
    Object.assign(respuesta, { data: null, error: { code: 'PGRST205', message: 'Could not find the table' } })
    await expect(getGarmentColors()).resolves.toEqual([])
  })

  it('cualquier otro error sí tumba el build: no se publica con las fotos del repo por una falla pasajera', async () => {
    Object.assign(respuesta, { data: null, error: { code: 'XX000', message: 'boom' } })
    await expect(getGarmentColors()).rejects.toThrow('Failed to fetch garment_colors: boom')
  })
})
