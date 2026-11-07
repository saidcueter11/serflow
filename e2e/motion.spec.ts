import { expect, test, type Page } from '@playwright/test'

// PRI-287, ronda de ajustes: modal (nombre completo, carga, flechas), aparición al hacer scroll una sola vez, entrada del
// muro al cambiar de categoría y navegación. Contra el catálogo real del build: entra por las fotos, sin slugs fijos.
const tiles = (page: Page) => page.locator('main a[data-foto]')
const dialog = (page: Page) => page.getByRole('dialog')
const marco = (page: Page) => dialog(page).locator('.mx-marco')
const nombre = (page: Page) => dialog(page).getByRole('heading', { level: 2 })
const pedir = (page: Page) => dialog(page).getByRole('link', { name: 'Pedir por WhatsApp' })

/** Abre la primera categoría con al menos 3 fotos. */
async function openCategory(page: Page) {
  await page.goto('/products')
  const chips = page.getByRole('navigation', { name: 'Categorías' }).getByRole('link')
  for (let i = 1; i < (await chips.count()); i++) {
    if (Number(await chips.nth(i).locator('span').innerText()) < 3) continue
    await page.goto((await chips.nth(i).getAttribute('href'))!)
    return
  }
  throw new Error('No category with 3+ photos')
}

/** Click en "Catálogo" desde el header: en el celular va dentro del menú. */
async function irAlCatalogo(page: Page, isMobile: boolean) {
  if (isMobile) await page.getByRole('banner').getByLabel('Abrir menú').click()
  await page.getByRole('banner').getByRole('link', { name: 'Catálogo' }).locator('visible=true').click()
}

async function expectFullName(page: Page, isMobile: boolean) {
  await expect(nombre(page)).toBeVisible()
  const m = await nombre(page).evaluate((h) => ({ scroll: h.scrollWidth, client: h.clientWidth, overflow: getComputedStyle(h).textOverflow }))
  expect(m.overflow).not.toBe('ellipsis')
  expect(m.scroll).toBeLessThanOrEqual(m.client)
  const h = (await nombre(page).boundingBox())!
  const p = (await pedir(page).boundingBox())!
  const vp = page.viewportSize()!
  expect(p.y + p.height).toBeLessThanOrEqual(vp.height)
  if (!isMobile) expect(h.x + h.width).toBeLessThanOrEqual(p.x)
}

test('modal: the name is never cut next to the button, also with a very long one', async ({ page, isMobile }) => {
  await page.goto('/products')
  // El nombre más largo del catálogo.
  const larga = await tiles(page).evaluateAll((as) => {
    const largo = (a: Element) => JSON.parse((a as HTMLElement).dataset.foto!).titulo.length
    return as.reduce((m, a, i, all) => (largo(a) > largo(all[m]) ? i : m), 0)
  })
  await tiles(page).nth(larga).click()
  await expectFullName(page, isMobile)
  await page.keyboard.press('Escape')

  // Y uno mucho más largo que cualquiera de hoy.
  await tiles(page).first().evaluate((a: HTMLElement) => {
    a.dataset.foto = JSON.stringify({ ...JSON.parse(a.dataset.foto!), titulo: 'Selección Colombia Edición Especial Mundial Bordada N.º 1024' })
  })
  await tiles(page).first().click()
  await expect(nombre(page)).toHaveText(/N\.º 1024$/)
  await expectFullName(page, isMobile)
})

test('modal: the retired line is gone', async ({ page }) => {
  await openCategory(page)
  await tiles(page).first().click()
  await expect(dialog(page)).toBeVisible()
  await expect(dialog(page).getByText('Te la hacemos igual')).toHaveCount(0)
})

