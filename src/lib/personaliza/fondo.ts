// Quitar el fondo en el teléfono (PRI-122, opción D): crece una región desde los bordes y va estimando el fondo sobre la
// marcha, así tolera la viñeta y las sombras de un logo fotografiado en papel. Sin librerías ni red. Si no encuentra un
// fondo claro no adivina: la imagen conserva el suyo. Solo alimenta la vista previa y el mockup; al taller siempre le
// llega el archivo original.

/** Lo mismo que ImageData, sin depender del DOM (así se prueba en Node). */
export interface Pixeles {
  data: Uint8ClampedArray<ArrayBuffer>
  width: number
  height: number
}

/** La luz pesa menos que el color: tolera sombras y luz dispareja. */
const PESO_LUZ = 0.45
/** Salto máximo entre vecinos (imagen suavizada) para seguir creciendo. */
const SALTO = 7
/** Distancia máxima al fondo estimado en el camino. */
const DERIVA = 22
/** Distancia máxima de una semilla del borde al color dominante del borde. */
const SEMILLA = 26
/** Cuánto se mueve la estimación del fondo por paso. */
const APRENDE = 0.08
/** Distancia al fondo a partir de la cual el contorno del diseño ya es opaco. */
const SUAVE = 26
/** Hasta cuántos píxeles hacia adentro se limpia el contorno. */
const ANILLOS = 3
/** Fracción mínima del borde que tiene que ser fondo. */
const BORDE_MIN = 0.7
/** La región cubre una parte creíble de la imagen. */
const REGION_MIN = 0.08
const REGION_MAX = 0.985
/** Salto de color mínimo en el contorno encontrado (percentil 75); debajo, el relleno se fugó por dentro del sujeto. */
const CONTRASTE = 27
/** Relieve: cambio por píxel, medido entre puntos a RELIEVE_PX a cada lado, desde el que algo ya no es fondo. El papel con viñeta y sombras queda muy por debajo; la tela de una gorra blanca, por encima. */
const RELIEVE_PX = 16
const RELIEVE_PENDIENTE = 0.3
/** Con esta fracción de la región en relieve, o esta proporción contra lo que queda del diseño, el relleno se comió al sujeto. */
const RELIEVE_REGION = 0.04
const RELIEVE_DISENO = 1.2
/** Tiempo máximo seguido en el hilo principal antes de cederle el turno a la página. */
const TAJADA_MS = 8

function borde(w: number, h: number): number[] {
  const out: number[] = []
  for (let x = 0; x < w; x++) out.push(x, (h - 1) * w + x)
  for (let y = 1; y < h - 1; y++) out.push(y * w, y * w + w - 1)
  return out
}

/** El PNG ya trae transparencia en el borde: no se toca. */
export function bordeTransparente(img: Pixeles): boolean {
  return borde(img.width, img.height).some((i) => img.data[i * 4 + 3] < 250)
}

/** Índices de los 4 vecinos de i en v; -1 si se sale de la imagen. */
function vecinos(i: number, w: number, n: number, v: Int32Array) {
  const x = i % w
  v[0] = x > 0 ? i - 1 : -1
  v[1] = x < w - 1 ? i + 1 : -1
  v[2] = i >= w ? i - w : -1
  v[3] = i < n - w ? i + w : -1
}

const distancia = (c: Float32Array, i: number, a: number, b: number, e: number) => {
  const d0 = c[i * 3] - a
  const d1 = c[i * 3 + 1] - b
  const d2 = c[i * 3 + 2] - e
  return Math.sqrt(d0 * d0 + d1 * d1 + d2 * d2)
}

