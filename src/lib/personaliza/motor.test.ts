import { describe, expect, it } from 'vitest'
import { dentroDe, desenfocar, envolver } from './motor'
import type { Punto } from './datos'

describe('desenfocar', () => {
  it('conserva una imagen pareja y reparte un punto sin cambiar el total', () => {
    expect(Array.from(desenfocar(new Float32Array(25).fill(7), 5, 5, 1, 2))).toEqual(new Array(25).fill(7))
    const punto = new Float32Array(81)
    punto[40] = 81
    const out = desenfocar(punto, 9, 9, 1, 1)
    expect(out[40]).toBeCloseTo(9)
    expect(out[30]).toBeCloseTo(9)
    expect(out.reduce((a, b) => a + b, 0)).toBeCloseTo(81)
  })
})

describe('dentroDe', () => {
  const q: Punto[] = [[0, 0], [10, 1], [9, 10], [1, 9]]
  it('reconoce puntos dentro y fuera de un área torcida', () => {
    expect(dentroDe(q, 5, 5)).toBe(true)
    expect(dentroDe(q, 9.8, 0.5)).toBe(false)
    expect(dentroDe(q, -1, 5)).toBe(false)
  })
})

describe('envolver', () => {
  it('deja fijos los bordes y el centro, y comprime hacia los lados', () => {
    expect(envolver(0, 0.9)).toBeCloseTo(0)
    expect(envolver(1, 0.9)).toBeCloseTo(1)
    expect(envolver(0.5, 0.9)).toBeCloseTo(0.5)
    expect(envolver(0.25, 0.9)).toBeLessThan(0.25)
    expect(envolver(0.3, 0)).toBe(0.3)
  })
})
