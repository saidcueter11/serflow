import { deflateSync } from 'node:zlib'
import { readFileSync } from 'node:fs'
import { devices, expect, test, type Locator, type Page } from '@playwright/test'
import { curvaGris, gorraDeCelular, logoEnPapel, logoSobreBlanco as logoReal } from './fixtures/imagenes-fondo'

// PRI-122: /personaliza encendida con fotos de muestra (las oficiales llegan con PRI-125). Los archivos de prueba se arman
// aquí o salen de imágenes que ya están en el repo (sin datos personales ni binarios nuevos).
// PRI-150: contra el build con tablas vacías, para que una publicación del cliente no ponga esto rojo.
test.use({ baseURL: 'http://localhost:4232' })

const crcTabla = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (b: Buffer) => {
  let c = 0xffffffff
  for (const x of b) c = crcTabla[(c ^ x) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function bloque(tipo: string, datos: Buffer) {
  const t = Buffer.from(tipo)
  const largo = Buffer.alloc(4)
  largo.writeUInt32BE(datos.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, datos])))
  return Buffer.concat([largo, t, datos, crc])
}
/** PNG RGBA de n × alto, píxel por píxel. */
function png(n: number, pixel: (x: number, y: number) => number[], alto = n): Buffer {
  const filas = Buffer.alloc(alto * (n * 4 + 1))
  for (let y = 0; y < alto; y++) for (let x = 0; x < n; x++) filas.set(pixel(x, y), y * (n * 4 + 1) + 1 + x * 4)
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(n, 0)
  ihdr.writeUInt32BE(alto, 4)
  ihdr.set([8, 6, 0, 0, 0], 8)
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), bloque('IHDR', ihdr), bloque('IDAT', deflateSync(filas)), bloque('IEND', Buffer.alloc(0))])
}
/** Un logo (aro rojo y cuadro azul) sobre fondo blanco plano. */
const logoSobreBlanco = (n: number) =>
  png(n, (x, y) => {
    const r = Math.hypot(x - n / 2, y - n / 2) / n
    if (Math.abs(x - n / 2) < n * 0.08 && Math.abs(y - n / 2) < n * 0.08) return [30, 60, 180, 255]
    return r > 0.2 && r < 0.35 ? [210, 30, 40, 255] : [255, 255, 255, 255]
  })
/** Como una foto: el borde cambia de color todo el tiempo, no hay fondo plano. */
const fotoSinFondoPlano = (n: number) => png(n, (x, y) => [(x * 255) / n, (y * 255) / n, ((x + y) * 127) / n, 255])
/** Un cuadro azul sobre transparente: ya viene sin fondo. */
const logoTransparente = (n: number) => png(n, (x, y) => (Math.hypot(x - n / 2, y - n / 2) < n / 4 ? [30, 60, 180, 255] : [0, 0, 0, 0]))
/** Un bloque azul de jean oscuro, opaco, sobre transparente: la parte oscura de un diseño (PRI-122, la pierna que se perdía). */
const JEAN = [38, 52, 96]
const bloqueJean = (n: number) => png(n, (x, y) => (x > n / 5 && x < (4 * n) / 5 && y > n / 5 && y < (4 * n) / 5 ? [...JEAN, 255] : [0, 0, 0, 0]))
/** Un bloque de color casi hasta el borde: pinta toda la caja del diseño. */
/** Un bloque blanco opaco sobre transparente: muestra solo la luz y los pliegues que toma la tinta. */
const bloqueBlanco = (n: number) => png(n, (x, y) => (x > n / 8 && x < (7 * n) / 8 && y > n / 8 && y < (7 * n) / 8 ? [255, 255, 255, 255] : [0, 0, 0, 0]))
const bloqueLleno = (n: number) => png(n, (x, y) => (x > 6 && x < n - 6 && y > 6 && y < n - 6 ? [210, 30, 40, 255] : [0, 0, 0, 0]))
/** Una tira azul 1:5 sobre transparente, más alta que el recorte del celular. */
const tiraAlta = () => png(120, (x, y) => (x > 10 && x < 110 && y > 10 && y < 590 ? [30, 60, 180, 255] : [0, 0, 0, 0]), 600)

/** Los 21 colores del taller (src/lib/personaliza/muestra.ts), en el orden del selector: teñidos de la foto blanca. */
const COLORES = ['negra', 'blanca', 'amarillo-pollo', 'amarillo', 'azul-cielo', 'azul-rey', 'beige', 'cafe', 'crema', 'fucsia', 'gris-cenizo', 'gris', 'lila', 'mostaza', 'naranja', 'roja', 'rosado-bajito', 'rosado-barbie', 'verde-militar', 'verde-navidad', 'vino-tinto']
/** Unos teñidos de cada familia (claros, oscuro, jaspeado, saturado), con su nombre: los que el E2E elige uno por uno. */
const TENIDOS: [string, string][] = [
  ['amarillo-pollo', 'Amarillo pollo'],
  ['gris', 'Gris'],
  ['azul-rey', 'Azul rey'],
  ['vino-tinto', 'Vino tinto'],
]
const ACRILICA = 'Gorra acrílica'
const MALLA = 'Gorra de malla'
const REGLA_ACRILICA = 'En la gorra acrílica el bordado va en el centro del frente y el estampado, a los lados.'
const SIN_LADO = (color: string) => `La gorra acrílica ${color} todavía no tiene foto de lado. Si la quieres ahí, cuéntanos en la nota.`

const AVISO_CALIDAD = 'Usa tu mejor imagen: si es de mala calidad, el resultado no puede hacer milagros.'
const FONDO_FIJO = 'Esta imagen conserva su fondo'
/** PRI-436: ahora se ofrece quitarlo con el modelo del navegador (e2e/fondo-ia.spec.ts). */
const FONDO_FIJO_TEXTO = 'Podemos quitarlo aquí mismo, sin subir tu foto a ningún lado.'
const PISTA_BORDADO = 'El bordado es para piezas pequeñas, como un logo o un nombre: hasta unos 10 cm de ancho.'
const ERROR_ARCHIVO = 'No pudimos abrir este archivo'

const colores = (page: Page) => page.locator('input[name=color]').evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value))
const tecnicas = (page: Page) => page.locator('input[name=tecnica]').evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value))

const enviar = (page: Page) => page.getByRole('button', { name: 'Enviar a Serflow por WhatsApp' }).filter({ visible: true })
const textoWa = async (link: Locator) => {
  const url = new URL((await link.getAttribute('href'))!)
  // Sigue el número que haya en la base: lo exacto lo prueba e2e/site-content.spec.ts.
  expect(url.origin + url.pathname).toMatch(/^https:\/\/wa\.me\/573\d{9}$/)
  return url.searchParams.get('text')!
}

async function abrir(page: Page) {
  await page.goto('/personaliza')
  // Lo pinta la isla cuando ya hidrató y el motor preparó la foto (en una máquina cargada pasa de los 5 s por defecto).
  await expect(page.getByText('Tu diseño va aquí')).toBeVisible({ timeout: 15_000 })
}

async function subir(page: Page, archivo: { name: string; mimeType: string; buffer: Buffer }) {
  await page.locator('input[type=file]').first().setInputFiles(archivo)
}

/** Cuántos px se sale la caja del diseño de lo visible de la vista previa (negativo: entra de sobra). */
async function cuantoSobra(page: Page) {
  const v = (await page.locator('.pf-pz-vista > div').boundingBox())!
  const d = await page.getByRole('group', { name: /Tu diseño/ }).boundingBox()
  // Mientras llega la foto, el diseño no está: que el poll siga esperando.
  if (!d) return Infinity
  return Math.max(v.x - d.x, v.y - d.y, d.x + d.width - v.x - v.width, d.y + d.height - v.y - v.height)
}

