import { describe, expect, it } from 'vitest'
import { mensaje, nombreMockup, type Pedido } from './mensaje'

const base: Pedido = {
  prenda: 'camiseta',
  color: 'Negra',
  tecnica: 'bordado',
  ubicacion: 'Pecho',
  cantidad: '2 a 5',
  diseno: 'imagen',
  vistaPrevia: true,
  tamanoCm: 19,
  nota: 'el logo en dorado, tallas M y L',
}

describe('mensaje', () => {
  it('arma el pedido completo en el orden fijo, con tamaño y vista previa', () => {
    expect(mensaje(base)).toBe(
      [
        '¡Hola, Serflow! Quiero cotizar esta prenda personalizada:',
        '',
        '*Prenda:* Camiseta negra',
        '*Técnica:* Bordado',
        '*Ubicación:* Pecho',
        '*Tamaño:* unos 19 cm de ancho',
        '*Cantidad:* 2 a 5',
        '*Diseño:* te lo mando en el siguiente mensaje, con la vista previa',
        '*Nota:* el logo en dorado, tallas M y L',
        '',
        'Armado en la web de Serflow',
      ].join('\n'),
    )
  })

  it('sin vista previa no dice tamaño ni vista previa', () => {
    const m = mensaje({ ...base, vistaPrevia: false })
    expect(m).not.toContain('*Tamaño:*')
    expect(m).toContain('*Diseño:* te lo mando en el siguiente mensaje\n')
  })

  it('con el interruptor encendido avisa que va sin el fondo', () => {
    expect(mensaje({ ...base, sinFondo: true })).toContain('*Diseño:* te lo mando en el siguiente mensaje (sin el fondo), con la vista previa')
  })

  it('imagen pesada: la manda como archivo, sin tamaño', () => {
    const m = mensaje({ ...base, diseno: 'pesada' })
    expect(m).toContain('*Diseño:* te mando el archivo en el siguiente mensaje')
    expect(m).not.toContain('*Tamaño:*')
  })

  it('sin diseño no hay línea de Diseño ni Tamaño', () => {
    const m = mensaje({ ...base, diseno: 'ninguno' })
    expect(m).not.toContain('*Diseño:*')
    expect(m).not.toContain('*Tamaño:*')
    expect(m).toContain('*Cantidad:* 2 a 5\n*Nota:*')
  })

  it('gorra, sin nota y nota de más de 300 caracteres', () => {
    const gorra = mensaje({ ...base, prenda: 'gorra', color: 'Blanca', ubicacion: 'Frente', nota: '  ' })
    expect(gorra).toContain('*Prenda:* Gorra blanca\n*Técnica:* Bordado\n*Ubicación:* Frente')
    expect(gorra).not.toContain('*Nota:*')
    expect(mensaje({ ...base, nota: 'x'.repeat(400) })).toContain(`*Nota:* ${'x'.repeat(300)}\n`)
  })
})

describe('nombreMockup', () => {
  it('serflow-<prenda>-<color>-<ubicación>.jpg, sin tildes', () => {
    expect(nombreMockup('camiseta', 'Negra', 'Pecho')).toBe('serflow-camiseta-negra-pecho.jpg')
    expect(nombreMockup('camiseta', 'Azul oscuro', 'Espalda')).toBe('serflow-camiseta-azul-oscuro-espalda.jpg')
  })
})
