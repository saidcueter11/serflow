import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "../../../../src/components/ui/Button";
import { CategoryNav } from "../../../../src/components/ui/CategoryNav";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { Header } from "../../../../src/components/ui/Header";
import { NewBadge } from "../../../../src/components/ui/NewBadge";
import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { PromoBar } from "../../../../src/components/ui/PromoBar";
import { Section } from "../../../../src/components/ui/Section";
import { ServiceCard } from "../../../../src/components/ui/ServiceCard";
import { StatusPill } from "../../../../src/components/ui/StatusPill";
import { Ticker } from "../../../../src/components/ui/Ticker";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { Code, PageFrame, PageTitle, Row } from "../../design-system/Chrome";
import { CATALOG_HREF, LOGO, PRODUCTS, PROMOS_SAMPLE } from "../../design-system/app-shell/portada";
import { CHIPS, FOTOS } from "./comun";
import { AlCargar, Ficha, Gesto, Repetir } from "./narracion";

/* Narración de la ronda 2 ("más fuerte"): intro, movimiento en vivo, fundamentos y la lista de cambios. */

const FAMILIA = "refresh más fuerte · ronda 2 · PRI-286 + PRI-287";

/** r2 = false solo en Fundamentos, que muestra la ronda 1 al lado (cada bloque pone su propio sf-r2). */
function TableroR2({ width, r2 = true, children }: { width: number; r2?: boolean; children: ReactNode }) {
  return (
    <div className={`sf-refresh ${r2 ? "sf-r2" : ""}`}>
      <PageFrame family={FAMILIA} width={width}>
        {children}
      </PageFrame>
    </div>
  );
}

