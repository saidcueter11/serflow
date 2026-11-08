import { describe, expect, it } from 'vitest'
import { colorCompleto, tecnicasDe, ubicacionesDe, type ColorPrenda, type FotoColor, type Prenda, type Tecnica } from './datos'

const foto = (view: FotoColor['view']): FotoColor => ({ view, image_url: view, image_url_movil: view, print_area: { tl: [0, 0], tr: [1, 0], br: [1, 1], bl: [0, 1] }, print_width_cm: 30 })
const color = (garment: Prenda, ...vistas: FotoColor['view'][]): ColorPrenda => ({ id: 'c', garment, name: 'C', hex: '#000000', photos: vistas.map(foto) })
const camiseta = (...vistas: FotoColor['view'][]) => color('camiseta', ...vistas)
const nombres = (c: ColorPrenda, t?: Tecnica) => ubicacionesDe(c, c.garment, t).map((u) => u.nombre)

describe('ubicacionesDe', () => {
  it('con foto de frente y espalda, la camiseta ofrece Pecho y Espalda', () => {
    expect(nombres(camiseta('frente', 'espalda'))).toEqual(['Pecho', 'Espalda'])
  })

  it('sin foto de espalda solo queda Pecho: nunca se usa la espalda de otro color', () => {
    expect(nombres(camiseta('frente'))).toEqual(['Pecho'])
  })

  it('en camiseta las dos técnicas van en pecho y espalda', () => {
    expect(nombres(camiseta('frente', 'espalda'), 'bordado')).toEqual(['Pecho', 'Espalda'])
    expect(nombres(camiseta('frente', 'espalda'), 'estampado')).toEqual(['Pecho', 'Espalda'])
  })
})

// Reglas del taller (Said, PRI-122).
describe('gorra acrílica', () => {
  const acrilica = color('gorra', 'frente', 'lado')

  it('el bordado va solo en el centro del frente', () => {
    expect(nombres(acrilica, 'bordado')).toEqual(['Centro del frente'])
  })

  it('el estampado va solo a los lados, nunca al frente', () => {
    expect(nombres(acrilica, 'estampado')).toEqual(['Lado'])
  })

  it('sin foto de lado no ofrece estampado: no hay dónde ponerlo', () => {
    expect(tecnicasDe(color('gorra', 'frente'), 'gorra')).toEqual(['bordado'])
    expect(tecnicasDe(acrilica, 'gorra')).toEqual(['bordado', 'estampado'])
  })

  it('sin foto de lado el color sale igual, solo con el centro del frente', () => {
    expect(colorCompleto(color('gorra', 'frente'))).toBe(true)
    expect(nombres(color('gorra', 'frente'))).toEqual(['Centro del frente'])
    expect(colorCompleto(color('gorra', 'lado'))).toBe(false)
  })
})

describe('gorra de malla', () => {
  const malla = color('gorra-malla', 'frente')

  it('estampado y bordado, los dos al frente', () => {
    expect(tecnicasDe(malla, 'gorra-malla')).toEqual(['bordado', 'estampado'])
    expect(nombres(malla, 'bordado')).toEqual(['Frente'])
    expect(nombres(malla, 'estampado')).toEqual(['Frente'])
  })
})
