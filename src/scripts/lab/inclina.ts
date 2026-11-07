/*
 * Efecto 5: la tarjeta se inclina hacia el cursor (o el dedo) y un foco dorado la sigue; las otras se apagan (CSS, :has).
 * Una escritura de transform por cuadro, sin variables CSS, y el rectángulo se mide una sola vez al entrar.
 */
const GRADOS = 7

function brillo(card: HTMLElement) {
  return card.querySelector<HTMLElement>('.lab-foco')!
}

export function armarInclina(esc: HTMLElement) {
  for (const card of esc.querySelectorAll<HTMLElement>('.lab-inclina')) {
    let r: DOMRect | null = null
    let x = 0
    let y = 0
    let cuadro = 0
    const pintar = () => {
      cuadro = 0
      if (!r) return
      const px = (x - r.left) / r.width - 0.5
      const py = (y - r.top) / r.height - 0.5
      card.style.transform = `perspective(800px) rotateX(${-py * GRADOS * 2}deg) rotateY(${px * GRADOS * 2}deg)`
      brillo(card).style.transform = `translate(${x - r.left}px, ${y - r.top}px) translate(-50%, -50%)`
    }
    card.addEventListener('pointerenter', (ev) => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      r = card.getBoundingClientRect()
      x = ev.clientX
      y = ev.clientY
      card.setAttribute('data-activa', '')
      pintar()
    })
    card.addEventListener('pointermove', (ev) => {
      if (!r) return
      x = ev.clientX
      y = ev.clientY
      cuadro ||= requestAnimationFrame(pintar)
    })
    const soltar = () => {
      r = null
      card.removeAttribute('data-activa')
      card.style.transform = ''
    }
    card.addEventListener('pointerleave', soltar)
    card.addEventListener('pointercancel', soltar)
  }
}

/** Repetir (y el celular, que no tiene cursor): un cursor imaginario pasa por cada tarjeta. */
export function barrerInclina(esc: HTMLElement) {
  esc.querySelectorAll<HTMLElement>('.lab-inclina').forEach((card, i) => {
    const op = { duration: 1100, delay: i * 180, easing: 'ease-in-out' }
    card.animate(
      [
        { transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)' },
        { transform: `perspective(800px) rotateX(${GRADOS}deg) rotateY(${-GRADOS}deg)` },
        { transform: `perspective(800px) rotateX(${-GRADOS}deg) rotateY(${GRADOS}deg)` },
        { transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)' },
      ],
      op,
    )
    const { width: w, height: h } = card.getBoundingClientRect()
    brillo(card).animate(
      [
        { opacity: 0, transform: 'translate(0px, 0px) translate(-50%, -50%)' },
        { opacity: 1, offset: 0.3 },
        { opacity: 1, offset: 0.7 },
        { opacity: 0, transform: `translate(${w}px, ${h}px) translate(-50%, -50%)` },
      ],
      op,
    )
  })
}
