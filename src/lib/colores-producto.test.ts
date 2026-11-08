import { describe, expect, it } from 'vitest'
import { bordeMuestra } from './colores-producto'

describe('bordeMuestra', () => {
  it('borde claro en los colores oscuros, el de siempre en los demás', () => {
    expect(bordeMuestra('#111111')).toBe('border-muted')
    expect(bordeMuestra('#ffffff')).toBe('border-line')
    expect(bordeMuestra('#C9A24A')).toBe('border-line')
  })
})
