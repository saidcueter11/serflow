import { PhotoSlot } from "../../../../src/components/ui/PhotoSlot";
import { Arrow, Code, DebtBoard, type DebtRow, Tile } from "../Chrome";
import { DEMO, EmptyOutline } from "./demo";

/*
 * Recreaciones "reimplemented for display": los originales viven dentro de
 * archivos .astro y no se pueden renderizar en el canvas de React. Cada copia
 * existe solo para este storyboard; no es un componente para usar.
 */

/** SlideShow.astro:15-134, a escala: carrusel de 3 fotos de stock con flechas y puntos. */
function HeroCarouselLookalike() {
  return (
    <div className="relative h-[200px] w-[150px] overflow-hidden rounded-tile">
      <img src={DEMO.equipo} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/20" />
      <div className="absolute inset-x-0 bottom-6 text-center font-display text-[13px] text-white">Bienvenido a Serflow</div>
      <div className="absolute left-1 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white/10" />
      <div className="absolute right-1 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white/10" />
      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
        <span className="h-1 w-4 rounded-full bg-accent" />
        <span className="h-1 w-2 rounded-full bg-white/40" />
        <span className="h-1 w-2 rounded-full bg-white/40" />
      </div>
    </div>
  );
}

/** CategoryShowcase.astro:24-26: caja gris cuando la categoría no tiene imagen. */
function GrayFillerLookalike() {
  return (
    <div className="relative aspect-[3/4] w-[110px] overflow-hidden rounded-2xl ring-1 ring-white/20">
      <div className="absolute inset-0 bg-zinc-800" />
      <div className="absolute inset-x-0 bottom-0 p-2 font-display text-[12px] text-white">Gorras</div>
    </div>
  );
}

