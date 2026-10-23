import { describe, expect, it } from 'vitest'
import { clasificar, detalleArchivo, MAX_BYTES, porTamano } from './archivo'

describe('clasificar', () => {
  it('imágenes comunes se intentan mostrar', () => {
    for (const [name, type] of [['logo.png', 'image/png'], ['foto.jpg', 'image/jpeg'], ['a.webp', 'image/webp'], ['b.gif', 'image/gif'], ['c.svg', 'image/svg+xml'], ['d.heic', 'image/heic']])
      expect(clasificar({ name, type, size: 1000 })).toBe('imagen')
  })

  it('PDF, AI, PSD y otros formatos van como archivo, aunque digan image/', () => {
    expect(clasificar({ name: 'logo.pdf', type: 'application/pdf', size: 1000 })).toBe('archivo')
    expect(clasificar({ name: 'logo.ai', type: 'application/postscript', size: 1000 })).toBe('archivo')
    expect(clasificar({ name: 'logo.psd', type: 'image/vnd.adobe.photoshop', size: 1000 })).toBe('archivo')
    expect(clasificar({ name: 'notas.docx', type: '', size: 1000 })).toBe('archivo')
  })

  it('más de 20 MB no se abre', () => {
    expect(clasificar({ name: 'foto.jpg', type: 'image/jpeg', size: MAX_BYTES + 1 })).toBe('pesada')
    expect(clasificar({ name: 'foto.jpg', type: 'image/jpeg', size: MAX_BYTES })).toBe('imagen')
  })
})

describe('porTamano', () => {
  it('más de 50 megapíxeles: pesada', () => {
    expect(porTamano(8000, 7000, false)).toBe('pesada')
  })
  it('lado corto de menos de 500 px: baja calidad (no bloquea)', () => {
    expect(porTamano(1200, 499, false)).toBe('baja')
    expect(porTamano(500, 500, false)).toBe('imagen')
  })
  it('un SVG nunca es de baja calidad', () => {
    expect(porTamano(48, 48, true)).toBe('imagen')
  })
})

describe('detalleArchivo', () => {
  it('formato y medidas o peso', () => {
    expect(detalleArchivo({ name: 'logo.png', size: 1 }, { ancho: 1200, alto: 1200 })).toBe('PNG · 1200 × 1200 px')
    expect(detalleArchivo({ name: 'logo-final.pdf', size: 2.4 * 1024 * 1024 })).toBe('PDF · 2,4 MB')
    expect(detalleArchivo({ name: 'x.ai', size: 3000 })).toBe('AI · 3 KB')
  })
})
