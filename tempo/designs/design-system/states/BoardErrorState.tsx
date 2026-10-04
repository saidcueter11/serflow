import type { ReactNode } from "react";
import { ErrorState } from "../../../../src/components/ui/ErrorState";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";

function Phone({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[12px] text-muted">{label}</div>
      <div className="flex w-[375px] flex-col gap-4 rounded-tile border border-dashed border-line bg-primary px-4 py-6">
        {children}
      </div>
    </div>
  );
}

const RETRY = "/products/mi-tierra-querida";

export function BoardErrorState() {
  return (
    <PageFrame family="estados" width={1300}>
      <PageTitle
        title="ErrorState"
        description={
          <>
            Algo falló. Props: <Code>kind</Code> (<Code>offline</Code> | <Code>load</Code>), <Code>retryHref</Code> y{" "}
            <Code>title</Code>/<Code>description</Code> opcionales. Reintentar es un <Code>{"<a href={retryHref}>"}</Code>
            : recarga la página sin JS. WhatsApp va de segundo, como link ghost. <Code>role="status"</Code>: avisa sin
            interrumpir.
          </>
        }
      />

      <Row
        name="Los dos kinds · 375px"
        description="El ícono en text-danger (#FF6B6B) marca el fallo; el texto queda en ink y muted para que el contraste no dependa del rojo."
      >
        <div className="flex items-start gap-8">
          <Phone label='kind="offline"'>
            <ErrorState kind="offline" retryHref={RETRY} />
          </Phone>
          <Phone label='kind="load"'>
            <ErrorState kind="load" retryHref={RETRY} />
          </Phone>
        </div>
      </Row>

      <Row
        name="Dentro de una sección"
        description="Reemplaza solo el bloque que falló; el resto de la página sigue. Aquí, el bloque personalizado de PRI-122 que se carga en el cliente."
      >
        <Phone label="sección Para ti (PRI-122)">
          <div className="flex flex-col items-start gap-2">
            <Eyebrow>Para ti</Eyebrow>
            <h2 className="font-display text-[24px] font-bold leading-tight text-ink">Ideas para tu pedido</h2>
          </div>
          <ErrorState
            kind="load"
            retryHref={RETRY}
            title="Las fotos no cargaron"
            description="La señal está lenta. Intenta otra vez o pídenos las fotos por WhatsApp."
          />
        </Phone>
      </Row>

      <Row
        name="Cuándo aplica cada kind"
        description="En un sitio estático la página ya llegó, así que estos estados son para lo que se carga después."
      >
        <div className="grid grid-cols-[120px_1fr] gap-x-6 gap-y-3 text-[14px] leading-relaxed">
          <Code>offline</Code>
          <span className="text-muted">
            Un bloque que hace fetch en el cliente (personalizador PRI-122) y <Code>navigator.onLine</Code> es false. El
            link de WhatsApp sirve igual: la app guarda el mensaje y lo manda cuando vuelve la señal.
          </span>
          <Code>load</Code>
          <span className="text-muted">Hay señal pero el fetch del cliente falló o tardó demasiado.</span>
          <span className="font-mono text-[12px] text-muted">ninguno</span>
          <span className="text-muted">
            Datos de Supabase en el build: si fallan, el build falla y sigue en línea el deploy anterior. Ningún visitante
            ve ese error. Navegar sin señal muestra la página del navegador: sin service worker no hay cómo pintar esto.
          </span>
        </div>
      </Row>

      <Row
        name='Por qué retryHref y no href=""'
        description='href="" sí recarga en los navegadores (resuelve a la URL actual), pero Button lo trata como sin href.'
      >
        <div className="text-[14px] leading-relaxed text-muted">
          <Code>Button.tsx:40</Code> hace <Code>if (href)</Code>: una cadena vacía es falsy y sale un{" "}
          <Code>{'<button type="button">'}</Code> que sin JS no hace nada. Por eso la página pasa su propia URL: en Astro,{" "}
          <Code>retryHref={"{Astro.url.pathname}"}</Code>; en un bloque de cliente, <Code>location.pathname</Code>.
        </div>
      </Row>
    </PageFrame>
  );
}
