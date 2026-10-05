import type { CSSProperties, ReactNode } from "react";
import { Mascota } from "./mascota";

/*
 * Estilos posibles para la mascota, con la misma cara de pitbull: sirven para elegir dirección,
 * no son el personaje final. Los dos salen del oficio de Serflow (bordar), no de una moda genérica.
 */

const CSS = `
.sf-patch-ring { stroke-dasharray: 1; stroke-dashoffset: 1; animation: sf-patch-sew 1.6s ease-out .2s forwards; }
@keyframes sf-patch-sew { to { stroke-dashoffset: 0 } }
.sf-patch-shine { animation: sf-patch-shine 4s ease-in-out 1.8s infinite; }
@keyframes sf-patch-shine { 0% { transform: translateX(-260px) } 35%, 100% { transform: translateX(260px) } }
.sf-patch-body { animation: sf-patch-pop .6s cubic-bezier(.3,1.6,.5,1) both; transform-box: fill-box; transform-origin: center; }
@keyframes sf-patch-pop { from { transform: scale(.85) rotate(-6deg); opacity: 0 } to { transform: none; opacity: 1 } }
.sf-line path, .sf-line ellipse, .sf-line circle { stroke-dasharray: 1; stroke-dashoffset: 1; animation: sf-line-draw 1.2s ease-in-out forwards; animation-delay: calc(var(--i) * .18s); }
@keyframes sf-line-draw { to { stroke-dashoffset: 0 } }
.sf-line-glow { animation: sf-line-glow 2.6s ease-in-out 2.6s infinite; }
@keyframes sf-line-glow { 50% { filter: drop-shadow(0 0 6px rgb(255 215 0 / .7)) } }
.sf-replay:hover * { animation-name: none; }
@media (prefers-reduced-motion: reduce) {
  .sf-patch-ring, .sf-patch-shine, .sf-patch-body, .sf-line *, .sf-line-glow { animation: none !important; stroke-dashoffset: 0 !important; }
}
`;

const INK = "#17160f";
const GOLD = "#FFD700";
const GOLD_DEEP = "#D2BD3C";

// Geometría compartida (la misma cara que el sticker).
const HEAD = "M110 56 C152 56 170 84 168 112 C176 124 174 146 158 156 C146 170 128 176 110 176 C92 176 74 170 62 156 C46 146 44 124 52 112 C50 84 68 56 110 56 Z";
const EAR_L = "M64 90 C44 78 26 86 28 106 C40 100 52 102 62 108 Z";
const EAR_R = "M156 90 C176 78 194 86 192 106 C180 100 168 102 158 108 Z";
const MUZZLE = "M70 146 C70 124 88 116 110 116 C132 116 150 124 150 146 C150 162 132 172 110 172 C88 172 70 162 70 146 Z";
const BLAZE = "M103 92 Q110 86 117 92 L123 122 Q110 128 97 122 Z";
const CAP = "M54 92 C54 50 80 32 110 32 C140 32 166 50 166 92 Q110 78 54 92 Z";
const BRIM = "M44 94 Q110 72 176 96 Q180 108 164 108 Q110 94 56 108 Q40 108 44 94 Z";
const NOSE = "M97 130 Q110 123 123 130 Q123 141 110 144 Q97 141 97 130 Z";
const MOUTH = "M88 148 Q99 162 110 151 Q121 162 132 148";

/** 1. Parche bordado: como los parches que Serflow cose en las gorras. Relleno de "hilo" y borde de puntada satinada. */
export function MascotaParche({ size = 240 }: { size?: number }) {
  const stitch = { stroke: INK, strokeWidth: 3, strokeDasharray: "5 3", strokeLinecap: "round" as const, fill: "none" };
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} role="img" aria-label="Mascota estilo parche bordado" className="overflow-visible">
      <style>{CSS}</style>
      <defs>
        {/* Texturas de hilo: líneas finas en diagonal, como el relleno de un bordado */}
        {[
          ["fur", "#9AA1B0", "#828a9a", 35],
          ["white", "#F4F1E6", "#d9d5c7", -35],
          ["gold", GOLD, "#e6c200", 60],
          ["deep", GOLD_DEEP, "#b9a52f", -60],
          ["bg", "#1f1d15", "#2a271c", 45],
          ["pink", "#EE9CA4", "#d9848c", 20],
        ].map(([id, base, line, rot]) => (
          <pattern key={id as string} id={`t-${id}`} width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform={`rotate(${rot})`}>
            <rect width="3.2" height="3.2" fill={base as string} />
            <line x1="0" y1="0" x2="0" y2="3.2" stroke={line as string} strokeWidth="1.2" />
          </pattern>
        ))}
        <clipPath id="patch-clip">
          <circle cx="110" cy="110" r="100" />
        </clipPath>
        <linearGradient id="patch-sheen" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="patch-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity=".55" />
        </filter>
      </defs>

      <g className="sf-patch-body" filter="url(#patch-shadow)">
        <circle cx="110" cy="110" r="100" fill="url(#t-bg)" />
        <g clipPath="url(#patch-clip)" transform="translate(0 12)">
          <path d={EAR_L} fill="url(#t-fur)" />
          <path d={EAR_L} {...stitch} />
          <path d={EAR_R} fill="url(#t-fur)" />
          <path d={EAR_R} {...stitch} />
          <path d={HEAD} fill="url(#t-fur)" />
          <path d={HEAD} {...stitch} />
          <path d={BLAZE} fill="url(#t-white)" />
          <path d={MUZZLE} fill="url(#t-white)" />
          <path d={MUZZLE} {...stitch} />
          <ellipse cx="86" cy="112" rx="8.5" ry="10" fill={INK} />
          <ellipse cx="134" cy="112" rx="8.5" ry="10" fill={INK} />
          <circle cx="89" cy="107" r="3" fill="#F4F1E6" />
          <circle cx="137" cy="107" r="3" fill="#F4F1E6" />
          <path d={NOSE} fill={INK} />
          <path d={MOUTH} {...stitch} strokeDasharray="4 2" />
          <path d="M102 156 Q102 168 110 169 Q118 168 118 156 Q110 160 102 156 Z" fill="url(#t-pink)" />
          <path d={CAP} fill="url(#t-gold)" />
          <path d={CAP} {...stitch} />
          <path d={BRIM} fill="url(#t-deep)" />
          <path d={BRIM} {...stitch} />
          <text x="110" y="72" textAnchor="middle" fontFamily="Space Grotesk, system-ui" fontWeight="700" fontSize="28" fill={INK}>
            S
          </text>
        </g>
        {/* Borde satinado: se "cose" al aparecer */}
        <circle className="sf-patch-ring" pathLength={1} cx="110" cy="110" r="100" fill="none" stroke={GOLD_DEEP} strokeWidth="12" />
        <circle cx="110" cy="110" r="100" fill="none" stroke="#b9a52f" strokeWidth="12" strokeDasharray="1.2 1.6" opacity=".8" />
        <circle cx="110" cy="110" r="92" fill="none" stroke={INK} strokeWidth="1.5" strokeDasharray="4 3" />
        {/* Brillo de hilo que pasa cada tanto */}
        <g clipPath="url(#patch-clip)">
          <rect className="sf-patch-shine" x="40" y="-20" width="70" height="260" fill="url(#patch-sheen)" transform="rotate(20 110 110)" />
        </g>
      </g>
    </svg>
  );
}

