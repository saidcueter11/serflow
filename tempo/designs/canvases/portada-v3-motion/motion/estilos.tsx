/*
 * PROPUESTA (PRI-287) · Sistema de movimiento. Al construir, MOTION_CSS va a src/styles/tokens.css junto a los sf-*
 * (los cuatro tokens nuevos van dentro de @theme) y el bloque de view transitions va a src/styles/global.css.
 * "Reducir movimiento" y .slow-connection ya apagan todo desde global.css (regla * { animation: none }).
 * Lo de PRI-122 (pz-spin, pz-shimmer, pz-sheet, pz-fade) se unifica aquí como mo-spin, mo-wait, mo-sheet y mo-fade.
 */
export const MOTION_CSS = `
:root {
  --motion-enter: 600ms;
  --ease-enter: cubic-bezier(0.2, 0.7, 0.2, 1);
  --motion-spin: 900ms;
  --motion-shimmer: 1.4s;
}
@keyframes mo-land { from { opacity: 0; transform: scale(1.14) translateY(-8px) } to { opacity: 1; transform: none } }
@keyframes mo-swap { 0%, 42% { opacity: 0 } 50%, 92% { opacity: 1 } 100% { opacity: 0 } }
@keyframes mo-sweep { from { transform: translateX(-100%) } to { transform: translateX(100%) } }
@keyframes mo-spin { to { transform: rotate(360deg) } }
@keyframes mo-sheet { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: none } }
@keyframes mo-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes mo-stitch { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
@keyframes mo-loading { from { transform: scaleX(0) } 60% { transform: scaleX(.7) } to { transform: scaleX(.94) } }

.mo-land { animation: mo-land var(--motion-enter) var(--ease-enter) .35s both; }
@supports (animation-timeline: view()) {
  .mo-land-scroll { animation: mo-land linear both; animation-timeline: view(); animation-range: entry 30% cover 40%; }
}
.mo-swap { opacity: 0; animation: mo-swap 10s ease-in-out 2s infinite; }

.mo-card > a:active, a.mo-card:active { transform: translateY(2px); transition-duration: var(--motion-fast); }

.mo-wait { position: relative; isolation: isolate; overflow: hidden; }
.mo-wait::before { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(100deg, transparent 20%, rgb(255 255 255 / .08) 50%, transparent 80%); animation: mo-sweep var(--motion-shimmer) var(--ease-out) 6; }
.mo-shine { position: relative; }
.mo-shine::after { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 20%, rgb(255 255 255 / .22) 50%, transparent 80%); animation: mo-sweep var(--motion-shimmer) var(--ease-out) infinite; }
.mo-spin { animation: mo-spin var(--motion-spin) linear infinite; }

.mo-navbar { position: fixed; inset: 0 0 auto; z-index: 60; height: 3px; transform: scaleX(0); transform-origin: left; background: repeating-linear-gradient(90deg, var(--color-accent) 0 9px, transparent 9px 15px); }
html[data-navegando] .mo-navbar { animation: mo-loading 8s cubic-bezier(.1, .6, .2, 1) .3s both; }

.mo-sheet { animation: mo-sheet var(--motion-slow) var(--ease-out) both; }
.mo-fade { animation: mo-fade var(--motion-med) var(--ease-out) both; }
.mo-check path { stroke-dasharray: 1; animation: mo-stitch var(--motion-slow) var(--ease-out) .1s both; }
.mo-loose path { stroke-dasharray: 1; animation: mo-stitch calc(var(--motion-enter) * 2) var(--ease-enter) .3s both; }

::view-transition-group(*) { animation-duration: var(--motion-slow); animation-timing-function: var(--ease-out); }
.slow-connection::view-transition-group(*), .slow-connection::view-transition-old(*), .slow-connection::view-transition-new(*) { animation: none !important; }
@media (prefers-reduced-motion: reduce) {
  html[data-navegando] .mo-navbar { transform: scaleX(1); opacity: .6; }
}
`;

/*
 * Solo canvas: simular "reducir movimiento" en una demo (la misma regla que global.css aplica al sitio entero),
 * la barra de navegación dentro de su recuadro y el reveal dentro de una caja con scroll.
 */
const DEMO_CSS = `
.sim-rm *, .sim-rm *::before, .sim-rm *::after { animation: none !important; transition: none !important; }
.sim-rm .mo-navbar-on { transform: scaleX(1); opacity: .6; }
.demo-stage .mo-navbar { position: absolute; }
.demo-stage .mo-navbar-on { animation: mo-loading 8s cubic-bezier(.1, .6, .2, 1) .3s both; }
`;

export function EstilosMotion() {
  return <style>{MOTION_CSS + DEMO_CSS}</style>;
}

/** Bytes reales del CSS propuesto, sin comprimir (lo que se le suma a tokens.css + global.css). */
export const MOTION_CSS_BYTES = new Blob([MOTION_CSS]).size;
