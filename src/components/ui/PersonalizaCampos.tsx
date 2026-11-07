import type { ChangeEvent, DragEvent, ReactNode } from 'react'
import { Button } from './Button'
import { Girador, IconArchivo, IconCerrar, IconCheck, IconInfo, IconSubir } from '../icons/PersonalizaIcons'
import { ACEPTA } from '../../lib/personaliza/archivo'
import { TECNICAS, type Tecnica } from '../../lib/personaliza/datos'
import { NOTA_MAX, type EstadoDiseno } from '../../lib/personaliza/mensaje'

/*
 * Piezas del formulario del personalizador (PRI-122). Controles nativos (radio, checkbox, file, textarea) para que
 * funcionen con teclado y lector de pantalla. Colores y Tecnicas son radios sin controlar: la página los lee con el
 * onChange de su <form>. Usan container queries como el resto del design system.
 *
 * The canvas for these components is at tempo/designs/design-system/personalizador/index.canvas.tsx.
 * If you adjust them in any way, ensure the canvas and its asset declarations stay consistent.
 */

const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
/** Para <label> que envuelven un input oculto: el foco está en el input, el anillo se pinta en la etiqueta. */
const FOCO_LABEL = 'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent'

/** Encabezado de paso con la escala de tarjeta (22 / 18) y el número como en "Diseña la tuya" de la portada: gris, sin círculo. */
export function Paso({ n, titulo, children }: { n: number; titulo: string; children?: ReactNode }) {
  return (
    <section aria-labelledby={`paso-${n}`} className="flex flex-col gap-4 font-body text-ink">
      <h2 id={`paso-${n}`} className="flex items-center gap-4 font-display text-[length:var(--pf-h3,18px)] font-medium leading-[1.25] tracking-[-0.01em]">
        <span className="w-4 shrink-0 font-body text-[length:var(--pf-body,16px)] text-muted tabular-nums">{n}</span>
        {titulo}
      </h2>
      {children}
    </section>
  )
}

/** Grupo de opciones con legend (fieldset nativo). valor = lo elegido, al lado del nombre. */
export function Grupo({ legend, valor, children, nota }: { legend: string; valor?: string; children?: ReactNode; nota?: string }) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-2.5 font-body text-ink">
      <legend className="mb-2.5 text-[13px] font-semibold uppercase tracking-[.08em] text-muted">
        {legend}
        {valor && <span className="normal-case tracking-normal text-ink"> · {valor}</span>}
      </legend>
      {children}
      {nota && <p className="text-[13px] leading-snug text-muted">{nota}</p>}
    </fieldset>
  )
}

/** Aviso que no bloquea: imagen pesada, pequeña, archivo que no abre o sin señal. Neutro: lo elegido sigue en pie. */
export function Aviso({ titulo, children, icono }: { titulo: string; children: ReactNode; icono?: ReactNode }) {
  return (
    <div role="status" className="flex gap-3 rounded-tile border border-line bg-surface-2 p-3.5 font-body text-ink">
      {icono ?? <IconInfo className="mt-0.5 size-5 shrink-0 text-ink" />}
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-[14px] font-semibold leading-snug">{titulo}</p>
        <p className="text-[14px] leading-snug text-muted">{children}</p>
      </div>
    </div>
  )
}

const AVISOS: Partial<Record<EstadoDiseno, { titulo: string; texto: string }>> = {
  pesada: { titulo: 'Esta imagen pesa mucho para verla aquí', texto: 'Igual nos sirve: mándala en el chat.' },
  baja: {
    titulo: 'Tu imagen es pequeña',
    texto: 'Puede verse pixelada en la prenda. Si tienes una más grande, súbela; si no, igual la revisamos en el taller.',
  },
}

function Selector({ onArchivo }: { onArchivo?: (f: File) => void }) {
  const elegir = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (f) onArchivo?.(f)
  }
  return <input type="file" accept={ACEPTA} className="sr-only" onChange={elegir} />
}

export interface CampoDisenoProps {
  estado: EstadoDiseno | 'procesando'
  /** Nombre y detalle del archivo subido ("logo.png", "PNG · 1200 × 1200 px"). */
  nombre?: string
  detalle?: string
  /** URL de la miniatura (solo si se puede mostrar). */
  miniatura?: string
  /** Interruptor "Quitar el fondo": undefined = no hay un fondo que quitar y no aparece. */
  quitarFondo?: boolean
  /** Una foto u otro fondo que no se puede quitar: se avisa. */
  fondoFijo?: boolean
  /** El último archivo no se pudo abrir: otro formato, HEIC sin soporte o dañado. */
  rechazado?: boolean
  escritorio?: boolean
  onArchivo?: (f: File) => void
  onQuitar?: () => void
  onQuitarFondo?: (quitar: boolean) => void
}

