import type { FotoProducto } from '../components/ui/GaleriaProducto'
import { AJUSTADA, alterna, gesto, limita, paso, pellizco, rueda, type Vista } from '../lib/zoom'

/*
 * Visor de fotos de la ficha de producto (PRI-529, VisorFotos). Tocar una foto [data-visor-abrir] de una GaleriaProducto
 * abre el <dialog data-visor> de la página con las fotos de esa galería (data-fotos), en esa foto.
 * Zoom (cuentas en src/lib/zoom.ts): rueda hacia el puntero, + − Ajustar, arrastrar, pellizco y doble toque o doble clic.
 * Con la foto ajustada, deslizar de lado cambia de foto y hacia abajo cierra (solo con el dedo).
 * Teclado: ← →, Enter o espacio sobre la foto, Esc (lo da showModal) y Tab que no sale del visor; al cerrar, el foco
 * vuelve a la foto que lo abrió. La versión zoom de la foto se pide al mostrarla y reemplaza a la normal cuando ya bajó.
 * Los listeners de la página van en document una sola vez; los de la zona (rueda, dedos) se montan en el primer uso de
 * cada <dialog>, porque con el ClientRouter cambia por página.
 */

/** Dos toques más juntos que esto y a menos de 30 px son doble toque. */
const DOBLE_MS = 320

let fotos: FotoProducto[] = []
let i = 0
let v: Vista = AJUSTADA
let opener: HTMLElement | null = null

const visor = () => document.querySelector<HTMLDialogElement>('dialog[data-visor]')
const zonaDe = (d: HTMLDialogElement) => d.querySelector<HTMLElement>('[data-vf-zona]')!
const fotoDe = (d: HTMLDialogElement) => d.querySelector<HTMLImageElement>('.vf-foto')!

function pintar(d: HTMLDialogElement, anima: boolean) {
  const z = zonaDe(d)
  v = limita(v, z.offsetWidth, z.offsetHeight)
  z.toggleAttribute('data-anima', anima)
  fotoDe(d).style.transform = `translate(${v.tx}px, ${v.ty}px) scale(${v.s})`
  const cerca = v.s > 1
  z.toggleAttribute('data-z', cerca)
  d.toggleAttribute('data-z', cerca)
  d.querySelector('[data-vf-pct]')!.textContent = `${Math.round(v.s * 100)} %`
}

function mostrar(d: HTMLDialogElement, j: number) {
  i = (j + fotos.length) % fotos.length
  const f = fotos[i]
  const img = fotoDe(d)
  // La foto nueva entra con su animación (vf-entra): se reinicia quitándola un cuadro.
  img.style.animation = 'none'
  void img.offsetWidth
  img.style.removeProperty('animation')
  img.srcset = f.srcSet ?? ''
  img.sizes = '100vw'
  img.src = f.src
  img.alt = f.alt
  if (f.zoom) {
    const zoom = f.zoom
    const pre = new Image()
    pre.src = zoom
    pre
      .decode()
      .then(() => {
        if (d.open && fotos[i] === f) {
          img.srcset = ''
          img.src = zoom
        }
      })
      .catch(() => {})
  }
  d.querySelector('[data-vf-contador]')!.textContent = fotos.length > 1 ? `${i + 1} / ${fotos.length}` : ''
  zonaDe(d).setAttribute('aria-label', `${f.alt}. Enter para acercar o alejar`)
  d.querySelectorAll('[data-vf-ir]').forEach((b, k) => b.setAttribute('aria-current', String(k === i)))
  v = AJUSTADA
  pintar(d, false)
}

function miniaturas(d: HTMLDialogElement) {
  d.querySelector('[data-vf-minis]')!.replaceChildren(
    ...(fotos.length > 1 ? fotos : []).map((f, k) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.dataset.vfIr = String(k)
      b.setAttribute('aria-label', `Foto ${k + 1}`)
      const img = document.createElement('img')
      img.src = f.src
      img.alt = ''
      b.append(img)
      return b
    }),
  )
}

