import { fraccion, lupa } from '../lib/zoom'

/*
 * Galería y lupa de la ficha de producto (PRI-529: GaleriaProducto, Lupa).
 * - Carrusel del celular: el contador "1 / N" y los puntos siguen a la foto que se ve.
 * - Miniaturas del escritorio: corren la pista a esa foto.
 * - Lupa al lado (escritorio, mouse): el recuadro sigue al mouse sobre la foto y el panel [data-lupa-panel] muestra ese pedazo
 *   2,5 veces más grande; la versión zoom (data-zoom) se pide al entrar, no al cargar la página.
 * - Mantén para acercar (celular): con el dedo quieto 220 ms la foto se acerca 2,5 veces donde está el dedo, lo sigue y al
 *   soltar vuelve; ese toque no abre el visor. Después del primer uso la etiqueta se va (data-usado).
 * El escritorio y el celular los decide el CSS (contenedor .pf): aquí se mira qué etiqueta se ve.
 * Los listeners van en document una sola vez (con el ClientRouter la galería cambia por página).
 */

/** Cuánto hay que dejar quieto el dedo para que acerque. */
const MANTENER_MS = 220
/** Más que esto antes de los 220 ms es un deslizar o un scroll, no un mantener. */
const TEMBLOR = 8

const visible = (el: Element | null) => !!el && getComputedStyle(el).display !== 'none'
const fotosDe = (g: Element) => [...g.querySelectorAll<HTMLElement>('.gp-foto')]

/** La foto que se ve en la pista: la que está más cerca de su borde izquierdo. */
function actual(pista: HTMLElement) {
  const fotos = fotosDe(pista)
  const paso = fotos.length > 1 ? fotos[1].offsetLeft - fotos[0].offsetLeft : 1
  return Math.min(fotos.length - 1, Math.max(0, Math.round(pista.scrollLeft / paso)))
}

function marcar(g: HTMLElement, i: number) {
  const n = fotosDe(g).length
  const contador = g.querySelector('[data-gp-contador]')
  if (contador) contador.textContent = `${i + 1} / ${n}`
  g.querySelectorAll('.gp-puntos > span').forEach((p, j) => p.toggleAttribute('data-on', j === i))
  g.querySelectorAll('[data-gp-ir]').forEach((b, j) => b.setAttribute('aria-current', String(j === i)))
}

/** La versión zoom si la hay; si no, la que ya bajó. */
const grande = (img: HTMLImageElement) => img.dataset.zoom || img.currentSrc || img.src

document.addEventListener(
  'scroll',
  (ev) => {
    const pista = ev.target instanceof HTMLElement && ev.target.matches('[data-gp-pista]') ? ev.target : null
    const g = pista?.closest<HTMLElement>('[data-galeria]')
    if (pista && g) marcar(g, actual(pista))
  },
  { capture: true, passive: true },
)

document.addEventListener('click', (ev) => {
  const ir = (ev.target as Element).closest?.<HTMLElement>('[data-gp-ir]')
  const g = ir?.closest<HTMLElement>('[data-galeria]')
  const pista = g?.querySelector<HTMLElement>('[data-gp-pista]')
  if (!ir || !g || !pista) return
  const i = Number(ir.dataset.gpIr)
  pista.scrollLeft = fotosDe(pista)[i].offsetLeft - fotosDe(pista)[0].offsetLeft
  marcar(g, i)
})

/* ---------- Lupa al lado (escritorio) ---------- */

let conLupa: HTMLElement | null = null

function apagar() {
  conLupa?.removeAttribute('data-lupa-on')
  document.querySelector('[data-lupa-panel]')?.removeAttribute('data-on')
  conLupa = null
}

