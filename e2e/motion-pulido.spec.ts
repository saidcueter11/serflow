import { expect, test, type Page } from '@playwright/test'

// PRI-556: pulido del motion que ya existe (informe de motion de PRI-551, P1 y P2): brillo de la S, banner del catálogo,
// foto que crece hasta la ficha, visor, lupa, velo del modal y entrada de la ficha. Contra el catálogo real del build:
// entra por las fotos y las pestañas, sin slugs fijos.

const chips = (page: Page) => page.getByRole('navigation', { name: 'Categorías' }).getByRole('link')
const foto = (page: Page) => page.locator('[data-galeria] .gp-foto').first()

/** Fotos con latencia (sin tocar su contenido): así se ve lo que pasa mientras bajan, como con la red de un cliente. */
const fotosLentas = (page: Page, ms: number) =>
  page.route(/\.(webp|avif|jpe?g|png)(\?|$)/, async (route) => {
    await new Promise((r) => setTimeout(r, ms))
    await route.continue()
  })

/** La ficha de la primera foto del muro, ya con la foto de la galería bajada. */
async function irAFicha(page: Page) {
  await page.goto('/catalogo')
  await page.goto((await page.locator('main [data-fotos] a').first().getAttribute('href'))!)
  await expect(foto(page).locator('img')).toHaveJSProperty('complete', true)
}

test('the S shine moves a layer with transform, not background-position, and does not widen the page', async ({ page }) => {
  await irAFicha(page)
  const brillo = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => (a as CSSAnimation).animationName === 'sf-monograma')
      .map((a) => {
        const e = a.effect as KeyframeEffect
        const props = e.getKeyframes().flatMap((k) => Object.keys(k).filter((p) => !['offset', 'computedOffset', 'easing', 'composite'].includes(p)))
        return { capa: e.pseudoElement, props: [...new Set(props)] }
      }),
  )
  expect(brillo).toEqual([{ capa: '::before', props: ['transform'] }])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

test('changing category: the banner never shows a slide without its photo', async ({ page }) => {
  await fotosLentas(page, 300)
  await page.goto('/catalogo')
  await expect(page.locator('[data-banner-slide] img').first()).toBeAttached()
  // Cada cuadro: las láminas que se ven dentro del marco tienen su foto lista (o no tienen portada: la trama).
  await page.evaluate(() => {
    const w = window as unknown as { vacios: number; cuadros: number }
    w.vacios = 0
    w.cuadros = 0
    const mirar = () => {
      const marco = document.querySelector('[data-banner-track]')!.parentElement!.getBoundingClientRect()
      const enMarco = [...document.querySelectorAll<HTMLElement>('[data-banner-slide]')].filter((s) => {
        const r = s.getBoundingClientRect()
        return r.width > 0 && r.right > marco.left + 1 && r.left < marco.right - 1
      })
      const vacia = (s: HTMLElement) => {
        const img = s.querySelector('img')
        return !!img && !(img.complete && img.naturalWidth > 0)
      }
      w.cuadros++
      if (!enMarco.length || enMarco.some(vacia)) w.vacios++
      requestAnimationFrame(mirar)
    }
    requestAnimationFrame(mirar)
  })
  // La última pestaña con portada: la más lejos de la primera.
  const n = await chips(page).count()
  await chips(page).nth(n - 1).click()
  await expect(chips(page).nth(n - 1)).toHaveAttribute('aria-current', 'page')
  // Terminó cuando la lámina de la categoría nueva es la única que se ve.
  const i = Number(await page.locator('main[data-banner-index]').getAttribute('data-banner-index'))
  await expect(page.locator('[data-banner-slide]').nth(i)).toBeVisible()
  await expect(page.locator('[data-banner-slide]:not([hidden])')).toHaveCount(1)
  const { vacios, cuadros } = await page.evaluate(() => {
    const w = window as unknown as { vacios: number; cuadros: number }
    return { vacios: w.vacios, cuadros: w.cuadros }
  })
  expect(cuadros).toBeGreaterThan(5)
  expect(vacios).toBe(0)
})

type Viaje = { sale?: string[] | null; llegaLista?: boolean; viaja?: boolean; saleSeFunde?: boolean; mezcla?: string }

