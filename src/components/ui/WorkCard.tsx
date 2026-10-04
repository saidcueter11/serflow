import { StatusPill } from "./StatusPill";

/**
 * Un trabajo hecho: foto real del pedido terminado (4:5) + qué es y con qué técnica.
 * No es link. Si no hay fotos, la sección "Trabajos hechos" completa no se renderiza
 * (eso lo decide la página, no la card). Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/cards/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset
 * declaration stay consistent.
 */
export function WorkCard({
  image,
  title,
  technique,
}: {
  image: { src: string; alt: string };
  /** Qué se hizo, sin nombrar clientes reales sin permiso, p. ej. "Gorras bordadas para un equipo de fútbol". */
  title: string;
  /** "Bordado", "DTF", "Estampado"... */
  technique?: string;
}) {
  return (
    <figure className="m-0 overflow-hidden rounded-card border border-line bg-surface">
      <img
        src={image.src}
        alt={image.alt}
        width={400}
        height={500}
        loading="lazy"
        decoding="async"
        className="aspect-[4/5] h-auto w-full bg-surface-2 object-cover"
      />
      <figcaption className="flex flex-col items-start gap-1.5 p-3">
        {technique && (
          <StatusPill tone="muted" dot={false}>
            {technique}
          </StatusPill>
        )}
        <span className="text-[14px] font-semibold leading-snug text-ink">{title}</span>
      </figcaption>
    </figure>
  );
}
