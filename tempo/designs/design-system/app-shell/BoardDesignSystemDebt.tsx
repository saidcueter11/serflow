import { Header } from "../../../../src/components/ui/Header";
import { Section } from "../../../../src/components/ui/Section";
import { Footer } from "../../../../src/components/ui/Footer";
import { Button } from "../../../../src/components/ui/Button";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { Arrow, Code, DebtBoard, type DebtRow, Tile } from "../Chrome";
import { LOGO } from "./portada";

/*
 * Recreaciones "reimplemented for display": los originales viven dentro de archivos
 * .astro y no se pueden renderizar en el canvas de React. Cada copia existe solo para
 * este storyboard; no es un componente para usar.
 */

/** Header.astro:8-31: barra fixed con .glass (backdrop-blur) + botón hamburguesa con JS */
function LegacyHeaderLookalike() {
  return (
    <div className="flex w-[300px] items-center justify-between border-b border-primary-lighter/60 bg-primary/70 px-6 py-3 backdrop-blur-md">
      <img src={LOGO} alt="" className="w-20" />
      <span className="text-[20px] leading-none text-muted">☰</span>
    </div>
  );
}

/** Header.astro:72: btn-primary con !py-2 !px-5 */
function LegacyHeaderCtaLookalike() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-[14px] font-semibold text-primary">
      Escríbenos
    </span>
  );
}

/** Footer.astro:53-88: contacto con emojis + íconos de redes en muted/60 "próximamente" */
function LegacyFooterLookalike() {
  return (
    <div className="flex w-[260px] flex-col gap-2 text-[13px] text-muted">
      <span>📍 Cartagena, Colombia</span>
      <span>📧 distribuidoraelmayorista@hotmail.com</span>
      <span>🕐 Lun–Sáb: 8 a.m. – 6 p.m.</span>
      <div className="mt-1 flex gap-3 text-muted/60">
        <span className="size-5 rounded-full border border-current" title="Facebook próximamente" />
        <span className="size-5 rounded-full border border-current" title="Instagram próximamente" />
        <span className="size-5 rounded-full bg-accent" />
        <span className="size-5 rounded-full border border-current" title="TikTok próximamente" />
      </div>
    </div>
  );
}

/** SectionContainer.astro:24-28 + Title.astro:10-14, con las props de index.astro:140-145 */
function LegacySectionLookalike() {
  return (
    <div className="flex w-[260px] flex-col items-start gap-2 px-6">
      <div className="h-0.5 w-10 rounded-full bg-accent" />
      <h2 className="font-display text-[24px] text-white">Encuéntranos</h2>
      <p className="text-[13px] text-muted">Calle fictia #67-112</p>
      <p className="text-[13px] text-muted">🕐 Lunes a sábado, 8 a.m. – 6 p.m.</p>
      <p className="text-[13px] text-muted">🕐 Domingo y festivos, 8 a.m. – 2 p.m.</p>
    </div>
  );
}

/** WhatsAppFAB.astro:5-19: verde #25D366, número a mano, tooltip con emoji en hover */
function LegacyFabLookalike() {
  return <span className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-[11px] font-bold text-white">WA</span>;
}

const OLD_ORDER = ["SlideShow", "Promo", "¿Quiénes somos?", "Categorías", "¿Por qué elegirnos?", "Encuéntranos", "Contacto"];
const NEW_ORDER = ["Hero + QuickFacts", "Quiénes somos", "Qué hacemos", "Disponible ahora", "Trabajos (sin fotos: oculto)", "Dónde estamos", "Hablemos"];

function OrderList({ items }: { items: string[] }) {
  return (
    <ol className="flex w-[220px] flex-col gap-1 text-left text-[13px] text-ink">
      {items.map((s, i) => (
        <li key={s}>
          <span className="font-mono text-muted">{i + 1}. </span>
          {s}
        </li>
      ))}
    </ol>
  );
}

