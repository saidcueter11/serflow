// Personalizador (PRI-122): lo que queda fijo en el código (spec, sección 6.7) y la forma de los datos que
// configura serflow-admin (tablas garment_colors y garment_photos). Mientras llegan las fotos del taller
// (PRI-125), los colores salen de muestra.ts con esta misma forma, teñidos desde la foto blanca de cada prenda.

/** gorra es la acrílica (la que guarda el admin); gorra-malla, la trucker, por ahora solo con fotos de muestra. */
export type Prenda = 'camiseta' | 'gorra' | 'gorra-malla'
export type Tecnica = 'estampado' | 'bordado'
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

/**
 * La fila de frente de garment_photos, con la URL ya optimizada por Astro (mismo dominio: el canvas puede leer sus
 * píxeles). El diseño va solo al frente (Said, PRI-522): las filas de otras vistas no se usan.
 */
export interface FotoColor {
  image_url: string
  /** La misma foto más liviana, para celular (no es columna: la deriva quien optimiza). */
  image_url_movil: string
  /** Mapa de sombreado de la base blanca de la foto (solo las teñidas de muestra.ts): el diseño toma sus pliegues. */
  sombra_url?: string
  print_area: Area
  print_width_cm: number
}

/** Una fila de garment_colors con su foto de frente. name va en femenino: "Negra" arma "Camiseta negra". */
export interface ColorPrenda {
  id: string
  garment: Prenda
  name: string
  hex: string
  foto: FotoColor
}

/** Escena de trabajo del motor y del mockup: 4:5. */
export const ESCENA = { ancho: 1080, alto: 1350 } as const

export const TECNICAS: Record<Tecnica, { nombre: string; pista: string }> = {
  estampado: { nombre: 'Estampado', pista: 'Mate, toma la textura de la tela' },
  bordado: { nombre: 'Bordado', pista: 'Hilo con relieve' },
}

/** El diseño va siempre al frente (Said, PRI-522): no hay selector de ubicación; el mensaje de WhatsApp lo dice. */
export const UBICACION = 'Frente'

export const PRENDAS: Record<Prenda, { nombre: string; tecnicas: Tecnica[]; curva: number; bordadoMaxCm?: number }> = {
  // curva: cuánto se envuelve el diseño como en un cilindro (cuerpo < copa de la gorra). Fijo en código.
  // bordadoMaxCm: en camiseta se borda solo lo pequeño, un logo o un nombre (Said, PRI-122).
  camiseta: { nombre: 'Camiseta', tecnicas: ['estampado', 'bordado'], curva: 0.35, bordadoMaxCm: 10 },
  // Reglas del taller (Said, PRI-122): en la acrílica el bordado va en el centro del frente y el estampado solo a los
  // lados, nunca al frente. Con el diseño solo al frente (PRI-522), la acrílica queda solo con bordado. En la de malla,
  // las dos técnicas van al frente.
  gorra: { nombre: 'Gorra acrílica', tecnicas: ['bordado'], curva: 0.9 },
  'gorra-malla': { nombre: 'Gorra de malla', tecnicas: ['bordado', 'estampado'], curva: 0.9 },
}

export const CANTIDADES: Cantidad[] = ['1', '2 a 5', '6 a 20', 'Más de 20']
