import { describe, expect, it } from 'vitest'
import { hastaCorto, livePromos, promoMensaje, promoPhotoUrls, validaHasta } from './promos'
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
      '¡Hola! Me interesa la promo "2x1 en gorras". https://serflowctg.netlify.app/promos/2x1-gorras',
    )
  })
})
