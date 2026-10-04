import { Chip } from "../../../../src/components/ui/Chip";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { StatusPill } from "../../../../src/components/ui/StatusPill";
import { Arrow, Code, DebtBoard, type DebtRow, Tile } from "../Chrome";

/*
 * Recreaciones "reimplemented for display": los originales viven dentro de
 * archivos .astro y no se pueden renderizar en el canvas de React. Cada copia
 * existe solo para este storyboard; no es un componente para usar.
 */

/** index.astro:126-134 */
function TrustPillsLookalike() {
  return (
    <div className="flex gap-2">
      {["Respuesta rápida", "Calidad premium"].map((t) => (
        <span key={t} className="rounded-full border border-primary-lighter/70 bg-primary-lighter px-3.5 py-1.5 text-xs text-muted">
          {t}
        </span>
      ))}
    </div>
  );
}

/** Title.astro:10-15 */
function TitleBarLookalike() {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="h-0.5 w-10 rounded-full bg-accent" />
      <h2 className="font-display text-2xl text-white">Encuéntranos</h2>
    </div>
  );
}

/** SectionContainer.astro:27-28 */
function ScheduleLookalike() {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted">🕐 Lunes a sábado, 8 a.m. – 6 p.m.</p>
      <p className="text-sm text-muted">🕐 Domingo y festivos, 8 a.m. – 2 p.m.</p>
    </div>
  );
}

/** PromoBanner.astro:30 y promos/[slug].astro:48 */
function MicroLabelLookalike() {
  return <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Campana</p>;
}

/** Card.astro:28-31 */
function CardDotLookalike() {
  return (
    <div className="flex items-center gap-3">
      <div className="size-1.5 shrink-0 rounded-full bg-accent" />
      <p className="text-sm text-white/80">Camisetas personalizadas</p>
    </div>
  );
}

/** ProductCardList.astro:83-87 */
function CategoryPillsLookalike() {
  return (
    <div className="flex gap-2">
      <span className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-primary">Camisetas</span>
      <span className="rounded-full border border-primary-lighter bg-surface px-5 py-2 text-sm font-medium text-muted">
        Gorras
      </span>
    </div>
  );
}

