import { describe, expect, it } from 'vitest'
import { aspectoArea, cajaDiseno, enUnidades, escalaMax, FOTO_ENTERA, limitar, tamanoCm } from './lugar'
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
