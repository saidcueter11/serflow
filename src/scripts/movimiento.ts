/*
 * Movimiento de toda la página (PRI-287; lo carga Layout.astro, corre una vez y sigue vivo con el ClientRouter).
 * Aparecer al hacer scroll: lo que está debajo de la pantalla espera (sf-espera) hasta que entra y aparece una sola vez,
 * con un solo observador para todo el sitio. Solo transform y opacity: nada cambia de lugar. El estado de espera lo pone
 * este script, así que sin JS, con reducir movimiento o con mala señal todo se ve de una.
 * Al cambiar de página: las primeras filas del muro que ya están en pantalla también entran, escalonadas. En la primera
 * carga no: esas fotos se pintan de una. Entre dos muros del catálogo no: ahí las fotos viajan (reacomoda.ts).
 * Navegar: el atributo data-navegando prende la barra de carga (.sf-nav-barra, global.css) y el menú del celular se
 * cierra, porque el header es el mismo elemento en todas las páginas.
 * Importa del router para que Astro lo publique como archivo y no inline: la CSP de PRI-152 solo deja scripts inline por
 * hash (e2e/motion.spec.ts lo vigila). Por lo mismo, slow-connection se conserva aquí y no en el script inline del Layout.
 */
import type { TransitionBeforeSwapEvent } from 'astro:transitions/client'
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
document.addEventListener('astro:before-preparation', () => raiz.setAttribute('data-navegando', ''))
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
})
