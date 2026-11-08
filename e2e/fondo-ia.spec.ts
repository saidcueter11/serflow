import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

// PRI-436: quitar un fondo complejo con el modelo del navegador. hat4.jpg es una gorra blanca sobre un fondo blanco con
// viñeta y sombra: el automático la deja como está (personaliza.spec.ts) y el modelo sí la recorta. Sin personas ni datos.
test.use({ baseURL: 'http://localhost:4232' })

const GORRA = { name: 'gorra.jpg', mimeType: 'image/jpeg', buffer: readFileSync('src/assets/hat4.jpg') }
const FONDO_FIJO = 'Esta imagen conserva su fondo'
/** Todo lo del modelo: el worker, el wasm de onnxruntime-web y u2netp. */
const DEL_MODELO = /\.worker|ort-wasm|u2netp/

async function abrir(page: Page) {
  await page.goto('/personaliza')
  await expect(page.getByText('Tu diseño va aquí')).toBeVisible({ timeout: 15_000 })
}

/** Lo que se pidió del modelo a la red (los fetch del worker también salen por el contexto). */
function pedidos(page: Page) {
  const urls: string[] = []
  page.context().on('request', (r) => DEL_MODELO.test(r.url()) && urls.push(r.url()))
  return urls
}

async function subirGorra(page: Page) {
  await page.locator('input[type=file]').first().setInputFiles(GORRA)
  await expect(page.getByText(FONDO_FIJO)).toBeVisible({ timeout: 15_000 })
  await expect(page.getByRole('group', { name: /Tu diseño/ })).toBeVisible()
}

const pintado = (page: Page) => page.locator('.pf-pz-vista canvas').evaluate((c: HTMLCanvasElement) => c.toDataURL())
const quitar = (page: Page) => page.getByRole('button', { name: 'Quitar fondo' })
const interruptor = (page: Page) => page.getByRole('switch', { name: 'Quitar el fondo' })

test.describe('/personaliza: quitar fondo con el modelo', () => {
  test('no baja nada hasta tocar el botón; muestra el progreso, quita el fondo, se deshace y la segunda vez sale del caché', async ({ page }) => {
    test.slow()
    const red = pedidos(page)
    await abrir(page)
    await subirGorra(page)
    await expect(quitar(page)).toBeVisible()
    await expect(page.getByText(/La primera vez descarga unos \d+ MB/)).toBeVisible()
    expect(red).toEqual([])

    await expect.poll(() => pintado(page)).toMatch(/^data:image/)
    const conFondo = await pintado(page)
    await quitar(page).click()
    await expect(page.getByText(/Preparando… \d+ %|Quitando el fondo…/)).toBeVisible()
    await expect(interruptor(page)).toBeChecked({ timeout: 60_000 })
    await expect(page.getByText(FONDO_FIJO)).toHaveCount(0)
    expect(red.some((u) => u.includes('u2netp'))).toBe(true)
    await expect.poll(() => pintado(page)).not.toBe(conFondo)
    const sinFondo = await pintado(page)

    // El mensaje lo dice; con el interruptor se deshace.
    await page.getByRole('button', { name: 'Enviar a Serflow por WhatsApp' }).filter({ visible: true }).click()
    const link = page.getByRole('link', { name: 'Abrir chat con Serflow' })
    expect(decodeURIComponent((await link.getAttribute('href'))!)).toContain('(sin el fondo)')
    await page.keyboard.press('Escape')
    await page.getByText('Quitar el fondo', { exact: true }).click()
    await expect(interruptor(page)).not.toBeChecked()
    await expect.poll(() => pintado(page)).not.toBe(sinFondo)

    // Segunda vez (otra carga de la página): el wasm y el modelo salen de Cache Storage, no de la red.
    await abrir(page)
    await subirGorra(page)
    red.length = 0
    await quitar(page).click()
    await expect(interruptor(page)).toBeChecked({ timeout: 60_000 })
    expect(red.filter((u) => /ort-wasm|u2netp/.test(u))).toEqual([])
  })

  test('cancelar deja la foto como estaba y se puede volver a intentar', async ({ page }) => {
    // El modelo no termina de llegar: así hay tiempo de cancelar.
    await page.context().route(/u2netp/, () => {})
    await abrir(page)
    await subirGorra(page)
    await expect.poll(() => pintado(page)).toMatch(/^data:image/)
    const conFondo = await pintado(page)
    await quitar(page).click()
    await expect(page.getByText(/Preparando… \d+ %/)).toBeVisible()
    await page.getByRole('button', { name: 'Cancelar' }).click()
    await expect(quitar(page)).toBeVisible()
    await expect(page.getByText(FONDO_FIJO)).toBeVisible()
    await expect(interruptor(page)).toHaveCount(0)
    expect(await pintado(page)).toBe(conFondo)
  })

  test('sin WebAssembly lo dice claro, no baja nada y la foto sigue igual', async ({ page }) => {
    await page.addInitScript(() => delete (window as { WebAssembly?: unknown }).WebAssembly)
    const red = pedidos(page)
    await abrir(page)
    await subirGorra(page)
    await expect.poll(() => pintado(page)).toMatch(/^data:image/)
    const conFondo = await pintado(page)
    await quitar(page).click()
    await expect(page.getByText('Este navegador no puede quitar este fondo.', { exact: false })).toBeVisible()
    await expect(quitar(page)).toHaveCount(0)
    await expect(interruptor(page)).toHaveCount(0)
    expect(red).toEqual([])
    expect(await pintado(page)).toBe(conFondo)
  })
})
