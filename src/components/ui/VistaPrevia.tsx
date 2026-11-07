import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { Button } from './Button'
import { Girador, IconArchivo, IconCentrar, IconMas, IconMenos, IconReintentar, IconSinSenal, IconSubir } from '../icons/PersonalizaIcons'
import { ACEPTA } from '../../lib/personaliza/archivo'
import { ESCENA, type FotoColor, type Tecnica } from '../../lib/personaliza/datos'
import { S_MAX, aspectoArea, cajaArea, cajaDiseno, enArea, enderezar, limitar, medidasArea, tamanoCm, type Lugar } from '../../lib/personaliza/lugar'
import { dibujar, type FotoLista } from '../../lib/personaliza/motor'

/**
 * Vista previa realista (PRI-122): la foto de la prenda en el color elegido con el diseño encima, pintada por el motor
 * canvas 2D (lo que se ve es lo que se descarga). Las manijas y botones van encima, en HTML: no salen en el mockup.
 *
 * Mover, escalar y girar: tocar el diseño lo selecciona (así el scroll de la página no lo arrastra sin querer);
 * seleccionado se arrastra con un dedo, se escala y gira con dos (pellizcar) o con las manijas, y gira con la manija de
 * arriba. Un diseño chico se agarra igual: el centro siempre tiene 44 px táctiles. Alternativa sin arrastrar (WCAG 2.5.7):
 * botones − / + / Girar / Centrar, y con teclado flechas, + y −, R. La colocación es libre: el diseño solo se queda dentro de lo
 * visible de la foto. Sin guías fijas: la línea central y "Centrado" salen solo mientras se arrastra. El área de impresión
 * no se dibuja (calibra los cm); el tope del bordado se avisa sobre la foto cuando el cliente intenta pasarlo.
 *
 * Modos: vacio (sin diseño, tocar el área abre el selector de archivos), listo, procesando (brillo de carga),
 * lento (pasaron 5 s: Seguir sin vista previa), archivo (tarjeta en vez del diseño), cargando (la foto anterior
 * atenuada mientras llega la del color nuevo), sin-senal (la foto no cargó: Reintentar pide solo la foto).
 *
 * The canvas for this component is at tempo/designs/design-system/personalizador/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export type ModoVista = 'vacio' | 'listo' | 'procesando' | 'lento' | 'archivo' | 'cargando' | 'sin-senal'

export interface VistaPreviaProps {
  /** Foto preparada por el motor. Mientras carga la primera, null. */
  foto: FotoLista | null
  /** La foto como <img>, ya en el HTML: se ve sin esperar el JS de la isla y hasta que el motor pinta la primera. */
  fotoInicial?: Pick<FotoColor, 'image_url' | 'image_url_movil' | 'print_area'>
  /** "Camiseta negra" o "Camiseta negra, espalda". */
  etiqueta: string
  modo: ModoVista
  tecnica: Tecnica
  /** Diseño ya tratado para la técnica (prepararDiseno). */
  diseno?: HTMLCanvasElement | null
  lugar: Lugar
  onLugar?: (l: Lugar) => void
  /** Escala máxima del diseño (escalaMax: el bordado en camiseta va pequeño). */
  maxS?: number
  /** Ancho real del área de impresión en cm, para "unos 19 cm de ancho". */
  anchoCm: number
  /** Tarjeta de archivo (modo archivo). */
  archivo?: { nombre: string; nota?: string }
  /** "Cargando la camiseta blanca…" */
  cargando?: string
  /** Alto del recorte en px (celular, vista fija). Sin alto, la escena 4:5 completa. */
  alto?: number
  /** Pista de primer uso arriba de la foto. */
  pista?: boolean
  escritorio?: boolean
  /** Sin etiquetas ni botones (miniaturas). */
  limpia?: boolean
  /** Arranca seleccionado (para mostrar las guías y las manijas). */
  seleccionado?: boolean
  onArchivo?: (f: File) => void
  onReintentar?: () => void
  onSeguirSinVista?: () => void
}

const pct = (v: number) => `${v * 100}%`

