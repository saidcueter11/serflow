import { describe, expect, it } from 'vitest'
import { aspectoArea, cajaDiseno, limitar, tamanoCm } from './lugar'
import type { Area } from './datos'

describe('limitar', () => {
  it('deja la escala entre 0,2 y 1', () => {
    expect(limitar({ cx: 0.5, cy: 0.5, s: 0.05 }, 1, 1).s).toBe(0.2)
    expect(limitar({ cx: 0.5, cy: 0.5, s: 3 }, 2, 1).s).toBe(1)
  })

  it('el diseño nunca sale del área', () => {
    const l = limitar({ cx: 0.95, cy: -1, s: 0.4 }, 1, 1)
    expect(l).toEqual({ s: 0.4, cx: 0.8, cy: 0.2 })
  })

  it('si a ese ancho el diseño es más alto que el área, se reduce hasta caber', () => {
    // Diseño vertical (1:2) en un área cuadrada: a lo sumo la mitad del ancho.
    const l = limitar({ cx: 0.5, cy: 0.5, s: 0.9 }, 0.5, 1)
    expect(l.s).toBe(0.5)
    expect(l.cy).toBe(0.5)
  })

  it('respeta el aspecto del área: en un área ancha cabe un diseño cuadrado más chico', () => {
    // Área 2:1, diseño cuadrado: con s = 0,5 ocupa todo el alto.
    expect(limitar({ cx: 0.5, cy: 0.5, s: 0.8 }, 1, 2).s).toBe(0.5)
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
