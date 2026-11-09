import { expect, test, type Page } from '@playwright/test'
import { coloresDeLaSiembra } from './promos/sembrado.mjs'

// PRI-427: los colores del personalizador salen solo de la base. Lo oculto y lo agregado en el admin: e2e/medios.spec.ts.
const colores = (page: Page) => page.locator('input[name=color]').evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value))
const sembrados = (garment: string) => coloresDeLaSiembra().filter((c: { garment: string }) => c.garment === garment).map((c: { id: string }) => c.id)

test.describe('con la migración aplicada', () => {
  // El build que lee las filas del SQL de la migración: lo que quedará en prod.
  test.use({ baseURL: 'http://localhost:4237' })

  test('los 21 colores de muestra salen de entrada, en su orden, en la camiseta y la gorra acrílica', async ({ page }) => {
    await page.goto('/personaliza')
    await expect(page.getByText('Tu diseño va aquí')).toBeVisible({ timeout: 15_000 })
    expect(sembrados('camiseta')).toHaveLength(21)
    expect(await colores(page)).toEqual(sembrados('camiseta'))

    await page.getByText('Gorra acrílica', { exact: true }).click()
    await expect(page.getByText('Negra', { exact: true })).toBeVisible()
    expect(await colores(page)).toEqual(sembrados('gorra'))
  })
})

test.describe('sin ningún color que sirva', () => {
  // Datos inválidos: la única fila apunta a una foto que no existe y a otra de otro proyecto.
  test.use({ baseURL: 'http://localhost:4236' })

  test('/personaliza avisa y deja escribir por WhatsApp en vez de romperse', async ({ page }) => {
    const errores: string[] = []
    page.on('pageerror', (e) => errores.push(e.message))
    await page.goto('/personaliza')
    await expect(page.getByRole('heading', { level: 1, name: 'Diseña tu prenda' })).toBeVisible()
    await expect(page.getByText('Estamos subiendo las prendas')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Escríbenos por WhatsApp' })).toHaveAttribute('href', /^https:\/\/wa\.me\/\d+/)
    await expect(page.locator('input[name=color]')).toHaveCount(0)
    expect(errores).toEqual([])
  })
})
