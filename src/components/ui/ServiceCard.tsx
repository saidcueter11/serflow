type Visual = "estampado" | "dtf" | "bordado";

/**
 * Un servicio del taller (Estampado, DTF, Bordado...) dentro de una lista de N items, sin caja (PRI-286).
 * Celular: una fila con la foto 4:5 de 112 px y el texto al lado. Desde @3xl: la foto cuadrada arriba (no pesa más
 * que Disponible ahora) y el texto debajo. Arriba va una muestra solo con CSS (0 KB) según `visual`; sin `visual`
 * (servicios nuevos) sale una muestra neutra de tela. Si el cliente sube una foto real de la técnica, `image`
 * reemplaza la muestra. En la portada van de 2 a 6 (PRI-413); .pf-servicios acomoda la rejilla según cuántas haya.
 * Markup estático: Astro lo renderiza sin JS.
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
  image?: { src: string; srcSet?: string; alt: string };
}) {
  return (
    <article className="group sf-foto reveal-up grid grid-cols-[112px_minmax(0,1fr)] items-start gap-x-4 @3xl:block">
      {image ? (
        <div className="overflow-hidden rounded-tile">
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.srcSet ? "(min-width: 48rem) 50vw, 112px" : undefined}
            alt={image.alt}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            className="reveal-wipe aspect-[4/5] h-auto w-full bg-surface-2 object-cover @3xl:aspect-square"
          />
        </div>
      ) : (
        <Swatch visual={visual} />
      )}
      <div className="sf-foto-texto @3xl:mt-4">
        <h3 className="font-display text-[18px] font-medium leading-tight text-ink @3xl:text-[22px]">{title}</h3>
        <p className="mt-1.5 text-[16px] leading-normal text-muted @3xl:mt-2">{description}</p>
      </div>
    </article>
  );
}

const SWATCH = "aspect-[4/5] rounded-tile @3xl:aspect-square";

function Swatch({ visual }: { visual?: Visual }) {
  if (visual === "dtf")
    return (
      <div aria-hidden="true" className={`relative overflow-hidden bg-[linear-gradient(135deg,var(--color-secondary),var(--color-accent)_55%,var(--color-ink))] ${SWATCH}`}>
        <div className="absolute -left-4 top-0 h-full w-10 rotate-12 bg-white/40 blur-[6px]" />
      </div>
    );
  if (visual === "bordado")
    return (
      <div aria-hidden="true" className={`fabric flex items-center justify-center bg-surface-2 ${SWATCH}`}>
        <div className="h-10 w-3/4 max-w-24 rounded-full border-[3px] border-dashed border-accent shadow-[inset_0_2px_0_rgb(255_255_255/0.15)]" />
      </div>
    );
  if (visual === "estampado")
    return (
      <div aria-hidden="true" className={`relative overflow-hidden bg-secondary ${SWATCH}`}>
        <div className="fabric absolute inset-0 mix-blend-multiply" />
      </div>
    );
  return <div aria-hidden="true" className={`fabric border border-line bg-surface-2 ${SWATCH}`} />;
}
