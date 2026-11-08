// Worker de fondo-ia.ts (PRI-436): baja el wasm y el modelo (o los saca del caché), y recorta. Solo se crea al tocar el botón.
import * as ort from 'onnxruntime-web/wasm'
import wasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.wasm?url'
import modeloUrl from './u2netp.onnx?url'

const CACHE = 'serflow-fondo-ia'
const urls = [wasmUrl, modeloUrl].map((u) => new URL(u, location.href).href)

async function abrirCache(): Promise<Cache | null> {
  try {
    const c = await caches.open(CACHE)
    // Los nombres llevan hash: lo que no sea de esta versión sobra.
    for (const k of await c.keys()) if (!urls.includes(k.url)) await c.delete(k)
    return c
  } catch {
    // Sin Cache Storage (modo privado, http): se baja cada vez.
    return null
  }
}

async function bajar(url: string, cache: Cache | null, sumar: (n: number) => void): Promise<ArrayBuffer> {
  const guardada = await cache?.match(url)
  const r = guardada ?? (await fetch(url).catch(() => null))
  if (!r?.ok || !r.body) throw new Error('red')
  const partes: Uint8Array[] = []
  const lector = r.body.getReader()
  for (;;) {
    const { done, value } = await lector.read().catch(() => {
      throw new Error('red')
    })
    if (done) break
    partes.push(value)
    sumar(value.byteLength)
  }
  const buf = await new Blob(partes as BlobPart[]).arrayBuffer()
  // Sin cuota no se guarda: igual funciona.
  if (!guardada) await cache?.put(url, new Response(buf)).catch(() => {})
  return buf
}

self.onmessage = async ({ data }: MessageEvent<{ tensor: Float32Array; lado: number; total: number }>) => {
  try {
    const cache = await abrirCache()
    let llevo = 0
    let pct = -1
    const sumar = (n: number) => {
      llevo += n
      const p = Math.min(100, Math.floor((llevo * 100) / data.total))
      if (p !== pct) postMessage({ pct: (pct = p) })
    }
    const [wasm, modelo] = await Promise.all(urls.map((u) => bajar(u, cache, sumar)))
    postMessage({ pct: null })
    ort.env.wasm.wasmBinary = wasm
    // Sin COOP/COEP no hay SharedArrayBuffer: un hilo.
    ort.env.wasm.numThreads = 1
    const sesion = await ort.InferenceSession.create(modelo, { executionProviders: ['wasm'] })
    const r = await sesion.run({ [sesion.inputNames[0]]: new ort.Tensor('float32', data.tensor, [1, 3, data.lado, data.lado]) })
    const salida = r[sesion.outputNames[0]].data as Float32Array
    postMessage({ salida }, { transfer: [salida.buffer] })
  } catch (e) {
    const m = e instanceof Error ? e.message : ''
    postMessage({ error: m === 'red' ? 'red' : e instanceof RangeError || /memory|alloc/i.test(m) ? 'memoria' : 'fallo' })
  }
}