/** Trae el diseño a la vista y espera a que se quede quieto (el scroll suave sigue moviéndolo un rato): el mouse apunta a coordenadas de pantalla. */
async function quieto(diseno: Locator) {
  await diseno.scrollIntoViewIfNeeded()
  let previa = -1
  await expect
    .poll(async () => {
      const y = (await diseno.boundingBox())!.y
      const igual = y === previa
      previa = y
      return igual
    })
    .toBe(true)
}

/** Lo más que se aleja del color esperado una rejilla de 5 × 5 puntos dentro del diseño (9 × 9 px de la escena cada uno): el daño está en los pliegues, no en el centro. */
/** La luz de una rejilla de 5 × 5 puntos dentro del diseño, relativa a su mediana: la forma de los pliegues que toma. */
async function pliegues(page: Page) {
  const d = await page.getByRole('group', { name: /Tu diseño/ }).boundingBox()
  // Mientras llega la foto del color nuevo, el diseño no está: que el poll siga esperando.
  if (!d) return [NaN]
  const luz = await page.locator('.pf-pz-vista canvas').evaluate((c: HTMLCanvasElement, d) => {
    const r = c.getBoundingClientRect()
    const x = c.getContext('2d')!
    const out: number[] = []
    for (const fy of [0.25, 0.375, 0.5, 0.625, 0.75])
      for (const fx of [0.25, 0.375, 0.5, 0.625, 0.75]) {
        const px = Math.round(((d.x + d.width * fx - r.left) / r.width) * c.width)
        const py = Math.round(((d.y + d.height * fy - r.top) / r.height) * c.height)
        const p = x.getImageData(px - 4, py - 4, 9, 9).data
        let l = 0
        for (let i = 0; i < p.length; i += 4) l += (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) / 81
        out.push(l)
      }
    return out
  }, d)
  const mediana = [...luz].sort((a, b) => a - b)[12]
  return luz.map((l) => l / mediana)
}
/** La luz de la tela justo debajo del diseño. */
async function luzDebajo(page: Page) {
  const d = await page.getByRole('group', { name: /Tu diseño/ }).boundingBox()
  if (!d) return 0
  return page.locator('.pf-pz-vista canvas').evaluate((c: HTMLCanvasElement, d) => {
    const r = c.getBoundingClientRect()
    const p = c
      .getContext('2d')!
      .getImageData(Math.round(((d.x + d.width / 2 - r.left) / r.width) * c.width), Math.round(((d.y + d.height + 12 - r.top) / r.height) * c.height), 1, 1).data
    return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
  }, d)
}
async function peorColorEnElDiseno(page: Page, esperado: number[]) {
  const d = (await page.getByRole('group', { name: /Tu diseño/ }).boundingBox())!
  return page.locator('.pf-pz-vista canvas').evaluate(
    (c: HTMLCanvasElement, { d, esperado }) => {
      const r = c.getBoundingClientRect()
      const x = c.getContext('2d')!
      let peor = 0
      for (const fy of [0.3, 0.4, 0.5, 0.6, 0.7])
        for (const fx of [0.3, 0.4, 0.5, 0.6, 0.7]) {
          const px = Math.round(((d.x + d.width * fx - r.left) / r.width) * c.width)
          const py = Math.round(((d.y + d.height * fy - r.top) / r.height) * c.height)
          const p = x.getImageData(px - 4, py - 4, 9, 9).data
          const m = [0, 0, 0]
          for (let i = 0; i < p.length; i += 4) for (let k = 0; k < 3; k++) m[k] += p[i + k] / 81
          peor = Math.max(peor, ...m.map((v, k) => Math.abs(v - esperado[k])))
        }
      return peor
    },
    { d, esperado },
  )
}

