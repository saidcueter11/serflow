import { describe, expect, it } from 'vitest'
import { fotoHref, interleave, isNuevo, pageHref, pages, pedirUrl } from './catalog'

const NOW = new Date('2026-10-20T12:00:00Z')
const ago = (d: number) => new Date(NOW.getTime() - d * 24 * 60 * 60 * 1000).toISOString()
const foto = (id: string, d: number) => ({ id, createdAt: ago(d) })

describe('isNuevo', () => {
  it('nueva hasta 20 días, no a los 21', () => {
    expect(isNuevo(ago(20), NOW)).toBe(true)
    expect(isNuevo(ago(21), NOW)).toBe(false)
  })
})

describe('interleave', () => {
  it('nuevas primero (la más reciente arriba) y el resto intercalado por categoría', () => {
    const beisbol = [foto('b-nueva', 4), foto('b1', 40), foto('b2', 50), foto('b3', 60)]
    const moda = [foto('m-nueva', 2), foto('m1', 45)]
    const kids = [foto('k1', 70)]
    expect(interleave([beisbol, moda, kids], NOW).map((p) => p.id)).toEqual(['m-nueva', 'b-nueva', 'b1', 'm1', 'k1', 'b2', 'b3'])
  })
})

describe('fotoHref', () => {
  it('cada foto tiene URL propia en /catalogo', () => {
    expect(fotoHref('beisbol', 'beisbol-26')).toBe('/catalogo/beisbol/beisbol-26')
  })
})

describe('pages', () => {
  it('bloques de 60; sin fotos queda una página vacía', () => {
    const list = Array.from({ length: 130 }, (_, i) => i)
    expect(pages(list).map((p) => p.length)).toEqual([60, 60, 10])
    expect(pages([])).toEqual([[]])
    expect(pageHref('/products/beisbol', 1)).toBe('/products/beisbol')
    expect(pageHref('/products', 3)).toBe('/products/pagina/3')
  })
})

describe('pedirUrl', () => {
  const text = (url: string) => new URL(url).searchParams.get('text')

  it('identifica la foto por categoría, número y link, sin el nombre', () => {
    expect(text(pedirUrl('Beisbol', 26, fotoHref('beisbol', 'beisbol-26')))).toBe(
      '¡Hola! Me gustó esta de Beisbol (N.º 26). ¿Me hacen una así?\nhttps://serflowctg.netlify.app/catalogo/beisbol/beisbol-26',
    )
  })

  it('sin legacy_id (fotos nuevas del admin) el link basta', () => {
    expect(text(pedirUrl('Moda', null, fotoHref('moda', 'gorra-dama')))).toBe(
      '¡Hola! Me gustó esta de Moda. ¿Me hacen una así?\nhttps://serflowctg.netlify.app/catalogo/moda/gorra-dama',
    )
  })
})
