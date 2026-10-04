import { MascotSlot } from "../../../../src/components/ui/MascotSlot";
import { PhotoSlot } from "../../../../src/components/ui/PhotoSlot";
import { Code, PageFrame, Stat } from "../Chrome";
import { DEMO, DemoPhoto } from "./demo";

export function BoardIntro() {
  return (
    <PageFrame family="fotos y mascota" width={1000}>
      <div className="flex max-w-[720px] flex-col gap-6">
        <div className="text-[12px] uppercase tracking-[.14em] text-muted">Componentes</div>
        <h1 className="font-display text-[36px] font-bold leading-[42px] tracking-tight">Fotos y mascota</h1>
        <p className="text-[15px] leading-relaxed text-muted">
          Dos piezas para lo que el cliente va a ver del taller de verdad. Viven en <Code>src/components/ui</Code> y Astro
          las renderiza sin JS:
        </p>
        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted">
          <li>
            <strong className="text-ink">PhotoSlot</strong> · una foto real: el local, las estanterías, el equipo o un
            trabajo terminado. Cada tipo tiene su proporción. <strong className="text-ink">Sin foto no renderiza nada</strong>
            : la sección desaparece, nunca se muestra relleno ni stock.
          </li>
          <li>
            <strong className="text-ink">MascotSlot</strong> · el tití cabeciblanco, mascota del taller. Una sola visible por
            página, quieta, nunca sigue el scroll. Hasta que lleguen las poses (PRI-124) se ve una silueta placeholder.
          </li>
        </ul>
        <p className="text-[15px] leading-relaxed text-muted">
          Hoy el sitio no tiene ninguna foto del cliente: el hero del home usa fotos de stock. El storyboard{" "}
          <strong className="text-ink">Guía de fotos</strong> dice qué fotografiar, y{" "}
          <strong className="text-ink">Design System Debt</strong> lista lo que hay que quitar.
        </p>

        <div className="relative flex items-end gap-6 rounded-card border border-line bg-surface p-6">
          <DemoPhoto width={220}>
            <PhotoSlot kind="trabajo" src={DEMO.trabajo} alt="Gorra con logo bordado" caption="Gorra bordada" />
          </DemoPhoto>
          <MascotSlot size="md" />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <Stat label="PhotoSlot" value="4" detail="tipos · local · estanterías · equipo · trabajo" />
          <Stat label="MascotSlot" value="3" detail="tamaños · 72 · 120 · 160 px" />
          <Stat label="Mascotas" value="1" detail="máximo por página" />
          <Stat label="Peso foto" value="< 150 KB" detail="WebP/AVIF, máx. 1600 px de ancho" />
          <Stat label="Peso pose" value="< 40 KB" detail="por pose del tití (PRI-124)" />
          <Stat label="JS" value="0 KB" detail="markup estático, sin animación" />
        </div>
      </div>
    </PageFrame>
  );
}
