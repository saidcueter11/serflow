// Motor de la vista realista (spec 6.2), portado del prototipo v4. Canvas 2D sin librerías ni WebGL: lo que se ve en
// la vista previa es exactamente lo que se descarga como mockup. El diseño solo se pinta dentro del área de impresión,
// así que no hace falta máscara de la prenda. Luminancia, desenfoque y filtros de técnica se hacen sobre los píxeles
// (ctx.filter no existe en Safari viejo).
import { ESCENA, type Area, type Punto, type Tecnica } from './datos'
import { aspectoArea, enArea, type Lugar } from './lugar'

const { ancho: W, alto: H } = ESCENA
/** Malla completa y la rápida que se usa mientras se arrastra (sin pliegues). */
const N = 16
const N_RAPIDA = 8
/** Ancho del espacio plano del área en el que se coloca el diseño. */
const PA = 600
/** Lado largo del diseño ya tratado (bordado en 512 × 512 como mucho). */
const LADO_DISENO = 512
const MARGEN = 12

export interface Region {
  x: number
  y: number
  w: number
  h: number
}

export interface FotoLista {
  escena: HTMLCanvasElement
  area: Area
  /** Caja del área más un margen, en px de la escena: los mapas y la capa del diseño tienen este tamaño. */
  region: Region
  quad: Punto[]
  sombras: HTMLCanvasElement
  luces: HTMLCanvasElement
  trama: HTMLCanvasElement
  oscura: boolean
  malla: Punto[][]
  rapida: Punto[][]
}