/** Rueda, dedos y teclado de la zona de la foto: una vez por <dialog>. */
function montar(d: HTMLDialogElement) {
  const z = zonaDe(d)
  if (z.dataset.montada) return
  z.dataset.montada = ''
  const w = () => z.offsetWidth
  const h = () => z.offsetHeight
  const local = (ev: PointerEvent | WheelEvent): [number, number] => {
    const r = z.getBoundingClientRect()
    const q = r.width / z.offsetWidth
    return [(ev.clientX - r.left) / q, (ev.clientY - r.top) / q]
  }
  const dedos = new Map<number, [number, number]>()
  let ini: { v: Vista; d: number; m: [number, number] } | null = null
  let primero: [number, number] | null = null
  let mov = 0
  let ultimo = 0
  let ultimoXY: [number, number] = [0, 0]
  const entre = ([a, b]: [number, number][]) => ({ d: Math.hypot(a[0] - b[0], a[1] - b[1]), m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as [number, number] })

  z.addEventListener(
    'wheel',
    (ev) => {
      ev.preventDefault()
      const [x, y] = local(ev)
      v = rueda(v, ev.deltaY, x, y, w(), h())
      pintar(d, false)
    },
    { passive: false },
  )
  z.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return
    ev.preventDefault()
    v = alterna(v, w() / 2, h() / 2, w(), h())
    pintar(d, true)
  })
  z.addEventListener('pointerdown', (ev) => {
    z.setPointerCapture(ev.pointerId)
    const q = local(ev)
    dedos.set(ev.pointerId, q)
    mov = 0
    primero = dedos.size === 1 ? q : null
    if (dedos.size === 2) ini = { v, ...entre([...dedos.values()]) }
  })
  z.addEventListener('pointermove', (ev) => {
    const ant = dedos.get(ev.pointerId)
    if (!ant) return
    const q = local(ev)
    dedos.set(ev.pointerId, q)
    mov += Math.hypot(q[0] - ant[0], q[1] - ant[1])
    if (dedos.size === 2 && ini) {
      const { d: dist, m } = entre([...dedos.values()])
      v = pellizco(ini.v, ini.d, dist, ini.m, m, w(), h())
    } else if (dedos.size === 1 && v.s > 1) {
      v = { s: v.s, tx: v.tx + q[0] - ant[0], ty: v.ty + q[1] - ant[1] }
    } else return
    pintar(d, false)
  })
  const suelta = (ev: PointerEvent) => {
    const fin = dedos.get(ev.pointerId)
    if (!fin) return
    dedos.delete(ev.pointerId)
    if (dedos.size < 2) ini = null
    if (dedos.size) return
    if (ev.type === 'pointerup') {
      if (v.s === 1 && primero && ev.pointerType === 'touch') {
        const g = gesto(fin[0] - primero[0], fin[1] - primero[1], fotos.length)
        if (g === 'cerrar') return d.close()
        if (g) return mostrar(d, i + (g === 'siguiente' ? 1 : -1))
      }
      if (mov < 10) {
        const t = performance.now()
        if (t - ultimo < DOBLE_MS && Math.hypot(fin[0] - ultimoXY[0], fin[1] - ultimoXY[1]) < 30) {
          ultimo = 0
          v = alterna(v, fin[0], fin[1], w(), h())
          return pintar(d, true)
        }
        ultimo = t
        ultimoXY = fin
      }
    }
    if (v.s < 1.05) {
      v = AJUSTADA
      pintar(d, true)
    }
  }
  z.addEventListener('pointerup', suelta)
  z.addEventListener('pointercancel', suelta)
}

document.addEventListener('click', (ev) => {
  const t = ev.target as Element
  const abrir = t.closest?.<HTMLElement>('[data-visor-abrir]')
  const g = abrir?.closest<HTMLElement>('[data-galeria]')
  const d = visor()
  if (abrir && g && d) {
    fotos = JSON.parse(g.dataset.fotos!)
    if (!fotos.length) return
    opener = abrir
    d.dataset.n = String(fotos.length)
    miniaturas(d)
    montar(d)
    d.showModal()
    mostrar(d, Number(abrir.dataset.visorAbrir))
    d.querySelector<HTMLElement>('[data-vf="cerrar"]')!.focus()
    return
  }
  if (!d?.open) return
  const accion = t.closest?.<HTMLElement>('[data-vf]')?.dataset.vf
  const ir = t.closest?.<HTMLElement>('[data-vf-ir]')
  const z = zonaDe(d)
  if (accion === 'cerrar') d.close()
  else if (accion === 'ant' || accion === 'sig') mostrar(d, i + (accion === 'sig' ? 1 : -1))
  else if (accion === 'mas' || accion === 'menos') {
    v = paso(v, accion === 'mas' ? 1 : -1, z.offsetWidth, z.offsetHeight)
    pintar(d, true)
  } else if (accion === 'ajustar') {
    v = AJUSTADA
    pintar(d, true)
  } else if (ir) mostrar(d, Number(ir.dataset.vfIr))
})

document.addEventListener('keydown', (ev) => {
  const d = visor()
  if (!d?.open) return
  if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
    if (fotos.length > 1) mostrar(d, i + (ev.key === 'ArrowRight' ? 1 : -1))
  } else if (ev.key === 'Tab') {
    // showModal ya deja inerte el resto de la página; esto además evita que el foco salga a la barra del navegador.
    const f = [...d.querySelectorAll<HTMLElement>('button, [tabindex="0"]')].filter(
      (el) => el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden',
    )
    const k = f.indexOf(document.activeElement as HTMLElement)
    if (ev.shiftKey && k <= 0) {
      ev.preventDefault()
      f.at(-1)?.focus()
    } else if (!ev.shiftKey && k === f.length - 1) {
      ev.preventDefault()
      f[0]?.focus()
    }
  }
})

// close no burbujea: se escucha en la captura. Esc, la X y deslizar hacia abajo terminan aquí.
document.addEventListener(
  'close',
  (ev) => {
    if (!(ev.target instanceof HTMLDialogElement) || !ev.target.matches('[data-visor]')) return
    v = AJUSTADA
    opener?.focus({ preventScroll: true })
    opener = null
  },
  true,
)