test('modal: while the photo loads there is a shimmer with its shape, then the photo fades in', async ({ page }) => {
  await openCategory(page)
  const tile = tiles(page).nth(1)
  const foto = await tile.evaluate((a: HTMLElement) => JSON.parse(a.dataset.foto!).fotos[0] as { src: string; srcSet: string; r: number })
  const urls = new Set([foto.src, ...foto.srcSet.split(',').map((c) => c.trim().split(' ')[0])].map((u) => new URL(u, page.url()).pathname))
  let soltar = () => {}
  const compuerta = new Promise<void>((r) => (soltar = r))
  await page.route(
    (u) => urls.has(u.pathname),
    async (route) => {
      await compuerta
      await route.continue()
    },
  )

  await tile.click()
  await expect(marco(page)).toHaveAttribute('data-cargando', '')
  await expect(marco(page).locator('.mx-brillo')).toBeVisible()
  await expect(dialog(page).locator('img.mx-foto')).toHaveCSS('opacity', '0')
  // La forma de la foto, sin esperar a que baje.
  const box = (await marco(page).boundingBox())!
  expect(box.height).toBeGreaterThan(100)
  expect(box.width / box.height).toBeCloseTo(foto.r, 1)

  soltar()
  await expect(marco(page)).not.toHaveAttribute('data-cargando', '')
  await expect(marco(page).locator('.mx-brillo')).toBeHidden()
  await expect(dialog(page).locator('img.mx-foto')).toHaveCSS('opacity', '1')
  expect(await dialog(page).locator('img.mx-foto').evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0)
  // Sin saltos: la caja sigue igual con la foto puesta.
  const after = (await marco(page).boundingBox())!
  expect(after.width).toBeCloseTo(box.width, 0)
  expect(after.height).toBeCloseTo(box.height, 0)
})

test('modal: the arrows slide the photo in their direction and the neighbours are already preloaded', async ({ page }) => {
  await openCategory(page)
  await tiles(page).nth(1).click()
  await expect(marco(page)).not.toHaveAttribute('data-cargando', '')

  // La siguiente ya está bajada: el mismo archivo que va a pedir la foto grande.
  const vecina = dialog(page).locator('.mx-vecina-sig img')
  await expect.poll(() => vecina.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true)
  const precargada = await vecina.evaluate((i: HTMLImageElement) => i.currentSrc)

  const pasar = (sel: string) =>
    page.evaluate((s) => {
      document.querySelector<HTMLElement>(`dialog ${s}`)!.click()
      const m = document.querySelector<HTMLElement>('.mx-marco')!
      const sale = m.querySelector('.mx-saliente')!
      return { dir: m.style.getPropertyValue('--mx-dir'), sale: sale.getAnimations().map((a) => (a as CSSAnimation).animationName) }
    }, sel)

  expect(await pasar('.mx-sig')).toEqual({ dir: '1', sale: ['mx-sale'] })
  await expect(dialog(page).locator('img.mx-foto')).toHaveClass(/mx-entra/)
  await expect(marco(page).locator('.mx-saliente')).toHaveCount(0)
  await expect.poll(() => dialog(page).locator('img.mx-foto').evaluate((i: HTMLImageElement) => i.currentSrc)).toBe(precargada)

  expect(await pasar('.mx-ant')).toEqual({ dir: '-1', sale: ['mx-sale'] })
  await expect(marco(page).locator('.mx-saliente')).toHaveCount(0)
})

test('scroll: cards fade in from below once, without moving the layout', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const card = page.locator('.pf-servicios > *').first()
  await expect(card).toHaveClass(/sf-espera/)
  await expect(card).toHaveCSS('opacity', '0')
  const antes = await card.evaluate((c: HTMLElement) => ({ top: c.offsetTop, h: c.offsetHeight }))

  await card.scrollIntoViewIfNeeded()
  await expect(card).not.toHaveClass(/sf-espera/)
  await expect(card).toHaveCSS('opacity', '1')
  expect(await card.evaluate((c: HTMLElement) => ({ top: c.offsetTop, h: c.offsetHeight }))).toEqual(antes)

  // Al volver a subir no se esconde ni queda atada al scroll: ya entró.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect(card).not.toHaveClass(/sf-espera/)
  await expect(card).toHaveCSS('opacity', '1')
  const atadas = await page.evaluate(
    () => document.getAnimations().filter((a) => a.timeline && !(a.timeline instanceof DocumentTimeline) && !(a.effect as KeyframeEffect).target?.closest('svg')).length,
  )
  expect(atadas).toBe(0)
})

test('catalog: changing category makes the first rows of the wall enter', async ({ page, isMobile }) => {
  // A 1280x720 el banner llena la pantalla: el muro entra en pantalla solo con más alto.
  if (!isMobile) await page.setViewportSize({ width: 1280, height: 1000 })
  await page.goto('/products')
  await page.evaluate(() => {
    document.addEventListener('astro:after-swap', () => {
      const h = innerHeight
      ;(window as unknown as { entrando: number }).entrando = [...document.querySelectorAll('[data-fotos] > li.sf-espera')].filter((li) => li.getBoundingClientRect().top < h).length
    })
  })
  const chip = page.getByRole('navigation', { name: 'Categorías' }).getByRole('link').nth(1)
  const href = (await chip.getAttribute('href'))!
  await chip.click()
  await expect(page).toHaveURL(new RegExp(`${href}/?$`))
  await expect.poll(() => page.evaluate(() => (window as unknown as { entrando?: number }).entrando)).toBeGreaterThan(0)
  await expect(page.locator('[data-fotos] > li').first()).toHaveCSS('opacity', '1')
})

