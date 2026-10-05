import type { ReactNode } from "react";
import frente from "./looney/frente.webp";
import tresCuartos from "./looney/tres-cuartos.webp";
import lado from "./looney/lado.webp";
import espalda from "./looney/espalda.webp";
import risa from "./looney/risa.webp";
import guino from "./looney/guino.webp";
import sorpresa from "./looney/sorpresa.webp";
import picaro from "./looney/picaro.webp";
import saludoStrip from "./looney/saludo.webp";
import giroStrip from "./looney/giro.webp";

/*
 * Pruebas de animación con la hoja de personaje que hizo Said en Nano Banana (estilo cartoon clásico).
 * Recortes de una imagen de 512 px ampliados 3x: se ven suaves. Con el archivo original en alta, quedan nítidos.
 * Todo CSS, sin video ni JS: cada pose es un PNG/WebP con fondo transparente y se alterna con keyframes.
 */

// Visible solo en las ventanas [desde, hasta] (en % del ciclo); fuera, oculto. Así se arma un "cuadro por cuadro".
function windows(name: string, spans: [number, number][]) {
  const k: string[] = ["0% { opacity: 0 }"];
  for (const [a, b] of spans) {
    k.push(`${a.toFixed(2)}% { opacity: 1 }`, `${Math.max(b - 0.01, a).toFixed(2)}% { opacity: 1 }`, `${b.toFixed(2)}% { opacity: 0 }`);
  }
  k.push("100% { opacity: 0 }");
  return `@keyframes ${name} { ${k.join(" ")} }`;
}

// Giro: 3 vueltas rápidas (frente, 3/4, lado, espalda a 0.1 s cada uno) y luego se queda de frente.
const SPIN = 4; // s por ciclo
const spinFrames = [frente, tresCuartos, lado, espalda];
const spinCss = spinFrames
  .map((_, k) => {
    const spans: [number, number][] = [0, 1, 2].map((j) => {
      const t = j * 0.4 + k * 0.1;
      return [(t / SPIN) * 100, ((t + 0.1) / SPIN) * 100];
    });
    if (k === 0) spans.push([(1.2 / SPIN) * 100, 100]);
    return windows(`lt-spin-${k}`, spans) + ` .lt-spin-${k} { animation: lt-spin-${k} ${SPIN}s steps(1, end) infinite; }`;
  })
  .join("\n");

const FACES = [risa, guino, sorpresa, picaro];
const FACE = 1.4; // s por cara
const faceCss = FACES.map((_, i) => {
  const a = (i / FACES.length) * 100;
  const b = ((i + 1) / FACES.length) * 100;
  return `${windows(`lt-face-${i}`, [[a, b]])} .lt-face-${i} { animation: lt-face-${i} ${FACE * FACES.length}s steps(1, end) infinite, lt-boing ${FACE * FACES.length}s ease-out infinite; animation-delay: 0s, ${i * FACE}s; }`;
}).join("\n");

const CSS = `
${spinCss}
${faceCss}
@keyframes lt-boing { 0% { transform: scale(.55) rotate(-8deg) } 4% { transform: scale(1.18) rotate(4deg) } 7% { transform: scale(.94) } 10%, 100% { transform: none } }
@keyframes lt-enter {
  0% { transform: translateY(115%) scaleX(.8) scaleY(1.3) }
  14% { transform: translateY(0) scaleX(1.25) scaleY(.72) }
  20% { transform: translateY(-12%) scaleX(.9) scaleY(1.12) }
  27% { transform: translateY(0) scaleX(1.06) scaleY(.94) }
  32%, 50% { transform: none }
  56% { transform: translateY(-4%) rotate(-3deg) }
  62% { transform: none }
  68% { transform: translateY(-4%) rotate(3deg) }
  74%, 90% { transform: none }
  100% { transform: translateY(115%) scaleX(.8) scaleY(1.3) }
}
.lt-enter { transform-origin: 50% 100%; animation: lt-enter 4.5s cubic-bezier(.3,.7,.3,1) infinite; }
.lt-dust { animation: lt-dust 4.5s ease-out infinite; transform-origin: center; }
@keyframes lt-dust { 0%, 12% { opacity: 0; transform: scaleX(.3) } 15% { opacity: .9; transform: scaleX(1) } 30%, 100% { opacity: 0; transform: scaleX(1.4) } }
@media (prefers-reduced-motion: reduce) { .lt-enter, .lt-dust, [class*="lt-spin-"], [class*="lt-face-"] { animation: none !important; } }
`;

function Stage({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <div className="flex w-[300px] flex-col gap-3">
      <div className="relative flex h-[340px] items-end justify-center overflow-hidden rounded-card border border-line bg-primary pb-4">{children}</div>
      <div>
        <h3 className="font-display text-[18px] font-bold">{title}</h3>
        <p className="mt-1 text-[14px] leading-relaxed text-muted">{note}</p>
      </div>
    </div>
  );
}

