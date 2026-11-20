/*
 * Movimiento de toda la página (PRI-287; lo carga Layout.astro, corre una vez y sigue vivo con el ClientRouter).
 * Aparecer al hacer scroll: lo que está debajo de la pantalla espera (sf-espera) hasta que entra y aparece una sola vez,
 * con un solo observador para todo el sitio. Solo transform y opacity: nada cambia de lugar. El estado de espera lo pone
 * este script, así que sin JS, con reducir movimiento o con mala señal todo se ve de una.
 * Al cambiar de página: las primeras filas del muro que ya están en pantalla también entran, escalonadas. En la primera
 * carga no: esas fotos se pintan de una. Entre dos muros del catálogo no: ahí las fotos viajan (reacomoda.ts).
 * Navegar: el atributo data-navegando prende la barra de carga (.sf-nav-barra, global.css) y el menú del celular se
 * cierra, porque el header es el mismo elemento en todas las páginas.
 * Foto que crece hasta la ficha (PRI-529): la foto tocada en el muro o en "Disponible ahora" y la primera de la galería de
 * la ficha llevan el mismo view-transition-name (foto-ficha, global.css), así que la view transition del router la lleva
 * de un puesto al otro. Al salir de la ficha, vuelve a la foto del muro con esa URL, si la hay. Una sola por página: dos
 * con el mismo nombre cancelan la transición. Reducir movimiento o mala señal: sin nombre.
 * Banner del catálogo (CatalogView.astro): persiste entre categorías y aquí entra la de la página nueva. Vivía en
 * un <script> de CatalogView, que sin imports Astro lo deja inline (PRI-529 le quitó el del modal).
 * Importa del router para que Astro lo publique como archivo y no inline: la CSP de PRI-152 solo deja scripts inline por
 * hash (e2e/motion.spec.ts lo vigila). Por lo mismo, slow-connection se conserva aquí y no en el script inline del Layout.
 */
import type { TransitionBeforePreparationEvent, TransitionBeforeSwapEvent } from 'astro:transitions/client'
import { quieto } from './quieto'
import { medir, reacomodar } from './reacomoda'

const SECCIONES = [
  '.pf-head',
  '.pf-accion-pie',
  '.pf-pz-texto > *',
  '.pf-pz-foto:not(.pf-pz-texto *)',
  '.pf-quienes > *',
  '.pf-visita',
  '.pf-promo',
  '.pf-servicios > *',
  '.pf-prendas > *',
  '.pf-promo-tarjetas > *',
  '.pf-mas-fotos > *',
  '[data-fotos] > li',
  '.pf-pz-pasos > section',
].join()
const MURO = '[data-fotos] > li'
// El tramo de abajo de la pantalla que todavía no cuenta como "entró".
const ORILLA = 0.08
// Una fila a la vez: como mucho 8 fotos escalonadas (dos filas del muro en desktop).
const ESCALONES = 7

let vigia: IntersectionObserver | undefined

function terminar(ev: TransitionEvent) {
  const el = ev.currentTarget as HTMLElement
  if (ev.target !== el) return
  el.classList.remove('sf-aparece')
  el.style.removeProperty('--sf-i')
  el.removeEventListener('transitionend', terminar)
}

function aparecer(entradas: IntersectionObserverEntry[]) {
  let i = 0
  for (const { target, isIntersecting } of entradas) {
    if (!isIntersecting) continue
    vigia!.unobserve(target)
    const el = target as HTMLElement
    el.style.setProperty('--sf-i', String(Math.min(i++, ESCALONES)))
    el.addEventListener('transitionend', terminar)
    el.classList.add('sf-aparece')
    el.classList.remove('sf-espera')
  }
}

function armar(navego: boolean) {
  vigia?.disconnect()
  if (quieto()) return
  vigia = new IntersectionObserver(aparecer, { rootMargin: `0px 0px -${ORILLA * 100}% 0px` })
  const limite = innerHeight * (1 - ORILLA)
  // Primero medir y luego escribir: una sola pasada de layout, también con el muro entero.
  const esperan = [...document.querySelectorAll<HTMLElement>(SECCIONES)].filter((el) => {
    const { top, height } = el.getBoundingClientRect()
    return height > 0 && (top >= limite || (navego && top > -height && el.matches(MURO)))
  })
  for (const el of esperan) {
    el.classList.add('sf-espera')
    vigia.observe(el)
  }
}

armar(false)

