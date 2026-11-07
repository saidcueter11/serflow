import { expect, test, type Page } from '@playwright/test'

// PRI-413: contenido editable. Builds sembrados por e2e/promos/server.mjs, sin escribir en la base.
const SITE = { vacio: 'http://localhost:4232', contenido: 'http://localhost:4235', malo: 'http://localhost:4236' }

const WA_HOY = 'https://wa.me/573156481243?text=Hola!%20Quiero%20m%C3%A1s%20informaci%C3%B3n'

const DESCRIPCION_DE_HOY = 'Serflow en Cartagena: camisetas y gorras con estampado, DTF y bordado. Ven al taller en el Mercado Bazurto o escríbenos por WhatsApp.'

const jsonLdDe = async (page: Page) => JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)

// El contenido de hoy, escrito a mano: si alguien cambia un respaldo del código, esto se pone rojo.
async function expectContenidoDeHoy(page: Page) {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1, name: 'Bienvenido a Serflow' })).toBeVisible()
  await expect(page.locator('.pf-hero-texto .pf-pie')).toHaveText('Mercado Bazurto · Cartagena')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', DESCRIPCION_DE_HOY)
  await expect(page.getByText('Camisetas y gorras con tu logo, tu equipo o tu idea. Estampado, DTF y bordado hechos en nuestro taller.')).toBeVisible()
  const hero = page.locator('.hero-carousel figure img')
  await expect(hero).toHaveCount(4)
  await expect(hero.first()).toHaveAttribute('alt', 'Dos personas con camisetas negras estampadas')

  await expect(page.locator('#personaliza-titulo')).toHaveText('Diseña la tuya')
  await expect(page.getByText('Sube tu diseño, míralo sobre la camiseta o la gorra y mándanoslo listo para hacerlo.')).toBeVisible()
  await expect(page.locator('.pf-pz-foto img').first()).toHaveAttribute('alt', 'Gorras personalizadas en un estante del taller')

  await expect(page.locator('#que-hacemos-titulo')).toHaveText('Qué hacemos')
  await expect(page.getByText('Camisetas y gorras, con la técnica que mejor le quede a tu diseño.')).toBeVisible()
  await expect(page.locator('.pf-servicios h3')).toHaveText(['Estampado', 'DTF', 'Bordado'])
  await expect(page.locator('.pf-servicios p')).toHaveText([
    'Mate, toma la textura de la tela. Ideal para camisetas.',
    'Colores vivos y con brillo. Fotos y degradados.',
    'Hilo con relieve. El clásico de las gorras.',
  ])
  await expect(page.locator('.pf-servicios img')).toHaveCount(3)

  await expect(page.locator('#disponible-titulo')).toHaveText('Disponible ahora')
  await expect(page.getByText('Lo que hay en el taller esta semana.')).toBeVisible()

  await expect(page.locator('#quienes-somos-titulo')).toHaveText('Quiénes somos')
  await expect(page.locator('.pf-quienes > p')).toHaveText(
    'Somos un taller en Cartagena que hace prendas personalizadas. La ropa no solo se usa, se vive: por eso cada pieza lleva algo tuyo.',
  )
  await expect(page.locator('.pf-razones h3')).toHaveText(['A tu gusto', 'Acabados que duran', 'Atención directa'])
  await expect(page.locator('.pf-razones p').first()).toHaveText('Cada prenda sale de tu idea. Nada genérico.')

  const visita = page.locator('#visitanos')
  await expect(visita.locator('h2')).toHaveText('Visítanos')
  await expect(visita.getByText('Mercado Bazurto, C.C. Bazurtico, local 31')).toBeVisible()
  await expect(visita.locator('dt')).toHaveText(['Lunes a sábado', 'Domingo y festivos'])
  await expect(visita.locator('dd')).toHaveText(['8 a.m. – 6 p.m.', '8 a.m. – 2 p.m.'])
  await expect(visita.getByRole('link', { name: 'Cómo llegar' })).toHaveAttribute(
    'href',
    'https://www.google.com/maps/search/?api=1&query=Serflow%2C%20Centro%20Comercial%20Bazurtico%20local%2031%2C%20Mercado%20Bazurto%2C%20Cartagena',
  )
  await expect(visita.locator('iframe')).toHaveAttribute('src', /^https:\/\/www\.google\.com\/maps\/embed\?pb=.*0x3b6e98a99be2e1de/)

  await expect(page.locator('main a[href*="wa.me"]')).toHaveAttribute('href', WA_HOY)
  await expect(page.getByLabel('Escríbenos por WhatsApp')).toHaveAttribute('href', WA_HOY)

  const pie = page.locator('footer')
  await expect(pie.getByRole('link', { name: 'distribuidoraelmayorista@hotmail.com' })).toHaveAttribute('href', 'mailto:distribuidoraelmayorista@hotmail.com')
  await expect(pie.getByLabel('Serflow en Instagram')).toHaveAttribute('href', 'https://www.instagram.com/serflow_serflow/')
  await expect(pie.getByLabel('Serflow en TikTok')).toHaveAttribute('href', 'https://www.tiktok.com/@serflow4')
  await expect(pie.getByLabel('Serflow en Facebook')).toHaveAttribute('href', 'https://www.facebook.com/people/Serflow/100054522471881/')

  const schema = await jsonLdDe(page)
  expect(schema.telephone).toBe('+57 315 648 1243')
  expect(schema.address.streetAddress).toBe('Mercado Bazurto, C.C. Bazurtico, local 31')
  expect(schema.openingHoursSpecification).toHaveLength(2)
  expect(schema.description).toBe(DESCRIPCION_DE_HOY)
}

