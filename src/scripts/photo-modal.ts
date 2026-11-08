import type { FotoModal } from '../components/ui/PhotoModal'
import { quieto } from './quieto'

/*
 * Modal de foto (PRI-286, PhotoModal). Tocar un link con data-foto abre el <dialog> de la página con esa foto y recorre
 * las de su lista (data-fotos): flechas, ← →, deslizar y las orillas del celular. Cada foto tiene URL propia
 * (/catalogo/<categoría>/<slug>): la barra la muestra mientras está abierta (replaceState, sin pelear con el router de
 * Astro) y al cerrar vuelve la de la página. main[data-abrir] abre una foto al cargar (la página de esa URL).
 * Mientras baja la foto, el marco tiene su forma y un brillo (data-cargando); la anterior y la siguiente quedan bajadas en
 * las orillas (también en escritorio, donde no se ven), así que las flechas son instantáneas.
 * Los listeners van en document una sola vez: con el ClientRouter este módulo corre una vez y el <dialog> cambia por página.
 * Foto que crece (PRI-287, efecto 1): al tocarla, el marco arranca escalado y recortado sobre la foto del muro y crece hasta
 * su puesto, con la miniatura ya bajada debajo de la grande (nada de esperar); al cerrar vuelve a la foto que esté abierta.
 * Las animaciones son CSS (mx-crece, tokens.css), con el punto de partida en variables. Reducir movimiento y mala señal las
 * apagan: abre y cierra de una.
 * Dos ejes (PRI-433): los puntos sobre la foto son las fotos de la prenda; las flechas del contador saltan de prenda. La
 * primera vez que se abre en la página, la pista se corre un poco (data-asoma, solo en el celular) para mostrar que hay más.
 */

type Foto = FotoModal['fotos'][number]
type Estado = { lista: HTMLAnchorElement[]; i: number; j: number; opener: HTMLAnchorElement; base: string; hueco: HTMLElement | null }
let estado: Estado | null = null
let deslizo = false
let asomo = false

const modal = () => document.querySelector<HTMLDialogElement>('dialog[data-photo-modal]')
const datos = (a: HTMLAnchorElement): FotoModal => JSON.parse(a.dataset.foto!)

function ponerFoto(img: HTMLImageElement, foto: Foto) {
  img.srcset = foto.srcSet ?? ''
  img.sizes = '(min-width: 768px) 60vw, 100vw'
  img.src = foto.src
}

/** La foto que se va: una copia encima que se desliza y se apaga (mx-sale). Sin animación se quita de una. */
function despedir(marco: HTMLElement, img: HTMLImageElement) {
  const sale = img.cloneNode() as HTMLImageElement
  sale.className = 'mx-saliente'
  sale.alt = ''
  sale.style.width = `${img.offsetWidth}px`
  sale.style.height = `${img.offsetHeight}px`
  marco.append(sale)
  Promise.allSettled(sale.getAnimations().map((a) => a.finished)).then(() => sale.remove())
}