test.describe('/personaliza', () => {
  test('encendida: se indexa, está en el sitemap y el botón de la portada lleva a ella', async ({ page, request }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Diseñar mi prenda' }).click()
    await expect(page).toHaveURL(/\/personaliza\/?$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Diseña tu prenda' })).toBeVisible()
    await expect(page.locator('meta[name=robots]')).toHaveCount(0)
    // El envío reemplaza al botón flotante de WhatsApp.
    await expect(page.getByRole('link', { name: 'Escríbenos por WhatsApp' })).toHaveCount(0)

    const sitemap = await request.get('/sitemap-0.xml')
    expect(sitemap.ok()).toBe(true)
    expect(await sitemap.text()).toContain('/personaliza')
  })

  // PRI-122: los 21 colores del taller en camiseta y en gorra acrílica; pasan de los 12 del admin (MAX_COLORES) y nada los recorta.
  test('colores: los 21 del taller en camiseta y en gorra acrílica', async ({ page }) => {
    await abrir(page)
    expect(await colores(page)).toEqual(COLORES)
    await page.getByText(ACRILICA, { exact: true }).click()
    await expect(page.getByRole('img', { name: `${ACRILICA} negra` })).toBeVisible()
    expect(await colores(page)).toEqual(COLORES)
  })

  // PRI-122: los colores teñidos tienen frente y espalda: la Espalda se habilita. Cada uno baja solo su foto, WebP liviana,
  // al elegirlo, y un estampado oscuro conserva su color encima.
  test('colores teñidos: cada uno se elige, con Pecho y Espalda, baja solo su foto y el estampado conserva su color', async ({ page, isMobile }) => {
    const ancho = isMobile ? 390 : 1280
    await page.setViewportSize({ width: ancho, height: isMobile ? 844 : 900 })
    const prendas: { url: string; bytes: number }[] = []
    page.on('response', async (r) => {
      if (/\/camiseta-[^/]*\.webp$/.test(new URL(r.url()).pathname)) prendas.push({ url: new URL(r.url()).pathname, bytes: (await r.body()).length })
    })
    await abrir(page)
    await subir(page, { name: 'jean.png', mimeType: 'image/png', buffer: bloqueJean(400) })
    await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible({ timeout: 15_000 })
    // Solo la del color de entrada: ningún teñido baja antes de elegirlo.
    expect(prendas.map((p) => p.url).filter((u) => TENIDOS.some(([id]) => u.includes(`/camiseta-${id}`)))).toEqual([])
    const espalda = page.getByRole('radio', { name: 'Espalda' })

    for (const [id, nombre] of TENIDOS) {
      await page.getByText(nombre, { exact: true }).click()
      await expect(page.getByRole('img', { name: `Camiseta ${nombre.toLowerCase()} con tu diseño` })).toBeVisible()
      await expect(page.getByRole('radio', { name: 'Pecho' })).toBeChecked()
      await expect(espalda).toBeEnabled()
      // La misma optimización que las otras: WebP liviano, la de 720 px en celular.
      await expect.poll(() => prendas.find((p) => p.url.includes(`/camiseta-${id}.`))?.bytes, { message: id }).toBeLessThanOrEqual(isMobile ? 40 * 1024 : 70 * 1024)
      await page.getByRole('group', { name: /Tu diseño/ }).scrollIntoViewIfNeeded()
      await expect.poll(() => peorColorEnElDiseno(page, JEAN), { message: id }).toBeLessThan(40)
    }
    await expect(page.getByText(/todavía no tiene foto de espalda/)).toHaveCount(0)

    const [ultimoId, ultimo] = TENIDOS[TENIDOS.length - 1]
    await page.getByText('Espalda', { exact: true }).click()
    await expect(page.getByRole('img', { name: `Camiseta ${ultimo.toLowerCase()}, espalda con tu diseño` })).toBeVisible()
    await expect.poll(() => prendas.some((p) => p.url.includes(`/camiseta-${ultimoId}-espalda.`))).toBe(true)
    await test.info().attach(`tenidos-${ancho}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })

    await enviar(page).click()
    const texto = await textoWa(page.getByRole('dialog', { name: 'Revisa y envía' }).getByRole('link', { name: 'Abrir chat con Serflow' }))
    expect(texto).toContain(`*Prenda:* Camiseta ${ultimo.toLowerCase()}`)
    expect(texto).toContain('*Ubicación:* Espalda')
  })

  // Reglas del taller (Said, PRI-122): en la acrílica el bordado va solo en el centro del frente y el estampado solo a los
  // lados (unit tests en datos.test.ts). Sin foto libre de lado ni de la de malla todavía: el lado y la de malla quedan
  // apagados con su nota, y la acrílica no ofrece estampado porque nunca va al frente.
  test('gorras: la acrílica borda en el centro del frente y no estampa al frente; la de malla, apagada hasta tener foto', async ({ page }) => {
    await abrir(page)
    const malla = page.getByRole('radio', { name: MALLA })
    await expect(malla).toBeDisabled()
    const notaMalla = page.getByText('La gorra de malla todavía no tiene foto. Si la quieres, cuéntanos en la nota.')
    await expect(notaMalla).toBeVisible()
    // La vista previa empieza debajo de la nota, sin taparla (en escritorio iba a 60 px fijos de los chips).
    const nota = (await notaMalla.boundingBox())!
    expect(nota.y + nota.height).toBeLessThanOrEqual((await page.locator('.pf-pz-vista > div').boundingBox())!.y)

    await page.getByText(ACRILICA, { exact: true }).click()
    await expect(page.getByRole('img', { name: `${ACRILICA} negra` })).toBeVisible()
    expect(await tecnicas(page)).toEqual(['bordado'])
    await expect(page.getByRole('radio', { name: 'Centro del frente' })).toBeChecked()
    await expect(page.getByRole('radio', { name: 'Lado' })).toBeDisabled()
    await expect(page.getByText(`${REGLA_ACRILICA} ${SIN_LADO('negra')}`)).toBeVisible()

    await page.getByText('Azul rey', { exact: true }).click()
    await expect(page.getByRole('img', { name: `${ACRILICA} azul rey` })).toBeVisible()
    await expect(page.getByText(`${REGLA_ACRILICA} ${SIN_LADO('azul rey')}`)).toBeVisible()
    await test.info().attach('gorra-acrilica', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
    await enviar(page).click()
    expect(await textoWa(page.getByRole('link', { name: 'Abrir chat con Serflow' }))).toContain(`*Prenda:* ${ACRILICA} azul rey\n*Técnica:* Bordado\n*Ubicación:* Centro del frente`)
  })

  test('flujo principal: logo sobre blanco, quita el fondo, cambia color y técnica y arma el mensaje de WhatsApp', async ({ page }) => {
    await abrir(page)
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })

    const fondo = page.getByRole('switch', { name: 'Quitar el fondo' })
    await expect(fondo).toBeChecked({ timeout: 15_000 })
    await expect(page.getByText('PNG · 800 × 800 px')).toBeVisible()
    await expect(page.getByRole('group', { name: /Tu diseño, unos 19 cm de ancho/ })).toBeVisible()

    await page.getByText('Blanca', { exact: true }).click()
    await expect(page.getByRole('img', { name: 'Camiseta blanca con tu diseño' })).toBeVisible()
    await page.getByRole('button', { name: 'Hacer el diseño más grande' }).click()
    await expect(page.getByRole('group', { name: /Tu diseño, unos 21 cm de ancho/ })).toBeVisible()
    await page.getByText('2 a 5', { exact: true }).click()
    await page.getByRole('textbox', { name: /Nota/ }).fill('Tallas M y L')

    await enviar(page).click()
    const hoja = page.getByRole('dialog', { name: 'Revisa y envía' })
    await expect(hoja).toBeVisible()
    await expect(hoja.getByRole('img', { name: 'Vista previa de tu prenda' }).first()).toBeVisible()
    expect(await textoWa(hoja.getByRole('link', { name: 'Abrir chat con Serflow' }))).toBe(
      [
        '¡Hola, Serflow! Quiero cotizar esta prenda personalizada:',
        '',
        '*Prenda:* Camiseta blanca',
        '*Técnica:* Estampado',
        '*Ubicación:* Pecho',
        '*Tamaño:* unos 21 cm de ancho',
        '*Cantidad:* 2 a 5',
        '*Diseño:* te lo mando en el siguiente mensaje (sin el fondo), con la vista previa',
        '*Nota:* Tallas M y L',
        '',
        'Armado en la web de Serflow',
      ].join('\n'),
    )

    // "Editar mi pedido" vuelve sin perder nada; con el fondo apagado el mensaje ya no lo dice.
    await hoja.getByRole('button', { name: 'Editar mi pedido' }).click()
    await expect(hoja).toBeHidden()
    await page.getByText('Quitar el fondo', { exact: true }).click()
    await expect(fondo).not.toBeChecked()
    await enviar(page).click()
    const texto = await textoWa(page.getByRole('link', { name: 'Abrir chat con Serflow' }))
    expect(texto).toContain('*Diseño:* te lo mando en el siguiente mensaje, con la vista previa')
    expect(texto).toContain('*Nota:* Tallas M y L')
  })

  test('técnicas por prenda: sin DTF ni en camiseta ni en gorra; sin diseño, el mensaje no pide ayuda', async ({ page }) => {
    await abrir(page)
    expect(await tecnicas(page)).toEqual(['estampado', 'bordado'])
    await expect(page.getByText('DTF', { exact: true })).toHaveCount(0)
    await expect(page.getByText('No tengo diseño, quiero que me ayuden')).toHaveCount(0)

    await page.getByText(ACRILICA, { exact: true }).click()
    await expect(page.getByText('DTF', { exact: true })).toHaveCount(0)
    expect(await tecnicas(page)).toEqual(['bordado'])

    await enviar(page).click()
    const hoja = page.getByRole('dialog', { name: 'Revisa y envía' })
    const texto = await textoWa(hoja.getByRole('link', { name: 'Abrir chat con Serflow' }))
    expect(texto).toContain('*Prenda:* Gorra acrílica negra\n*Técnica:* Bordado\n*Ubicación:* Centro del frente\n*Cantidad:* 1')
    expect(texto).not.toContain('*Diseño:*')
    expect(texto).not.toContain('quiero que me ayuden')
    expect(texto).not.toContain('*Tamaño:*')
  })

  test('bordado en camiseta: el diseño queda pequeño, con su pista, y el mensaje dice ese tamaño', async ({ page }) => {
    await abrir(page)
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })
    await expect(page.getByRole('group', { name: /Tu diseño, unos 19 cm de ancho/ })).toBeVisible()
    await expect(page.getByText(PISTA_BORDADO)).toHaveCount(0)

    await page.getByText('Bordado', { exact: true }).click()
    await expect(page.getByText(PISTA_BORDADO)).toBeVisible()
    await expect(page.getByRole('group', { name: /Tu diseño, unos 10 cm de ancho/ })).toBeVisible()

    // No crece más que el tope, ni en la espalda, que tiene otra área.
    await page.getByRole('button', { name: 'Hacer el diseño más grande' }).click()
    await expect(page.getByRole('group', { name: /Tu diseño, unos 10 cm de ancho/ })).toBeVisible()
    await page.getByText('Espalda', { exact: true }).click()
    await expect(page.getByRole('group', { name: /Tu diseño, unos 10 cm de ancho/ })).toBeVisible()

    await enviar(page).click()
    const hoja = page.getByRole('dialog', { name: 'Revisa y envía' })
    const texto = await textoWa(hoja.getByRole('link', { name: 'Abrir chat con Serflow' }))
    expect(texto).toContain('*Técnica:* Bordado')
    expect(texto).toContain('*Tamaño:* unos 10 cm de ancho')

    // Con otra técnica se quita el tope y la pista.
    await hoja.getByRole('button', { name: 'Editar mi pedido' }).click()
    await page.getByText('Estampado', { exact: true }).click()
    await expect(page.getByText(PISTA_BORDADO)).toHaveCount(0)
    await page.getByRole('button', { name: 'Hacer el diseño más grande' }).click()
    await expect(page.getByRole('group', { name: /Tu diseño, unos 13 cm de ancho/ })).toBeVisible()
  })

  test('fondo: aviso de calidad junto a la subida; quitar y restaurar; si no se puede quitar, lo dice', async ({ page }) => {
    await abrir(page)
    await expect(page.getByText(AVISO_CALIDAD)).toBeVisible()

    // Fondo plano: el interruptor quita y restaura de verdad lo que se pinta.
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })
    const fondo = page.getByRole('switch', { name: 'Quitar el fondo' })
    await expect(fondo).toBeChecked({ timeout: 15_000 })
    await expect(page.getByText(FONDO_FIJO)).toHaveCount(0)
    await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible()
    const lienzo = page.locator('.pf-pz-vista canvas')
    const pintado = () => lienzo.evaluate((c: HTMLCanvasElement) => c.toDataURL())
    await expect.poll(pintado).toMatch(/^data:image/)
    const sinFondo = await pintado()
    await page.getByText('Quitar el fondo', { exact: true }).click()
    await expect(fondo).not.toBeChecked()
    await expect.poll(pintado).not.toBe(sinFondo)

    // Ya viene transparente: no hay nada que quitar, y tampoco se le dice que falló.
    await subir(page, { name: 'logo-transparente.png', mimeType: 'image/png', buffer: logoTransparente(800) })
    await expect(page.getByText('logo-transparente.png')).toBeVisible()
    await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible()
    await expect(fondo).toHaveCount(0)
    await expect(page.getByText(FONDO_FIJO)).toHaveCount(0)

    // Fondo que no es plano: lo dice, sin interruptor, y el mensaje no promete quitarlo.
    await subir(page, { name: 'foto-prueba.png', mimeType: 'image/png', buffer: fotoSinFondoPlano(800) })
    await expect(page.getByText(FONDO_FIJO)).toBeVisible()
    await expect(page.getByText(FONDO_FIJO_TEXTO)).toBeVisible()
    await expect(fondo).toHaveCount(0)
    await enviar(page).click()
    const texto = await textoWa(page.getByRole('link', { name: 'Abrir chat con Serflow' }))
    expect(texto).toContain('*Diseño:* te lo mando en el siguiente mensaje, con la vista previa')
  })

  test('fondo con imágenes reales: los logos lo pierden, la foto de una gorra lo conserva entera', async ({ page }) => {
    // Sube 4 imágenes de verdad: en una máquina cargada pasa de los 30 s por defecto.
    test.slow()
    await abrir(page)
    await expect(page.getByText(AVISO_CALIDAD)).toBeVisible()
    const fondo = page.getByRole('switch', { name: 'Quitar el fondo' })
    const lienzo = page.locator('.pf-pz-vista canvas')
    const pintado = () => lienzo.evaluate((c: HTMLCanvasElement) => c.toDataURL())

    // Sobre blanco y fotografiado en papel: se quita y se puede restaurar.
    for (const [nombre, buffer] of [
      ['logo-blanco.jpg', await logoReal()],
      ['logo-papel.jpg', await logoEnPapel()],
    ] as const) {
      await subir(page, { name: nombre, mimeType: 'image/jpeg', buffer })
      await expect(page.getByText(nombre)).toBeVisible()
      await expect(fondo).toBeChecked({ timeout: 15_000 })
      await expect(page.getByText(FONDO_FIJO)).toHaveCount(0)
      await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible()
      await expect.poll(pintado).toMatch(/^data:image/)
      const sinFondo = await pintado()
      await page.getByText('Quitar el fondo', { exact: true }).click()
      await expect(fondo).not.toBeChecked()
      await expect.poll(pintado).not.toBe(sinFondo)
      await page.getByText('Quitar el fondo', { exact: true }).click()
      await expect(fondo).toBeChecked()
    }

    // hat4.jpg (se comía la gorra) y su versión de celular malo: conservan el fondo, lo dicen y no prometen quitarlo.
    for (const [nombre, buffer] of [
      ['gorra.jpg', readFileSync('src/assets/hat4.jpg')],
      ['gorra-celular.jpg', await gorraDeCelular()],
    ] as const) {
      await subir(page, { name: nombre, mimeType: 'image/jpeg', buffer })
      await expect(page.getByText(nombre)).toBeVisible()
      await expect(page.getByText(FONDO_FIJO)).toBeVisible({ timeout: 15_000 })
      await expect(page.getByText(FONDO_FIJO_TEXTO)).toBeVisible()
      await expect(fondo).toHaveCount(0)
      await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible()
    }
    await enviar(page).click()
    const texto = await textoWa(page.getByRole('link', { name: 'Abrir chat con Serflow' }))
    expect(texto).not.toContain('sin el fondo')
  })

  test('un diseño claro no se come: la curva gris se pinta entera y solo se va el fondo', async ({ page }) => {
    await abrir(page)
    await subir(page, { name: 'curva.jpg', mimeType: 'image/jpeg', buffer: await curvaGris() })
    await expect(page.getByRole('switch', { name: 'Quitar el fondo' })).toBeChecked({ timeout: 15_000 })
    const diseno = page.getByRole('group', { name: /Tu diseño/ })
    await expect(diseno).toBeVisible()
    await quieto(diseno)
    const d = (await diseno.boundingBox())!
    const luz = (fx: number, fy: number) =>
      page.locator('.pf-pz-vista canvas').evaluate(
        (c: HTMLCanvasElement, { x, y }) => {
          const r = c.getBoundingClientRect()
          const px = Math.round(((x - r.left) / r.width) * c.width)
          const py = Math.round(((y - r.top) / r.height) * c.height)
          const p = c.getContext('2d')!.getImageData(px - 2, py - 2, 5, 5).data
          let suma = 0
          for (let i = 0; i < p.length; i += 4) suma += (p[i] + p[i + 1] + p[i + 2]) / 75
          return suma
        },
        { x: d.x + d.width * fx, y: d.y + d.height * fy },
      )
    // Camiseta negra: la mitad del trazo se ve claro, y la esquina, que era blanca, ya no.
    await expect.poll(() => luz(360 / 1000, 310 / 620)).toBeGreaterThan(70)
    expect(await luz(0.05, 0.08)).toBeLessThan(50)
  })

  test('al taller le llega el original, no la imagen sin fondo', async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { compartidos: File[] }
      w.compartidos = []
      Object.defineProperty(navigator, 'canShare', { value: () => true, configurable: true })
      Object.defineProperty(navigator, 'share', {
        value: async ({ files }: { files: File[] }) => {
          w.compartidos = files
        },
        configurable: true,
      })
    })
    await abrir(page)
    const buffer = logoSobreBlanco(800)
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer })
    await expect(page.getByRole('switch', { name: 'Quitar el fondo' })).toBeChecked({ timeout: 15_000 })
    await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible()
    await enviar(page).click()
    const hoja = page.getByRole('dialog')
    await hoja.getByRole('button', { name: 'Compartir imágenes' }).click()
    await expect.poll(() => page.evaluate(() => (window as unknown as { compartidos: File[] }).compartidos.length)).toBeGreaterThan(0)
    const original = await page.evaluate(async () => {
      const f = (window as unknown as { compartidos: File[] }).compartidos.find((x) => x.name === 'logo-prueba.png')!
      return Array.from(new Uint8Array(await f.arrayBuffer()))
    })
    expect(Buffer.from(original).equals(buffer)).toBe(true)
  })

  test('estados: imagen pesada y de baja calidad', async ({ page }) => {
    await abrir(page)

    await subir(page, { name: 'logo-chico.png', mimeType: 'image/png', buffer: logoSobreBlanco(120) })
    await expect(page.getByText('Tu imagen es pequeña')).toBeVisible()
    await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible()

    await subir(page, { name: 'foto-pesada.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(21 * 1024 * 1024) })
    await expect(page.getByText('Esta imagen pesa mucho para verla aquí')).toBeVisible()

    await enviar(page).click()
    const hoja = page.getByRole('dialog', { name: 'Revisa y envía' })
    await expect(hoja.getByText('Documento', { exact: true })).toBeVisible()
    const texto = await textoWa(hoja.getByRole('link', { name: 'Abrir chat con Serflow' }))
    expect(texto).toContain('*Diseño:* te mando el archivo en el siguiente mensaje')
    expect(texto).not.toContain('*Tamaño:*')
  })

  test('solo imágenes: PDF, AI, PSD y HEIC que no abre dan un error claro y no se envían', async ({ page }) => {
    await abrir(page)
    await expect(page.locator('input[type=file]').first()).toHaveAttribute('accept', 'image/png,image/jpeg,image/webp')
    await expect(page.getByText(/PDF|PSD/)).toHaveCount(0)

    const casos = [
      { name: 'logo.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n') },
      { name: 'logo.ai', mimeType: 'application/postscript', buffer: Buffer.from('%!PS\n') },
      { name: 'logo.psd', mimeType: 'image/vnd.adobe.photoshop', buffer: Buffer.from('8BPS') },
      // Chrome no decodifica HEIC; Safari sí lo abre y sigue el camino normal.
      { name: 'foto-iphone.heic', mimeType: 'image/heic', buffer: Buffer.from('no se decodifica') },
    ]
    for (const archivo of casos) {
      await subir(page, archivo)
      await expect(page.getByText(ERROR_ARCHIVO)).toBeVisible()
      await expect(page.getByText(archivo.name)).toHaveCount(0)
      await enviar(page).click()
      const hoja = page.getByRole('dialog', { name: 'Revisa y envía' })
      expect(await textoWa(hoja.getByRole('link', { name: 'Abrir chat con Serflow' }))).not.toContain('*Diseño:*')
      await hoja.getByRole('button', { name: 'Editar mi pedido' }).click()
    }

    // Una imagen válida quita el error.
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })
    await expect(page.getByText('logo-prueba.png')).toBeVisible()
    await expect(page.getByText(ERROR_ARCHIVO)).toHaveCount(0)
  })

  test('cantidad: todos los botones tienen la misma forma de píldora', async ({ page }) => {
    await abrir(page)
    const chips = page.locator('input[name=cantidad] + span')
    await expect(chips).toHaveCount(4)
    for (const chip of await chips.all()) {
      const caja = (await chip.boundingBox())!
      expect(caja.width, `${await chip.textContent()}: más ancho que alto`).toBeGreaterThan(caja.height)
    }
  })

  test('colocación libre: sin recuadro, se mueve fuera del área, no se pierde y conserva los cm', async ({ page }) => {
    await abrir(page)
    await expect(page.locator('.pf-pz-vista polygon')).toHaveCount(0)
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })

    const diseno = page.getByRole('group', { name: /Tu diseño, unos 19 cm de ancho/ })
    await expect(diseno).toBeVisible()
    await diseno.scrollIntoViewIfNeeded()
    const centro = async () => {
      const c = (await diseno.boundingBox())!
      return { x: c.x + c.width / 2, y: c.y + c.height / 2 }
    }
    const inicio = await centro()
    await page.mouse.click(inicio.x, inicio.y)
    // Seleccionado: manijas y tamaño, sin recuadro punteado ni guías fijas.
    await expect(page.getByText('unos 19 cm de ancho', { exact: true })).toBeVisible()
    await expect(page.locator('.pf-pz-vista polygon')).toHaveCount(0)
    await expect(page.getByText('Centrado', { exact: true })).toHaveCount(0)

    // Arrastre enorme hacia arriba a la izquierda: llega al borde de la foto visible y se queda ahí, entero.
    await page.mouse.move(inicio.x, inicio.y)
    await page.mouse.down()
    await page.mouse.move(inicio.x - 1500, inicio.y - 1500, { steps: 4 })
    await page.mouse.up()
    const vista = (await page.locator('.pf-pz-vista > div').boundingBox())!
    await expect.poll(async () => (await diseno.boundingBox())!.x - vista.x).toBeLessThan(2)
    const arriba = (await diseno.boundingBox())!
    expect(arriba.x).toBeGreaterThanOrEqual(vista.x - 1)
    expect(arriba.y).toBeGreaterThanOrEqual(vista.y - 1)
    // Arrastrar no selecciona texto: con una selección, el siguiente arrastre arranca un drag nativo y el navegador lo corta.
    expect(await page.evaluate(() => String(getSelection()))).toBe('')

    // Hacia abajo a la derecha, igual, aunque la página tenga texto seleccionado.
    await page.evaluate(() => getSelection()!.selectAllChildren(document.body))
    const c = await centro()
    await page.mouse.move(c.x, c.y)
    await page.mouse.down()
    await page.mouse.move(c.x + 1500, c.y + 1500, { steps: 4 })
    await page.mouse.up()
    await expect.poll(async () => vista.x + vista.width - ((await diseno.boundingBox())!.x + (await diseno.boundingBox())!.width)).toBeLessThan(2)
    const abajo = (await diseno.boundingBox())!
    expect(abajo.y + abajo.height).toBeLessThanOrEqual(vista.y + vista.height + 1)

    // El tamaño no cambió por moverlo, y el mensaje lo dice.
    await enviar(page).click()
    expect(await textoWa(page.getByRole('link', { name: 'Abrir chat con Serflow' }))).toContain('*Tamaño:* unos 19 cm de ancho')
  })

  test('colocación: un diseño alto queda dentro de lo visible sin tocarlo', async ({ page }) => {
    await abrir(page)
    await subir(page, { name: 'tira.png', mimeType: 'image/png', buffer: tiraAlta() })
    await expect.poll(() => cuantoSobra(page)).toBeLessThan(1)
  })

  test('colocación: al cambiar de foto el diseño queda dentro de lo visible sin tocarlo', async ({ page }) => {
    await abrir(page)
    await page.getByText('Blanca', { exact: true }).click()
    await page.getByText('Espalda', { exact: true }).click()
    await expect(page.getByRole('img', { name: 'Camiseta blanca, espalda' })).toBeVisible()
    await expect(page.getByText('Tu diseño va aquí')).toBeVisible()
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoTransparente(800) })

    // Al borde de abajo a la derecha; la espalda negra tiene otra área y otro recorte.
    const diseno = page.getByRole('group', { name: /Tu diseño/ })
    await diseno.scrollIntoViewIfNeeded()
    const d = (await diseno.boundingBox())!
    const c = { x: d.x + d.width / 2, y: d.y + d.height / 2 }
    await page.mouse.click(c.x, c.y)
    await page.mouse.move(c.x, c.y)
    await page.mouse.down()
    await page.mouse.move(c.x + 1500, c.y + 1500, { steps: 4 })
    await page.mouse.up()

    await page.getByText('Negra', { exact: true }).click()
    await expect(page.getByRole('img', { name: 'Camiseta negra, espalda con tu diseño' })).toBeVisible()
    await expect.poll(() => cuantoSobra(page)).toBeLessThan(1)
  })

  test('la foto no salta cuando el motor reemplaza a la del HTML', async ({ page }) => {
    await page.route('**/*.js', (r) => r.abort())
    await page.goto('/personaliza')
    const html = (await page.locator('.pf-pz-vista picture img').boundingBox())!
    await page.unrouteAll()
    await abrir(page)
    const motor = (await page.locator('.pf-pz-vista canvas').boundingBox())!
    expect(Math.abs(motor.y - html.y)).toBeLessThan(1)
  })

  test('bordado: al pedir más de 10 cm avisa el tope sobre la foto', async ({ page }) => {
    await abrir(page)
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })
    await page.getByText('Bordado', { exact: true }).click()
    await expect(page.getByRole('group', { name: /Tu diseño, unos 10 cm de ancho/ })).toBeVisible()
    const aviso = page.locator('.pf-pz-vista').getByText('Bordado: hasta unos 10 cm de ancho')
    await expect(aviso).toHaveCount(0)
    await page.getByRole('button', { name: 'Hacer el diseño más grande' }).click()
    await expect(aviso).toBeVisible()
    await page.getByRole('button', { name: 'Hacer el diseño más pequeño' }).click()
    await expect(aviso).toHaveCount(0)
  })

  test('rendimiento: baja una sola foto liviana en WebP; las otras vistas, solo al pedirlas', async ({ page, isMobile }) => {
    const prendas: { url: string; bytes: number }[] = []
    page.on('response', async (r) => {
      if (/\/(camiseta|gorra)-[^/]*\.\w+$/.test(new URL(r.url()).pathname)) prendas.push({ url: new URL(r.url()).pathname, bytes: (await r.body()).length })
    })
    await abrir(page)
    await expect.poll(() => prendas.length).toBe(1)
    expect(prendas[0].url).toMatch(/\/camiseta-negra\.[^/]*\.webp$/)
    expect(prendas[0].bytes).toBeLessThanOrEqual(isMobile ? 40 * 1024 : 70 * 1024)

    await page.getByText('Espalda', { exact: true }).click()
    await expect(page.getByRole('img', { name: 'Camiseta negra, espalda' })).toBeVisible()
    await expect.poll(() => prendas.length).toBe(2)
    expect(prendas[1].url).toMatch(/\/camiseta-negra-espalda\.[^/]*\.webp$/)
  })

  test('mockup: en celular sale de la foto grande, que solo se baja al enviar', async ({ page, isMobile }) => {
    const prendas: string[] = []
    page.on('response', (r) => {
      const url = new URL(r.url()).pathname
      if (/\/(camiseta|gorra)-[^/]*\.\w+$/.test(url)) prendas.push(url)
    })
    await abrir(page)
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })
    await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible()
    expect(prendas).toHaveLength(1)

    await enviar(page).click()
    await expect(page.getByRole('dialog', { name: 'Revisa y envía' }).getByRole('img', { name: 'Vista previa de tu prenda' }).first()).toBeVisible()
    expect(prendas).toHaveLength(isMobile ? 2 : 1)
    if (isMobile) expect(prendas[1]).not.toBe(prendas[0])
  })

  test('escritorio angosto: la escena llena la vista previa, sin franja, y las dos columnas cierran a ras', async ({ page, isMobile }) => {
    test.skip(isMobile, 'el layout de dos columnas es de escritorio')
    for (const ancho of [900, 1024, 1180]) {
      await page.setViewportSize({ width: ancho, height: 900 })
      await abrir(page)
      const vista = (await page.locator('.pf-pz-vista > div').boundingBox())!
      const escena = (await page.locator('.pf-pz-vista canvas').locator('..').boundingBox())!
      expect(escena.y, `${ancho}: franja arriba`).toBeLessThanOrEqual(vista.y + 1)
      expect(escena.y + escena.height, `${ancho}: franja abajo`).toBeGreaterThanOrEqual(vista.y + vista.height - 1)
      const envio = (await page.locator('.pf-pz-envio').boundingBox())!
      const paso2 = (await page.locator('.pf-pz-pasos > section').nth(1).boundingBox())!
      expect(Math.abs(envio.y + envio.height - (paso2.y + paso2.height)), `${ancho}: columnas a ras`).toBeLessThanOrEqual(1)
    }
  })
  // La gorra ya no estampa (solo va a los lados y aún no hay foto de lado): queda la camiseta.
  test('estampado en camiseta negra: las partes oscuras del diseño conservan su color', async ({ page }) => {
    await abrir(page)
    await subir(page, { name: 'jean.png', mimeType: 'image/png', buffer: bloqueJean(400) })
    await expect(page.getByRole('img', { name: 'Camiseta negra con tu diseño' })).toBeVisible()
    await page.getByRole('group', { name: /Tu diseño/ }).scrollIntoViewIfNeeded()
    // La tela marca pliegues y trama, pero el azul no se vuelve negro (antes se alejaba 89; ahora, 31).
    await expect.poll(() => peorColorEnElDiseno(page, JEAN)).toBeLessThan(40)
  })

  test('estampado integrado: el mapa de sombreado baja con la prenda y la tinta toma los mismos pliegues en cualquier color', async ({ page }) => {
    const mapas: string[] = []
    page.on('response', (r) => {
      if (/\/sombra-camiseta[^/]*\.webp$/.test(new URL(r.url()).pathname)) mapas.push(new URL(r.url()).pathname)
    })
    await abrir(page)
    await expect.poll(() => mapas.length).toBeGreaterThan(0)
    await subir(page, { name: 'blanco.png', mimeType: 'image/png', buffer: bloqueBlanco(400) })
    await expect(page.getByRole('img', { name: 'Camiseta negra con tu diseño' })).toBeVisible()
    await page.getByRole('group', { name: /Tu diseño/ }).scrollIntoViewIfNeeded()
    await expect.poll(async () => (await pliegues(page)).length).toBe(25)
    const enNegra = await pliegues(page)
    // La tela se marca en la tinta: no es un sticker plano.
    expect(Math.max(...enNegra) - Math.min(...enNegra)).toBeGreaterThan(0.04)
    await page.getByText('Amarilla', { exact: true }).click()
    await expect(page.getByRole('img', { name: 'Camiseta amarilla con tu diseño' })).toBeVisible()
    // Ya pintó la amarilla: la tela justo debajo del diseño es clara.
    await expect.poll(() => luzDebajo(page)).toBeGreaterThan(150)
    // Mismos pliegues sobre la amarilla (solo cambia el poco de tela que deja ver la tinta).
    await expect.poll(async () => Math.max(...(await pliegues(page)).map((l, i) => Math.abs(l - enNegra[i])))).toBeLessThan(0.03)
  })

  test('si el mapa de sombreado no llega, la prenda y el diseño se ven igual (la tela sale de la foto)', async ({ page }) => {
    await page.route(/\/sombra-[^/]*\.webp$/, (r) => r.abort())
    await abrir(page)
    await subir(page, { name: 'jean.png', mimeType: 'image/png', buffer: bloqueJean(400) })
    await expect(page.getByRole('img', { name: 'Camiseta negra con tu diseño' })).toBeVisible()
    await expect(page.getByText(/No cargó la foto/)).toHaveCount(0)
    await page.getByRole('group', { name: /Tu diseño/ }).scrollIntoViewIfNeeded()
    await expect.poll(() => peorColorEnElDiseno(page, JEAN)).toBeLessThan(40)
  })

  test('un diseño chico se agarra y se mueve desde el centro, sin que las manijas lo tapen', async ({ page }) => {
    await abrir(page)
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoTransparente(400) })
    const diseno = page.getByRole('group', { name: /Tu diseño/ })
    await expect(diseno).toBeVisible()
    await diseno.focus()
    for (let i = 0; i < 12; i++) await page.keyboard.press('-')
    await quieto(diseno)
    const b = (await diseno.boundingBox())!
    expect(b.width).toBeLessThan(44)
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2)
    await expect(page.getByText(/^unos \d+ cm de ancho$/)).toBeVisible()
    // El clic lo enfoca y eso puede volver a mover la página: se mide después.
    await quieto(diseno)
    const antes = (await diseno.boundingBox())!
    const c = { x: antes.x + antes.width / 2, y: antes.y + antes.height / 2 }

    // Se arrastra desde 15 px del centro, fuera del dibujo pero dentro de los 44 px táctiles.
    await page.mouse.move(c.x + 15, c.y + 15)
    await page.mouse.down()
    await page.mouse.move(c.x + 75, c.y + 15, { steps: 4 })
    await page.mouse.up()
    await expect.poll(async () => (await diseno.boundingBox())!.x - antes.x).toBeGreaterThan(50)
    expect((await diseno.boundingBox())!.width).toBeCloseTo(antes.width, 0)
  })

  test('girar: el botón gira el diseño de a 15° y sigue dentro de lo visible', async ({ page }) => {
    await abrir(page)
    await subir(page, { name: 'tira.png', mimeType: 'image/png', buffer: tiraAlta() })
    const diseno = page.getByRole('group', { name: /Tu diseño/ })
    await expect(diseno).toBeVisible()
    const girar = page.getByRole('button', { name: 'Girar el diseño' })
    await girar.click()
    await expect(diseno).toHaveCSS('transform', /^matrix\(0\.96/)
    for (let i = 0; i < 5; i++) await girar.click()
    // A 90° la tira alta queda acostada: más ancha que alta, entera dentro de la vista.
    await expect.poll(async () => {
      const b = (await diseno.boundingBox())!
      return b.width > b.height
    }).toBe(true)
    await expect.poll(() => cuantoSobra(page)).toBeLessThan(1)
  })

  test('girar con la tecla R y con la manija no cambia el tamaño del mensaje', async ({ page }) => {
    await abrir(page)
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })
    const diseno = page.getByRole('group', { name: /Tu diseño, unos 19 cm de ancho/ })
    await expect(diseno).toBeVisible()
    await quieto(diseno)

    await diseno.focus()
    await page.keyboard.press('r')
    await expect(diseno).toHaveCSS('transform', /^matrix\(0\.96/)
    await page.keyboard.press('Shift+R')
    await expect(diseno).toHaveCSS('transform', 'none')

    // La manija de arriba: del centro hacia la derecha son unos 90°.
    const m = (await diseno.locator('.cursor-grab').boundingBox())!
    const d = (await diseno.boundingBox())!
    await page.mouse.move(m.x + m.width / 2, m.y + m.height / 2)
    await page.mouse.down()
    await page.mouse.move(d.x + d.width / 2 + 90, d.y + d.height / 2, { steps: 4 })
    await page.mouse.up()
    await expect.poll(() => diseno.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).b)).toBeGreaterThan(0.99)

    await enviar(page).click()
    expect(await textoWa(page.getByRole('link', { name: 'Abrir chat con Serflow' }))).toContain('*Tamaño:* unos 19 cm de ancho')
  })

  for (const [lado, dx, dy] of [['abajo a la izquierda', -1, 1], ['abajo a la derecha', 1, 1], ['arriba a la izquierda', -1, -1], ['arriba a la derecha', 1, -1]] as const) {
    // La gorra negra ahora es la teñida, de frente: el área no rectangular la cubren los unit tests de lugar.ts.
    test(`gorra acrílica negra: ${lado} el diseño no se sale de lo visible`, async ({ page }) => {
      await abrir(page)
      await page.getByText(ACRILICA, { exact: true }).click()
      await expect(page.getByRole('img', { name: `${ACRILICA} negra` })).toBeVisible()
      await expect(page.getByText('Tu diseño va aquí')).toBeVisible()
      await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoTransparente(800) })
      const diseno = page.getByRole('group', { name: /Tu diseño/ })
      await expect(diseno).toBeVisible()
      await quieto(diseno)
      const d = (await diseno.boundingBox())!
      const c = { x: d.x + d.width / 2, y: d.y + d.height / 2 }
      await page.mouse.click(c.x, c.y)
      await page.mouse.move(c.x, c.y)
      await page.mouse.down()
      await page.mouse.move(c.x + dx * 1500, c.y + dy * 1500, { steps: 4 })
      await page.mouse.up()
      const v = (await page.locator('.pf-pz-vista > div').boundingBox())!
      await expect
        .poll(async () => {
          const b = (await diseno.boundingBox())!
          return dy > 0 ? v.y + v.height - (b.y + b.height) : b.y - v.y
        })
        .toBeLessThan(2)
      await expect.poll(() => cuantoSobra(page)).toBeLessThan(1)
    })
  }

  test('gorra acrílica negra: en la esquina de abajo el diseño se pinta entero, sin cortarse donde se acaba la malla', async ({ page }) => {
    await abrir(page)
    await page.getByText(ACRILICA, { exact: true }).click()
    await expect(page.getByText('Tu diseño va aquí')).toBeVisible()
    const lienzo = page.locator('.pf-pz-vista canvas')
    // La foto sin diseño, para ver después qué pintó el motor.
    await lienzo.evaluate((c: HTMLCanvasElement) => {
      ;(window as unknown as { base: ImageData }).base = c.getContext('2d')!.getImageData(0, 0, c.width, c.height)
    })
    await subir(page, { name: 'bloque.png', mimeType: 'image/png', buffer: bloqueLleno(400) })
    const diseno = page.getByRole('group', { name: /Tu diseño/ })
    await expect(diseno).toBeVisible()
    await quieto(diseno)
    const d = (await diseno.boundingBox())!
    const c = { x: d.x + d.width / 2, y: d.y + d.height / 2 }
    await page.mouse.click(c.x, c.y)
    await page.mouse.move(c.x, c.y)
    await page.mouse.down()
    await page.mouse.move(c.x - 1500, c.y + 1500, { steps: 4 })
    await page.mouse.up()
    // El punto menos pintado de una rejilla dentro del diseño: donde se corta, la foto queda igual (diferencia 0).
    await expect
      .poll(async () => {
        const caja = (await diseno.boundingBox())!
        return lienzo.evaluate((el: HTMLCanvasElement, b) => {
          const base = (window as unknown as { base: ImageData }).base
          const r = el.getBoundingClientRect()
          const ahora = el.getContext('2d')!.getImageData(0, 0, el.width, el.height)
          let menor = 255
          for (const fy of [0.3, 0.4, 0.5, 0.6, 0.7])
            for (const fx of [0.3, 0.4, 0.5, 0.6, 0.7]) {
              const px = Math.round(((b.x + b.width * fx - r.left) / r.width) * el.width)
              const py = Math.round(((b.y + b.height * fy - r.top) / r.height) * el.height)
              if (px < 0 || py < 0 || px >= el.width || py >= el.height) continue
              const o = (py * el.width + px) * 4
              const dif = Math.abs(ahora.data[o] - base.data[o]) + Math.abs(ahora.data[o + 1] - base.data[o + 1]) + Math.abs(ahora.data[o + 2] - base.data[o + 2])
              menor = Math.min(menor, dif)
            }
          return menor
        }, caja)
      })
      .toBeGreaterThan(10)
  })

  test('una manija con el diseño girado no hace saltar el tamaño', async ({ page }) => {
    await abrir(page)
    await subir(page, { name: 'tira.png', mimeType: 'image/png', buffer: tiraAlta() })
    const diseno = page.getByRole('group', { name: /Tu diseño/ })
    await expect(diseno).toBeVisible()
    const girar = page.getByRole('button', { name: 'Girar el diseño' })
    for (let i = 0; i < 6; i++) await girar.click()
    await expect.poll(async () => {
      const b = (await diseno.boundingBox())!
      return b.width > b.height
    }).toBe(true)
    await quieto(diseno)
    const antes = (await diseno.boundingBox())!
    // Una esquina a 90°: antes el tamaño salía de la x y la tira 1:5 se agrandaba de golpe.
    await page.mouse.move(antes.x + antes.width, antes.y + antes.height)
    await page.mouse.down()
    await page.mouse.move(antes.x + antes.width - 1, antes.y + antes.height - 1, { steps: 2 })
    await page.mouse.up()
    expect(Math.abs((await diseno.boundingBox())!.width - antes.width)).toBeLessThan(antes.width * 0.1)
  })

  test('guardar espera la vista previa: mientras baja la foto grande no se guarda solo el diseño', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'en escritorio la foto grande ya está: el mockup sale al instante')
    let soltar = () => {}
    const espera = new Promise<void>((ok) => (soltar = ok))
    // La primera foto que pide es la liviana (la de la vista); la grande, otra URL, espera.
    let liviana = ''
    await page.route(/\/camiseta-negra\.[^/]*\.webp$/, async (r) => {
      liviana ||= r.request().url()
      if (r.request().url() !== liviana) await espera
      await r.continue()
    })
    await abrir(page)
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })
    await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible()
    await enviar(page).click()

    const hoja = page.getByRole('dialog', { name: 'Revisa y envía' })
    await expect(hoja.getByText('Preparando la vista previa…')).toBeVisible()
    await expect(hoja.getByRole('button', { name: /^Guardar/ })).toHaveCount(0)
    soltar()
    await expect(hoja.getByRole('button', { name: 'Guardar imágenes' })).toBeVisible()
    await expect(hoja.getByText('Preparando la vista previa…')).toHaveCount(0)
  })

  test('con la foto grande colgada, a los pocos segundos se puede guardar la vista previa de la foto que ya está', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'en escritorio la foto grande ya está: el mockup sale al instante')
    let liviana = ''
    await page.route(/\/camiseta-negra\.[^/]*\.webp$/, async (r) => {
      liviana ||= r.request().url()
      if (r.request().url() === liviana) await r.continue()
      // La grande nunca responde: mala señal que no llega a dar error.
    })
    await abrir(page)
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })
    await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible()
    await enviar(page).click()
    const hoja = page.getByRole('dialog', { name: 'Revisa y envía' })
    await expect(hoja.getByText('Preparando la vista previa…')).toBeVisible()
    await expect(hoja.getByRole('button', { name: 'Guardar imágenes' })).toBeVisible({ timeout: 10_000 })
    await page.unrouteAll({ behavior: 'ignoreErrors' })
  })
})

// PRI-434: en el celular, el pellizco con dos dedos sobre la prenda escala el diseño en vez de hacerle zoom a la página;
// un dedo que pasa por la foto sin estar ajustando sigue haciendo scroll, y fuera de la prenda el zoom de la página sigue.
type Punto = { x: number; y: number }
/** Gesto táctil real (CDP): cada dedo va de `desde` a `hasta` en 10 pasos. */
async function gesto(page: Page, desde: Punto[], hasta: Punto[]) {
  const cdp = await page.context().newCDPSession(page)
  const en = (t: number) => desde.map((d, i) => ({ id: i + 1, x: d.x + (hasta[i].x - d.x) * t, y: d.y + (hasta[i].y - d.y) * t }))
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: en(0) })
  for (let k = 1; k <= 10; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: en(k / 10) })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await cdp.detach()
  // El zoom de la página se aplica en el cuadro siguiente.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
}
const zoom = (page: Page) => page.evaluate(() => visualViewport!.scale)

for (const nombre of ['Pixel 7', 'iPhone 13'] as const) {
  test.describe(`/personaliza en ${nombre}`, () => {
    const { defaultBrowserType: _, ...dispositivo } = devices[nombre]
    test.use(dispositivo)
    test.beforeEach(({}, info) => test.skip(info.project.name !== 'mobile', 'una corrida por dispositivo'))

    test('pellizcar sobre la prenda escala el diseño, no la página', async ({ page }) => {
      await abrir(page)
      await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })
      const diseno = page.getByRole('group', { name: /Tu diseño/ })
      await quieto(diseno)
      const vista = (await page.locator('.pf-pz-vista > div').boundingBox())!
      const pellizcar = async () => {
        const b = (await diseno.boundingBox())!
        const y = b.y + b.height / 2
        // Los dos dedos en la prenda, fuera de la caja del diseño, y se juntan sin entrar en ella.
        await gesto(page, [{ x: vista.x + 8, y }, { x: vista.x + vista.width - 8, y }], [{ x: b.x - 4, y }, { x: b.x + b.width + 4, y }])
        return b.width
      }

      // Sin seleccionarlo antes y ya seleccionado: el diseño se achica y la página sigue igual.
      const tamano = page.getByText(/^unos \d+ cm de ancho$/)
      await expect(tamano).toHaveCount(0)
      for (const _ of [0, 1]) {
        const antes = await pellizcar()
        await expect.poll(async () => (await diseno.boundingBox())!.width).toBeLessThan(antes * 0.8)
        expect(await zoom(page)).toBe(1)
        await expect(tamano).toBeVisible()
      }
    })

    test('pellizcar con un dedo sobre el diseño sin seleccionar lo escala', async ({ page }) => {
      await abrir(page)
      await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })
      const diseno = page.getByRole('group', { name: /Tu diseño/ })
      await quieto(diseno)
      await expect(page.getByText(/^unos \d+ cm de ancho$/)).toHaveCount(0)
      const vista = (await page.locator('.pf-pz-vista > div').boundingBox())!
      const b = (await diseno.boundingBox())!
      const y = b.y + b.height / 2
      // Un dedo quieto dentro de la caja; el otro llega desde la prenda hasta el borde del diseño.
      const quietoEn = { x: b.x + b.width * 0.25, y }
      await gesto(page, [quietoEn, { x: vista.x + vista.width - 8, y }], [quietoEn, { x: b.x + b.width + 4, y }])
      await expect.poll(async () => (await diseno.boundingBox())!.width).toBeLessThan(b.width * 0.8)
      expect(await zoom(page)).toBe(1)
    })

    test('un dedo que pasa por la foto sin ajustar hace scroll, y fuera de la prenda la página hace zoom', async ({ page }) => {
      await abrir(page)
      await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })
      const diseno = page.getByRole('group', { name: /Tu diseño/ })
      await quieto(diseno)
      const vista = (await page.locator('.pf-pz-vista > div').boundingBox())!
      const x = vista.x + 12
      const scroll = await page.evaluate(() => scrollY)
      await gesto(page, [{ x, y: vista.y + vista.height - 10 }], [{ x, y: vista.y + 20 }])
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(scroll + 100)

      await page.evaluate(() => scrollTo(0, 0))
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
      const titulo = (await page.getByRole('heading', { name: 'Diseña tu prenda' }).boundingBox())!
      const y = titulo.y + titulo.height / 2
      await gesto(page, [{ x: 150, y }, { x: 200, y }], [{ x: 60, y }, { x: 290, y }])
      await expect.poll(() => zoom(page)).toBeGreaterThan(1.2)
    })
  })
}
