/*
 * Mascota en SVG plano: pitbull con la gorra de Serflow y pañoleta dorada. ~5 KB, animada solo con CSS:
 * saluda con la pata al cargar (y al pasar el mouse), parpadea, mueve una oreja y jadea.
 * Sigue siendo un borrador hecho por nosotros: muestra el estilo y la técnica. El personaje final conviene
 * que lo dibuje un ilustrador (mismas capas: cabeza, ojos, orejas, brazo) y se anima con este mismo CSS.
 */

const CSS = `
.sf-dog * { transform-box: view-box; }
.sf-dog-head { transform-origin: 110px 175px; animation: sf-dog-tilt 6s ease-in-out infinite; }
.sf-dog-eyes { transform-box: fill-box; transform-origin: center; animation: sf-dog-blink 4.5s infinite; }
.sf-dog-ear-l { transform-origin: 66px 92px; animation: sf-dog-ear 7s ease-in-out infinite; }
.sf-dog-arm { transform-origin: 156px 196px; animation: sf-dog-wave 1.1s ease-in-out .6s 3; }
.sf-dog:hover .sf-dog-arm { animation: sf-dog-wave 1.1s ease-in-out infinite; }
.sf-dog-tongue { transform-box: fill-box; transform-origin: 50% 0%; animation: sf-dog-pant 1.2s ease-in-out infinite; }
@keyframes sf-dog-blink { 0%, 92%, 100% { transform: scaleY(1) } 95% { transform: scaleY(.1) } }
@keyframes sf-dog-tilt { 0%, 100% { transform: rotate(0) } 30% { transform: rotate(-4deg) } 60% { transform: rotate(2deg) } }
@keyframes sf-dog-ear { 0%, 80%, 100% { transform: rotate(0) } 84% { transform: rotate(14deg) } 88% { transform: rotate(-4deg) } }
@keyframes sf-dog-wave { 0%, 100% { transform: rotate(0) } 25% { transform: rotate(-18deg) } 75% { transform: rotate(14deg) } }
@keyframes sf-dog-pant { 0%, 100% { transform: scaleY(1) } 50% { transform: scaleY(1.15) } }
.sf-bubble { transform-origin: 100% 100%; animation: sf-bubble .5s cubic-bezier(.3,1.6,.5,1) .4s both; }
@keyframes sf-bubble { from { opacity: 0; transform: scale(.5) } to { opacity: 1; transform: none } }
@media (prefers-reduced-motion: reduce) {
  .sf-dog-head, .sf-dog-eyes, .sf-dog-ear-l, .sf-dog-arm, .sf-dog-tongue, .sf-bubble { animation: none !important; }
}
`;

