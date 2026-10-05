/**
 * Trazado del hilo de bordado de la portada (Thread). Función pura: la usan el componente
 * (canvas, con tamaño fijo) y src/scripts/thread.ts (sitio, con el alto real de la página).
 *
 * El hilo va de 0.7 a (alto - 0.3) pantallas: así la aguja, que avanza con el scroll de 0 a 100%,
 * queda siempre a ~70% de la pantalla. Cruza de lado a lado con curvas de `step` px de alto.
 */
export function threadPath(width: number, height: number, viewport: number, step = 620) {
  const left = 14
  const right = width - 14
  const y0 = Math.round(viewport * 0.7)
  const span = Math.max(height - viewport, 0)
  const n = Math.max(Math.ceil(span / step), 1)
  const h = span / n
  let d = `M ${right} ${y0}`
  const turns: { x: number; y: number }[] = []
  for (let i = 0; i < n; i++) {
    const y = y0 + i * h
    const x = i % 2 ? right : left
    d += ` C ${i % 2 ? left : right} ${r(y + h * 0.45)}, ${x} ${r(y + h * 0.55)}, ${x} ${r(y + h)}`
    turns.push({ x, y: r(y + h) })
  }
  return { d, turns }
}

const r = (v: number) => Math.round(v * 10) / 10

/** Contenido del <svg> del hilo: hilo de dos colores, puntadas en X en cada vuelta, nudo final y aguja. */
export function threadSvg(width: number, height: number, viewport: number) {
  const { d, turns } = threadPath(width, height, viewport)
  const end = turns[turns.length - 1]
  const xs = turns
    .slice(0, -1)
    .map((t) => `<path d="M${t.x - 7} ${t.y - 7} L${t.x + 7} ${t.y + 7} M${t.x + 7} ${t.y - 7} L${t.x - 7} ${t.y + 7}"/>`)
    .join('')
  return `<defs><mask id="sf-thread-mask" maskUnits="userSpaceOnUse"><path class="thread-reveal" d="${d}" pathLength="1" fill="none" stroke="white" stroke-width="40" stroke-dasharray="1 1"/></mask></defs>
<g mask="url(#sf-thread-mask)" fill="none" stroke-linecap="round">
<path d="${d}" stroke="var(--color-accent)" stroke-opacity="0.85" stroke-width="2.5" stroke-dasharray="8 6"/>
<path d="${d}" stroke="var(--color-ink)" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="5 9" stroke-dashoffset="-9"/>
<g stroke="var(--color-accent)" stroke-width="2.5">${xs}</g>
<g transform="translate(${end.x} ${end.y})" stroke="var(--color-accent)" stroke-width="2.5"><path d="M0 0 C-14 -12 -18 6 0 0 C14 -12 18 6 0 0"/><path d="M0 0 L-6 14 M0 0 L6 14"/><circle r="3.5" fill="var(--color-accent)" stroke="none"/></g>
</g>
<g class="thread-needle" style='offset-path: path("${d}"); offset-rotate: auto 90deg'><circle class="thread-glint" r="9" cy="-22" fill="var(--color-accent)" opacity=".35"/><path d="M0 -24 L3 14 Q0 21 -3 14 Z" fill="var(--color-ink)"/><ellipse cx="0" cy="-15" rx="1.1" ry="3.8" fill="var(--color-primary)"/><circle r="4.5" cy="19" fill="var(--color-accent)"/></g>`
}
