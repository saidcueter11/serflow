import { describe, expect, it } from 'vitest'
import { heroSizes } from './HeroCarousel'
import { serviceCardSizes } from './ServiceCard'

// PRI-150: con object-cover, una foto horizontal se pinta con el ancho del recorte, no con el de su caja.
describe('sizes por proporción', () => {
  it('hero: una horizontal 3:2 se pinta a 900 px en el celular y a 1080 en desktop angosto', () => {
    expect(heroSizes(1.5)).toBe('(max-width: 767.98px) 900px, (max-width: 767.98px) 100vw, (max-width: 1080px) 1080px, 100vw')
  })

  it('hero: una vertical 2:3 solo pasa el ancho de la pantalla por debajo de 400 px', () => {
    expect(heroSizes(2 / 3)).toBe('(max-width: 400px) 400px, (max-width: 767.98px) 100vw, (max-width: 480px) 480px, 100vw')
  })

  it('tarjeta: una horizontal se pinta a 140 px de alto; una vertical, a los 112 de la caja', () => {
    expect(serviceCardSizes(1.5)).toBe('(min-width: 48rem) 50vw, 210px')
    expect(serviceCardSizes(0.8)).toBe('(min-width: 48rem) 50vw, 112px')
    expect(serviceCardSizes(0.5)).toBe('(min-width: 48rem) 50vw, 112px')
  })
})