/**
 * Paso 1: subir el diseño. Un <label> con <input type="file"> (abre galería o cámara en el celular); en escritorio
 * también se puede soltar el archivo. Solo imágenes: PNG, JPG y WEBP (el iPhone convierte sus HEIC a JPG al elegirlos).
 */
export function CampoDiseno({ estado, nombre, detalle, miniatura, quitarFondo, fondoFijo = false, rechazado = false, escritorio = false, onArchivo, onQuitar, onQuitarFondo }: CampoDisenoProps) {
  const conArchivo = estado !== 'ninguno'
  const aviso = AVISOS[estado as EstadoDiseno]
  const soltar = (e: DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) onArchivo?.(f)
  }

  return (
    <div className="flex flex-col gap-3 font-body text-ink">
      {!conArchivo && (
        <>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={soltar}
            className={`group grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-0.5 rounded-card border-2 border-dashed border-line p-4 text-left transition-colors duration-(--motion-fast) hover:border-accent ${FOCO_LABEL}`}
          >
            <Selector onArchivo={onArchivo} />
            <span className="row-span-2 flex size-12 items-center justify-center rounded-full border border-line bg-surface-2 text-ink shadow-[inset_0_0_0_1px_var(--color-accent)]">
              <IconSubir className="size-6" />
            </span>
            <span className="text-[16px] font-bold">{escritorio ? 'Arrastra tu imagen aquí o elígela' : 'Subir imagen'}</span>
            <span className="text-[14px] text-muted">{escritorio ? 'PNG, JPG o WEBP' : 'Desde tu galería o la cámara'}</span>
          </label>
          <p className="-mt-1 text-[16px] leading-normal text-muted">Sube tu logo, un dibujo o una foto. Un PNG sin fondo se ve mejor.</p>
          <p className="-mt-1 text-[16px] leading-normal text-muted">Usa tu mejor imagen: si es de mala calidad, el resultado no puede hacer milagros.</p>
        </>
      )}

      {conArchivo && (
        <div className="flex items-center gap-3 rounded-tile border border-line bg-surface p-2.5">
          <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-tile border border-line bg-surface-2">
            {miniatura ? <img src={miniatura} alt="" className="h-full w-full object-contain p-1" /> : <IconArchivo className="size-7 text-muted" />}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[15px] font-semibold">{nombre}</span>
            <span className="flex items-center gap-1.5 text-[13px] text-muted">
              {estado === 'procesando' ? (
                <>
                  <Girador className="size-3.5" /> Preparando…
                </>
              ) : (
                detalle
              )}
            </span>
          </div>
          <label className={`flex min-h-11 shrink-0 cursor-pointer items-center rounded-full px-2 text-[14px] font-semibold text-accent ${FOCO_LABEL}`}>
            <Selector onArchivo={onArchivo} />
            Cambiar
          </label>
          <button type="button" aria-label="Quitar el diseño" onClick={onQuitar} className={`flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink ${FOCO}`}>
            <IconCerrar />
          </button>
        </div>
      )}

      {quitarFondo !== undefined && (
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-tile text-[15px]">
          Quitar el fondo
          <input type="checkbox" role="switch" checked={quitarFondo} onChange={(e) => onQuitarFondo?.(e.target.checked)} className="peer sr-only" />
          <span
            aria-hidden="true"
            className="relative h-7 w-12 shrink-0 rounded-full border-2 border-line bg-surface-2 transition-colors duration-(--motion-fast) after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-muted after:transition-transform after:duration-(--motion-fast) peer-checked:border-accent peer-checked:bg-accent peer-checked:after:translate-x-5 peer-checked:after:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
          />
        </label>
      )}

      {fondoFijo && <Aviso titulo="Esta imagen conserva su fondo">Aquí solo podemos quitar fondos de un solo color.</Aviso>}

      {aviso && <Aviso titulo={aviso.titulo}>{aviso.texto}</Aviso>}

      {rechazado && <Aviso titulo="No pudimos abrir este archivo">Sube una imagen PNG, JPG o WEBP. Si es una foto HEIC del iPhone, guárdala como JPG.</Aviso>}
    </div>
  )
}

/**
 * Colores de la prenda: radios con círculo de 44px y nombre debajo. Crece con la lista del admin: grilla que se
 * reparte sola (4 en una fila, 10 en dos). El elegido lleva anillo dorado y check; mientras carga su foto, girador.
 */
