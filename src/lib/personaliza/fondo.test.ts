import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { gorraDeCelular, logoEnPapel, logoSobreBlanco, mascaraDelLogo } from '../../../e2e/fixtures/imagenes-fondo'
import { bordeTransparente, quitarFondo, type Pixeles } from './fondo'

/** Como la imagen de trabajo de leerDiseno: lado largo ≤ 1024, con alfa. */
async function leer(archivo: string | Buffer): Promise<Pixeles> {
  const { data, info } = await sharp(archivo).rotate().resize(1024, 1024, { fit: 'inside', withoutEnlargement: true }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data: new Uint8ClampedArray(data), width: info.width, height: info.height }
}

/** Imagen sintética de w × h; pinta(x, y) devuelve [r, g, b, a]. */
function imagen(w: number, h: number, pinta: (x: number, y: number) => [number, number, number, number]): Pixeles {
  const data = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) data.set(pinta(x, y), (y * w + x) * 4)
  return { data, width: w, height: h }
}
const alfa = (img: Pixeles, x: number, y: number) => img.data[(y * img.width + x) * 4 + 3]

const BLANCO: [number, number, number, number] = [255, 255, 255, 255]
const ROJO: [number, number, number, number] = [200, 20, 20, 255]

// Un aro rojo con hueco blanco adentro, sobre fondo blanco.
const aro = imagen(200, 200, (x, y) => {
  const r = Math.hypot(x - 100, y - 100)
  return r >= 40 && r <= 70 ? ROJO : BLANCO
})

/** Qué tanto coincide lo que quedó opaco con el logo de verdad (1 = perfecto). */
async function coincidencia(img: Pixeles) {
  const m = await mascaraDelLogo()
  let comun = 0
  let alguno = 0
  for (let i = 0; i < m.length; i++) {
    const a = img.data[i * 4 + 3] > 127
    const b = m[i] > 127
    if (a && b) comun++
    if (a || b) alguno++
  }
  return comun / alguno
}

describe('quitarFondo: logos', () => {
  it('logo sobre blanco, como llega por WhatsApp', async () => {
    const r = await quitarFondo(await leer(await logoSobreBlanco()))
    expect(r).not.toBeNull()
    expect(await coincidencia(r!)).toBeGreaterThan(0.93)
  })

  it('logo fotografiado en papel, con viñeta, sombra y ruido', async () => {
    const r = await quitarFondo(await leer(await logoEnPapel()))
    expect(r).not.toBeNull()
    expect(await coincidencia(r!)).toBeGreaterThan(0.93)
  })

  it('logo blanco sobre negro', async () => {
    const claro = imagen(200, 200, (x, y) => (Math.abs(x - 100) < 40 && Math.abs(y - 100) < 40 ? [250, 250, 250, 255] : [15, 15, 18, 255]))
    const r = await quitarFondo(claro)
    expect(alfa(r!, 0, 0)).toBe(0)
    expect(alfa(r!, 100, 100)).toBe(255)
  })

  it('el fondo queda transparente, el diseño intacto y el original sin tocar', async () => {
    const r = (await quitarFondo(aro))!
    expect(alfa(r, 0, 0)).toBe(0)
    expect(alfa(r, 100, 45)).toBe(255)
    expect(Array.from(r.data.slice((45 * 200 + 100) * 4, (45 * 200 + 100) * 4 + 3))).toEqual([200, 20, 20])
    expect(alfa(aro, 0, 0)).toBe(255)
  })

  it('una parte blanca encerrada no se come: desde aquí no se distingue del centro de una "O"', async () => {
    expect(alfa((await quitarFondo(aro))!, 100, 100)).toBe(255)
  })

  it('el contorno no deja halo: lo que aún es fondo se va y lo mezclado queda parcial y sin el color del fondo', async () => {
    // Un cuadro negro sobre blanco, con una línea gris clara alrededor, como el borde de un JPEG.
    const g = 210
    const img = imagen(120, 120, (x, y) => {
      if (x >= 40 && x < 80 && y >= 40 && y < 80) return [0, 0, 0, 255]
      return x >= 39 && x < 81 && y >= 39 && y < 81 ? [g, g, g, 255] : BLANCO
    })
    const r = (await quitarFondo(img))!
    // El blanco pegado al borde, que el suavizado no deja rellenar.
    expect(alfa(r, 38, 60)).toBe(0)
    const a = alfa(r, 39, 60)
    expect(a).toBeGreaterThan(0)
    expect(a).toBeLessThan(255)
    expect(r.data[(60 * 120 + 39) * 4]).toBeLessThan(g)
    expect(alfa(r, 60, 60)).toBe(255)
  })
})