// PRI-423: los escenarios siembran una foto de otro proyecto de Supabase en cada camino. Si el build intentara bajarla, ni
// siquiera termina: ese host no existe. Aquí se comprueba que tampoco se publica un link a ella.
test('a photo from another Supabase project is neither downloaded nor published', async ({ request }) => {
  const paginas = [`${SITE.vacio}/products/e2e-vacia`, 'http://localhost:4233/promos/e2e-2x1-gorras', `${SITE.contenido}/`]
  for (const url of paginas) {
    const res = await request.get(url)
    expect(res.ok(), url).toBe(true)
    expect(await res.text(), url).not.toContain('e2e-proyecto-ajeno')
  }
})

test.describe('contenido vacío', () => {
  test.use({ baseURL: SITE.vacio })

  test('merging changes nothing visible: the site shows today’s content', async ({ page }) => {
    await expectContenidoDeHoy(page)
  })

  test('orders keep going to today’s number outside the home too', async ({ page }) => {
    await page.goto('/promos')
    await expect(page.getByRole('link', { name: 'Pregunta por WhatsApp' })).toHaveAttribute('href', /^https:\/\/wa\.me\/573156481243\?/)
  })
})

test.describe('datos inválidos', () => {
  test.use({ baseURL: SITE.malo })

  test('the build passes and the site is the same as with no data', async ({ page }) => {
    await expectContenidoDeHoy(page)
  })
})

