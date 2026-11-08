import { expect, test, type Page } from '@playwright/test'

// PRI-287, efectos elegidos del laboratorio: 1 foto que crece, 3 titular palabra por palabra, 7 rejilla que se reacomoda.
// Contra el catálogo real del build. Para ver un cuadro exacto de una animación se detiene con la API de animaciones, sin
// esperas: currentTime = 0 es el punto de partida.
const tiles = (page: Page) => page.locator('main a[data-foto]')
const dialog = (page: Page) => page.getByRole('dialog')
const marco = (page: Page) => dialog(page).locator('.mx-marco')
const chips = (page: Page) => page.getByRole('navigation', { name: 'Categorías' }).getByRole('link')
const SOLO_COMPOSITOR = ['transform', 'scale', 'opacity', 'clipPath']
const SIN_ANIMAR = ['offset', 'computedOffset', 'easing', 'composite']

type Caja = { x: number; y: number; w: number; h: number }
const caja = (r: DOMRect): Caja => ({ x: r.left, y: r.top, w: r.width, h: r.height })
const centro = (c: Caja) => ({ x: c.x + c.w / 2, y: c.y + c.h / 2 })

/** 2G como lo reporta el navegador: el script inline del Layout lo lee antes de pintar. */
const senalMala = (page: Page) =>
  page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', { value: { effectiveType: '2g', saveData: false, addEventListener() {} } })
  })

/** Cuenta las animaciones de vuelta que arrancan. */
const contarVueltas = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { vueltas: number }
    w.vueltas = 0
    document.addEventListener('animationstart', (e) => void ((e as AnimationEvent).animationName === 'mx-vuelve' && w.vueltas++), true)
  })
const vueltas = (page: Page) => page.evaluate(() => (window as unknown as { vueltas: number }).vueltas)

/** Abre la primera categoría con al menos 3 fotos. */
async function abrirCategoria(page: Page) {
  await page.goto('/products')
  for (let i = 1; i < (await chips(page).count()); i++) {
    if (Number(await chips(page).nth(i).locator('span').innerText()) < 3) continue
    await page.goto((await chips(page).nth(i).getAttribute('href'))!)
    return
  }
  throw new Error('No category with 3+ photos')
}

/** Toca la foto dentro de la página y mide en ese mismo cuadro: dónde arranca el marco y qué propiedades anima. */
const tocarYMedirSalida = (a: HTMLAnchorElement) => {
  const box = (e: Element) => {
    const r = e.getBoundingClientRect()
    return { x: r.left, y: r.top, w: r.width, h: r.height }
  }
  const foto = a.querySelector('img')!
  const tile = box(foto.parentElement!)
  a.click()
  const m = document.querySelector<HTMLElement>('dialog .mx-marco')!
  const anim = m.getAnimations().find((x) => (x as CSSAnimation).animationName === 'mx-crece')
  if (!anim) return null
  anim.pause()
  anim.currentTime = 0
  const out = {
    tile,
    marco: box(m),
    clip: getComputedStyle(m).clipPath,
    props: (anim.effect as KeyframeEffect).getKeyframes().flatMap((k) => Object.keys(k)),
    hueco: getComputedStyle(foto).opacity,
  }
  anim.play()
  return out
}

