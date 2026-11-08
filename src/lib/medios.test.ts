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

vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://x.supabase.co')
vi.stubEnv('PUBLIC_SUPABASE_FOTOS_URL', '')

const { getGarmentColors, leerFotoRemota } = await import('./medios')
const { esUrlPermitida, hostDeFotos } = await import('./fotos-host.mjs')

const jpeg = sharp({ create: { width: 800, height: 600, channels: 3, background: '#336699' } }).jpeg()
let n = 0
/** leerFotoRemota recuerda cada URL en el build: cada caso usa la suya. */
const url = () => `https://x.supabase.co/storage/v1/object/public/site-media/${++n}.jpg`
const servir = (cuerpo: Buffer, { status = 200, tipo = 'image/jpeg' } = {}) =>
  vi.stubGlobal('fetch', async () => new Response(new Uint8Array(cuerpo), { status, headers: { 'content-type': tipo } }))

afterEach(() => vi.unstubAllGlobals())

describe('esUrlPermitida', () => {
  it('solo https del proyecto propio, no cualquier *.supabase.co', () => {
    expect(esUrlPermitida('https://x.supabase.co/a.jpg')).toBe(true)
    expect(esUrlPermitida('http://x.supabase.co/a.jpg')).toBe(false)
    expect(esUrlPermitida('https://abc.supabase.co/a.jpg')).toBe(false)
    expect(esUrlPermitida('https://x.supabase.co.evil.com/a.jpg')).toBe(false)
    expect(esUrlPermitida('no es url')).toBe(false)
  })

  it('con la base detrás de un proxy, el host de las fotos es el real', () => {
    expect(hostDeFotos({ PUBLIC_SUPABASE_URL: 'https://x.supabase.co' })).toBe('x.supabase.co')
    expect(hostDeFotos({ PUBLIC_SUPABASE_URL: 'http://127.0.0.1:5000', PUBLIC_SUPABASE_FOTOS_URL: 'https://x.supabase.co' })).toBe('x.supabase.co')
    expect(hostDeFotos({})).toBeUndefined()
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
    expect(await leerFotoRemota('https://otro-proyecto.supabase.co/a.jpg')).toBeNull()
    expect(pedir).not.toHaveBeenCalled()
  })

  it('no sigue redirecciones ni espera para siempre: si la descarga falla, descarta', async () => {
    const pedir = vi.fn().mockRejectedValue(new TypeError('fetch failed'))
    vi.stubGlobal('fetch', pedir)
    expect(await leerFotoRemota(url())).toBeNull()
    expect(pedir.mock.calls[0][1]).toEqual({ redirect: 'error', signal: expect.any(AbortSignal) })
  })

  it('descarta lo que pasa de 5 MB y lo que pasa del tope de píxeles', async () => {
    servir(Buffer.alloc(5 * 1024 * 1024 + 1))
    expect(await leerFotoRemota(url())).toBeNull()
    servir(await sharp({ create: { width: 7000, height: 7000, channels: 3, background: '#336699' } }).jpeg({ quality: 10 }).toBuffer())
    expect(await leerFotoRemota(url())).toBeNull()
  })

  it('PRI-423: sin content-length deja de leer al pasar los 5 MB, no al timeout', async () => {
    let leidos = 0
    const sinFin = new ReadableStream({ pull: (c) => c.enqueue(new Uint8Array(1024 * 1024).fill(++leidos)) })
    vi.stubGlobal('fetch', async () => new Response(sinFin, { headers: { 'content-type': 'image/jpeg' } }))
    expect(await leerFotoRemota(url())).toBeNull()
    expect(leidos).toBeLessThan(10)
  }, 5_000)
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
