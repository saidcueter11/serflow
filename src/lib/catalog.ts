import { whatsappUrl } from './business'
import { SITE } from './promos'

/*
 * Catálogo como galería de fotos (PRI-130, dirección 2 "Pinterest / Unsplash"). Nada depende del nombre ni de la
 * descripción del producto: cada foto se identifica con su categoría, su número (legacy_id, si tiene) y su link.
 * El sitio es estático: las fechas se calculan en el build, como la vigencia de las promos.
 */

/** "Todo" del catálogo. */
export const TODO_HREF = '/products'

/** URL propia de una foto (PRI-286): abre el catálogo de su categoría con el modal de esa foto. Las viejas
 * /products/<categoría>/<slug> redirigen aquí con 301 (public/_redirects). */
export const fotoHref = (categoria: string, slug: string) => `/catalogo/${categoria}/${slug}`

/** Las nuevas van primero en "Todo": subidas hace menos de estos días. */
export const NUEVO_DIAS = 21
/** Fotos por página de la galería; desde la 61 siguen en /pagina/2. */
export const PAGE_SIZE = 60

const DAY = 24 * 60 * 60 * 1000
const dias = (createdAt: string, now: Date) => Math.max(0, Math.floor((now.getTime() - Date.parse(createdAt)) / DAY))

export const isNuevo = (createdAt: string, now: Date) => dias(createdAt, now) < NUEVO_DIAS

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

/** Nombre de la foto en el modal y title de su página: "Beisbol N.º 26". */
export const fotoTitulo = (label: string, n: number | null) => `${label}${numero(n)}`

/** Mensaje de "Pedir por WhatsApp": categoría, número si lo hay y el link de la foto (WhatsApp muestra la vista previa). */
export function pedirUrl(label: string, n: number | null, href: string): string {
  const cual = n == null ? label : `${label} (N.º ${n})`
  return whatsappUrl(`¡Hola! Me gustó esta de ${cual}. ¿Me hacen una así?\n${SITE}${href}`)
}