/** Toca la primera foto del muro y anota qué viaja hasta la ficha y cómo. */
async function tocarFotoDelMuro(page: Page): Promise<Viaje> {
  await page.goto('/catalogo')
  const tile = page.locator('main [data-fotos] a').first()
  await expect(tile.locator('img')).toHaveJSProperty('complete', true)
  await page.evaluate(() => {
    const w = window as unknown as { viaje: Viaje }
    w.viaje = {}
    const nombrada = () => [...document.querySelectorAll<HTMLElement>('*')].find((e) => e.style.viewTransitionName === 'foto-ficha')
    document.addEventListener(
      'astro:before-swap',
      () => {
        const el = nombrada()
        // Solo la foto: ni la etiqueta de la categoría ni la flecha del muro.
        w.viaje.sale = el ? [...el.children].map((c) => c.tagName) : null
      },
      { once: true },
    )
    document.addEventListener(
      'astro:after-swap',
      () => {
        // La foto de llegada ya bajó cuando se toma su imagen.
        w.viaje.llegaLista = document.querySelector<HTMLImageElement>('.gp-foto img')?.complete
        requestAnimationFrame(() => {
          const pseudo = (a: Animation) => (a.effect as KeyframeEffect).pseudoElement ?? ''
          w.viaje.viaja = document.getAnimations().some((a) => pseudo(a) === '::view-transition-group(foto-ficha)')
          w.viaje.saleSeFunde = document.getAnimations().some((a) => pseudo(a) === '::view-transition-old(foto-ficha)')
          w.viaje.mezcla = getComputedStyle(document.documentElement, '::view-transition-new(foto-ficha)').mixBlendMode
        })
      },
      { once: true },
    )
  })
  await tile.click()
  await expect(foto(page)).toBeVisible()
  await expect.poll(() => page.evaluate(() => (window as unknown as { viaje: Viaje }).viaje.mezcla)).toBeTruthy()
  return page.evaluate(() => (window as unknown as { viaje: Viaje }).viaje)
}

test('the photo that grows into the product page: only the photo travels, onto its arrival photo, without fading to dark', async ({ page }) => {
  expect(await tocarFotoDelMuro(page)).toEqual({ sale: ['IMG'], llegaLista: true, viaja: true, saleSeFunde: false, mezcla: 'normal' })
})

test('the arrival photo does not make it in time: no photo travels, so none fades to dark', async ({ page }) => {
  // Más que ESPERA_FOTO (movimiento.ts): la navegación no se frena por la foto y la página entra sin viaje.
  await fotosLentas(page, 800)
  const viaje = await tocarFotoDelMuro(page)
  expect(viaje).toMatchObject({ sale: null, llegaLista: false, viaja: false })
})

test('desktop: the viewer opens with the photo already showing', async ({ page, isMobile }) => {
  test.skip(isMobile, 'En el celular la foto ya entraba creciendo apenas abría.')
  await fotosLentas(page, 200)
  await irAFicha(page)
  const lista = await page.evaluate(
    () =>
      new Promise<boolean>((r) => {
        document.querySelector<HTMLElement>('.gp-foto')!.click()
        requestAnimationFrame(() => {
          const img = document.querySelector<HTMLImageElement>('.vf-foto')!
          r(img.complete && img.naturalWidth > 0)
        })
      }),
  )
  expect(lista).toBe(true)
  await expect(page.locator('dialog[data-visor]')).toBeVisible()
})

test('desktop: moving the magnifier does not shift the layout (CLS 0)', async ({ page, isMobile }) => {
  test.skip(isMobile, 'La lupa al lado es del mouse.')
  await irAFicha(page)
  await page.evaluate(() => {
    const w = window as unknown as { cls: number }
    w.cls = 0
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (w.cls += (e as unknown as { value: number }).value))).observe({ type: 'layout-shift' })
  })
  const caja = (await foto(page).boundingBox())!
  await page.mouse.move(caja.x + caja.width * 0.2, caja.y + caja.height * 0.2)
  await expect(page.locator('.lupa')).toBeVisible()
  await page.mouse.move(caja.x + caja.width * 0.8, caja.y + caja.height * 0.8, { steps: 20 })
  await page.mouse.move(caja.x + caja.width * 0.3, caja.y + caja.height * 0.7, { steps: 20 })
  expect(await page.evaluate(() => (window as unknown as { cls: number }).cls)).toBe(0)
})

test('the photo modal veil has no backdrop blur', async ({ page }) => {
  await page.goto('/')
  const filtro = await page.evaluate(() => {
    const velo = Object.assign(document.createElement('div'), { className: 'mx-velo' })
    document.body.append(velo)
    return getComputedStyle(velo).backdropFilter
  })
  expect(filtro).toBe('none')
})

test('product page: the name arrives first and the S does not enter with it', async ({ page }) => {
  await irAFicha(page)
  const entrada = await page.evaluate(() => {
    const h1 = document.querySelector('h1')!
    const demora = (el: Element) => parseFloat(getComputedStyle(el).animationDelay)
    const siguen = [...h1.parentElement!.children].slice([...h1.parentElement!.children].indexOf(h1) + 1)
    return {
      nombre: demora(h1),
      antes: siguen.filter((el) => demora(el) < demora(h1)).map((el) => el.tagName),
      s: getComputedStyle(document.querySelector('.monograma')!).animationName,
    }
  })
  expect(entrada).toEqual({ nombre: expect.any(Number), antes: [], s: 'none' })
})

test('reduced motion: nothing animates on the product page and the banner switches without fading', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await irAFicha(page)
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
  await page.goto('/catalogo')
  await chips(page).nth(1).click()
  await expect(chips(page).nth(1)).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('[data-banner-slide]:not([hidden])')).toHaveCount(1)
  await expect(page.locator('[data-banner-slide][data-llega]')).toHaveCount(0)
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
})
