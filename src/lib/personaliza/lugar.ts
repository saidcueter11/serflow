import { ESCENA, PRENDAS, type Area, type Prenda, type Punto, type Tecnica } from './datos'

/** Posición del diseño dentro del área: centro (0 a 1), ancho como fracción del ancho del área y giro en grados. */
export interface Lugar {
  cx: number
  cy: number
  s: number
  /** Sin r (lo guardado antes de poder girar), 0. */
  r?: number
}

export const LUGAR_INICIAL: Lugar = { cx: 0.5, cy: 0.42, s: 0.62 }
/** La copa de la gorra es baja: el diseño arranca centrado (canvas, storyboards de gorra). */
export const LUGAR_GORRA: Lugar = { cx: 0.5, cy: 0.5, s: 0.62 }
export const S_MIN = 0.1
export const S_MAX = 1

/** Rectángulo de la foto en fracciones 0 a 1. */
export interface Ventana {
  left: number
  top: number
  right: number
  bottom: number
}
export const FOTO_ENTERA: Ventana = { left: 0, top: 0, right: 1, bottom: 1 }

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/** Punto del área (u, v en 0 a 1) en la foto, interpolando las 4 esquinas. */
export function enArea(a: Area, u: number, v: number): Punto {
  const tx = a.tl[0] + (a.tr[0] - a.tl[0]) * u
  const ty = a.tl[1] + (a.tr[1] - a.tl[1]) * u
  const bx = a.bl[0] + (a.br[0] - a.bl[0]) * u
  const by = a.bl[1] + (a.br[1] - a.bl[1]) * u
  return [tx + (bx - tx) * v, ty + (by - ty) * v]
}

/** La escala que da el tope de bordado de la prenda; sin tope, S_MAX. anchoCm = ancho real del área. */
export function escalaMax(prenda: Prenda, tecnica: Tecnica, anchoCm: number): number {
  const tope = tecnica === 'bordado' ? PRENDAS[prenda].bordadoMaxCm : undefined
  return tope ? Math.min(S_MAX, tope / anchoCm) : S_MAX
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

/** Caja del área en la foto. */
export function cajaArea(a: Area): Ventana {
  return {
    left: Math.min(a.tl[0], a.bl[0]),
    top: Math.min(a.tl[1], a.tr[1]),
    right: Math.max(a.tr[0], a.br[0]),
    bottom: Math.max(a.bl[1], a.br[1]),
  }
}

/** Una ventana de la foto en unidades del área (0 a 1 es el área). */
export function enUnidades(a: Area, v: Ventana): Ventana {
  const b = cajaArea(a)
  const w = b.right - b.left
  const h = b.bottom - b.top
  return { left: (v.left - b.left) / w, top: (v.top - b.top) / h, right: (v.right - b.left) / w, bottom: (v.bottom - b.top) / h }
}

/**
 * El diseño se mueve libre por la foto: su caja solo se queda dentro de la ventana (lo visible de la foto), para que no
 * se pierda. Escala entre S_MIN y max (escalaMax); si a ese ancho no cabe en la ventana, se reduce hasta caber.
 * ratio = ancho / alto del diseño.
 */
export function limitar(l: Lugar, ratio: number, area: Area, max = S_MAX, ventana = FOTO_ENTERA): Lugar {
  const v = enUnidades(area, ventana)
  const k = giroCaja(1, ratio, aspectoArea(area), l.r)
  const s = Math.min(clamp(l.s, S_MIN, max), (v.right - v.left) / k.w, (v.bottom - v.top) / k.h)
  const w = s * k.w
  const h = s * k.h
  return { ...l, s, cx: clamp(l.cx, v.left + w / 2, v.right - w / 2), cy: clamp(l.cy, v.top + h / 2, v.bottom - h / 2) }
}

/** Caja del diseño girado r grados, en unidades del área (ancho s, alto s · aspecto / ratio sin girar). */
export function giroCaja(s: number, ratio: number, aspecto: number, r = 0) {
  const c = Math.abs(Math.cos((r * Math.PI) / 180))
  const n = Math.abs(Math.sin((r * Math.PI) / 180))
  return { w: s * (c + n / ratio), h: s * aspecto * (n + c / ratio) }
}

/** Giro en grados entre -180 y 180; a menos de 4° de recto, recto (así es fácil volver a 0). */
export function enderezar(r: number): number {
  const g = ((((r + 180) % 360) + 360) % 360) - 180
  return Math.abs(g) < 4 ? 0 : g
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
