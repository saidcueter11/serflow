import type { CSSProperties } from 'react'
import { PinIcon } from '../icons/PinIcon'
import { Button } from './Button'
import { ADDRESS, CITY, DIRECTIONS_URL, HOURS, MAP_EMBED_URL } from '../../lib/business'

// Calles ilustrativas solo con CSS (0 KB de imagen), con los tokens de color.
const STREETS: CSSProperties = {
  backgroundColor: 'var(--color-primary-light)',
  backgroundImage:
    'linear-gradient(28deg, transparent 46%, var(--color-line) 46% 50%, transparent 50%), linear-gradient(-62deg, transparent 58%, var(--color-line) 58% 61%, transparent 61%), repeating-linear-gradient(28deg, transparent 0 34px, var(--color-surface-2) 34px 36px), repeating-linear-gradient(-62deg, transparent 0 40px, var(--color-surface-2) 40px 42px)',
}

const HEIGHT = {
  short: 'h-[180px]',
  tall: 'h-[260px]',
  open: 'h-[200px] @md:h-[340px]',
}

/**
 * Tarjeta de ubicación: mapa + nombre, dirección, horario y "Cómo llegar".
 * Cerrada (por defecto): mapa ilustrativo en CSS; el de Google va en un <details> con iframe
 * loading="lazy" y Chromium no lo pide hasta que el usuario lo abre (verificado con Playwright).
 * open: el mapa de Google se ve de una (lo pidió el cliente para la portada, PRI-129), con
 * loading="lazy"; el alto crece desde 448px de ancho de la tarjeta (container query). Cero JS.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/business-info/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function MapCard({
  tall = false,
  open = false,
  title = `Serflow · ${CITY.split(',')[0]}`,
}: {
  tall?: boolean
  /** Mapa de Google visible sin tocar nada. */
  open?: boolean
  title?: string
}) {
  const height = HEIGHT[open ? 'open' : tall ? 'tall' : 'short']
  return (
    <div className="@container overflow-hidden rounded-card border border-line bg-surface font-body text-ink">
      {open ? (
        <iframe
          src={MAP_EMBED_URL}
          loading="lazy"
          title="Mapa de Serflow en Cartagena"
          referrerPolicy="no-referrer-when-downgrade"
          className={`block w-full border-0 ${height}`}
        />
      ) : (
        <details className="group">
          <summary className="cursor-pointer list-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
            <div className={`relative flex items-center justify-center group-open:hidden ${height}`} style={STREETS}>
              <PinIcon className="size-12 text-accent drop-shadow-[0_4px_8px_rgba(0,0,0,.6)]" />
              <span className="absolute bottom-2 left-3 rounded-full bg-primary/80 px-2 py-0.5 text-[12px] text-muted">
                Toca para abrir el mapa
              </span>
            </div>
            <span className="hidden min-h-11 items-center px-4 text-[13px] font-semibold text-accent group-open:flex">
              Ocultar mapa
            </span>
          </summary>
          <iframe
            src={MAP_EMBED_URL}
            loading="lazy"
            title="Mapa de Serflow en Cartagena"
            referrerPolicy="no-referrer-when-downgrade"
            className={`block w-full border-0 ${height}`}
          />
        </details>
      )}
      <div className="flex flex-col gap-3 p-4">
        <div>
          <h3 className="text-[17px] font-bold">{title}</h3>
          <p className="text-[14px] text-muted">{ADDRESS ?? 'Dirección por confirmar'}</p>
        </div>
        <dl className="flex flex-col gap-1 text-[14px]">
          {HOURS.map((h) => (
            <div key={h.days} className="flex justify-between gap-4">
              <dt className="text-muted">{h.days}</dt>
              <dd>{h.time}</dd>
            </div>
          ))}
        </dl>
        <Button variant="secondary" href={DIRECTIONS_URL} external fullWidth icon={<PinIcon className="size-4" />}>
          Cómo llegar
        </Button>
      </div>
    </div>
  )
}
