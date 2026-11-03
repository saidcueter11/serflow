import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { Button } from './Button'
import { Aviso } from './PersonalizaCampos'
import { IconArchivo, IconCerrar, IconCheck, IconClip, IconCompartir, IconGuardar, IconSinSenal } from '../icons/PersonalizaIcons'
import { whatsappUrl } from '../../lib/business'

/**
 * Hoja "Revisa y envía" del personalizador (PRI-122, pantalla B) y su estado al volver de WhatsApp (pantalla C).
 * Celular: hoja que sube desde abajo. Escritorio (desde 896px): diálogo centrado, en dos columnas si hay vista previa.
 * Diálogo modal con el foco atrapado; Esc y "Editar mi pedido" cierran sin perder nada.
 *
 * The canvas for this component is at tempo/designs/design-system/personalizador/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */

export type TipoEnvio = 'imagen' | 'sin-imagen' | 'archivo'

export interface HojaEnvioProps {
  tipo: TipoEnvio
  mensaje: string
  /** URL del mockup JPG (la vista previa que se guarda y se manda). Sin ella, el paso 1 solo guarda el diseño. */
  vistaPrevia?: string
  /** URL del diseño original (miniatura). */
  diseno?: string
  archivo?: { nombre: string; detalle: string }
  guardada?: boolean
  /** navigator.canShare({ files }) es true: aparece Compartir. */
  compartir?: boolean
  sinSenal?: boolean
  escritorio?: boolean
  /** Pantalla C: el cliente volvió de WhatsApp. */
  vuelta?: boolean
  onCerrar?: () => void
  onGuardar?: () => void
  onCompartir?: () => void
  onAbrirChat?: () => void
  onOtra?: () => void
}

/** El texto tal como lo ve el taller: las *negritas* de WhatsApp se pintan en negrita. */
export function Mensaje({ texto }: { texto: string }) {
  return (
    <div data-mensaje className="rounded-tile border border-line bg-primary p-3.5 text-[14px] leading-[1.5]">
      {texto.split('\n').map((linea, i) => {
        const m = linea.match(/^\*(.+?)\*(.*)$/)
        return (
          <p key={i} className={linea ? '' : 'h-2'}>
            {m ? (
              <>
                <strong className="font-semibold text-ink">{m[1]}</strong>
                <span className="text-ink/85">{m[2]}</span>
              </>
            ) : (
              <span className="text-ink/85">{linea}</span>
            )}
          </p>
        )
      })}
    </div>
  )
}

function PasoHoja({ n, titulo, children }: { n: number; titulo: ReactNode; children?: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent font-display text-[13px] text-accent">{n}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-0.5">
        <p className="text-[15px] leading-snug">{titulo}</p>
        {children}
      </div>
    </li>
  )
}

function Miniatura({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <figure className="flex w-[88px] flex-col gap-1">
      <div className="h-[110px] overflow-hidden rounded-tile border border-line bg-surface-2">{children}</div>
      <figcaption className="text-[12px] text-muted">{etiqueta}</figcaption>
    </figure>
  )
}

const Imagen = ({ src, alt, contain = false }: { src: string; alt: string; contain?: boolean }) => (
  <img src={src} alt={alt} className={`h-full w-full ${contain ? 'object-contain p-2' : 'object-cover'}`} />
)

function ThumbArchivo({ nombre }: { nombre: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 p-2 text-center">
      <IconArchivo className="size-7 text-muted" />
      <span className="w-full truncate text-[12px] text-muted">{nombre}</span>
    </div>
  )
}

const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,[tabindex]:not([tabindex="-1"])'

