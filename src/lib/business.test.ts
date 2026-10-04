import { describe, expect, it } from 'vitest'
import { whatsappUrl } from './business'

describe('whatsappUrl', () => {
  it('encodes the message so user text cannot break the URL', () => {
    expect(whatsappUrl('Hola & chao?')).toBe('https://wa.me/573156481243?text=Hola%20%26%20chao%3F')
  })

  it('uses the default greeting', () => {
    expect(whatsappUrl()).toBe('https://wa.me/573156481243?text=Hola!%20Quiero%20m%C3%A1s%20informaci%C3%B3n')
  })
})