test.describe('1 · foto que crece', () => {
  test('the photo grows from its place on the wall, animating only transform and clip-path', async ({ page }) => {
    await abrirCategoria(page)
    const m = await tiles(page).nth(1).evaluate(tocarYMedirSalida)
    expect(m).not.toBeNull()
    // Cubre la caja de la foto y va recortado a ella: se ve igual a la del muro.
    expect(centro(m!.marco).x).toBeCloseTo(centro(m!.tile).x, 0)
    expect(centro(m!.marco).y).toBeCloseTo(centro(m!.tile).y, 0)
    expect(m!.marco.w).toBeGreaterThanOrEqual(m!.tile.w - 1)
    expect(m!.marco.h).toBeGreaterThanOrEqual(m!.tile.h - 1)
    expect(m!.clip).toContain('inset(')
    expect(m!.hueco).toBe('0')
    for (const p of m!.props) if (!SIN_ANIMAR.includes(p)) expect(SOLO_COMPOSITOR).toContain(p)
  })

  test('on Disponible ahora it grows from the photo, not from the whole card', async ({ page }) => {
    // PRI-123: 4232 has 4 real products switched on in "Disponible ahora" (e2e/promos/scenarios.mjs).
    await page.goto('http://localhost:4232/')
    const card = page.locator('.pf-prendas a[data-foto]').first()
    await card.scrollIntoViewIfNeeded()
    const m = await card.evaluate(tocarYMedirSalida)
    expect(m).not.toBeNull()
    expect(m!.marco.h).toBeGreaterThanOrEqual(m!.tile.h - 1)
    expect(centro(m!.marco).y).toBeCloseTo(centro(m!.tile).y, 0)
  })

  test('the thumbnail already downloaded goes under the big photo, with no wait', async ({ page }) => {
    await abrirCategoria(page)
    const tile = tiles(page).nth(1)
    const src = await tile.locator('img').evaluate((i: HTMLImageElement) => i.currentSrc)
    await tile.click()
    await expect(marco(page).locator('.mx-mini')).toHaveAttribute('src', src)
    await expect(marco(page).locator('.mx-brillo')).toBeHidden()
    // Al pasar de foto, esa miniatura ya no es de esta foto.
    await page.keyboard.press('ArrowRight')
    await expect(marco(page).locator('.mx-mini')).toHaveCount(0)
  })

  test('with the thumbnail not downloaded yet, the shimmer shows instead', async ({ page }) => {
    await page.route('**/*.webp', () => {})
    await page.goto('/products', { waitUntil: 'commit' })
    await tiles(page).first().click()
    await expect(marco(page).locator('.mx-mini')).toHaveCount(0)
    await expect(marco(page).locator('.mx-brillo')).toBeVisible()
  })

  test('closing goes back to its place, then the URL, the focus and the photo return', async ({ page }) => {
    await abrirCategoria(page)
    const base = page.url()
    await contarVueltas(page)
    const tile = tiles(page).nth(1)
    await tile.click()
    await expect(tile.locator('img')).toHaveCSS('opacity', '0')

    // Todo en el mismo cuadro: si la fuente termina de cargar, la página se corre un par de px.
    const fin = await tile.evaluate((a: HTMLAnchorElement) => {
      document.querySelector<HTMLElement>('dialog [data-mx="cerrar"]')!.click()
      const m = document.querySelector<HTMLElement>('dialog .mx-marco')!
      const anim = m.getAnimations().find((x) => (x as CSSAnimation).animationName === 'mx-vuelve')!
      anim.pause()
      anim.currentTime = Number(anim.effect!.getComputedTiming().endTime) - 1
      const r = m.getBoundingClientRect()
      const t = a.getBoundingClientRect()
      anim.play()
      return { abierto: (m.closest('dialog') as HTMLDialogElement).open, dx: r.left + r.width / 2 - (t.left + t.width / 2), dy: r.top + r.height / 2 - (t.top + t.height / 2) }
    })
    expect(fin.abierto).toBe(true)
    expect(Math.abs(fin.dx)).toBeLessThan(2)
    expect(Math.abs(fin.dy)).toBeLessThan(2)

    await expect(dialog(page)).toBeHidden()
    await expect(page).toHaveURL(base)
    await expect(tile).toBeFocused()
    await expect(tile.locator('img')).toHaveCSS('opacity', '1')
    await expect(marco(page).locator('.mx-mini')).toHaveCount(0)
  })

  test('Esc also goes back to its place', async ({ page }) => {
    await abrirCategoria(page)
    await contarVueltas(page)
    await tiles(page).nth(1).click()
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog(page)).toBeHidden()
    expect(await vueltas(page)).toBe(1)
  })

  test('after moving to another photo it goes back to that one, and every photo of the wall ends visible', async ({ page }) => {
    await abrirCategoria(page)
    await contarVueltas(page)
    await tiles(page).first().click()
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press('ArrowRight')
    await dialog(page).getByRole('button', { name: 'Cerrar' }).click()
    await expect(dialog(page)).toBeHidden()
    expect(await vueltas(page)).toBe(1)
    const tapadas = await page.locator('main a[data-foto] img').evaluateAll((is) => is.filter((i) => getComputedStyle(i).opacity !== '1').length)
    expect(tapadas).toBe(0)
  })

  test('if the photo is no longer on screen it closes straight away', async ({ page }) => {
    await abrirCategoria(page)
    await contarVueltas(page)
    await tiles(page).first().click()
    await expect(dialog(page)).toBeVisible()
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
    await dialog(page).getByRole('button', { name: 'Cerrar' }).click()
    await expect(dialog(page)).toBeHidden()
    expect(await vueltas(page)).toBe(0)
    await expect(tiles(page).first().locator('img')).toHaveCSS('opacity', '1')
  })

  test('closing while it is still opening does not get stuck', async ({ page }) => {
    await abrirCategoria(page)
    await tiles(page).nth(1).evaluate((a: HTMLAnchorElement) => {
      a.click()
      document.querySelector<HTMLElement>('dialog [data-mx="cerrar"]')!.click()
    })
    await expect(dialog(page)).toBeHidden()
    await expect(tiles(page).nth(1).locator('img')).toHaveCSS('opacity', '1')
  })

  test('reduced motion: opens and closes at once, without a hole in the wall', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await abrirCategoria(page)
    await contarVueltas(page)
    const m = await tiles(page).nth(1).evaluate(tocarYMedirSalida)
    expect(m).toBeNull()
    await expect(tiles(page).nth(1).locator('img')).toHaveCSS('opacity', '1')
    await dialog(page).getByRole('button', { name: 'Cerrar' }).click()
    await expect(dialog(page)).toBeHidden()
    expect(await vueltas(page)).toBe(0)
  })

  test('slow connection: opens and closes at once, and the thumbnail still saves the wait', async ({ page }) => {
    await senalMala(page)
    await abrirCategoria(page)
    await contarVueltas(page)
    const m = await tiles(page).nth(1).evaluate(tocarYMedirSalida)
    expect(m).toBeNull()
    await expect(marco(page).locator('.mx-mini')).toHaveCount(1)
    await dialog(page).getByRole('button', { name: 'Cerrar' }).click()
    await expect(dialog(page)).toBeHidden()
    expect(await vueltas(page)).toBe(0)
  })
})

