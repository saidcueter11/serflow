import { expect, test } from '@playwright/test'

// PRI-429: con la barra de scroll clásica (Windows) la foto del modal vuelve exactamente a su puesto. Archivo propio porque
// quitar --hide-scrollbars (Playwright lo pone por defecto) cambia el navegador de todo el archivo. Una barra inyectada con
// ::-webkit-scrollbar no sirve: Chrome no le guarda el hueco a la de la página cuando el modal le quita el scroll.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } })
test.skip(({ isMobile }) => isMobile, 'Phones use overlay scrollbars')

type Caja = { x: number; y: number; w: number; h: number }
const centro = (c: Caja) => ({ x: c.x + c.w / 2, y: c.y + c.h / 2 })

test('with a classic scrollbar the photo lands exactly on its place, with no jump when the modal closes', async ({ page }) => {
  await page.goto('/products')
  // La barra clásica de Chromium en Linux (CI), como la de Windows. En macOS es flotante y no ocupa ancho: no hay qué medir.
  const barra = await page.evaluate(() => innerWidth - document.documentElement.clientWidth)
  test.skip(barra === 0, 'Overlay scrollbars (macOS): run on Linux, as CI does')
  expect(barra).toBe(15)
  const tiles = page.locator('main a[data-foto]')
  // La de la última columna de la primera fila: la que más se corría.
  const i = await tiles.evaluateAll((as) => {
    const rs = as.map((a) => a.getBoundingClientRect())
    const fila = Math.min(...rs.map((r) => r.top))
    return rs.reduce((k, r, j) => (Math.abs(r.top - fila) < 2 && r.left > rs[k].left ? j : k), 0)
  })
  const tile = tiles.nth(i)
  const medir = () => tile.evaluate((a): Caja => {
    const r = a.getBoundingClientRect()
    return { x: r.left, y: r.top, w: r.width, h: r.height }
  })
  await tile.scrollIntoViewIfNeeded()
  // Al entrar en pantalla la foto del muro sube 16 px (sf-espera -> sf-aparece, movimiento.ts): medirla a mitad de camino
  // corría la y de 4 a 15 px (PRI-469). Se mide cuando ya llegó.
  await expect(tile.locator('..')).not.toHaveClass(/sf-espera|sf-aparece/)
  const antes = await medir()
  await tile.click()
  await expect(tile.locator('img')).toHaveCSS('opacity', '0')

  // Abierto: el muro no se mueve. Al final de la vuelta (mismo cuadro), la foto está sobre su puesto de siempre.
  const fin = await tile.evaluate((a) => {
    const box = (r: DOMRect) => ({ x: r.left, y: r.top, w: r.width, h: r.height })
    const abierto = box(a.getBoundingClientRect())
    document.querySelector<HTMLElement>('dialog [data-mx="cerrar"]')!.click()
    const m = document.querySelector<HTMLElement>('dialog .mx-marco')!
    const anim = m.getAnimations().find((x) => (x as CSSAnimation).animationName === 'mx-vuelve')!
    anim.pause()
    anim.currentTime = Number(anim.effect!.getComputedTiming().endTime) - 1
    const marco = box(m.getBoundingClientRect())
    anim.play()
    return { abierto, marco }
  })
  expect(fin.abierto.x).toBeCloseTo(antes.x, 0)
  expect(fin.abierto.w).toBeCloseTo(antes.w, 0)
  expect(Math.abs(centro(fin.marco).x - centro(antes).x)).toBeLessThan(1)
  expect(Math.abs(centro(fin.marco).y - centro(antes).y)).toBeLessThan(1)

  await expect(page.getByRole('dialog')).toBeHidden()
  const despues = await medir()
  expect(despues.x).toBeCloseTo(antes.x, 0)
  expect(despues.w).toBeCloseTo(antes.w, 0)
})
