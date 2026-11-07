// Archivos que sube el cliente (spec 6.4). Nada se sube a ningún servidor: todo queda en la memoria de la página,
// y el original no se recomprime nunca.
import { bordeTransparente, quitarFondo } from './fondo'

export const MAX_BYTES = 20 * 1024 * 1024
export const MAX_PIXELES = 50_000_000
/** Lado corto por debajo del cual se avisa que puede verse pixelada. */
export const MIN_LADO = 500
/** Lado largo de la imagen de trabajo. */
export const LADO_TRABAJO = 1024
// Sin image/heic: así el iPhone convierte sus fotos a JPG al elegirlas.
export const ACEPTA = 'image/png,image/jpeg,image/webp'

/** HEIC igual se intenta abrir si llega (arrastrado): Safari lo muestra; donde no decodifica, da el error de leerDiseno. */
const SE_INTENTA = /^image\/(png|jpeg|webp|heic|heif)$/
const HEIC = /\.(heic|heif)$/i

/** Primera decisión, sin abrir el archivo. */
export function clasificar(f: { name: string; type: string; size: number }): 'pesada' | 'rechazada' | 'imagen' {
  if (!SE_INTENTA.test(f.type) && !HEIC.test(f.name)) return 'rechazada'
  if (f.size > MAX_BYTES) return 'pesada'
  return 'imagen'
}

/** Ya abierta: más de 50 MP no se decodifica; lado corto de menos de 500 px se muestra con aviso. */
export function porTamano(ancho: number, alto: number): 'pesada' | 'baja' | 'imagen' {
  if (ancho * alto > MAX_PIXELES) return 'pesada'
  if (Math.min(ancho, alto) < MIN_LADO) return 'baja'
  return 'imagen'
}

/** "PNG · 1200 × 1200 px" / "JPG · 2,4 MB" */
export function detalleArchivo(f: { name: string; size: number }, px?: { ancho: number; alto: number }): string {
  const ext = f.name.includes('.') ? f.name.split('.').pop()!.toUpperCase() : 'Archivo'
  if (px) return `${ext} · ${px.ancho} × ${px.alto} px`
  const mb = f.size / 1024 / 1024
  return `${ext} · ${mb >= 1 ? `${mb.toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(f.size / 1024))} KB`}`
}

export interface DisenoLeido {
  estado: 'imagen' | 'baja' | 'pesada'
  archivo: File
  detalle: string
  /** URL del original para miniaturas (solo si se puede mostrar). */
  url?: string
  /** Imagen de trabajo (lado largo ≤ 1024), tal cual. */
  trabajo?: HTMLCanvasElement
  /** La misma sin el fondo, si se encontró uno claro. */
  sinFondo?: HTMLCanvasElement
  /** Una foto u otro fondo que no es claro: conserva el suyo. */
  fondoFijo?: boolean
}

function cargar(url: string): Promise<HTMLImageElement> {
  return new Promise((ok, mal) => {
    const img = new Image()
    img.onload = () => ok(img)
    img.onerror = () => mal(new Error('no se pudo abrir'))
    img.src = url
  })
}

/** Abre el archivo en el navegador. null = no es una imagen que se pueda usar (otro formato, HEIC sin soporte, dañado). */
export async function leerDiseno(archivo: File): Promise<DisenoLeido | null> {
  const tipo = clasificar(archivo)
  if (tipo === 'rechazada') return null
  if (tipo === 'pesada') return { estado: tipo, archivo, detalle: detalleArchivo(archivo) }
  const url = URL.createObjectURL(archivo)
  try {
    const img = await cargar(url)
    const ancho = img.naturalWidth
    const alto = img.naturalHeight
    const t = porTamano(ancho, alto)
    if (t === 'pesada') {
      URL.revokeObjectURL(url)
      return { estado: 'pesada', archivo, detalle: detalleArchivo(archivo) }
    }
    const k = Math.min(1, LADO_TRABAJO / Math.max(ancho, alto))
    const trabajo = document.createElement('canvas')
    trabajo.width = Math.max(1, Math.round(ancho * k))
    trabajo.height = Math.max(1, Math.round(alto * k))
    const ctx = trabajo.getContext('2d', { willReadFrequently: true })!
    ctx.drawImage(img, 0, 0, trabajo.width, trabajo.height)
    const pix = ctx.getImageData(0, 0, trabajo.width, trabajo.height)
    const transparente = bordeTransparente(pix)
    const limpio = transparente ? null : await quitarFondo(pix)
    let sinFondo: HTMLCanvasElement | undefined
    if (limpio) {
      sinFondo = document.createElement('canvas')
      sinFondo.width = trabajo.width
      sinFondo.height = trabajo.height
      sinFondo.getContext('2d')!.putImageData(new ImageData(limpio.data, limpio.width, limpio.height), 0, 0)
    }
    return { estado: t, archivo, url, trabajo, sinFondo, fondoFijo: !limpio && !transparente, detalle: detalleArchivo(archivo, { ancho, alto }) }
  } catch {
    // No decodifica (HEIC en Chrome, archivo dañado).
    URL.revokeObjectURL(url)
    return null
  }
}
