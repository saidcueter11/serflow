import { expect, test } from '@playwright/test'

// PRI-435: en el celular la vista previa baja con la página (fija arriba tapaba media pantalla mientras se elige) y
// "Ver cómo queda", encima de la barra de Enviar, la trae de vuelta.
// PRI-427: contra el build con los colores sembrados; los de la base real cambian con lo que publique el cliente.
test.use({ baseURL: 'http://localhost:4232' })
test('phone: the preview scrolls away while choosing and "Ver cómo queda" brings it back', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'En escritorio la vista previa va al lado de los pasos.')
  await page.goto('/personaliza')
  await expect(page.getByText('Tu diseño va aquí')).toBeVisible({ timeout: 15_000 })
  const vista = page.locator('.pf-pz-vista')
  const ver = page.getByRole('button', { name: 'Ver cómo queda' })
  await expect(ver).toHaveCount(0)

  // Eligiendo la cantidad, la vista previa ya se fue por arriba: no tapa los pasos.
  await page.getByRole('group', { name: /^Cantidad/ }).scrollIntoViewIfNeeded()
  await expect.poll(async () => (await vista.boundingBox())!.y + (await vista.boundingBox())!.height).toBeLessThan(0)
  await expect(ver).toBeVisible()
  // Al alcance del pulgar: abajo, justo encima de la barra de Enviar.
  const boton = (await ver.boundingBox())!
  const barra = (await page.getByRole('button', { name: 'Enviar a Serflow por WhatsApp' }).filter({ visible: true }).boundingBox())!
  expect(boton.y + boton.height).toBeLessThan(barra.y)
  expect(boton.y).toBeGreaterThan(page.viewportSize()!.height / 2)

  await ver.click()
  await expect.poll(async () => (await vista.boundingBox())!.y).toBeGreaterThanOrEqual(-1)
  await expect(ver).toHaveCount(0)
})
