// Personalizador (PRI-122): lo que queda fijo en el código (spec, sección 6.7) y la forma de los datos que
// configura serflow-admin (tablas garment_colors y garment_photos). Mientras llegan las fotos del taller
// (PRI-125), los colores salen de muestra.ts con esta misma forma.

export type Prenda = 'camiseta' | 'gorra'
export type Tecnica = 'estampado' | 'dtf' | 'bordado'
export type Vista = 'frente' | 'espalda'
export type Cantidad = '1' | '2 a 5' | '6 a 20' | 'Más de 20'

/** [x, y] en fracciones 0 a 1 de la foto. */
export type Punto = [number, number]
/** Las 4 esquinas del área de impresión (columna print_area). */
export interface Area {
  tl: Punto
  tr: Punto
  br: Punto
  bl: Punto
}

/** Una fila de garment_photos, con la URL ya optimizada por Astro (mismo dominio: el canvas puede leer sus píxeles). */
export interface FotoColor {
  view: Vista
  image_url: string
  print_area: Area
  print_width_cm: number
}

/** Una fila de garment_colors con sus fotos. name va en femenino: "Negra" arma "Camiseta negra". */
export interface ColorPrenda {
  id: string
  garment: Prenda
  name: string
  hex: string
  photos: FotoColor[]
}

/** Escena de trabajo del motor y del mockup: 4:5. */
export const ESCENA = { ancho: 1080, alto: 1350 } as const

export const TECNICAS: Record<Tecnica, { nombre: string; pista: string }> = {
  estampado: { nombre: 'Estampado', pista: 'Mate, toma la textura de la tela' },
  dtf: { nombre: 'DTF', pista: 'Colores vivos, con brillo' },
  bordado: { nombre: 'Bordado', pista: 'Hilo con relieve' },
}

export interface Ubicacion {
  nombre: string
  vista: Vista
}

export const PRENDAS: Record<Prenda, { nombre: string; tecnicas: Tecnica[]; ubicaciones: Ubicacion[]; curva: number }> = {
  // curva: cuánto se envuelve el diseño como en un cilindro (cuerpo < copa de la gorra). Fijo en código.
  camiseta: {
    nombre: 'Camiseta',
    tecnicas: ['estampado', 'dtf', 'bordado'],
    ubicaciones: [
      { nombre: 'Pecho', vista: 'frente' },
      { nombre: 'Espalda', vista: 'espalda' },
    ],
    curva: 0.35,
  },
  gorra: { nombre: 'Gorra', tecnicas: ['bordado'], ubicaciones: [{ nombre: 'Frente', vista: 'frente' }], curva: 0.9 },
}

export const CANTIDADES: Cantidad[] = ['1', '2 a 5', '6 a 20', 'Más de 20']

/** La foto del color para la ubicación elegida. */
export function fotoDe(color: ColorPrenda, prenda: Prenda, ubicacion: string): FotoColor | undefined {
  const vista = PRENDAS[prenda].ubicaciones.find((u) => u.nombre === ubicacion)?.vista ?? 'frente'
  return color.photos.find((f) => f.view === vista)
}

/** Un color sale solo si tiene foto en todas las vistas de su prenda (6.7). */
export function colorCompleto(color: ColorPrenda): boolean {
  return PRENDAS[color.garment].ubicaciones.every((u) => color.photos.some((f) => f.view === u.vista))
}
