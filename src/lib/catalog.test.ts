import { describe, expect, it } from 'vitest'
import { hace, interleave, isNuevo, masDe, pageHref, pages, pedirUrl } from './catalog'

const NOW = new Date('2026-10-20T12:00:00Z')
const ago = (d: number) => new Date(NOW.getTime() - d * 24 * 60 * 60 * 1000).toISOString()
const foto = (id: string, d: number) => ({ id, createdAt: ago(d) })

describe('isNuevo / hace', () => {
  it('Nuevo hasta 20 días, no a los 21', () => {
    expect(isNuevo(ago(20), NOW)).toBe(true)
    expect(isNuevo(ago(21), NOW)).toBe(false)
  })

  it('dice cuándo se subió', () => {
    expect([0, 1, 4, 45, 95].map((d) => hace(ago(d), NOW))).toEqual(['Hoy', 'Ayer', 'Hace 4 días', 'Hace un mes', 'Hace 3 meses'])
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

describe('masDe', () => {
  it('las que siguen, dando la vuelta, sin la actual', () => {
    expect(masDe(['a', 'b', 'c', 'd'], 2, 3)).toEqual(['d', 'a', 'b'])
    expect(masDe(['a'], 0, 6)).toEqual([])
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
    expect(text(pedirUrl('Beisbol', 26, '/products/beisbol/beisbol-26'))).toBe(
      '¡Hola! Me gustó esta de Beisbol (N.º 26). ¿Me hacen una así?\nhttps://serflowctg.netlify.app/products/beisbol/beisbol-26',
    )
  })

  it('sin legacy_id (fotos nuevas del admin) el link basta', () => {
    expect(text(pedirUrl('Moda', null, '/products/moda/gorra-dama'))).toBe(
      '¡Hola! Me gustó esta de Moda. ¿Me hacen una así?\nhttps://serflowctg.netlify.app/products/moda/gorra-dama',
    )
  })
})