/** Caja 3 × 3 en YCbCr, para no seguir ruido ni artefactos de JPEG. Cede cada tantas filas. */
function* suavizar({ data: d, width: w, height: h }: Pixeles): Generator<void, Float32Array, void> {
  const n = w * h
  const c = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const r = d[i * 4]
    const g = d[i * 4 + 1]
    const b = d[i * 4 + 2]
    c[i * 3] = (0.299 * r + 0.587 * g + 0.114 * b) * PESO_LUZ
    c[i * 3 + 1] = -0.169 * r - 0.331 * g + 0.5 * b
    c[i * 3 + 2] = 0.5 * r - 0.419 * g - 0.081 * b
    if (i % 65536 === 0) yield
  }
  // Dos pasadas (horizontal y vertical) cuestan lo mismo que una caja de 3 px, no de 9.
  const o = new Float32Array(n * 3)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3
      const izq = x > 0 ? i - 3 : i
      const der = x < w - 1 ? i + 3 : i
      for (let k = 0; k < 3; k++) o[i + k] = (c[izq + k] + c[i + k] + c[der + k]) / 3
    }
    if (y % 64 === 0) yield
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3
      const arr = y > 0 ? i - w * 3 : i
      const aba = y < h - 1 ? i + w * 3 : i
      for (let k = 0; k < 3; k++) c[i + k] = (o[arr + k] + o[i + k] + o[aba + k]) / 3
    }
    if (y % 64 === 0) yield
  }
  return c
}