function Lista({ titulo, items }: { titulo: string; items: ReactNode[] }) {
  return (
    <div>
      <h2 className="sf-etiqueta">{titulo}</h2>
      <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed marker:text-accent">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export function IntroR2() {
  return (
    <TableroR2 width={1000}>
      <PageTitle
        title="Refresh más fuerte · ronda 2"
        description={
          <>
            Tu comentario del 27 de octubre: &quot;lo único que veo diferente es un cambio de color del dorado&quot;. Tenías razón: la letra
            nueva casi no se notaba de lejos, el movimiento solo salía con el mouse y la estructura no cambió. Esta ronda cambia lo que se ve
            en una captura quieta.
          </>
        }
      />
      <div className="grid grid-cols-2 gap-10 pb-10">
        <Lista
          titulo="Los 4 cambios, en toda la app"
          items={[
            <><b>Títulos grandes y livianos:</b> Plus Jakarta Sans 500, 88 / 80 / 64 px en desktop y 48 / 44 / 40 en el celular, tracking -0.02em, interlineado 1.05. Entre secciones, 50 % más de aire.</>,
            <><b>El dorado como hilo:</b> solo el botón principal, las costuras, las etiquetas pequeñas y el foco. La barra de promos, la pestaña elegida, el ticker, las etiquetas Nuevo y los chips llenos pasan a negro cálido, tinta o gris.</>,
            <><b>Fotos a sangre, sin cajas:</b> hero, banner del catálogo y afiche de la promo a todo el ancho; tarjetas sin borde ni fondo (foto + pie). El personalizador va justo después del hero, estilo Heirest.</>,
            <><b>Entradas sin mouse:</b> el titular sube línea por línea al cargar (una vez) y los bloques suben al llegar a la vista. Con reducir movimiento, todo quieto y visible.</>,
          ]}
        />
        <Lista
          titulo="Lo que se queda"
          items={[
            "Plus Jakarta Sans, el oro viejo #C9A24A, los negros cálidos y los 4 movimientos de la ronda 1.",
            "Premium en negro y oro, sin modelos, sin mascota, nada folclórico.",
            "WhatsApp: el flotante y el botón de cada afiche o foto. Dirección y horario, una sola vez (Visítanos, al final).",
            "Cero JavaScript nuevo en el sitio: todo es CSS (scroll-timeline donde el navegador lo tiene; donde no, quieto y completo).",
          ]}
        />
      </div>
      <div className="rounded-card border border-line bg-surface p-6">
        <h2 className="text-[17px] font-semibold">Cómo leer el canvas</h2>
        <ol className="mt-3 flex list-decimal flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-muted marker:text-accent">
          <li>Arriba: esta intro, el movimiento en vivo, fundamentos (escala, dorado, aire y la prueba de la fuente) y la lista de cambios para el PR.</li>
          <li>Debajo, una fila por pantalla: portada, catálogo (categoría y visor), promos (lista y detalle) y personalizador. Antes y después de página completa, 390 a la izquierda y 1280 a la derecha.</li>
          <li>El después son los componentes de producción de hoy con refresh.css + refresh-r2.css encima; nada está redibujado. Las JPG fijas están en capturas/r2/.</li>
          <li>Al fondo, la fila &quot;Ronda 1 (descartada)&quot;, tal como la viste.</li>
        </ol>
      </div>
    </TableroR2>
  );
}

/** Caja con scroll propio: el bloque de adentro entra con view() al llegar. Repetir vuelve arriba y baja solo. */
function BloqueAlScroll() {
  const caja = useRef<HTMLDivElement>(null);
  const [vuelta, setVuelta] = useState(0);
  useEffect(() => {
    const c = caja.current;
    if (!c) return;
    c.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const t = setTimeout(() => c.scrollTo({ top: c.scrollHeight, behavior: "smooth" }), 500);
    return () => clearTimeout(t);
  }, [vuelta]);
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div ref={caja} className="sf-demo-scroll h-[460px] w-full overflow-y-auto rounded-tile bg-primary ring-1 ring-line">
        <div className="flex h-[440px] items-end px-12 pb-6 text-[13px] text-muted">↓ La página baja: el bloque de abajo sube y aparece al llegar.</div>
        <div className="@container">
          <Section id="demo-servicios" title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño.">
            <div className="grid grid-cols-3 gap-8">
              <ServiceCard title="Estampado" description="Mate, toma la textura de la tela." image={{ src: FOTOS.estampadoRasero, alt: "Estampado" }} />
              <ServiceCard title="DTF" description="Colores vivos y con brillo." image={{ src: FOTOS.mtq5, alt: "DTF" }} />
              <ServiceCard title="Bordado" description="Hilo con relieve." image={{ src: FOTOS.gorraBordada2, alt: "Bordado" }} />
            </div>
          </Section>
        </div>
      </div>
      <Repetir onClick={() => setVuelta((v) => v + 1)} />
    </div>
  );
}

