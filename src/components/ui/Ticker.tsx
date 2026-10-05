/**
 * Cinta dorada que corre de lado a lado con frases cortas (para qué sirve lo que hace Serflow).
 * Va duplicada para que el bucle no tenga salto; la copia está oculta a lectores de pantalla.
 * Se queda quieta con "reducir movimiento". Una por página. Markup estático, sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/motion/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Ticker({ items }: { items: string[] }) {
  const row = (copy: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={copy || undefined}>
      {items.map((t) => (
        <li key={t} className="flex items-center gap-6 pr-6 font-display text-[18px] font-medium text-accent">
          {t}
          <span aria-hidden="true" className="text-secondary/60">
            ✦
          </span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="overflow-hidden border-y border-line bg-surface py-3">
      <div className="anim-ticker flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
