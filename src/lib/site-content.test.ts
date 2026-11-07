import { describe, expect, it, vi } from 'vitest'

const respuesta: { data: unknown; error: unknown } = { data: [], error: null }
vi.mock('./supabase', () => ({
  supabase: {
    from: () => {
      const q: Record<string, unknown> = { then: (resolve: (r: typeof respuesta) => unknown) => resolve(respuesta) }
      for (const m of ['select', 'eq']) q[m] = () => q
      return q
    },
  },
}))

const { cleanPosition, getSiteContent, parseHeroSlides, parseReasons, parseSections, parseServices } = await import('./site-content')

const FOTO = 'https://abc.supabase.co/storage/v1/object/public/site-media/foto.webp'

describe('cleanPosition', () => {
  it('only takes "x% y%", so nothing else reaches the style', () => {
    expect(cleanPosition('50% 35%')).toBe('50% 35%')
    expect(cleanPosition('100% 0%')).toBe('100% 0%')
    for (const bad of ['101% 0%', '50%', 'url(x)', '50% 35%; color:red', null]) expect(cleanPosition(bad)).toBeUndefined()
  })
})

describe('parseSections', () => {
  it('each blank or too long field stays empty on its own; unknown slugs are ignored', () => {
    expect(
      parseSections([
        { slug: 'que-hacemos', title: ' Lo nuestro ', description: '   ' },
        { slug: 'disponible', title: 'x'.repeat(81), description: 'Hoy en el taller' },
        { slug: 'otra', title: 'No existe' },
      ]),
    ).toEqual({
      'que-hacemos': { title: 'Lo nuestro', description: undefined },
      disponible: { title: undefined, description: 'Hoy en el taller' },
    })
  })

  it('hero label up to 60 and search description up to 160; blank or longer use the code', () => {
    expect(parseSections([{ slug: 'hero', eyebrow: ' Barranquilla ', seo_description: 'x'.repeat(160) }]).hero).toMatchObject({
      eyebrow: 'Barranquilla',
      seoDescription: 'x'.repeat(160),
    })
    expect(parseSections([{ slug: 'hero', eyebrow: 'x'.repeat(61), seo_description: 'x'.repeat(161) }]).hero).toMatchObject({
      eyebrow: undefined,
      seoDescription: undefined,
    })
    expect(parseSections([{ slug: 'hero', eyebrow: '   ', seo_description: null }]).hero).toMatchObject({
      eyebrow: undefined,
      seoDescription: undefined,
    })
  })
})

describe('parseHeroSlides', () => {
  it('orders by sort_order, drops rows without photo and caps at 6', () => {
    const rows = [
      { image_url: `${FOTO}?2`, alt: 'Dos', sort_order: 2, object_position: 'mal' },
      { image_url: `${FOTO}?1`, alt: 'Uno', sort_order: 1, object_position: '50% 20%' },
      { image_url: null, alt: 'Sin foto', sort_order: 0 },
    ]
    expect(parseHeroSlides(rows)).toEqual([
      { image_url: `${FOTO}?1`, alt: 'Uno', position: '50% 20%' },
      { image_url: `${FOTO}?2`, alt: 'Dos', position: undefined },
    ])
    expect(parseHeroSlides(Array.from({ length: 9 }, (_, i) => ({ image_url: `${FOTO}?${i}`, sort_order: i })))).toHaveLength(6)
  })

  it('a slide without alt gets a generic one', () => {
    expect(parseHeroSlides([{ image_url: FOTO }])[0].alt).toBe('Trabajo de Serflow')
  })
})

describe('parseServices', () => {
  const card = (i: number, over = {}) => ({ title: `T${i}`, description: `D${i}`, image_url: FOTO, sort_order: i, ...over })

  it('orders, and caps at 6', () => {
    const parsed = parseServices([card(3), card(1), card(2), card(4), card(5), card(6), card(7)])
    expect(parsed.map((c) => c.title)).toEqual(['T1', 'T2', 'T3', 'T4', 'T5', 'T6'])
  })

  it('a card without valid text is dropped; with fewer than 2 left, the code list stays', () => {
    expect(parseServices([card(1), card(2, { title: ' ' })])).toEqual([])
    expect(parseServices([card(1)])).toEqual([])
    expect(parseServices([])).toEqual([])
  })

  it('a card without photo stays, and the alt falls back to the title', () => {
    const [first] = parseServices([card(1, { image_url: null }), card(2)])
    expect(first).toEqual({ title: 'T1', description: 'D1', image_url: undefined, image_alt: 'T1' })
  })
})

describe('parseReasons', () => {
  it('orders, drops incomplete ones and caps at 6', () => {
    const rows = Array.from({ length: 8 }, (_, i) => ({ title: `T${i}`, description: `C${i}`, sort_order: 8 - i }))
    expect(parseReasons(rows)).toHaveLength(6)
    expect(parseReasons(rows)[0]).toEqual({ title: 'T7', copy: 'C7' })
    expect(parseReasons([{ title: 'Solo título', description: '' }])).toEqual([])
  })
})

describe('getSiteContent', () => {
  it('a table that does not exist yet counts as empty', async () => {
    respuesta.data = null
    respuesta.error = { code: 'PGRST205', message: 'no existe' }
    await expect(getSiteContent()).resolves.toEqual({ sections: {}, heroSlides: [], services: [], reasons: [] })
  })

  it('any other read failure fails the build, like products.ts: the published site stays', async () => {
    respuesta.data = null
    respuesta.error = { code: '500', message: 'caída' }
    await expect(getSiteContent()).rejects.toThrow(/caída/)
  })
})
