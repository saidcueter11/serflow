// Motor de la vista realista (spec 6.2), portado del prototipo v4. Canvas 2D sin librerías ni WebGL: lo que se ve en
// la vista previa es exactamente lo que se descarga como mockup. El diseño se pinta donde el cliente lo deje, sin máscara
// de la prenda: el área de impresión solo da la escala y la curva. Luminancia, desenfoque y filtros de técnica se hacen
// sobre los píxeles (ctx.filter no existe en Safari viejo).
import { ESCENA, type Area, type Punto, type Tecnica } from './datos'
import { aspectoArea, enArea, unidadesFoto, type Lugar } from './lugar'

const { ancho: W, alto: H } = ESCENA
/** Celdas por ancho de área de la malla completa y de la rápida que se usa mientras se arrastra (sin pliegues). */
const N = 16
const N_RAPIDA = 8
/** Px del diseño por ancho de área antes de deformarlo. */
const PA = 600
/** Los mapas de la tela van a la mitad de la escena: 4 veces menos memoria y cálculo, y son de baja frecuencia. */
const MAPA_W = W / 2
const MAPA_H = H / 2
/** Lado largo del diseño ya tratado (bordado en 512 × 512 como mucho). */
const LADO_DISENO = 512
/** Px alrededor del diseño para la sombra del bordado y el desenfoque. */
const MARGEN = 8

/** Malla de toda la foto: el punto (i, j) corresponde a u = (i0 + i) / n, v = (j0 + j) / n del área. */
export interface Malla {
  n: number
  i0: number
  j0: number
  puntos: Punto[][]
}

