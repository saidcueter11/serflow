/*
 * Movimiento del personalizador (Propuesta). Al construir va a src/styles/tokens.css junto a los sf-*,
 * y entra en el bloque de prefers-reduced-motion que ya existe. Todo CSS, con las duraciones de los tokens.
 */
const CSS = `
@keyframes pz-spin { to { transform: rotate(360deg) } }
@keyframes pz-shimmer { from { transform: translateX(-100%) } to { transform: translateX(100%) } }
@keyframes pz-sheet { from { transform: translateY(24px); opacity: 0 } to { transform: none; opacity: 1 } }
@keyframes pz-fade { from { opacity: 0 } to { opacity: 1 } }
.pz-spin { animation: pz-spin .9s linear infinite; }
.pz-shimmer::after { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 20%, rgb(255 255 255 / .22) 50%, transparent 80%); animation: pz-shimmer 1.4s var(--ease-out) infinite; }
.pz-sheet { animation: pz-sheet var(--motion-slow) var(--ease-out) both; }
.pz-fade { animation: pz-fade var(--motion-med) var(--ease-out) both; }
@media (prefers-reduced-motion: reduce) {
  .pz-spin, .pz-shimmer::after, .pz-sheet, .pz-fade { animation: none !important; }
}
`;

export function EstilosPersonalizador() {
  return <style>{CSS}</style>;
}
