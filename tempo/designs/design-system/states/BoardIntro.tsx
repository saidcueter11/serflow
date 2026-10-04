import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { ErrorState } from "../../../../src/components/ui/ErrorState";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { Code, PageFrame, Stat } from "../Chrome";

export function BoardIntro() {
  return (
    <PageFrame family="estados" width={1000}>
      <div className="flex max-w-[760px] flex-col gap-6">
        <div className="text-[12px] uppercase tracking-[.14em] text-muted">Componentes</div>
        <h1 className="font-display text-[36px] font-bold leading-[42px] tracking-tight">Estados</h1>
        <p className="text-[15px] leading-relaxed text-muted">
          Lo que ve el cliente cuando no hay nada que mostrar o cuando algo falló. Con mala señal en Cartagena y un
          catálogo que esconde prendas no confirmadas, los dos pasan seguido. Viven en <Code>src/components/ui</Code> y
          Astro los renderiza sin JS:
        </p>
        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted">
          <li>
            <strong className="text-ink">EmptyState</strong> · todavía no hay nada aquí. No es un error: Disponible ahora
            sin prendas, una categoría vacía.
          </li>
          <li>
            <strong className="text-ink">ErrorState</strong> · algo falló: sin conexión o error al cargar. Trae
            Reintentar (un link, funciona sin JS) y WhatsApp.
          </li>
        </ul>
        <p className="text-[15px] leading-relaxed text-muted">
          Regla: ningún estado es un callejón sin salida. La salida universal es WhatsApp, con{" "}
          <Code>whatsappUrl()</Code> de <Code>src/lib/business.ts</Code>, nunca el número a mano. Y no todo vacío merece
          un estado: una sección opcional sin contenido simplemente no se renderiza (storyboard{" "}
          <strong className="text-ink">Cuándo usar cuál</strong>).
        </p>

        <div className="grid grid-cols-2 gap-4">
          <EmptyState
            title="No hay prendas disponibles en este momento"
            description="Escríbenos y te contamos qué hay en el taller."
            action={{ label: "Pregunta por WhatsApp", href: WHATSAPP_URL }}
          />
          <ErrorState kind="offline" retryHref="/products/mi-tierra-querida" />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <Stat label="Componentes" value="2" detail="EmptyState · ErrorState" />
          <Stat label="ErrorState" value="2" detail="kinds · offline · load" />
          <Stat label="Salida" value="1+" detail="acción siempre; WhatsApp por defecto" />
          <Stat label="Toque" value="44px" detail="alto mínimo de cada acción" />
          <Stat label="Mascota" value="opt-in" detail="mascot, solo si no hay otra" />
          <Stat label="JS" value="0 KB" detail="Reintentar es un link" />
        </div>
      </div>
    </PageFrame>
  );
}
