import { describe, expect, it } from 'vitest'
import { MAX_COLORES, POR_DEFECTO, armarColores, recortarColores, type FilaColor, type FilaFoto } from './base'

const foto = (view: FilaFoto['view'], image_url: string, over: Partial<FilaFoto> = {}): FilaFoto => ({ view, image_url, print_area: null, print_width_cm: null, ...over })
const camiseta = (id: string, garment_photos: FilaFoto[]): FilaColor => ({ id, garment: 'camiseta', name: id, hex: '#000000', garment_photos })
const urls = (...u: string[]) => new Map(u.map((x) => [x, { image_url: `/_astro/${x}`, image_url_movil: `/_astro/${x}-720` }]))

describe('armarColores', () => {
  it('el diseño va solo al frente (PRI-522): un color sale con su foto de frente, sin necesitar la de espalda', () => {
    const { camiseta: lista } = armarColores(
      [camiseta('con-espalda', [foto('frente', 'a'), foto('espalda', 'b')]), camiseta('solo-frente', [foto('frente', 'c')]), camiseta('solo-espalda', [foto('espalda', 'd')])],
      urls('a', 'b', 'c', 'd'),
    )
    expect(lista.map((c) => c.id)).toEqual(['con-espalda', 'solo-frente'])
    expect(lista[0].foto.image_url).toBe('/_astro/a')
  })

  it('una foto de frente que no sirvió deja fuera a su color, aunque la de espalda sí sirva', () => {
    const { camiseta: lista } = armarColores([camiseta('rota', [foto('frente', 'a'), foto('espalda', 'b')])], urls('b'))
    expect(lista).toEqual([])
  })

  it('sin área ni cm usa el valor por defecto de la prenda; el cliente no calibra nada', () => {
    const { camiseta: lista, gorra } = armarColores(
      [camiseta('c', [foto('frente', 'a')]), { id: 'g', garment: 'gorra', name: 'Negra', hex: '#000000', garment_photos: [foto('frente', 'a')] }],
      urls('a'),
    )
    expect(lista[0].foto).toEqual({ image_url: '/_astro/a', image_url_movil: '/_astro/a-720', ...POR_DEFECTO.camiseta })
    expect(gorra[0].foto).toMatchObject(POR_DEFECTO.gorra!)
  })

  it('respeta el área y los cm guardados, y descarta un área que rompería las cuentas', () => {
    const area = { tl: [0.1, 0.1], tr: [0.9, 0.1], br: [0.9, 0.9], bl: [0.1, 0.9] }
    const invertida = { tl: [0.9, 0.1], tr: [0.1, 0.1], br: [0.1, 0.9], bl: [0.9, 0.9] }
    const fuera = { tl: [0, 0], tr: [2, 0], br: [2, 1], bl: [0, 1] }
    const { camiseta: lista } = armarColores(
      [
        camiseta('bien', [foto('frente', 'a', { print_area: area, print_width_cm: 40 })]),
        camiseta('invertida', [foto('frente', 'a', { print_area: invertida })]),
        camiseta('fuera', [foto('frente', 'a', { print_area: fuera })]),
        camiseta('rara', [foto('frente', 'a', { print_area: { tl: 'x' } })]),
      ],
      urls('a'),
    )
    expect(lista[0].foto).toMatchObject({ print_area: area, print_width_cm: 40 })
    for (const c of lista.slice(1)) expect(c.foto.print_area).toEqual(POR_DEFECTO.camiseta!.print_area)
  })
})

describe('recortarColores', () => {
  const completa = (id: string) => camiseta(id, [foto('frente', 'a')])

  it(`deja ${MAX_COLORES} colores por prenda, los primeros, antes de bajar ninguna foto`, () => {
    const filas = Array.from({ length: MAX_COLORES + 3 }, (_, i) => completa(`c${i}`))
    expect(recortarColores(filas)).toEqual(filas.slice(0, MAX_COLORES))
  })

  it('un color sin foto de frente no ocupa cupo', () => {
    const filas = [camiseta('solo-espalda', [foto('espalda', 'a')]), ...Array.from({ length: MAX_COLORES }, (_, i) => completa(`c${i}`))]
    expect(recortarColores(filas)).toEqual(filas.slice(1))
  })

  it('cada prenda tiene su propio cupo', () => {
    const gorra: FilaColor = { id: 'g', garment: 'gorra', name: 'g', hex: '#000000', garment_photos: [foto('frente', 'a')] }
    const camisetas = Array.from({ length: MAX_COLORES }, (_, i) => completa(`c${i}`))
    expect(recortarColores([...camisetas, gorra])).toEqual([...camisetas, gorra])
  })
})
