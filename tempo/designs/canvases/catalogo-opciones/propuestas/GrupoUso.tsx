import { Button } from '../../../../../src/components/ui/Button'
import type { Grupo } from '../datos3'
import { FotoCard } from './Comunes'

/*
 * PROPUESTA (PRI-130, ronda 3 · dirección 3 "Fotos por uso", ref. customink.com/photos/tags/teams).
 * Cada categoría abre con una portada grande (categories.image_url) y su frase de uso, que hace el trabajo que
 * haría el nombre de la prenda. Debajo, sus fotos en cards de la portada.
 */

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const fotos = (n: number) => `${n} ${n === 1 ? 'foto' : 'fotos'}`

/** Portada del grupo: foto con degradado y la frase encima. Sin portada, la trama con la frase (no se cae). */
export function PortadaGrupo({ g, h = 'h1', enlace = true }: { g: Grupo; h?: 'h1' | 'h2'; /** false en la página de la propia categoría. */ enlace?: boolean }) {
  const H = h
  const Caja = enlace ? 'a' : 'div'
  return (
    <Caja href={enlace ? g.href : undefined} className={`group relative block overflow-hidden rounded-card border border-line bg-surface ${FOCUS}`}>
      {g.portada ? (
        <img
          src={g.portada}
          alt=""
          width={1200}
          height={600}
          loading="lazy"
          decoding="async"
          className="reveal-wipe aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100 @3xl:aspect-[16/7]"
        />
      ) : (
        <div className="fabric aspect-[16/9] w-full bg-surface-2 @3xl:aspect-[16/5]" />
      )}
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-primary via-primary/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-5 @3xl:p-10">
        <span className="text-[13px] font-semibold uppercase tracking-[.14em] text-accent">
          {g.label}
          {g.count > 0 && ` · ${fotos(g.count)}`}
        </span>
        <H className="stitch-title max-w-[16ch] font-display text-[30px] font-medium leading-[1.05] tracking-[-0.01em] text-ink @3xl:max-w-[22ch] @3xl:text-[46px]">
          {g.frase ?? g.label}
        </H>
      </div>
    </Caja>
  )
}

/** Un grupo: portada + fila de fotos (se desliza en el celular; 6 en fila desde @3xl) + "Ver las N". */
export function GrupoUso({ g, max = 6 }: { g: Grupo; max?: number }) {
  return (
    <section aria-label={g.label} className="@container">
      <PortadaGrupo g={g} h="h2" />
      <ul className="-mx-4 mt-3 grid snap-x scroll-px-4 auto-cols-[44%] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] @3xl:mx-0 @3xl:grid-flow-row @3xl:grid-cols-6 @3xl:overflow-visible @3xl:px-0">
        {g.prendas.slice(0, max).map((p) => (
          <li key={p.href} className="snap-start">
            <FotoCard p={p} />
          </li>
        ))}
      </ul>
      {g.count > max && (
        <div className="mt-1">
          <Button variant="ghost" href={g.href}>
            Ver las {g.count} de {g.label} →
          </Button>
        </div>
      )}
    </section>
  )
}
