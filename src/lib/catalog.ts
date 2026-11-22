import { whatsappUrl } from './business'
import { esUrlPermitida } from './fotos-host.mjs'
import { SITE } from './promos'

/*
 * Catálogo como galería de fotos (PRI-130, dirección 2 "Pinterest / Unsplash"). El muro no depende del nombre ni de la
 * descripción del producto: cada foto se identifica con su categoría, su número (legacy_id, si tiene) y su link. El modal
 * muestra el nombre, la descripción y el precio que ponga el admin, si los hay (PRI-433).
 * El sitio es estático: las fechas se calculan en el build, como la vigencia de las promos.
 */

/**
 * "Todo" del catálogo. Las categorías cuelgan de aquí: /catalogo/<categoría>/ (PRI-525; antes /products, con 301).
 * Los links internos llevan la "/" final del canonical (PRI-555): sin ella, Netlify responde 301 y el prefetch pide dos veces.
 */
export const TODO_HREF = '/catalogo/'

/** URL propia de una foto: la ficha del producto (PRI-529; antes el muro con el modal abierto, PRI-286), con la "/"
 * final del canonical. Tocar la foto en el muro lleva ahí. Las viejas /products/<categoría>/<slug> redirigen aquí con 301
 * (public/_redirects). */
export const fotoHref = (categoria: string, slug: string) => `/catalogo/${categoria}/${slug}/`

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

export const pageHref = (base: string, page: number) => (page === 1 ? base : `${base}pagina/${page}/`)

const numero = (n: number | null) => (n == null ? '' : ` N.º ${n}`)

/**
 * alt de la foto (PRI-525): el nombre que le puso el admin y la categoría, "Camiseta Lakers bordada, Basketball". La técnica
 * (bordada, estampada, DTF) viene en el nombre: la base no la guarda aparte. Sin nombre propio (vacío o el de fábrica,
 * "Beisbol #26"): "Beisbol, foto N.º 26", o "Foto de Moda" sin número.
 */
export function fotoAlt(label: string, n: number | null, nombre?: string | null): string {
  const propio = nombre?.trim()
  if (!propio || /#\s*\d+$/.test(propio)) return n == null ? `Foto de ${label}` : `${label}, foto N.º ${n}`
  return propio.toLowerCase().includes(label.toLowerCase()) ? propio : `${propio}, ${label}`
}

/** Nombre de la foto en el modal y title de su página: "Beisbol N.º 26". */
export const fotoTitulo = (label: string, n: number | null) => `${label}${numero(n)}`

/** Dónde guarda el admin la copia grande (2400 px) de una foto de producto: al lado, con "-zoom" antes de la extensión (PRI-546). */
export const zoomUrl = (url: string) => url.replace(/(\.[^./]+)?$/, '-zoom$1')

/**
 * La copia grande de la foto que la lupa y el visor bajan solo al acercar (PRI-529), si existe; null usa la foto normal
 * (fotos de antes de PRI-546, las de src/assets o un host ajeno). Un HEAD por foto en el build: lo que falle o tarde da
 * null y el build sigue.
 */
export async function fotoZoom(url: string): Promise<string | null> {
  const zoom = zoomUrl(url)
  if (!esUrlPermitida(zoom)) return null
  try {
    const res = await fetch(zoom, { method: 'HEAD', redirect: 'error', signal: AbortSignal.timeout(3_000) })
    return res.status === 200 ? zoom : null
  } catch {
    return null
  }
}

/** Precio del admin en pesos para el modal: "$30.000". Sin precio (null, 0 o negativo), null: no se pinta. */
export const precioCop = (precio: number | null) =>
  precio != null && precio > 0 ? `$${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(precio)}` : null

/** Mensaje de "Pedir por WhatsApp": categoría, número si lo hay y el link de la foto (WhatsApp muestra la vista previa). */
export function pedirUrl(label: string, n: number | null, href: string): string {
  const cual = n == null ? label : `${label} (N.º ${n})`
  return whatsappUrl(`¡Hola! Me gustó esta de ${cual}. ¿Me hacen una así?\n${SITE}${href}`)
}