test('navigation: the header persists (and the mobile menu closes)', async ({ page, isMobile }) => {
  await page.goto('/')
  await page.getByRole('banner').evaluate((h: HTMLElement) => (h.dataset.marca = 'misma'))
  await irAlCatalogo(page, isMobile)
  await expect(page).toHaveURL(/\/products\/?$/)
  await expect(page.locator('header[data-marca="misma"]')).toHaveCount(1)
  if (isMobile) await expect(page.getByRole('banner').locator('details')).not.toHaveAttribute('open', '')
})

test('navigation: a thin gold bar shows only while the page takes time to arrive', async ({ page, isMobile }) => {
  await page.goto('/')
  const barra = page.locator('.sf-nav-barra')
  await expect(barra).toHaveCSS('opacity', '0')
  let soltar = () => {}
  const compuerta = new Promise<void>((r) => (soltar = r))
  await page.route(/\/products\/?$/, async (route) => {
    await compuerta
    await route.continue()
  })
  await irAlCatalogo(page, isMobile)
  await expect(barra).toHaveCSS('opacity', '1')
  soltar()
  await expect(page).toHaveURL(/\/products\/?$/)
  await expect(barra).toHaveCSS('opacity', '0')
})

test('reduced motion: everything is visible right away and navigation does not animate', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const path of ['/', '/products', '/promos', '/personaliza']) {
    await page.goto(path)
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('.sf-espera')).toHaveCount(0)
    const tapados = await page
      .locator('.pf-head, .pf-servicios > *, .pf-prendas > *, [data-fotos] > li, .pf-promo, .pf-pz-pasos > section')
      .evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length)
    expect(tapados, path).toBe(0)
  }

  await page.goto('/')
  await page.evaluate(() => {
    document.addEventListener('astro:before-swap', (e) => {
      const w = window as unknown as { animadas: number }
      ;(e as unknown as { viewTransition: ViewTransition }).viewTransition.ready.then(() => {
        w.animadas = document.getAnimations().filter((a) => (a.effect as KeyframeEffect).pseudoElement?.startsWith('::view-transition')).length
      })
    })
  })
  await irAlCatalogo(page, isMobile)
  await expect(page).toHaveURL(/\/products\/?$/)
  await expect.poll(() => page.evaluate(() => (window as unknown as { animadas?: number }).animadas)).toBe(0)
})

test('slow connection: nothing waits to appear, on load or after navigating', async ({ page, isMobile }) => {
  // Lo que el navegador reporta en 2G: el script inline del Layout lo lee antes de que corra movimiento.ts.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', { value: { effectiveType: '2g', saveData: false, addEventListener() {} } })
  })
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/slow-connection/)
  await expect(page.locator('.sf-espera')).toHaveCount(0)
  await expect(page.locator('.pf-servicios > *').first()).toHaveCSS('opacity', '1')

  await page.evaluate(() => {
    document.addEventListener('astro:after-swap', () => {
      ;(window as unknown as { esperando: number }).esperando = document.querySelectorAll('.sf-espera').length
    })
  })
  await irAlCatalogo(page, isMobile)
  await expect(page).toHaveURL(/\/products\/?$/)
  await expect.poll(() => page.evaluate(() => (window as unknown as { esperando?: number }).esperando)).toBe(0)
  await expect(page.locator('html')).toHaveClass(/slow-connection/)
})

test('the motion script stays an external file: the CSP (PRI-152) only allows inline scripts by hash', async ({ page }) => {
  for (const path of ['/', '/products']) {
    await page.goto(path)
    await expect(page.locator('script[type="module"]:not([src])')).toHaveCount(0)
  }
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('nothing stays hidden', async ({ page }) => {
    for (const path of ['/', '/products']) {
      await page.goto(path)
      await expect(page.locator('.sf-espera')).toHaveCount(0)
      const tapados = await page
        .locator('.pf-head, .pf-servicios > *, .pf-prendas > *, [data-fotos] > li, .pf-promo')
        .evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length)
      expect(tapados, path).toBe(0)
    }
  })
})