const ROWS: DebtRow[] = [
  {
    title: "El hero del home muestra fotos de stock como si fueran del taller",
    body: (
      <>
        Las tres fotos del carrusel no son de Serflow: un perchero genérico, una mano pagando con tarjeta y una cafetería.
        Los <Code>alt</Code> dicen "Interior de la tienda Serflow", así que además mienten a lectores de pantalla. Es
        justo el relleno que el ticket prohíbe.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/SlideShow.astro:4-6</Code> importa store1.jpg, store2.jpg, store3.jpg (240 KB, 189 KB, 572 KB
        de fuente)
      </>,
      <>
        <Code>src/components/SlideShow.astro:9-11</Code> alts que describen una tienda Serflow que no sale en la foto
      </>,
      <>
        <Code>src/pages/index.astro:71</Code> <Code>{"<SlideShow />"}</Code> es lo primero que ve el visitante
      </>,
    ],
    fix: (
      <>
        Hero sin foto (solo texto sobre <Code>fabric</Code>) hasta que exista la foto del local; luego{" "}
        <Code>{'<PhotoSlot kind="local" priority src=… alt=… />'}</Code>. Borrar store1-3.jpg.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="SlideShow.astro:15" reimplemented>
          <HeroCarouselLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="PhotoSlot local priority">
          <div className="w-[260px]">
            <PhotoSlot kind="local" src={DEMO.local} alt="Interior de una tienda de ropa" priority caption="foto de ejemplo, no es del cliente" />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Carrusel con autoplay, 62vh/90vh de alto y ~190 líneas de JS",
    body: (
      <>
        El hero ocupa casi toda la pantalla del celular antes de mostrar qué hace el taller, y carga un script de carrusel
        (swipe, flechas, puntos, autoplay cada 5 s) para tres fotos. Con mala señal es peso y movimiento que no ayudan a
        pedir una camiseta. Respeta reduced-motion y slow-connection, eso sí.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/SlideShow.astro:15</Code> <Code>h-[62vh] md:h-[90vh] min-h-[360px] md:min-h-[500px]</Code>
      </>,
      <>
        <Code>src/components/SlideShow.astro:137-325</Code> clase Slideshow en un <Code>{"<script>"}</Code>
      </>,
      <>
        <Code>src/components/SlideShow.astro:289-293</Code> <Code>setInterval</Code> de 5000 ms
      </>,
      <>
        <Code>src/components/SlideShow.astro:246-247</Code> transición de 500 ms, fuera de los tokens <Code>--motion-*</Code>{" "}
        (máx. 280 ms)
      </>,
    ],
    fix: (
      <>
        Una sola foto estática (PhotoSlot local, 4:3 en móvil) debajo o detrás del titular, sin carrusel ni JS. Borrar
        SlideShow.astro.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="5 s autoplay · 3 fotos" reimplemented>
          <HeroCarouselLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="1 foto · 0 KB JS">
          <EmptyOutline width={200} ratio="4 / 3" label="PhotoSlot kind='local' cuando exista la foto; si no, nada" />
        </Tile>
      </div>
    ),
  },
  {
    title: "Caja gris de relleno cuando una categoría no tiene imagen",
    body: (
      <>
        Si <Code>cat.image_url</Code> viene vacío, la card pinta un rectángulo <Code>bg-zinc-800</Code> (fuera de la
        paleta) en vez de ocultar la imagen. Es un placeholder visible para el cliente.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/CategoryShowcase.astro:24-26</Code> rama <Code>{": ( <div class=\"absolute inset-0 bg-zinc-800\" /> )"}</Code>
      </>,
    ],
    fix: (
      <>
        Sin imagen, card de solo texto (<Code>bg-surface fabric</Code> con el nombre) o no mostrar la categoría. Nunca un
        bloque gris. Las imágenes de catálogo siguen en CatalogImage.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="CategoryShowcase.astro:25" reimplemented>
          <GrayFillerLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="texto, sin relleno">
          <div className="fabric flex aspect-[3/4] w-[110px] items-end rounded-card border border-line bg-surface p-3 font-display text-[14px] font-bold text-ink">
            Gorras
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Fotos de stock sin usar en src/assets",
    body: (
      <>
        Ocho archivos que ningún componente importa (grep de imports en .astro/.ts/.tsx: 0 resultados). No llegan al
        build, pero invitan a usarlos como relleno y pesan ~1.8 MB en el repo.
      </>
    ),
    bullets: [
      <>
        <Code>src/assets/beisbol.jpg</Code> 704 KB · <Code>miTierraQuerida.jpg</Code> 336 KB · <Code>basketball.jpg</Code>{" "}
        261 KB
      </>,
      <>
        <Code>src/assets/hat1.jpg … hat4.jpg</Code> 476 KB en total · <Code>kids.png</Code> 43 KB
      </>,
      <>hat1.jpg solo lo importa este canvas, como demo etiquetada "foto de ejemplo, no es del cliente"</>,
    ],
    fix: <>Borrarlos cuando se borre SlideShow (y mover las demos del canvas a otra fuente). Las fotos reales entran por PhotoSlot.</>,
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="0 imports · borrar">
          <div className="font-mono text-[12px] leading-relaxed text-muted">
            beisbol.jpg
            <br />
            miTierraQuerida.jpg
            <br />
            basketball.jpg · kids.png
            <br />
            hat1-4.jpg
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Card.astro: 0 usos, hover scale de 500 ms y alto fijo",
    body: (
      <>
        Componente de card con foto que nadie importa. Fija <Code>h-52</Code> en vez de una proporción y hace zoom al
        hover con 500 ms, fuera de los tokens de motion. El alt es el título de la card.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/Card.astro:25</Code> <Code>h-52 object-cover … group-hover:scale-105 duration-500</Code>
      </>,
      <>0 imports de Card.astro en src (ProductCard es otro componente)</>,
    ],
    fix: <>Borrar Card.astro. Para una foto dentro de una card, PhotoSlot con su kind.</>,
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="0 callers · borrar">
          <span className="text-[13px] text-muted">Card.astro</span>
        </Tile>
      </div>
    ),
  },
  {
    title: "Logo del header: fetchpriority high pero lazy",
    body: (
      <>
        <Code>{"<Image>"}</Code> de astro:assets pone <Code>loading="lazy"</Code> por defecto. El logo está arriba del todo
        y pide prioridad alta, pero sigue lazy: señales contradictorias. width/height sí los infiere Astro del import.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/Header.astro:14-20</Code> <Code>fetchpriority="high"</Code> sin <Code>loading="eager"</Code>
      </>,
      <>
        <Code>node_modules/astro/dist/assets/internal.js:96</Code> <Code>loading ??= "lazy"</Code>
      </>,
    ],
    fix: (
      <>
        Agregar <Code>loading="eager"</Code> al logo del header (el del footer, <Code>Footer.astro:15</Code>, está bien
        lazy).
      </>
    ),
    visual: null,
  },
  {
    title: "CatalogImage.astro: lo que se queda",
    body: (
      <>
        Para fotos de catálogo (Supabase) CatalogImage ya hace lo correcto y no se reemplaza: srcset con{" "}
        <Code>widths</Code>/<Code>sizes</Code>, <Code>quality=75</Code>, lazy + <Code>decoding="async"</Code> por defecto,
        eager + fetchpriority high con <Code>preload</Code>, y width/height con <Code>inferSize</Code>.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/CatalogImage.astro:25-37</Code> el patrón a copiar
      </>,
      <>
        <Code>astro.config.mjs:10-17</Code> <Code>remotePatterns</Code> para <Code>**.supabase.co</Code>: Astro optimiza
        las remotas en el build
      </>,
      <>
        Costo: <Code>inferSize</Code> descarga cada imagen remota en el build para medirla
      </>,
    ],
    fix: (
      <>
        Mantener CatalogImage para productos. PhotoSlot recibe una URL ya optimizada; si las fotos del taller pasan a
        Supabase, agregar <Code>srcSet</Code>/<Code>sizes</Code> a PhotoSlot en vez de duplicar CatalogImage.
      </>
    ),
    visual: null,
  },
];

export function BoardDesignSystemDebt() {
  return <DebtBoard family="fotos y mascota" rows={ROWS} />;
}
