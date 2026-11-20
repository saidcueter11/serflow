import { describe, expect, it } from 'vitest'
import { SITE_URL } from './site.mjs'
import { MAP_EMBED_URL } from './business'
import { absoluta, breadcrumbSchema, geoDelMapa, offerSchema, promoOfferSchema, rangoDePrecios, vigenciaPromo } from './seo'
import { lastmodPorRuta, lineasRedirect, rutaBase } from './seo-build.mjs'

const url = `${SITE_URL}/catalogo/beisbol/beisbol-26/`

describe('offerSchema', () => {
  it('pesos, el precio del admin y si hay para llevar, sin el stock', () => {
    expect(offerSchema({ url, price: 45000, disponible: true })).toMatchObject({
      '@type': 'Offer',
      url,
      priceCurrency: 'COP',
      price: 45000,
      availability: 'https://schema.org/InStock',
    })
    expect(offerSchema({ url, price: 45000, disponible: false })?.availability).toBe('https://schema.org/MadeToOrder')
    expect(offerSchema({ url, price: 45000, disponible: null })).not.toHaveProperty('availability')
  })

  it('sin precio (null o 0) no hay oferta (PRI-555)', () => {
    expect(offerSchema({ url, price: 0, disponible: true })).toBeUndefined()
    expect(offerSchema({ url, price: null, disponible: true })).toBeUndefined()
  })
})

describe('breadcrumbSchema', () => {
  it('posiciones desde 1, en orden', () => {
    const b = breadcrumbSchema([{ name: 'Inicio', url: absoluta('/') }, { name: 'Catálogo', url: absoluta('/catalogo/') }])
    expect(b.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${SITE_URL}/catalogo/` },
    ])
  })
})

describe('geoDelMapa', () => {
  it('saca latitud y longitud del pin del embed de Google', () => {
    expect(geoDelMapa(MAP_EMBED_URL)).toEqual({ '@type': 'GeoCoordinates', latitude: 10.4133097, longitude: -75.5238772 })
  })

  it('un embed sin coordenadas no da geo', () => {
    expect(geoDelMapa('https://www.google.com/maps/embed?pb=!1m2')).toBeUndefined()
  })
})

describe('rangoDePrecios', () => {
  it('del más barato al más caro, en pesos', () => {
    expect(rangoDePrecios([30000, null, 0, 55000, 25000])).toBe('$25.000 - $55.000')
    expect(rangoDePrecios([30000])).toBe('$30.000')
    expect(rangoDePrecios([null, 0])).toBeUndefined()
  })
})

describe('lastmodPorRuta', () => {
  const cat = (slug: string, updated_at: string) => ({ slug, updated_at })
  it('la foto, su categoría y "Todo" toman lo más nuevo de lo que muestran', () => {
    const m = lastmodPorRuta(
      [
        { slug: 'b-1', updated_at: '2026-11-01T00:00:00+00:00', categories: cat('beisbol', '2026-10-01T00:00:00+00:00') },
        { slug: 'b-2', updated_at: '2026-09-01T00:00:00+00:00', categories: cat('beisbol', '2026-10-01T00:00:00+00:00') },
        { slug: 'm-1', updated_at: '2026-08-01T00:00:00+00:00', categories: cat('moda', '2026-11-10T00:00:00+00:00') },
      ],
      [{ slug: 'gorras', updated_at: '2026-11-12T10:00:00+00:00' }],
    )
    expect(m.get('/catalogo/beisbol/b-2')).toBe('2026-09-01T00:00:00.000Z')
    expect(m.get('/catalogo/beisbol')).toBe('2026-11-01T00:00:00.000Z')
    expect(m.get('/catalogo/moda')).toBe('2026-11-10T00:00:00.000Z')
    expect(m.get('/catalogo')).toBe('2026-11-10T00:00:00.000Z')
    expect(m.get('/promos/gorras')).toBe('2026-11-12T10:00:00.000Z')
    expect(m.get('/promos')).toBe('2026-11-12T10:00:00.000Z')
    expect(m.has('/')).toBe(false)
  })

  it('las URLs del sitemap se buscan sin "/" final y las páginas /pagina/N como su categoría', () => {
    expect(rutaBase(`${SITE_URL}/catalogo/beisbol/pagina/2/`)).toBe('/catalogo/beisbol')
    expect(rutaBase(`${SITE_URL}/catalogo/pagina/3/`)).toBe('/catalogo')
    expect(rutaBase(`${SITE_URL}/catalogo/beisbol/b-1/`)).toBe('/catalogo/beisbol/b-1')
    expect(rutaBase(`${SITE_URL}/`)).toBe('/')
  })
})

describe('lineasRedirect', () => {
  const fila = (category_slug: string, slug: string, a = { slug: 'camiseta-lakers', categories: { slug: 'basketball' } }) => ({ category_slug, slug, products: a })

  it('un 301 de cada URL vieja a la actual, con la "/" del canonical', () => {
    expect(lineasRedirect([fila('basketball', 'basketball-50'), fila('kids', 'camiseta-lakers')])).toEqual([
      '/catalogo/basketball/basketball-50  /catalogo/basketball/camiseta-lakers/  301',
      '/catalogo/kids/camiseta-lakers  /catalogo/basketball/camiseta-lakers/  301',
    ])
  })

  it('descarta lo que no es un slug (va tal cual a un archivo de reglas) y lo que apunta a sí mismo', () => {
    expect(
      lineasRedirect([
        fila('x /* /evil 200', 'y'),
        fila('basketball', 'a\n/* /evil 200'),
        fila('basketball', 'b', { slug: '../x', categories: { slug: 'basketball' } }),
        fila('basketball', 'c', null as never),
        fila('basketball', 'camiseta-lakers'),
      ]),
    ).toEqual([])
  })
})

describe('vigenciaPromo (PRI-532)', () => {
  const created_at = '2026-10-01T00:00:00Z'

  it('desde que se creó hasta ends_at, y sin fin si no tiene', () => {
    expect(vigenciaPromo({ created_at, ends_at: '2026-12-01T04:59:59.999Z' })).toEqual({
      validFrom: '2026-10-01T00:00:00.000Z',
      validThrough: '2026-12-01T04:59:59.999Z',
    })
    expect(vigenciaPromo({ created_at, ends_at: null })).toEqual({ validFrom: '2026-10-01T00:00:00.000Z' })
  })
})

describe('promoOfferSchema (PRI-532)', () => {
  const base = { url: absoluta('/promos/2x1/'), name: '2x1 en gorras', validFrom: '2026-10-01T00:00:00.000Z' }

  it('Offer con la url del canonical, vigencia y vendedor', () => {
    expect(promoOfferSchema({ ...base, description: ' Dos por una. ', image: absoluta('/og.jpg'), validThrough: '2026-12-01T00:00:00.000Z' })).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Offer',
      name: '2x1 en gorras',
      description: 'Dos por una.',
      url: `${SITE_URL}/promos/2x1/`,
      image: `${SITE_URL}/og.jpg`,
      validFrom: '2026-10-01T00:00:00.000Z',
      validThrough: '2026-12-01T00:00:00.000Z',
      seller: { '@type': 'Organization', name: 'Serflow', url: `${SITE_URL}/` },
    })
  })

  it('sin descripción, foto ni fin, no los inventa', () => {
    const o = promoOfferSchema({ ...base, description: '  ' })
    expect(o).not.toHaveProperty('description')
    expect(o).not.toHaveProperty('image')
    expect(o).not.toHaveProperty('validThrough')
  })
})
