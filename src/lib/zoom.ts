/*
 * Cuentas del zoom de la ficha de producto (PRI-529): la lupa al lado (escritorio), mantén para acercar (celular) y el
 * visor a pantalla completa. Sin DOM, para probarlas solas; los scripts (src/scripts/lupa.ts, visor-fotos.ts) las usan.
 */

/** Cuánto acerca la lupa, el mantén para acercar y el doble toque del visor. */
export const ZOOM_LUPA = 2.5
/** El visor no acerca más que esto. */
export const ZOOM_MAX = 4
/** Cada + o − del visor suma o resta esto. */
export const ZOOM_PASO = 0.75
/** Cada paso de la rueda multiplica por esto. */
export const ZOOM_RUEDA = 1.15

const entre = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

type Caja = { w: number; h: number }

/**
 * Lupa al lado: con el mouse en (x, y) de la foto, dónde va el recuadro y cómo se pinta el panel. El recuadro tiene la
 * forma del panel dividida por k y nunca se sale de la foto. La foto se ve con object-fit: cover; si se sabe su tamaño
 * real (natural), el panel la recorta igual, sin estirarla.
 */
export function lupa(x: number, y: number, foto: Caja, panel: Caja, natural?: Caja, k = ZOOM_LUPA) {
  const w = Math.min(foto.w, panel.w / k)
  const h = Math.min(foto.h, panel.h / k)
  const lx = entre(x - w / 2, 0, foto.w - w)
  const ly = entre(y - h / 2, 0, foto.h - h)
  // cover: la foto pintada puede ser más grande que su caja y quedar centrada (desborde negativo).
  const c = natural && natural.w > 0 && natural.h > 0 ? Math.max(foto.w / natural.w, foto.h / natural.h) : 0
  const pw = c ? natural!.w * c : foto.w
  const ph = c ? natural!.h * c : foto.h
  const ox = (foto.w - pw) / 2
  const oy = (foto.h - ph) / 2
  return {
    lente: { x: lx, y: ly, w, h },
    fondo: { w: pw * k, h: ph * k, x: (ox - lx) * k, y: (oy - ly) * k },
  }
}

/** Mantén para acercar: el punto del dedo como fracción de la foto (0..1), para transform-origin. */
export function fraccion(x: number, y: number, caja: { left: number; top: number; width: number; height: number }) {
  return { fx: entre((x - caja.left) / caja.width, 0, 1), fy: entre((y - caja.top) / caja.height, 0, 1) }
}

/** Vista del visor: escala y corrimiento de la foto (transform: translate(tx, ty) scale(s), origen arriba a la izquierda). */
export type Vista = { s: number; tx: number; ty: number }

export const AJUSTADA: Vista = { s: 1, tx: 0, ty: 0 }

/** Escala entre 1 y ZOOM_MAX (casi 1 es 1) y la foto siempre cubre la zona: no se puede arrastrar fuera de ella. */
export function limita(v: Vista, w: number, h: number): Vista {
  const s = entre(v.s, 1, ZOOM_MAX)
  if (s < 1.01) return AJUSTADA
  return { s, tx: entre(v.tx, w - w * s, 0), ty: entre(v.ty, h - h * s, 0) }
}

/** Cambia la escala dejando quieto el punto (x, y) de la zona: el que está bajo el puntero o entre los dedos. */
export function hacia(v: Vista, s: number, x: number, y: number, w: number, h: number): Vista {
  const ns = entre(s, 1, ZOOM_MAX)
  return limita({ s: ns, tx: x - (x - v.tx) * (ns / v.s), ty: y - (y - v.ty) * (ns / v.s) }, w, h)
}

/** Rueda del mouse: acerca (deltaY < 0) o aleja hacia el puntero. */
export const rueda = (v: Vista, deltaY: number, x: number, y: number, w: number, h: number) =>
  hacia(v, v.s * (deltaY < 0 ? ZOOM_RUEDA : 1 / ZOOM_RUEDA), x, y, w, h)

/** Botones + y −: un paso hacia el centro de la zona. */
export const paso = (v: Vista, dir: 1 | -1, w: number, h: number) => hacia(v, v.s + dir * ZOOM_PASO, w / 2, h / 2, w, h)

/** Doble toque o Enter: si está ajustada acerca a ZOOM_LUPA en (x, y); si no, vuelve a ajustar. */
export const alterna = (v: Vista, x: number, y: number, w: number, h: number) =>
  v.s > 1 ? AJUSTADA : hacia(AJUSTADA, ZOOM_LUPA, x, y, w, h)

/** Pellizco: la escala de inicio por cuánto se abrieron los dedos, hacia el punto medio de inicio, más lo que se movió. */
export function pellizco(ini: Vista, d0: number, d: number, m0: [number, number], m: [number, number], w: number, h: number) {
  const v = hacia(ini, (ini.s * d) / d0, m0[0], m0[1], w, h)
  return limita({ s: v.s, tx: v.tx + m[0] - m0[0], ty: v.ty + m[1] - m0[1] }, w, h)
}

/**
 * Un dedo que se soltó con la foto ajustada: de lado cambia de foto (si hay más de una) y hacia abajo cierra el visor.
 * Tiene que ser claro: 50 px de lado o 90 hacia abajo, y una vez y media más que en el otro eje.
 */
export function gesto(dx: number, dy: number, fotos: number): 'siguiente' | 'anterior' | 'cerrar' | null {
  if (fotos > 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) return dx < 0 ? 'siguiente' : 'anterior'
  if (dy > 90 && dy > Math.abs(dx) * 1.5) return 'cerrar'
  return null
}