function lienzo(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

// Canvas auxiliares reutilizados entre cuadros: crear canvas en cada cuadro no aguanta en gama baja.
const aux = new Map<string, HTMLCanvasElement>()
function auxiliar(nombre: string, w: number, h: number): HTMLCanvasElement {
  let c = aux.get(nombre)
  if (!c) aux.set(nombre, (c = lienzo(w, h)))
  if (c.width !== w || c.height !== h) {
    c.width = w
    c.height = h
  }
  return c
}

export function luminancia(d: Uint8ClampedArray): Float32Array {
  const L = new Float32Array(d.length / 4)
  for (let i = 0; i < L.length; i++) L[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]
  return L
}

/** Desenfoque de caja separable, repetido `pasadas` veces (se acerca a una gaussiana). */
export function desenfocar(src: Float32Array, w: number, h: number, r: number, pasadas: number): Float32Array {
  const a = Float32Array.from(src)
  const b = new Float32Array(a.length)
  const linea = (from: Float32Array, to: Float32Array, n: number, paso: number, inicio: number) => {
    let suma = 0
    for (let k = -r; k <= r; k++) suma += from[inicio + Math.min(n - 1, Math.max(0, k)) * paso]
    for (let i = 0; i < n; i++) {
      to[inicio + i * paso] = suma / (2 * r + 1)
      suma += from[inicio + Math.min(n - 1, i + r + 1) * paso] - from[inicio + Math.max(0, i - r) * paso]
    }
  }
  for (let p = 0; p < pasadas; p++) {
    for (let y = 0; y < h; y++) linea(a, b, w, 1, y * w)
    for (let x = 0; x < w; x++) linea(b, a, h, w, x)
  }
  return a
}

/** Punto dentro de un cuadrilátero convexo. */
export function dentroDe(q: Punto[], x: number, y: number): boolean {
  let signo = 0
  for (let i = 0; i < q.length; i++) {
    const [ax, ay] = q[i]
    const [bx, by] = q[(i + 1) % q.length]
    const c = (bx - ax) * (y - ay) - (by - ay) * (x - ax)
    if (c !== 0) {
      if (signo && Math.sign(c) !== signo) return false
      signo = Math.sign(c)
    }
  }
  return true
}

/** Un diseño plano sobre un cilindro visto de frente: se comprime hacia los lados. */
export function envolver(u: number, curva: number): number {
  if (!curva) return u
  const th = curva * 1.4
  return 0.5 + Math.sin((u - 0.5) * th) / (2 * Math.sin(th / 2))
}

function gris(w: number, h: number, fn: (i: number) => number): HTMLCanvasElement {
  const c = lienzo(w, h)
  const x = c.getContext('2d')!
  const im = x.createImageData(w, h)
  for (let i = 0; i < w * h; i++) {
    const v = fn(i)
    im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v
    im.data[i * 4 + 3] = 255
  }
  x.putImageData(im, 0, 0)
  return c
}

/** Se calcula una vez por foto y se guarda en memoria. */
export function prepararFoto(img: HTMLImageElement, area: Area, curva: number): FotoLista {
  const escena = lienzo(W, H)
  const ctx = escena.getContext('2d', { willReadFrequently: true })!
  const k = Math.max(W / img.naturalWidth, H / img.naturalHeight)
  ctx.drawImage(img, (W - img.naturalWidth * k) / 2, (H - img.naturalHeight * k) / 2, img.naturalWidth * k, img.naturalHeight * k)

  const quad: Punto[] = [area.tl, area.tr, area.br, area.bl].map(([x, y]) => [x * W, y * H])
  const xs = quad.map((p) => p[0])
  const ys = quad.map((p) => p[1])
  const x0 = Math.max(0, Math.floor(Math.min(...xs)) - MARGEN)
  const y0 = Math.max(0, Math.floor(Math.min(...ys)) - MARGEN)
  const region = { x: x0, y: y0, w: Math.min(W, Math.ceil(Math.max(...xs)) + MARGEN) - x0, h: Math.min(H, Math.ceil(Math.max(...ys)) + MARGEN) - y0 }
  const { w, h } = region

  // Luminancia de la tela a tres escalas: pliegues (desplazar), sombras y trama.
  const L = luminancia(ctx.getImageData(region.x, region.y, w, h).data)
  const pliegues = desenfocar(L, w, h, 6, 3)
  const L1 = desenfocar(L, w, h, 1, 1)
  const L4 = desenfocar(L, w, h, 4, 2)
  // Luz media solo con los píxeles dentro del área (el admin no la configura).
  let suma = 0
  let n = 0
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (dentroDe(quad, x + region.x, y + region.y)) {
        suma += L1[y * w + x]
        n++
      }
  const ref = Math.max(8, suma / Math.max(1, n)) * 1.05
  const wk = ref < 60 ? 9 : ref < 140 ? 6 : 4.5
  const sombras = gris(w, h, (i) => Math.min(255, (255 * L1[i]) / ref))
  const luces = gris(w, h, (i) => Math.max(0, Math.min(255, (L1[i] - ref) * 3.2)))
  const trama = gris(w, h, (i) => 128 + Math.max(-127, Math.min(127, (L1[i] - L4[i]) * wk)))

  const desplazar = ([px, py]: Punto): Punto => {
    const x = Math.round(px - region.x)
    const y = Math.round(py - region.y)
    if (x < 5 || y < 5 || x >= w - 5 || y >= h - 5) return [px, py]
    const gx = pliegues[y * w + x + 5] - pliegues[y * w + x - 5]
    const gy = pliegues[(y + 5) * w + x] - pliegues[(y - 5) * w + x]
    return [px + gx * 0.2, py + gy * 0.2]
  }
  const malla = (n: number, conPliegues: boolean): Punto[][] =>
    Array.from({ length: n + 1 }, (_, j) =>
      Array.from({ length: n + 1 }, (_, i) => {
        const u = i / n
        const v = j / n
        // Sobre una superficie redonda el centro baja un poco.
        const bulto = curva * 0.035 * Math.sin(u * Math.PI)
        const [fx, fy] = enArea(area, envolver(u, curva), v + bulto * (1 - v))
        const p: Punto = [fx * W, fy * H]
        return conPliegues ? desplazar(p) : p
      }),
    )

  return { escena, area, region, quad, sombras, luces, trama, oscura: ref < 70, malla: malla(N, true), rapida: malla(N_RAPIDA, false) }
}

/** Filtros saturate y contrast de CSS, a mano. */
function ajustar(d: Uint8ClampedArray, sat: number, con: number) {
  const m = [
    0.213 + 0.787 * sat, 0.715 - 0.715 * sat, 0.072 - 0.072 * sat,
    0.213 - 0.213 * sat, 0.715 + 0.285 * sat, 0.072 - 0.072 * sat,
    0.213 - 0.213 * sat, 0.715 - 0.715 * sat, 0.072 + 0.928 * sat,
  ]
  for (let o = 0; o < d.length; o += 4) {
    const [r, g, b] = [d[o], d[o + 1], d[o + 2]]
    for (let k = 0; k < 3; k++) d[o + k] = (m[k * 3] * r + m[k * 3 + 1] * g + m[k * 3 + 2] * b - 128) * con + 128
  }
}

/** Bordado: pocos colores de hilo (k-means), relieve por distancia al borde, puntadas satinadas con dirección por color. */
function bordar(c: HTMLCanvasElement) {
  const w = c.width
  const h = c.height
  const x = c.getContext('2d')!
  const im = x.getImageData(0, 0, w, h)
  const p = im.data
  const N = w * h
  const op = new Uint8Array(N)
  for (let i = 0; i < N; i++) op[i] = p[i * 4 + 3] > 110 ? 1 : 0
  const K = 6
  const cen: number[][] = []
  for (let i = 0; i < N && cen.length < K; i += Math.max(1, Math.floor(N / 97)))
    if (op[i]) {
      const o = i * 4
      if (!cen.some((c0) => Math.abs(c0[0] - p[o]) + Math.abs(c0[1] - p[o + 1]) + Math.abs(c0[2] - p[o + 2]) < 60)) cen.push([p[o], p[o + 1], p[o + 2]])
    }
  if (!cen.length) cen.push([200, 200, 200])
  const idx = new Uint8Array(N)
  const cerca = (o: number) => {
    let b = 0
    let bd = 1e9
    for (let k = 0; k < cen.length; k++) {
      const dd = (cen[k][0] - p[o]) ** 2 + (cen[k][1] - p[o + 1]) ** 2 + (cen[k][2] - p[o + 2]) ** 2
      if (dd < bd) {
        bd = dd
        b = k
      }
    }
    return b
  }
  for (let it = 0; it < 5; it++) {
    const acc = cen.map(() => [0, 0, 0, 0])
    for (let i = 0; i < N; i += 3)
      if (op[i]) {
        const o = i * 4
        const k = cerca(o)
        acc[k][0] += p[o]
        acc[k][1] += p[o + 1]
        acc[k][2] += p[o + 2]
        acc[k][3]++
      }
    acc.forEach((a, k) => {
      if (a[3]) cen[k] = [a[0] / a[3], a[1] / a[3], a[2] / a[3]]
    })
  }
  for (let i = 0; i < N; i++) if (op[i]) idx[i] = cerca(i * 4)
  // Distancia al borde de cada región de color (chamfer).
  const D = new Float32Array(N)
  for (let y = 0; y < h; y++)
    for (let xx = 0; xx < w; xx++) {
      const i = y * w + xx
      if (!op[i]) continue
      const borde =
        xx === 0 || y === 0 || xx === w - 1 || y === h - 1 ||
        !op[i - 1] || !op[i + 1] || !op[i - w] || !op[i + w] ||
        idx[i - 1] !== idx[i] || idx[i + 1] !== idx[i] || idx[i - w] !== idx[i] || idx[i + w] !== idx[i]
      D[i] = borde ? 1 : 99
    }
  for (let y = 1; y < h - 1; y++)
    for (let xx = 1; xx < w - 1; xx++) {
      const i = y * w + xx
      if (D[i] > 1) D[i] = Math.min(D[i], D[i - 1] + 1, D[i - w] + 1, D[i - w - 1] + 1.4, D[i - w + 1] + 1.4)
    }
  for (let y = h - 2; y > 0; y--)
    for (let xx = w - 2; xx > 0; xx--) {
      const i = y * w + xx
      if (D[i] > 1) D[i] = Math.min(D[i], D[i + 1] + 1, D[i + w] + 1, D[i + w + 1] + 1.4, D[i + w - 1] + 1.4)
    }
  const Hh = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    const t = Math.min(D[i], 8) / 8
    Hh[i] = op[i] ? t * t * (3 - 2 * t) : 0
  }
  const lx = -0.55
  const ly = -0.65
  const lz = 0.52
  for (let y = 0; y < h; y++)
    for (let xx = 0; xx < w; xx++) {
      const i = y * w + xx
      const o = i * 4
      if (!op[i] || xx === 0 || y === 0 || xx === w - 1 || y === h - 1) {
        p[o + 3] = 0
        continue
      }
      const nx = -(Hh[i + 1] - Hh[i - 1]) * 3
      const ny = -(Hh[i + w] - Hh[i - w]) * 3
      const nl = Math.hypot(nx, ny, 1)
      const lam = Math.max(0, (nx * lx + ny * ly + lz) / nl) / lz
      const k = idx[i]
      const borde = D[i] < 2.6
      const a = borde ? k * 0.9 + 0.6 + Math.PI / 2 : k * 0.9 + 0.6
      const s = xx * Math.cos(a) + y * Math.sin(a)
      const tt = -xx * Math.sin(a) + y * Math.cos(a)
      const raya = 0.5 + 0.5 * Math.cos((2 * Math.PI * s) / 3.1)
      const fila = Math.floor(s / 3.1)
      const corte = (((tt + (fila % 2) * 5) % 10) + 10) % 10 < 0.9 ? 0.72 : 1
      const brillo = 0.74 + 0.36 * raya * raya
      const f = (borde ? 0.82 : 1) * (0.5 + 0.62 * lam) * brillo * corte
      const spec = 46 * Math.max(0, lam - 0.9) * raya
      p[o] = Math.min(255, cen[k][0] * f + spec)
      p[o + 1] = Math.min(255, cen[k][1] * f + spec)
      p[o + 2] = Math.min(255, cen[k][2] * f + spec)
      p[o + 3] = 255
    }
  x.putImageData(im, 0, 0)
}

