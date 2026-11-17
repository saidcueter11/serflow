import { describe, expect, it } from 'vitest'
import { promoModal, type PromoView } from './promos'

// PRI-535: la portada (banner) es solo portada; la galería del modal son las fotos de producto.
describe('promoModal', () => {
  const view = (over: Partial<PromoView>) => ({ slug: 'p', title: 'P', description: null, endsAt: null, photos: [], ...over }) as PromoView
  const ph = (src: string, banner?: boolean) => ({ src, alt: src, banner })

  it('leaves the banner out of the photo modal', () => {
    expect(promoModal(view({ cover: ph('b', true), photos: [ph('1'), ph('2')] }))?.fotos.map((f) => f.src)).toEqual(['1', '2'])
    expect(promoModal(view({ cover: ph('1'), photos: [ph('2')] }))?.fotos.map((f) => f.src)).toEqual(['1', '2'])
    expect(promoModal(view({ cover: ph('b', true) }))).toBeUndefined()
  })
})
