import { Button } from "../../../../../src/components/ui/Button";
import { PinIcon } from "../../../../../src/components/icons/PinIcon";
import { VistaMini } from "./VistaMini";

/*
 * PROPUESTA (PRI-286) · Las tres formas de subir "Diseña tu prenda" en la portada. Al construir, la que Said escoja
 * reemplaza el bloque "Diseña la tuya" de src/components/home/HomePage.tsx (no es componente del design system:
 * es un bloque de esa página, como hoy). Todas llevan a /personaliza (PRI-122).
 * Container queries como HomePage: @3xl = 768px, @4xl = 896px del ancho de la portada.
 */

export const PERSONALIZA_HREF = "/personaliza";
const PASOS = ["Sube tu diseño o una foto", "Elige prenda, color y técnica", "Mándanoslo por WhatsApp"];
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Pasos({ compacto = false }: { compacto?: boolean }) {
  return (
    <ol className={`flex flex-col ${compacto ? "gap-2" : "gap-3"}`}>
      {PASOS.map((p, i) => (
        <li key={p} className={`flex items-center gap-3 ${compacto ? "text-[14px]" : "text-[15px]"}`}>
          <span
            className={`flex shrink-0 items-center justify-center rounded-full border border-accent font-display font-medium text-accent ${compacto ? "size-7 text-[13px]" : "size-8 text-[14px]"}`}
          >
            {i + 1}
          </span>
          {p}
        </li>
      ))}
    </ol>
  );
}

function BotonDisenar() {
  return (
    // Mismo botón que hoy usa "Diseña la tuya" en HomePage (dorado sin ícono de WhatsApp).
    <Button variant="whatsapp" href={PERSONALIZA_HREF} icon={null} fullWidth>
      Diseñar mi prenda →
    </Button>
  );
}

/** A · Bloque completo justo después del hero (y la cinta). Mismo esqueleto que "Diseña la tuya" de hoy, con la vista previa del personalizador. */
export function BloquePersonaliza() {
  return (
    <section aria-labelledby="disena-titulo" className="reveal-up px-4 pt-8 @3xl:px-12 @3xl:pt-12">
      <div className="fabric grid overflow-hidden rounded-card border border-secondary/50 bg-surface @3xl:grid-cols-[1fr_1.1fr]">
        <VistaMini aterriza="scroll" className="h-[280px] @3xl:h-auto @3xl:min-h-[420px]" />
        <div className="flex flex-col justify-center p-5 @3xl:p-10">
          <h2 id="disena-titulo" className="font-display text-[26px] font-medium leading-tight @3xl:text-[36px]">
            Diseña tu prenda
          </h2>
          <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-muted @3xl:text-[16px]">
            Sube tu diseño, míralo sobre la camiseta o la gorra en el color que quieras y mándanoslo listo para hacerlo.
          </p>
          <div className="mt-5">
            <Pasos />
          </div>
          <div className="mt-6 w-full @3xl:w-auto @3xl:self-start">
            <BotonDisenar />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * B · Tarjeta que acompaña al hero. Celular: fila bajo el hero (foto a la izquierda). Desde @4xl: la columna de 400px
 * que hoy ocupa el mapa, a la misma altura del carrusel. Toda la tarjeta es el link.
 */
export function TarjetaPersonaliza() {
  return (
    <a
      href={PERSONALIZA_HREF}
      className={`mo-card fabric flex overflow-hidden rounded-card border border-secondary/50 bg-surface text-ink no-underline transition-[translate,border-color] duration-(--motion-slow) ease-out hover:-translate-y-1 hover:border-accent @4xl:h-full @4xl:flex-col ${FOCUS}`}
    >
      <VistaMini etiqueta="" className="min-h-[150px] w-[128px] shrink-0 @4xl:min-h-0 @4xl:w-full @4xl:flex-1" />
      <div className="flex min-w-0 flex-col justify-center gap-1.5 p-4 @4xl:gap-3 @4xl:p-6">
        <h2 className="font-display text-[20px] font-medium leading-tight @4xl:text-[28px]">Diseña tu prenda</h2>
        <p className="text-[14px] leading-snug text-muted @4xl:text-[15px]">Sube tu diseño y míralo sobre la camiseta o la gorra antes de pedirla.</p>
        <div className="hidden pt-1 @4xl:block">
          <Pasos compacto />
        </div>
        <span className="pt-1 text-[14px] font-semibold text-accent @4xl:pt-2 @4xl:text-[15px]">Probar el personalizador →</span>
      </div>
    </a>
  );
}

/**
 * C · El personalizador es el hero. La foto de la prenda con el diseño encima reemplaza al carrusel; la camiseta
 * cambia de negra a blanca sola para mostrar que el color se elige.
 */
export function HeroPersonaliza() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="grid @4xl:grid-cols-[minmax(0,1fr)_minmax(0,500px)] @4xl:items-center @4xl:gap-14 @4xl:px-12 @4xl:pt-10"
    >
      <VistaMini alterna etiqueta="Así se ve tu diseño" className="h-[340px] @4xl:order-2 @4xl:h-[600px] @4xl:rounded-card @4xl:border @4xl:border-line" />
      <div className="anim-enter flex flex-col items-start gap-3 px-4 pt-6 @4xl:gap-5 @4xl:px-0 @4xl:pt-0">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[.14em] text-accent">
          <PinIcon className="size-3.5" /> Mercado Bazurto · Cartagena
        </span>
        <h1 id="hero-titulo" className="font-display text-[34px] font-medium leading-[1.05] tracking-[-0.01em] @4xl:text-[56px]">
          Diseña tu prenda y mírala antes de hacerla
        </h1>
        <p className="max-w-[520px] text-[16px] leading-relaxed text-ink/85 @4xl:text-[19px]">
          Sube tu logo, tu foto o tu idea, ponla sobre la camiseta o la gorra y mándanosla. Estampado, DTF y bordado hechos en
          nuestro taller.
        </p>
        <div className="mt-1 w-full @4xl:w-auto">
          <BotonDisenar />
        </div>
        <div className="hidden pt-2 @4xl:block">
          <Pasos compacto />
        </div>
      </div>
    </section>
  );
}