describe('quitarFondo: una foto conserva su fondo', () => {
  it.each([
    ['hat4.jpg: gorra blanca sobre gris claro', 'src/assets/hat4.jpg'],
    ['gorra blanca sobre blanco', 'src/assets/images/beisbol/beisbol2.webp'],
    ['gorra blanca con degradado detrás', 'src/assets/images/miTierraQuerida/miTierraQuerida15.webp'],
    ['gorra blanca con poco bordado', 'src/assets/images/beisbol/beisbol24.webp'],
    ['persona', 'src/assets/images/stock/camisetas-estampadas.jpg'],
    ['objeto con fondo complejo', 'src/assets/images/stock/gorras-estante.jpg'],
    ['foto oscura', 'src/assets/images/stock/camiseta-dtf.jpg'],
  ])('%s', async (_, archivo) => {
    expect(await quitarFondo(await leer(archivo))).toBeNull()
  })

  it('hat4.jpg como la manda un celular malo', async () => {
    expect(await quitarFondo(await leer(await gorraDeCelular()))).toBeNull()
  })

  it('una gorra blanca pequeña en una foto casi toda blanca', async () => {
    const gorra = await sharp('src/assets/images/beisbol/beisbol2.webp').resize(300).png().toBuffer()
    const foto = await sharp({ create: { width: 1024, height: 1024, channels: 3, background: '#fbfbfb' } })
      .composite([{ input: gorra, left: 360, top: 300 }])
      .jpeg({ quality: 80 })
      .toBuffer()
    expect(await quitarFondo(await leer(foto))).toBeNull()
  })

  it('una personaje con partes blancas sobre blanco', async () => {
    const tito = await sharp('public/mascota/tito-saludo.webp').resize(600).png().toBuffer()
    const foto = await sharp({ create: { width: 1100, height: 800, channels: 3, background: '#ffffff' } })
      .composite([{ input: tito }])
      .jpeg({ quality: 70 })
      .toBuffer()
    expect(await quitarFondo(await leer(foto))).toBeNull()
  })

  it('borde de muchos colores', async () => {
    expect(await quitarFondo(imagen(60, 60, (x, y) => [(x * 37) % 256, (y * 53) % 256, (x * y * 11) % 256, 255]))).toBeNull()
  })

  it('una imagen de un solo color: no hay diseño', async () => {
    expect(await quitarFondo(imagen(60, 60, () => BLANCO))).toBeNull()
  })
})

describe('quitarFondo: la página no se congela', () => {
  it('le cede el turno a la página mientras trabaja', async () => {
    const img = await leer(await logoEnPapel())
    let turnos = 0
    const t = setInterval(() => turnos++)
    await quitarFondo(img)
    clearInterval(t)
    expect(turnos).toBeGreaterThan(0)
  })
})

describe('bordeTransparente', () => {
  it('un PNG con transparencia en el borde no se toca', () => {
    expect(bordeTransparente(imagen(10, 10, (x) => (x === 0 ? [255, 255, 255, 0] : ROJO)))).toBe(true)
    expect(bordeTransparente(aro)).toBe(false)
  })
})