const FUR = "#9AA1B0";
const FUR_SHADE = "#7C8392";
const WHITE = "#F4F1E6";
const INK = "#17160f";
const PINK = "#EE9CA4";
const GOLD = "#FFD700";
const GOLD_DEEP = "#D2BD3C";
const LINE = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export function Mascota({ size = 220, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 220 240" width={size} height={(size * 240) / 220} className={`sf-dog overflow-visible ${className}`} role="img" aria-label="Mascota de Serflow saludando: un pitbull con gorra y pañoleta">
      <style>{CSS}</style>

      {/* Cuerpo y pecho */}
      <path d="M58 242 C56 200 78 178 110 178 C142 178 164 200 162 242 Z" fill={FUR} {...LINE} />
      <path d="M92 242 C92 214 100 200 110 200 C120 200 128 214 128 242 Z" fill={WHITE} />
      {/* Pañoleta dorada */}
      <path d="M70 184 Q110 204 150 184 L136 200 Q110 226 84 200 Z" fill={GOLD} {...LINE} />
      <circle cx="110" cy="206" r="3" fill={INK} />

      {/* Brazo que saluda */}
      <g className="sf-dog-arm">
        <path d="M150 204 C164 186 174 160 178 138" stroke={INK} strokeWidth="27" strokeLinecap="round" fill="none" />
        <path d="M150 204 C164 186 174 160 178 138" stroke={FUR} strokeWidth="20" strokeLinecap="round" fill="none" />
        <ellipse cx="179" cy="128" rx="16" ry="14" fill={WHITE} {...LINE} />
        <path d="M172 120 L172 128 M179 118 L179 127 M186 120 L186 128" stroke={FUR_SHADE} strokeWidth="2.2" strokeLinecap="round" />
      </g>

      <g className="sf-dog-head">
        {/* Orejas rosa (dobladas hacia afuera, como las de un pitbull) */}
        <g className="sf-dog-ear-l">
          <path d="M64 90 C44 78 26 86 28 106 C40 100 52 102 62 108 Z" fill={FUR_SHADE} {...LINE} />
          <path d="M58 94 C46 88 36 92 35 101 C43 99 50 100 57 103 Z" fill={PINK} />
        </g>
        <path d="M156 90 C176 78 194 86 192 106 C180 100 168 102 158 108 Z" fill={FUR_SHADE} {...LINE} />
        <path d="M162 94 C174 88 184 92 185 101 C177 99 170 100 163 103 Z" fill={PINK} />

        {/* Cabeza ancha con cachetes */}
        <path
          d="M110 56 C152 56 170 84 168 112 C176 124 174 146 158 156 C146 170 128 176 110 176 C92 176 74 170 62 156 C46 146 44 124 52 112 C50 84 68 56 110 56 Z"
          fill={FUR}
          {...LINE}
        />
        {/* Sombra suave bajo la gorra */}
        <path d="M60 96 Q110 84 160 96 Q160 104 152 106 Q110 96 68 106 Q60 104 60 96 Z" fill={FUR_SHADE} opacity=".55" />
        {/* Mancha blanca: frente y hocico */}
        <path d="M103 92 Q110 86 117 92 L123 122 Q110 128 97 122 Z" fill={WHITE} />
        <path d="M70 146 C70 124 88 116 110 116 C132 116 150 124 150 146 C150 162 132 172 110 172 C88 172 70 162 70 146 Z" fill={WHITE} {...LINE} />
        {/* Cachetes */}
        <ellipse cx="70" cy="132" rx="8" ry="5" fill={PINK} opacity=".55" />
        <ellipse cx="150" cy="132" rx="8" ry="5" fill={PINK} opacity=".55" />

        {/* Ojos con brillo */}
        <g className="sf-dog-eyes">
          <ellipse cx="86" cy="112" rx="8.5" ry="10" fill={INK} />
          <ellipse cx="134" cy="112" rx="8.5" ry="10" fill={INK} />
          <circle cx="89" cy="107" r="3.2" fill={WHITE} />
          <circle cx="137" cy="107" r="3.2" fill={WHITE} />
          <circle cx="84" cy="116" r="1.4" fill={WHITE} />
          <circle cx="132" cy="116" r="1.4" fill={WHITE} />
        </g>
        <path d="M74 98 Q84 93 95 97" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M125 97 Q136 93 146 98" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Nariz, boca y lengua */}
        <path d="M97 130 Q110 123 123 130 Q123 141 110 144 Q97 141 97 130 Z" fill={INK} />
        <ellipse cx="105" cy="130" rx="4.5" ry="2.2" fill="#55555e" />
        <path d="M110 144 L110 151" {...LINE} />
        <path d="M88 148 Q99 162 110 151 Q121 162 132 148" fill="none" {...LINE} />
        <path className="sf-dog-tongue" d="M102 156 Q102 171 110 172 Q118 171 118 156 Q110 160 102 156 Z" fill={PINK} {...LINE} strokeWidth={2.5} />

        {/* Gorra de Serflow */}
        <path d="M54 92 C54 50 80 32 110 32 C140 32 166 50 166 92 Q110 78 54 92 Z" fill={GOLD} {...LINE} />
        <path d="M110 34 L110 82" stroke={GOLD_DEEP} strokeWidth="2.5" />
        <path d="M80 42 Q72 62 72 86 M140 42 Q148 62 148 86" stroke={GOLD_DEEP} strokeWidth="2" fill="none" />
        <circle cx="110" cy="33" r="5" fill={GOLD_DEEP} {...LINE} strokeWidth={2.5} />
        <path d="M44 94 Q110 72 176 96 Q180 108 164 108 Q110 94 56 108 Q40 108 44 94 Z" fill={GOLD_DEEP} {...LINE} />
        <text x="110" y="72" textAnchor="middle" fontFamily="Space Grotesk, system-ui" fontWeight="700" fontSize="28" fill={INK}>
          S
        </text>
      </g>
    </svg>
  );
}

/** Mascota saludando con su globo. Va en la esquina del hero. */
export function MascotaSaludo({ size, bubbleSide = "left" }: { size: number; bubbleSide?: "left" | "top" }) {
  return (
    <div className="relative">
      <div
        className={`sf-bubble absolute whitespace-nowrap rounded-2xl bg-ink px-3 py-1.5 font-display text-[15px] font-bold text-primary shadow-[0_6px_18px_rgba(0,0,0,.45)] ${bubbleSide === "left" ? "right-[85%] top-2" : "bottom-[96%] right-[45%]"}`}
      >
        ¡Hola! Bienvenido
      </div>
      <Mascota size={size} />
    </div>
  );
}

/** Lámina para el canvas. */
export function MascotaBoard() {
  return (
    <div className="flex w-[900px] gap-10 rounded-card border border-line bg-surface p-8 font-body text-ink antialiased">
      <div className="flex flex-col items-center gap-3 pt-6">
        <MascotaSaludo size={260} bubbleSide="top" />
        <p className="text-[13px] text-muted">Saluda al cargar; pasa el mouse para que siga saludando</p>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div className="text-[12px] uppercase tracking-[.14em] text-accent">Mascota en SVG · borrador v2</div>
        <h2 className="font-display text-[28px] font-bold leading-tight">Hecha por nosotros, sin 3D</h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed marker:text-accent">
          <li>SVG de ~5 KB (el video de Tito pesaba 183 KB). Cero JavaScript.</li>
          <li>Saluda con la pata al cargar la página, parpadea, mueve una oreja y jadea.</li>
          <li>Vive arriba, en la esquina del hero, con un globo de bienvenida.</li>
          <li>Es un ejemplo de estilo y técnica, no el personaje final: un ilustrador lo puede llevar mucho más lejos (expresiones, poses para la 404 y el aviso de "no hay prendas") y lo animamos con este mismo CSS.</li>
        </ul>
      </div>
    </div>
  );
}
