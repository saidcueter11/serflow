/**
 * Prenda de "Disponible ahora". Toda la card es un solo link.
 * confirmedLabel va como texto dorado y no como StatusPill: en el grid de 2 columnas
 * a 375px la píldora parte "Confirmado hace 2 días" en dos líneas.
 * La card es fluida (w-full): el ancho lo pone la lista. En una fila con scroll
 * horizontal la lista fija la columna (auto-cols-[200px]); en un grid, la columna
 * del grid. Así hay un solo componente y ninguna prop de tamaño.
 * Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/cards/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset
 * declaration stay consistent.
 */
export function ProductCard({
  name,
  meta,
  image,
  href,
  confirmedLabel,
}: {
  name: string;
  /** Color y tallas, p. ej. "Blanca · S a XL". */
  meta: string;
  image: { src: string; alt: string };
  href: string;
  /** Cuándo se confirmó que hay stock, p. ej. "Confirmado hace 2 días". Omitir si no se sabe. */
  confirmedLabel?: string;
}) {
  return (
    <a
      href={href}
      className="group block w-full overflow-hidden rounded-card border border-line bg-surface text-ink no-underline transition-[transform,border-color] duration-(--motion-slow) ease-out hover:-translate-y-1 hover:border-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="overflow-hidden">
        <img
          src={image.src}
          alt={image.alt}
          width={400}
          height={300}
          loading="lazy"
          decoding="async"
          className="fabric reveal-wipe aspect-[4/3] h-auto w-full bg-surface-2 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col items-start gap-1 p-3">
        {confirmedLabel && <span className="text-[12px] font-semibold leading-tight text-accent">{confirmedLabel}</span>}
        <h3 className="font-display text-[15px] font-bold leading-tight">{name}</h3>
        <p className="text-[13px] text-muted">{meta}</p>
      </div>
    </a>
  );
}
