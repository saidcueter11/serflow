// Archivos que sube el cliente (spec 6.4). Nada se sube a ningún servidor: todo queda en la memoria de la página,
// y el original no se recomprime nunca.
import { fondoPlano, quitarFondo } from './fondo'

export const MAX_BYTES = 20 * 1024 * 1024
export const MAX_PIXELES = 50_000_000
/** Lado corto por debajo del cual se avisa que puede verse pixelada. */
export const MIN_LADO = 500
/** Lado largo de la imagen de trabajo. */
export const LADO_TRABAJO = 1024
export const ACEPTA = 'image/*,.pdf,.ai,.psd'

/** Formatos que no se intentan abrir aunque el navegador los marque como imagen (PSD llega como image/vnd.adobe.photoshop). */
const NO_MOSTRABLE = /\.(pdf|ai|psd|eps|cdr)$/i

/** Primera decisión, sin abrir el archivo. */
export function clasificar(f: { name: string; type: string; size: number }): 'pesada' | 'archivo' | 'imagen' {
  if (NO_MOSTRABLE.test(f.name) || !f.type.startsWith('image/')) return 'archivo'
  if (f.size > MAX_BYTES) return 'pesada'
  return 'imagen'
}

/** Ya abierta: más de 50 MP no se decodifica; lado corto de menos de 500 px se muestra con aviso. */
export function porTamano(ancho: number, alto: number, vector: boolean): 'pesada' | 'baja' | 'imagen' {
  if (ancho * alto > MAX_PIXELES) return 'pesada'
  if (!vector && Math.min(ancho, alto) < MIN_LADO) return 'baja'
  return 'imagen'
}

/** "PNG · 1200 × 1200 px" / "PDF · 2,4 MB" */
export function detalleArchivo(f: { name: string; size: number }, px?: { ancho: number; alto: number }): string {
  const ext = f.name.includes('.') ? f.name.split('.').pop()!.toUpperCase() : 'Archivo'
  if (px) return `${ext} · ${px.ancho} × ${px.alto} px`
  const mb = f.size / 1024 / 1024
  return `${ext} · ${mb >= 1 ? `${mb.toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(f.size / 1024))} KB`}`
}

export interface DisenoLeido {
  estado: 'imagen' | 'baja' | 'archivo' | 'pesada'
  archivo: File
  detalle: string
  /** URL del original para miniaturas (solo si se puede mostrar). */
  url?: string
  /** Imagen de trabajo (lado largo ≤ 1024), tal cual. */
  trabajo?: HTMLCanvasElement
  /** La misma sin el fondo plano, si se detectó uno. */
  sinFondo?: HTMLCanvasElement
}

function cargar(url: string): Promise<HTMLImageElement> {
  return new Promise((ok, mal) => {
    const img = new Image()
    img.onload = () => ok(img)
    img.onerror = () => mal(new Error('no se pudo abrir'))
    img.src = url
  })
}

/** Abre el archivo en el navegador. Si no se puede (o no deja leer sus píxeles), queda como tarjeta de archivo. */
export async function leerDiseno(archivo: File): Promise<DisenoLeido> {
  const tipo = clasificar(archivo)
  if (tipo !== 'imagen') return { estado: tipo, archivo, detalle: detalleArchivo(archivo) }
  const url = URL.createObjectURL(archivo)
  try {
    const img = await cargar(url)
    const vector = archivo.type === 'image/svg+xml'
    // Un SVG sin width/height llega con 0: se dibuja al tamaño de trabajo.
    const ancho = img.naturalWidth || LADO_TRABAJO
    const alto = img.naturalHeight || LADO_TRABAJO
    const t = porTamano(ancho, alto, vector)
    if (t === 'pesada') {
      URL.revokeObjectURL(url)
      return { estado: 'pesada', archivo, detalle: detalleArchivo(archivo) }
    }
    // Un vector se rasteriza al tamaño de trabajo; una foto solo se reduce.
    const k = vector ? LADO_TRABAJO / Math.max(ancho, alto) : Math.min(1, LADO_TRABAJO / Math.max(ancho, alto))
    const trabajo = document.createElement('canvas')
    trabajo.width = Math.max(1, Math.round(ancho * k))
    trabajo.height = Math.max(1, Math.round(alto * k))
    const ctx = trabajo.getContext('2d', { willReadFrequently: true })!
    ctx.drawImage(img, 0, 0, trabajo.width, trabajo.height)
    const pix = ctx.getImageData(0, 0, trabajo.width, trabajo.height)
    const fondo = fondoPlano(pix)
    let sinFondo: HTMLCanvasElement | undefined
    if (fondo) {
      const limpio = quitarFondo(pix, fondo)
      sinFondo = document.createElement('canvas')
      sinFondo.width = trabajo.width
      sinFondo.height = trabajo.height
      sinFondo.getContext('2d')!.putImageData(new ImageData(limpio.data, limpio.width, limpio.height), 0, 0)
    }
    return { estado: t, archivo, url, trabajo, sinFondo, detalle: detalleArchivo(archivo, vector ? undefined : { ancho, alto }) }
  } catch {
    // No decodifica (HEIC en Chrome, archivo dañado) o el canvas quedó contaminado: tarjeta de archivo.
    URL.revokeObjectURL(url)
    return { estado: 'archivo', archivo, detalle: detalleArchivo(archivo) }
  }
}
