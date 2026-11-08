// Quitar un fondo complejo (PRI-436): cuando el automático de fondo.ts no puede (una foto, un cuarto, una mesa), el cliente
// toca "Quitar fondo" y u2netp (U-2-Net, Apache-2.0) recorta lo principal con onnxruntime-web (MIT) en un Web Worker. Gratis:
// corre en su navegador, la foto no sale del teléfono y nada se baja hasta que toca el botón. La segunda vez sale del caché.
import type { Pixeles } from './fondo'

/** Lado de entrada de u2netp. */
export const LADO_IA = 320
/** Bytes que baja el worker (sin comprimir): el wasm de onnxruntime-web y el modelo. fondo-ia.test.ts los compara con los archivos. */
export const BYTES_WASM = 14_239_897
export const BYTES_MODELO = 4_574_861
/** Lo que se le dice al cliente antes de bajar: lo que pasa por la red con la compresión de Netlify (medido en el deploy preview). */
export const MB_DESCARGA = 7

export type MotivoIa = 'navegador' | 'memoria' | 'red' | 'fallo'
export type FondoIa = { fase: 'listo' } | { fase: 'bajando'; pct: number } | { fase: 'quitando' } | { fase: 'error'; motivo: MotivoIa }

const MEDIA = [0.485, 0.456, 0.406]
const DESVIO = [0.229, 0.224, 0.225]

/** RGBA -> tensor NCHW normalizado como se entrenó u2netp (y como lo hace rembg: dividido por el máximo de la imagen). */
export function entrada({ data, width, height }: Pixeles): Float32Array {
  const n = width * height
  let max = 1
  for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) max = Math.max(max, data[i * 4 + c])
  const t = new Float32Array(3 * n)
  for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) t[c * n + i] = (data[i * 4 + c] / max - MEDIA[c]) / DESVIO[c]
  return t
}

/** Salida del modelo -> alfa 0-255, estirada entre su mínimo y su máximo (como rembg). */
export function alfa(salida: Float32Array): Uint8ClampedArray {
  let mn = Infinity
  let mx = -Infinity
  for (const v of salida) {
    mn = Math.min(mn, v)
    mx = Math.max(mx, v)
  }
  const r = mx - mn || 1
  return Uint8ClampedArray.from(salida, (v) => (255 * (v - mn)) / r)
}

// Módulo mínimo con una instrucción SIMD (el de wasm-feature-detect, Apache-2.0): el wasm de onnxruntime-web la necesita.
const SIMD = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11])

/** ¿Puede este dispositivo correr el modelo? Si no, por qué. Sin memoria declarada (Safari, Firefox) se intenta. */
export function soporteIa(): 'ok' | 'navegador' | 'memoria' {
  if (typeof WebAssembly !== 'object' || typeof Worker !== 'function' || !WebAssembly.validate(SIMD)) return 'navegador'
  const memoria = (navigator as { deviceMemory?: number }).deviceMemory
  return memoria !== undefined && memoria < 2 ? 'memoria' : 'ok'
}

/**
 * La imagen de trabajo sin fondo. onProgreso recibe 0-100 mientras baja y null mientras recorta. Falla con Error(MotivoIa), o
 * con AbortError si se cancela; en los dos casos la imagen no cambió. El worker se cierra al terminar: libera la memoria del modelo.
 */
export function quitarFondoIa(trabajo: HTMLCanvasElement, onProgreso: (pct: number | null) => void, signal: AbortSignal): Promise<HTMLCanvasElement> {
  const chico = document.createElement('canvas')
  chico.width = chico.height = LADO_IA
  const ctx = chico.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(trabajo, 0, 0, LADO_IA, LADO_IA)
  const tensor = entrada(ctx.getImageData(0, 0, LADO_IA, LADO_IA))
  const worker = new Worker(new URL('./fondo-ia.worker.ts', import.meta.url), { type: 'module' })

  return new Promise((ok, mal) => {
    const fin = () => {
      worker.terminate()
      signal.removeEventListener('abort', cancelar)
    }
    const cancelar = () => {
      fin()
      mal(new DOMException('Cancelado', 'AbortError'))
    }
    if (signal.aborted) return cancelar()
    signal.addEventListener('abort', cancelar)
    // No cargó el worker o se cayó sin avisar (sin memoria, CSP).
    worker.onerror = (e) => {
      e.preventDefault()
      fin()
      mal(new Error('fallo'))
    }
    worker.onmessage = ({ data: m }: MessageEvent<{ pct?: number | null; error?: MotivoIa; salida?: Float32Array }>) => {
      if (m.pct !== undefined) return onProgreso(m.pct)
      fin()
      if (!m.salida) return mal(new Error(m.error ?? 'fallo'))
      // La máscara de 320 vuelve al tamaño de trabajo con el escalado del canvas, y recorta con destination-in.
      const a = alfa(m.salida)
      const mascara = ctx.createImageData(LADO_IA, LADO_IA)
      for (let i = 0; i < a.length; i++) mascara.data[i * 4 + 3] = a[i]
      ctx.putImageData(mascara, 0, 0)
      const out = document.createElement('canvas')
      out.width = trabajo.width
      out.height = trabajo.height
      const o = out.getContext('2d')!
      o.drawImage(trabajo, 0, 0)
      o.globalCompositeOperation = 'destination-in'
      o.drawImage(chico, 0, 0, out.width, out.height)
      ok(out)
    }
    worker.postMessage({ tensor, lado: LADO_IA, total: BYTES_WASM + BYTES_MODELO }, [tensor.buffer])
  })
}
