import { describe, expect, it } from 'vitest'
import { aspectoArea, cajaDiseno, enderezar, enUnidades, escalaMax, FOTO_ENTERA, giroCaja, limitar, tamanoCm, unidadesFoto } from './lugar'
import type { Area } from './datos'

// 4:5 en px de la escena: el área mide 432 × 432 y queda en el centro de la foto.
const CENTRO: Area = { tl: [0.3, 0.34], tr: [0.7, 0.34], br: [0.7, 0.66], bl: [0.3, 0.66] }

describe('limitar', () => {
  it('deja la escala entre 0,1 y el máximo', () => {
    expect(limitar({ cx: 0.5, cy: 0.5, s: 0.01 }, 1, CENTRO).s).toBe(0.1)
    expect(limitar({ cx: 0.5, cy: 0.5, s: 3 }, 1, CENTRO).s).toBe(1)
  })

  it('el diseño se sale del área libremente, dentro de la foto', () => {
    const l = limitar({ cx: -0.2, cy: 1.3, s: 0.4 }, 1, CENTRO)
    expect(l).toEqual({ s: 0.4, cx: -0.2, cy: 1.3 })
  })

  it('pero no se pierde: su caja se queda dentro de la foto', () => {
    const v = enUnidades(CENTRO, FOTO_ENTERA)
    const l = limitar({ cx: 99, cy: -99, s: 0.4 }, 1, CENTRO)
    expect(l.cx + 0.2).toBeCloseTo(v.right)
    expect(l.cy - 0.2).toBeCloseTo(v.top)
  })

  it('con una ventana (el recorte visible) se queda dentro de ella', () => {
    const ventana = { left: 0, top: 0.2, right: 1, bottom: 0.8 }
    const v = enUnidades(CENTRO, ventana)
    const l = limitar({ cx: 0.5, cy: -99, s: 0.4 }, 1, CENTRO, 1, ventana)
    expect(l.cy - 0.2).toBeCloseTo(v.top)
    expect(limitar({ cx: 0.5, cy: 99, s: 0.4 }, 1, CENTRO, 1, ventana).cy + 0.2).toBeCloseTo(v.bottom)
  })

  it('si no cabe en la ventana a ese ancho, se reduce hasta caber', () => {
    // Diseño muy vertical (1:4) con una ventana de 2 áreas de alto: a lo sumo 0,5 de ancho.
    const ventana = { left: 0, top: 0.18, right: 1, bottom: 0.82 }
    expect(limitar({ cx: 0.5, cy: 0.5, s: 0.9 }, 0.25, CENTRO, 1, ventana).s).toBeCloseTo(0.5)
  })
})

describe('escalaMax', () => {
  it('bordado en camiseta: lo que da 10 cm en cada área', () => {
    expect(tamanoCm(30, escalaMax('camiseta', 'bordado', 30))).toBe(10)
    expect(tamanoCm(35, escalaMax('camiseta', 'bordado', 35))).toBe(10)
  })

  it('sin tope en las otras técnicas ni en la gorra', () => {
    expect(escalaMax('camiseta', 'estampado', 30)).toBe(1)
    expect(escalaMax('gorra', 'bordado', 12)).toBe(1)
  })

  it('limitar respeta el máximo, también al crecer', () => {
    expect(limitar({ cx: 0.5, cy: 0.5, s: 0.62 }, 1, CENTRO, 1 / 3).s).toBe(1 / 3)
    expect(limitar({ cx: 0.5, cy: 0.5, s: 0.25 }, 1, CENTRO, 1 / 3).s).toBe(0.25)
  })
})

describe('tamanoCm', () => {
  it('ancho real del área por la escala, redondeado', () => {
    expect(tamanoCm(30, 0.62)).toBe(19)
    expect(tamanoCm(12, 0.62)).toBe(7)
  })
})

