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
/** Para detectar fotos: distancia máxima al fondo estimado en el camino y cuánto se mueve esa estimación por paso. */
const DERIVA = 22
const APRENDE = 0.08
/** Hasta dónde se aleja un píxel del fondo esperado y sigue siendo fondo: lo justo para un fondo limpio, y más con el ruido de una foto. */
const TOLERANCIA_MIN = 6
const TOLERANCIA_MAX = 14
const TOLERANCIA_POR_RUIDO = 1.5
/** Radio del promedio de cada borde, para quitarle el ruido. */
const RADIO_BORDE = 8
/** Distancia máxima de una semilla del borde al color dominante del borde. */
const SEMILLA = 26
/** Hasta cuántos píxeles hacia adentro se limpia el contorno, y a cuántos píxeles se busca el color del diseño. */
const ANILLOS = 3
const VENTANA = 2
/** Fracción mínima del borde que tiene que ser fondo. */
const BORDE_MIN = 0.7
/** La región cubre una parte creíble de la imagen. */
const REGION_MIN = 0.08
const REGION_MAX = 0.985
/** Relieve: cambio por píxel, medido entre puntos a una distancia de RELIEVE_LADO de la imagen, desde el que algo ya no es fondo. El papel con viñeta y sombras queda muy por debajo; la tela de una gorra blanca, por encima. */
const RELIEVE_LADO = 1 / 64
const RELIEVE_PENDIENTE = 0.3
/** Con esta fracción de la región en relieve, o esta proporción contra lo que queda del diseño, el relleno se comió al sujeto. */
const RELIEVE_REGION = 0.018
const RELIEVE_DISENO = 1
/** Un diseño pálido queda casi todo rellenado aquí: la proporción no se mide contra un resto minúsculo. */
const DISENO_MIN = 0.01
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

/** Un lado del borde, sin ruido: donde el diseño toca el borde sigue la última semilla. */
function lado(c: Float32Array, largo: number, indice: (k: number) => number, fondo: Uint8Array, med: number[]): Float32Array {
  const crudo = new Float32Array(largo * 3)
  let k0 = 0
  while (k0 < largo && !fondo[indice(k0)]) k0++
  let ultimo = k0 < largo ? indice(k0) : -1
  for (let k = 0; k < largo; k++) {
    const i = indice(k)
    if (fondo[i]) ultimo = i
    for (let e = 0; e < 3; e++) crudo[k * 3 + e] = ultimo < 0 ? med[e] : c[ultimo * 3 + e]
  }
  const out = new Float32Array(largo * 3)
  for (let k = 0; k < largo; k++) {
    const de = Math.max(0, k - RADIO_BORDE)
    const a = Math.min(largo - 1, k + RADIO_BORDE)
    for (let e = 0; e < 3; e++) {
      let suma = 0
      for (let j = de; j <= a; j++) suma += crudo[j * 3 + e]
      out[k * 3 + e] = suma / (a - de + 1)
    }
  }
  return out
}

/** Qué color tendría el fondo en cada píxel si no hubiera diseño: los 4 lados interpolados hacia adentro (superficie de Coons). Da exacta una viñeta o una sombra de lado a lado. */
function* fondoEsperado(c: Float32Array, w: number, h: number, fondo: Uint8Array, med: number[]): Generator<void, { esperado: Float32Array; tolerancia: number }, void> {
  const arriba = lado(c, w, (x) => x, fondo, med)
  const abajo = lado(c, w, (x) => (h - 1) * w + x, fondo, med)
  const izq = lado(c, h, (y) => y * w, fondo, med)
  const der = lado(c, h, (y) => y * w + w - 1, fondo, med)
  yield
  const esperado = new Float32Array(w * h * 3)
  const ancho = Math.max(1, w - 1)
  const alto = Math.max(1, h - 1)
  for (let y = 0; y < h; y++) {
    const fv = y / alto
    for (let x = 0; x < w; x++) {
      const fu = x / ancho
      const o = (y * w + x) * 3
      for (let e = 0; e < 3; e++) {
        const horizontal = (1 - fu) * izq[y * 3 + e] + fu * der[y * 3 + e]
        const vertical = (1 - fv) * arriba[x * 3 + e] + fv * abajo[x * 3 + e]
        const esquinas = (1 - fv) * ((1 - fu) * arriba[e] + fu * arriba[(w - 1) * 3 + e]) + fv * ((1 - fu) * abajo[e] + fu * abajo[(w - 1) * 3 + e])
        esperado[o + e] = horizontal + vertical - esquinas
      }
    }
    if (y % 64 === 0) yield
  }
  // Ruido del fondo: cuánto se aleja el borde de su propio promedio.
  const lejos: number[] = []
  for (let x = 0; x < w; x++) {
    if (fondo[x]) lejos.push(distancia(c, x, arriba[x * 3], arriba[x * 3 + 1], arriba[x * 3 + 2]))
    const i = (h - 1) * w + x
    if (fondo[i]) lejos.push(distancia(c, i, abajo[x * 3], abajo[x * 3 + 1], abajo[x * 3 + 2]))
  }
  for (let y = 1; y < h - 1; y++) {
    if (fondo[y * w]) lejos.push(distancia(c, y * w, izq[y * 3], izq[y * 3 + 1], izq[y * 3 + 2]))
    const i = y * w + w - 1
    if (fondo[i]) lejos.push(distancia(c, i, der[y * 3], der[y * 3 + 1], der[y * 3 + 2]))
  }
  lejos.sort((a, b) => a - b)
  const ruido = lejos.length ? lejos[Math.floor(lejos.length * 0.9)] : 0
  return { esperado, tolerancia: Math.min(TOLERANCIA_MAX, TOLERANCIA_MIN + TOLERANCIA_POR_RUIDO * ruido) }
}

