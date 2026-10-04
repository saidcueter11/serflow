import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { ServiceCard } from "../../../../src/components/ui/ServiceCard";
import { WorkCard } from "../../../../src/components/ui/WorkCard";
import { Arrow, Code, DebtBoard, type DebtRow, Tile } from "../Chrome";
import { CAP_NAVY, SHIRT_WHITE, WORK_CAPS } from "./samples";

/*
 * Recreaciones "reimplemented for display": los originales viven en archivos .astro
 * y no se pueden renderizar en el canvas de React. Cada copia existe solo para este
 * storyboard; no es un componente para usar.
 */

/** ProductCard.astro:21-60 (imagen cuadrada, skeleton con shimmer, chevron, sin nombre visible) */
function AstroProductCardLookalike({ shimmer = false }: { shimmer?: boolean }) {
  return (
    <div className="relative size-[140px] overflow-hidden rounded-2xl bg-surface ring-1 ring-white/20">
      {shimmer ? (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-light via-primary-lighter to-primary-light" />
      ) : (
        <img src={SHIRT_WHITE} alt="" className="size-full object-cover" />
      )}
      <span className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/55 text-[12px] text-white">
        ›
      </span>
    </div>
  );
}

/** CategoryShowcase.astro:11-37 (3:4, degradado sobre la foto, font-titan) */
function CategoryTileLookalike() {
  return (
    <div className="relative h-[187px] w-[140px] overflow-hidden rounded-2xl ring-1 ring-white/20">
      <img src={CAP_NAVY} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="font-titan text-base leading-tight text-white">Gorras</div>
        <span className="mt-1 block font-vend-sans text-xs text-muted">12 productos</span>
      </div>
    </div>
  );
}

/** Card.astro:14-32 */
function AstroCardLookalike() {
  return (
    <div className="w-[180px] overflow-hidden rounded-2xl border border-white/5 bg-surface">
      <img src={WORK_CAPS} alt="" className="h-24 w-full object-cover" />
      <div className="flex items-center gap-3 p-4">
        <div className="size-1.5 shrink-0 rounded-full bg-accent" />
        <p className="font-vend-sans text-sm text-white/80">Gorras bordadas</p>
      </div>
    </div>
  );
}

function StockSlideLookalike() {
  return (
    <div className="flex h-[110px] w-[200px] flex-col justify-end rounded-tile bg-[linear-gradient(160deg,#5b5345,#2c271f)] p-3 text-[11px] leading-snug text-white/80">
      store3.jpg · un café con mesas y sofás
      <span className="text-white/50">alt: "Muestras de productos listos para personalizar en Serflow"</span>
    </div>
  );
}

const TARGET_PRODUCT = (
  <div className="w-[200px]">
    <ProductCard
      name="Camiseta básica"
      meta="Blanca · S a XL"
      image={{ src: SHIRT_WHITE, alt: "Camiseta blanca lisa (foto de ejemplo)" }}
      href="#"
      confirmedLabel="Confirmado hace 2 días"
    />
  </div>
);

