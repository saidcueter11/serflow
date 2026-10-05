interface Props {
  /** sm 72px (esquina de una card), md 120px (encabezado de sección), lg 160px (hero). */
  size: 'sm' | 'md' | 'lg'
  /** Pose pre-renderizada (PNG/WebP, < 40 KB, lienzo 160:190). Sin pose se ve la silueta placeholder. */
  pose?: { src: string; alt: string }
  /**
   * Clip animado con transparencia (PRI-124): HEVC para Safari/iPhone, WebM VP9 para Chrome/Android, y póster.
   * Se reproduce una vez, sin sonido. Con "reducir movimiento" solo se ve el póster. Tiene prioridad sobre pose.
   */
  clip?: { hevc?: string; webm: string; poster: string; alt: string }
  /** corner: absoluta, asomada arriba a la derecha de un padre relative. Nunca fixed ni sticky. */
  placement?: 'inline' | 'corner'
}

const SIZE = {
  // caption: en sm la etiqueta se achica para no salirse de los 72px (y no tapar el texto de la card en corner).
  sm: { box: 'w-[72px]', width: 72, height: 86, caption: 'px-1.5 text-[9px] tracking-normal' },
  md: { box: 'w-[120px]', width: 120, height: 143, caption: 'px-2 text-[10px] uppercase tracking-[.08em]' },
  lg: { box: 'w-[160px]', width: 160, height: 190, caption: 'px-2 text-[10px] uppercase tracking-[.08em]' },
}

const PLACEMENT = {
  inline: 'relative',
  corner: 'pointer-events-none absolute -top-8 right-3 z-10',
}

/**
 * Mascota: Tito, un tití cabeciblanco. Máximo una visible por página, nunca sigue el scroll.
 * Con clip: video corto que se reproduce una vez (lienzo cuadrado); sin clip: pose fija o silueta.
 * La regla de "una por página" es de composición: este componente no la puede imponer.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function MascotSlot({ size, pose, clip, placement = 'inline' }: Props) {
  const s = SIZE[size]
  return (
    <figure className={`${PLACEMENT[placement]} ${s.box} flex shrink-0 flex-col items-center`}>
      {clip ? (
        <>
          <video
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster={clip.poster}
            width={s.width}
            height={s.width}
            aria-label={clip.alt}
            className="h-auto w-full motion-reduce:hidden"
          >
            {/* HEVC primero: Safari no respeta la transparencia de WebM. */}
            {clip.hevc && <source src={clip.hevc} type='video/mp4; codecs="hvc1"' />}
            <source src={clip.webm} type="video/webm" />
          </video>
          <img
            src={clip.poster}
            alt={clip.alt}
            width={s.width}
            height={s.width}
            decoding="async"
            className="hidden h-auto w-full motion-reduce:block"
          />
        </>
      ) : pose ? (
        <img
          src={pose.src}
          alt={pose.alt}
          width={s.width}
          height={s.height}
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-contain"
        />
      ) : (
        <>
          {/* Placeholder hasta que lleguen las poses de PRI-124 */}
          <svg viewBox="0 0 160 190" className="h-auto w-full" role="img" aria-label="Tití cabeciblanco saludando (placeholder)">
            <path d="M104 160 Q156 162 150 118 Q146 86 122 96" fill="none" stroke="#4a3b2e" strokeWidth="9" strokeLinecap="round" />
            <ellipse cx="80" cy="128" rx="32" ry="40" fill="#4a3b2e" />
            <ellipse cx="80" cy="136" rx="18" ry="26" fill="#e9e2cf" opacity=".9" />
            <path d="M52 112 Q30 96 36 70" fill="none" stroke="#4a3b2e" strokeWidth="9" strokeLinecap="round" />
            <circle cx="36" cy="66" r="7" fill="#2b211a" />
            <ellipse cx="80" cy="74" rx="23" ry="21" fill="#2b211a" />
            <path d="M50 70 Q46 34 68 30 Q80 8 94 30 Q116 34 110 70 Q100 50 80 48 Q60 50 50 70 Z" fill="#F4F1E6" />
            <circle cx="72" cy="74" r="3.2" fill="#F4F1E6" />
            <circle cx="88" cy="74" r="3.2" fill="#F4F1E6" />
            <path d="M74 86 Q80 90 86 86" fill="none" stroke="#F4F1E6" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <figcaption className={`${s.caption} mt-1 whitespace-nowrap rounded-full bg-surface-2 py-0.5 font-body text-muted`}>
            Tití · placeholder
          </figcaption>
        </>
      )}
    </figure>
  )
}
