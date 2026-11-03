import { ESCENA, type Area, type Punto } from './datos'

/** Posición del diseño dentro del área: centro (0 a 1) y ancho como fracción del ancho del área. */
export interface Lugar {
  cx: number
  cy: number
  s: number
}

export const LUGAR_INICIAL: Lugar = { cx: 0.5, cy: 0.42, s: 0.62 }
/** La copa de la gorra es baja: el diseño arranca centrado (canvas, storyboards de gorra). */
export const LUGAR_GORRA: Lugar = { cx: 0.5, cy: 0.5, s: 0.62 }
export const S_MIN = 0.2
export const S_MAX = 1

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/** Punto del área (u, v en 0 a 1) en la foto, interpolando las 4 esquinas. */
export function enArea(a: Area, u: number, v: number): Punto {
  const tx = a.tl[0] + (a.tr[0] - a.tl[0]) * u
  const ty = a.tl[1] + (a.tr[1] - a.tl[1]) * u
  const bx = a.bl[0] + (a.br[0] - a.bl[0]) * u
  const by = a.bl[1] + (a.br[1] - a.bl[1]) * u
  return [tx + (bx - tx) * v, ty + (by - ty) * v]
}

/** Ancho y alto medios del área en px de la escena. */
export function medidasArea(a: Area): { ancho: number; alto: number } {
  const d = (p: Punto, q: Punto) => Math.hypot((q[0] - p[0]) * ESCENA.ancho, (q[1] - p[1]) * ESCENA.alto)
  return { ancho: (d(a.tl, a.tr) + d(a.bl, a.br)) / 2, alto: (d(a.tl, a.bl) + d(a.tr, a.br)) / 2 }
}

/** ancho / alto del área. */
export function aspectoArea(a: Area): number {
  const m = medidasArea(a)
  return m.ancho / m.alto
}

/**
 * La caja del diseño nunca sale del área (spec 6.3). Escala entre S_MIN y S_MAX del ancho; si a ese ancho el diseño
 * es más alto que el área, se reduce hasta caber. ratio = ancho / alto del diseño; aspecto = ancho / alto del área.
 */
export function limitar(l: Lugar, ratio: number, aspecto: number): Lugar {
  const cabe = ratio / aspecto
  const s = Math.min(clamp(l.s, S_MIN, S_MAX), cabe)
  const h = (s * aspecto) / ratio
  return { s, cx: clamp(l.cx, s / 2, 1 - s / 2), cy: clamp(l.cy, h / 2, 1 - h / 2) }
}

/** "unos N cm de ancho": ancho real del área (lo mide el taller) por la escala. */
export const tamanoCm = (anchoCm: number, s: number) => Math.round(anchoCm * s)

/** Caja del diseño en fracciones de la foto (para las manijas y el foco del teclado; sin la curva del motor). */
export function cajaDiseno(a: Area, l: Lugar, ratio: number, aspecto: number) {
  const h = (l.s * aspecto) / ratio
  const pts = [
    enArea(a, l.cx - l.s / 2, l.cy - h / 2),
    enArea(a, l.cx + l.s / 2, l.cy - h / 2),
    enArea(a, l.cx + l.s / 2, l.cy + h / 2),
    enArea(a, l.cx - l.s / 2, l.cy + h / 2),
  ]
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const left = Math.min(...xs)
  const top = Math.min(...ys)
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top }
}
