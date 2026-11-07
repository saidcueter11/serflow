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
    // Un cuadro negro sobre blanco, con una línea gris alrededor, como el borde de un JPEG.
    const g = 128
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

// Diseños claros sobre blanco, JPEG q70. Con trazos, sin depender de las fuentes de la máquina.
const C = (color: string, grueso = 60) => `<path d="M640 180 A170 170 0 1 0 640 440" fill="none" stroke="${color}" stroke-width="${grueso}"/>`
const ESLOGAN = '<g fill="#D9D9D9"><rect x="280" y="500" width="440" height="12"/><rect x="340" y="524" width="320" height="12"/></g>'
const TEXTO = '<path d="M430 250 h140 M430 310 h140 M430 370 h140" stroke="#333" stroke-width="22"/>'
const DISCO = (color: string) => `<circle cx="500" cy="310" r="210" fill="${color}"/>${TEXTO}`

/** Devuelve la imagen como JPEG sobre blanco y el alfa exacto del diseño. */
async function disenoSobreBlanco(trazos: string) {
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620">${trazos}</svg>`)
  const alfaDiseno = await sharp(svg).ensureAlpha().extractChannel(3).raw().toBuffer()
  const jpeg = await sharp(svg).flatten({ background: '#ffffff' }).jpeg({ quality: 70 }).toBuffer()
  return { img: await leer(jpeg), alfaDiseno }
}

const comido = (r: Pixeles, alfaDiseno: Buffer) => {
  let diseno = 0
  let perdido = 0
  for (let i = 0; i < alfaDiseno.length; i++) {
    if (alfaDiseno[i] < 200) continue
    diseno++
    if (r.data[i * 4 + 3] < 128) perdido++
  }
  return perdido / diseno
}

describe('quitarFondo: un diseño claro no se come ni se conserva de más', () => {
  it.each([
    ['curva gris #999', C('#999999')],
    ['curva gris #888', C('#888888')],
    ['curva gris #AAA', C('#AAAAAA')],
    ['curva gris #BBB', C('#BBBBBB')],
    ['eslogan claro bajo un texto oscuro', C('#222222') + ESLOGAN],
    ['círculo rosa con texto', DISCO('#FFE4E1')],
    ['círculo azul con texto', DISCO('#DCEBFA')],
    ['círculo crema con texto', DISCO('#FFF3C4')],
    ['círculo gris con texto', DISCO('#E6E6E6')],
  ])('%s', async (_, trazos) => {
    const { img, alfaDiseno } = await disenoSobreBlanco(trazos)
    const r = await quitarFondo(img)
    expect(r).not.toBeNull()
    expect(comido(r!, alfaDiseno)).toBeLessThan(0.02)
    expect(alfa(r!, 2, 2)).toBe(0)
  })

  it('curva durazno: el degradado de color del JPEG puede dejarle el fondo, pero nunca se come', async () => {
    const { img, alfaDiseno } = await disenoSobreBlanco(C('#FFB380'))
    const r = await quitarFondo(img)
    if (r) expect(comido(r, alfaDiseno)).toBeLessThan(0.02)
  })

  it('el trazo claro queda opaco por dentro: no se vuelve transparente por ser pálido', async () => {
    const { img } = await disenoSobreBlanco(C('#D9D9D9'))
    const r = (await quitarFondo(img))!
    // Mitad del trazo de la C, a la izquierda.
    expect(alfa(r, 360, 310)).toBe(255)
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

  it.each([
    ['ropa', 'src/assets/images/moda/moda9.webp'],
    ['gorra', 'src/assets/images/kids/kid3.webp'],
  ])('%s pequeña en un lienzo blanco: casi no pesa en la región, pero pesa contra lo que queda', async (_, archivo) => {
    const prenda = await sharp(archivo).resize(300).flatten({ background: '#ffffff' }).png().toBuffer()
    const foto = await sharp({ create: { width: 1024, height: 1024, channels: 3, background: '#fbfbfb' } })
      .composite([{ input: prenda, left: 360, top: 300 }])
      .jpeg({ quality: 80 })
      .toBuffer()
    expect(await quitarFondo(await leer(foto))).toBeNull()
  })

  it.each(['src/assets/hat4.jpg', 'src/assets/images/beisbol/beisbol9.webp', 'src/assets/images/miTierraQuerida/miTierraQuerida12.webp'])('%s también conserva su fondo si llega más pequeña', async (archivo) => {
    const chica = await sharp(archivo).rotate().resize(512, 512, { fit: 'inside' }).jpeg({ quality: 80 }).toBuffer()
    expect(await quitarFondo(await leer(chica))).toBeNull()
  })

  it('un personaje con partes blancas sobre blanco', async () => {
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