/** ¿Cambia de a poco a lado y lado de i (paso d)? Un escalón, como el borde limpio de un diseño, cambia solo a un lado; una línea delgada va y vuelve. */
function pendiente(c: Float32Array, fondo: Uint8Array, i: number, S: number, M: number, d: number): boolean {
  const a = i - S * d
  const b = i + S * d
  if (!fondo[a] || !fondo[b] || !fondo[i - M * d] || !fondo[i + M * d]) return false
  const mitad = RELIEVE_PENDIENTE * S * 0.5
  return (
    distancia(c, b, c[a * 3], c[a * 3 + 1], c[a * 3 + 2]) > RELIEVE_PENDIENTE * 2 * S &&
    distancia(c, i, c[a * 3], c[a * 3 + 1], c[a * 3 + 2]) > mitad &&
    distancia(c, i, c[b * 3], c[b * 3 + 1], c[b * 3 + 2]) > mitad &&
    distancia(c, i - M * d, c[a * 3], c[a * 3 + 1], c[a * 3 + 2]) > mitad * 0.5 &&
    distancia(c, i + M * d, c[b * 3], c[b * 3 + 1], c[b * 3 + 2]) > mitad * 0.5
  )
}

/**
 * Relleno desde las semillas: pasa al vecino si no da un salto y si no se aleja de `esperado`. Con `aprende`, `esperado` no es un
 * dato: se va estimando en el camino, así que sigue un cambio lento hasta donde sea.
 */
