/*
 * Efecto 1: la foto crece desde su puesto en el muro hasta el modal real (PhotoModal + photo-modal.ts, que no cambian) y
 * al cerrar vuelve a su puesto. Solo transform y clip-path sobre el marco del modal: el marco arranca escalado para cubrir
 * la foto del muro y recortado a su forma 4:5. La miniatura que ya bajó se pone debajo de la foto grande: no hay espera.
 */
const ABRE = 620
const CIERRA = 420
const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)'
const RADIO = 12

/** El marco (M) escalado para cubrir la foto del muro (T) y recortado a ella: así se ve igual a la del muro. */
function desde(T: DOMRect, M: DOMRect): Keyframe {
  const s = Math.max(T.width / M.width, T.height / M.height)
  const dx = T.left + T.width / 2 - (M.left + M.width / 2)
  const dy = T.top + T.height / 2 - (M.top + M.height / 2)
  const x = (M.width - T.width / s) / 2
  const y = (M.height - T.height / s) / 2
  return { transform: `translate(${dx}px, ${dy}px) scale(${s})`, clipPath: `inset(${y}px ${x}px round ${RADIO / s}px)` }
}
const hasta: Keyframe = { transform: 'none', clipPath: `inset(0px 0px round ${RADIO}px)` }

let tile: DOMRect | null = null

// Antes de que photo-modal.ts abra el modal (va en captura en document): mide la foto con la página aún sin bloquear.
addEventListener(
  'click',
  (ev) => {
    const a = (ev.target as Element).closest?.('[data-escena="crece"] a[data-foto]')
    tile = a && !matchMedia('(prefers-reduced-motion: reduce)').matches && !document.documentElement.classList.contains('slow-connection') ? a.getBoundingClientRect() : null
  },
  true,
)

// Ya con el modal abierto, en el mismo cuadro: nada de esto alcanza a pintarse sin animar.
document.addEventListener('click', (ev) => {
  const a = (ev.target as Element).closest?.<HTMLAnchorElement>('[data-escena="crece"] a[data-foto]')
  const d = document.querySelector<HTMLDialogElement>('dialog[data-photo-modal]')
  if (!a || !tile || !d?.open) return
  const T = tile
  tile = null
  const marco = d.querySelector<HTMLElement>('.mx-marco')!
  const foto = d.querySelector<HTMLImageElement>('.mx-foto')!
  d.classList.add('lab-crece')

  const mini = new Image()
  mini.src = a.querySelector('img')!.currentSrc
  mini.alt = ''
  mini.className = 'lab-mini'
  marco.append(mini)
  // Al pasar de foto, la miniatura ya no es de esta foto.
  const vigia = new MutationObserver(() => mini.remove())
  vigia.observe(foto, { attributeFilter: ['src'] })

  let puesto = a
  puesto.style.opacity = '0'
  marco.animate([desde(T, marco.getBoundingClientRect()), hasta], { duration: ABRE, easing: EASE })

  const limpiar = () => {
    vigia.disconnect()
    mini.remove()
    puesto.style.opacity = ''
    d.classList.remove('lab-crece', 'lab-sale')
    delete (d as Partial<HTMLDialogElement>).close
    d.removeEventListener('cancel', alEsc)
  }
  const cerrarYa = () => {
    limpiar()
    HTMLDialogElement.prototype.close.call(d)
  }
  // photo-modal.ts cierra con d.close(): aquí se vuelve a su puesto primero. Si la foto ya no está en pantalla, cierra de una.
  d.close = () => {
    const destino = document.querySelector<HTMLAnchorElement>(`[data-escena="crece"] a[href="${location.pathname}"]`)
    const D = destino?.getBoundingClientRect()
    if (!destino || !D || D.bottom < 0 || D.top > innerHeight || d.classList.contains('lab-sale')) return cerrarYa()
    puesto.style.opacity = ''
    puesto = destino
    puesto.style.opacity = '0'
    d.classList.add('lab-sale')
    marco.getAnimations().forEach((x) => x.cancel())
    const vuelta = marco.animate([hasta, desde(D, marco.getBoundingClientRect())], { duration: CIERRA, easing: EASE, fill: 'forwards' })
    vuelta.finished.then(() => {
      cerrarYa()
      vuelta.cancel()
    })
  }
  const alEsc = (e: Event) => {
    e.preventDefault()
    d.close()
  }
  d.addEventListener('cancel', alEsc)
})

/** Repetir: abre la primera foto del muro. */
export function repetirCrece(esc: HTMLElement) {
  if (document.querySelector<HTMLDialogElement>('dialog[data-photo-modal]')?.open) return
  const a = esc.querySelector<HTMLAnchorElement>('a[data-foto]')!
  a.scrollIntoView({ block: 'center', behavior: 'instant' })
  a.click()
}
