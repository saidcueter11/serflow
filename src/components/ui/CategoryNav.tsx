export type CategoryLink = { label: string; href: string; count: number }

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Pestañas de categoría del catálogo (PRI-130). Son links (cambian la URL), no Chip: el Chip es un radio.
 * Tienen las medidas del Chip (44 px de alto, 14 px semibold, border-line / bg-accent) y el conteo de fotos
 * activas, así una categoría vacía se nota antes de tocarla. current = href de la pestaña actual.
 * Móvil: una fila con scroll lateral (la última pestaña queda cortada: eso dice que hay más).
 * Desde @3xl (768 px de ancho del contenedor) se parten en varias filas.
 * Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/labels/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function CategoryNav({ categories, current }: { categories: CategoryLink[]; current: string }) {
  return (
    <nav aria-label="Categorías" className="@container font-body">
      <ul className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] @3xl:mx-0 @3xl:flex-wrap @3xl:overflow-visible @3xl:px-0">
        {categories.map((c) => {
          const on = c.href === current
          return (
            // scroll-initial-target: la pestaña actual entra en pantalla al cargar, sin JS (Chromium; en Safari arranca al inicio).
            // Solo debajo de @3xl: arriba la fila no tiene scroll y movería la página.
            <li key={c.href} className={`shrink-0 snap-start ${on ? '@max-3xl:[scroll-initial-target:nearest]' : ''}`}>
              <a
                href={c.href}
                aria-current={on ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[14px] font-semibold transition-colors duration-(--motion-fast) ${FOCUS} ${
                  on ? 'border-accent bg-accent text-primary' : 'border-line bg-surface text-ink hover:border-muted'
                }`}
              >
                {c.label}
                <span className={`text-[12px] font-medium ${on ? 'text-primary/75' : 'text-muted'}`}>{c.count}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