/** Se recalcula al subir el diseño o cambiar de técnica, no en cada cuadro. */
export function prepararDiseno(src: HTMLCanvasElement, tecnica: Tecnica): HTMLCanvasElement {
  const k = Math.min(1, LADO_DISENO / Math.max(src.width, src.height))
  const c = lienzo(Math.max(1, Math.round(src.width * k)), Math.max(1, Math.round(src.height * k)))
  const x = c.getContext('2d', { willReadFrequently: true })!
  x.drawImage(src, 0, 0, c.width, c.height)
  if (tecnica === 'bordado') {
    bordar(c)
    return c
  }
  const im = x.getImageData(0, 0, c.width, c.height)
  if (tecnica === 'dtf') ajustar(im.data, 1.35, 1.08)
  else ajustar(im.data, 0.85, 0.95)
  x.putImageData(im, 0, 0)
  if (tecnica === 'dtf') {
    // Brillo del film en degradado.
    x.globalCompositeOperation = 'source-atop'
    const gr = x.createLinearGradient(0, 0, c.width, c.height)
    gr.addColorStop(0, 'rgba(255,255,255,.18)')
    gr.addColorStop(0.45, 'rgba(255,255,255,0)')
    gr.addColorStop(1, 'rgba(255,255,255,.05)')
    x.fillStyle = gr
    x.fillRect(0, 0, c.width, c.height)
    x.globalCompositeOperation = 'source-over'
  }
  return c
}

