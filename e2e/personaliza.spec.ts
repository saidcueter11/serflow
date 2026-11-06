import { deflateSync } from 'node:zlib'
import { expect, test, type Locator, type Page } from '@playwright/test'

// PRI-122: /personaliza encendida con fotos de muestra (las oficiales llegan con PRI-125). Los archivos de prueba se arman
// aquí (sin datos personales ni binarios en el repo).

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
/** PNG RGBA de lado n, píxel por píxel. */
function png(n: number, pixel: (x: number, y: number) => number[]): Buffer {
  const filas = Buffer.alloc(n * (n * 4 + 1))
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) filas.set(pixel(x, y), y * (n * 4 + 1) + 1 + x * 4)
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(n, 0)
  ihdr.writeUInt32BE(n, 4)
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

const AVISO_CALIDAD = 'Usa tu mejor imagen: si es de mala calidad, el resultado no puede hacer milagros.'
const FONDO_FIJO = 'Esta imagen conserva su fondo'
const PISTA_BORDADO = 'El bordado es para piezas pequeñas, como un logo o un nombre: hasta unos 10 cm de ancho.'
const ERROR_ARCHIVO = 'No pudimos abrir este archivo'

const colores = (page: Page) => page.locator('input[name=color]').evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value))
const tecnicas = (page: Page) => page.locator('input[name=tecnica]').evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value))

const enviar = (page: Page) => page.getByRole('button', { name: 'Enviar a Serflow por WhatsApp' }).filter({ visible: true })
const textoWa = async (link: Locator) => {
  const url = new URL((await link.getAttribute('href'))!)
  expect(url.origin + url.pathname).toBe('https://wa.me/573156481243')
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

  test('colores: solo los que tienen foto real, en camiseta y en gorra', async ({ page }) => {
    await abrir(page)
    expect(await colores(page)).toEqual(['negra', 'blanca'])
    await page.getByText('Gorra', { exact: true }).click()
    await expect(page.getByText('Gris', { exact: true })).toHaveCount(0)
    await expect(page.getByText('Azul', { exact: true })).toHaveCount(0)
    expect(await colores(page)).toEqual(['negra', 'blanca'])
  })

  test('flujo principal: logo sobre blanco, quita el fondo, cambia color y técnica y arma el mensaje de WhatsApp', async ({ page }) => {
    await abrir(page)
    await subir(page, { name: 'logo-prueba.png', mimeType: 'image/png', buffer: logoSobreBlanco(800) })

    const fondo = page.getByRole('switch', { name: 'Quitar el fondo' })
    await expect(fondo).toBeChecked()
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

    await page.getByText('Gorra', { exact: true }).click()
    await expect(page.getByText('DTF', { exact: true })).toHaveCount(0)
    expect(await tecnicas(page)).toEqual(['bordado', 'estampado'])

    await enviar(page).click()
    const hoja = page.getByRole('dialog', { name: 'Revisa y envía' })
    const texto = await textoWa(hoja.getByRole('link', { name: 'Abrir chat con Serflow' }))
    expect(texto).toContain('*Prenda:* Gorra negra\n*Técnica:* Bordado\n*Ubicación:* Frente\n*Cantidad:* 1')
    expect(texto).not.toContain('*Diseño:*')
    expect(texto).not.toContain('quiero que me ayuden')
    expect(texto).not.toContain('*Tamaño:*')

    await hoja.getByRole('button', { name: 'Editar mi pedido' }).click()
    await page.getByText('Estampado', { exact: true }).click()
    await enviar(page).click()
    expect(await textoWa(page.getByRole('link', { name: 'Abrir chat con Serflow' }))).toContain('*Técnica:* Estampado')
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
    await expect(fondo).toBeChecked()
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
    await expect(page.getByText('Aquí solo podemos quitar fondos de un solo color.')).toBeVisible()
    await expect(fondo).toHaveCount(0)
    await enviar(page).click()
    const texto = await textoWa(page.getByRole('link', { name: 'Abrir chat con Serflow' }))
    expect(texto).toContain('*Diseño:* te lo mando en el siguiente mensaje, con la vista previa')
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

    // Hacia abajo a la derecha, igual.
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
})
