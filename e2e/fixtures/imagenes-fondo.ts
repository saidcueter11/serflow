import sharp from 'sharp'

// PRI-122: imágenes de prueba de quitar el fondo. Salen de archivos reales del repo, sin datos personales ni binarios nuevos:
// el logo de Serflow como llega por WhatsApp y como foto de un papel (la foto es una degradación sintética: viñeta, sombra,
// ruido, desenfoque y JPEG malo).

const LOGO = 'src/assets/LOGO SERFLOW.png'
const ANCHO = 1024
const ALTO = 703
const MARGEN = 80

async function logo() {
  const { data, info } = await sharp(LOGO).resize(ANCHO - MARGEN * 2).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, ancho: info.width, alto: info.height, x: MARGEN, y: (ALTO - info.height) >> 1 }
}

const crudo = (data: Buffer) => sharp(data, { raw: { width: ANCHO, height: ALTO, channels: 3 } })

/** El logo sobre blanco, JPEG q70. */
export async function logoSobreBlanco(): Promise<Buffer> {
  const l = await logo()
  const b = Buffer.alloc(ANCHO * ALTO * 3, 255)
  for (let y = 0; y < l.alto; y++)
    for (let x = 0; x < l.ancho; x++) {
      const j = (y * l.ancho + x) * 4
      const a = l.data[j + 3] / 255
      const o = ((y + l.y) * ANCHO + x + l.x) * 3
      for (let k = 0; k < 3; k++) b[o + k] = 255 * (1 - a) + l.data[j + k] * a
    }
  return crudo(b).jpeg({ quality: 70 }).toBuffer()
}

/** El logo multiplicado sobre papel, con viñeta, sombra abajo, ruido con semilla, desenfoque y JPEG q35. */
export async function logoEnPapel(): Promise<Buffer> {
  const l = await logo()
  const b = Buffer.alloc(ANCHO * ALTO * 3)
  const PAPEL = [238, 232, 218]
  let semilla = 12345
  const azar = () => (semilla = (semilla * 1664525 + 1013904223) >>> 0) / 2 ** 32
  for (let y = 0; y < ALTO; y++)
    for (let x = 0; x < ANCHO; x++) {
      const dx = (x - ANCHO / 2) / (ANCHO / 2)
      const dy = (y - ALTO / 2) / (ALTO / 2)
      const luz = (1 - 0.16 * (dx * dx + dy * dy)) * (1 - 0.14 * Math.max(0, (y / ALTO - 0.72) / 0.28))
      const lx = x - l.x
      const ly = y - l.y
      const dentro = lx >= 0 && ly >= 0 && lx < l.ancho && ly < l.alto
      const j = (ly * l.ancho + lx) * 4
      const a = dentro ? l.data[j + 3] / 255 : 0
      const ruido = (azar() - 0.5) * 10
      for (let k = 0; k < 3; k++) {
        const f = PAPEL[k] * luz
        b[(y * ANCHO + x) * 3 + k] = Math.max(0, Math.min(255, f * (1 - a) + (f * (dentro ? l.data[j + k] : 0) * a) / 255 + ruido))
      }
    }
  return crudo(b).blur(1).jpeg({ quality: 35 }).toBuffer()
}

/** Dónde está el logo de verdad en esas dos imágenes: alfa por píxel, ANCHO × ALTO. */
export async function mascaraDelLogo(): Promise<Uint8Array> {
  const l = await logo()
  const m = new Uint8Array(ANCHO * ALTO)
  for (let y = 0; y < l.alto; y++) for (let x = 0; x < l.ancho; x++) m[(y + l.y) * ANCHO + x + l.x] = l.data[(y * l.ancho + x) * 4 + 3]
  return m
}

/** hat4.jpg como la mandaría un celular malo: 720 px, desenfoque, ruido, tinte cálido y JPEG q40. */
export async function gorraDeCelular(): Promise<Buffer> {
  const { data, info } = await sharp('src/assets/hat4.jpg').rotate().resize(720).blur(1.2).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  let semilla = 4242
  const azar = () => (semilla = (semilla * 1664525 + 1013904223) >>> 0) / 2 ** 32
  for (let i = 0; i < data.length; i += 3) {
    const ruido = (azar() - 0.5) * 14
    data[i] = Math.max(0, Math.min(255, data[i] + ruido + 2))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * 0.97 + ruido))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * 0.9 + ruido))
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } }).jpeg({ quality: 40 }).toBuffer()
}

/** Una C gris gruesa sobre blanco, JPEG q70: el diseño claro que un relleno sin freno se come por la curva. Va de 0 a 1000 × 0 a 620. */
export async function curvaGris(): Promise<Buffer> {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620"><path d="M640 180 A170 170 0 1 0 640 440" fill="none" stroke="#999999" stroke-width="60"/></svg>'
  return sharp(Buffer.from(svg)).flatten({ background: '#ffffff' }).jpeg({ quality: 70 }).toBuffer()
}