/** Triángulo de la imagen fuente (s) dibujado en el destino (d) con su transformación afín. */
function tri(ctx: CanvasRenderingContext2D, img: CanvasImageSource, s0: Punto, s1: Punto, s2: Punto, d0: Punto, d1: Punto, d2: Punto) {
  // Se agranda un 4 % alrededor del centro para tapar las costuras entre triángulos.
  const cx = (d0[0] + d1[0] + d2[0]) / 3
  const cy = (d0[1] + d1[1] + d2[1]) / 3
  const e = (p: Punto): Punto => [p[0] + (p[0] - cx) * 0.04, p[1] + (p[1] - cy) * 0.04]
  const [D0, D1, D2] = [e(d0), e(d1), e(d2)]
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(D0[0], D0[1])
  ctx.lineTo(D1[0], D1[1])
  ctx.lineTo(D2[0], D2[1])
  ctx.closePath()
  ctx.clip()
  const [x0, y0] = s0
  const [x1, y1] = s1
  const [x2, y2] = s2
  const den = x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1)
  const a = (d0[0] * (y1 - y2) + d1[0] * (y2 - y0) + d2[0] * (y0 - y1)) / den
  const b = (d0[1] * (y1 - y2) + d1[1] * (y2 - y0) + d2[1] * (y0 - y1)) / den
  const c = (d0[0] * (x2 - x1) + d1[0] * (x0 - x2) + d2[0] * (x1 - x0)) / den
  const d = (d0[1] * (x2 - x1) + d1[1] * (x0 - x2) + d2[1] * (x1 - x0)) / den
  const ee = (d0[0] * (x1 * y2 - x2 * y1) + d1[0] * (x2 * y0 - x0 * y2) + d2[0] * (x0 * y1 - x1 * y0)) / den
  const f = (d0[1] * (x1 * y2 - x2 * y1) + d1[1] * (x2 * y0 - x0 * y2) + d2[1] * (x0 * y1 - x1 * y0)) / den
  ctx.setTransform(a, b, c, d, ee, f)
  ctx.drawImage(img, 0, 0)
  ctx.restore()
}

const AJUSTE: Record<Tecnica, (oscura: boolean) => { sombras: number; luces: number; trama: number; alfa: number }> = {
  estampado: (o) => ({ sombras: 1, luces: o ? 0.25 : 0.45, trama: o ? 0.8 : 1, alfa: o ? 0.9 : 0.93 }),
  dtf: () => ({ sombras: 1, luces: 0.65, trama: 0.5, alfa: 1 }),
  bordado: () => ({ sombras: 0.6, luces: 0.2, trama: 0.12, alfa: 1 }),
}

/**
 * Pinta la escena completa (1080 × 1350) en ctx: la foto y, si hay, el diseño ya tratado, deformado sobre el área,
 * con las sombras, luces y trama de la tela, recortado al área. rapida = malla 8 × 8 sin pliegues (mientras se arrastra).
 */