const raiz = document.documentElement
document.addEventListener('astro:before-preparation', (ev) => {
  raiz.setAttribute('data-navegando', '')
  nombrarAlSalir(ev as TransitionBeforePreparationEvent)
})
document.addEventListener('astro:after-preparation', () => raiz.removeAttribute('data-navegando'))
// El router copia los atributos de <html> de la página nueva: la conexión lenta se mide una sola vez.
let viaja = false
document.addEventListener('astro:before-swap', (ev) => {
  const swap = ev as TransitionBeforeSwapEvent
  swap.newDocument.documentElement.classList.toggle('slow-connection', raiz.classList.contains('slow-connection'))
  viaja = medir(swap)
})
document.addEventListener('astro:after-swap', () => {
  document.querySelector('header details')?.removeAttribute('open')
  // armar primero: mide las fotos en su puesto, sin el punto de partida del viaje.
  armar(!viaja)
  if (viaja) reacomodar()
  nombrarAlLlegar()
})

let nombrada: HTMLElement | undefined
// La ficha que se deja: al llegar al muro, la foto con esa URL es la que vuelve.
let desde = ''

/** La caja de la foto (con su radio y su recorte): el link del muro o el marco de la foto en la card. */
function nombrar(el: Element | null | undefined) {
  if (!(el instanceof HTMLElement)) return
  el.style.viewTransitionName = 'foto-ficha'
  nombrada = el
}

function nombrarAlSalir(ev: TransitionBeforePreparationEvent) {
  if (nombrada) nombrada.style.viewTransitionName = ''
  nombrada = undefined
  desde = ''
  if (quieto()) return
  const galeria = document.querySelector('.gp-foto')
  if (galeria) {
    desde = ev.from.pathname
    return nombrar(galeria)
  }
  nombrar(ev.sourceElement?.closest('[data-fotos] a, .pf-prendas a')?.querySelector('img')?.parentElement)
  if (nombrada) esperarFoto(ev)
}

/** Cuánto puede esperar la navegación a que baje la foto de la ficha: lo que tarda en salir la barra de carga. */
const ESPERA_FOTO = 280

/**
 * La foto de llegada ya pintada cuando se toma su imagen (PRI-556): sin esto la foto viajaba hacia el fondo vacío de la
 * galería y se oscurecía. La espera tiene tope: con mala red la navegación no se frena más que ESPERA_FOTO.
 */
function esperarFoto(ev: TransitionBeforePreparationEvent) {
  const cargar = ev.loader
  ev.loader = async () => {
    await cargar()
    const img = ev.newDocument.querySelector('.gp-foto img')
    if (!img) return
    const pre = new Image()
    pre.sizes = img.getAttribute('sizes') ?? ''
    pre.srcset = img.getAttribute('srcset') ?? ''
    pre.src = img.getAttribute('src') ?? ''
    await Promise.race([pre.decode().catch(() => {}), new Promise((r) => setTimeout(r, ESPERA_FOTO))])
  }
}

function nombrarAlLlegar() {
  if (!nombrada) return
  const galeria = document.querySelector<HTMLElement>('.gp-foto')
  // La foto ya crece con la transición: la galería no vuelve a entrar creciendo (gp-crece).
  if (galeria) galeria.closest<HTMLElement>('.gp')!.style.animation = 'none'
  const vuelve = desde && document.querySelector(`main a[href="${CSS.escape(desde)}"]`)
  // Que no espere para aparecer (sf-espera): es la que llega.
  if (vuelve) vuelve.closest('.sf-espera')?.classList.remove('sf-espera')
  nombrar(galeria ?? (vuelve || null)?.querySelector('img')?.parentElement)
}

// La bajada se conserva entre categorías, pero moverla reinicia su animación: ya vista, no vuelve a subir (PRI-428).
document.addEventListener('astro:before-swap', () => document.querySelector('.sf-bajada[data-astro-transition-persist]')?.setAttribute('data-vista', ''))
// El banner persiste entre páginas del catálogo (transition:persist): la lámina de la categoría nueva pide su foto y,
// cuando ya está decodificada, entra en fundido encima de la anterior (PRI-556; antes se deslizaba hacia una lámina
// todavía vacía). Mientras tanto se sigue viendo la anterior. Reducir movimiento o mala señal: cambia sin fundido.
let cambio = 0
document.addEventListener('astro:page-load', async () => {
  const main = document.querySelector<HTMLElement>('main[data-banner-index]')
  const slides = [...document.querySelectorAll<HTMLElement>('[data-banner-slide]')]
  const llega = slides[Number(main?.dataset.bannerIndex)]
  if (!llega) return
  // Otra pestaña tocada mientras bajaba la foto o en pleno fundido: manda la última.
  const vez = ++cambio
  const fin = () => {
    if (vez === cambio) slides.forEach((s) => ((s.hidden = s !== llega), s.removeAttribute('data-llega')))
  }
  if (!llega.hidden) return fin()
  const img = llega.querySelector('img')
  if (img) {
    img.loading = 'eager'
    await img.decode().catch(() => {})
  }
  if (vez !== cambio) return
  llega.hidden = false
  if (quieto()) return fin()
  llega.setAttribute('data-llega', '')
  llega.addEventListener('animationend', fin, { once: true })
})