function Marco({ titulo, cerrar, ancho = 600, onCerrar, children }: { titulo: string; cerrar: string; ancho?: number; onCerrar?: () => void; children: ReactNode }) {
  const caja = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const antes = document.activeElement as HTMLElement | null
    caja.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    const html = document.documentElement
    const overflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = overflow
      antes?.focus?.()
    }
  }, [])
  const teclas = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onCerrar?.()
    if (e.key !== 'Tab' || !caja.current) return
    const f = [...caja.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    const [primero, ultimo] = [f[0], f[f.length - 1]]
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault()
      ultimo.focus()
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault()
      primero.focus()
    }
  }
  return (
    <div className="@container fixed inset-0 z-50 font-body text-ink" onKeyDown={teclas}>
      <div className="flex h-full items-end bg-primary/75 @4xl:items-center @4xl:justify-center @4xl:p-8" onClick={(e) => e.target === e.currentTarget && onCerrar?.()}>
        <div
          ref={caja}
          role="dialog"
          aria-modal="true"
          aria-labelledby="hoja-titulo"
          className="pz-sheet flex max-h-[92%] w-full flex-col overflow-y-auto rounded-t-card border border-b-0 border-line bg-surface shadow-[0_8px_24px_rgba(0,0,0,.5)] @4xl:rounded-card @4xl:border-b"
          style={{ maxWidth: ancho }}
        >
          <span aria-hidden="true" className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line @4xl:hidden" />
          <div className="flex items-start justify-between gap-3 px-5 pb-2 pt-4">
            <h2 id="hoja-titulo" className="font-display text-[24px] font-medium leading-tight">
              {titulo}
            </h2>
            <button
              type="button"
              aria-label={cerrar}
              onClick={onCerrar}
              className="-mr-2 -mt-1 flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <IconCerrar />
            </button>
          </div>
          <div className="flex flex-col gap-5 px-5 pb-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function HojaEnvio({
  tipo,
  mensaje,
  vistaPrevia,
  diseno,
  archivo,
  guardada = false,
  compartir = false,
  sinSenal = false,
  escritorio = false,
  vuelta = false,
  onCerrar,
  onGuardar,
  onCompartir,
  onAbrirChat,
  onOtra,
}: HojaEnvioProps) {
  if (vuelta) {
    return (
      <Marco titulo="¿Ya nos llegó tu pedido?" cerrar="Cerrar" onCerrar={onCerrar}>
        <p className="text-[15px] leading-relaxed text-muted">
          {tipo === 'sin-imagen'
            ? 'Si el mensaje no salió, vuelve al chat y mándalo. Te respondemos por ahí para armar tu diseño.'
            : 'Si te faltó adjuntar algo, vuelve al chat y mándalo con el clip o el +.'}
        </p>
        {tipo !== 'sin-imagen' && (diseno || vistaPrevia || archivo) && (
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold uppercase tracking-[.08em] text-muted">Va en el chat</p>
            <div className="flex gap-3">
              {tipo === 'imagen' && diseno && (
                <Miniatura etiqueta="Tu diseño">
                  <Imagen src={diseno} alt="Tu diseño" contain />
                </Miniatura>
              )}
              {tipo === 'imagen' && vistaPrevia && (
                <Miniatura etiqueta="Vista previa">
                  <Imagen src={vistaPrevia} alt="Vista previa de tu prenda" />
                </Miniatura>
              )}
              {tipo === 'archivo' && archivo && (
                <Miniatura etiqueta="Como documento">
                  <ThumbArchivo nombre={archivo.nombre} />
                </Miniatura>
              )}
            </div>
            {tipo === 'imagen' && vistaPrevia && (
              <div>
                <Button variant="ghost" icon={<IconGuardar />} onClick={onGuardar}>
                  {escritorio ? 'Descargar las imágenes otra vez' : 'Guardar las imágenes otra vez'}
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2.5">
          {/* Vuelve al chat sin texto: el pedido ya está escrito allá y no se duplica. */}
          <Button variant="whatsapp" href={whatsappUrl('')} fullWidth>
            Volver al chat
          </Button>
          <Button variant="secondary" fullWidth onClick={onOtra}>
            Diseñar otra prenda
          </Button>
        </div>
        <p className="text-[13px] leading-snug text-muted">
          Tus elecciones siguen aquí. Si recargas la página, la imagen hay que subirla otra vez: no la guardamos en ningún lado.
        </p>
      </Marco>
    )
  }

  const conMockup = tipo === 'imagen' && !!vistaPrevia
  const columna = escritorio && conMockup
  const cuerpo = (
    <>
      {sinSenal && (
        <Aviso titulo="Estás sin señal" icono={<IconSinSenal className="mt-0.5 size-5 shrink-0 text-danger" />}>
          Abre el chat igual: WhatsApp manda el mensaje apenas vuelva.
        </Aviso>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold uppercase tracking-[.08em] text-muted">Así le llega a Serflow</p>
        <Mensaje texto={mensaje} />
      </div>

      <ol className="flex flex-col gap-5">
        {tipo === 'imagen' && (
          <PasoHoja
            n={1}
            titulo={
              escritorio
                ? conMockup
                  ? 'Descarga tu diseño y la vista previa.'
                  : 'Descarga tu diseño.'
                : conMockup
                  ? 'Guarda tu diseño y la vista previa en tu celular.'
                  : 'Guarda tu diseño en tu celular.'
            }
          >
            <div className="flex items-center gap-3">
              {vistaPrevia && !escritorio && (
                <div className="h-[72px] w-[58px] shrink-0 overflow-hidden rounded-tile border border-line">
                  <Imagen src={vistaPrevia} alt="" />
                </div>
              )}
              {guardada ? (
                <span role="status" className="flex min-h-12 items-center gap-2 text-[15px] font-semibold text-ok">
                  <IconCheck /> {escritorio ? (conMockup ? 'Descargadas' : 'Descargado') : conMockup ? 'Guardadas' : 'Guardado'}
                </span>
              ) : (
                <Button variant="secondary" icon={<IconGuardar />} onClick={onGuardar}>
                  {escritorio ? (conMockup ? 'Descargar imágenes' : 'Descargar diseño') : conMockup ? 'Guardar imágenes' : 'Guardar diseño'}
                </Button>
              )}
            </div>
            {!escritorio && !guardada && (
              <p className="text-[13px] leading-snug text-muted">
                {conMockup ? 'En iPhone se abre un menú: elige Guardar imágenes. En Android se descargan.' : 'En iPhone se abre un menú: elige Guardar imagen. En Android se descarga.'}
              </p>
            )}
          </PasoHoja>
        )}

        <PasoHoja
          n={tipo === 'imagen' ? 2 : 1}
          titulo={escritorio ? 'Abre el chat con Serflow (WhatsApp Web o la app). El mensaje ya va escrito.' : 'Abre el chat con Serflow. El mensaje ya va escrito: solo toca enviar.'}
        >
          {/* Misma pestaña (spec 6.6): funciona también en los navegadores de Instagram y TikTok. */}
          <Button variant="whatsapp" href={whatsappUrl(mensaje)} fullWidth onClick={onAbrirChat}>
            Abrir chat con Serflow
          </Button>
        </PasoHoja>

        {tipo === 'imagen' && diseno && (
          <PasoHoja
            n={3}
            titulo={
              <>
                {escritorio ? 'En el chat, haz clic en el + (o el clip ' : 'En el chat, toca el clip '}
                <IconClip className="inline size-4 align-[-2px] text-accent" />
                {escritorio ? ') y adjunta' : ' o el + y adjunta'} tu diseño{conMockup ? ' y la vista previa' : ''}
                {escritorio ? ' desde Descargas.' : conMockup ? ': están en Fotos o en Descargas, donde los guardaste.' : ': está en Fotos o en Descargas, donde lo guardaste.'}
              </>
            }
          >
            <div className="flex gap-3">
              <Miniatura etiqueta="Tu diseño">
                <Imagen src={diseno} alt="Tu diseño" contain />
              </Miniatura>
              {vistaPrevia && !escritorio && (
                <Miniatura etiqueta="Vista previa">
                  <Imagen src={vistaPrevia} alt="Vista previa de tu prenda" />
                </Miniatura>
              )}
            </div>
          </PasoHoja>
        )}

        {tipo === 'archivo' && archivo && (
          <PasoHoja
            n={2}
            titulo={
              <>
                {escritorio ? 'En el chat, haz clic en el + (o el clip ' : 'En el chat, toca el clip '}
                <IconClip className="inline size-4 align-[-2px] text-accent" />
                {escritorio ? ')' : ' o el +'}, elige <strong>Documento</strong> y manda tu archivo.
              </>
            }
          >
            <div className="flex items-center gap-3 rounded-tile border border-line bg-surface-2 p-2.5">
              <IconArchivo className="size-6 shrink-0 text-muted" />
              <span className="min-w-0 truncate text-[14px] font-semibold">{archivo.nombre}</span>
              <span className="ml-auto shrink-0 text-[13px] text-muted">{archivo.detalle}</span>
            </div>
          </PasoHoja>
        )}

        {tipo === 'sin-imagen' && <li className="text-[14px] leading-snug text-muted">En el chat te ayudamos a armar el diseño. Si tienes una foto o un dibujo de tu idea, mándalo ahí.</li>}
      </ol>

      {compartir && tipo !== 'sin-imagen' && (
        <div className="flex flex-col gap-2.5 border-t border-line pt-4">
          <p className="text-[14px] leading-snug text-muted">
            En vez de los pasos 2 y 3: si ya tienes el chat de Serflow, manda {tipo === 'archivo' ? 'el archivo' : 'las imágenes'} directo desde el menú de tu celular.
          </p>
          <Button variant="secondary" icon={<IconCompartir />} onClick={onCompartir}>
            {tipo === 'archivo' ? 'Compartir archivo' : 'Compartir imágenes'}
          </Button>
        </div>
      )}

      <div className="flex justify-center">
        <Button variant="ghost" onClick={onCerrar}>
          Editar mi pedido
        </Button>
      </div>
    </>
  )

  return (
    <Marco titulo="Revisa y envía" cerrar="Volver a editar" ancho={columna ? 920 : 600} onCerrar={onCerrar}>
      {columna ? (
        <div className="grid grid-cols-[300px_minmax(0,1fr)] gap-7">
          <figure className="flex flex-col gap-2">
            <div className="aspect-[4/5] overflow-hidden rounded-tile border border-line">
              <Imagen src={vistaPrevia!} alt="Vista previa de tu prenda" />
            </div>
            <figcaption className="text-[13px] text-muted">Esta es la vista previa que descargas y mandas con tu diseño.</figcaption>
          </figure>
          <div className="flex flex-col gap-5">{cuerpo}</div>
        </div>
      ) : (
        cuerpo
      )}
    </Marco>
  )
}
