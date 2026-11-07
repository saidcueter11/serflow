import { Button } from '../ui/Button'

const ICONO = (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12a8 8 0 1 0 2.6-5.9L4 8.5M4 4v4.5h4.5" />
  </svg>
)

/** El botón Repetir de cada efecto. El clic lo atiende src/scripts/lab/index.ts por [data-repetir]. */
export function Repetir({ n }: { n: number }) {
  return (
    <Button variant="secondary" fullWidth icon={ICONO}>
      Repetir <span className="sr-only">el efecto {n}</span>
    </Button>
  )
}
