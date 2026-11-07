import { fotoAttrs, type FotoModal } from './PhotoModal';

/**
 * Prenda de "Disponible ahora". Toda la card es un solo link, sin caja: la foto 4:5 con radio y el pie de texto
 * debajo (PRI-286). La foto se acerca al pasar y el texto sube (sf-foto / sf-foto-texto, tokens.css).
 * confirmedLabel va como texto dorado y no como StatusPill: en el grid de 2 columnas
 * a 375px la píldora parte "Confirmado hace 2 días" en dos líneas.
 * La card es fluida (w-full): el ancho lo pone la lista. Con modal, tocarla abre la foto en el modal (PhotoModal)
 * y recorre las de su lista (data-fotos); sin modal, el link navega.
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
  modal,
}: {
  name: string;
  /** Color y tallas, p. ej. "Blanca · S a XL". */
  meta: string;
  image: { src: string; alt: string };
  href: string;
  /** Cuándo se confirmó que hay stock, p. ej. "Confirmado hace 2 días". Omitir si no se sabe. */
  confirmedLabel?: string;
  /** Datos del modal de foto. */
  modal?: FotoModal;
}) {
  return (
    <a
      href={href}
      className="group sf-foto block w-full text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      {...fotoAttrs(modal)}
    >
      <div className="overflow-hidden rounded-tile">
        <img
          src={image.src}
          alt={image.alt}
          width={400}
          height={500}
          loading="lazy"
          decoding="async"
          className="fabric aspect-[4/5] h-auto w-full bg-surface-2 object-cover"
        />
      </div>
      <div className="sf-foto-texto flex flex-col items-start gap-1 pt-3">
        {confirmedLabel && <span className="text-[12px] font-semibold leading-tight text-accent">{confirmedLabel}</span>}
        <h3 className="font-display text-[16px] font-medium leading-tight @3xl:text-[20px]">{name}</h3>
        <p className="text-[14px] text-muted @3xl:text-[15px]">{meta}</p>
      </div>
    </a>
  );
}
