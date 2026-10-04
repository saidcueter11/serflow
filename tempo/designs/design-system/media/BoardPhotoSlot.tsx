import { PhotoSlot } from "../../../../src/components/ui/PhotoSlot";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";
import { DEMO, DemoPhoto, EmptyOutline } from "./demo";

export function BoardPhotoSlot() {
  return (
    <PageFrame family="fotos y mascota" width={1200}>
      <PageTitle
        title="PhotoSlot"
        description={
          <>
            Una foto real del taller dentro de un marco con proporción fija por tipo. <Code>width</Code>/
            <Code>height</Code> y <Code>aspect-ratio</Code> reservan el espacio antes de que baje la imagen, así nada salta
            con mala señal. Lazy y <Code>decoding="async"</Code> por defecto. Sin <Code>src</Code> devuelve null.
          </>
        }
      />

      <Row
        name="Los cuatro tipos"
        description="La proporción la pone el tipo, no quien lo usa. Retrato (4:5) para lo que se mira de cerca en el celular; horizontal para espacios y personas."
      >
        <div className="flex flex-wrap items-start gap-6">
          <DemoPhoto width={360}>
            <PhotoSlot kind="local" src={DEMO.local} alt="Interior de una tienda de ropa" caption="local · 4:3 en móvil, 16:9 desde 768 px" />
          </DemoPhoto>
          <DemoPhoto width={200}>
            <PhotoSlot kind="estanterias" src={DEMO.estanterias} alt="Percheros con camisetas" caption="estanterias · 4:5" />
          </DemoPhoto>
        </div>
        <div className="flex flex-wrap items-start gap-6">
          <DemoPhoto width={300}>
            <PhotoSlot kind="equipo" src={DEMO.equipo} alt="Persona atendiendo en un mostrador" caption="equipo · 3:2" />
          </DemoPhoto>
          <DemoPhoto width={200}>
            <PhotoSlot kind="trabajo" src={DEMO.trabajo} alt="Gorra con logo bordado" caption="trabajo · 4:5" />
          </DemoPhoto>
        </div>
      </Row>

      <Row
        name="Por qué esas proporciones"
        description="Pensadas para una columna de 375 a 430 px."
      >
        <ul className="flex flex-col gap-2 text-[14px] leading-relaxed text-muted">
          <li>
            <strong className="text-ink">local 4:3 → 16:9</strong> · la fachada y el mostrador son anchos. En móvil 4:3
            deja ver el espacio sin comerse la pantalla; en escritorio pasa a 16:9 como banda. En este canvas se ve 16:9
            porque el iframe mide más de 768 px.
          </li>
          <li>
            <strong className="text-ink">estanterías 4:5</strong> · los estantes son altos; en retrato caben más prendas y
            ocupa casi todo el ancho del celular.
          </li>
          <li>
            <strong className="text-ink">equipo 3:2</strong> · una o dos personas trabajando en la máquina; el formato
            natural de la cámara del celular, se recorta poco.
          </li>
          <li>
            <strong className="text-ink">trabajo 4:5</strong> · la prenda terminada es el producto: retrato, como en
            Instagram, para verla grande en el celular y en grilla de 2.
          </li>
        </ul>
      </Row>

      <Row
        name="Sin foto, no hay sección"
        description="Regla del ticket: nada de relleno. Si falta src, PhotoSlot no pinta nada; la sección que la contiene tampoco debería pintarse."
      >
        <Demo label="sin src">
          <div className="flex items-center gap-6">
            <EmptyOutline width={220} ratio="3 / 2" label="Aquí iría PhotoSlot kind='equipo'. El componente no renderizó nada: este contorno lo dibuja el storyboard." />
            {/* El componente real, sin src: no aparece nada en pantalla. */}
            <PhotoSlot kind="equipo" />
            <div className="max-w-[300px] text-[13px] leading-relaxed text-muted">
              <Code>{'<PhotoSlot kind="equipo" />'}</Code> → <Code>null</Code>. TypeScript exige <Code>src</Code> y{" "}
              <Code>alt</Code> juntos: con foto, alt es obligatorio.
            </div>
          </div>
        </Demo>
      </Row>

      <Row
        name="priority y caption"
        description="priority solo en la única foto visible al cargar (el hero). Las demás bajan cuando el usuario llega a ellas."
      >
        <ul className="flex flex-col gap-2 text-[14px] leading-relaxed text-muted">
          <li>
            <Code>priority</Code> → <Code>loading="eager"</Code> + <Code>fetchpriority="high"</Code> (React 19 además
            agrega un <Code>{'<link rel="preload">'}</Code>). Una por página, como máximo.
          </li>
          <li>
            Sin <Code>priority</Code> → <Code>loading="lazy"</Code> + <Code>decoding="async"</Code>.
          </li>
          <li>
            <Code>caption</Code> va en un <Code>{"<figcaption>"}</Code> muted debajo de la foto. El <Code>alt</Code> describe
            lo que se ve; el caption da contexto ("Gorra bordada para el equipo X").
          </li>
          <li>
            Recibe una sola URL: pásale una imagen ya optimizada (WebP/AVIF, máx. 1600 px). Ver Guía de fotos.
          </li>
        </ul>
      </Row>
    </PageFrame>
  );
}
