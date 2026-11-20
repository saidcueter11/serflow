import { expect, test, type Page } from '@playwright/test'
import { MODAL } from './promos/scenarios.mjs'

// PRI-529 (ajuste de Said, 2026-11-18): tocar una prenda del muro del catálogo o de "Disponible ahora" lleva a su ficha,
// con la "/" final, y la foto crece del muro a la ficha (view transition). El modal de foto (PhotoModal) queda para las
// promos. Contra los builds sembrados de e2e/promos/scenarios.mjs: el catálogo de 4240 y las 3 promos de 4234.
const { categoria, completa } = MODAL
const FICHA = `/catalogo/${categoria.slug}/${completa.slug}/`
const CATALOGO = 'http://localhost:4240'
// Con o sin la "/" final: así, antes del cambio, el rojo es el modal que se abre y no un link que no se encuentra.
const PRENDA = `a:is([href="${FICHA}"], [href="${FICHA.slice(0, -1)}"])`

async function esLaFicha(page: Page) {
  await expect(page).toHaveURL(`${CATALOGO}${FICHA}`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(completa.name)
  await expect(page.locator('.lupa')).toBeAttached()
  await expect(page.getByRole('dialog')).toHaveCount(0)
}

/** La foto que lleva el nombre de la view transition justo antes del cambio de página, y la que lo lleva después. */
const vigilarFoto = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { foto: { antes?: string | null; despues?: string | null } }
    w.foto = {}
    const nombrada = () => [...document.querySelectorAll<HTMLElement>('*')].find((e) => e.style.viewTransitionName)
    document.addEventListener('astro:before-swap', () => (w.foto.antes = nombrada()?.closest('a')?.getAttribute('href') ?? null), { once: true })
    document.addEventListener('astro:after-swap', () => (w.foto.despues = nombrada()?.className ?? null), { once: true })
  })
const fotoVigilada = (page: Page) => page.evaluate(() => (window as unknown as { foto: { antes?: string | null; despues?: string | null } }).foto)

test('the catalog wall opens the product page, not the modal, and the photo grows into it', async ({ page }) => {
  await page.goto(`${CATALOGO}/catalogo/${categoria.slug}/`)
  const tile = page.locator(`main [data-fotos] ${PRENDA}`)
  await vigilarFoto(page)
  await tile.click()
  await esLaFicha(page)
  // Una sola foto con nombre a cada lado: la del muro y la primera de la galería.
  expect(await fotoVigilada(page)).toEqual({ antes: FICHA, despues: 'gp-foto' })

  // Atrás vuelve al muro, sin modal.
  await page.goBack()
  await expect(page).toHaveURL(`${CATALOGO}/catalogo/${categoria.slug}/`)
  await expect(tile).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('Disponible ahora opens the product page too', async ({ page }) => {
  await page.goto(`${CATALOGO}/`)
  await vigilarFoto(page)
  await page.locator(`#disponible ${PRENDA}`).click()
  await esLaFicha(page)
  expect(await fotoVigilada(page)).toEqual({ antes: FICHA, despues: 'gp-foto' })
})

test('reduced motion: it still opens the product page, with no photo travelling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${CATALOGO}/catalogo/${categoria.slug}/`)
  await vigilarFoto(page)
  await page.locator(`main [data-fotos] ${PRENDA}`).click()
  await esLaFicha(page)
  expect(await fotoVigilada(page)).toEqual({ antes: null, despues: null })
})

test('a promo photo still opens the photo modal', async ({ page }) => {
  await page.goto('http://localhost:4234/promos/')
  await page.locator('main a[data-foto]').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page).toHaveURL(/\/promos\/e2e-2x1-gorras\/?$/)
})
