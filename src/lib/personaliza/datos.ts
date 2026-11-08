// Personalizador (PRI-122): lo que queda fijo en el código (spec, sección 6.7) y la forma de los datos que
// configura serflow-admin (tablas garment_colors y garment_photos). Mientras llegan las fotos del taller
// (PRI-125), los colores salen de muestra.ts con esta misma forma, teñidos desde la foto blanca de cada prenda y vista.

/** gorra es la acrílica (la que guarda el admin); gorra-malla, la trucker, por ahora solo con fotos de muestra. */
export type Prenda = 'camiseta' | 'gorra' | 'gorra-malla'
export type Tecnica = 'estampado' | 'bordado'
export type Vista = 'frente' | 'espalda' | 'lado'
export type Cantidad = '1' | '2 a 5' | '6 a 20' | 'Más de 20'

/** [x, y] en fracciones 0 a 1 de la foto. */
export type Punto = [number, number]
/** Las 4 esquinas del área de impresión (columna print_area). Calibra los cm y la posición inicial; el diseño puede salirse. */
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
  /** La misma foto más liviana, para celular (no es columna: la deriva quien optimiza). */
  image_url_movil: string
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
  bordado: { nombre: 'Bordado', pista: 'Hilo con relieve' },
}

export interface Ubicacion {
  nombre: string
  vista: Vista
  /** Las técnicas que van aquí; sin lista, todas las de la prenda. */
  tecnicas?: Tecnica[]
  /** Un color sale aunque le falte esta foto: la ubicación queda apagada (el admin aún no guarda fotos de lado). */
  opcional?: boolean
}

export const PRENDAS: Record<Prenda, { nombre: string; tecnicas: Tecnica[]; ubicaciones: Ubicacion[]; curva: number; bordadoMaxCm?: number; nota?: string }> = {
  // curva: cuánto se envuelve el diseño como en un cilindro (cuerpo < copa de la gorra). Fijo en código.
  // bordadoMaxCm: en camiseta se borda solo lo pequeño, un logo o un nombre (Said, PRI-122).
  camiseta: {
    nombre: 'Camiseta',
    tecnicas: ['estampado', 'bordado'],
    ubicaciones: [
      { nombre: 'Pecho', vista: 'frente' },
      { nombre: 'Espalda', vista: 'espalda' },
    ],
    curva: 0.35,
    bordadoMaxCm: 10,
  },
  // Reglas del taller (Said, PRI-122): en la acrílica el bordado va solo en el centro del frente y el estampado solo a los
  // lados, nunca al frente. En la de malla, las dos técnicas van al frente.
  gorra: {
    nombre: 'Gorra acrílica',
    tecnicas: ['bordado', 'estampado'],
    ubicaciones: [
      { nombre: 'Centro del frente', vista: 'frente', tecnicas: ['bordado'] },
      { nombre: 'Lado', vista: 'lado', tecnicas: ['estampado'], opcional: true },
    ],
    curva: 0.9,
    nota: 'En la gorra acrílica el bordado va en el centro del frente y el estampado, a los lados.',
  },
  'gorra-malla': { nombre: 'Gorra de malla', tecnicas: ['bordado', 'estampado'], ubicaciones: [{ nombre: 'Frente', vista: 'frente' }], curva: 0.9 },
}

export const CANTIDADES: Cantidad[] = ['1', '2 a 5', '6 a 20', 'Más de 20']

/** La foto del color para la ubicación elegida. */
export function fotoDe(color: ColorPrenda, prenda: Prenda, ubicacion: string): FotoColor | undefined {
  const vista = PRENDAS[prenda].ubicaciones.find((u) => u.nombre === ubicacion)?.vista ?? 'frente'
  return color.photos.find((f) => f.view === vista)
}

/**
 * Las ubicaciones con foto en este color y, si se da la técnica, donde esa técnica va. Solo un color de muestra puede
 * faltar en una vista.
 */
export function ubicacionesDe(color: ColorPrenda, prenda: Prenda, tecnica?: Tecnica): Ubicacion[] {
  return PRENDAS[prenda].ubicaciones.filter((u) => color.photos.some((f) => f.view === u.vista) && (!tecnica || !u.tecnicas || u.tecnicas.includes(tecnica)))
}

/** Las técnicas que tienen dónde ir en este color: sin foto de lado, la acrílica no ofrece estampado. */
export function tecnicasDe(color: ColorPrenda, prenda: Prenda): Tecnica[] {
  return PRENDAS[prenda].tecnicas.filter((t) => ubicacionesDe(color, prenda, t).length > 0)
}

/** Un color sale solo si tiene foto en todas las vistas de su prenda (6.7), menos las opcionales. */
export function colorCompleto(color: ColorPrenda): boolean {
  return PRENDAS[color.garment].ubicaciones.every((u) => u.opcional || color.photos.some((f) => f.view === u.vista))
}