describe('áreas de 4 esquinas', () => {
  it('unidadesFoto cubre todo lo que limitar deja alcanzar; en un rectángulo es enUnidades', () => {
    const gorra: Area = { tl: [0.356, 0.593], tr: [0.718, 0.615], br: [0.785, 0.845], bl: [0.325, 0.795] }
    const u = unidadesFoto(gorra)
    for (const [cx, cy] of [[-9, 9], [9, 9], [-9, -9], [9, -9]]) {
      const l = limitar({ cx, cy, s: 0.6 }, 1, gorra)
      const h = 0.6 * aspectoArea(gorra)
      expect(l.cx - l.s / 2).toBeGreaterThanOrEqual(u.left)
      expect(l.cx + l.s / 2).toBeLessThanOrEqual(u.right)
      expect(l.cy - h / 2).toBeGreaterThanOrEqual(u.top)
      expect(l.cy + h / 2).toBeLessThanOrEqual(u.bottom)
    }
    expect(unidadesFoto(CENTRO)).toEqual(enUnidades(CENTRO, FOTO_ENTERA))
  })

  it('limitar mide las esquinas reales: en un área que no es un rectángulo tampoco se sale de la ventana', () => {
    const gorra: Area = { tl: [0.356, 0.593], tr: [0.718, 0.615], br: [0.785, 0.845], bl: [0.325, 0.795] }
    const v = { left: 0, top: 0.1, right: 1, bottom: 0.9 }
    for (const [cx, cy] of [[-9, 9], [9, 9], [-9, -9], [9, -9]]) {
      const l = limitar({ cx, cy, s: 0.6 }, 1, gorra, 1, v)
      const c = cajaDiseno(gorra, l, 1, aspectoArea(gorra))
      expect(c.left).toBeGreaterThanOrEqual(v.left - 1e-3)
      expect(c.top).toBeGreaterThanOrEqual(v.top - 1e-3)
      expect(c.left + c.width).toBeLessThanOrEqual(v.right + 1e-3)
      expect(c.top + c.height).toBeLessThanOrEqual(v.bottom + 1e-3)
      expect(l.s).toBe(0.6)
    }
  })

  const cuadrada: Area = { tl: [0.2, 0.2], tr: [0.6, 0.2], br: [0.6, 0.52], bl: [0.2, 0.52] }

  it('mide el aspecto en px de la escena 4:5', () => {
    // 0,4 × 1080 = 432 de ancho, 0,32 × 1350 = 432 de alto.
    expect(aspectoArea(cuadrada)).toBeCloseTo(1)
  })

  it('caja del diseño en fracciones de la foto', () => {
    const c = cajaDiseno(cuadrada, { cx: 0.5, cy: 0.5, s: 0.5 }, 1, 1)
    expect(c.left).toBeCloseTo(0.3)
    expect(c.width).toBeCloseTo(0.2)
    expect(c.top).toBeCloseTo(0.28)
    expect(c.height).toBeCloseTo(0.16)
  })
})

describe('giro', () => {
  it('sin giro, la caja es la del diseño; a 90°, ancho y alto se cambian', () => {
    expect(giroCaja(0.4, 2, 1)).toEqual({ w: 0.4, h: 0.2 })
    const g = giroCaja(0.4, 2, 1, 90)
    expect(g.w).toBeCloseTo(0.2)
    expect(g.h).toBeCloseTo(0.4)
  })

  it('una tira ancha girada 90° se achica para caber a lo alto, y conserva el giro', () => {
    // Ventana de lo visible: 1 de ancho y 0,5 de alto (en unidades del área).
    const v = { left: 0.3, top: 0.42, right: 0.7, bottom: 0.58 }
    expect(enUnidades(CENTRO, v)).toMatchObject({ left: 0, right: 1 })
    const l = limitar({ cx: 0.5, cy: 0.5, s: 1, r: 90 }, 4, CENTRO, 1, v)
    expect(l.r).toBe(90)
    expect(giroCaja(l.s, 4, 1, 90).h).toBeCloseTo(0.5)
  })

  it('enderezar deja el giro entre -180 y 180 y vuelve a 0 cerca de recto', () => {
    expect(enderezar(195)).toBe(-165)
    expect(enderezar(-200)).toBe(160)
    expect(enderezar(3)).toBe(0)
    expect(enderezar(358)).toBe(0)
    expect(enderezar(15)).toBe(15)
  })
})
