import type { FotoModal } from '../components/ui/PhotoModal'

/*
 * Modal de foto (PRI-286, PhotoModal). Tocar un link con data-foto abre el <dialog> de la página con esa foto y recorre
 * las de su lista (data-fotos): flechas, ← →, deslizar y las orillas del celular. Cada foto tiene URL propia
 * (/catalogo/<categoría>/<slug>): la barra la muestra mientras está abierta (replaceState, sin pelear con el router de
 * Astro) y al cerrar vuelve la de la página. main[data-abrir] abre una foto al cargar (la página de esa URL).
 * Los listeners van en document una sola vez: con el ClientRouter este módulo corre una vez y el <dialog> cambia por página.
 */

type Estado = { lista: HTMLAnchorElement[]; i: number; j: number; opener: HTMLAnchorElement; base: string }
let estado: Estado | null = null
let deslizo = false

const modal = () => document.querySelector<HTMLDialogElement>('dialog[data-photo-modal]')
const datos = (a: HTMLAnchorElement): FotoModal => JSON.parse(a.dataset.foto!)

function pintar(d: HTMLDialogElement, e: Estado) {
  const f = datos(e.lista[e.i])
  const foto = f.fotos[e.j]
  const img = d.querySelector<HTMLImageElement>('.mx-foto')!
  img.srcset = foto.srcSet ?? ''
  img.sizes = '(min-width: 768px) 60vw, 100vw'
  img.src = foto.src
  img.alt = e.j === 0 ? f.alt : `${f.alt}, foto ${e.j + 1} de ${f.fotos.length}`
  d.querySelector('.mx-contador')!.textContent = `${e.i + 1} / ${e.lista.length}`
  d.querySelector('.mx-cat')!.textContent = f.categoria
  d.querySelector('.mx-titulo')!.textContent = f.titulo
  const desc = d.querySelector<HTMLElement>('.mx-desc')!
  desc.textContent = f.descripcion ?? ''
  desc.hidden = !f.descripcion
  d.querySelector<HTMLAnchorElement>('.mx-pedir a')!.href = f.pedir

  // Sin dar la vuelta: en la primera o la última, ese lado no se pinta.
  const ant = vecina(e, -1)
  const sig = vecina(e, 1)
  d.querySelectorAll<HTMLElement>('[data-mx="ant"]').forEach((b) => (b.hidden = !ant))
  d.querySelectorAll<HTMLElement>('[data-mx="sig"]').forEach((b) => (b.hidden = !sig))
  if (ant) d.querySelector<HTMLImageElement>('.mx-vecina-ant img')!.src = ant
  if (sig) d.querySelector<HTMLImageElement>('.mx-vecina-sig img')!.src = sig

  history.replaceState(history.state, '', e.lista[e.i].getAttribute('href'))
}

/** La foto de al lado: primero las del mismo producto, luego la foto siguiente de la lista. */
function paso(e: Estado, dir: 1 | -1): { i: number; j: number } | null {
  const n = datos(e.lista[e.i]).fotos.length
  if (dir === 1) return e.j < n - 1 ? { i: e.i, j: e.j + 1 } : e.i < e.lista.length - 1 ? { i: e.i + 1, j: 0 } : null
  return e.j > 0 ? { i: e.i, j: e.j - 1 } : e.i > 0 ? { i: e.i - 1, j: 0 } : null
}

function vecina(e: Estado, dir: 1 | -1): string | null {
  const p = paso(e, dir)
  return p ? datos(e.lista[p.i]).fotos[p.j].src : null
}

function mover(dir: 1 | -1) {
  const d = modal()
  if (!d || !estado) return
  const p = paso(estado, dir)
  if (!p) return
  Object.assign(estado, p)
  pintar(d, estado)
}

function abrir(a: HTMLAnchorElement) {
  const d = modal()
  if (!d) return false
  const lista = Array.from(a.closest('[data-fotos]')?.querySelectorAll<HTMLAnchorElement>('a[data-foto]') ?? [a])
  const base = document.querySelector<HTMLElement>('main[data-base]')?.dataset.base ?? location.pathname + location.search
  estado = { lista, i: Math.max(0, lista.indexOf(a)), j: 0, opener: a, base }
  pintar(d, estado)
  if (!d.open) {
    d.showModal()
    d.querySelector<HTMLElement>('[data-mx="cerrar"]')!.focus()
  }
  return true
}

document.addEventListener(
  'click',
  (ev) => {
    if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return
    const a = (ev.target as Element).closest?.<HTMLAnchorElement>('a[data-foto]')
    // En captura y antes que el router de Astro, que respeta defaultPrevented.
    if (a && abrir(a)) ev.preventDefault()
  },
  true,
)

document.addEventListener('click', (ev) => {
  const d = modal()
  const t = ev.target as Element
  if (!d?.open || !d.contains(t)) return
  if (deslizo) return void (deslizo = false)
  const accion = t.closest<HTMLElement>('[data-mx]')?.dataset.mx
  if (accion === 'ant') return mover(-1)
  if (accion === 'sig') return mover(1)
  // Cerrar: la X o tocar afuera de la foto y la franja.
  if (accion === 'cerrar' || !t.closest('.mx-foto, .mx-franja, .mx-pista, button, a')) d.close()
})

document.addEventListener('keydown', (ev) => {
  if (!modal()?.open) return
  if (ev.key === 'ArrowLeft') mover(-1)
  if (ev.key === 'ArrowRight') mover(1)
})

// Deslizar (celular): sobre la pista, un gesto horizontal de más de 40 px pasa de foto.
let inicio: { x: number; y: number } | null = null
document.addEventListener('pointerdown', (ev) => {
  deslizo = false
  inicio = (ev.target as Element).closest?.('dialog[open] .mx-pista') ? { x: ev.clientX, y: ev.clientY } : null
})
document.addEventListener('pointerup', (ev) => {
  if (!inicio) return
  const dx = ev.clientX - inicio.x
  const dy = ev.clientY - inicio.y
  inicio = null
  if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return
  deslizo = true
  mover(dx < 0 ? 1 : -1)
})

// Cerrar (X, afuera o Esc): vuelve la URL de la página y el foco a la foto que lo abrió.
document.addEventListener(
  'close',
  (ev) => {
    if (!(ev.target as Element).matches?.('dialog[data-photo-modal]') || !estado) return
    history.replaceState(history.state, '', estado.base)
    estado.opener.focus()
    estado = null
  },
  true,
)

document.addEventListener('astro:page-load', () => {
  const id = document.querySelector<HTMLElement>('main[data-abrir]')?.dataset.abrir
  const a = id ? document.getElementById(id) : null
  if (a instanceof HTMLAnchorElement) abrir(a)
})
