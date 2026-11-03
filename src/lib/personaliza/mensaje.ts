import { PRENDAS, TECNICAS, type Cantidad, type Prenda, type Tecnica } from './datos'

/**
 * ninguno: no subió nada · ayuda: "No tengo diseño" · imagen / baja: se ve en la vista previa (baja = menos de 500 px)
 * archivo: PDF, AI, PSD u otro que no se muestra · pesada: más de 20 MB o más de 50 MP.
 */
export type EstadoDiseno = 'ninguno' | 'ayuda' | 'imagen' | 'baja' | 'archivo' | 'pesada'

export const NOTA_MAX = 300

export interface Pedido {
  prenda: Prenda
  /** Nombre del color en femenino: "Negra". */
  color: string
  tecnica: Tecnica
  ubicacion: string
  cantidad: Cantidad
  diseno: EstadoDiseno
  /** El cliente vio su diseño sobre la prenda (la foto cargó y no siguió sin vista previa). */
  vistaPrevia: boolean
  /** Interruptor "Quitar el fondo" encendido. */
  sinFondo?: boolean
  tamanoCm?: number
  nota?: string
}

export const seMuestra = (d: EstadoDiseno) => d === 'imagen' || d === 'baja'

/** El mensaje exacto que llega a WhatsApp (spec, "Qué llega a WhatsApp", más Tamaño y "sin el fondo"). */
export function mensaje(p: Pedido): string {
  const muestra = seMuestra(p.diseno)
  const diseno = muestra
    ? `te lo mando en el siguiente mensaje${p.sinFondo ? ' (sin el fondo)' : ''}${p.vistaPrevia ? ', con la vista previa' : ''}`
    : p.diseno === 'archivo' || p.diseno === 'pesada'
      ? 'te mando el archivo en el siguiente mensaje'
      : 'todavía no tengo, quiero que me ayuden'
  const nota = p.nota?.trim().slice(0, NOTA_MAX)
  return [
    '¡Hola, Serflow! Quiero cotizar esta prenda personalizada:',
    '',
    `*Prenda:* ${PRENDAS[p.prenda].nombre} ${p.color.toLowerCase()}`,
    `*Técnica:* ${TECNICAS[p.tecnica].nombre}`,
    `*Ubicación:* ${p.ubicacion}`,
    ...(muestra && p.vistaPrevia && p.tamanoCm ? [`*Tamaño:* unos ${p.tamanoCm} cm de ancho`] : []),
    `*Cantidad:* ${p.cantidad}`,
    `*Diseño:* ${diseno}`,
    ...(nota ? [`*Nota:* ${nota}`] : []),
    '',
    'Armado en la web de Serflow',
  ].join('\n')
}

const slug = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** serflow-camiseta-negra-pecho.jpg */
export const nombreMockup = (prenda: Prenda, color: string, ubicacion: string) =>
  `serflow-${slug(`${PRENDAS[prenda].nombre} ${color} ${ubicacion}`)}.jpg`
