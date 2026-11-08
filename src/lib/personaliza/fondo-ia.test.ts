import { statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { BYTES_MODELO, BYTES_WASM, alfa, entrada, soporteIa } from './fondo-ia'

describe('fondo-ia', () => {
  it('el progreso cuenta los bytes reales del wasm y del modelo', () => {
    const wasm = createRequire(import.meta.url).resolve('onnxruntime-web/ort-wasm-simd-threaded.wasm')
    expect(statSync(wasm).size).toBe(BYTES_WASM)
    expect(statSync(new URL('./u2netp.onnx', import.meta.url)).size).toBe(BYTES_MODELO)
  })

  it('normaliza la entrada en NCHW, dividida por el máximo de la imagen', () => {
    // 2 píxeles: rojo a medias y blanco; el máximo es 200.
    const data = new Uint8ClampedArray([100, 0, 0, 255, 200, 200, 200, 255])
    const t = entrada({ data, width: 2, height: 1 })
    expect(t).toHaveLength(6)
    expect(t[0]).toBeCloseTo((0.5 - 0.485) / 0.229)
    expect(t[1]).toBeCloseTo((1 - 0.485) / 0.229)
    expect(t[2]).toBeCloseTo((0 - 0.456) / 0.224)
    expect(t[5]).toBeCloseTo((1 - 0.406) / 0.225)
  })

  it('una imagen negra no divide por cero', () => {
    expect([...entrada({ data: new Uint8ClampedArray(4), width: 1, height: 1 })].every(Number.isFinite)).toBe(true)
  })

  it('estira la máscara entre su mínimo y su máximo', () => {
    expect([...alfa(new Float32Array([0.25, 0.75, 0.5]))]).toEqual([0, 255, 128])
    expect([...alfa(new Float32Array([0.5, 0.5]))]).toEqual([0, 0])
  })

  it('detecta SIMD con un módulo válido (Node lo soporta) y dice qué falta', () => {
    const w = globalThis.Worker
    globalThis.Worker = class {} as unknown as typeof Worker
    try {
      expect(soporteIa()).toBe('ok')
      Object.defineProperty(navigator, 'deviceMemory', { value: 1, configurable: true })
      expect(soporteIa()).toBe('memoria')
    } finally {
      globalThis.Worker = w
      delete (navigator as { deviceMemory?: number }).deviceMemory
    }
    expect(soporteIa()).toBe('navegador')
  })
})