test.describe('contenido editado', () => {
  test.use({ baseURL: SITE.contenido })

  test('hero: photos by sort_order, optimized, without the bad ones', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Hola Cartagena' })).toBeVisible()
    await expect(page.getByText('Lema de prueba del hero.')).toBeVisible()

    const fotos = page.locator('.hero-carousel figure img')
    await expect(fotos).toHaveCount(2)
    await expect(fotos.first()).toHaveAttribute('alt', 'Primera')
    await expect(fotos.nth(1)).toHaveAttribute('alt', 'Segunda')
    await expect(fotos.first()).toHaveCSS('object-position', '50% 20%')
    for (const foto of await fotos.all()) {
      await expect(foto).toHaveAttribute('src', /^\/_astro\/.*\.webp$/)
      await expect(foto).toHaveAttribute('srcset', /640w/)
    }
    // La primera foto (el LCP) se precarga, con el mismo srcset.
    const preload = page.locator(`link[rel=preload][as=image][href="${await fotos.first().getAttribute('src')}"]`)
    await expect(preload).toHaveAttribute('imagesrcset', /640w/)
  })

  test('sections: title and description; a blank field uses the code on its own', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#personaliza-titulo')).toHaveText('Hazla tú')
    await expect(page.getByText('Texto de prueba del personalizador.')).toBeVisible()
    await expect(page.getByText('Descripción de prueba de los servicios.')).toBeVisible()
    await expect(page.locator('#disponible-titulo')).toHaveText('Para llevar')
    await expect(page.getByText('Lo que hay en el taller esta semana.')).toBeVisible()
    // En desktop el título que se ve es el de la tarjeta del mapa.
    await expect(page.locator('#visitanos').getByText('Ven al taller').filter({ visible: true })).toHaveCount(1)
    await expect(page.locator('#visitanos').getByText('Visítanos')).toHaveCount(0)
  })

  test('Quiénes somos: text and reasons by sort_order', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#quienes-somos-titulo')).toHaveText('El taller')
    await expect(page.locator('.pf-quienes > p')).toHaveText('Texto de prueba de quiénes somos.')
    await expect(page.locator('.pf-razones h3')).toHaveText(['Razón 1', 'Razón 2'])
    await expect(page.locator('.pf-razones p')).toHaveText(['Copy 1', 'Copy 2'])
  })

  test('user text is escaped, never HTML', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#que-hacemos-titulo')).toHaveText('<img src=x onerror="window.__xss=1">Hola & <b>chao</b>')
    await expect(page.locator('#que-hacemos-titulo img, #que-hacemos-titulo b')).toHaveCount(0)
    // Con una palabra muy larga, el título se parte en vez de salirse de la pantalla.
    expect(await page.locator('#que-hacemos-titulo').evaluate((h) => h.scrollWidth <= h.clientWidth)).toBe(true)
    expect(await page.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined()
    // Una dirección con </script> no cierra el JSON-LD: se sigue leyendo como JSON y dice lo mismo.
    expect((await jsonLdDe(page)).address.streetAddress).toBe('Calle de prueba 1 </script><script>window.__xss=1</script>')
  })

  test('hero label and search description: edited and escaped; the description stays on the home only', async ({ page }) => {
    const XSS = '<img src=x onerror="window.__xss=1">Hola & <b>chao</b>'
    await page.goto('/')
    const etiqueta = page.locator('.pf-hero-texto .pf-pie')
    await expect(etiqueta).toHaveText(XSS)
    await expect(etiqueta.locator('img, b')).toHaveCount(0)
    for (const meta of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      await expect(page.locator(meta)).toHaveAttribute('content', `Descripción de prueba ${XSS}`)
    }
    expect((await jsonLdDe(page)).description).toBe(`Descripción de prueba ${XSS}`)
    expect(await page.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined()

    // Con una palabra muy larga, la etiqueta se parte en vez de salirse de la pantalla.
    await etiqueta.evaluate((el) => { el.lastChild!.textContent = 'W'.repeat(60) })
    const caja = (await etiqueta.boundingBox())!
    expect(caja.x + caja.width).toBeLessThanOrEqual(page.viewportSize()!.width)
    expect(await etiqueta.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)

    await page.goto('/personaliza')
    await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content', /Descripción de prueba/)
  })

  test('business data reaches every link built from it', async ({ page, request }) => {
    await page.goto('/')
    const wa = 'https://wa.me/573001112233?text=Hola!%20Quiero%20m%C3%A1s%20informaci%C3%B3n'
    await expect(page.locator('main a[href*="wa.me"]')).toHaveAttribute('href', wa)
    await expect(page.getByLabel('Escríbenos por WhatsApp')).toHaveAttribute('href', wa)

    const visita = page.locator('#visitanos')
    await expect(visita.getByText('Calle de prueba 1')).toBeVisible()
    await expect(visita.locator('dt')).toHaveText(['Toda la semana'])
    await expect(visita.locator('dd')).toHaveText(['9 a.m. a 5 p.m.'])
    await expect(visita.getByRole('link', { name: 'Cómo llegar' })).toHaveAttribute('href', 'https://www.google.com/maps/search/?api=1&query=e2e')
    await expect(visita.locator('iframe')).toHaveAttribute('src', 'https://www.google.com/maps/embed?pb=e2e')

    const pie = page.locator('footer')
    await expect(pie.getByRole('link', { name: 'taller@serflow.example' })).toHaveAttribute('href', 'mailto:taller@serflow.example')
    await expect(pie.getByLabel('Serflow en Instagram')).toHaveAttribute('href', 'https://www.instagram.com/e2e/')
    await expect(pie.getByLabel('Serflow en TikTok')).toHaveAttribute('href', 'https://www.tiktok.com/@e2e')
    await expect(pie.getByLabel('Serflow en Facebook')).toHaveAttribute('href', 'https://www.facebook.com/e2e')

    const schema = await jsonLdDe(page)
    expect(schema.telephone).toBe('+57 300 111 2233')
    expect(schema.email).toBe('taller@serflow.example')
    expect(schema.sameAs).toContain('https://www.instagram.com/e2e/')
    // Los horarios editados son texto libre: mejor sin horas exactas en el JSON-LD que con las viejas.
    expect(schema.openingHoursSpecification).toBeUndefined()

    // El catálogo y las promos arman sus links con el número nuevo; el viejo no queda en ninguna parte.
    const categoria = await page.getByRole('link', { name: 'Ver todo →' }).first().getAttribute('href')
    for (const path of ['/', '/promos', categoria!]) {
      const html = await (await request.get(path)).text()
      expect(html, path).toContain('573001112233')
      expect(html, path).not.toContain('573156481243')
    }
  })

  test('the personalizer island also orders to the new number', async ({ page }) => {
    await page.goto('/personaliza')
    await expect(page.getByText('Tu diseño va aquí')).toBeVisible({ timeout: 15_000 })
    const scripts = await page.locator('astro-island').evaluateAll((islas) => islas.map((i) => i.getAttribute('component-url')!))
    const chunks = new Set<string>()
    const pendientes = [...scripts]
    while (pendientes.length) {
      const url = pendientes.pop()!
      if (chunks.has(url)) continue
      chunks.add(url)
      const js = await (await page.request.get(url)).text()
      for (const m of js.matchAll(/["'](\.{1,2}\/[^"']+\.js)["']/g)) pendientes.push(new URL(m[1], new URL(url, page.url())).pathname)
      if (js.includes('573001112233')) return
      expect(js, url).not.toContain('573156481243')
    }
    throw new Error('The personalizer bundle does not carry the new number')
  })

  test('Qué hacemos: 6 cards at most, in order; a bad photo keeps the card without photo', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.pf-servicios h3')).toHaveText(['Servicio 1', 'Servicio 2', 'Servicio 3', 'Servicio 4', 'Servicio 5', 'Servicio 6'])
    await expect(page.locator('.pf-servicios img')).toHaveCount(5)
    await expect(page.locator('.pf-servicios img').first()).toHaveAttribute('alt', 'Foto 1')
    await expect(page.locator('.pf-servicios img').first()).toHaveAttribute('src', /^\/_astro\/.*\.webp$/)
    await expect(page.locator('.pf-servicios img').first()).toHaveAttribute('srcset', /320w/)
  })

  // Filas esperadas en desktop por cantidad de tarjetas. La rejilla es CSS: basta quitar tarjetas de la página.
  const FILAS: Record<number, number[]> = { 6: [3, 3], 5: [3, 2], 4: [4], 3: [3], 2: [2] }

  for (const [n, filas] of Object.entries(FILAS)) {
    test(`Qué hacemos looks right with ${n} cards`, async ({ page, isMobile }) => {
      await page.goto('/')
      const rejilla = page.locator('.pf-servicios')
      await rejilla.evaluate((el, n) => [...el.children].slice(n).forEach((c) => c.remove()), Number(n))
      const cajas = (await rejilla.locator('> *').evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect()
          return { x: r.x, y: r.y, abajo: r.bottom, derecha: r.right, ancho: r.width }
        }),
      ))
      const contenedor = (await rejilla.boundingBox())!
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

      if (isMobile) {
        // Celular: filas foto + texto, una debajo de otra.
        for (const c of cajas) expect(c.ancho).toBeCloseTo(contenedor.width, 0)
        return
      }
      let i = 0
      for (const cuantas of filas) {
        const fila = cajas.slice(i, i + cuantas)
        // Aire entre filas: el texto de una tarjeta no queda pegado a la foto de la siguiente.
        if (i > 0) expect(fila[0].y - cajas[i - 1].abajo).toBeGreaterThanOrEqual(24)
        i += cuantas
        expect(new Set(fila.map((c) => Math.round(c.y))).size).toBe(1)
        // Cada fila va de borde a borde de la rejilla, sin huecos.
        expect(Math.abs(fila[0].x - contenedor.x)).toBeLessThan(2)
        expect(Math.abs(fila[cuantas - 1].derecha - (contenedor.x + contenedor.width))).toBeLessThan(2)
      }
      expect(i).toBe(cajas.length)
      // Las filas de una misma rejilla casi no cambian de altura de foto.
      const fotos = await rejilla.locator('img').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))
      if (filas.length > 1) expect(Math.max(...fotos) - Math.min(...fotos)).toBeLessThan(16)
    })
  }
})

test('the real build shows a valid home and a valid WhatsApp link, whatever the database holds', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('.hero-carousel figure img').first()).toBeVisible()
  await expect(page.getByLabel('Escríbenos por WhatsApp')).toHaveAttribute('href', /^https:\/\/wa\.me\/573\d{9}\?text=/)
})