test.describe('3 · titular palabra por palabra', () => {
  // PRI-413: el título de la portada lo edita el cliente; estos fijan el de hoy, en el build con tablas vacías.
  test.use({ baseURL: 'http://localhost:4232' })

  const TITULOS: [string, string | RegExp][] = [
    ['/', 'Bienvenido a Serflow'],
    ['/products', 'Catálogo'],
    ['/promos', /^Promos/],
    ['/esta-pagina-no-existe', 'Esta página no existe'],
    ['/personaliza', 'Diseña tu prenda'],
  ]

  for (const [path, nombre] of TITULOS) {
    test(`${path}: each word of the title rises in turn, with its accessible name intact`, async ({ page }) => {
      await page.goto(path)
      const h1 = page.getByRole('heading', { level: 1, name: nombre })
      await expect(h1).toBeVisible()
      const palabras = await h1.innerText()
      await expect(h1.locator('.sf-palabra')).toHaveCount(palabras.trim().split(/\s+/).length)
      const anim = await h1.locator('.sf-palabra > span').evaluateAll((els) =>
        els.map((e) => {
          const a = e.getAnimations()[0]
          return { delay: a?.effect!.getTiming().delay, props: a ? (a.effect as KeyframeEffect).getKeyframes().flatMap((k) => Object.keys(k)) : [] }
        }),
      )
      expect(anim[0].props).toContain('transform')
      for (const a of anim) for (const p of a.props) if (!SIN_ANIMAR.includes(p)) expect(SOLO_COMPOSITOR).toContain(p)
      for (let i = 1; i < anim.length; i++) expect(anim[i].delay!).toBeGreaterThan(anim[i - 1].delay!)
      // Las palabras se parten: nada se sale de la pantalla.
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  }

  test('the home title keeps its two approved lines', async ({ page }) => {
    await page.goto('/')
    const y = await page.locator('h1 .sf-palabra').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height && (e as HTMLElement).offsetTop))
    expect(y[1]).toBeGreaterThan(y[0])
    expect(y[2]).toBe(y[1])
  })

  test('the subtitle comes after the title and the home photo settles', async ({ page }) => {
    await page.goto('/')
    const titulo = page.locator('h1 .sf-palabra > span').first()
    const bajada = page.locator('.sf-bajada .sf-palabra > span').first()
    const retraso = (l: typeof titulo) => l.evaluate((e) => e.getAnimations()[0].effect!.getTiming().delay as number)
    expect(await retraso(bajada)).toBeGreaterThan(await retraso(titulo))
    const nombres = await page.locator('.hero-carousel figure img').first().evaluate((i) => i.getAnimations().map((a) => (a as CSSAnimation).animationName))
    expect(nombres).toContain('sf-asienta')
  })

  test('changing category: the new title rises, the subtitle (same text) does not animate again', async ({ page }) => {
    await page.goto('/products')
    await page.locator('.sf-bajada .sf-palabra > span').last().evaluate((s) => Promise.all(s.getAnimations().map((a) => a.finished)))
    // En el cuadro del cambio: con la bajada animando de nuevo, sus palabras arrancan escondidas.
    await page.evaluate(() => {
      document.addEventListener(
        'astro:after-swap',
        () => {
          ;(window as unknown as { cuadro: unknown }).cuadro = {
            bajada: [...document.querySelectorAll('.sf-bajada .sf-palabra > span')].map((s) => getComputedStyle(s).opacity),
            titulo: document.querySelector('h1 .sf-palabra > span')!.getAnimations().map((a) => a.playState),
          }
        },
        { once: true },
      )
    })
    const chip = chips(page).nth(1)
    const href = (await chip.getAttribute('href'))!
    await chip.click()
    await expect(page).toHaveURL(new RegExp(`${href}/?$`))
    const espera = await page.waitForFunction(() => (window as unknown as { cuadro?: { bajada: string[]; titulo: string[] } }).cuadro)
    const { bajada, titulo } = (await espera.jsonValue())!
    expect(titulo).toEqual(['running'])
    expect(bajada.length).toBeGreaterThan(0)
    for (const o of bajada) expect(o).toBe('1')
  })

  test('no other photo covers the home photo while it settles', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // En el instante de la carga, sin depender de cuánto tardó en llegar hasta aquí.
    const encima = await page.locator('.hero-carousel figure').evaluateAll((fs) =>
      fs.slice(1).map((f) => {
        const a = f.getAnimations()[0]
        a.pause()
        a.currentTime = 0
        return getComputedStyle(f).opacity
      }),
    )
    expect(encima.length).toBeGreaterThan(0)
    // Los keyframes van redondeados a 2 decimales: queda un resto que no se ve.
    for (const o of encima) expect(Number(o)).toBeLessThan(0.01)
  })

  test('reduced motion: the title is there from the start', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('h1 .sf-palabra > span').first()).toHaveCSS('animation-name', 'none')
    await expect(page.locator('h1 .sf-palabra > span').first()).toHaveCSS('transform', 'none')
  })

  test('slow connection: the title is there from the start', async ({ page }) => {
    await senalMala(page)
    await page.goto('/')
    await expect(page.locator('h1 .sf-palabra > span').first()).toHaveCSS('animation-name', 'none')
    await expect(page.locator('h1 .sf-palabra > span').first()).toHaveCSS('transform', 'none')
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('the title does not animate, it is just there', async ({ page }) => {
      for (const path of ['/', '/products']) {
        await page.goto(path)
        await expect(page.locator('h1 .sf-palabra > span').first()).toHaveCSS('animation-name', 'none')
        await expect(page.locator('h1')).toBeVisible()
      }
      await expect(page.locator('.sf-bajada .sf-palabra > span').first()).toHaveCSS('animation-name', 'none')
    })
  })
})

