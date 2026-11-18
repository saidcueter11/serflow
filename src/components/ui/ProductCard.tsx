import type { ProductColor } from '../../lib/types';
import { ColoresDisponibles } from './ColoresDisponibles';

/**
 * Prenda de "Disponible ahora". Toda la card es un solo link, sin caja: la foto 4:5 con radio y el pie de texto
 * debajo (PRI-286). La foto se acerca al pasar y el texto sube (sf-foto / sf-foto-texto, tokens.css).
 * confirmedLabel va como texto dorado y no como StatusPill: en el grid de 2 columnas
 * a 375px la píldora parte "Confirmado hace 2 días" en dos líneas.
 * La card es fluida (w-full): el ancho lo pone la lista; un nombre con una palabra larga se parte (wrap-anywhere) en vez
 * de ensanchar la columna y la página. Tocarla lleva a la ficha del producto (href) y la foto crece hasta ella
 * (PRI-529, movimiento.ts).
 * Con colores (PRI-455), la lista de ColoresDisponibles va debajo de meta. meta es opcional (PRI-529).
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
  colores,
}: {
  name: string;
  /** Color y tallas, p. ej. "Blanca · S a XL". Sin meta, solo el nombre ("Más de <categoría>" de la ficha). */
  meta?: string;
  image: { src: string; alt: string };
  href: string;
  /** Cuándo se confirmó que hay stock, p. ej. "Confirmado hace 2 días". Omitir si no se sabe. */
  confirmedLabel?: string;
  /** Colores disponibles (PRI-455): debajo de meta, con su nombre. Sin colores no sale nada. */
  colores?: ProductColor[];
}) {
  return (
    <a
      href={href}
      className="group sf-foto block w-full text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
        <h3 className="font-display text-[16px] font-medium leading-tight wrap-anywhere @3xl:text-[20px]">{name}</h3>
        {meta && <p className="text-[14px] text-muted @3xl:text-[15px]">{meta}</p>}
        <ColoresDisponibles colores={colores} />
      </div>
    </a>
  );
}