export function MovimientoR2() {
  return (
    <TableroR2 width={1500}>
      <PageTitle
        title="Movimiento en vivo · ronda 2"
        description="Lo nuevo de esta ronda son las dos entradas que no esperan el mouse: el titular al cargar y los bloques al llegar a la vista. Botón, foto y costura son los de la ronda 1, ahora sobre las tarjetas sin caja. ↻ Repetir vuelve a correr cada uno."
      />
      <Row name="Titular que entra al cargar" description="Cada línea sube detrás de una máscara, 120 ms después de la anterior; la bajada y el botón llegan después. Una sola vez por carga.">
        <AlCargar>
          <div className="@container flex flex-col items-start gap-5" style={{ width: 1080 }}>
            <span className="sf-etiqueta">Mercado Bazurto · Cartagena</span>
            <h1 className="sf-lineas sf-t-display font-display">
              <span>
                <span>Bienvenido</span>
              </span>
              <span>
                <span>a Serflow</span>
              </span>
            </h1>
            <p className="sf-t-lead text-ink/85">Camisetas y gorras con tu logo, tu equipo o tu idea.</p>
            <div>
              <Button variant="secondary" href={CATALOG_HREF}>
                Ver el catálogo
              </Button>
            </div>
          </div>
        </AlCargar>
        <Ficha items={[["Clases", <><Code>sf-lineas</Code> + <Code>sf-t-display</Code>; la bajada y el botón con <Code>sf-entra-despues</Code></>], ["Tiempos", "900 ms por línea · escalón 120 ms · bajada +340 ms · botón +460 ms"], ["Dónde", "Hero de la portada; h1 de catálogo (banner), promos, detalle, 404 y personalizador con sf-entra (una línea)"]]} />
      </Row>
      <Row name="Bloque que entra al scroll" description="Cada sección sube 16 px y aparece mientras entra a la pantalla (entry 0 % a 40 %). Atado al scroll: no hay temporizadores ni JavaScript.">
        <BloqueAlScroll />
        <Ficha items={[["Clase", <Code key="c">sf-bloque</Code>], ["Cómo", "animation-timeline: view(); donde no existe, el bloque se ve quieto y completo"], ["Dónde", "Contenido de cada Section y la foto de la banda del personalizador"]]} />
      </Row>
      <Row name="Botón con brillo" description="Igual que en la ronda 1: sube, reflejo y halo dorado; al tocar se hunde. Es el único dorado grande de cada bloque.">
        <Gesto>
          <Button variant="whatsapp" href={WHATSAPP_URL} external>
            Pedir por WhatsApp
          </Button>
          <Button variant="secondary" href="#">
            Ver 12 más
          </Button>
        </Gesto>
      </Row>
      <Row name="Foto que se acerca" description="Ahora sobre la tarjeta sin caja: la foto gana color y se acerca, el pie sube 4 px.">
        <Gesto>
          <div className="@container w-[300px]">
            <ProductCard name={PRODUCTS[2].name} meta={PRODUCTS[2].meta} href={CATALOG_HREF} image={{ src: PRODUCTS[2].src, alt: PRODUCTS[2].name }} />
          </div>
        </Gesto>
      </Row>
      <Row name="Enlace que se cose" description="El link queda en tinta y el oro aparece como costura al pasar, al enfocar o en la página actual.">
        <Gesto toque={false}>
          <div className="w-[960px] overflow-hidden rounded-tile ring-1 ring-line">
            <Header logoSrc={LOGO} current="/products" />
          </div>
          <Button variant="ghost" href={CATALOG_HREF}>
            Ver todo el catálogo →
          </Button>
        </Gesto>
      </Row>
    </TableroR2>
  );
}

const ESCALA: { nombre: string; clase: string; spec: string; texto: string }[] = [
  { nombre: "Display", clase: "sf-t-display", spec: "88 / 48 px · 500 · -0.02em · 1.05", texto: "Bienvenido a Serflow" },
  { nombre: "H1 página", clase: "sf-t-h1", spec: "80 / 44 px · 500", texto: "Promos de hoy" },
  { nombre: "H2 sección", clase: "sf-t-h2", spec: "64 / 40 px · 500", texto: "Qué hacemos" },
  { nombre: "H3 tarjeta", clase: "sf-t-h3", spec: "24 / 19 px · 500", texto: "Gorra Mi Tierra Querida" },
  { nombre: "Bajada", clase: "sf-t-lead", spec: "21 / 17 px · 400 · 1.5", texto: "Lo que hay en el taller esta semana." },
];

