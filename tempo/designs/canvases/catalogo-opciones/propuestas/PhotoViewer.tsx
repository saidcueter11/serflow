import { Button } from '../../../../../src/components/ui/Button'
import { whatsappUrl } from '../../../../../src/lib/business'
import type { Photo } from './PhotoGrid'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'} />
    </svg>
  )
}

function Arrow({ href, dir }: { href?: string; dir: 'left' | 'right' }) {
  if (!href) return null
  return (
    <a
      href={href}
      data-astro-history="replace"
      aria-label={dir === 'left' ? 'Foto anterior' : 'Foto siguiente'}
      className={`absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-primary/80 text-ink transition-colors duration-(--motion-fast) hover:border-accent hover:text-accent ${dir === 'left' ? 'left-2 @4xl:left-4' : 'right-2 @4xl:right-4'} ${FOCUS}`}
    >
      <Chevron dir={dir} />
    </a>
  )
}

type Props = {
  photo: Photo
  category: { label: string; href: string }
  prevHref?: string
  nextHref?: string
  /** Mensaje de "Pedir esta por WhatsApp" (categoría + número + link). */
  waText: string
  /** Solo si el admin escribió una de verdad. Nunca el nombre: puede no existir o ser relleno ("Beisbol #26"). */
  description?: string
  /** page: el visor es su propia página (opciones A y C). layer: capa encima de la galería (opción B). */
  variant?: 'page' | 'layer'
}

/**
 * PROPUESTA (PRI-130). Va a src/components/ui/PhotoViewer.tsx cuando Said apruebe el canvas
 * tempo/designs/canvases/catalogo-opciones; ahí se declara su asset en el canvas de media.
 * Reemplaza ProductPreview.astro (~380 líneas, 300 de JS).
 *
 * Una foto del catálogo en grande, con lo mínimo para pedirla. La foto va entera (3:4, object-contain).
 * Título = categoría + número; no depende de nombre ni descripción.
 * - Anterior / siguiente: links a las fotos vecinas, funcionan sin JS; data-astro-history="replace" (ClientRouter)
 *   hace que no sumen historial, así Atrás vuelve a la galería y no foto por foto. Con JS (~15 líneas): deslizar
 *   con el dedo y las flechas del teclado navegan al vecino igual.
 * - Señal lenta: la miniatura (photo.thumb, ~12 KB, casi siempre ya en caché desde la galería) es el fondo del
 *   marco y la grande la tapa al llegar. Si la grande falla, un onerror de una línea (this.hidden = true) la quita
 *   para que no se vea el ícono de imagen rota: queda la miniatura y el botón funciona.
 * - Volver: link a la galería con #f-<n>, cae en la misma foto (también si llegó por un link de WhatsApp).
 * - page: debajo del Header, botón en el flujo; desde @4xl, foto a la izquierda y datos a la derecha.
 *   layer: en el sitio es un <dialog> a pantalla completa (fixed); X cierra y vuelve a la galería.
 */
export function PhotoViewer({ photo, category, prevHref, nextHref, waText, description, variant = 'page' }: Props) {
  const back = `${category.href}#f-${photo.n}`
  const title = (
    <>
      {category.label}{' '}
      <span className="whitespace-nowrap text-muted @4xl:block">
        <span className="@4xl:hidden">· </span>N.º {photo.n}
      </span>
    </>
  )
  const cta = (center: boolean) => (
    <div className="flex flex-col gap-2">
      <Button variant="whatsapp" href={whatsappUrl(waText)} external fullWidth>
        Pedir esta por WhatsApp
      </Button>
      <p className={`text-center text-[13px] leading-snug text-muted ${center ? '' : '@4xl:text-left'}`}>Se abre WhatsApp con el link de esta foto.</p>
    </div>
  )
  // La capa (B) no lleva view-transition-name: la miniatura de la galería, en el mismo documento, ya lo tiene.
  const img = (
    <>
      <div aria-hidden="true" className="absolute inset-0 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url("${photo.thumb}")` }} />
      <img
        src={photo.src}
        alt={description ?? photo.alt}
        width={900}
        height={1200}
        fetchPriority="high"
        decoding="async"
        style={variant === 'page' ? { viewTransitionName: `foto-${photo.n}` } : undefined}
        className="relative h-full w-full object-contain"
      />
    </>
  )

  if (variant === 'layer') {
    return (
      <div role="dialog" aria-modal="true" aria-label={`${category.label}, foto N.º ${photo.n}`} className="@container fixed inset-0 z-50 flex flex-col bg-primary font-body text-ink">
        <div className="flex items-center justify-between gap-3 px-4 py-2">
          <p className="font-display text-[17px] font-medium">
            {category.label} <span className="text-muted">· N.º {photo.n}</span>
          </p>
          <a href={back} aria-label="Cerrar y volver a la galería" className={`flex size-11 shrink-0 items-center justify-center rounded-full border border-line hover:border-muted ${FOCUS}`}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </a>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden bg-surface-2">
          {img}
          <Arrow href={prevHref} dir="left" />
          <Arrow href={nextHref} dir="right" />
        </div>
        <div className="mx-auto w-full max-w-[420px] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          {description && <p className="mb-3 line-clamp-2 text-center text-[14px] leading-relaxed text-muted">{description}</p>}
          {cta(true)}
        </div>
      </div>
    )
  }

  return (
    <div className="@container font-body text-ink">
      <div className="grid @4xl:grid-cols-[minmax(0,1fr)_340px] @4xl:items-start @4xl:gap-12 @4xl:px-12 @4xl:pt-6">
        <div>
          <a href={back} className={`ml-4 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-ink @4xl:hidden ${FOCUS}`}>
            <Chevron dir="left" />
            {category.label}
          </a>
          <div className="relative aspect-[3/4] overflow-hidden bg-surface-2 @4xl:aspect-auto @4xl:h-[640px] @4xl:rounded-card">
            {img}
              <Arrow href={prevHref} dir="left" />
            <Arrow href={nextHref} dir="right" />
          </div>
        </div>
        <div className="flex flex-col gap-4 px-4 pt-4 @4xl:sticky @4xl:top-6 @4xl:gap-5 @4xl:px-0 @4xl:pt-0">
          <a href={back} className={`hidden min-h-11 items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-ink @4xl:inline-flex ${FOCUS}`}>
            <Chevron dir="left" />
            Volver a {category.label}
          </a>
          <div>
            <h1 className="font-display text-[28px] font-medium leading-tight @4xl:text-[40px]">{title}</h1>
            {description && <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted @4xl:line-clamp-none @4xl:text-[16px]">{description}</p>}
          </div>
          {cta(false)}
          {(prevHref || nextHref) && <p className="hidden text-[13px] text-muted @4xl:block">También puedes pasar de foto con ← y → del teclado.</p>}
        </div>
      </div>
    </div>
  )
}