export function VistaPrevia({
  foto,
  fotoInicial,
  etiqueta,
  modo,
  tecnica,
  diseno,
  lugar: l,
  onLugar,
  maxS = S_MAX,
  anchoCm,
  archivo,
  cargando,
  alto,
  pista = false,
  escritorio = false,
  limpia = false,
  seleccionado = false,
  onArchivo,
  onReintentar,
  onSeguirSinVista,
}: VistaPreviaProps) {
  const lienzo = useRef<HTMLCanvasElement>(null)
  const marco = useRef<HTMLDivElement>(null)
  const escena = useRef<HTMLDivElement>(null)
  const [sel, setSel] = useState(seleccionado)
  const [arrastrando, setArrastrando] = useState(false)
  const [enTope, setEnTope] = useState(false)
  const punteros = useRef(new Map<number, { x: number; y: number }>())
  const inicio = useRef<{ l: Lugar; dist: number; ang: number; x: number; y: number; manija: 'tamano' | 'giro' | null } | null>(null)

  const espera = modo === 'procesando' || modo === 'lento'
  const conDiseno = !!diseno && (modo === 'listo' || espera || modo === 'cargando')
  const ajustando = sel && conDiseno && !espera && modo !== 'cargando' && !limpia

  // El motor pinta en el canvas; mientras se arrastra, la versión rápida. Un cuadro por animationFrame.
  useEffect(() => {
    const c = lienzo.current
    if (!c || !foto) return
    const id = requestAnimationFrame(() => dibujar(c.getContext('2d')!, foto, conDiseno && !espera ? diseno! : null, l, tecnica, arrastrando))
    return () => cancelAnimationFrame(id)
  }, [foto, diseno, conDiseno, espera, l, tecnica, arrastrando])

  /** Lo visible de la foto, que la vista previa recorta. Se mide al colocar y al mover: el recorte depende del layout. */
  const ventana = () => {
    const e = escena.current!.getBoundingClientRect()
    const m = marco.current!.getBoundingClientRect()
    return {
      left: Math.max(0, (m.left - e.left) / e.width),
      top: Math.max(0, (m.top - e.top) / e.height),
      right: Math.min(1, (m.right - e.left) / e.width),
      bottom: Math.min(1, (m.bottom - e.top) / e.height),
    }
  }

  // Un diseño con otra proporción, otra foto o el tope del bordado pueden dejar la caja afuera: se vuelve a limitar.
  useEffect(() => {
    if (foto && diseno && escena.current) onLugar?.(limitar(l, diseno.width / diseno.height, foto.area, maxS, ventana()))
  }, [foto, diseno, maxS])

  if (modo === 'sin-senal') {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-3 rounded-tile px-6 text-center font-body text-ink"
        style={alto ? { height: alto } : { aspectRatio: '4 / 5' }}
      >
        <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-danger">
          <IconSinSenal className="size-6" />
        </span>
        <p className="font-display text-[18px] font-bold leading-snug">No cargó la foto de la {etiqueta.toLowerCase()}</p>
        <p className="max-w-[32ch] text-[14px] leading-relaxed text-muted">Se fue la señal. Tus elecciones siguen aquí y puedes enviar tu pedido igual, sin vista previa.</p>
        <Button variant="secondary" icon={<IconReintentar />} onClick={onReintentar}>
          Reintentar
        </Button>
      </div>
    )
  }

  const area = foto?.area
  const aspecto = area ? aspectoArea(area) : 1
  const ratio = diseno ? diseno.width / diseno.height : 1
  const caja = area && diseno ? cajaDiseno(area, l, ratio, aspecto) : null
  const set = (n: Lugar) => {
    setEnTope(n.s > maxS + 1e-6)
    onLugar?.(limitar(n, ratio, area!, maxS, ventana()))
  }
  const tamano = `unos ${tamanoCm(anchoCm, l.s)} cm de ancho`
  const centrado = Math.abs(l.cx - 0.5) < 0.01
  const bbox = area && cajaArea(area)
  // Recorte centrado en el área de impresión, sin dejar franjas vacías arriba ni abajo. En % del alto real: la página
  // de escritorio estira la vista previa más allá de `alto`; si la estira más que la escena (125cqw), la escena crece a
  // lo alto y se recorta a los lados, centrada, en vez de dejar una franja vacía arriba.
  const areaFoco = area ?? fotoInicial?.print_area
  const cajaFoco = areaFoco && cajaArea(areaFoco)
  const foco = cajaFoco ? ((cajaFoco.top + cajaFoco.bottom) / 2) * 100 : 40
  const recorte = alto
    ? { top: `clamp(min(0px, 100% - 125cqw), calc(50% - ${foco * 1.25}cqw), 0px)`, height: 'max(100%, 125cqw)' }
    : { top: '0' }

  /** Px de pantalla por unidad del área. */
  const escalaArea = () => {
    const r = escena.current!.getBoundingClientRect()
    const m = medidasArea(area!)
    return { w: (m.ancho * r.width) / ESCENA.ancho, h: (m.alto * r.height) / ESCENA.alto, r }
  }
  const r = l.r ?? 0
  /** Ángulo en grados de la recta entre dos puntos de pantalla. */
  const angulo = (a: { x: number; y: number }, b: { x: number; y: number }) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
  /** Centro del diseño en la pantalla (el giro no lo mueve). */
  const centroPantalla = () => {
    const { r: e } = escalaArea()
    const [x, y] = enArea(area!, l.cx, l.cy)
    return { x: e.left + x * e.width, y: e.top + y * e.height }
  }
  const down = (e: PointerEvent, manija: 'tamano' | 'giro' | null = null) => {
    e.stopPropagation()
    if (!sel && !manija) {
      setSel(true)
      return
    }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const ps = [...punteros.current.values()]
    const dos = ps.length > 1
    inicio.current = {
      l,
      dist: dos ? Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y) : 0,
      ang: dos ? angulo(ps[0], ps[1]) : manija === 'giro' ? angulo(centroPantalla(), { x: e.clientX, y: e.clientY }) : 0,
      x: e.clientX,
      y: e.clientY,
      manija,
    }
    setArrastrando(true)
  }
  const move = (e: PointerEvent) => {
    const i = inicio.current
    if (!i || !punteros.current.has(e.pointerId)) return
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const { w, h, r } = escalaArea()
    const ps = [...punteros.current.values()]
    const r0 = i.l.r ?? 0
    if (ps.length > 1 && i.dist) set({ ...i.l, s: (i.l.s * Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y)) / i.dist, r: enderezar(r0 + angulo(ps[0], ps[1]) - i.ang) })
    else if (i.manija === 'giro') set({ ...i.l, r: enderezar(r0 + angulo(centroPantalla(), { x: e.clientX, y: e.clientY }) - i.ang) })
    else if (i.manija) set({ ...i.l, s: (2 * Math.abs(e.clientX - (r.left + enArea(area!, i.l.cx, i.l.cy)[0] * r.width))) / w })
    else set({ ...i.l, cx: i.l.cx + (e.clientX - i.x) / w, cy: i.l.cy + (e.clientY - i.y) / h })
  }
  const up = (e: PointerEvent) => {
    punteros.current.delete(e.pointerId)
    if (punteros.current.size) return
    inicio.current = null
    setArrastrando(false)
  }
  const tecla = (e: KeyboardEvent) => {
    const d = 0.02
    const k: Record<string, Partial<Lugar>> = {
      ArrowLeft: { cx: l.cx - d },
      ArrowRight: { cx: l.cx + d },
      ArrowUp: { cy: l.cy - d },
      ArrowDown: { cy: l.cy + d },
      '+': { s: l.s + 0.06 },
      '=': { s: l.s + 0.06 },
      '-': { s: l.s - 0.06 },
      r: { r: enderezar(r + 15) },
      R: { r: enderezar(r - 15) },
    }
    if (k[e.key]) {
      e.preventDefault()
      set({ ...l, ...k[e.key] })
    }
  }
  const elegir = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (f) onArchivo?.(f)
  }

  return (
    <div
      ref={marco}
      className={`@container relative overflow-hidden bg-surface-2 font-body text-ink ${limpia ? 'h-full' : 'rounded-tile'}`}
      style={alto ? { height: alto } : { aspectRatio: '4 / 5' }}
      onPointerDown={() => setSel(false)}
    >
      <div
        ref={escena}
        className={`absolute ${alto ? 'left-1/2 -translate-x-1/2' : 'inset-x-0'} aspect-[4/5] transition-opacity duration-(--motion-med) ${modo === 'cargando' && foto ? 'opacity-40 blur-[2px]' : ''}`}
        style={recorte}
      >
        {!foto && fotoInicial && (
          <picture>
            <source media="(min-width: 896px)" srcSet={fotoInicial.image_url} />
            <img src={fotoInicial.image_url_movil} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
          </picture>
        )}
        <canvas
          ref={lienzo}
          width={ESCENA.ancho}
          height={ESCENA.alto}
          role="img"
          aria-label={`${etiqueta}${conDiseno ? ' con tu diseño' : ''}`}
          className="pz-fade absolute inset-0 h-full w-full"
        />

        {area && ajustando && arrastrando && centrado && (
          <>
            <svg viewBox={`0 0 ${ESCENA.ancho} ${ESCENA.alto}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
              <line
                x1={enArea(area, 0.5, 0)[0] * ESCENA.ancho}
                y1={enArea(area, 0.5, 0)[1] * ESCENA.alto}
                x2={enArea(area, 0.5, 1)[0] * ESCENA.ancho}
                y2={enArea(area, 0.5, 1)[1] * ESCENA.alto}
                stroke="var(--color-accent)"
                strokeOpacity=".6"
                strokeWidth="2.5"
                strokeDasharray="10 10"
              />
            </svg>
            <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent px-2 py-0.5 text-[12px] font-bold text-primary" style={{ left: pct(enArea(area, 0.5, 0)[0]), top: pct(enArea(area, 0.5, 0)[1]) }}>
              Centrado
            </span>
          </>
        )}

        {modo === 'vacio' && bbox && (
          <label
            className="absolute flex cursor-pointer flex-col items-center justify-center gap-2 rounded-tile p-2 text-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent"
            style={{ left: pct(bbox.left), top: pct(bbox.top), width: pct(bbox.right - bbox.left), height: pct(bbox.bottom - bbox.top) }}
          >
            <input type="file" accept={ACEPTA} className="sr-only" onChange={elegir} />
            <span className="flex size-11 items-center justify-center rounded-full border border-line bg-surface-2 text-ink">
              <IconSubir className="size-5" />
            </span>
            <span className="flex flex-col rounded-tile bg-primary/85 px-3 py-1.5 text-ink">
              <span className="text-[14px] font-semibold">Tu diseño va aquí</span>
              <span className="text-[12px] text-muted">{escritorio ? 'Haz clic para subirlo' : 'Toca para subirlo'}</span>
            </span>
          </label>
        )}

        {espera && caja && (
          <div className="pz-shimmer pointer-events-none absolute overflow-hidden rounded-tile bg-ink/10" style={{ left: pct(caja.left), top: pct(caja.top), width: pct(caja.width), height: pct(caja.height) }} />
        )}

        {conDiseno && caja && !espera && modo !== 'cargando' && !limpia && (
          <div
            role="group"
            tabIndex={0}
            aria-label={`Tu diseño, ${tamano}. Arrástralo para moverlo; con el teclado, flechas para moverlo, más o menos para el tamaño y R para girarlo.`}
            onPointerDown={(e) => down(e)}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onKeyDown={tecla}
            onFocus={() => setSel(true)}
            className={`absolute rounded-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent ${ajustando ? 'cursor-move ring-[1.5px] ring-accent' : 'cursor-pointer'}`}
            style={{
              left: pct(caja.left),
              top: pct(caja.top),
              width: pct(caja.width),
              height: pct(caja.height),
              transform: r ? `rotate(${r}deg)` : undefined,
              touchAction: ajustando ? 'none' : 'auto',
            }}
          >
            {/* Agarre de 44 px en el centro, encima de las manijas: un diseño chico se mueve sin tener que atinarle. */}
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 z-10 size-11 -translate-x-1/2 -translate-y-1/2" />
            {ajustando && (
              <>
                <span
                  aria-hidden="true"
                  onPointerDown={(e) => down(e, 'giro')}
                  onPointerMove={move}
                  onPointerUp={up}
                  onPointerCancel={up}
                  className="absolute -top-[60px] left-1/2 z-10 flex size-11 -translate-x-1/2 cursor-grab items-center justify-center"
                  style={{ touchAction: 'none' }}
                >
                  <span className="flex size-6 items-center justify-center rounded-full border-2 border-accent bg-ink text-primary">
                    <IconReintentar className="size-3.5" />
                  </span>
                </span>
                {(['-left-[22px] -top-[22px]', '-right-[22px] -top-[22px]', '-left-[22px] -bottom-[22px]', '-right-[22px] -bottom-[22px]'] as const).map((p) => (
                  <span
                    key={p}
                    aria-hidden="true"
                    onPointerDown={(e) => down(e, 'tamano')}
                    onPointerMove={move}
                    onPointerUp={up}
                    onPointerCancel={up}
                    className={`absolute ${p} flex size-11 cursor-nwse-resize items-center justify-center`}
                    style={{ touchAction: 'none' }}
                  >
                    <span className="size-3 rounded-[3px] border-2 border-accent bg-ink" />
                  </span>
                ))}
                <span
                  className="pointer-events-none absolute left-1/2 top-full mt-4 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary/90 px-2.5 py-1 text-[12px] font-semibold text-ink"
                  style={r ? { rotate: `${-r}deg` } : undefined}
                >
                  {tamano}
                </span>
              </>
            )}
          </div>
        )}

        {modo === 'archivo' && archivo && bbox && (
          <div className="absolute flex items-center justify-center" style={{ left: pct(bbox.left), top: pct(bbox.top), width: pct(bbox.right - bbox.left), height: pct(bbox.bottom - bbox.top) }}>
            <div className="flex max-w-full flex-col items-center gap-1.5 rounded-tile border border-line bg-primary/90 px-3 py-3 text-center">
              <IconArchivo className="size-7 text-muted" />
              <span className="max-w-[18ch] truncate text-[13px] font-semibold">{archivo.nombre}</span>
              <span className="text-[12px] leading-tight text-muted">{archivo.nota ?? 'No se puede ver aquí'}</span>
            </div>
          </div>
        )}
      </div>

      {(modo === 'cargando' || !foto) && cargando && (
        <Estado>
          <Girador /> {cargando}
        </Estado>
      )}
      {modo === 'lento' && (
        <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-primary/75 p-4 text-center">
          <span className="rounded-full bg-primary/90 px-4 py-2 text-[14px] font-semibold">Esto está tardando más de lo normal</span>
          <Button variant="secondary" icon={null} onClick={onSeguirSinVista}>
            Seguir sin vista previa
          </Button>
        </div>
      )}
      {modo === 'procesando' && (
        <div role="status" className="absolute inset-x-0 top-3 flex justify-center">
          <span className="flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-[14px] font-semibold">
            <Girador /> Preparando tu diseño…
          </span>
        </div>
      )}
      {enTope && maxS < S_MAX && modo === 'listo' && !limpia && (
        <div role="status" className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-2">
          <span className="pz-fade rounded-full bg-primary/90 px-3 py-1.5 text-center text-[13px] font-semibold">Bordado: hasta unos {tamanoCm(anchoCm, maxS)} cm de ancho</span>
        </div>
      )}
      {pista && modo === 'listo' && conDiseno && !ajustando && !enTope && !limpia && (
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
          <span className="pz-fade rounded-full bg-primary/90 px-3 py-1.5 text-[13px] font-semibold">
            {escritorio ? 'Haz clic en tu diseño para moverlo o cambiar el tamaño' : 'Toca tu diseño para moverlo o cambiar el tamaño'}
          </span>
        </div>
      )}

      {!limpia && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5">
          <span className="min-w-0 truncate rounded-full bg-primary/85 px-3 py-1 text-[12px] text-ink">
            <span className="sr-only">Vista previa: </span>
            {etiqueta}
          </span>
          {conDiseno && !espera && modo !== 'cargando' && (
            <div className="pointer-events-auto flex shrink-0 gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
              <BotonFoto etiqueta="Hacer el diseño más pequeño" onClick={() => set({ ...l, s: l.s - 0.08 })}>
                <IconMenos />
              </BotonFoto>
              <BotonFoto etiqueta="Hacer el diseño más grande" onClick={() => set({ ...l, s: l.s + 0.08 })}>
                <IconMas />
              </BotonFoto>
              <BotonFoto etiqueta="Girar el diseño" onClick={() => set({ ...l, r: enderezar(r + 15) })}>
                <IconReintentar />
              </BotonFoto>
              <BotonFoto etiqueta="Centrar el diseño" onClick={() => set({ ...l, cx: 0.5 })}>
                <IconCentrar />
              </BotonFoto>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Estado({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="absolute inset-0 flex items-center justify-center">
      <span className="flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-[14px] font-semibold">{children}</span>
    </div>
  )
}

function BotonFoto({ etiqueta, onClick, children }: { etiqueta: string; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-full border border-line bg-primary/90 text-ink transition-colors duration-(--motion-fast) hover:border-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {children}
    </button>
  )
}