/** Prueba en vivo de que Plus Jakarta Sans cargó (y no la fuente del sistema). */
function PruebaFuente() {
  const [estado, setEstado] = useState("comprobando…");
  useEffect(() => {
    document.fonts.ready.then(() => {
      const cargada = [...document.fonts].some((f) => f.family.replace(/["']/g, "") === "Plus Jakarta Sans" && f.status === "loaded");
      setEstado(cargada ? "Plus Jakarta Sans cargada ✓" : "No cargó: se ve la fuente del sistema ✗");
    });
  }, []);
  return (
    <div className="sf-r2 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="sf-etiqueta">Plus Jakarta Sans 500 · 80 px</p>
          <p className="mt-2 font-display text-[80px] font-medium leading-[1.05] tracking-[-0.02em]">Serflow taller</p>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[.16em] text-muted">Space Grotesk 500 · 80 px (antes)</p>
          <p className="mt-2 text-[80px] font-medium leading-[1.05] tracking-[-0.01em]" style={{ fontFamily: "'Space Grotesk'" }}>
            Serflow taller
          </p>
        </div>
      </div>
      <p className="text-[14px] text-muted">
        document.fonts en este frame: <b className="text-ink">{estado}</b> · la g, la a y la t redondas son de Jakarta; la t y la a con esquinas cuadradas, de Space Grotesk.
      </p>
    </div>
  );
}

export function FundamentosR2() {
  return (
    <TableroR2 width={1500} r2={false}>
      <PageTitle
        title="Fundamentos · ronda 2"
        description="Escala con saltos claros, el dorado como hilo y más aire. Los tamaños usan cqi (el ancho del contenedor): el mismo valor da 88 px a 1280 y 48 px a 390, sin breakpoints."
      />
      <Row name="La fuente carga" description="Verificado en el canvas y en las capturas: Plus Jakarta Sans 400-700 desde Google Fonts (un woff2).">
        <PruebaFuente />
      </Row>
      <Row name="Escala tipográfica" description="Antes: 64 / 40 / 28 px casi iguales entre sí. Ahora cada paso es ~1.25 del siguiente y los títulos van en 500, no en negrita.">
        <div className="sf-r2 @container flex flex-col gap-6" style={{ width: 1080 }}>
          {ESCALA.map((e) => (
            <div key={e.nombre} className="grid grid-cols-[150px_1fr] items-baseline gap-6 border-t border-line pt-4 first:border-t-0 first:pt-0">
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-semibold">{e.nombre}</span>
                <span className="text-[12px] text-muted">{e.spec}</span>
                <Code>{e.clase}</Code>
              </div>
              <p className={`${e.clase} ${e.clase === "sf-t-lead" ? "text-muted" : "font-display"}`}>{e.texto}</p>
            </div>
          ))}
        </div>
      </Row>
      <Row name="El dorado como hilo" description="Arriba, la ronda 1 (dorado grande). Abajo, la ronda 2: el oro queda en el botón, la costura, las etiquetas y el foco.">
        <div className="flex flex-col gap-6">
          <div className="sf-refresh flex flex-col gap-4">
            <span className="text-[12px] font-semibold uppercase tracking-[.16em] text-muted">Ronda 1</span>
            <div className="overflow-hidden rounded-tile ring-1 ring-line">
              <PromoBar promos={PROMOS_SAMPLE.slice(0, 1)} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-[520px]">
                <CategoryNav categories={CHIPS.slice(0, 4)} current="/products/mi-tierra-querida" />
              </div>
              <Eyebrow>3 promos activas</Eyebrow>
              <NewBadge />
              <StatusPill tone="accent">Hasta el domingo</StatusPill>
            </div>
            <div className="overflow-hidden rounded-tile ring-1 ring-line">
              <Ticker items={["Uniformes para tu equipo", "Gorras con el logo de tu negocio", "Camisetas para tu evento"]} />
            </div>
          </div>
          <div className="sf-refresh sf-r2 flex flex-col gap-4 border-t border-line pt-6">
            <span className="sf-etiqueta">Ronda 2</span>
            <div className="overflow-hidden rounded-tile ring-1 ring-line">
              <PromoBar promos={PROMOS_SAMPLE.slice(0, 1)} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-[520px]">
                <CategoryNav categories={CHIPS.slice(0, 4)} current="/products/mi-tierra-querida" />
              </div>
              <Eyebrow>3 promos activas</Eyebrow>
              <NewBadge />
              <StatusPill tone="accent">Hasta el domingo</StatusPill>
            </div>
            <div className="overflow-hidden rounded-tile ring-1 ring-line">
              <Ticker items={["Uniformes para tu equipo", "Gorras con el logo de tu negocio", "Camisetas para tu evento"]} />
            </div>
          </div>
        </div>
      </Row>
      <Row name="Aire" description="Cada sección pone la mitad arriba y la mitad abajo.">
        <Ficha
          items={[
            ["Entre secciones", "64 → 96 px en el celular · 112 → 176 px en desktop"],
            ["Título → contenido", "20-24 → 40 px; título → bajada 8 → 16 px"],
            ["Cabecera de página", "24 / 40 → 40 / 72 px arriba del h1"],
            ["Tarjetas", "gap 12-20 → 16-32 px; foto → pie 12 → 14-18 px"],
          ]}
        />
      </Row>
    </TableroR2>
  );
}

const CAMBIOS: { grupo: string; items: ReactNode[] }[] = [
  {
    grupo: "0 · Base",
    items: [
      <>Todo lo de la ronda 1 (tablero &quot;Lista de cambios para el PR&quot; de abajo): oro viejo, Plus Jakarta Sans, los 4 movimientos y sus tokens. Esta lista es lo que se suma encima.</>,
      <>Copiar tempo/designs/canvases/refresh-oro-viejo/refresh-r2.css a src/styles/tokens.css con la misma regla: variables de .sf-r2 a @theme, sin el prefijo .sf-r2, sin lo que va después de cada PUENTE y sin la sección Solo canvas.</>,
    ],
  },
  {
    grupo: "1 · Tokens nuevos (@theme)",
    items: [
      <>Escala: --sf-display clamp(48px, 6.9cqi, 88px) · --sf-h1 clamp(44px, 6.25cqi, 80px) · --sf-h2 clamp(40px, 5cqi, 64px) · --sf-h3 clamp(19px, 1.75cqi, 24px) · --sf-lead clamp(17px, 1.6cqi, 21px). Títulos: 500, -0.02em, 1.05, text-wrap: balance.</>,
      <>Aire: --sf-aire 48px y --sf-aire-desktop 88px (padding-block de Section; desde @3xl usa el de desktop).</>,
    ],
  },
  {
    grupo: "2 · Clases nuevas (tokens.css)",
    items: [
      <>sf-t-display, sf-t-h1, sf-t-h2, sf-t-h3, sf-t-lead, sf-etiqueta, sf-seccion, sf-tarjeta, sf-banda, sf-bloque (entra con view()), sf-entra-despues (bajada que llega 200 ms después del h1) y el keyframe sf-sube. Todas en la lista de prefers-reduced-motion: sin animación, opacity 1, transform none.</>,
      <>Stitch-title: la costura pasa a 56 × 2 px, puntada 6/4 px, 20 px debajo del título.</>,
    ],
  },
  {
    grupo: "3 · Títulos (cambian clases, no props)",
    items: [
      <>HomePage h1: sf-lineas sf-t-display en dos líneas. Section h2: sf-t-h2 (sale text-[28px] @3xl:text-[40px] font-medium tracking-[-0.01em]). PromosPage H1, NotFoundPage h1, PersonalizaPage h1 y el nombre de CategoryBanner: sf-t-h1. PromoDetailPage h1: sf-t-h2 (los títulos de promo son largos).</>,
      <>Títulos de tarjeta (ProductCard h3, PromoCard H, ServiceCard h3, pasos de PersonalizaCampos y HojaEnvio): sf-t-h3, de bold a 500. PromoAfiche h2: clamp(26px, 3.4cqi, 48px), crece con su ancho.</>,
      <>Bajadas: sf-t-lead en Section (description), CatalogPage (intro), PromosPage, NotFoundPage, PersonalizaPage y el hero; mt-2 → mt-4.</>,
      <>ViewerPage: el h1 deja de ser sr-only y va con sf-t-h2 encima del botón de la categoría.</>,
    ],
  },
  {
    grupo: "4 · Dorado solo en detalles",
    items: [
      <>Eyebrow: sin borde, fondo ni punto; texto 12 px 600 mayúsculas tracking .16em en text-accent (sf-etiqueta). StatusPill accent: sin bg-accent/12 ni px. ContactList y QuickFacts: el círculo pasa de bg-accent/12 a ring-1 ring-line.</>,
      <>PromoBar: bg-accent text-primary → bg-primary-light text-ink border-b border-line; la etiqueta, texto dorado sin fondo; el subrayado de Ver promo en decoration-accent; el foco en outline-accent.</>,
      <>CategoryNav: elegida border-ink bg-ink text-primary (sale bg-accent); las demás sin borde ni fondo, text-muted, hover:text-ink hover:border-line. Chip (formularios): elegido igual, en tinta; los no elegidos conservan border-line (se tienen que ver tocables) y pierden el bg-surface.</>,
      <>NewBadge y la etiqueta promo del HeroCarousel: bg-primary/85 text-accent, sin sombra. HeroCarousel anim-bar: bg-ink. Ticker: sin bg-surface, li text-muted 500, el ✦ en text-accent.</>,
      <>Button ghost y Ver promo de PromoCard: text-ink (la costura dorada sale al pasar). Razones (portada): números en text-muted. Pasos del personalizador: el círculo border-line text-ink. Subir imagen: el ícono en ring-1 ring-accent text-accent, sin bg-accent. Técnica elegida: peer-checked:border-ink.</>,
      <>Se quedan dorados: Button whatsapp, WhatsAppFab, costuras (stitch-title, sf-costura, el hilo), etiquetas pequeñas, el pin del hero, el recuadro punteado de la vista previa, el foco y el radio elegido.</>,
    ],
  },
  {
    grupo: "5 · Fotos a sangre y tarjetas sin caja",
    items: [
      <>ProductCard y PromoCard: sin border, bg-surface, rounded-card ni hover:border-secondary; rounded-tile en el marco de la foto; el pie sin padding lateral (pt-3.5; en PromoCard horizontal, pl-10). ServiceCard: sin border, bg-surface ni p-3; la foto pasa de h-24 a aspect-[4/3] @3xl:aspect-[4/5]. PromoAfiche: sin caja, rounded-tile en la foto, el texto pt-5 (horizontal: pl-12); el bloque de botones @md:max-w-[320px] (el dorado no pasa del tamaño de su texto; en el celular sigue a lo ancho).</>,
      <>PromosPage: la primera promo sale de PromoGrid y va sola a lo ancho (-mx-4 / -mx-12, foto sin radio, min-h-[560px] en desktop); las demás siguen en PromoGrid con gap-y 56 / 72 px. Sin props nuevas: PromoGrid no cambia.</>,
      <>CategoryBanner: sin rounded-card ni border, h-[340px] @3xl:h-[520px], texto p-4 pb-7 / p-12 pb-14; en [...gallery].astro sale el px-4 pt-4 @3xl:px-12 que lo rodea.</>,
      <>PromoDetailPage: el afiche sin @4xl:px-12 @4xl:pt-6 @4xl:rounded-card @4xl:border, @4xl:min-h-[680px], texto con px-12; MasFotos sin border en las fotos y @4xl:px-12.</>,
      <>ViewerPage: columnas @3xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-16 (sale 28rem); la nota de Pedir por WhatsApp también en desktop (sale @3xl:hidden). PhotoThumbs sin borde visible.</>,
      <>MapCard, EmptyState, ErrorState, la vista previa del personalizador: border-transparent. 404 (Lo que sí está): solo las líneas de arriba y abajo. Envío del personalizador: solo border-t y sin el shadow-[0_-24px_24px…] de su contenedor fijo.</>,
    ],
  },
  {
    grupo: "6 · Portada (HomePage.tsx)",
    items: [
      <>Orden: hero a sangre (h-[640px] @4xl:h-[760px], sin px-12, borde ni radio) → BandaPersonaliza (ver propuesta/PortadaR2.tsx: etiqueta, h2 Tu idea, en tu prenda., una frase, un solo botón Diseñar mi prenda a /personaliza y la foto a sangre 440 / 640 px con el recuadro punteado) → Ticker → Qué hacemos → Disponible ahora (columnas de 240 px en el celular) → Quiénes somos con Visítanos (MapCard sin open).</>,
      <>Hero: el botón pasa de whatsapp Escríbenos por WhatsApp a secondary Ver el catálogo (un solo dorado por pantalla y WhatsApp en el flotante; la banda que sigue tiene el dorado). Fotos: las de la ronda 1 (taller y prendas, sin modelos).</>,
    ],
  },
  {
    grupo: "7 · Design system",
    items: [
      <>foundations: BoardTypography con la escala nueva, BoardColor con &quot;dónde va el dorado&quot;, BoardSpacing con el aire. Recapturar buttons, cards, labels, media, app-shell y motion (agregar las dos entradas: al cargar y al scroll).</>,
      <>usageInstructions que hoy contradicen la propuesta: ProductCard, PromoCard, ServiceCard, PromoAfiche (sin caja), CategoryNav (elegida en tinta), Eyebrow (etiqueta dorada sin píldora), Section (título 64 / 40, no 28 / 40), Ticker (cinta gris con puntada dorada), PromoBar (barra negra cálida, no dorada) y MapCard (cerrada en la portada). PromoGrid queda igual.</>,
      <>Deuda que ya existe y sigue: Diseñar mi prenda usa Button whatsapp (icon null) hacia /personaliza, y el usageInstructions de Button dice que whatsapp va siempre con whatsappUrl(). Decidir entre una variante primary o ampliar esa regla.</>,
      <>E2E: ninguno depende de bordes ni colores; revisar el de la portada por el orden nuevo y el del visor si busca el h1 por sr-only.</>,
    ],
  },
];

export function CambiosR2() {
  return (
    <TableroR2 width={1200}>
      <PageTitle
        title="Lista de cambios para el PR · ronda 2"
        description="Un solo PR del Feature Builder, después de PRI-122 (PR #36). Sin dependencias nuevas ni JavaScript en el sitio. Verificación: npm run check, npm test y los E2E de portada, catálogo, visor y promos."
      />
      <div className="flex flex-col gap-8">
        {CAMBIOS.map((g) => (
          <section key={g.grupo}>
            <h2 className="text-[17px] font-semibold">{g.grupo}</h2>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[14px] leading-relaxed marker:text-accent">
              {g.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </TableroR2>
  );
}

/** Separador de la fila de abajo. */
export function Ronda1Separador() {
  return (
    <div className="flex h-[260px] w-[3760px] flex-col justify-center gap-3 border-t-2 border-dashed border-line bg-primary px-12 font-body text-ink">
      <p className="text-[13px] font-semibold uppercase tracking-[.16em] text-muted">Hasta aquí la ronda 2</p>
      <h2 className="font-display text-[56px] font-medium leading-[1.05] tracking-[-0.02em]">Ronda 1 (descartada)</h2>
      <p className="max-w-[80ch] text-[16px] text-muted">
        Lo que viste el 27 de octubre: oro viejo, Plus Jakarta Sans y los 4 movimientos sobre la estructura de hoy. Se queda como
        base de la ronda 2; no se construye así. Los frames HTML vivos del personalizador salieron: el deploy preview del PR #36 se
        reconstruyó y ya no cargan sus estilos; las capturas de esa ronda siguen en su fila.
      </p>
    </div>
  );
}