function* crecer(c: Float32Array, w: number, h: number, semillas: number[], esperado: Float32Array, tolerancia: number, aprende: boolean): Generator<void, { fondo: Uint8Array; cola: Int32Array; fin: number }, void> {
  const n = w * h
  const fondo = new Uint8Array(n)
  const cola = new Int32Array(n)
  const v = new Int32Array(4)
  let fin = 0
  for (const i of semillas) {
    if (fondo[i]) continue
    if (aprende) for (let e = 0; e < 3; e++) esperado[i * 3 + e] = c[i * 3 + e]
    else if (distancia(c, i, esperado[i * 3], esperado[i * 3 + 1], esperado[i * 3 + 2]) > tolerancia) continue
    fondo[i] = 1
    cola[fin++] = i
  }
  for (let ini = 0; ini < fin; ) {
    const i = cola[ini++]
    vecinos(i, w, n, v)
    for (let k = 0; k < 4; k++) {
      const q = v[k]
      if (q < 0 || fondo[q] || distancia(c, q, c[i * 3], c[i * 3 + 1], c[i * 3 + 2]) > SALTO) continue
      const r = (aprende ? i : q) * 3
      if (distancia(c, q, esperado[r], esperado[r + 1], esperado[r + 2]) > tolerancia) continue
      fondo[q] = 1
      cola[fin++] = q
      if (aprende) for (let e = 0; e < 3; e++) esperado[q * 3 + e] = esperado[r + e] * (1 - APRENDE) + c[q * 3 + e] * APRENDE
    }
    if (ini % 32768 === 0) yield
  }
  return { fondo, cola, fin }
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

  const semillas = bordes.filter((i) => distancia(c, i, med[0], med[1], med[2]) <= SEMILLA)
  if (semillas.length < bordes.length * BORDE_MIN) return null
  const v = new Int32Array(4)

  // Primero, ¿es una foto? Sin comparar con el fondo esperado, el relleno se mete por la tela de una gorra clara (hat4.jpg). Un
  // fondo de verdad cambia lento; si lo rellenado tiene relieve, la imagen conserva el suyo.
  const suelto = yield* crecer(c, w, h, semillas, new Float32Array(n * 3), DERIVA, true)
  let muestras = 0
  let relieve = 0
  const S = Math.max(2, Math.round(Math.max(w, h) * RELIEVE_LADO))
  const M = S >> 1
  const salto = Math.max(1, S >> 2)
  for (let y = S; y < h - S; y += salto) {
    for (let x = S; x < w - S; x += salto) {
      const i = y * w + x
      if (!suelto.fondo[i]) continue
      muestras++
      if (pendiente(c, suelto.fondo, i, S, M, 1) || pendiente(c, suelto.fondo, i, S, M, w)) relieve++
    }
    yield
  }
  if (relieve > muestras * RELIEVE_REGION || relieve * salto * salto > Math.max(n - suelto.fin, n * DISENO_MIN) * RELIEVE_DISENO) return null

  // Es un diseño: se recorta comparando con el fondo esperado, no con el vecino, que siguiendo una curva suave deja entrar a un diseño pálido.
  const marcas = new Uint8Array(n)
  for (const i of semillas) marcas[i] = 1
  const { esperado, tolerancia } = yield* fondoEsperado(c, w, h, marcas, med)
  const { fondo, cola, fin } = yield* crecer(c, w, h, semillas, esperado, tolerancia, false)
  if (fin < n * REGION_MIN || fin > n * REGION_MAX) return null

  const out = new Uint8ClampedArray(img.data)
  for (let j = 0; j < fin; j++) out[cola[j] * 4 + 3] = 0
  yield
  // Contorno: el suavizado frena el relleno antes del borde, así que aquí manda el color sin suavizar. Cada píxel mezcla el fondo con
  // el color del diseño que tiene al lado: esa mezcla es su alfa, y un diseño pálido no se vuelve transparente por ser pálido.
  const crudo = (i: number, y: number, cb: number, cr: number) => {
    const o = i * 4
    const r = img.data[o]
    const g = img.data[o + 1]
    const b = img.data[o + 2]
    const d0 = (0.299 * r + 0.587 * g + 0.114 * b - y) * PESO_LUZ
    const d1 = -0.169 * r - 0.331 * g + 0.5 * b - cb
    const d2 = 0.5 * r - 0.419 * g - 0.081 * b - cr
    return Math.sqrt(d0 * d0 + d1 * d1 + d2 * d2)
  }
  let anillo: number[] = []
  for (let j = 0; j < fin; j++) {
    vecinos(cola[j], w, n, v)
    for (let k = 0; k < 4; k++) {
      const q = v[k]
      if (q < 0 || fondo[q]) continue
      fondo[q] = 1
      anillo.push(q)
    }
    if (j % 65536 === 0) yield
  }
  for (let paso = 0; paso < ANILLOS; paso++) {
    const siguiente: number[] = []
    for (const q of anillo) {
      const y = esperado[q * 3] / PESO_LUZ
      const cb = esperado[q * 3 + 1]
      const cr = esperado[q * 3 + 2]
      const d = crudo(q, y, cb, cr)
      const qx = q % w
      const qy = (q - qx) / w
      let diseno = d
      for (let ny = Math.max(0, qy - VENTANA); ny <= Math.min(h - 1, qy + VENTANA); ny++)
        for (let nx = Math.max(0, qx - VENTANA); nx <= Math.min(w - 1, qx + VENTANA); nx++) diseno = Math.max(diseno, crudo(ny * w + nx, y, cb, cr))
      const a = diseno > tolerancia ? d / diseno : 0
      if (a === 1) continue
      const o = q * 4
      out[o + 3] = Math.round(255 * a)
      if (a > 0) {
        out[o] = (img.data[o] - (1 - a) * (y + 1.402 * cr)) / a
        out[o + 1] = (img.data[o + 1] - (1 - a) * (y - 0.344 * cb - 0.714 * cr)) / a
        out[o + 2] = (img.data[o + 2] - (1 - a) * (y + 1.772 * cb)) / a
      }
      if (a > 0.5) continue
      vecinos(q, w, n, v)
      for (let k = 0; k < 4; k++) {
        const u = v[k]
        if (u < 0 || fondo[u]) continue
        fondo[u] = 1
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
