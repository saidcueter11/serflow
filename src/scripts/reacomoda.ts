import type { TransitionBeforeSwapEvent } from 'astro:transitions/client'
import { quieto } from './quieto'

/*
 * Rejilla que se reacomoda (PRI-287, efecto 7; lo llama movimiento.ts). Cada categoría es su propia página estática y el
 * ClientRouter la cambia sin recargar: aquí las fotos de la página vieja se miden antes del swap, las de la nueva después,
 * y se emparejan por su URL. La que sigue en pantalla viaja a su nuevo puesto, la que no estaba entra y la que se va se
 * apaga donde estaba. Solo se toca lo que está en pantalla, así que cuesta lo mismo con 10 fotos que con 60: dos lecturas
 * de layout en lote, nunca intercaladas con escrituras. Las animaciones son CSS (sf-viaja, tokens.css).
 */
const MURO = 'main[data-banner-index] [data-fotos]'

type Puesto = { li: HTMLElement; r: DOMRect }
let antes: Map<string, Puesto> | null = null

const url = (li: Element) => li.querySelector('a')!.getAttribute('href')!
const lista = (muro: Element) => [...muro.children] as HTMLElement[]

/** Antes del swap. Dice si esta navegación se reacomoda; si no, sigue la transición normal de página. */
export function medir(ev: TransitionBeforeSwapEvent) {
  antes = null
  const viejo = document.querySelector(MURO)
  const nuevo = ev.newDocument.querySelector(MURO)
  if (!viejo || !nuevo || quieto()) return false
  const vistas = new Map<string, Puesto>()
  for (const li of lista(viejo)) {
    const r = li.getBoundingClientRect()
    // El muro va en orden: de aquí para abajo nada se ve.
    if (r.top >= innerHeight) break
    if (r.bottom > 0) vistas.set(url(li), { li, r })
  }
  if (!vistas.size) return false
  // Ya bajaron y están decodificadas: que se pinten en el primer cuadro, no un rato después (lazy y async).
  for (const li of lista(nuevo)) {
    if (!vistas.has(url(li))) continue
    const img = li.querySelector('img')!
    img.loading = 'eager'
    img.decoding = 'sync'
  }
  antes = vistas
  // El fundido de página dejaría un fantasma de cada foto en su puesto viejo. ready se rechaza al saltarla: es lo esperado.
  ev.viewTransition.ready.catch(() => {})
  ev.viewTransition.skipTransition()
  return true
}

/** La que se va ya no está en la página nueva: la misma foto, en una capa encima, se apaga donde estaba. */
function despedir(salen: Puesto[]) {
  if (!salen.length) return
  const capa = document.createElement('div')
  capa.className = 'sf-salen'
  capa.inert = true
  for (const { li, r } of salen) {
    li.removeAttribute('class')
    li.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px`
    capa.append(li)
  }
  document.body.append(capa)
  Promise.allSettled(capa.getAnimations({ subtree: true }).map((a) => a.finished)).then(() => capa.remove())
}

/** Después del swap y del scroll de la página nueva. */
export function reacomodar() {
  const plan = antes
  antes = null
  const muro = document.querySelector(MURO)
  if (!plan || !muro) return
  const salen = new Map(plan)
  const llegan: { li: HTMLElement; r: DOMRect; de?: DOMRect }[] = []
  for (const li of lista(muro)) {
    const r = li.getBoundingClientRect()
    if (r.top >= innerHeight) break
    // Lo que espera su turno (movimiento.ts) ya tiene su entrada.
    if (r.bottom <= 0 || li.classList.contains('sf-espera')) continue
    const k = url(li)
    salen.delete(k)
    llegan.push({ li, r, de: plan.get(k)?.r })
  }
  llegan.forEach(({ li, r, de }, i) => {
    const dx = de ? de.left - r.left : 0
    const dy = de ? de.top - r.top : 0
    if (de && !dx && !dy) return
    li.style.setProperty('--sf-i', String(i))
    if (de) li.style.setProperty('--sf-desde', `translate(${dx}px, ${dy}px)`)
    li.classList.add(de ? 'sf-viaja' : 'sf-llega')
  })
  despedir([...salen.values()])
}