export function dibujar(ctx: CanvasRenderingContext2D, foto: FotoLista, diseno: HTMLCanvasElement | null, lugar: Lugar, tecnica: Tecnica, rapida = false) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  ctx.drawImage(foto.escena, 0, 0)
  if (!diseno) return

  const { region } = foto
  const paH = Math.round(PA / aspectoArea(foto.area))
  const pa = auxiliar('pa', PA, paH)
  const px = pa.getContext('2d')!
  px.clearRect(0, 0, PA, paH)
  const dw = lugar.s * PA
  const dh = dw / (diseno.width / diseno.height)
  px.drawImage(diseno, lugar.cx * PA - dw / 2, lugar.cy * paH - dh / 2, dw, dh)

  const capa = auxiliar('capa', region.w, region.h)
  const cx = capa.getContext('2d')!
  cx.setTransform(1, 0, 0, 1, 0, 0)
  cx.globalCompositeOperation = 'source-over'
  cx.globalAlpha = 1
  cx.clearRect(0, 0, region.w, region.h)
  const malla = rapida ? foto.rapida : foto.malla
  const n = malla.length - 1
  const local = (p: Punto): Punto => [p[0] - region.x, p[1] - region.y]
  const sx = PA / n
  const sy = paH / n
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const s00: Punto = [i * sx, j * sy]
      const s10: Punto = [(i + 1) * sx, j * sy]
      const s01: Punto = [i * sx, (j + 1) * sy]
      const s11: Punto = [(i + 1) * sx, (j + 1) * sy]
      const [d00, d10, d01, d11] = [malla[j][i], malla[j][i + 1], malla[j + 1][i], malla[j + 1][i + 1]].map(local)
      tri(cx, pa, s00, s10, s11, d00, d10, d11)
      tri(cx, pa, s00, s11, s01, d00, d11, d01)
    }

  // La tinta toma la tela: sombras, luces y trama; después queda solo la forma del diseño dentro del área.
  const forma = auxiliar('forma', region.w, region.h)
  const fx = forma.getContext('2d')!
  fx.clearRect(0, 0, region.w, region.h)
  fx.drawImage(capa, 0, 0)
  const aj = AJUSTE[tecnica](foto.oscura)
  cx.globalCompositeOperation = 'multiply'
  cx.globalAlpha = aj.sombras
  cx.drawImage(foto.sombras, 0, 0)
  cx.globalCompositeOperation = 'screen'
  cx.globalAlpha = aj.luces
  cx.drawImage(foto.luces, 0, 0)
  cx.globalCompositeOperation = 'overlay'
  cx.globalAlpha = aj.trama
  cx.drawImage(foto.trama, 0, 0)
  cx.globalAlpha = 1
  cx.globalCompositeOperation = 'destination-in'
  cx.drawImage(forma, 0, 0)
  cx.beginPath()
  foto.quad.map(local).forEach(([x, y], i) => (i ? cx.lineTo(x, y) : cx.moveTo(x, y)))
  cx.closePath()
  cx.fill()
  cx.globalCompositeOperation = 'source-over'

  ctx.save()
  ctx.globalAlpha = aj.alfa
  if (tecnica === 'bordado') {
    // El hilo queda encima de la tela: sombra de contacto bajo las puntadas.
    ctx.shadowColor = 'rgba(0,0,0,.55)'
    ctx.shadowBlur = 3
    ctx.shadowOffsetX = 0.8
    ctx.shadowOffsetY = 1.6
  } else ctx.filter = 'blur(0.45px)'
  ctx.drawImage(capa, region.x, region.y)
  ctx.restore()
}

/** Mockup descargable: la escena completa, sin guías ni manijas, JPG 0,85. */
export function mockup(foto: FotoLista, diseno: HTMLCanvasElement | null, lugar: Lugar, tecnica: Tecnica): Promise<Blob> {
  const c = lienzo(W, H)
  dibujar(c.getContext('2d')!, foto, diseno, lugar, tecnica)
  return new Promise((ok, mal) => c.toBlob((b) => (b ? ok(b) : mal(new Error('sin mockup'))), 'image/jpeg', 0.85))
}

/** Carga una foto de prenda y la prepara. */
export function cargarFoto(src: string, area: Area, curva: number): Promise<FotoLista> {
  return new Promise((ok, mal) => {
    const img = new Image()
    img.onload = () => {
      try {
        ok(prepararFoto(img, area, curva))
      } catch (e) {
        mal(e)
      }
    }
    img.onerror = () => mal(new Error('sin señal'))
    img.src = src
  })
}
