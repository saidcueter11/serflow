/*
 * Efecto 7: al cambiar de categoría, las fotos viajan a su nuevo puesto (FLIP): mide, cambia el orden, mide y anima solo
 * transform y opacity. Dos lecturas de layout por toque, ninguna por cuadro. Cada foto dice su puesto en cada vista:
 * data-vistas = {"todo": 0, "basket": 3}. Con "reducir movimiento" cambia igual, sin animar.
 */
const MS = 640
const ESCALON = 28
const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

function cambiar(esc: HTMLElement, vista: string) {
  const rejilla = esc.querySelector<HTMLElement>('.lab-rejilla')!
  const fotos = [...rejilla.querySelectorAll<HTMLElement>('li')]
  // Una salida a medias termina aquí; lo que aún viaja se mide donde va, así el nuevo viaje sale de ahí sin salto.
  for (const li of fotos) {
    if (li.hasAttribute('data-sale')) {
      li.getAnimations().forEach((a) => a.cancel())
      li.removeAttribute('data-sale')
      li.removeAttribute('style')
      li.hidden = true
    }
  }
  const caja = rejilla.getBoundingClientRect()
  const antes = new Map(fotos.filter((li) => !li.hidden).map((li) => [li, li.getBoundingClientRect()]))
  fotos.forEach((li) => li.getAnimations().forEach((a) => a.cancel()))

  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('slow-connection')
  const puestos = fotos.map((li) => (JSON.parse(li.dataset.vistas!) as Record<string, number>)[vista])
  fotos.forEach((li, i) => {
    const puesto = puestos[i]
    const r = antes.get(li)
    if (puesto === undefined && r && !quieto) {
      // La que se va sale del flujo y se apaga donde estaba.
      li.setAttribute('data-sale', '')
      li.style.cssText = `position:absolute;left:${r.left - caja.left}px;top:${r.top - caja.top}px;width:${r.width}px`
      li.animate({ opacity: [1, 0], transform: ['none', 'scale(0.92)'] }, { duration: MS / 3, easing: 'ease-out', fill: 'forwards' }).onfinish = () => {
        li.getAnimations().forEach((a) => a.cancel())
        li.removeAttribute('data-sale')
        li.removeAttribute('style')
        li.hidden = true
      }
      return
    }
    li.hidden = puesto === undefined
    li.style.order = String(puesto ?? 0)
  })
  if (quieto) return
  fotos.forEach((li, i) => {
    const puesto = puestos[i]
    if (puesto === undefined) return
    const a = antes.get(li)
    const op = { duration: MS, delay: puesto * ESCALON, easing: EASE, fill: 'backwards' as const }
    if (!a) return void li.animate({ opacity: [0, 1], transform: ['scale(0.9)', 'none'] }, op)
    const b = li.getBoundingClientRect()
    li.animate({ transform: [`translate(${a.left - b.left}px, ${a.top - b.top}px)`, 'none'] }, op)
  })
}

function elegir(esc: HTMLElement, chip: HTMLAnchorElement) {
  esc.querySelector('.lab-chips a[aria-current]')?.removeAttribute('aria-current')
  chip.setAttribute('aria-current', 'true')
  chip.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' })
  cambiar(esc, chip.hash.slice(1))
}

// En captura y antes que el router de Astro: las pestañas no navegan.
document.addEventListener(
  'click',
  (ev) => {
    const chip = (ev.target as Element).closest?.<HTMLAnchorElement>('.lab-chips a')
    if (!chip) return
    ev.preventDefault()
    elegir(chip.closest<HTMLElement>('[data-escena]')!, chip)
  },
  true,
)

/** Repetir: pasa a la categoría siguiente. */
export function siguienteVista(esc: HTMLElement) {
  const chips = [...esc.querySelectorAll<HTMLAnchorElement>('.lab-chips a')]
  const i = chips.findIndex((c) => c.hasAttribute('aria-current'))
  elegir(esc, chips[(i + 1) % chips.length])
}
