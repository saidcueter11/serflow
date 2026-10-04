type Visual = "estampado" | "dtf" | "bordado";

/**
 * Un servicio del taller (Estampado, DTF, Bordado...) dentro de una lista de N items.
 * Arriba va una muestra solo con CSS (0 KB) según `visual`; sin `visual` (servicios
 * nuevos) sale una muestra neutra de tela. Si el cliente sube una foto real de la
 * técnica, `image` reemplaza la muestra. Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/cards/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset
 * declaration stay consistent.
 */
export function ServiceCard({
  title,
  description,
  visual,
  image,
}: {
  title: string;
  description: string;
  visual?: Visual;
  /** Foto real de la técnica; tiene prioridad sobre la muestra CSS. */
  image?: { src: string; alt: string };
}) {
  return (
    <article className="rounded-card border border-line bg-surface p-3">
      {image ? (
        <img
          src={image.src}
          alt={image.alt}
          width={400}
          height={240}
          loading="lazy"
          decoding="async"
          className="h-24 w-full rounded-tile bg-surface-2 object-cover"
        />
      ) : (
        <Swatch visual={visual} />
      )}
      <h3 className="mt-3 font-display text-[16px] font-bold leading-tight text-ink">{title}</h3>
      <p className="mt-1 text-[14px] leading-snug text-muted">{description}</p>
    </article>
  );
}

function Swatch({ visual }: { visual?: Visual }) {
  if (visual === "dtf")
    return (
      <div aria-hidden="true" className="relative h-24 overflow-hidden rounded-tile bg-[linear-gradient(135deg,var(--color-secondary),var(--color-accent)_55%,var(--color-ink))]">
        <div className="absolute -left-4 top-0 h-full w-10 rotate-12 bg-white/40 blur-[6px]" />
      </div>
    );
  if (visual === "bordado")
    return (
      <div aria-hidden="true" className="fabric flex h-24 items-center justify-center rounded-tile bg-surface-2">
        <div className="h-10 w-24 rounded-full border-[3px] border-dashed border-accent shadow-[inset_0_2px_0_rgb(255_255_255/0.15)]" />
      </div>
    );
  if (visual === "estampado")
    return (
      <div aria-hidden="true" className="relative h-24 overflow-hidden rounded-tile bg-secondary">
        <div className="fabric absolute inset-0 mix-blend-multiply" />
      </div>
    );
  return <div aria-hidden="true" className="fabric h-24 rounded-tile border border-line bg-surface-2" />;
}
