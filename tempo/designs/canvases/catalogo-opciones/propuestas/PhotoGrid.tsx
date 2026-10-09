import { Button } from '../../../../../src/components/ui/Button'

/** Una foto del catálogo. n = número estable dentro de su categoría; href = su visor. Sin nombre ni descripción. */
export type Photo = { n: number; src: string; alt: string; href: string }

const FOCUS = 'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent'

/**
 * Una foto que abre su visor. Cuadrada (las del catálogo son 3:4 con la prenda al centro: el cuadrado la muestra
 * entera), sin texto encima. Mientras carga se ve la trama del marco; width/height fijos, así no salta nada.
 * id f-<n>: el "volver" del visor cae justo en esta foto. view-transition-name: la foto crece hasta el visor
 * (ClientRouter ya hace transiciones entre páginas; con reducir movimiento no se anima).
 */
export function PhotoTile({ photo, eager = false, rounded = false }: { photo: Photo; eager?: boolean; rounded?: boolean }) {
  return (
    <a
      href={photo.href}
      id={`f-${photo.n}`}
      className={`fabric group block aspect-square overflow-hidden bg-surface-2 ${rounded ? 'rounded-tile' : '@3xl:rounded-tile'} ${FOCUS}`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        width={320}
        height={320}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={{ viewTransitionName: `foto-${photo.n}` }}
        className="reveal-wipe size-full object-cover transition-transform duration-(--motion-med) ease-(--ease-out) group-hover:scale-[1.04]"
      />
    </a>
  )
}

type More = { href: string; shown: number; total: number; state?: 'idle' | 'loading' | 'error' }

/**
 * PROPUESTA (PRI-130). Va a src/components/ui/PhotoGrid.tsx cuando Said apruebe el canvas
 * tempo/designs/canvases/catalogo-opciones; ahí se declara su asset en el canvas de cards.
 *
 * Galería de fotos de una categoría. dense: 3 columnas pegadas en el celular y 6 en desktop, para recorrer
 * cientos; comfy: 2 y 4 con aire, fotos más grandes. Las primeras 9 cargan de una; el resto, lazy.
 * Muchas fotos: el HTML trae bloques de 60. more pinta el cierre del bloque: cuántas se ven y "Ver 60 más",
 * que es un link a la página estática siguiente (/products/<cat>/p/2) y funciona sin JS. Con JS (~15 líneas)
 * trae ese HTML y agrega las fotos aquí mismo (state loading); si falla, queda el aviso y el mismo botón (error).
 * Sin scroll infinito: el footer se alcanza y el cliente decide cuándo gastar datos.
 */
export function PhotoGrid({ photos, size = 'dense', more }: { photos: Photo[]; size?: 'dense' | 'comfy'; more?: More }) {
  const next = more ? Math.min(60, more.total - more.shown) : 0
  return (
    <div className="@container font-body">
      <ul className={size === 'dense' ? 'grid grid-cols-3 gap-1 @3xl:grid-cols-6 @3xl:gap-2' : 'grid grid-cols-2 gap-3 @3xl:grid-cols-4 @3xl:gap-4'}>
        {photos.map((p, i) => (
          <li key={p.href}>
            <PhotoTile photo={p} eager={i < 9} rounded={size === 'comfy'} />
          </li>
        ))}
      </ul>
      {more && next > 0 && (
        <div aria-live="polite" className="mt-6 flex flex-col items-center gap-3 px-4 text-center">
          {more.state === 'error' ? (
            <p className="text-[15px] text-ink">No cargaron las fotos. Revisa la señal y toca otra vez.</p>
          ) : (
            <p className="text-[14px] text-muted">
              Viendo {more.shown} de {more.total} fotos
            </p>
          )}
          {more.state === 'loading' ? (
            <Button variant="secondary">Cargando {next} más…</Button>
          ) : (
            <Button variant="secondary" href={more.href}>
              {more.state === 'error' ? 'Intentar otra vez' : `Ver ${next} más`}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * PROPUESTA, solo para la opción C: una categoría como estante (título, conteo, "Ver las N" y una fila de fotos
 * que se desliza en el celular; 6 en fila desde @3xl). Si Said elige C, va junto a PhotoGrid.
 */
export function PhotoShelf({ label, href, count, photos }: { label: string; href: string; count: number; photos: Photo[] }) {
  return (
    <section className="@container font-body" aria-label={label}>
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-display text-[22px] font-medium leading-tight @3xl:text-[28px]">
          {label} <span className="font-body text-[14px] font-normal text-muted">{count} fotos</span>
        </h2>
        <Button variant="ghost" href={href}>
          Ver las {count} →
        </Button>
      </div>
      <ul className="-mx-4 mt-3 grid snap-x scroll-px-4 auto-cols-[38%] grid-flow-col gap-2 overflow-x-auto px-4 [scrollbar-width:none] @3xl:mx-0 @3xl:grid-flow-row @3xl:grid-cols-6 @3xl:overflow-visible @3xl:px-0">
        {photos.map((p) => (
          <li key={p.href} className="snap-start">
            <PhotoTile photo={p} rounded />
          </li>
        ))}
      </ul>
    </section>
  )
}