const ROWS: DebtRow[] = [
  {
    title: "Header.astro: 259 líneas, 116 de ellas un script para el drawer móvil",
    body: (
      <>
        El menú móvil es un <Code>{"<aside>"}</Code> con <Code>translate-x-full</Code>, role dialog, focus trap,
        Escape, clic afuera, links activos y re-init en <Code>astro:page-load</Code>. Todo eso en JS que se descarga y
        ejecuta en cada página, con mala señal. Un <Code>{"<details>"}</Code> da abrir, cerrar, teclado y estado
        expandido sin una línea.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/Header.astro:144-259</Code> <span>el script (initHeader, focus trap, Escape)</span>
      </>,
      <>
        <Code>src/components/Header.astro:84-142</Code> <span>el aside del drawer y su botón de cierre</span>
      </>,
      <>
        <Code>src/components/Header.astro:9</Code> <span>fixed top-0 + spacer h-16 en :82</span>
      </>,
    ],
    fix: (
      <>
        <Code>Layout.astro</Code> monta <Code>{"<Header logoSrc={Logo.src} />"}</Code> de <Code>src/components/ui</Code> y se
        borra <Code>Header.astro</Code> con su spacer.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="Header.astro · 116 líneas de JS" reimplemented>
          <LegacyHeaderLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="Header · 0 JS">
          <div className="w-[390px]">
            <Header logoSrc={LOGO} />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Header.astro restiliza el botón con !py-2 !px-5",
    body: (
      <>
        El CTA del header es <Code>btn-primary</Code> con <Code>!important</Code> para achicarlo a ~36px, por debajo
        de los 44px de toque. El Button whatsapp del sistema ya mide 48px y no acepta className.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/Header.astro:72</Code> <span>class=&quot;btn-primary text-sm !py-2 !px-5&quot;</span>
      </>,
      <>
        <Code>src/components/Header.astro:69</Code> <span>y :133 el número de WhatsApp a mano</span>
      </>,
    ],
    fix: <>Lo resuelve la migración de arriba: el Header nuevo usa Button variant whatsapp con WHATSAPP_URL.</>,
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="Header.astro:72" reimplemented>
          <LegacyHeaderCtaLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="Button whatsapp">
          <Button variant="whatsapp" href={WHATSAPP_URL} external>
            Escríbenos
          </Button>
        </Tile>
      </div>
    ),
  },
  {
    title: ".glass: backdrop-blur-md en una barra fija",
    body: (
      <>
        Un blur sobre todo lo que pasa por debajo de un header fixed se recalcula en cada frame de scroll: caro en los
        Android de gama baja de los clientes. El propio global.css ya lo apaga con <Code>.slow-connection</Code>, señal
        de que sobra. El Header nuevo es bg-primary sólido y no se mueve.
      </>
    ),
    bullets: [
      <>
        <Code>src/styles/global.css:126-128</Code> <span>.glass = bg-primary/70 backdrop-blur-md</span>
      </>,
      <>
        <Code>src/styles/global.css:26-28</Code> <span>.slow-connection .glass {"{ backdrop-filter: none }"}</span>
      </>,
      <>
        <Code>src/components/Header.astro:9</Code> <span>único uso</span>
      </>,
    ],
    fix: <>Al borrar Header.astro, borrar .glass y su override de slow-connection.</>,
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label=".glass · delete">
          <div className="h-10 w-40 rounded-tile border border-primary-lighter/60 bg-primary/70 backdrop-blur-md" />
        </Tile>
      </div>
    ),
  },
  {
    title: "Footer.astro: redes 'próximamente' deshabilitadas y contacto copiado a mano",
    body: (
      <>
        Tres íconos grises que no llevan a ningún lado (Facebook, Instagram, TikTok) más correo y horario escritos a
        mano con emojis. La misma fila de redes se repite en index.astro. El Footer nuevo lee todo de business.ts y no
        muestra redes hasta que existan.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/Footer.astro:59-88</Code> <span>3 span &quot;próximamente&quot; en muted/60</span>
      </>,
      <>
        <Code>src/components/Footer.astro:53-56</Code> <span>ciudad, correo y horario a mano; wa.me a mano en :74</span>
      </>,
      <>
        <Code>src/pages/index.astro:196-211</Code> <span>la misma fila de redes &quot;próximamente&quot;</span>
      </>,
    ],
    fix: (
      <>
        <Code>{"<Footer logoSrc={Logo.src} />"}</Code> en Layout.astro; borrar Footer.astro y los íconos de redes que
        queden sin uso.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="Footer.astro:53-88" reimplemented>
          <LegacyFooterLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="Footer">
          <div className="w-[390px]">
            <Footer logoSrc={LOGO} />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "SectionContainer.astro mezcla props de horario en un envoltorio genérico",
    body: (
      <>
        El wrapper de sección acepta <Code>scheduleWeekday</Code>, <Code>scheduleWeekend</Code> y{" "}
        <Code>flexRow</Code>: datos del negocio y layout de una sola sección metidos en el componente de todas. Title.astro
        agrega la barra dorada que el sistema reemplazó por Eyebrow.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/SectionContainer.astro:8-10</Code> <span>las props</span>
      </>,
      <>
        <Code>src/components/SectionContainer.astro:27-28</Code> <span>🕐 + horario renderizado por el wrapper</span>
      </>,
      <>
        <Code>src/pages/index.astro:143-145</Code> <span>único caller con horario y flexRow</span>
      </>,
      <>
        <Code>src/components/Title.astro:11</Code> <span>barra dorada h-0.5 w-10</span>
      </>,
    ],
    fix: (
      <>
        Section (id, eyebrow, title, description, tone) + MapCard para el horario. Borrar SectionContainer.astro y
        Title.astro.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="SectionContainer + Title" reimplemented>
          <LegacySectionLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="Section">
          <div className="w-[390px]">
            <Section title="Dónde estamos">
              <span className="text-[14px] text-muted">MapCard aquí, con ambos horarios.</span>
            </Section>
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: ".section-padding (px-6 md:px-12 lg:px-20) y scroll-mt-24 frente a px-4 / px-12 y scroll-mt-4",
    body: (
      <>
        24px de margen lateral en un teléfono de 375px le quita 16px de ancho útil a cada card frente a los 16px del
        sistema. El scroll-mt de 96-112px existe solo para compensar el header fixed.
      </>
    ),
    bullets: [
      <>
        <Code>src/styles/global.css:130-132</Code> <span>.section-padding</span>
      </>,
      <>
        <Code>src/components/SectionContainer.astro:20</Code> <span>section-padding scroll-mt-24 md:scroll-mt-28</span>
      </>,
      <>
        <Code>src/components/Footer.astro:11</Code> <span>y index.astro:159</span>
      </>,
    ],
    fix: <>Usar Section; borrar .section-padding cuando no quede ningún caller.</>,
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="px-6 · 24px">
          <div className="h-10 w-[120px] border-x-[24px] border-line bg-surface" />
        </Tile>
        <Arrow />
        <Tile tone="target" label="px-4 · 16px">
          <div className="h-10 w-[120px] border-x-[16px] border-line bg-surface" />
        </Tile>
      </div>
    ),
  },
  {
    title: "Layout.astro: 8 pesos de fuente y el WhatsAppFAB viejo",
    body: (
      <>
        Carga Inter y Space Grotesk en 400/500/600/700: dos familias y ocho archivos antes de pintar texto. Los tokens
        piden Space Grotesk 500/700 para títulos y la fuente del sistema para el texto. El FAB montado es el verde de
        WhatsApp con el número a mano, no el dorado del sistema.
      </>
    ),
    bullets: [
      <>
        <Code>src/layouts/Layout.astro:34</Code> <span>family=Space+Grotesk:wght@400;500;600;700&amp;family=Inter:wght@400;500;600;700</span>
      </>,
      <>
        <Code>src/layouts/Layout.astro:69</Code> <span>body font-vend-sans (Inter)</span>
      </>,
      <>
        <Code>src/layouts/Layout.astro:82</Code> <span>{"<WhatsAppFAB />"}; </span>
        <Code>WhatsAppFAB.astro:6</Code> <span>wa.me a mano, :10 bg-[#25D366]</span>
      </>,
    ],
    fix: (
      <>
        Pedir solo <Code>Space+Grotesk:wght@500;700</Code>, body <Code>font-body</Code>, y montar{" "}
        <Code>{"<WhatsAppFab />"}</Code> de src/components/ui. Borrar WhatsAppFAB.astro.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="WhatsAppFAB.astro" reimplemented>
          <LegacyFabLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="WhatsAppFab">
          <WhatsAppFab placement="inline" />
        </Tile>
      </div>
    ),
  },
  {
    title: "El orden actual de index.astro no vende el negocio primero",
    body: (
      <>
        Hoy abre con un slideshow y una promo; quiénes somos y la ubicación quedan abajo. El orden aprobado pone el
        taller, el horario y WhatsApp en la primera pantalla. Ver los dos composites de este canvas.
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/index.astro:71</Code> <span>SlideShow · :75 PromoBanner · :81 Quiénes somos</span>
      </>,
      <>
        <Code>src/pages/index.astro:96</Code> <span>Categorías · :101 Por qué elegirnos · :140 Encuéntranos · :159 Contacto</span>
      </>,
    ],
    fix: (
      <>
        Reescribir index.astro con el orden del composite. En desktop el mapa sube al hero: el ancla{" "}
        <Code>#ubicacion</Code> tiene que vivir en un solo elemento (decidir antes de migrar).
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="index.astro hoy">
          <OrderList items={OLD_ORDER} />
        </Tile>
        <Arrow />
        <Tile tone="target" label="orden aprobado">
          <OrderList items={NEW_ORDER} />
        </Tile>
      </div>
    ),
  },
];

export function BoardDesignSystemDebt() {
  return <DebtBoard family="shell" rows={ROWS} />;
}
