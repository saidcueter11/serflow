import type { Grupo, Prenda } from '../datos3'
import { MasFotos, Nuevo } from './Comunes'

/*
 * PROPUESTA (PRI-130, ronda 3 · dirección 4 "Perfil de Instagram"). El catálogo como el perfil que el cliente
 * ya sabe usar: cabecera con logo y conteos, historias destacadas por categoría (son las categorías, con su
 * conteo) y la grilla cuadrada de 3. El visor es un post.
 */

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/** Avatar: el logo en un círculo con anillo dorado. */
export function Avatar({ logo, size = 'lg' }: { logo: string; size?: 'sm' | 'lg' }) {
  const s = size === 'lg' ? 'size-20 p-[3px] @3xl:size-36 @3xl:p-1' : 'size-10 p-[2px]'
  return (
    <span className={`block shrink-0 rounded-full bg-[conic-gradient(var(--color-accent),var(--color-secondary),var(--color-accent-deep),var(--color-accent))] ${s}`}>
      <span className="flex size-full items-center justify-center rounded-full border-2 border-primary bg-surface">
        <img src={logo} alt="" width={80} height={28} className="w-[72%]" />
      </span>
    </span>
  )
}

/** Cabecera del perfil: avatar, nombre, conteos y bienvenida (h1). */
export function CabeceraPerfil({ logo, trabajos, categorias, titulo, texto }: { logo: string; trabajos: number; categorias: number; titulo: string; texto: string }) {
  const stat = (n: string, l: string) => (
    <li className="flex flex-col items-center leading-tight @3xl:flex-row @3xl:gap-1.5">
      <span className="font-display text-[18px] font-bold @3xl:text-[19px]">{n}</span>
      <span className="text-[13px] text-muted @3xl:text-[16px]">{l}</span>
    </li>
  )
  return (
    <div className="@container px-4 pt-5 @3xl:px-12 @3xl:pt-10">
      <div className="flex items-center gap-5 @3xl:gap-16 @3xl:pl-16">
        <Avatar logo={logo} />
        <div className="flex min-w-0 flex-1 flex-col gap-3 @3xl:gap-4">
          <p className="font-display text-[20px] font-bold @3xl:text-[24px]">serflow</p>
          <ul className="flex justify-between gap-2 @3xl:justify-start @3xl:gap-10">
            {stat(String(trabajos), 'trabajos')}
            {stat(String(categorias), 'categorías')}
            {stat('Bazurto', 'Cartagena')}
          </ul>
          <div className="hidden @3xl:block">
            <h1 className="font-display text-[22px] font-medium">{titulo}</h1>
            <p className="mt-1 max-w-[52ch] text-[15px] leading-relaxed text-muted">{texto}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 @3xl:hidden">
        <h1 className="font-display text-[19px] font-medium">{titulo}</h1>
        <p className="mt-1 text-[14px] leading-relaxed text-muted">{texto}</p>
      </div>
    </div>
  )
}

export type Destacada = { label: string; href: string; count: number; portada?: string }

/**
 * Historias destacadas = las categorías. Círculo con la portada (categories.image_url; sin portada, la trama),
 * label y conteo. La actual: anillo dorado grueso y texto en ink (no solo color: también aria-current y el peso).
 */
export function Destacadas({ items, current }: { items: Destacada[]; current: string }) {
  return (
    <nav aria-label="Categorías" className="@container">
      <ul className="flex scroll-px-4 gap-4 overflow-x-auto px-4 py-1 [scrollbar-width:none] @3xl:gap-6 @3xl:px-12">
        {items.map((d) => {
          const on = d.href === current
          return (
            // La actual entra en pantalla al cargar, sin JS (como CategoryNav).
            <li key={d.href} className={`shrink-0 ${on ? '@max-3xl:[scroll-initial-target:nearest]' : ''}`}>
              <a href={d.href} aria-current={on ? 'page' : undefined} className={`flex w-[72px] flex-col items-center gap-1.5 rounded-tile pb-1 @3xl:w-[88px] ${FOCUS}`}>
                <span className={`relative block rounded-full p-[3px] ${on ? 'bg-accent' : 'bg-line'}`}>
                  <span className="block size-16 overflow-hidden rounded-full border-2 border-primary bg-surface-2 @3xl:size-[76px]">
                    {d.portada ? <img src={d.portada} alt="" width={76} height={76} className="size-full object-cover" /> : <span className="fabric block size-full" />}
                  </span>
                </span>
                <span className={`line-clamp-2 w-full text-center text-[12px] leading-tight ${on ? 'font-bold text-ink' : 'font-medium text-ink/85'}`}>{d.label}</span>
                <span className="text-[12px] leading-none text-muted">{d.count}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Un cuadro de la grilla. Hover/foco: velo con la categoría (donde IG pone los likes). */
export function CuadroIG({ p }: { p: Prenda }) {
  return (
    <a href={p.href} id={`f-${p.n}`} className={`group relative block aspect-square overflow-hidden bg-surface-2 ${FOCUS} focus-visible:-outline-offset-2`}>
      <img src={p.fotos[0].src} alt={p.alt} width={320} height={320} loading="lazy" decoding="async" className="fabric reveal-wipe size-full object-cover transition-transform duration-(--motion-slow) ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100" />
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-primary/70 text-[15px] font-semibold text-ink opacity-0 transition-opacity duration-(--motion-med) group-hover:opacity-100 group-focus-visible:opacity-100">
        {p.label}
      </span>
      {p.nuevo && <Nuevo className="absolute left-1.5 top-1.5" />}
      <MasFotos n={p.fotos.length} className="absolute right-1.5 top-1.5" />
    </a>
  )
}

/** Grilla de 3 cuadros pegados (como IG), en celular y desktop. */
export function GrillaIG({ prendas }: { prendas: Prenda[] }) {
  return (
    <ul className="grid grid-cols-3 gap-0.5 @3xl:gap-1">
      {prendas.map((p) => (
        <li key={p.href}>
          <CuadroIG p={p} />
        </li>
      ))}
    </ul>
  )
}

export const destacadas = (grupos: Grupo[], todo: { count: number; portada?: string }, todoHref: string): Destacada[] => [
  { label: 'Todo', href: todoHref, count: todo.count, portada: todo.portada },
  ...grupos.map((x) => ({ label: x.label, href: x.href, count: x.count, portada: x.portada })),
]
