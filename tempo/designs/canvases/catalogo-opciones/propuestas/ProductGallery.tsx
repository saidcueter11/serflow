export type GalleryImage = { src: string; alt: string }

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const ZOOM_ID = 'fotos-grandes'

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  )
}

/**
 * PROPUESTA (PRI-130). Va a src/components/ui/ProductGallery.tsx cuando Said apruebe el canvas
 * tempo/designs/canvases/catalogo-opciones; reemplaza ProductPreview.astro (~380 líneas, 300 de JS).
 *
 * Fotos de un producto del catálogo. Cero JS:
 * - Foto cuadrada (las del catálogo son 3:4 con la gorra al centro; el cuadrado la muestra entera sin
 *   ocupar toda la pantalla). Con varias, se desliza con el dedo (scroll-snap) y las miniaturas son
 *   links a #foto-N.
 * - Ver en grande: popover nativo (popovertarget) con todas las fotos a lo ancho; se cierra con la X,
 *   con Esc o tocando afuera. Reemplaza la lupa de hover, que no existe en el celular.
 * - Con una sola foto no hay miniaturas ni etiqueta "N fotos".
 * La primera foto es el LCP: eager + fetchpriority high y sin animación de entrada.
 * zoomOpen es solo para el canvas: pinta el popover abierto en el flujo.
 * Sin JS todo funciona. Al implementar, un script corto (~20 líneas, progresivo) mejora tres cosas:
 * - la miniatura hace scrollIntoView({ inline }) en vez de navegar a #foto-N (no llena el historial ni mueve la página);
 * - marca la miniatura activa al deslizar (IntersectionObserver);
 * - Ver en grande abre en la foto tocada (cada foto del popover tiene id grande-N).
 */
export function ProductGallery({ images, name, zoomOpen = false }: { images: GalleryImage[]; name: string; zoomOpen?: boolean }) {
  const many = images.length > 1
  return (
    <div className="flex flex-col gap-3 font-body">
      <div className="relative">
        <ul aria-label={`Fotos de ${name}`} className="flex snap-x snap-mandatory overflow-x-auto rounded-card border border-line bg-surface-2 [scrollbar-width:none]">
          {images.map((img, i) => (
            <li key={img.src + i} id={`foto-${i + 1}`} className="w-full shrink-0 snap-center">
              <button type="button" popoverTarget={ZOOM_ID} aria-label={`Ver en grande: ${img.alt}`} className={`block w-full cursor-zoom-in ${FOCUS} focus-visible:-outline-offset-4`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  width={1200}
                  height={1200}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : undefined}
                  decoding="async"
                  className="fabric aspect-square w-full bg-surface-2 object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
        {many && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-primary/85 px-3 py-1 text-[13px] font-semibold text-ink">
            {images.length} fotos
          </span>
        )}
        <button
          type="button"
          popoverTarget={ZOOM_ID}
          aria-label="Ver las fotos en grande"
          className={`absolute right-3 top-3 flex size-11 items-center justify-center rounded-full bg-primary/85 text-ink transition-colors duration-(--motion-fast) hover:text-accent ${FOCUS}`}
        >
          <ExpandIcon />
        </button>
      </div>

      {many && (
        <ul aria-label="Miniaturas" className="flex gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none]">
          {images.map((img, i) => (
            <li key={img.src + i} className="shrink-0">
              <a
                href={`#foto-${i + 1}`}
                aria-label={`Foto ${i + 1} de ${images.length}`}
                aria-current={i === 0 ? 'true' : undefined}
                className={`block size-16 overflow-hidden rounded-tile border-2 border-line bg-surface-2 aria-[current]:border-accent ${FOCUS}`}
              >
                <img src={img.src} alt="" width={128} height={128} decoding="async" className="size-full object-cover" />
              </a>
            </li>
          ))}
        </ul>
      )}

      <div
        id={ZOOM_ID}
        popover={zoomOpen ? undefined : 'auto'}
        role="dialog"
        aria-label={`Fotos de ${name} en grande`}
        className={`${zoomOpen ? 'absolute' : 'fixed'} inset-0 z-50 m-0 h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-primary p-0 text-ink`}
      >
        <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-line bg-primary px-4 py-2">
          <p className="truncate font-display text-[16px] font-bold">{name}</p>
          <button
            type="button"
            popoverTarget={ZOOM_ID}
            popoverTargetAction="hide"
            aria-label="Cerrar fotos"
            className={`flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-ink hover:border-muted ${FOCUS}`}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <ul className="mx-auto flex max-w-[900px] flex-col gap-3 p-4">
          {images.map((img, i) => (
            <li key={img.src + i} id={`grande-${i + 1}`}>
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className="h-auto w-full rounded-card bg-surface-2" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
