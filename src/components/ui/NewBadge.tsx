/**
 * "Nuevo": la foto se subió hace menos de 21 días (created_at, src/lib/catalog.ts). Píldora dorada con texto,
 * nunca solo color. Encima de una foto del Masonry o junto a la categoría en el visor. No la uses para promos
 * (PromoBar) ni para estados de disponibilidad (StatusPill).
 *
 * The canvas for this component is at tempo/designs/design-system/labels/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function NewBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none inline-block rounded-full bg-accent px-2.5 py-1 font-body text-[12px] font-bold uppercase leading-none tracking-[.08em] text-primary shadow-[0_2px_8px_rgba(0,0,0,.35)] ${className}`}
    >
      Nuevo
    </span>
  )
}
