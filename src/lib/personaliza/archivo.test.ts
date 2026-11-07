import { describe, expect, it } from 'vitest'
import { ACEPTA, clasificar, detalleArchivo, MAX_BYTES, porTamano } from './archivo'

describe('clasificar', () => {
  it('PNG, JPG y WEBP se abren; HEIC se intenta aunque llegue sin tipo', () => {
    for (const [name, type] of [['logo.png', 'image/png'], ['foto.jpg', 'image/jpeg'], ['a.webp', 'image/webp'], ['d.heic', 'image/heic'], ['e.HEIC', '']])
      expect(clasificar({ name, type, size: 1000 })).toBe('imagen')
  })

  it('todo lo demás se rechaza, aunque diga image/', () => {
    for (const [name, type] of [['logo.pdf', 'application/pdf'], ['logo.ai', 'application/postscript'], ['logo.psd', 'image/vnd.adobe.photoshop'], ['b.gif', 'image/gif'], ['c.svg', 'image/svg+xml'], ['notas.docx', '']])
      expect(clasificar({ name, type, size: 1000 })).toBe('rechazada')
  })

  it('el selector no ofrece HEIC, para que el iPhone lo convierta a JPG', () => {
    expect(ACEPTA).toBe('image/png,image/jpeg,image/webp')
  })

  it('más de 20 MB no se abre', () => {
    expect(clasificar({ name: 'foto.jpg', type: 'image/jpeg', size: MAX_BYTES + 1 })).toBe('pesada')
    expect(clasificar({ name: 'foto.jpg', type: 'image/jpeg', size: MAX_BYTES })).toBe('imagen')
  })
})

describe('porTamano', () => {
  it('más de 50 megapíxeles: pesada', () => {
    expect(porTamano(8000, 7000)).toBe('pesada')
  })
  it('lado corto de menos de 500 px: baja calidad (no bloquea)', () => {
    expect(porTamano(1200, 499)).toBe('baja')
    expect(porTamano(500, 500)).toBe('imagen')
  })
})

describe('detalleArchivo', () => {
  it('formato y medidas o peso', () => {
    expect(detalleArchivo({ name: 'logo.png', size: 1 }, { ancho: 1200, alto: 1200 })).toBe('PNG · 1200 × 1200 px')
    expect(detalleArchivo({ name: 'foto-pesada.jpg', size: 2.4 * 1024 * 1024 })).toBe('JPG · 2,4 MB')
    expect(detalleArchivo({ name: 'x.webp', size: 3000 })).toBe('WEBP · 3 KB')
  })
})
