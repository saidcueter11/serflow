/**
 * Opción seleccionable de un grupo (talla, técnica, prenda).
 * Es un radio nativo visualmente oculto dentro de un <label>: funciona sin JS
 * (Astro lo renderiza sin client directive), con teclado (flechas dentro del
 * grupo) y con lector de pantalla. Chips del mismo grupo comparten `name`.
 *
 * The canvas for this component is at tempo/designs/design-system/labels/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset
 * declaration stay consistent.
 */
export function Chip({
  label,
  name,
  value,
  selected = false,
}: {
  label: string;
  /** Nombre del grupo de radios, p. ej. "talla". */
  name: string;
  /** Valor enviado con el formulario. Por defecto, `label`. */
  value?: string;
  /** Marcado al cargar la página (defaultChecked). */
  selected?: boolean;
}) {
  return (
    <label className="inline-flex cursor-pointer">
      <input type="radio" name={name} value={value ?? label} defaultChecked={selected} className="peer sr-only" />
      <span className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 font-body text-[14px] font-semibold text-ink transition-colors duration-(--motion-fast) peer-checked:border-accent peer-checked:bg-accent peer-checked:text-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        {label}
      </span>
    </label>
  );
}
