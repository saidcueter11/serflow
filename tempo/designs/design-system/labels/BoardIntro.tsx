import { Chip } from "../../../../src/components/ui/Chip";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { StatusPill } from "../../../../src/components/ui/StatusPill";
import { Code, PageFrame, Stat } from "../Chrome";

export function BoardIntro() {
  return (
    <PageFrame family="etiquetas" width={1000}>
      <div className="flex max-w-[680px] flex-col gap-6">
        <div className="text-[12px] uppercase tracking-[.14em] text-muted">Componentes</div>
        <h1 className="font-display text-[36px] font-bold leading-[42px] tracking-tight">Etiquetas</h1>
        <p className="text-[15px] leading-relaxed text-muted">
          Tres piezas pequeñas en forma de píldora que hoy se escriben a mano en cada .astro. Viven en{" "}
          <Code>src/components/ui</Code> y Astro las renderiza sin JS:
        </p>
        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted">
          <li>
            <strong className="text-ink">Chip</strong> · una opción que el cliente elige (talla, técnica, prenda). Es un
            radio nativo, funciona sin JS y con teclado.
          </li>
          <li>
            <strong className="text-ink">Eyebrow</strong> · la etiqueta con punto dorado sobre el título de una sección.
          </li>
          <li>
            <strong className="text-ink">StatusPill</strong> · un estado corto: abierto, disponible, confirmado, cerrado.
          </li>
        </ul>
        <p className="text-[15px] leading-relaxed text-muted">
          Regla rápida: si se puede tocar para elegir, es Chip. Si nombra la sección, es Eyebrow. Si informa un estado,
          es StatusPill. El storyboard <strong className="text-ink">Design System Debt</strong> lista las píldoras hechas
          a mano que deben migrar.
        </p>

        <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6">
          <Eyebrow>Taller en Cartagena</Eyebrow>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="ok">Abierto ahora</StatusPill>
            <StatusPill tone="accent">Disponible · confirmado hace 2 días</StatusPill>
            <StatusPill tone="muted">Cerrado</StatusPill>
          </div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Talla">
            <Chip name="intro-talla" label="S" />
            <Chip name="intro-talla" label="M" />
            <Chip name="intro-talla" label="L" selected />
            <Chip name="intro-talla" label="XL" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <Stat label="Chip" value="2" detail="estados · elegido / sin elegir" />
          <Stat label="Eyebrow" value="1" detail="forma · punto dorado + texto" />
          <Stat label="StatusPill" value="3" detail="tonos · ok · accent · muted" />
          <Stat label="Toque" value="44px" detail="alto mínimo del Chip" />
          <Stat label="Contraste" value="7.3:1" detail="el más bajo de la familia (muted)" />
          <Stat label="JS" value="0 KB" detail="todo es markup estático" />
        </div>
      </div>
    </PageFrame>
  );
}
