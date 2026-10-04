import type { ReactNode } from "react";
import { MascotSlot } from "../../../../src/components/ui/MascotSlot";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

/** Boceto de una página de celular para la regla de "una mascota por página". Narración del canvas. */
function PhoneSketch({ ok, label, children }: { ok: boolean; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative flex h-[440px] w-[220px] flex-col gap-3 overflow-hidden rounded-[28px] border-2 bg-primary p-3 ${ok ? "border-ok" : "border-danger"}`}
      >
        {children}
      </div>
      <span className={`text-[13px] font-semibold ${ok ? "text-ok" : "text-danger"}`}>{label}</span>
    </div>
  );
}

function Bar({ w }: { w: string }) {
  return <div className={`h-2 rounded-full bg-surface-2 ${w}`} />;
}

export function BoardMascotSlot() {
  return (
    <PageFrame family="fotos y mascota" width={1200}>
      <PageTitle
        title="MascotSlot"
        description={
          <>
            El tití cabeciblanco, endémico del Caribe colombiano. Tres tamaños y dos ubicaciones, sin animación. Las poses
            3D pre-renderizadas llegan en PRI-124 (menos de 40 KB cada una) y entran por <Code>pose</Code>; mientras tanto se
            ve la silueta con su etiqueta "Tití · placeholder".
          </>
        }
      />

      <Row name="Tamaños" description="El tamaño lo decide el lugar: sm asomado en una card, md junto al título de una sección, lg en el hero.">
        <div className="flex items-end gap-12">
          <div className="flex flex-col items-center gap-3">
            <MascotSlot size="sm" />
            <span className="font-mono text-[12px] text-muted">sm · 72 px</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <MascotSlot size="md" />
            <span className="font-mono text-[12px] text-muted">md · 120 px</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <MascotSlot size="lg" />
            <span className="font-mono text-[12px] text-muted">lg · 160 px</span>
          </div>
        </div>
      </Row>

      <Row
        name="Ubicación"
        description="inline queda en el flujo. corner se posiciona absoluto arriba a la derecha de un padre relative y asoma por el borde. Nunca fixed ni sticky."
      >
        <Demo label="inline">
          <div className="flex items-center gap-4">
            <MascotSlot size="md" />
            <div className="flex flex-col gap-1">
              <span className="font-display text-[22px] font-bold">Así trabajamos</span>
              <span className="text-[14px] text-muted">Encabezado de sección con el tití al lado.</span>
            </div>
          </div>
        </Demo>
        <Demo label="corner">
          <div className="relative mt-10 w-[300px] rounded-card border border-line bg-primary p-5 pr-24">
            <MascotSlot size="sm" placement="corner" />
            <div className="font-display text-[17px] font-bold">¿Primera vez?</div>
            <p className="pt-1 text-[13px] leading-snug text-muted">Escríbenos y te ayudamos a elegir prenda y técnica.</p>
          </div>
        </Demo>
      </Row>

      <Row
        name="Una por página"
        description="Regla de composición: el componente no la puede imponer, la cuida quien arma la página. Nunca dentro de items que se repiten (cards de producto, listas)."
      >
        <div className="flex items-start gap-10">
          <PhoneSketch ok label="Bien · una, en el hero">
            <div className="relative flex h-[150px] items-end rounded-tile bg-surface p-3">
              <Bar w="w-24" />
              <div className="absolute right-1 top-2">
                <MascotSlot size="sm" />
              </div>
            </div>
            <Bar w="w-28" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-20 rounded-tile bg-surface" />
              <div className="h-20 rounded-tile bg-surface" />
              <div className="h-20 rounded-tile bg-surface" />
              <div className="h-20 rounded-tile bg-surface" />
            </div>
          </PhoneSketch>
          <PhoneSketch ok={false} label="Mal · repetida y pegada al scroll">
            <div className="relative flex h-[150px] items-end rounded-tile bg-surface p-3">
              <Bar w="w-24" />
              <div className="absolute right-1 top-2">
                <MascotSlot size="sm" />
              </div>
            </div>
            <Bar w="w-28" />
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative flex h-20 items-end justify-end overflow-hidden rounded-tile bg-surface">
                  <div className="origin-bottom-right scale-[.55]">
                    <MascotSlot size="sm" />
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-3 right-3 rounded-full border border-danger px-2 py-0.5 text-[10px] text-danger">
              sticky
            </div>
          </PhoneSketch>
          <ul className="flex max-w-[260px] flex-col gap-2 text-[14px] leading-relaxed text-muted">
            <li>Una mascota por página, en el lugar que más la necesite (hero o un encabezado).</li>
            <li>No en cards de producto, ni en listas, ni en cada sección.</li>
            <li>
              Nunca <Code>fixed</Code> ni <Code>sticky</Code>: el FAB de WhatsApp ya ocupa la esquina y la mascota no
              persigue al usuario.
            </li>
          </ul>
        </div>
      </Row>

      <Row
        name="Movimiento"
        description="Quieta. Si algún día se agrega una entrada, una sola y en CSS."
      >
        <ul className="flex flex-col gap-2 text-[14px] leading-relaxed text-muted">
          <li>MascotSlot no tiene animación ni JS: no hay nada que apagar.</li>
          <li>
            Si se agrega una entrada, que sea una sola animación CSS con los tokens <Code>--motion-*</Code>. global.css ya la
            anula con <Code>prefers-reduced-motion: reduce</Code> y con <Code>.slow-connection</Code>.
          </li>
          <li>Nada de loops, parpadeo, seguir el cursor ni reaccionar al scroll.</li>
          <li>
            Poses de PRI-124: PNG/WebP con fondo transparente, lienzo 160:190 (exportar a 320×380 para pantallas 2x), menos
            de 40 KB.
          </li>
        </ul>
      </Row>
    </PageFrame>
  );
}