export function Colores({ colores, elegido, cargando }: { colores: { id: string; name: string; hex: string }[]; elegido: string; cargando?: string }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-x-1 gap-y-3 font-body text-ink">
      {colores.map((c) => {
        const sel = c.id === elegido
        const [r, g, b] = [1, 3, 5].map((i) => parseInt(c.hex.slice(i, i + 2), 16))
        const lum = 0.299 * r + 0.587 * g + 0.114 * b
        const marca = lum > 150 ? 'text-primary' : 'text-ink'
        return (
          <label key={c.id} className="flex cursor-pointer flex-col items-center gap-1.5">
            <input type="radio" name="color" value={c.id} defaultChecked={sel} className="peer sr-only" />
            <span
              className={`relative flex size-11 items-center justify-center rounded-full border ${lum < 70 ? 'border-muted' : 'border-line'} peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent ${sel ? 'ring-2 ring-accent ring-offset-2 ring-offset-primary' : ''}`}
              style={{ background: c.hex }}
            >
              {sel && (cargando === c.id ? <Girador className={`size-5 ${marca}`} /> : <IconCheck className={`size-5 ${marca}`} />)}
            </span>
            <span className={`text-center text-[12px] leading-tight ${sel ? 'font-semibold text-ink' : 'text-muted'}`}>{c.name}</span>
          </label>
        )
      })}
    </div>
  )
}

/** Muestra mini de cada técnica (la Swatch de ServiceCard a 40px). */
function Muestra({ t }: { t: Tecnica }) {
  if (t === 'bordado')
    return (
      <span aria-hidden="true" className="fabric flex size-10 shrink-0 items-center justify-center rounded-tile bg-surface-2">
        <span className="h-4 w-6 rounded-full border-2 border-dashed border-accent" />
      </span>
    )
  return (
    <span aria-hidden="true" className="relative size-10 shrink-0 overflow-hidden rounded-tile bg-secondary">
      <span className="fabric absolute inset-0 mix-blend-multiply" />
    </span>
  )
}

/**
 * Técnica: tarjetas radio con nombre y pista (para elegir sin saber de técnicas).
 */
export function Tecnicas({ opciones, elegida }: { opciones: Tecnica[]; elegida: Tecnica }) {
  return (
    <div className="grid gap-2 font-body text-ink">
      {opciones.map((id) => {
        const t = TECNICAS[id]
        return (
          <label key={id} className="cursor-pointer">
            <input type="radio" name="tecnica" value={id} defaultChecked={id === elegida} className="peer sr-only" />
            <span className="flex min-h-14 items-center gap-3 rounded-tile border border-line p-2.5 transition-colors duration-(--motion-fast) peer-checked:border-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              <Muestra t={id} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[15px] font-semibold">{t.nombre}</span>
                <span className="text-[13px] leading-snug text-muted">{t.pista}</span>
              </span>
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${id === elegida ? 'border-accent' : 'border-line'}`}>
                {id === elegida && <span className="size-2.5 rounded-full bg-accent" />}
              </span>
            </span>
          </label>
        )
      })}
    </div>
  )
}

/** Nota opcional con contador (máximo 300). */
export function Nota({ valor = '', onCambio }: { valor?: string; onCambio?: (nota: string) => void }) {
  return (
    <label className="flex flex-col gap-2 font-body text-ink">
      <span className="text-[13px] font-semibold uppercase tracking-[.08em] text-muted">
        Nota <span className="normal-case tracking-normal">(opcional)</span>
      </span>
      <textarea
        name="nota"
        rows={3}
        maxLength={NOTA_MAX}
        value={valor}
        onChange={(e) => onCambio?.(e.target.value)}
        placeholder="Ej.: el logo en dorado, tallas M y L"
        className="resize-none rounded-tile border border-line bg-surface p-3 text-[16px] text-ink placeholder:text-muted focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      <span className="self-end text-[12px] text-muted">
        {valor.length}/{NOTA_MAX}
      </span>
    </label>
  )
}

/**
 * Envío. Celular: barra fija abajo (en /personaliza reemplaza al WhatsAppFab). Escritorio: sin caja, debajo de la vista previa.
 * Abre la hoja "Revisa y envía", no WhatsApp directo. Mientras se prepara la vista previa, espera (aria-busy).
 */
export function BarraEnvio({ resumen, fija = true, esperando = false, conVista = true, onEnviar }: { resumen: string; fija?: boolean; esperando?: boolean; conVista?: boolean; onEnviar?: () => void }) {
  return (
    <div className={`${fija ? 'sticky bottom-0 z-30 border-t border-line bg-primary px-4 pb-4 pt-3' : ''} flex flex-col gap-2 font-body text-ink`}>
      <p className="truncate text-[13px] text-muted">{resumen}</p>
      <div aria-busy={esperando || undefined}>
        <Button variant="whatsapp" fullWidth icon={esperando ? <Girador className="size-5" /> : undefined} onClick={esperando ? undefined : onEnviar}>
          {esperando ? 'Preparando la vista previa…' : 'Enviar a Serflow por WhatsApp'}
        </Button>
      </div>
      <p className="text-center text-[12px] text-muted">{conVista ? 'Vista previa: el taller confirma colores y medidas.' : 'El taller confirma colores y medidas.'}</p>
    </div>
  )
}
