// PRI-427: la migración que siembra los colores del personalizador dice lo mismo que muestra.ts, y cada foto a la que
// apunta existe en el repo. Sin esto, un color sembrado con una referencia rota saldría de /personaliza sin aviso.
import { describe, expect, it } from 'vitest'
import { coloresDeLaSiembra } from '../../../e2e/promos/sembrado.mjs'
import { MAX_COLORES } from './base'
import { MUESTRA, fotoDelRepo } from './muestra'

interface Fila {
  garment: 'camiseta' | 'gorra'
  name: string
  hex: string
  garment_photos: { view: string; image_url: string; print_area: Record<string, number[]>; print_width_cm: number }[]
}

const SIEMBRA = coloresDeLaSiembra() as Fila[]

describe('siembra de colores', () => {
  for (const garment of ['camiseta', 'gorra'] as const) {
    const sembrados = SIEMBRA.filter((c) => c.garment === garment)

    it(`${garment}: los mismos colores de muestra.ts, en el mismo orden, y caben en el tope`, () => {
      expect(sembrados.map(({ name, hex }) => ({ name, hex }))).toEqual(MUESTRA[garment].map(({ name, hex }) => ({ name, hex })))
      expect(sembrados.length).toBeLessThanOrEqual(MAX_COLORES)
    })

    it(`${garment}: cada foto existe en el repo, con el área y los cm de muestra.ts`, () => {
      sembrados.forEach((c, i) => {
        const muestra = MUESTRA[garment][i].photos
        expect(c.garment_photos.map((f) => f.view)).toEqual(muestra.map((f) => f.view))
        c.garment_photos.forEach((f, j) => {
          expect(fotoDelRepo(f.image_url), f.image_url).toBeDefined()
          expect(f.print_width_cm).toBe(muestra[j].print_width_cm)
          for (const esquina of ['tl', 'tr', 'br', 'bl'] as const) {
            f.print_area[esquina].forEach((n, k) => expect(n).toBeCloseTo(muestra[j].print_area[esquina][k], 6))
          }
        })
      })
    })
  }

  it('una referencia desconocida no es foto del repo', () => {
    expect(fotoDelRepo('repo:personalizador/no-existe.jpg')).toBeUndefined()
    expect(fotoDelRepo('repo:stock/gorra-bordada.jpg')).toBeUndefined()
    expect(fotoDelRepo('https://x.supabase.co/storage/v1/object/public/site-media/camiseta-negra.jpg')).toBeUndefined()
  })
})
