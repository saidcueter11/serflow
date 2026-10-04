type Kind = 'local' | 'estanterias' | 'equipo' | 'trabajo'

/** src y alt van juntos: con foto, alt es obligatorio; sin foto, ninguno. */
type Photo = { src: string; alt: string } | { src?: undefined; alt?: undefined }

type Props = Photo & {
  /** Qué muestra la foto. Fija la proporción del marco. */
  kind: Kind
  caption?: string
  /** Solo para la única foto visible al cargar (above the fold): eager + fetchpriority high. */
  priority?: boolean
}

// Proporción por tipo. width/height dan al navegador la proporción antes de descargar (sin salto de layout).
const KIND = {
  local: { box: 'aspect-[4/3] md:aspect-video', width: 1600, height: 1200 },
  estanterias: { box: 'aspect-[4/5]', width: 1200, height: 1500 },
  equipo: { box: 'aspect-[3/2]', width: 1500, height: 1000 },
  trabajo: { box: 'aspect-[4/5]', width: 1200, height: 1500 },
}

/**
 * Foto real del taller (local, estanterías, equipo, trabajos terminados).
 * Sin src no renderiza nada: una sección sin su foto desaparece, nunca muestra relleno.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function PhotoSlot(props: Props) {
  if (!props.src) return null
  const { src, alt, kind, caption, priority = false } = props
  const k = KIND[kind]
  return (
    <figure className="flex flex-col gap-2">
      <img
        src={src}
        alt={alt}
        width={k.width}
        height={k.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'auto' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`${k.box} h-auto w-full rounded-card border border-line bg-surface object-cover`}
      />
      {caption && <figcaption className="font-body text-[13px] leading-snug text-muted">{caption}</figcaption>}
    </figure>
  )
}