const ROWS: DebtRow[] = [
  {
    title: "Píldoras hechas a mano en el home: Respuesta rápida, Calidad premium, Diseño personalizado",
    body: (
      <>
        Tres <Code>{"<span>"}</Code> con la misma cadena de clases copiada. No son opciones ni estados con tono: son
        atributos del taller. Usan <Code>bg-primary-lighter</Code> y un borde casi invisible en vez de los tokens de la
        familia.
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/index.astro:126-128</Code> Respuesta rápida
      </>,
      <>
        <Code>src/pages/index.astro:129-131</Code> Calidad premium
      </>,
      <>
        <Code>src/pages/index.astro:132-134</Code> Diseño personalizado
      </>,
    ],
    fix: (
      <>
        Reemplazar por <Code>{'<StatusPill tone="muted" dot={false}>'}</Code>. No usar Chip: no se eligen.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="index.astro:126" reimplemented>
          <TrustPillsLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="StatusPill muted">
          <div className="flex gap-2">
            <StatusPill tone="muted" dot={false}>
              Respuesta rápida
            </StatusPill>
            <StatusPill tone="muted" dot={false}>
              Calidad premium
            </StatusPill>
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Barra dorada sobre los títulos en vez de Eyebrow",
    body: (
      <>
        Title.astro pone una barra de 2px antes de cada <Code>{"<h2>"}</Code>, y el bloque de contacto la copia a mano.
        La dirección aprobada usa Eyebrow: el punto dorado ya es el acento y además dice algo.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/Title.astro:11</Code> barra <Code>h-0.5 w-10 bg-accent</Code>
      </>,
      <>
        <Code>src/pages/index.astro:164</Code> la misma barra copiada sobre Contáctanos
      </>,
    ],
    fix: (
      <>
        Title acepta un <Code>eyebrow</Code> opcional que renderiza <Code>{"<Eyebrow>"}</Code>; borrar la barra y la
        copia de index.astro.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="Title.astro:11" reimplemented>
          <TitleBarLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="Eyebrow">
          <div className="flex flex-col items-start gap-2">
            <Eyebrow>Taller en Cartagena</Eyebrow>
            <h2 className="font-display text-2xl font-bold text-ink">Encuéntranos</h2>
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Horario con emoji 🕐 en SectionContainer",
    body: (
      <>
        El emoji hace de ícono de estado y se lee distinto en cada sistema operativo. El horario es dato, no estado:
        va en texto. Saber si el taller está abierto ahora requiere la hora del visitante, y el sitio es estático.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/SectionContainer.astro:27</Code> 🕐 horario entre semana
      </>,
      <>
        <Code>src/components/SectionContainer.astro:28</Code> 🕐 horario de fin de semana
      </>,
    ],
    fix: (
      <>
        Quitar el emoji y dejar el horario en texto muted. Mostrar <Code>{'<StatusPill tone="ok">Abierto ahora'}</Code>{" "}
        solo cuando se calcule la hora (script pequeño o build por franja); mientras tanto, nada de estado inventado.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="SectionContainer.astro:27" reimplemented>
          <ScheduleLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="StatusPill + texto">
          <div className="flex flex-col items-start gap-2">
            <StatusPill tone="ok">Abierto ahora</StatusPill>
            <p className="text-sm text-muted">Lunes a sábado, 8 a.m. a 6 p.m.</p>
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Micro-etiquetas de 10px fuera de escala (y con typo)",
    body: (
      <>
        <Code>text-[10px] tracking-[0.2em]</Code> está por debajo del mínimo de la escala (12px) y es difícil de leer en
        exteriores. El texto dice <Code>Campana</Code> donde va <Code>Campaña</Code>.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/PromoBanner.astro:30</Code> <Code>text-[10px] md:text-xs tracking-[0.2em]</Code>
      </>,
      <>
        <Code>src/pages/promos/[slug].astro:48</Code> <Code>text-[10px] tracking-[0.2em]</Code>
      </>,
    ],
    fix: (
      <>
        Reemplazar por <Code>{"<Eyebrow>Campaña</Eyebrow>"}</Code> sobre el título de la promo (en el banner sobre foto,
        la píldora surface ya da el contraste).
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="PromoBanner.astro:30" reimplemented>
          <MicroLabelLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="Eyebrow">
          <Eyebrow>Campaña</Eyebrow>
        </Tile>
      </div>
    ),
  },
  {
    title: "Punto dorado suelto en Card.astro",
    body: (
      <>
        Un <Code>{"<div>"}</Code> de 6px como viñeta antes del título de la card. Es el punto de Eyebrow sin su píldora,
        y con <Code>text-white/80</Code> en vez de <Code>text-ink</Code>.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/Card.astro:29</Code> <Code>w-1.5 h-1.5 bg-accent rounded-full</Code>
      </>,
    ],
    fix: (
      <>
        Quitar el punto: en una card el título basta. Si la card necesita una etiqueta, usar{" "}
        <Code>{"<Eyebrow>"}</Code> encima del título, no un punto suelto.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="warn" label="Card.astro:29" reimplemented>
          <CardDotLookalike />
        </Tile>
      </div>
    ),
  },
  {
    title: "Pills de categoría del catálogo: look de Chip a 36px",
    body: (
      <>
        Son links de navegación (<Code>aria-current</Code>), así que no deben ser Chip (radio). Pero miden ~36px de
        alto (<Code>py-2</Code> + <Code>text-sm</Code>), debajo de los 44px de toque, y usan la fuente legado{" "}
        <Code>font-vend-sans</Code>.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/ProductCardList.astro:83-87</Code> clases de la pill activa e inactiva
      </>,
    ],
    fix: (
      <>
        Mantener el <Code>{"<a>"}</Code> y copiar las medidas del Chip: <Code>min-h-11 px-4 text-[14px] font-semibold</Code>
        , <Code>border-line bg-surface text-ink</Code> inactiva, <Code>bg-accent text-primary</Code> activa.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="warn" label="ProductCardList.astro:83" reimplemented>
          <CategoryPillsLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="medidas de Chip">
          <div className="flex gap-2">
            <Chip name="debt-cat" label="Camisetas" selected />
            <Chip name="debt-cat" label="Gorras" />
          </div>
        </Tile>
      </div>
    ),
  },
];

export function BoardDesignSystemDebt() {
  return <DebtBoard family="etiquetas" rows={ROWS} />;
}
