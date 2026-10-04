import { MapCard } from "../../../../src/components/ui/MapCard";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

export function BoardMapCard() {
  return (
    <PageFrame family="info del negocio" width={1100}>
      <PageTitle
        title="MapCard"
        description={
          <>
            La sección de ubicación. Arriba, calles dibujadas solo con CSS y el pin (0 KB de imagen). Abajo, nombre,
            dirección, los dos horarios de <Code>HOURS</Code> y Cómo llegar (Button secondary).
          </>
        }
      />

      <Row
        name="Cerrado (primera pintura)"
        description="Así carga siempre. El área del mapa es el <summary> de un <details>: tocarla abre el mapa real de Google debajo."
      >
        <Demo label="375px">
          <div className="w-[375px]">
            <MapCard />
          </div>
        </Demo>
      </Row>

      <Row name="tall" description="260px de mapa en vez de 180px, para el hero de escritorio.">
        <Demo label="tall">
          <div className="w-[480px]">
            <MapCard tall />
          </div>
        </Demo>
      </Row>

      <Row
        name="Rendimiento"
        description="El mapa de Google pesa cientos de KB y abre conexiones a terceros. Aquí cuesta cero hasta que el usuario lo pide."
      >
        <div className="flex flex-col gap-3 text-[14px] leading-relaxed text-muted">
          <p>
            <strong className="text-ink">Cómo:</strong> <Code>{'<details>'}</Code> cerrado +{" "}
            <Code>{'<iframe loading="lazy">'}</Code> adentro. Sin JS: el navegador no pide un iframe lazy que no se
            renderiza, y el contenido de un details cerrado no se renderiza.
          </p>
          <p>
            <strong className="text-ink">Verificado</strong> con Playwright en Chromium 153 sobre el markup real de
            MapCard: <span className="text-ok">0 requests a google.com con el details cerrado</span> (2 s + scroll), 1
            request al abrirlo. Control: el mismo iframe sin <Code>loading=&quot;lazy&quot;</Code> sí se pide con el
            details cerrado, así que el atributo es obligatorio.
          </p>
          <p>
            <strong className="text-ink">Sin verificar:</strong> Safari y Firefox (no instalados aquí). Ambos soportan
            iframes lazy; si alguno lo pidiera igual, el costo es el de hoy, no peor. Cómo llegar funciona siempre como
            link externo.
          </p>
          <p>
            <strong className="text-accent">Por confirmar:</strong> Cómo llegar apunta a{" "}
            <Code>maps/search/?api=1&amp;query=Serflow%20Cartagena</Code>. Cambiarlo a la dirección real cuando{" "}
            <Code>ADDRESS</Code> exista.
          </p>
        </div>
      </Row>
    </PageFrame>
  );
}
