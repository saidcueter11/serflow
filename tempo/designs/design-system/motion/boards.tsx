import { HeroCarousel } from "../../../../src/components/ui/HeroCarousel";
import { Ticker } from "../../../../src/components/ui/Ticker";
import { PromoBar } from "../../../../src/components/ui/PromoBar";
import { Thread } from "../../../../src/components/ui/Thread";
import { Palabras } from "../../../../src/components/ui/Palabras";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";
import { HOME_SLIDES, PROMOS_SAMPLE } from "../app-shell/portada";

export const USOS_SAMPLE = ["Uniformes para tu equipo", "Gorras con el logo de tu negocio", "Camisetas para tu evento", "Regalos con tu foto"];

export function BoardIntro() {
  return (
    <PageFrame family="movimiento" width={1000}>
      <PageTitle
        title="Movimiento"
        description={
          <>
            La portada se mueve sin mascota y casi sin JavaScript: carrusel, cinta, barra de promos e hilo de bordado, más las
            utilidades de <Code>src/styles/tokens.css</Code> (<Code>anim-enter</Code>, <Code>stitch-title</Code>, <Code>anim-ring</Code>). Secciones, tarjetas y filas aparecen
            al hacer scroll una sola vez (<Code>sf-espera</Code> y <Code>sf-aparece</Code>, los pone{" "}
            <Code>src/scripts/movimiento.ts</Code>). Todo se apaga con &quot;reducir movimiento&quot;.
          </>
        }
      />
      <ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed marker:text-accent">
        <li>Lo que depende del scroll (reveal, costura de títulos, hilo) usa animation-timeline: donde el navegador no lo soporta, se ve quieto y completo.</li>
        <li>El único JS es el trazado del hilo (src/scripts/thread.ts): mide la página y dibuja; el avance lo hace CSS.</li>
        <li>Una cinta, una barra de promos y un hilo por página. El carrusel solo en el hero.</li>
        <li>No agregues movimiento que se dispare solo y compita con el contenido (objetos que vagan, parallax, contadores).</li>
      </ul>
    </PageFrame>
  );
}

export function BoardHeroCarousel() {
  return (
    <PageFrame family="movimiento" width={1300}>
      <PageTitle
        title="HeroCarousel"
        description="Fotos que muestran el resultado, a sangre, con fundido cada 6 s, zoom lento y una barra de avance por foto en el margen de la rejilla. Se pausa con el mouse."
      />
      <Row name="Portada" description="4 fotos, texto de bienvenida encima (children).">
        <Demo label="900px">
          <div className="pf w-[900px]">
            <div className="pf-v">
              <HeroCarousel slides={HOME_SLIDES} className="pf-hero">
                <div className="pf-hero-texto">
                  <h1 className="pf-display">Bienvenido a Serflow</h1>
                </div>
              </HeroCarousel>
            </div>
          </div>
        </Demo>
      </Row>
      <Row name="Con promo" description="El banner de la promo entra primero y sale la última foto.">
        <Demo label="600px">
          <HeroCarousel slides={[HOME_SLIDES[2], ...HOME_SLIDES.slice(0, 3)]} className="h-[320px] w-[600px] rounded-card" />
        </Demo>
      </Row>
    </PageFrame>
  );
}

export function BoardTickerPromo() {
  return (
    <PageFrame family="movimiento" width={1300}>
      <PageTitle title="Ticker y PromoBar" description="La cinta corre siempre; la barra de promos no corre: se lee de un vistazo y solo existe si hay promos activas." />
      <Row name="Ticker" description="Frases de para qué sirve, no nombres de técnicas.">
        <div className="w-[900px]">
          <Ticker items={USOS_SAMPLE} />
        </div>
      </Row>
      <Row name="PromoBar · 1 promo" description="Quieta. Toda la fila es el link a la promo.">
        <div className="w-[900px]">
          <PromoBar promos={PROMOS_SAMPLE.slice(0, 1)} />
        </div>
      </Row>
      <Row name="PromoBar · 2 promos" description="Toda la barra es un link a /promos; los títulos rotan cada 5 s y Ver las 2 queda quieto. La etiqueta dice cuántas hay.">
        <div className="w-[900px]">
          <PromoBar promos={PROMOS_SAMPLE} />
        </div>
      </Row>
      <Row name="PromoBar · celular" description="El título puede ocupar dos líneas; Ver promo queda a la derecha.">
        <div className="w-[390px]">
          <PromoBar promos={PROMOS_SAMPLE.slice(0, 1)} />
        </div>
      </Row>
    </PageFrame>
  );
}

export function BoardThread() {
  return (
    <PageFrame family="movimiento" width={1000}>
      <PageTitle
        title="Thread"
        description="Costura de dos colores que se cose por la página con el scroll, con la aguja brillando en la punta, puntadas en X en cada vuelta y un nudo al final. Va detrás del contenido."
      />
      <Row name="Trazado completo" description="Así queda al final del scroll (el canvas no tiene scroll de página). En el sitio aparece a medida que bajas.">
        <div className="relative h-[900px] w-[640px] overflow-hidden rounded-card bg-primary">
          <Thread width={640} height={900} viewport={300} />
        </div>
      </Row>
    </PageFrame>
  );
}

export function BoardPalabras() {
  return (
    <PageFrame family="movimiento" width={1000}>
      <PageTitle
        title="Palabras"
        description="Titular palabra por palabra (PRI-287, efecto 3): cada palabra sube desde atrás de una línea, con un giro leve, y la bajada llega después. Solo CSS. Sin JS, con reducir movimiento o con mala señal el texto está ahí desde el principio. Recarga el tablero para verlo otra vez."
      />
      <Row name="Portada" description="En el h1 y en la bajada (p con pf-lead y sf-bajada).">
        <div className="pf font-body text-ink">
          <h1 className="pf-display">
            <Palabras text="Bienvenido" />
            <br />
            <Palabras text="a Serflow" desde={1} />
          </h1>
          <p className="pf-lead sf-bajada mt-4">
            <Palabras text="Camisetas y gorras con tu logo, tu equipo o tu idea. Estampado, DTF y bordado hechos en nuestro taller." />
          </p>
        </div>
      </Row>
    </PageFrame>
  );
}
