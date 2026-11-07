import { describe, expect, it } from 'vitest'
import { ubicacionesDe, type ColorPrenda, type FotoColor } from './datos'

const foto = (view: FotoColor['view']): FotoColor => ({ view, image_url: view, image_url_movil: view, print_area: { tl: [0, 0], tr: [1, 0], br: [1, 1], bl: [0, 1] }, print_width_cm: 30 })
const camiseta = (...vistas: FotoColor['view'][]): ColorPrenda => ({ id: 'c', garment: 'camiseta', name: 'C', hex: '#000000', photos: vistas.map(foto) })

describe('ubicacionesDe', () => {
  it('con foto de frente y espalda, la camiseta ofrece Pecho y Espalda', () => {
    expect(ubicacionesDe(camiseta('frente', 'espalda'), 'camiseta').map((u) => u.nombre)).toEqual(['Pecho', 'Espalda'])
  })

  it('sin foto de espalda solo queda Pecho: nunca se usa la espalda de otro color', () => {
    expect(ubicacionesDe(camiseta('frente'), 'camiseta').map((u) => u.nombre)).toEqual(['Pecho'])
  })
})