export interface FotoLista {
  escena: HTMLCanvasElement
  area: Area
  sombras: HTMLCanvasElement
  luces: HTMLCanvasElement
  trama: HTMLCanvasElement
  oscura: boolean
  malla: Malla
  rapida: Malla
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

/** Un diseño plano sobre un cilindro visto de frente: se comprime hacia los lados. Fuera del área sigue en línea recta. */
export function envolver(u: number, curva: number): number {
  if (!curva) return u
  const th = curva * 1.4
  const pendiente = th / 2 / Math.tan(th / 2)
  if (u < 0) return u * pendiente
  if (u > 1) return 1 + (u - 1) * pendiente
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

  // Luminancia de la tela a tres escalas: pliegues (desplazar), sombras y trama.
  const chica = lienzo(MAPA_W, MAPA_H)
  const cc = chica.getContext('2d', { willReadFrequently: true })!
  cc.drawImage(escena, 0, 0, MAPA_W, MAPA_H)
  const L = luminancia(cc.getImageData(0, 0, MAPA_W, MAPA_H).data)
  const pliegues = desenfocar(L, MAPA_W, MAPA_H, 3, 3)
  const L1 = desenfocar(L, MAPA_W, MAPA_H, 1, 1)
  const L4 = desenfocar(L, MAPA_W, MAPA_H, 2, 2)
  // Luz media solo con los píxeles dentro del área, que está sobre la tela (el admin no la configura).
  const quad: Punto[] = [area.tl, area.tr, area.br, area.bl].map(([x, y]) => [x * MAPA_W, y * MAPA_H])
  let suma = 0
  let n = 0
  for (let y = 0; y < MAPA_H; y++)
    for (let x = 0; x < MAPA_W; x++)
      if (dentroDe(quad, x, y)) {
        suma += L1[y * MAPA_W + x]
        n++
      }
  const ref = Math.max(8, suma / Math.max(1, n)) * 1.05
  const wk = ref < 60 ? 9 : ref < 140 ? 6 : 4.5
  const sombras = gris(MAPA_W, MAPA_H, (i) => Math.min(255, (255 * L1[i]) / ref))
  const luces = gris(MAPA_W, MAPA_H, (i) => Math.max(0, Math.min(255, (L1[i] - ref) * 3.2)))
  const trama = gris(MAPA_W, MAPA_H, (i) => 128 + Math.max(-127, Math.min(127, (L1[i] - L4[i]) * wk)))

  const desplazar = ([px, py]: Punto): Punto => {
    const x = Math.round((px / W) * MAPA_W)
    const y = Math.round((py / H) * MAPA_H)
    if (x < 3 || y < 3 || x >= MAPA_W - 3 || y >= MAPA_H - 3) return [px, py]
    const gx = pliegues[y * MAPA_W + x + 3] - pliegues[y * MAPA_W + x - 3]
    const gy = pliegues[(y + 3) * MAPA_W + x] - pliegues[(y - 3) * MAPA_W + x]
    return [px + gx * 0.2, py + gy * 0.2]
  }
  // La malla cubre toda la foto, con la densidad de siempre sobre el área.
  const foto = unidadesFoto(area)
  const malla = (n: number, conPliegues: boolean): Malla => {
    const i0 = Math.floor(foto.left * n)
    const j0 = Math.floor(foto.top * n)
    const puntos = Array.from({ length: Math.ceil(foto.bottom * n) - j0 + 1 }, (_, j) =>
      Array.from({ length: Math.ceil(foto.right * n) - i0 + 1 }, (_, i) => {
        const u = (i0 + i) / n
        const v = (j0 + j) / n
        // Sobre una superficie redonda el centro baja un poco.
        const bulto = curva * 0.035 * Math.sin(Math.min(1, Math.max(0, u)) * Math.PI)
        const [fx, fy] = enArea(area, envolver(u, curva), v + bulto * Math.max(0, 1 - v))
        const p: Punto = [fx * W, fy * H]
        return conPliegues ? desplazar(p) : p
      }),
    )
    return { n, i0, j0, puntos }
  }

  return { escena, area, sombras, luces, trama, oscura: ref < 70, malla: malla(N, true), rapida: malla(N_RAPIDA, false) }
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
  if (tecnica === 'bordado') bordar(c)
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

// Sobre tela oscura el estampado lleva base blanca: la tinta tapa la tela. El mapa de sombras es la luz relativa a la
// media, y en una tela negra esa media es tan baja que cualquier pliegue oscurece el diseño a la mitad: las partes
// oscuras del diseño (unos jeans, unos zapatos) se volvían tela. Ahí la tela solo marca pliegues y trama, suave.
const AJUSTE: Record<Tecnica, (oscura: boolean) => { sombras: number; luces: number; trama: number; alfa: number }> = {
  estampado: (o) => (o ? { sombras: 0.35, luces: 0.12, trama: 0.5, alfa: 1 } : { sombras: 1, luces: 0.45, trama: 1, alfa: 0.93 }),
  bordado: () => ({ sombras: 0.6, luces: 0.2, trama: 0.12, alfa: 1 }),
}

/**
 * Pinta la escena completa (1080 × 1350) en ctx: la foto y, si hay, el diseño ya tratado, deformado sobre la malla, con
 * las sombras, luces y trama de la tela. rapida = malla 8 × 8 sin pliegues (mientras se arrastra). La capa ocupa toda la
 * escena, pero solo se dibuja y se compone la caja del diseño: el costo depende del diseño, no de la foto.
 */
export function dibujar(ctx: CanvasRenderingContext2D, foto: FotoLista, diseno: HTMLCanvasElement | null, lugar: Lugar, tecnica: Tecnica, rapida = false) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1
  ctx.drawImage(foto.escena, 0, 0)
  if (!diseno) return

  const paH = PA / aspectoArea(foto.area)
  const w = Math.max(1, lugar.s * PA)
  const h = Math.max(1, w / (diseno.width / diseno.height))
  // Girado antes de la malla: pa es la caja del diseño girado y la curva lo dobla igual que a uno recto.
  const g = ((lugar.r ?? 0) * Math.PI) / 180
  const dw = Math.max(1, Math.round(w * Math.abs(Math.cos(g)) + h * Math.abs(Math.sin(g))))
  const dh = Math.max(1, Math.round(w * Math.abs(Math.sin(g)) + h * Math.abs(Math.cos(g))))
  const pa = auxiliar('pa', dw, dh)
  const px = pa.getContext('2d')!
  px.setTransform(1, 0, 0, 1, 0, 0)
  px.clearRect(0, 0, dw, dh)
  px.translate(dw / 2, dh / 2)
  px.rotate(g)
  px.drawImage(diseno, -w / 2, -h / 2, w, h)

  const capa = auxiliar('capa', W, H)
  const cx = capa.getContext('2d')!
  cx.setTransform(1, 0, 0, 1, 0, 0)
  cx.globalCompositeOperation = 'source-over'
  cx.globalAlpha = 1
  cx.clearRect(0, 0, W, H)

  // Solo las celdas de la malla que toca el diseño. s = coordenadas en pa, d = en la escena.
  const { n, i0, j0, puntos } = rapida ? foto.rapida : foto.malla
  const izq = lugar.cx - dw / PA / 2
  const arriba = lugar.cy - dh / paH / 2
  const s = (i: number, j: number): Punto => [((i0 + i) / n - izq) * PA, ((j0 + j) / n - arriba) * paH]
  const iA = Math.max(0, Math.floor(izq * n) - i0)
  const iB = Math.min(puntos[0].length - 1, Math.ceil((izq + dw / PA) * n) - i0)
  const jA = Math.max(0, Math.floor(arriba * n) - j0)
  const jB = Math.min(puntos.length - 1, Math.ceil((arriba + dh / paH) * n) - j0)
  let x0: number = W
  let y0: number = H
  let x1 = 0
  let y1 = 0
  for (let j = jA; j < jB; j++)
    for (let i = iA; i < iB; i++) {
      const [d00, d10, d01, d11] = [puntos[j][i], puntos[j][i + 1], puntos[j + 1][i], puntos[j + 1][i + 1]]
      tri(cx, pa, s(i, j), s(i + 1, j), s(i + 1, j + 1), d00, d10, d11)
      tri(cx, pa, s(i, j), s(i + 1, j + 1), s(i, j + 1), d00, d11, d01)
      for (const [x, y] of [d00, d10, d01, d11]) {
        x0 = Math.min(x0, x)
        y0 = Math.min(y0, y)
        x1 = Math.max(x1, x)
        y1 = Math.max(y1, y)
      }
    }
  const bx = Math.max(0, Math.floor(x0) - MARGEN)
  const by = Math.max(0, Math.floor(y0) - MARGEN)
  const bw = Math.min(W, Math.ceil(x1) + MARGEN) - bx
  const bh = Math.min(H, Math.ceil(y1) + MARGEN) - by
  if (bw <= 0 || bh <= 0) return

  // La tinta toma la tela: sombras, luces y trama; después queda solo la forma del diseño.
  const forma = auxiliar('forma', W, H)
  const fx = forma.getContext('2d')!
  fx.clearRect(0, 0, W, H)
  fx.drawImage(capa, bx, by, bw, bh, bx, by, bw, bh)
  const aj = AJUSTE[tecnica](foto.oscura)
  cx.save()
  cx.beginPath()
  cx.rect(bx, by, bw, bh)
  cx.clip()
  cx.globalCompositeOperation = 'multiply'
  cx.globalAlpha = aj.sombras
  cx.drawImage(foto.sombras, 0, 0, W, H)
  cx.globalCompositeOperation = 'screen'
  cx.globalAlpha = aj.luces
  cx.drawImage(foto.luces, 0, 0, W, H)
  cx.globalCompositeOperation = 'overlay'
  cx.globalAlpha = aj.trama
  cx.drawImage(foto.trama, 0, 0, W, H)
  cx.globalAlpha = 1
  cx.globalCompositeOperation = 'destination-in'
  cx.drawImage(forma, 0, 0)
  cx.restore()
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
  ctx.drawImage(capa, bx, by, bw, bh, bx, by, bw, bh)
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