/** dir: sentido de la flecha o del gesto; 0 al abrir (solo fundido). */
function pintar(d: HTMLDialogElement, e: Estado, dir: 1 | 0 | -1 = 0) {
  const f = datos(e.lista[e.i])
  const foto = f.fotos[e.j]
  const marco = d.querySelector<HTMLElement>('.mx-marco')!
  const img = marco.querySelector<HTMLImageElement>('.mx-foto')!
  marco.style.setProperty('--mx-dir', String(dir))
  if (dir) marco.querySelector('.mx-mini')?.remove()
  if (dir && !marco.hasAttribute('data-cargando')) despedir(marco, img)
  marco.style.setProperty('--mx-r', String(foto.r ?? 0.8))
  marco.setAttribute('data-cargando', '')
  img.classList.remove('mx-entra')
  void img.offsetWidth // Para que mx-entra vuelva a empezar en la foto siguiente.
  // load llega también con la foto ya bajada: una tarea después, antes de que se vea el brillo (entra en fundido).
  img.onload = img.onerror = () => {
    marco.removeAttribute('data-cargando')
    img.classList.add('mx-entra')
  }
  ponerFoto(img, foto)
  img.alt = e.j === 0 ? f.alt : `${f.alt}, foto ${e.j + 1} de ${f.fotos.length}`
  d.querySelector('.mx-contador')!.textContent = `${e.i + 1} / ${e.lista.length}`
  d.querySelector('.mx-cat')!.textContent = f.categoria
  d.querySelector('.mx-titulo')!.textContent = f.titulo
  const desc = d.querySelector<HTMLElement>('.mx-desc')!
  desc.textContent = f.descripcion ?? ''
  desc.hidden = !f.descripcion
  const precio = d.querySelector<HTMLElement>('.mx-precio')!
  precio.textContent = f.precio ?? ''
  precio.hidden = !f.precio
  const puntos = d.querySelector<HTMLElement>('.mx-puntos')!
  puntos.hidden = f.fotos.length < 2
  puntos.replaceChildren(...f.fotos.map((_, k) => Object.assign(document.createElement('span'), { className: k === e.j ? 'mx-punto-actual' : '' })))
  d.querySelector<HTMLButtonElement>('[data-mx="prenda-ant"]')!.disabled = e.i === 0
  d.querySelector<HTMLButtonElement>('[data-mx="prenda-sig"]')!.disabled = e.i === e.lista.length - 1
  d.querySelector<HTMLAnchorElement>('.mx-pedir a')!.href = f.pedir

  // Sin dar la vuelta: en la primera o la última, ese lado no se pinta.
  const ant = vecina(e, -1)
  const sig = vecina(e, 1)
  d.querySelectorAll<HTMLElement>('[data-mx="ant"]').forEach((b) => (b.hidden = !ant))
  d.querySelectorAll<HTMLElement>('[data-mx="sig"]').forEach((b) => (b.hidden = !sig))
  if (ant) ponerFoto(d.querySelector<HTMLImageElement>('.mx-vecina-ant img')!, ant)
  if (sig) ponerFoto(d.querySelector<HTMLImageElement>('.mx-vecina-sig img')!, sig)

  history.replaceState(history.state, '', e.lista[e.i].getAttribute('href'))
  medirFranja(d)
}

/** Escritorio: la foto deja el alto que ocupa la franja de verdad (con precio y descripción pasa de las 2 líneas de nombre
 * que reserva tokens.css). Cerrado no mide nada: abrir() vuelve a medir después de showModal(). */
function medirFranja(d: HTMLDialogElement) {
  const alto = d.querySelector<HTMLElement>('.mx-lado .mx-franja')!.offsetHeight
  d.querySelector<HTMLElement>('.mx-centro')!.style.setProperty('--mx-franja', `${Math.max(88, alto)}px`)
}

/** La foto de al lado: primero las del mismo producto, luego la foto siguiente de la lista. */
function paso(e: Estado, dir: 1 | -1): { i: number; j: number } | null {
  const n = datos(e.lista[e.i]).fotos.length
  if (dir === 1) return e.j < n - 1 ? { i: e.i, j: e.j + 1 } : e.i < e.lista.length - 1 ? { i: e.i + 1, j: 0 } : null
  return e.j > 0 ? { i: e.i, j: e.j - 1 } : e.i > 0 ? { i: e.i - 1, j: 0 } : null
}

function vecina(e: Estado, dir: 1 | -1): Foto | null {
  const p = paso(e, dir)
  return p ? datos(e.lista[p.i]).fotos[p.j] : null
}

/** prenda: salta a la primera foto de la prenda de al lado, sin pasar por las demás fotos de esta. */
function mover(dir: 1 | -1, prenda = false) {
  const d = modal()
  if (!d || !estado || d.classList.contains('mx-sale')) return
  const i = estado.i + dir
  const p = prenda ? (i >= 0 && i < estado.lista.length ? { i, j: 0 } : null) : paso(estado, dir)
  if (!p) return
  Object.assign(estado, p)
  pintar(d, estado, dir)
}

/** La caja de la foto en el muro: el img no, que con el mouse encima está escalado. */
const cajaDe = (foto: HTMLElement) => foto.parentElement!.getBoundingClientRect()

/** Deja en variables el marco escalado para cubrir esa caja y recortado a ella: así se ve igual a la del muro. */
function puntoDePartida(marco: HTMLElement, T: DOMRect) {
  const M = marco.getBoundingClientRect()
  const s = Math.max(T.width / M.width, T.height / M.height)
  const dx = T.left + T.width / 2 - (M.left + M.width / 2)
  const dy = T.top + T.height / 2 - (M.top + M.height / 2)
  const x = (M.width - T.width / s) / 2
  const y = (M.height - T.height / s) / 2
  marco.style.setProperty('--mx-desde', `translate(${dx}px, ${dy}px) scale(${s})`)
  marco.style.setProperty('--mx-recorte', `inset(${y}px ${x}px round calc(var(--radius-tile) / ${s}))`)
}

