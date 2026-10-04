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

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-body transition-[transform,box-shadow,border-color] duration-[var(--motion-fast)] ease-out'

const VARIANT: Record<Variant, string> = {
  whatsapp:
    'min-h-12 px-6 text-[15px] font-bold bg-accent text-primary shadow-[0_5px_0_var(--color-accent-deep)] active:translate-y-[3px] active:shadow-[0_2px_0_var(--color-accent-deep)]',
  secondary:
    'min-h-12 px-6 text-[15px] font-semibold border border-line text-ink hover:border-muted active:translate-y-px',
  ghost: 'min-h-11 text-[14px] font-semibold text-accent underline-offset-4 hover:underline',
}

/**
 * Botón del design system: whatsapp (la acción principal, una por sección), secondary y ghost.
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