/** 2. Línea de hilo: un solo trazo dorado que se dibuja solo, como el hilo que recorre la página. */
export function MascotaLinea({ size = 240 }: { size?: number }) {
  const parts = [EAR_L, EAR_R, HEAD, CAP, BRIM, MUZZLE, BLAZE, NOSE, MOUTH];
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} role="img" aria-label="Mascota estilo línea de hilo" className="sf-line-glow overflow-visible">
      <style>{CSS}</style>
      <g className="sf-line" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="translate(0 12)">
        {parts.map((d, i) => (
          <path key={i} d={d} pathLength={1} style={{ "--i": i } as CSSProperties} />
        ))}
        <ellipse cx="86" cy="112" rx="6" ry="7.5" pathLength={1} style={{ "--i": 9 } as CSSProperties} />
        <ellipse cx="134" cy="112" rx="6" ry="7.5" pathLength={1} style={{ "--i": 9 } as CSSProperties} />
        <path d="M74 98 Q84 93 95 97 M125 97 Q136 93 146 98" pathLength={1} style={{ "--i": 10 } as CSSProperties} />
        <path d="M110 34 L110 82" pathLength={1} style={{ "--i": 11 } as CSSProperties} strokeDasharray="1" />
      </g>
    </svg>
  );
}

function Option({ n, title, children, pros, cons }: { n: string; title: string; children: ReactNode; pros: string; cons: string }) {
  return (
    <div className="flex w-[300px] flex-col items-center gap-4 rounded-card border border-line bg-primary p-6">
      <div className="flex h-[260px] items-center justify-center">{children}</div>
      <div className="w-full">
        <div className="text-[12px] uppercase tracking-[.14em] text-accent">{n}</div>
        <h3 className="mt-1 font-display text-[22px] font-bold leading-tight">{title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink/90">
          <span className="text-ok">+</span> {pros}
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-muted">
          <span className="text-danger">-</span> {cons}
        </p>
      </div>
    </div>
  );
}

/** Lámina de comparación para el canvas. */
export function MascotaEstilosBoard() {
  return (
    <div className="flex flex-col gap-6 rounded-card border border-line bg-surface p-8 font-body text-ink antialiased">
      <div>
        <div className="text-[12px] uppercase tracking-[.14em] text-accent">Mascota · estilos posibles</div>
        <h2 className="mt-1 font-display text-[30px] font-bold leading-tight">Misma cara, tres formas de dibujarla</h2>
        <p className="mt-2 max-w-[860px] text-[15px] leading-relaxed text-muted">
          Hechos por mí en SVG para elegir dirección; el personaje final lo dibuja un ilustrador en el estilo que elijas.
          Las animaciones son reales: recarga el preview o el canvas para verlas otra vez.
        </p>
      </div>
      <div className="flex gap-5">
        <Option n="Estilo 1" title="Parche bordado" pros="Es el oficio de Serflow: parece un parche cosido de verdad. Sirve igual como sticker, en la gorra o en redes." cons="Más detalle: a tamaño muy pequeño (botón) se pierde la textura.">
          <MascotaParche />
        </Option>
        <Option n="Estilo 2" title="Línea de hilo" pros="Se dibuja sola con un trazo dorado y conecta con el hilo de la página. Muy liviano y elegante." cons="Menos tierno y expresivo; funciona más como ícono que como personaje.">
          <MascotaLinea />
        </Option>
        <Option n="Estilo 3 (el de antes)" title="Sticker" pros="Expresivo, cuerpo completo, fácil de animar por partes (saludar, parpadear)." cons="Es el que no te convenció; necesitaría un ilustrador para verse profesional.">
          <Mascota size={200} />
        </Option>
      </div>
    </div>
  );
}