document.addEventListener('pointermove', (ev) => {
  const foto = ev.pointerType === 'mouse' ? (ev.target as Element).closest?.<HTMLElement>('.gp-foto') : null
  const g = foto?.closest<HTMLElement>('[data-galeria]')
  const panel = document.querySelector<HTMLElement>('[data-lupa-panel]')
  const lente = foto?.querySelector<HTMLElement>('.gp-lente')
  const img = foto?.querySelector('img')
  if (!foto || !g || !panel || !lente || !img || !visible(g.querySelector('.gp-chip-mouse'))) {
    if (conLupa) apagar()
    return
  }
  conLupa = g
  g.setAttribute('data-lupa-on', '')
  panel.setAttribute('data-on', '')
  // En medidas de CSS de la foto: r puede venir escalada (el canvas de Tempo hace zoom).
  const r = foto.getBoundingClientRect()
  const q = r.width / foto.offsetWidth
  const { lente: l, fondo } = lupa(
    (ev.clientX - r.left) / q,
    (ev.clientY - r.top) / q,
    { w: foto.offsetWidth, h: foto.offsetHeight },
    { w: panel.offsetWidth, h: panel.offsetHeight },
    { w: img.naturalWidth, h: img.naturalHeight },
  )
  Object.assign(lente.style, { left: `${l.x}px`, top: `${l.y}px`, width: `${l.w}px`, height: `${l.h}px` })
  const url = `url("${grande(img)}")`
  if (panel.style.backgroundImage !== url) panel.style.backgroundImage = url
  panel.style.backgroundSize = `${fondo.w}px ${fondo.h}px`
  panel.style.backgroundPosition = `${fondo.x}px ${fondo.y}px`
})
document.addEventListener('pointerout', (ev) => {
  if (!ev.relatedTarget) apagar()
})

/* ---------- Mantén para acercar (celular) ---------- */

let cerca: HTMLElement | null = null
let espera = 0
let inicio: [number, number] | null = null
let tragarClic = false

function enfocar(foto: HTMLElement, x: number, y: number) {
  const { fx, fy } = fraccion(x, y, foto.getBoundingClientRect())
  foto.querySelector('img')!.style.transformOrigin = `${fx * 100}% ${fy * 100}%`
}

/** Al acercar por primera vez cambia a la versión zoom, ya bajada, para que no parpadee. */
function subirZoom(img: HTMLImageElement) {
  const zoom = img.dataset.zoom
  if (!zoom || img.dataset.zoomPuesta) return
  img.dataset.zoomPuesta = ''
  const pre = new Image()
  pre.src = zoom
  pre
    .decode()
    .then(() => {
      img.srcset = ''
      img.src = zoom
    })
    .catch(() => {})
}

function soltar() {
  clearTimeout(espera)
  inicio = null
  if (!cerca) return
  cerca.removeAttribute('data-cerca')
  const g = cerca.closest<HTMLElement>('[data-galeria]')
  g?.setAttribute('data-usado', '')
  g?.querySelector<HTMLElement>('[data-gp-pista]')?.style.removeProperty('overflow-x')
  cerca = null
  // El clic que llega al soltar no abre el visor.
  tragarClic = true
  setTimeout(() => (tragarClic = false), 400)
}

document.addEventListener('pointerdown', (ev) => {
  const foto = (ev.target as Element).closest?.<HTMLElement>('.gp-foto')
  const g = foto?.closest('[data-galeria]')
  if (!foto || !g || !ev.isPrimary || !visible(foto.querySelector('.gp-chip-mantener'))) return
  const { clientX: x, clientY: y } = ev
  inicio = [x, y]
  clearTimeout(espera)
  espera = window.setTimeout(() => {
    cerca = foto
    enfocar(foto, x, y)
    foto.setAttribute('data-cerca', '')
    subirZoom(foto.querySelector('img')!)
    g.querySelector<HTMLElement>('[data-gp-pista]')?.style.setProperty('overflow-x', 'hidden')
  }, MANTENER_MS)
})
document.addEventListener('pointermove', (ev) => {
  if (cerca) return enfocar(cerca, ev.clientX, ev.clientY)
  if (inicio && Math.hypot(ev.clientX - inicio[0], ev.clientY - inicio[1]) > TEMBLOR) {
    clearTimeout(espera)
    inicio = null
  }
})
document.addEventListener('pointerup', soltar)
document.addEventListener('pointercancel', soltar)
// Mientras acerca, el dedo recorre la foto en vez de mover la página.
document.addEventListener(
  'touchmove',
  (ev) => {
    if (cerca) ev.preventDefault()
  },
  { passive: false },
)
// El toque largo no saca el menú de la imagen.
document.addEventListener('contextmenu', (ev) => {
  const foto = (ev.target as Element).closest?.('.gp-foto')
  if (foto && visible(foto.querySelector('.gp-chip-mantener'))) ev.preventDefault()
})
document.addEventListener(
  'click',
  (ev) => {
    if (tragarClic && (ev.target as Element).closest?.('.gp-foto')) {
      ev.stopImmediatePropagation()
      ev.preventDefault()
    }
  },
  true,
)
