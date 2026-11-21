import { BarraPedir } from '../ui/BarraPedir'
import { Button } from '../ui/Button'
import { ColoresDisponibles } from '../ui/ColoresDisponibles'
import { Costura } from '../ui/Costura'
import { GaleriaProducto, type FotoProducto } from '../ui/GaleriaProducto'
import { Lupa } from '../ui/Lupa'
import { Monograma } from '../ui/Monograma'
import { ProductCard } from '../ui/ProductCard'
import { VisorFotos } from '../ui/VisorFotos'
import type { ProductColor } from '../../lib/types'

export type FichaProductoProps = {
  titulo: string
  categoria: { label: string; href: string }
  /** Ya formateado (precioCop); sin precio no sale nada. */
  precio: string | null
  colores?: ProductColor[]
  descripcion: string | null
  fotos: FotoProducto[]
  /** Link de "Pedir por WhatsApp" (pedirUrl). */
  pedir: string
  /** "Más de <categoría>": hasta 4 productos de la misma categoría. Sin ninguno no sale la sección. */
  otros: { titulo: string; href: string; img: { src: string; srcSet?: string } }[]
}

/** Ancho de una foto de "Más de" (PRI-555): 2 columnas con px-4 y gap-2; desde @3xl, 4 con px-12 y gap-3. */
const MAS_DE_SIZES = '(min-width: 48rem) calc(25vw - 33px), calc(50vw - 20px)'

const Volver = ({ categoria, className }: { categoria: FichaProductoProps['categoria']; className: string }) => (
  <a href={categoria.href} className={`min-h-11 items-center gap-1.5 text-[14px] text-muted no-underline ${className}`}>
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
    {categoria.label}
  </a>
)

/**
 * Ficha de producto (PRI-529, prototipo v7 aprobado): la página propia de /catalogo/<categoría>/<slug>/. Celular y
 * escritorio son el mismo markup: la galería y las @3xl: miden .pf (desde 48rem = escritorio). En el celular el pedido
 * va en la BarraPedir y en escritorio junto a la información: un solo WhatsApp por pantalla (la página va sin
 * WhatsAppFab). La interacción es de src/scripts/lupa.ts y visor-fotos.ts (los importa la página).
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/canvases/ficha-producto/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas stays consistent.
 */
export function FichaProducto({ titulo, categoria, precio, colores = [], descripcion, fotos, pedir, otros }: FichaProductoProps) {
  return (
    <>
      <div className="pf font-body text-ink">
        <main className="pf-v">
          <Volver categoria={categoria} className="mx-4 mt-1 inline-flex @3xl:hidden" />
          {/* Mientras la lupa está encendida se esconden la costura y la S: el panel tapa la información. */}
          {/* Escritorio: el volver va solo en la primera fila, arriba de la foto y al hilo de la galería (PRI-550); la costura y la información se estiran solo en la segunda, la de la foto. */}
          <div className="flex flex-col gap-5 pt-1 pb-6 @3xl:grid @3xl:grid-cols-[max-content_max-content_minmax(0,495px)] @3xl:justify-center @3xl:gap-0 @3xl:px-12 @3xl:pt-4 @3xl:pb-14 [&:has(.lupa[data-on])_.costura]:invisible [&:has(.lupa[data-on])_.monograma]:invisible">
            <Volver categoria={categoria} className="-ml-1.5 hidden justify-self-start @3xl:col-span-3 @3xl:inline-flex" />
            <GaleriaProducto fotos={fotos} />
            <div className="mx-4 mt-1 @3xl:hidden">
              <Costura orientacion="horizontal" />
            </div>
            <div className="ml-16 hidden @3xl:flex">
              <Costura />
            </div>
            <div className="anim-enter relative mx-4 -mt-5 flex min-w-0 flex-col gap-5 pt-7 pb-2 @3xl:mx-0 @3xl:mt-0 @3xl:justify-center @3xl:gap-[22px] @3xl:py-6 @3xl:pl-16 [&>:not(.monograma):not(.lupa)]:relative">
              <Monograma className="absolute left-1/2 top-[52%] w-[72%] max-w-[300px] -translate-x-1/2 -translate-y-1/2 @3xl:left-[calc(50%+32px)] @3xl:top-1/2 @3xl:h-[80%] @3xl:w-auto @3xl:max-w-none" />
              <Lupa className="[--lupa-inset:0_0_0_32px]" />
              <h1 className="font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-balance wrap-anywhere @3xl:text-[44px]">{titulo}</h1>
              {precio && <p className="text-[22px] font-semibold tabular-nums text-secondary @3xl:text-[26px]">{precio}</p>}
              {colores.length > 0 && (
                <div>
                  <h2 className="mb-2.5 text-[13px] font-semibold text-muted">
                    {colores.length === 1 ? 'Viene en 1 color' : `Viene en ${colores.length} colores`}
                  </h2>
                  <ColoresDisponibles colores={colores} variante="pildoras" />
                </div>
              )}
              {descripcion && <p className="max-w-[60ch] text-[15px] leading-[1.55] text-muted @3xl:text-[17px]">{descripcion}</p>}
              <div className="hidden max-w-[420px] @3xl:block">
                <Button variant="whatsapp" href={pedir} external fullWidth>
                  Pedir por WhatsApp
                </Button>
              </div>
            </div>
          </div>
          {otros.length > 0 && (
            <section className="border-t border-line px-4 pt-2 pb-6 @3xl:px-12 @3xl:pb-14">
              <div className="flex items-center justify-between pt-7 pb-4">
                <h2 className="text-[22px] font-semibold">Más de {categoria.label}</h2>
                <Button variant="ghost" href={categoria.href} oro>
                  Ver todo
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 @3xl:grid-cols-4 @3xl:gap-3">
                {otros.map((o, i) => (
                  <ProductCard key={i} name={o.titulo} image={{ ...o.img, sizes: MAS_DE_SIZES, alt: '' }} href={o.href} />
                ))}
              </div>
            </section>
          )}
          <BarraPedir href={pedir} />
        </main>
      </div>
      <VisorFotos titulo={titulo} />
    </>
  )
}
