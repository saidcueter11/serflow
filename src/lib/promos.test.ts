import { describe, expect, it } from 'vitest'
import { SITE_URL } from './site.mjs'
import { anchoCubre, diasPromo, hastaCorto, livePromos, promoMensaje, promoPhotoUrls, validaHasta } from './promos'
import type { Promo } from './types'

const promo = (slug: string, over: Partial<Promo> = {}): Promo => ({
  id: slug,
  slug,
  title: slug,
  description: null,
  banner_url: null,
  image_urls: [],
  is_active: true,
  ends_at: null,
  sort_order: 0,
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
  ...over,
})

const NOW = new Date('2026-10-10T12:00:00-05:00')

describe('livePromos', () => {
  it('drops expired promos and keeps those without an end date or ending later', () => {
    const rows = [
      promo('vencida', { ends_at: '2026-10-09T23:59:00-05:00' }),
      promo('justo-ahora', { ends_at: '2026-10-10T12:00:00-05:00' }),
      promo('sin-fecha'),
      promo('manana', { ends_at: '2026-10-11T23:59:00-05:00' }),
    ]
    expect(livePromos(rows, NOW).map((p) => p.slug)).toEqual(['sin-fecha', 'manana'])
  })

  it('orders by sort_order, then by creation date', () => {
    const rows = [
      promo('c', { sort_order: 2 }),
      promo('b-nueva', { sort_order: 1, created_at: '2026-10-05T00:00:00Z' }),
      promo('b-vieja', { sort_order: 1, created_at: '2026-10-02T00:00:00Z' }),
      promo('a', { sort_order: 0 }),
    ]
    expect(livePromos(rows, NOW).map((p) => p.slug)).toEqual(['a', 'b-vieja', 'b-nueva', 'c'])
  })

  it('keeps a promo with weekdays every day: the days are a label, not a filter (PRI-538)', () => {
    const rows = [promo('mar-jue', { weekdays: [2, 3, 4] }), promo('sabados', { weekdays: [6] }), promo('todos', { weekdays: [] })]
    // Del lunes 12 al domingo 18 de octubre en Cartagena: las tres salen todos los días.
    for (let d = 12; d <= 18; d++) {
      expect(livePromos(rows, new Date(`2026-10-${d}T12:00:00-05:00`)).map((p) => p.slug)).toEqual(['mar-jue', 'sabados', 'todos'])
    }
  })

  it('tolerates rows from before the SQL (no ends_at or sort_order columns)', () => {
    const old = { ...promo('vieja') } as Partial<Promo>
    delete old.ends_at
    delete old.sort_order
    expect(livePromos([old as Promo], NOW)).toHaveLength(1)
  })
})

describe('promo helpers', () => {
  it('puts the banner first and skips empty photos', () => {
    expect(promoPhotoUrls({ banner_url: 'b.jpg', image_urls: ['1.jpg', '2.jpg'] })).toEqual(['b.jpg', '1.jpg', '2.jpg'])
    expect(promoPhotoUrls({ banner_url: null, image_urls: ['1.jpg'] })).toEqual(['1.jpg'])
  })

  it('writes the end date in Cartagena time', () => {
    expect(validaHasta('2026-10-11T23:59:00-05:00')).toBe('Válida hasta el domingo 11 de octubre')
    expect(hastaCorto('2026-10-11T23:59:00-05:00')).toBe('Hasta el 11 de oct')
    expect(validaHasta(null)).toBeNull()
  })

  it('prefills the WhatsApp message with the promo name and link', () => {
    expect(promoMensaje({ title: '2x1 en gorras', slug: '2x1-gorras' })).toBe(
      `¡Hola! Me interesa la promo "2x1 en gorras". ${SITE_URL}/promos/2x1-gorras`,
    )
  })
})

describe('diasPromo (PRI-538)', () => {
  it('one day, in plural', () => {
    expect(diasPromo([2])).toBe('Disponible los martes')
    expect(diasPromo([6])).toBe('Disponible los sábados')
    expect(diasPromo([7])).toBe('Disponible los domingos')
  })

  it('several loose days, Monday first, with "y"', () => {
    expect(diasPromo([4, 2, 3])).toBe('Disponible martes, miércoles y jueves')
    expect(diasPromo([1, 5])).toBe('Disponible lunes y viernes')
    expect(diasPromo([1, 6, 7])).toBe('Disponible lunes, sábado y domingo')
  })

  it('a run of 4 or more days in a row is a range', () => {
    expect(diasPromo([1, 2, 3, 4, 5])).toBe('Disponible de lunes a viernes')
    expect(diasPromo([1, 2, 3, 4, 5, 6])).toBe('Disponible de lunes a sábado')
    expect(diasPromo([1, 2, 3, 4, 6])).toBe('Disponible de lunes a jueves y sábado')
    expect(diasPromo([1, 3, 4, 5, 6])).toBe('Disponible lunes y de miércoles a sábado')
  })

  it('weekend', () => {
    expect(diasPromo([7, 6])).toBe('Disponible fines de semana')
  })

  it('every day or none: no label', () => {
    expect(diasPromo([1, 2, 3, 4, 5, 6, 7])).toBeNull()
    expect(diasPromo([])).toBeNull()
    expect(diasPromo(null)).toBeNull()
    expect(diasPromo(undefined)).toBeNull()
  })

  it('ignores repeated and out-of-range days', () => {
    expect(diasPromo([2, 2, 3, 0, 8])).toBe('Disponible martes y miércoles')
  })
})

describe('anchoCubre (PRI-555)', () => {
  it('una foto más angosta que su caja se pide al ancho de la caja', () => {
    expect(anchoCubre('100vw - 32px', 0.8, 4 / 3)).toBe('calc(100vw - 32px)')
    expect(anchoCubre('112px', undefined, 0.8)).toBe('calc(112px)')
  })
  it('una más ancha, al ancho del recorte (redondeado hacia arriba)', () => {
    expect(anchoCubre('100vw - 32px', 2, 4 / 3)).toBe('calc((100vw - 32px) * 1.5)')
    expect(anchoCubre('112px', 1.5, 0.8)).toBe('calc((112px) * 1.88)')
  })
})
