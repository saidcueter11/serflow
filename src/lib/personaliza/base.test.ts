import { describe, expect, it } from 'vitest'
import { MAX_COLORES, POR_DEFECTO, armarColores, recortarColores, type FilaColor, type FilaFoto } from './base'

const foto = (view: FilaFoto['view'], image_url: string, over: Partial<FilaFoto> = {}): FilaFoto => ({ view, image_url, print_area: null, print_width_cm: null, ...over })
const camiseta = (id: string, garment_photos: FilaFoto[]): FilaColor => ({ id, garment: 'camiseta', name: id, hex: '#000000', garment_photos })
const urls = (...u: string[]) => new Map(u.map((x) => [x, { image_url: `/_astro/${x}`, image_url_movil: `/_astro/${x}-720` }]))

describe('armarColores', () => {
  it('saca el color solo si tiene todas las vistas de su prenda', () => {
    const { camiseta: lista } = armarColores(
      [camiseta('completa', [foto('frente', 'a'), foto('espalda', 'b')]), camiseta('sin-espalda', [foto('frente', 'c')])],
      urls('a', 'b', 'c'),
    )
    expect(lista.map((c) => c.id)).toEqual(['completa'])
  })

  it('una foto que no sirvió deja incompleto a su color', () => {
    const { camiseta: lista } = armarColores([camiseta('rota', [foto('frente', 'a'), foto('espalda', 'b')])], urls('a'))
    expect(lista).toEqual([])
  })

  it('la gorra solo necesita el frente e ignora una foto de espalda', () => {
    const { gorra } = armarColores([{ id: 'g', garment: 'gorra', name: 'Negra', hex: '#000000', garment_photos: [foto('frente', 'a'), foto('espalda', 'b')] }], urls('a', 'b'))
    expect(gorra[0].photos.map((p) => p.view)).toEqual(['frente'])
  })

  it('sin área ni cm usa el valor por defecto de la prenda y la vista; el cliente no calibra nada', () => {
    const { camiseta: lista } = armarColores([camiseta('c', [foto('frente', 'a'), foto('espalda', 'b')])], urls('a', 'b'))
    expect(lista[0].photos[0]).toEqual({ view: 'frente', image_url: '/_astro/a', image_url_movil: '/_astro/a-720', ...POR_DEFECTO.camiseta.frente })
    expect(lista[0].photos[1]).toEqual({ view: 'espalda', image_url: '/_astro/b', image_url_movil: '/_astro/b-720', ...POR_DEFECTO.camiseta.espalda })
  })

  it('respeta el área y los cm guardados, y descarta un área que rompería las cuentas', () => {
    const area = { tl: [0.1, 0.1], tr: [0.9, 0.1], br: [0.9, 0.9], bl: [0.1, 0.9] }
    const invertida = { tl: [0.9, 0.1], tr: [0.1, 0.1], br: [0.1, 0.9], bl: [0.9, 0.9] }
    const fuera = { tl: [0, 0], tr: [2, 0], br: [2, 1], bl: [0, 1] }
    const { camiseta: lista } = armarColores(
      [
        camiseta('bien', [foto('frente', 'a', { print_area: area, print_width_cm: 40 }), foto('espalda', 'b', { print_area: invertida })]),
        camiseta('fuera', [foto('frente', 'a', { print_area: fuera }), foto('espalda', 'b', { print_area: { tl: 'x' } })]),
      ],
      urls('a', 'b'),
    )
    expect(lista[0].photos[0]).toMatchObject({ print_area: area, print_width_cm: 40 })
    expect(lista[0].photos[1].print_area).toEqual(POR_DEFECTO.camiseta.espalda!.print_area)
    expect(lista[1].photos[0].print_area).toEqual(POR_DEFECTO.camiseta.frente!.print_area)
    expect(lista[1].photos[1].print_area).toEqual(POR_DEFECTO.camiseta.espalda!.print_area)
  })

})

describe('recortarColores', () => {
  const completa = (id: string) => camiseta(id, [foto('frente', 'a'), foto('espalda', 'b')])

  it(`deja ${MAX_COLORES} colores por prenda, los primeros, antes de bajar ninguna foto`, () => {
    const filas = Array.from({ length: MAX_COLORES + 3 }, (_, i) => completa(`c${i}`))
    expect(recortarColores(filas)).toEqual(filas.slice(0, MAX_COLORES))
  })

  it('un color sin fila para todas sus vistas no ocupa cupo', () => {
    const filas = [camiseta('sin-espalda', [foto('frente', 'a')]), ...Array.from({ length: MAX_COLORES }, (_, i) => completa(`c${i}`))]
    expect(recortarColores(filas)).toEqual(filas.slice(1))
  })

  it('cada prenda tiene su propio cupo', () => {
    const gorra: FilaColor = { id: 'g', garment: 'gorra', name: 'g', hex: '#000000', garment_photos: [foto('frente', 'a')] }
    const camisetas = Array.from({ length: MAX_COLORES }, (_, i) => completa(`c${i}`))
    expect(recortarColores([...camisetas, gorra])).toEqual([...camisetas, gorra])
  })
})
