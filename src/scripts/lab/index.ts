/*
 * Arnés del laboratorio: dispara cada escena al entrar en pantalla y atiende el botón Repetir. No cuenta en el costo de
 * los efectos: en el sitio, disparar al aparecer ya lo hace el observador de src/scripts/movimiento.ts.
 * Con "reducir movimiento" o mala señal nada se esconde: la escena se queda en su estado final.
 */
import { repetirCrece } from './crece'
import { armarInclina, barrerInclina } from './inclina'
import { siguienteVista } from './reacomoda'

const quieto = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('slow-connection')

function tocar(esc: HTMLElement) {
  esc.removeAttribute('data-toca')
  void esc.offsetWidth // Para que la animación vuelva a empezar.
  esc.setAttribute('data-toca', '')
}

/** Lleva la página por la escena en 2,4 s, para las que dependen del scroll. */
function recorrer(esc: HTMLElement) {
  const { top, height } = esc.getBoundingClientRect()
  const desde = scrollY + top - innerHeight * 0.75
  const hasta = scrollY + top + height - innerHeight * 0.85
  const inicio = performance.now()
  const paso = (t: number) => {
    const k = Math.min(1, (t - inicio) / 2400)
    scrollTo({ top: desde + (hasta - desde) * (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2), behavior: 'instant' })
    if (k < 1) requestAnimationFrame(paso)
  }
  requestAnimationFrame(paso)
}

const REPETIR: Record<string, (esc: HTMLElement) => void> = {
  crece: repetirCrece,
  inclina: barrerInclina,
  reacomoda: siguienteVista,
  parallax: recorrer,
  costura: (esc) => {
    recorrer(esc)
    tocar(esc)
  },
}

document.addEventListener('click', (ev) => {
  const esc = (ev.target as Element).closest?.('[data-repetir]')?.closest('[data-efecto]')?.querySelector<HTMLElement>('[data-escena]')
  if (!esc) return
  ;(REPETIR[esc.dataset.escena!] ?? tocar)(esc)
})

document.addEventListener('astro:page-load', () => {
  const escenas = [...document.querySelectorAll<HTMLElement>('[data-escena]')]
  if (!escenas.length) return
  const vigia = new IntersectionObserver(
    (entradas) => {
      for (const { target, isIntersecting } of entradas) {
        const esc = target as HTMLElement
        esc.toggleAttribute('data-visible', isIntersecting)
        if (isIntersecting && !esc.hasAttribute('data-toca')) tocar(esc)
      }
    },
    { threshold: 0.2 },
  )
  for (const esc of escenas) {
    if (!quieto() && esc.hasAttribute('data-arma')) esc.setAttribute('data-armada', '')
    vigia.observe(esc)
  }
  const inclina = document.querySelector<HTMLElement>('[data-escena="inclina"]')
  if (inclina) armarInclina(inclina)
})
