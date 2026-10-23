import { whatsappUrl } from './business'
import { SITE } from './promos'

/*
 * Catálogo como galería de fotos (PRI-130, dirección 2 "Pinterest / Unsplash"). Nada depende del nombre ni de la
 * descripción del producto: cada foto se identifica con su categoría, su número (legacy_id, si tiene) y su link.
 * El sitio es estático: las fechas se calculan en el build, como la vigencia de las promos.
 */

/** "Nuevo": subida hace menos de estos días. */
export const NUEVO_DIAS = 21
/** Fotos por página de la galería; desde la 61 siguen en /pagina/2. */
export const PAGE_SIZE = 60

const DAY = 24 * 60 * 60 * 1000
const dias = (createdAt: string, now: Date) => Math.max(0, Math.floor((now.getTime() - Date.parse(createdAt)) / DAY))

export const isNuevo = (createdAt: string, now: Date) => dias(createdAt, now) < NUEVO_DIAS

/** "Hoy", "Ayer", "Hace 4 días", "Hace un mes", "Hace 3 meses". */
export function hace(createdAt: string, now: Date): string {
  const d = dias(createdAt, now)
  if (d === 0) return 'Hoy'
  if (d === 1) return 'Ayer'
  if (d < 30) return `Hace ${d} días`
  if (d < 60) return 'Hace un mes'
  return `Hace ${Math.floor(d / 30)} meses`
}

type Dated = { createdAt: string }

export const newestFirst = <T extends Dated>(list: T[]): T[] => [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

/**
 * "Todo": las nuevas primero (más reciente arriba) y el resto intercalado por categoría, para que no salgan
 * 24 gorras de béisbol seguidas. Cada grupo ya viene ordenado.
 */
export function interleave<T extends Dated>(groups: T[][], now: Date): T[] {
  const nuevas = newestFirst(groups.flat().filter((p) => isNuevo(p.createdAt, now)))
  const colas = groups.map((g) => g.filter((p) => !isNuevo(p.createdAt, now)))
  const resto: T[] = []
  for (let i = 0; colas.some((c) => i < c.length); i++) for (const c of colas) if (i < c.length) resto.push(c[i])
  return [...nuevas, ...resto]
}

/** "Más de <categoría>": las k que siguen a la foto i en su categoría, dando la vuelta, sin repetirla. */
export const masDe = <T>(list: T[], i: number, k: number): T[] => [...list.slice(i + 1), ...list.slice(0, i)].slice(0, k)

/** Bloques de PAGE_SIZE. Una categoría sin fotos tiene una página vacía (la del EmptyState). */
export function pages<T>(list: T[], size = PAGE_SIZE): T[][] {
  const out: T[][] = []
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size))
  return out.length ? out : [[]]
}

export const pageHref = (base: string, page: number) => (page === 1 ? base : `${base}/pagina/${page}`)

const numero = (n: number | null) => (n == null ? '' : ` N.º ${n}`)

/** alt de la foto: "Beisbol, foto N.º 26". Sin número: "Foto de Moda". */
export const fotoAlt = (label: string, n: number | null) => (n == null ? `Foto de ${label}` : `${label}, foto N.º ${n}`)

/** h1 (solo lectores de pantalla) y title del visor: "Beisbol N.º 26". */
export const fotoTitulo = (label: string, n: number | null) => `${label}${numero(n)}`

/** Mensaje de "Pedir por WhatsApp": categoría, número si lo hay y el link de la foto (WhatsApp muestra la vista previa). */
export function pedirUrl(label: string, n: number | null, href: string): string {
  const cual = n == null ? label : `${label} (N.º ${n})`
  return whatsappUrl(`¡Hola! Me gustó esta de ${cual}. ¿Me hacen una así?\n${SITE}${href}`)
}