function* recorte(img: Pixeles): Generator<void, Pixeles | null, void> {
  const { width: w, height: h } = img
  const n = w * h
  const c = yield* suavizar(img)
  const bordes = borde(w, h)
  const med = [0, 1, 2].map((k) => {
    const v = Float32Array.from(bordes, (i) => c[i * 3 + k]).sort()
    return v[v.length >> 1]
  })

  const fondo = new Uint8Array(n)
  const est = new Float32Array(n * 3)
  const cola = new Int32Array(n)
  const v = new Int32Array(4)
  let ini = 0
  let fin = 0
  for (const i of bordes) {
    if (fondo[i] || distancia(c, i, med[0], med[1], med[2]) > SEMILLA) continue
    fondo[i] = 1
    est[i * 3] = c[i * 3]
    est[i * 3 + 1] = c[i * 3 + 1]
    est[i * 3 + 2] = c[i * 3 + 2]
    cola[fin++] = i
  }
  if (fin < bordes.length * BORDE_MIN) return null

  while (ini < fin) {
    const i = cola[ini++]
    const e0 = est[i * 3]
    const e1 = est[i * 3 + 1]
    const e2 = est[i * 3 + 2]
    vecinos(i, w, n, v)
    for (let k = 0; k < 4; k++) {
      const q = v[k]
      if (q < 0 || fondo[q]) continue
      if (distancia(c, q, c[i * 3], c[i * 3 + 1], c[i * 3 + 2]) > SALTO || distancia(c, q, e0, e1, e2) > DERIVA) continue
      fondo[q] = 1
      cola[fin++] = q
      est[q * 3] = e0 * (1 - APRENDE) + c[q * 3] * APRENDE
      est[q * 3 + 1] = e1 * (1 - APRENDE) + c[q * 3 + 1] * APRENDE
      est[q * 3 + 2] = e2 * (1 - APRENDE) + c[q * 3 + 2] * APRENDE
    }
    if (ini % 32768 === 0) yield
  }
  if (fin < n * REGION_MIN || fin > n * REGION_MAX) return null

  // Un fondo cambia lento. Con relieve, el relleno se metió por una prenda clara y solo dejó sus bordados (hat4.jpg).
  let muestras = 0
  let relieve = 0
  const S = RELIEVE_PX
  const M = S >> 1
  for (let y = S; y < h - S; y += 4) {
    for (let x = S; x < w - S; x += 4) {
      const i = y * w + x
      if (!fondo[i]) continue
      muestras++
      const a = i - S
      const e = i - S * w
      if (
        (fondo[a] && fondo[i + S] && fondo[i - M] && fondo[i + M] && distancia(c, i + S, c[a * 3], c[a * 3 + 1], c[a * 3 + 2]) > RELIEVE_PENDIENTE * 2 * S) ||
        (fondo[e] && fondo[i + S * w] && fondo[i - M * w] && fondo[i + M * w] && distancia(c, i + S * w, c[e * 3], c[e * 3 + 1], c[e * 3 + 2]) > RELIEVE_PENDIENTE * 2 * S)
      )
        relieve++
    }
    yield
  }
  // Una muestra de cada 16 píxeles.
  if (relieve > muestras * RELIEVE_REGION || relieve * 16 > (n - fin) * RELIEVE_DISENO) return null

  // Contorno: cada píxel del diseño pegado al fondo, con la distancia a ese fondo.
  const saltos = new Float32Array((n - fin) * 4)
  let m = 0
  for (let j = 0; j < fin; j++) {
    const i = cola[j]
    vecinos(i, w, n, v)
    for (let k = 0; k < 4; k++) {
      const q = v[k]
      if (q >= 0 && !fondo[q]) saltos[m++] = distancia(c, q, est[i * 3], est[i * 3 + 1], est[i * 3 + 2])
    }
    if (j % 65536 === 0) yield
  }
  yield
  const contraste = m ? saltos.subarray(0, m).sort()[Math.floor(m * 0.75)] : 0
  if (contraste < CONTRASTE) return null

  const out = new Uint8ClampedArray(img.data)
  for (let j = 0; j < fin; j++) out[cola[j] * 4 + 3] = 0
  yield
  // Contorno: el suavizado frena el relleno antes del borde, así que aquí manda el color sin suavizar. Lo que todavía es casi
  // fondo se sigue limpiando unos píxeles hacia adentro; con alfa parcial y sin el color del fondo, para que no quede halo.
  let anillo: number[] = []
  for (let j = 0; j < fin; j++) {
    const i = cola[j]
    vecinos(i, w, n, v)
    for (let k = 0; k < 4; k++) {
      const q = v[k]
      if (q < 0 || fondo[q]) continue
      fondo[q] = 1
      est[q * 3] = est[i * 3]
      est[q * 3 + 1] = est[i * 3 + 1]
      est[q * 3 + 2] = est[i * 3 + 2]
      anillo.push(q)
    }
    if (j % 65536 === 0) yield
  }
  for (let paso = 0; paso < ANILLOS; paso++) {
    const siguiente: number[] = []
    for (const q of anillo) {
      const o = q * 4
      const r = img.data[o]
      const g = img.data[o + 1]
      const b = img.data[o + 2]
      const y = est[q * 3] / PESO_LUZ
      const cb = est[q * 3 + 1]
      const cr = est[q * 3 + 2]
      const d0 = (0.299 * r + 0.587 * g + 0.114 * b - y) * PESO_LUZ
      const d1 = -0.169 * r - 0.331 * g + 0.5 * b - cb
      const d2 = 0.5 * r - 0.419 * g - 0.081 * b - cr
      const a = Math.min(1, Math.sqrt(d0 * d0 + d1 * d1 + d2 * d2) / SUAVE)
      if (a === 1) continue
      out[o + 3] = Math.round(255 * a)
      if (a > 0) {
        out[o] = (r - (1 - a) * (y + 1.402 * cr)) / a
        out[o + 1] = (g - (1 - a) * (y - 0.344 * cb - 0.714 * cr)) / a
        out[o + 2] = (b - (1 - a) * (y + 1.772 * cb)) / a
      }
      if (a > 0.5) continue
      vecinos(q, w, n, v)
      for (let k = 0; k < 4; k++) {
        const u = v[k]
        if (u < 0 || fondo[u]) continue
        fondo[u] = 1
        est[u * 3] = est[q * 3]
        est[u * 3 + 1] = est[q * 3 + 1]
        est[u * 3 + 2] = est[q * 3 + 2]
        siguiente.push(u)
      }
    }
    anillo = siguiente
    yield
  }
  return { data: out, width: w, height: h }
}

/**
 * La imagen sin fondo, o null si no hay un fondo claro y se queda como está. Los huecos encerrados (el centro de una
 * "O") no se tocan: desde aquí no se distinguen de una parte blanca del diseño, y comerse el diseño es peor.
 * Trabaja a tajadas para no congelar la página mientras tanto.
 */
export async function quitarFondo(img: Pixeles): Promise<Pixeles | null> {
  const g = recorte(img)
  let t = performance.now()
  for (let r = g.next(); ; r = g.next()) {
    if (r.done) return r.value
    if (performance.now() - t > TAJADA_MS) {
      await new Promise((ok) => setTimeout(ok))
      t = performance.now()
    }
  }
}
