import { test } from '@playwright/test'

// PRI-469 diagnostico temporal: no se mergea.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } })
test.skip(({ isMobile }) => isMobile, 'Phones use overlay scrollbars')
test.describe.configure({ retries: 0 })

for (const n of [1, 2, 3, 4, 5]) {
  test(`diag ${n}`, async ({ page }) => {
    await page.goto('/products')
    const barra = await page.evaluate(() => innerWidth - document.documentElement.clientWidth)
    test.skip(barra === 0, 'overlay')
    const tiles = page.locator('main a[data-foto]')
    const i = await tiles.evaluateAll((as) => {
      const rs = as.map((a) => a.getBoundingClientRect())
      const fila = Math.min(...rs.map((r) => r.top))
      return rs.reduce((k, r, j) => (Math.abs(r.top - fila) < 2 && r.left > rs[k].left ? j : k), 0)
    })
    const tile = tiles.nth(i)
    const y = () => tile.evaluate((a) => ({ top: a.getBoundingClientRect().top, sy: scrollY }))
    await tile.scrollIntoViewIfNeeded()
    const antes = await y()
    const quieto = await tile.evaluate(
      (a) =>
        new Promise((ok) => {
          let k = 0, prev = NaN
          const f = () => {
            const s = scrollY
            if (s === prev && ++k > 3) return ok({ top: a.getBoundingClientRect().top, sy: s })
            if (s !== prev) k = 0
            prev = s
            requestAnimationFrame(f)
          }
          requestAnimationFrame(f)
        }),
    )
    await tile.click()
    const abierto = await y()
    // Cierre natural: muestrea el marco y la foto del muro en cada cuadro hasta que se cierra.
    const nat = await tile.evaluate(
      (a) =>
        new Promise((ok) => {
          const d = document.querySelector<HTMLDialogElement>('dialog[data-photo-modal]')!
          const m = d.querySelector<HTMLElement>('.mx-marco')!
          const c = (r: DOMRect) => ({ cx: r.left + r.width / 2, cy: r.top + r.height / 2 })
          const t0 = c(a.getBoundingClientRect())
          d.querySelector<HTMLElement>('[data-mx="cerrar"]')!.click()
          let last: unknown = null
          const f = () => {
            if (!d.open) {
              const t1 = c(a.getBoundingClientRect())
              return ok({ t0, t1, last, sy: scrollY })
            }
            const mc = c(m.getBoundingClientRect())
            last = { ...mc, dy: mc.cy - c(a.getBoundingClientRect()).cy, dx: mc.cx - c(a.getBoundingClientRect()).cx }
            requestAnimationFrame(f)
          }
          requestAnimationFrame(f)
        }),
    )
    console.log(`PRI469 diag ${n} ${JSON.stringify({ antes, quieto, abierto, nat })}`)
  })
}