/** La foto del muro se apaga mientras está arriba: es la misma que crece. */
function ocupar(e: Estado, foto: HTMLElement | null) {
  if (e.hueco) e.hueco.style.opacity = ''
  e.hueco = foto
  if (foto) foto.style.opacity = '0'
}

function abrir(a: HTMLAnchorElement, crecer = true) {
  const d = modal()
  if (!d) return false
  const lista = Array.from(a.closest('[data-fotos]')?.querySelectorAll<HTMLAnchorElement>('a[data-foto]') ?? [a])
  const base = document.querySelector<HTMLElement>('main[data-base]')?.dataset.base ?? location.pathname + location.search
  const foto = a.querySelector('img')
  const T = crecer && foto && !quieto() ? cajaDe(foto) : null
  estado = { lista, i: Math.max(0, lista.indexOf(a)), j: 0, opener: a, base, hueco: null }
  pintar(d, estado)
  if (!d.open) {
    const marco = d.querySelector<HTMLElement>('.mx-marco')!
    if (foto?.complete && foto.naturalWidth) {
      const mini = new Image()
      mini.src = foto.currentSrc
      mini.alt = ''
      mini.className = 'mx-mini'
      marco.prepend(mini)
    }
    d.classList.toggle('mx-crece', !!T)
    d.showModal()
    medirFranja(d)
    d.querySelector<HTMLElement>('[data-mx="cerrar"]')!.focus()
    if (!asomo && vecina(estado, 1) && !quieto()) {
      asomo = true
      d.querySelector<HTMLElement>('.mx-pista')!.dataset.asoma = ''
    }
    if (T) {
      puntoDePartida(marco, T)
      marco.dataset.viaje = 'crece'
      ocupar(estado, foto)
    }
  }
  return true
}

/** Cerrar: la foto vuelve a su puesto y luego se cierra. Si ya no está en pantalla, o ya iba de vuelta, se cierra de una. */
function cerrar(d: HTMLDialogElement) {
  const foto = estado?.lista[estado.i].querySelector('img')
  const T = foto && cajaDe(foto)
  if (!estado || !T || quieto() || d.classList.contains('mx-sale') || T.bottom < 0 || T.top > innerHeight) return d.close()
  const marco = d.querySelector<HTMLElement>('.mx-marco')!
  // Se mide quieto, aunque todavía venga creciendo.
  delete marco.dataset.viaje
  puntoDePartida(marco, T)
  ocupar(estado, foto)
  d.classList.add('mx-sale')
  marco.dataset.viaje = 'vuelve'
  Promise.allSettled(marco.getAnimations().map((a) => a.finished)).then(() => d.close())
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
  if (accion === 'prenda-ant') return mover(-1, true)
  if (accion === 'prenda-sig') return mover(1, true)
  // Cerrar: la X o tocar afuera de la foto, la franja y la barra (sus flechas apagadas no deben cerrarlo).
  if (accion === 'cerrar' || !t.closest('.mx-foto, .mx-franja, .mx-pista, .mx-barra, button, a')) cerrar(d)
})

// Esc: el <dialog> se cerraría solo; así vuelve a su puesto primero.
document.addEventListener(
  'cancel',
  (ev) => {
    const d = ev.target as HTMLDialogElement
    if (!d.matches?.('dialog[data-photo-modal]')) return
    ev.preventDefault()
    cerrar(d)
  },
  true,
)

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
    const d = ev.target as HTMLDialogElement
    if (!d.matches?.('dialog[data-photo-modal]') || !estado) return
    d.classList.remove('mx-crece', 'mx-sale')
    const marco = d.querySelector<HTMLElement>('.mx-marco')!
    delete marco.dataset.viaje
    delete d.querySelector<HTMLElement>('.mx-pista')!.dataset.asoma
    marco.querySelector('.mx-mini')?.remove()
    ocupar(estado, null)
    history.replaceState(history.state, '', estado.base)
    estado.opener.focus()
    estado = null
  },
  true,
)

document.addEventListener('astro:page-load', () => {
  const id = document.querySelector<HTMLElement>('main[data-abrir]')?.dataset.abrir
  const a = id ? document.getElementById(id) : null
  if (a instanceof HTMLAnchorElement) abrir(a, false)
})
