import type { ReactNode } from 'react'
import { WhatsAppIcon } from '../icons/WhatsappIcon'

type Variant = 'whatsapp' | 'secondary' | 'ghost'

interface Props {
  variant: Variant
  children: ReactNode
  /** Con href se renderiza un <a>; sin href, un <button type="button">. */
  href?: string
  /** Reemplaza el ícono por defecto. whatsapp muestra el de WhatsApp si icon es undefined; null lo quita. */
  icon?: ReactNode
  fullWidth?: boolean
  /** Abre en otra pestaña (los links de WhatsApp lo son). */
  external?: boolean
}

// whatsapp y secondary: alto 48 en el celular y 52 desde @3xl, texto 16: toda la píldora es el área táctil (PRI-286).
const BASE = 'inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold'

const VARIANT: Record<Variant, string> = {
  // La acción principal: oro viejo relleno con un filo de luz arriba, sin canto 3D.
  whatsapp:
    'sf-brillo min-h-12 px-6 text-[16px] @3xl:min-h-[52px] @3xl:px-7 bg-accent text-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.28)]',
  secondary: 'sf-brillo sf-brillo-suave min-h-12 px-6 text-[16px] @3xl:min-h-[52px] @3xl:px-7 border border-line text-ink',
  // Enlace en tinta: la costura dorada se dibuja debajo al pasar, enfocar o tocar.
  ghost: 'sf-costura min-h-11 text-[14px] text-ink',
}

/**
 * Botón del design system: whatsapp (la acción principal, una por sección, oro viejo), secondary (borde) y ghost (enlace).
 * Movimientos de PRI-287 en tokens.css: sf-brillo (sube con un reflejo y se hunde al tocar) y sf-costura.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/buttons/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Button({ variant, children, href, icon, fullWidth = false, external = false }: Props) {
  const className = `${BASE} ${VARIANT[variant]} ${fullWidth ? 'w-full' : ''}`
  const shownIcon = icon === undefined && variant === 'whatsapp' ? <WhatsAppIcon className="size-5" /> : icon

  if (href) {
    return (
      <a
        href={href}
        className={className}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {shownIcon}
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={className}>
      {shownIcon}
      {children}
    </button>
  )
}