test.describe('7 · rejilla que se reacomoda', () => {
  // PRI-438: catálogo sembrado (e2e/promos/scenarios.mjs): con el real, qué foto viaja depende de lo que suba el admin.
  test.use({ baseURL: 'http://localhost:4239' })
  // A 1280x720 el banner llena la pantalla: el muro entra en pantalla solo con más alto.
  test.beforeEach(async ({ page, isMobile }) => {
    if (!isMobile) await page.setViewportSize({ width: 1280, height: 1000 })
  })

  /** La pestaña de la categoría de una foto en pantalla que no es la primera: al cambiar, esa foto tiene que viajar. */
  async function pestanaConViaje(page: Page) {
    const label = await page.evaluate(() => {
      const enPantalla = [...document.querySelectorAll<HTMLElement>('[data-fotos] > li > a')].filter((a) => a.getBoundingClientRect().top < innerHeight * 0.9)
      return JSON.parse(enPantalla[1].dataset.foto!).categoria as string
    })
    return chips(page).filter({ hasText: label }).first()
  }

  /** En el mismo cuadro del swap: cada foto animada, con su nombre de animación y su caja en el arranque. */
  const espiarSwap = (page: Page) =>
    page.evaluate(() => {
      const w = window as unknown as { sinRecarga: boolean; antes: Record<string, { x: number; y: number }>; salida: unknown[]; pseudos: number; capa: number }
      w.sinRecarga = true
      w.antes = {}
      document.querySelectorAll<HTMLElement>('[data-fotos] > li').forEach((li) => {
        const r = li.getBoundingClientRect()
        if (r.bottom > 0 && r.top < innerHeight) w.antes[li.querySelector('a')!.getAttribute('href')!] = { x: r.left, y: r.top }
      })
      document.addEventListener(
        'astro:after-swap',
        () => {
          w.salida = [...document.querySelectorAll<HTMLElement>('[data-fotos] > li')].flatMap((li) => {
            const anims = li.getAnimations()
            if (!anims.length) return []
            anims.forEach((a) => (a.pause(), (a.currentTime = 0)))
            const r = li.getBoundingClientRect()
            const out = {
              href: li.querySelector('a')!.getAttribute('href')!,
              nombre: (anims[0] as CSSAnimation).animationName,
              x: r.left,
              y: r.top,
              fin: 0,
              props: (anims[0].effect as KeyframeEffect).getKeyframes().flatMap((k) => Object.keys(k)),
            }
            anims.forEach((a) => a.play())
            return [out]
          })
          w.capa = document.querySelectorAll('.sf-salen > *').length
          requestAnimationFrame(() => {
            w.pseudos = document.getAnimations().filter((a) => (a.effect as KeyframeEffect).pseudoElement?.startsWith('::view-transition')).length
          })
        },
        { once: true },
      )
    })

  type Salida = { href: string; nombre: string; x: number; y: number; props: string[] }
  const leer = <T>(page: Page, k: string) => page.evaluate((key) => (window as unknown as Record<string, T>)[key], k)

  test('changing category: the photos travel from their old place, without reloading the page', async ({ page }) => {
    await page.goto('/products')
    await page.evaluate(() => document.fonts.ready)
    const chip = await pestanaConViaje(page)
    const href = (await chip.getAttribute('href'))!
    await espiarSwap(page)
    await chip.click()
    await expect(page).toHaveURL(new RegExp(`${href}/?$`))
    await expect.poll(() => leer<Salida[] | undefined>(page, 'salida')).toBeTruthy()

    expect(await leer<boolean>(page, 'sinRecarga')).toBe(true)
    await expect(page.locator('main[data-banner-index]')).toHaveAttribute('data-base', new RegExp(href))
    await expect(chip).toHaveAttribute('aria-current', 'page')

    const salida = (await leer<Salida[]>(page, 'salida'))!
    const antes = (await leer<Record<string, { x: number; y: number }>>(page, 'antes'))!
    const viajan = salida.filter((s) => s.nombre === 'sf-viaja')
    expect(viajan.length).toBeGreaterThan(0)
    for (const s of viajan) {
      expect(Math.abs(s.x - antes[s.href].x)).toBeLessThan(2)
      expect(Math.abs(s.y - antes[s.href].y)).toBeLessThan(2)
    }
    for (const s of salida) for (const p of s.props) if (!SIN_ANIMAR.includes(p)) expect(SOLO_COMPOSITOR).toContain(p)
    // Lo que no estaba en pantalla entra, no llega volando desde lejos.
    for (const s of salida.filter((s) => s.nombre !== 'sf-viaja')) expect(antes[s.href]).toBeUndefined()
    // Sin fundido de página encima de las fotos que viajan.
    await expect.poll(() => leer<number>(page, 'pseudos')).toBe(0)

    await expect(page.locator('[data-fotos] > li').first()).toHaveCSS('opacity', '1')
  })

  test('the photos that leave fade out on their old place and are gone', async ({ page }) => {
    await page.goto('/products')
    const chip = await pestanaConViaje(page)
    await espiarSwap(page)
    await chip.click()
    await expect.poll(() => leer<number | undefined>(page, 'capa')).toBeGreaterThan(0)
    await expect(page.locator('.sf-salen')).toHaveCount(0)
  })

  test('with the page scrolled, the photos that leave do not stay on top of the new title', async ({ page }) => {
    await page.goto('/products')
    const chip = await pestanaConViaje(page)
    await page.evaluate(() => {
      window.scrollTo({ top: 305, behavior: 'instant' })
      document.addEventListener('astro:before-swap', () => ((window as unknown as { scrollAlTocar: number }).scrollAlTocar = scrollY), { once: true })
    })
    await espiarSwap(page)
    await chip.click()
    await expect.poll(() => leer<number | undefined>(page, 'capa')).toBe(0)
    expect(await leer<number>(page, 'scrollAlTocar')).toBeGreaterThan(0)
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
    await expect(page.locator('[data-fotos] > li').first()).toHaveCSS('opacity', '1')
  })

  test('only what is on screen animates', async ({ page }) => {
    await page.goto('/products')
    await espiarSwap(page)
    await (await pestanaConViaje(page)).click()
    await expect.poll(() => leer<Salida[] | undefined>(page, 'salida')).toBeTruthy()
    const alto = page.viewportSize()!.height
    const salida = (await leer<Salida[]>(page, 'salida'))!
    const enPantalla = await page.locator('[data-fotos] > li').evaluateAll((els, h) => els.filter((e) => e.getBoundingClientRect().top < h).length, alto)
    expect(salida.length).toBeLessThanOrEqual(enPantalla)
    expect(salida.length).toBeLessThan(30)
  })

  test('the modal goes through the new wall, not the photos that are leaving', async ({ page }) => {
    await page.goto('/products')
    await (await pestanaConViaje(page)).click()
    await expect(page.locator('main[data-banner-index]')).not.toHaveAttribute('data-banner-index', '0')
    const n = await tiles(page).count()
    await tiles(page).first().click()
    await expect(dialog(page).locator('.mx-contador')).toHaveText(`1 / ${n}`)
  })

  test('two tabs in a row and going back leave the wall whole', async ({ page }) => {
    const errores: string[] = []
    page.on('pageerror', (e) => errores.push(e.message))
    await page.goto('/products')
    await chips(page).nth(1).click()
    await chips(page).nth(2).click()
    await expect(chips(page).nth(2)).toHaveAttribute('aria-current', 'page')
    await page.goBack()
    // Con latencia el segundo toque cancela el primero y Atrás vuelve a /products: a dónde vuelve lo decide el historial.
    await expect(chips(page).nth(2)).not.toHaveAttribute('aria-current', 'page')
    await expect(chips(page).and(page.locator('[aria-current="page"]'))).toHaveCount(1)
    await expect(page.locator('.sf-salen')).toHaveCount(0)
    await expect(page.locator('[data-fotos] > li').first()).toHaveCSS('opacity', '1')
    expect(errores).toEqual([])
  })

  test('with one tab already open before the next, Back returns to that tab', async ({ page }) => {
    await page.goto('/products')
    await chips(page).nth(1).click()
    await expect(chips(page).nth(1)).toHaveAttribute('aria-current', 'page')
    await chips(page).nth(2).click()
    await expect(chips(page).nth(2)).toHaveAttribute('aria-current', 'page')
    await page.goBack()
    await expect(chips(page).nth(1)).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('.sf-salen')).toHaveCount(0)
    await expect(page.locator('[data-fotos] > li').first()).toHaveCSS('opacity', '1')
  })

  test('below the fold the wall keeps its one-time reveal', async ({ page }) => {
    await page.goto('/products')
    await chips(page).nth(0).scrollIntoViewIfNeeded()
    await (await pestanaConViaje(page)).click()
    await expect(page.locator('main[data-banner-index]')).not.toHaveAttribute('data-banner-index', '0')
    const mal = await page.locator('[data-fotos] > li.sf-espera').evaluateAll((els) => els.filter((e) => (e as HTMLElement).getBoundingClientRect().top < innerHeight * 0.9 - 20).length)
    expect(mal).toBe(0)
  })

  test('layout cost: a tap with the biggest wall stays within budget', async ({ page }) => {
    await page.goto('/products')
    await page.evaluate(() => document.fonts.ready)
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Performance.enable')
    const layouts = async () => (await cdp.send('Performance.getMetrics')).metrics.find((m) => m.name === 'LayoutCount')!.value
    const chip = await pestanaConViaje(page)
    await espiarSwap(page)
    const antes = await layouts()
    await chip.click()
    await expect.poll(() => leer<Salida[] | undefined>(page, 'salida')).toBeTruthy()
    // Cambiar de página ya cuesta unos 18 (master). Las lecturas van en lote: no crece con las fotos que viajan.
    // El método del laboratorio, con las 91 fotos en el DOM, da de 110 a 140.
    expect((await layouts()) - antes).toBeLessThanOrEqual(32)
  })

  test('reduced motion: the category changes with no photo traveling', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/products')
    await chips(page).nth(1).click()
    await expect(chips(page).nth(1)).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('li.sf-viaja, li.sf-llega, .sf-salen')).toHaveCount(0)
  })

  test('slow connection: the category changes with no photo traveling', async ({ page }) => {
    await senalMala(page)
    await page.goto('/products')
    await chips(page).nth(1).click()
    await expect(chips(page).nth(1)).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('li.sf-viaja, li.sf-llega, .sf-salen, .sf-espera')).toHaveCount(0)
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('the tabs are plain links and the wall is simply there', async ({ page }) => {
      await page.goto('/products')
      const href = (await chips(page).nth(1).getAttribute('href'))!
      await chips(page).nth(1).click()
      await expect(page).toHaveURL(new RegExp(`${href}/?$`))
      await expect(chips(page).nth(1)).toHaveAttribute('aria-current', 'page')
      await expect(page.locator('[data-fotos] > li').first()).toHaveCSS('opacity', '1')
    })
  })
})
