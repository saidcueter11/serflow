import { deflateSync } from 'node:zlib'
import { expect, test, type Locator, type Page } from '@playwright/test'

// PRI-122: /personaliza con fotos de muestra, escondida hasta PRI-125. Los archivos de prueba se arman aquí (sin datos
// personales ni binarios en el repo).

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
/** PNG RGB de lado n: un logo (aro rojo y cuadro azul) sobre fondo blanco plano. */
function logoSobreBlanco(n: number): Buffer {
  const filas = Buffer.alloc(n * (n * 3 + 1))
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const r = Math.hypot(x - n / 2, y - n / 2) / n
      const azul = Math.abs(x - n / 2) < n * 0.08 && Math.abs(y - n / 2) < n * 0.08
      const c = azul ? [30, 60, 180] : r > 0.2 && r < 0.35 ? [210, 30, 40] : [255, 255, 255]
      filas.set(c, y * (n * 3 + 1) + 1 + x * 3)
    }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(n, 0)
  ihdr.writeUInt32BE(n, 4)
  ihdr.set([8, 2, 0, 0, 0], 8)
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), bloque('IHDR', ihdr), bloque('IDAT', deflateSync(filas)), bloque('IEND', Buffer.alloc(0))])
}

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
  test('está escondida: noindex, fuera del sitemap y sin links desde la portada ni el header', async ({ page, request }) => {
    await page.goto('/personaliza')
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex, nofollow')
    await expect(page.getByRole('heading', { level: 1, name: 'Diseña tu prenda' })).toBeVisible()
    // El envío reemplaza al botón flotante de WhatsApp.
    await expect(page.getByRole('link', { name: 'Escríbenos por WhatsApp' })).toHaveCount(0)

    await page.goto('/')
    await expect(page.locator('a[href*="personaliza"]')).toHaveCount(0)

    const sitemap = await request.get('/sitemap-0.xml')
    expect(sitemap.ok()).toBe(true)
    const xml = await sitemap.text()
    expect(xml).toContain('<loc>')
    expect(xml).not.toContain('personaliza')
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
    await page.getByText('DTF', { exact: true }).click()
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
        '*Técnica:* DTF',
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

  test('gorra sin diseño: solo bordado y pide ayuda', async ({ page }) => {
    await abrir(page)
    await page.getByText('Gorra', { exact: true }).click()
    await expect(page.getByText('En gorras bordamos, es lo que mejor queda.', { exact: false })).toBeVisible()
    await expect(page.getByText('Estampado', { exact: true })).toHaveCount(0)
    await page.getByText('No tengo diseño, quiero que me ayuden').click()

    await enviar(page).click()
    const texto = await textoWa(page.getByRole('link', { name: 'Abrir chat con Serflow' }))
    expect(texto).toContain('*Prenda:* Gorra negra\n*Técnica:* Bordado\n*Ubicación:* Frente\n*Cantidad:* 1')
    expect(texto).toContain('*Diseño:* todavía no tengo, quiero que me ayuden')
    expect(texto).not.toContain('*Tamaño:*')
  })

  test('estados: imagen pesada, de baja calidad y formato que no se puede mostrar', async ({ page }) => {
    await abrir(page)

    await subir(page, { name: 'foto-pesada.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(21 * 1024 * 1024) })
    await expect(page.getByText('Esta imagen pesa mucho para verla aquí')).toBeVisible()

    await subir(page, { name: 'logo-chico.png', mimeType: 'image/png', buffer: logoSobreBlanco(120) })
    await expect(page.getByText('Tu imagen es pequeña')).toBeVisible()
    await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible()

    await subir(page, { name: 'logo-final.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n%prueba\n') })
    await expect(page.getByText('Este archivo no lo podemos mostrar aquí')).toBeVisible()
    await expect(page.getByText('No se puede ver aquí')).toBeVisible()

    await enviar(page).click()
    const hoja = page.getByRole('dialog', { name: 'Revisa y envía' })
    await expect(hoja.getByText('Documento', { exact: true })).toBeVisible()
    const texto = await textoWa(hoja.getByRole('link', { name: 'Abrir chat con Serflow' }))
    expect(texto).toContain('*Diseño:* te mando el archivo en el siguiente mensaje')
    expect(texto).not.toContain('*Tamaño:*')
  })
})
