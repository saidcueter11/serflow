// Quitar un fondo plano en el teléfono (spec 6.1, opción 1): sin librerías ni red. Solo alimenta la vista previa y
// el mockup; al taller siempre le llega el archivo original.

/** Lo mismo que ImageData, sin depender del DOM (así se prueba en Node). */
export interface Pixeles {
  data: Uint8ClampedArray<ArrayBuffer>
  width: number
  height: number
}
export type Rgb = [number, number, number]

/** Distancia RGB hasta la que un píxel es fondo (queda transparente). Valores iniciales; se ajustan con diseños reales. */
export const UMBRAL = 24
/** Entre UMBRAL y UMBRAL_SUAVE: alfa parcial, para que el borde del diseño no quede con halo. */
export const UMBRAL_SUAVE = 48
/** Fracción del borde que tiene que estar cerca de su color mediano para decir que hay fondo plano. */
export const PLANO = 0.9

function borde(img: Pixeles): number[] {
  const { width: w, height: h } = img
  const out: number[] = []
  for (let x = 0; x < w; x++) out.push(x, (h - 1) * w + x)
  for (let y = 1; y < h - 1; y++) out.push(y * w, y * w + w - 1)
  return out
}

const dist = (d: Uint8ClampedArray, i: number, c: Rgb) => Math.hypot(d[i * 4] - c[0], d[i * 4 + 1] - c[1], d[i * 4 + 2] - c[2])

/** El PNG ya trae transparencia en el borde: no se toca. */
export function bordeTransparente(img: Pixeles): boolean {
  return borde(img).some((i) => img.data[i * 4 + 3] < 250)
}

/** Color del fondo si el borde de 1 px es de un solo color (90 % a distancia ≤ UMBRAL de su mediana); si no, null. */
export function fondoPlano(img: Pixeles): Rgb | null {
  if (bordeTransparente(img)) return null
  const px = borde(img)
  const mediana = (k: number) => {
    const v = px.map((i) => img.data[i * 4 + k]).sort((a, b) => a - b)
    return v[v.length >> 1]
  }
  const c: Rgb = [mediana(0), mediana(1), mediana(2)]
  const cerca = px.filter((i) => dist(img.data, i, c) <= UMBRAL).length
  return cerca >= px.length * PLANO ? c : null
}

/**
 * Relleno desde los bordes: lo conectado al borde a distancia ≤ UMBRAL queda transparente y sigue propagando; entre
 * UMBRAL y UMBRAL_SUAVE queda con alfa parcial y se le descuenta el color del fondo, sin propagar. Los huecos
 * encerrados (el centro de una "O") no se tocan: limitación conocida de la V1.
 */
export function quitarFondo(img: Pixeles, fondo: Rgb): Pixeles {
  const { width: w, height: h } = img
  const d = new Uint8ClampedArray(img.data)
  const visto = new Uint8Array(w * h)
  const pila = borde(img)
  while (pila.length) {
    const i = pila.pop()!
    if (visto[i]) continue
    visto[i] = 1
    const e = dist(img.data, i, fondo)
    if (e > UMBRAL_SUAVE) continue
    const o = i * 4
    if (e <= UMBRAL) {
      d[o + 3] = 0
      const x = i % w
      if (x > 0) pila.push(i - 1)
      if (x < w - 1) pila.push(i + 1)
      if (i >= w) pila.push(i - w)
      if (i < w * (h - 1)) pila.push(i + w)
    } else {
      const a = (e - UMBRAL) / (UMBRAL_SUAVE - UMBRAL)
      for (let k = 0; k < 3; k++) d[o + k] = (img.data[o + k] - (1 - a) * fondo[k]) / a
      d[o + 3] = Math.round(img.data[o + 3] * a)
    }
  }
  return { data: d, width: w, height: h }
}