const ROWS: DebtRow[] = [
  {
    title: "Skeleton con shimmer infinito y un script para esconderlo",
    body: (
      <>
        Cada ProductCard.astro pinta un degradado animado sin fin detrás de la foto, con keyframes propios y un script que
        recorre todas las <Code>{"<img>"}</Code> de la página para ocultarlo. Con mala señal es animación constante y JS
        extra para algo que un fondo plano resuelve.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/ProductCard.astro:29</Code> <Code>animate-[shimmer_1.5s_ease-in-out_infinite]</Code>
      </>,
      <>
        <Code>src/components/ProductCard.astro:64-74</Code> <Code>@keyframes shimmer</Code> local
      </>,
      <>
        <Code>src/components/ProductCard.astro:76-92</Code> script en <Code>DOMContentLoaded</Code> que esconde el skeleton
      </>,
    ],
    fix: (
      <>
        Borrar skeleton, keyframes y script. La foto lleva <Code>bg-surface-2</Code> y width/height fijos: el hueco ya
        existe antes de cargar, sin salto ni animación (así lo hace <Code>ui/ProductCard</Code>).
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="ProductCard.astro:29" reimplemented>
          <AstroProductCardLookalike shimmer />
        </Tile>
        <Arrow />
        <Tile tone="target" label="ui/ProductCard">
          {TARGET_PRODUCT}
        </Tile>
      </div>
    ),
  },
  {
    title: "Scale en hover y en tap, con duraciones fuera de los tokens de motion",
    body: (
      <>
        Las cards crecen 2% al tocarlas (<Code>active:scale</Code> no depende de hover, así que en el celular salta en cada
        tap y al empezar a hacer scroll). Las duraciones son 200, 300 y 500ms sueltas en vez de{" "}
        <Code>--motion-fast/med/slow</Code> (120/200/280).
      </>
    ),
    bullets: [
      <>
        <Code>src/components/ProductCard.astro:24</Code>{" "}
        <Code>transition-[box-shadow,transform] duration-300 active:scale-[1.02] hover:scale-[1.02]</Code>
      </>,
      <>
        <Code>src/components/ProductCard.astro:49</Code> overlay <Code>transition-colors duration-300</Code>
      </>,
      <>
        <Code>src/components/CategoryShowcase.astro:13</Code> el mismo scale + <Code>duration-300</Code>;{" "}
        <Code>:28</Code> <Code>duration-200</Code>
      </>,
      <>
        <Code>src/components/Card.astro:25</Code> <Code>group-hover:scale-105 duration-500</Code> sin guarda de hover
      </>,
    ],
    fix: (
      <>
        Sin scale. Hover = borde a <Code>border-muted</Code> con <Code>duration-(--motion-fast)</Code>; foco = outline
        dorado. Es lo que traen las cards nuevas.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="scale 1.02 + 300ms" reimplemented>
          <div className="scale-[1.02]">
            <AstroProductCardLookalike />
          </div>
        </Tile>
        <Arrow />
        <Tile tone="target" label="border-muted · motion-fast">
          {TARGET_PRODUCT}
        </Tile>
      </div>
    ),
  },
  {
    title: "ProductCard.astro no muestra nombre ni tallas",
    body: (
      <>
        La card es solo la foto cuadrada y un chevron. El nombre existe únicamente en el <Code>aria-label</Code> del link,
        así que quien ve la página no sabe qué prenda es, qué color ni qué tallas hay sin entrar.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/ProductCard.astro:23</Code> <Code>{"aria-label={altText ?? 'Ver prenda'}"}</Code>, sin texto
        visible
      </>,
      <>
        <Code>src/components/ProductCard.astro:26</Code> <Code>aspect-square rounded-2xl</Code> (16px, no el radio card de
        20px)
      </>,
    ],
    fix: (
      <>
        Usar <Code>ui/ProductCard</Code>: nombre y meta visibles, <Code>rounded-card</Code>, foto 4:3. El nombre del link
        sale del texto, no de un aria-label.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="ProductCard.astro:23" reimplemented>
          <AstroProductCardLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="ui/ProductCard">
          {TARGET_PRODUCT}
        </Tile>
      </div>
    ),
  },
  {
    title: "Tres cards de 'prenda con foto' que se duplican",
    body: (
      <>
        ProductCard.astro (cuadrada), la card inline de CategoryShowcase.astro (3:4, degradado y texto sobre la foto) y los
        slides de ProductCardList.astro resuelven lo mismo con proporciones, radios y fondos distintos. Fondo de respaldo{" "}
        <Code>bg-zinc-800</Code> fuera de la paleta en dos de ellas.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/ProductCard.astro:26</Code> <Code>aspect-square</Code> · usada en{" "}
        <Code>ProductCardList.astro:117</Code> y <Code>products/[category]/[id].astro:148</Code>
      </>,
      <>
        <Code>src/components/CategoryShowcase.astro:13</Code> <Code>aspect-[3/4] rounded-2xl ring-white/20</Code> ·{" "}
        <Code>:25</Code> <Code>bg-zinc-800</Code> · <Code>:30</Code> <Code>font-titan</Code> legado · usada en{" "}
        <Code>index.astro:97</Code>
      </>,
      <>
        <Code>src/components/ProductCardList.astro:58</Code> <Code>bg-zinc-800</Code> en el slide sin imagen
      </>,
    ],
    fix: (
      <>
        Una sola card de prenda: <Code>ui/ProductCard</Code> en catálogo y relacionados. En el home, la sección de
        categorías cede el lugar a qué hacemos (<Code>ServiceCard</Code>) y Disponible ahora (<Code>ProductCard</Code>).
        Borrar <Code>ProductCard.astro</Code> y la card inline al migrar.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="ProductCard.astro" reimplemented>
          <AstroProductCardLookalike />
        </Tile>
        <Tile tone="remove" label="CategoryShowcase.astro:13" reimplemented>
          <CategoryTileLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="ui/ProductCard · ui/ServiceCard">
          <div className="flex items-start gap-3">
            {TARGET_PRODUCT}
            <div className="w-[200px]">
              <ServiceCard title="Bordado" description="Hilo con relieve. El clásico de las gorras." visual="bordado" />
            </div>
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Card.astro: 0 usos y fuera de los tokens",
    body: (
      <>
        Nadie la importa. Además usa <Code>rounded-2xl</Code> en vez de <Code>rounded-card</Code>, un borde{" "}
        <Code>border-white/5</Code> casi invisible en vez de <Code>border-line</Code>, <Code>text-white/80</Code> y la
        fuente legado <Code>font-vend-sans</Code>.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/Card.astro:16</Code>{" "}
        <Code>rounded-2xl border border-white/5 hover:border-accent/30 transition-all duration-300</Code>
      </>,
      <>
        <Code>src/components/Card.astro:25</Code> <Code>group-hover:scale-105 transition-transform duration-500</Code>
      </>,
      <>
        <Code>src/components/Card.astro:30</Code> <Code>font-vend-sans text-white/80</Code>
      </>,
      <>
        <span>0 imports de </span>
        <Code>Card.astro</Code>
        <span> en </span>
        <Code>src/</Code>
      </>,
    ],
    fix: (
      <>
        Borrar <Code>Card.astro</Code>. Si vuelve a hacer falta una foto con título, es <Code>WorkCard</Code>.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="Card.astro · 0 usos" reimplemented>
          <AstroCardLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="ui/WorkCard">
          <div className="w-[200px]">
            <WorkCard
              image={{ src: WORK_CAPS, alt: "Dos gorras azules con escudo bordado (foto de ejemplo)" }}
              title="Gorras bordadas para un equipo de fútbol"
              technique="Bordado"
            />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Fotos de stock en el home presentadas como el taller, y fotos sin usar en src/assets",
    body: (
      <>
        El slideshow del home usa tres fotos de stock con alt que dice que son la tienda de Serflow (store3.jpg es un
        café). Pesan casi 1 MB entre las tres en origen. Aparte, siete imágenes de <Code>src/assets</Code> no las importa nadie.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/SlideShow.astro:4-6</Code> importa <Code>store1.jpg</Code>, <Code>store2.jpg</Code>,{" "}
        <Code>store3.jpg</Code> (234 KB, 184 KB, 559 KB)
      </>,
      <>
        <Code>src/components/SlideShow.astro:9-11</Code> alt "Interior de la tienda Serflow en Cartagena" y similares
      </>,
      <>
        <Code>src/pages/index.astro:71</Code> <Code>{"<SlideShow />"}</Code> en el home
      </>,
      <>
        <Code>src/assets/</Code> <Code>basketball.jpg</Code>, <Code>beisbol.jpg</Code>, <Code>hat1-4.jpg</Code>,{" "}
        <Code>miTierraQuerida.jpg</Code>, <Code>kids.png</Code>: 0 imports en <Code>src/</Code> (hat4 es 3648x4853)
      </>,
    ],
    fix: (
      <>
        Reemplazar el slideshow por fotos reales del taller en <Code>WorkCard</Code> (y esconder la sección si no hay).
        Corregir los alt para que describan la foto. Borrar las imágenes sin uso.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="SlideShow.astro:11" reimplemented>
          <StockSlideLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="ui/WorkCard · foto real">
          <div className="w-[200px]">
            <WorkCard
              image={{ src: WORK_CAPS, alt: "Dos gorras azules con escudo bordado (foto de ejemplo)" }}
              title="Gorras bordadas para un equipo de fútbol"
              technique="Bordado"
            />
          </div>
        </Tile>
      </div>
    ),
  },
];

export function BoardDesignSystemDebt() {
  return <DebtBoard family="cards" rows={ROWS} />;
}
