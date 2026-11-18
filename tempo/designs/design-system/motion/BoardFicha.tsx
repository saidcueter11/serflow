/// <reference types="vite/client" />
import { Costura } from "../../../../src/components/ui/Costura";
import { Monograma } from "../../../../src/components/ui/Monograma";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
import foto from "../../../../src/assets/images/beisbol/beisbol.webp";

// Ficha de producto (PRI-529): la costura separa la foto de la información y la S va detrás del texto.
const Foto = ({ className }: { className: string }) => <img src={foto} alt="" className={`rounded-tile object-cover ${className}`} />;

export function BoardCostura() {
  return (
    <PageFrame family="movimiento" width={1500}>
      <PageTitle
        title="Costura"
        description="Línea dorada punteada con una puntada en cada punta (PRI-529). Separa la foto de la información en la ficha de producto: vertical en escritorio, del alto de la fila (mide lo mismo que la foto), y horizontal en el celular, entre la foto y el texto. Decorativa: aria-hidden."
      />
      <Row
        name="Vertical (1280)"
        description={
          <>
            Va entre las dos columnas de un <Code>flex</Code> o <Code>grid</Code> y se estira al alto de la fila. El aire
            a cada lado lo pone la página (aquí 64 px).
          </>
        }
      >
        <div className="flex">
          <Foto className="h-[400px] w-[300px]" />
          <Costura className="mx-16" />
          <div className="flex w-[360px] flex-col justify-center gap-3">
            <h3 className="font-display text-[32px] font-semibold leading-tight tracking-tight">Gorra de beisbol bordada</h3>
            <p className="text-[17px] text-muted">La costura mide lo mismo que la foto.</p>
          </div>
        </div>
      </Row>
      <Row name="Horizontal (390)" description="Entre la foto y el texto, a todo el ancho de la rejilla, con las puntadas en las puntas.">
        <div className="flex w-[358px] flex-col gap-7">
          <Foto className="aspect-[3/4] w-full" />
          <Costura orientacion="horizontal" />
          <h3 className="font-display text-[30px] font-semibold leading-tight tracking-tight">Gorra de beisbol bordada</h3>
        </div>
      </Row>
    </PageFrame>
  );
}

export function BoardMonograma() {
  return (
    <PageFrame family="movimiento" width={1500}>
      <PageTitle
        title="Monograma"
        description="La S de Serflow entera detrás del nombre, el precio y los colores (PRI-529), con un brillo dorado que la recorre despacio (9 s). Es una máscara del SVG trazado del ícono (src/assets/monograma-s.svg): sin fondo y del color del brillo. Decorativa: aria-hidden, sin eventos; con reducir movimiento queda quieta."
      />
      <Row
        name="Escritorio (1280)"
        description={
          <>
            <Code>absolute</Code> dentro de la columna de la información, centrada y de 80 % de alto; el texto encima
            en <Code>relative z-10</Code>.
          </>
        }
      >
        <div className="relative flex h-[560px] w-[560px] flex-col justify-center gap-5 px-8">
          <Monograma className="absolute left-1/2 top-1/2 h-[80%] -translate-x-1/2 -translate-y-1/2" />
          <h3 className="relative z-10 font-display text-[44px] font-semibold leading-[1.15] tracking-tight">Gorra de beisbol bordada</h3>
          <p className="relative z-10 text-[26px] font-semibold tabular-nums text-secondary">$45.000</p>
        </div>
      </Row>
      <Row name="Celular (390)" description="72 % del ancho, máximo 300 px, detrás del nombre, el precio y los colores.">
        <div className="relative flex h-[420px] w-[358px] flex-col justify-center gap-4">
          <Monograma className="absolute left-1/2 top-[52%] w-[72%] max-w-[300px] -translate-x-1/2 -translate-y-1/2" />
          <h3 className="relative z-10 font-display text-[30px] font-semibold leading-tight tracking-tight">Gorra de beisbol bordada</h3>
          <p className="relative z-10 text-[22px] font-semibold tabular-nums text-secondary">$45.000</p>
        </div>
      </Row>
    </PageFrame>
  );
}
