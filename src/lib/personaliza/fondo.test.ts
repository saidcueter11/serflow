import { describe, expect, it } from 'vitest'
import { bordeTransparente, fondoPlano, quitarFondo, type Pixeles, type Rgb } from './fondo'

/** Imagen sintética de w × h; pinta(x, y) devuelve [r, g, b, a]. */
function imagen(w: number, h: number, pinta: (x: number, y: number) => [number, number, number, number]): Pixeles {
  const data = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) data.set(pinta(x, y), (y * w + x) * 4)
  return { data, width: w, height: h }
}
const alfa = (img: Pixeles, x: number, y: number) => img.data[(y * img.width + x) * 4 + 3]

const BLANCO: [number, number, number, number] = [255, 255, 255, 255]
const ROJO: [number, number, number, number] = [200, 20, 20, 255]

// Logo: un aro rojo (con hueco blanco adentro) sobre fondo blanco, con un poco de ruido en el borde.
const logo = imagen(20, 20, (x, y) => {
  const r = Math.hypot(x - 10, y - 10)
  if (r >= 4 && r <= 7) return ROJO
  return x === 0 && y === 3 ? [240, 250, 245, 255] : BLANCO
})

describe('fondoPlano', () => {
  it('detecta el blanco del borde', () => {
    expect(fondoPlano(logo)).toEqual([255, 255, 255])
  })

  it('una foto (borde de muchos colores) no tiene fondo plano', () => {
    const foto = imagen(20, 20, (x, y) => [(x * 37) % 256, (y * 53) % 256, (x * y * 11) % 256, 255])
    expect(fondoPlano(foto)).toBeNull()
  })

  it('un PNG con transparencia en el borde no se toca', () => {
    const png = imagen(10, 10, (x) => (x === 0 ? [255, 255, 255, 0] : ROJO))
    expect(bordeTransparente(png)).toBe(true)
    expect(fondoPlano(png)).toBeNull()
  })

  it('aguanta hasta un 10 % del borde distinto', () => {
    // 2 de 36 píxeles de borde son negros: sigue siendo plano.
    const casi = imagen(10, 10, (x, y) => ((x === 0 && y < 2) ? [0, 0, 0, 255] : BLANCO))
    expect(fondoPlano(casi)).toEqual([255, 255, 255])
  })
})

describe('quitarFondo', () => {
  const limpio = quitarFondo(logo, [255, 255, 255])

  it('el fondo conectado al borde queda transparente y el diseño intacto', () => {
    expect(alfa(limpio, 0, 0)).toBe(0)
    expect(alfa(limpio, 0, 3)).toBe(0)
    expect(alfa(limpio, 10, 4)).toBe(255)
    expect(Array.from(limpio.data.slice((4 * 20 + 10) * 4, (4 * 20 + 10) * 4 + 3))).toEqual([200, 20, 20])
  })

  it('el hueco encerrado (centro de la "O") se queda como está', () => {
    expect(alfa(limpio, 10, 10)).toBe(255)
  })

  it('no modifica la imagen original', () => {
    expect(alfa(logo, 0, 0)).toBe(255)
  })

  it('entre 24 y 48 deja alfa parcial y descuenta el fondo (sin halo)', () => {
    const fondo: Rgb = [255, 255, 255]
    // Borde del diseño: un gris claro a distancia 36 del blanco, entre el fondo y un cuadro negro.
    const g = 255 - Math.round(36 / Math.sqrt(3))
    const img = imagen(9, 9, (x, y) => (x >= 3 && x <= 5 && y >= 3 && y <= 5 ? [0, 0, 0, 255] : x === 2 && y === 4 ? [g, g, g, 255] : BLANCO))
    const out = quitarFondo(img, fondo)
    const a = alfa(out, 2, 4)
    expect(a).toBeGreaterThan(80)
    expect(a).toBeLessThan(180)
    // Sin el blanco del fondo, el color que queda es oscuro, no gris claro.
    expect(out.data[(4 * 9 + 2) * 4]).toBeLessThan(g)
    expect(alfa(out, 4, 4)).toBe(255)
  })
})
