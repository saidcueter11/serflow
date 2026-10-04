import { Code, PageFrame, Stat } from "../Chrome";

const PRINCIPLES = [
  ["Fondo oscuro y cálido", "bg-primary #17160f, superficies surface / surface-2. Nada de negro puro ni gris frío."],
  ["Un solo acento", "El dorado del logo, text-accent #FFD700. Sin segundo color de marca: los estados (ok, danger) no compiten."],
  ["Textura sin peso", "La trama de tela es la utilidad fabric: dos repeating-linear-gradient, 0 KB de imagen."],
  ["Motion corto", "120 / 200 / 280 ms. En Cartagena mucha gente entra con mala señal: nada espera a una animación."],
  ["Mobile primero", "Se diseña a 375-430 px. Toques de 44 px mínimo, foco visible en dorado."],
  ["WCAG AA", "Todo texto de token supera 4.5:1 sobre primary, surface y surface-2 (ver Color)."],
];

export function BoardIntro() {
  return (
    <PageFrame family="foundations" width={1100}>
      <div className="flex max-w-[720px] flex-col gap-6">
        <div className="text-[12px] uppercase tracking-[.14em] text-muted">Fundaciones</div>
        <h1 className="font-display text-[40px] font-bold leading-[1.05] tracking-tight">Noche caribe</h1>
        <p className="text-[16px] leading-relaxed text-muted">
          Las fundaciones son los tokens de los que sale todo lo demás: color, tipografía, radios, espaciado, textura y
          motion. Viven en <Code>src/styles/tokens.css</Code> dentro de un bloque <Code>@theme</Code> de Tailwind 4, y los
          importan el sitio Astro (<Code>src/styles/global.css</Code>) y el host del canvas (<Code>tempo/globals.css</Code>).
          Una sola fuente de verdad: si un valor no está ahí, no existe.
        </p>
        <p className="text-[16px] leading-relaxed text-muted">
          Los storyboards muestran el estado objetivo. Lo que el código actual todavía no cumple está en{" "}
          <strong className="text-ink">Design System Debt</strong>, con archivo y línea.
        </p>
      </div>

      <div className="fabric mt-10 flex max-w-[860px] flex-col gap-4 rounded-card border border-line bg-surface p-8">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-primary px-3 py-1 text-[12px] font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Taller en Cartagena
        </span>
        <div className="font-display text-[40px] font-bold leading-[1.05] tracking-[-0.01em]">
          Camisetas y gorras con <span className="text-accent">tu sello.</span>
        </div>
        <p className="max-w-[520px] text-[16px] leading-relaxed text-muted">
          Estampamos, imprimimos en DTF y bordamos en Cartagena. Ven al taller o escríbenos y lo armamos contigo.
        </p>
        <div className="flex gap-3 pt-2">
          <span className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-6 font-display text-[15px] font-bold text-primary">
            Escríbenos por WhatsApp
          </span>
          <span className="inline-flex min-h-[44px] items-center rounded-full border border-line px-6 text-[15px] text-ink">
            Ver catálogo
          </span>
        </div>
      </div>

      <div className="mt-10 grid max-w-[860px] grid-cols-2 gap-x-10 gap-y-5">
        {PRINCIPLES.map(([t, d]) => (
          <div key={t} className="flex flex-col gap-1 border-t border-line pt-4">
            <div className="text-[15px] font-semibold">{t}</div>
            <div className="text-[14px] leading-snug text-muted">{d}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid max-w-[860px] grid-cols-4 gap-3">
        <Stat label="Color" value="14" detail="tokens --color-*" />
        <Stat label="Radios" value="3" detail="tile 12 · card 20 · pill" />
        <Stat label="Motion" value="3 + 1" detail="120 · 200 · 280 ms + ease-out" />
        <Stat label="Fuentes" value="2" detail="display · body (+2 legado)" />
      </div>
    </PageFrame>
  );
}