export function LooneyBoard() {
  return (
    <div className="flex flex-col gap-6 rounded-card border border-line bg-surface p-8 font-body text-ink antialiased">
      <style>{CSS}</style>
      <div>
        <div className="text-[12px] uppercase tracking-[.14em] text-accent">Mascota · estilo cartoon · animaciones de prueba</div>
        <h2 className="mt-1 font-display text-[30px] font-bold leading-tight">Tu personaje, animado sin video</h2>
        <p className="mt-2 max-w-[880px] text-[15px] leading-relaxed text-muted">
          Recorté las poses de tu hoja de Nano Banana, les quité el fondo y las animé solo con CSS. Se ven algo borrosas porque la
          imagen original es de 512 px: con el archivo en alta resolución quedan nítidas.
        </p>
      </div>
      <div className="flex gap-6">
        <Stage title="Entrada con rebote" note="Sale de abajo, se aplasta al caer y se estira (squash & stretch), y mueve la cabeza. Para la 404 o el aviso de no hay prendas.">
          <span className="lt-dust absolute bottom-3 h-3 w-40 rounded-full bg-ink/25 blur-[2px]" />
          <img src={frente} alt="" className="lt-enter relative h-[300px]" />
        </Stage>
        <Stage title="Caras" note="Cambia de expresión con un boing: risa, guiño, sorpresa, pícaro. Cuadro por cuadro, como en los dibujos animados.">
          <div className="relative grid h-[260px] w-[240px] place-items-center">
            {FACES.map((f, i) => (
              <img key={i} src={f} alt="" className={`lt-face-${i} col-start-1 row-start-1 max-h-[250px] opacity-0`} />
            ))}
          </div>
        </Stage>
        <Stage title="Giro" note="Da tres vueltas con las poses de la hoja (frente, tres cuartos, lado, espalda) y se queda de frente.">
          <div className="relative grid h-[300px] place-items-end">
            {spinFrames.map((f, k) => (
              <img key={k} src={f} alt="" className={`lt-spin-${k} col-start-1 row-start-1 h-[300px] justify-self-center opacity-0`} />
            ))}
          </div>
        </Stage>
      </div>
    </div>
  );
}

/*
 * Cuadro por cuadro con la hoja de 8 cuadros (sprite sheet) que hizo Said. Cada tira es una sola imagen con los
 * cuadros en fila; CSS la corre con steps() como un flipbook. Cuadros repetidos = pausas (quieto, guiño).
 */

const FW = 271;
const FH = 445;
const SPRITES = [
  { src: saludoStrip, frames: 16, ms: 110, title: "Saluda y guiña", note: "Quieto, levanta la mano, saluda dos veces, guiña y vuelve. 16 cuadros a ~9 por segundo, como un cartoon." },
  { src: giroStrip, frames: 12, ms: 130, title: "Se gira", note: "Se voltea a mirar hacia un lado y vuelve. Usa los cuadros 7 y 8 de tu hoja." },
];

export function SpriteBoard() {
  const scale = 0.72;
  const w = Math.round(FW * scale);
  const h = Math.round(FH * scale);
  const css = SPRITES.map(
    (s, i) =>
      `@keyframes sp-${i} { to { background-position: -${w * s.frames}px 0 } } .sp-${i} { width: ${w}px; height: ${h}px; background: url(${s.src}) 0 0 / ${w * s.frames}px ${h}px no-repeat; animation: sp-${i} ${(s.frames * s.ms) / 1000}s steps(${s.frames}) infinite; }`,
  ).join("\n");
  return (
    <div className="flex flex-col gap-6 rounded-card border border-line bg-surface p-8 font-body text-ink antialiased">
      <style>{css + "\n@media (prefers-reduced-motion: reduce) { [class^='sp-'] { animation: none; } }"}</style>
      <div>
        <div className="text-[12px] uppercase tracking-[.14em] text-accent">Mascota · cuadro por cuadro (tu hoja de 8 cuadros)</div>
        <h2 className="mt-1 font-display text-[30px] font-bold leading-tight">El perro flaco, animado de verdad</h2>
        <p className="mt-2 max-w-[880px] text-[15px] leading-relaxed text-muted">
          Corté los 8 cuadros, quité el fondo verde y las sombras, y los alineé por los pies. Cada animación es una sola imagen que CSS
          recorre como un flipbook: sin video y sin JavaScript.
        </p>
      </div>
      <div className="flex gap-6">
        {SPRITES.map((s, i) => (
          <div key={i} className="flex w-[300px] flex-col gap-3">
            <div className="flex h-[360px] items-end justify-center rounded-card border border-line bg-primary pb-4">
              <div className={`sp-${i}`} role="img" aria-label={s.title} />
            </div>
            <div>
              <h3 className="font-display text-[18px] font-bold">{s.title}</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-muted">{s.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
