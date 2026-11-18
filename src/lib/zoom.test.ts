import { describe, expect, it } from 'vitest'
import { AJUSTADA, alterna, fraccion, gesto, hacia, limita, lupa, paso, pellizco, rueda, ZOOM_LUPA, ZOOM_MAX } from './zoom'

// PRI-529: foto de 480 x 640 (3:4) y panel de 440 x 640 donde va la información.
const FOTO = { w: 480, h: 640 }
const PANEL = { w: 440, h: 640 }

describe('lupa al lado', () => {
  it('el recuadro es el panel dividido por 2,5 y se centra en el mouse', () => {
    const { lente } = lupa(240, 320, FOTO, PANEL)
    expect(lente).toEqual({ x: 240 - 88, y: 320 - 128, w: 176, h: 256 })
  })

  it('en las esquinas el recuadro no se sale de la foto', () => {
    expect(lupa(0, 0, FOTO, PANEL).lente).toMatchObject({ x: 0, y: 0 })
    expect(lupa(480, 640, FOTO, PANEL).lente).toMatchObject({ x: 480 - 176, y: 640 - 256 })
  })

  it('el panel muestra el pedazo del recuadro 2,5 veces más grande', () => {
    const { lente, fondo } = lupa(240, 320, FOTO, PANEL)
    expect(fondo).toEqual({ w: 480 * ZOOM_LUPA, h: 640 * ZOOM_LUPA, x: -lente.x * ZOOM_LUPA, y: -lente.y * ZOOM_LUPA })
  })

  it('con una foto cuadrada recortada (cover) el panel la recorta igual, sin estirarla', () => {
    // 1000 x 1000 en una caja de 480 x 640: se pinta a 640 x 640, corrida 80 a la izquierda.
    const { lente, fondo } = lupa(0, 0, FOTO, PANEL, { w: 1000, h: 1000 })
    expect(fondo.w).toBe(640 * ZOOM_LUPA)
    expect(fondo.h).toBe(640 * ZOOM_LUPA)
    expect(fondo.x).toBe((-80 - lente.x) * ZOOM_LUPA)
    expect(fondo.y).toBe(0)
  })

  it('un panel más grande que la foto por 2,5 deja el recuadro del tamaño de la foto', () => {
    expect(lupa(10, 10, { w: 100, h: 100 }, { w: 1000, h: 1000 }).lente).toEqual({ x: 0, y: 0, w: 100, h: 100 })
  })
})

describe('mantén para acercar', () => {
  it('el dedo como fracción de la foto, sin salirse de 0..1', () => {
    const caja = { left: 16, top: 100, width: 342, height: 456 }
    expect(fraccion(16 + 171, 100 + 114, caja)).toEqual({ fx: 0.5, fy: 0.25 })
    expect(fraccion(0, 900, caja)).toEqual({ fx: 0, fy: 1 })
  })
})

describe('visor: límites del zoom', () => {
  const W = 400
  const H = 600

  it('nunca aleja de 1 ni acerca más de 4', () => {
    expect(limita({ s: 0.5, tx: 30, ty: 30 }, W, H)).toEqual(AJUSTADA)
    expect(limita({ s: 9, tx: 0, ty: 0 }, W, H).s).toBe(ZOOM_MAX)
    expect(hacia(AJUSTADA, 20, 0, 0, W, H).s).toBe(ZOOM_MAX)
  })

  it('casi 1 queda en 1 y centrada', () => {
    expect(limita({ s: 1.005, tx: -2, ty: -2 }, W, H)).toEqual(AJUSTADA)
  })

  it('acercada, la foto no se puede arrastrar fuera de la zona', () => {
    expect(limita({ s: 2, tx: 50, ty: 50 }, W, H)).toEqual({ s: 2, tx: 0, ty: 0 })
    expect(limita({ s: 2, tx: -900, ty: -900 }, W, H)).toEqual({ s: 2, tx: -400, ty: -600 })
  })

  it('acerca hacia el puntero: el punto bajo el mouse no se mueve', () => {
    const v = hacia(AJUSTADA, 2, 100, 150, W, H)
    expect(v).toEqual({ s: 2, tx: -100, ty: -150 })
    // (100, 150) de la zona sigue mostrando el mismo punto de la foto: (100 - tx) / s = 100.
    expect((100 - v.tx) / v.s).toBe(100)
  })

  it('la rueda acerca hacia arriba y aleja hacia abajo, hasta ajustar', () => {
    expect(rueda(AJUSTADA, -100, 200, 300, W, H).s).toBeCloseTo(1.15)
    expect(rueda({ s: 1.1, tx: -20, ty: -30 }, 100, 200, 300, W, H)).toEqual(AJUSTADA)
  })

  it('+ y − suben y bajan un paso hacia el centro', () => {
    const v = paso(AJUSTADA, 1, W, H)
    expect(v).toEqual({ s: 1.75, tx: -150, ty: -225 })
    expect(paso(v, -1, W, H)).toEqual(AJUSTADA)
  })

  it('doble toque acerca a 2,5 donde se tocó y otro doble toque ajusta', () => {
    const v = alterna(AJUSTADA, 0, 0, W, H)
    expect(v).toEqual({ s: ZOOM_LUPA, tx: 0, ty: 0 })
    expect(alterna(v, 0, 0, W, H)).toEqual(AJUSTADA)
  })

  it('pellizco: abrir los dedos al doble acerca 2 veces hacia el punto medio', () => {
    expect(pellizco(AJUSTADA, 100, 200, [200, 300], [200, 300], W, H)).toEqual({ s: 2, tx: -200, ty: -300 })
    expect(pellizco(AJUSTADA, 200, 100, [200, 300], [200, 300], W, H)).toEqual(AJUSTADA)
  })
})

describe('visor: gestos con la foto ajustada', () => {
  it('de lado cambia de foto solo si hay más de una', () => {
    expect(gesto(-80, 10, 3)).toBe('siguiente')
    expect(gesto(80, 10, 3)).toBe('anterior')
    expect(gesto(-80, 10, 1)).toBeNull()
  })

  it('hacia abajo cierra; un movimiento corto o en diagonal no hace nada', () => {
    expect(gesto(10, 120, 1)).toBe('cerrar')
    expect(gesto(10, 40, 1)).toBeNull()
    expect(gesto(90, 100, 3)).toBeNull()
    expect(gesto(0, -120, 1)).toBeNull()
  })
})
