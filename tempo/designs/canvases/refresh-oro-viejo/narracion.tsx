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
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { Code, PageFrame, PageTitle, Row } from "../../design-system/Chrome";
import { CATALOG_HREF, LOGO, PRODUCTS, PROMOS_SAMPLE } from "../../design-system/app-shell/portada";
import { CHIPS, FOTOS, NUEVO } from "./comun";

/* Narración del canvas: intro, los 4 movimientos en vivo, fundamentos y la lista de cambios para el PR. */

const FAMILIA = "refresh oro viejo · PRI-286";

function Tablero({ width, nuevo = true, children }: { width: number; nuevo?: boolean; children: ReactNode }) {
  return (
    <div className={nuevo ? NUEVO : ""}>
      <PageFrame family={FAMILIA} width={width}>
        {children}
      </PageFrame>
    </div>
  );
}

function Repetir({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 rounded-full border border-line px-4 text-[13px] font-semibold text-muted hover:border-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      ↻ Repetir
    </button>
  );
}

/** Reproduce un gesto: "al pasar" (sf-demo) y luego "al tocar" (sf-demo-toque). Repetir lo vuelve a correr. */
function Gesto({ children, toque = true }: { children: ReactNode; toque?: boolean }) {
  const [vuelta, setVuelta] = useState(0);
  const [fase, setFase] = useState<"" | "sf-demo" | "sf-demo sf-demo-toque">("");
  useEffect(() => {
    setFase("");
    const t = [
      setTimeout(() => setFase("sf-demo"), 450),
      setTimeout(() => setFase(toque ? "sf-demo sf-demo-toque" : "sf-demo"), 2100),
      setTimeout(() => setFase(""), toque ? 2400 : 2600),
    ];
    return () => t.forEach(clearTimeout);
  }, [vuelta, toque]);
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className={`flex flex-wrap items-center gap-4 ${fase}`}>{children}</div>
      <div className="flex items-center gap-3 text-[13px] text-muted">
        <Repetir onClick={() => setVuelta((v) => v + 1)} />
        <span>o pasa el mouse y haz clic tú</span>
      </div>
    </div>
  );
}

/** Vuelve a montar lo que se mueve al cargar. */
function AlCargar({ children }: { children: ReactNode }) {
  const [vuelta, setVuelta] = useState(0);
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div key={vuelta} className="w-full">
        {children}
      </div>
      <Repetir onClick={() => setVuelta((v) => v + 1)} />
    </div>
  );
}

function Ficha({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-1.5 border-t border-line pt-4 text-[13px] leading-snug">
      {items.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted">{k}</dt>
          <dd className="text-ink">{v}</dd>
        </div>
      ))}
    </dl>
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

/* ---------- Intro ---------- */

export function Intro() {
  return (
    <Tablero width={1000}>
      <PageTitle
        title="Refresh oro viejo · ronda 4"
        description={
          <>
            Tus 8 comentarios del 1 de noviembre sobre la ronda 3: textos flotando a la derecha de los títulos, espacios mal usados en
            Quiénes somos, el visor y el personalizador, el cierre del muro y el dorado que se había ido de los botones. Esta ronda los
            resuelve con tres reglas que valen para toda la app.
          </>
        }
      />
      <div className="grid grid-cols-2 gap-10 pb-10">
        <Lista
          titulo="Las reglas de esta ronda"
          items={[
            <><b>La bajada va anclada:</b> debajo de su título, alineada a la izquierda y al ancho de su columna. Nunca suelta a la derecha.</>,
            <><b>Acción principal en dorado:</b> relleno oro viejo; las secundarias con borde. Botones de 48 px en el celular y 52 en desktop, texto 16.</>,
            <><b>Cero huecos:</b> columnas que empiezan y terminan en el mismo borde. Solo quedan los márgenes laterales.</>,
          ]}
        />
        <Lista
          titulo="Lo que se queda"
          items={[
            "Plus Jakarta Sans, el oro viejo #C9A24A y los negros cálidos.",
            "Los 4 movimientos: botón con brillo, foto que se acerca, titular que entra y enlace que se cose.",
            "Titulares grandes y livianos. Sin modelos ni mascota.",
            "Cero JavaScript nuevo en el sitio.",
          ]}
        />
      </div>
      <div className="rounded-card border border-line bg-surface p-6">
        <h2 className="text-[17px] font-semibold">Cómo leer el canvas</h2>
        <ol className="mt-3 flex list-decimal flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-muted marker:text-accent">
          <li>Arriba: esta intro, los 4 movimientos en vivo, los fundamentos y la lista de cambios para el PR (con cada comentario tuyo).</li>
          <li>Debajo, una fila por pantalla: antes = producción hoy, después = el refresh. 390 a la izquierda y 1280 a la derecha.</li>
          <li>El después son los componentes de producción con refresh.css + refresh-r2.css + refresh-r3.css encima; nada redibujado.</li>
        </ol>
      </div>
    </Tablero>
  );
}

/* ---------- Los 4 movimientos ---------- */

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

export function Movimientos() {
  return (
    <Tablero width={1500}>
      <PageTitle
        title="Los 4 movimientos (en vivo)"
        description="Botón con brillo, foto que se acerca, titular que entra y enlace que se cose, más el bloque que sube al llegar a la vista. Con reducir movimiento, todo quieto y visible. ↻ Repetir vuelve a correr cada uno."
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
              <Button variant="whatsapp" href={CATALOG_HREF} icon={null}>
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
      <Row name="Botón con brillo" description="Sube, cruza un reflejo y suelta un halo dorado; al tocar se hunde. El principal va en oro viejo y el secundario con borde.">
        <Gesto>
          <Button variant="whatsapp" href={WHATSAPP_URL} external>
            Pedir por WhatsApp
          </Button>
          <Button variant="secondary" href="#">
            Ver 12 más
          </Button>
        </Gesto>
      </Row>
      <Row name="Foto que se acerca" description="Sobre la tarjeta sin caja: la foto gana color y se acerca, el pie sube 4 px.">
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
        </Gesto>
      </Row>
    </Tablero>
  );
}

/* ---------- Fundamentos ---------- */

const PALETA: { token: string; antes: string; despues: string; uso: string; contraste: string }[] = [
  { token: "accent", antes: "#FFD700", despues: "#C9A24A", uso: "Único acento: relleno de la acción principal, chip elegido, etiquetas, costuras y foco", contraste: "7.56:1 sobre el fondo · texto negro encima 7.56:1" },
  { token: "secondary (oro claro)", antes: "#D2BD3C", despues: "#E2C47E", uso: "Borde al pasar, brillo", contraste: "10.7:1 sobre el fondo" },
  { token: "accent-deep (oro profundo)", antes: "#A8890A", despues: "#8C6D2C", uso: "Bordes y cantos. Nunca texto", contraste: "3.75:1 sobre el fondo (sirve para bordes)" },
  { token: "accent-soft (tinte)", antes: "#FFD70020", despues: "#C9A24A1F", uso: "Fondo del foco suave", contraste: "oro encima 6.2:1 · tinta encima 13:1" },
];

const NEGROS = [
  ["primary", "#17160F"],
  ["surface", "#1F1D15"],
  ["surface-2", "#2A271C"],
  ["line", "#3A3627"],
  ["ink", "#F4F1E6"],
  ["muted", "#B8B6AA"],
];

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
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="sf-etiqueta">Plus Jakarta Sans 500 · 80 px</p>
          <p className="mt-2 font-display text-[80px] font-medium leading-[1.05] tracking-[-0.02em]">Serflow taller</p>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[.16em] text-muted">Space Grotesk 500 · 80 px (producción hoy)</p>
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

/** Lo mismo en producción y con el refresh: dónde queda el dorado y qué pesa cada botón. */
function DondeVaElDorado({ nuevo }: { nuevo?: boolean }) {
  return (
    <div className={`flex flex-col gap-4 ${nuevo ? `${NUEVO} border-t border-line pt-6` : ""}`}>
      <span className={nuevo ? "sf-etiqueta" : "text-[12px] font-semibold uppercase tracking-[.16em] text-muted"}>{nuevo ? "Refresh" : "Producción hoy"}</span>
      <div className="overflow-hidden rounded-tile ring-1 ring-line">
        <PromoBar promos={PROMOS_SAMPLE.slice(0, 1)} />
      </div>
      <div className="@container w-[760px]">
        <CategoryNav categories={CHIPS.slice(0, 4)} current="/products/mi-tierra-querida" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="whatsapp" href={WHATSAPP_URL} external>
          Pedir por WhatsApp
        </Button>
        <Button variant="secondary" href="#">
          Ver las 3 fotos
        </Button>
        <Eyebrow>3 promos activas</Eyebrow>
        <NewBadge />
        <StatusPill tone="accent">Hasta el domingo</StatusPill>
      </div>
    </div>
  );
}

export function Fundamentos() {
  return (
    <Tablero width={1500} nuevo={false}>
      <PageTitle
        title="Fundamentos"
        description="Color, letra, botones, aire y tiempos. Todo va en src/styles/tokens.css: el resto de la app lo toma solo porque usa las clases de token. Los tamaños de título usan cqi (el ancho del contenedor): el mismo valor da 88 px a 1280 y 48 px a 390."
      />
      <Row name="Dorado" description="Más viejo, más cálido y menos chillón que el #FFD700. Todos los pares pasan AA; accent pasa AAA con texto normal.">
        <div className="grid grid-cols-[180px_120px_120px_1fr] items-center gap-x-6 gap-y-4 text-[14px]">
          <span className="text-[12px] uppercase tracking-[.14em] text-muted">Token</span>
          <span className="text-[12px] uppercase tracking-[.14em] text-muted">Hoy</span>
          <span className="text-[12px] uppercase tracking-[.14em] text-muted">Refresh</span>
          <span className="text-[12px] uppercase tracking-[.14em] text-muted">Uso y contraste</span>
          {PALETA.map((p) => (
            <div key={p.token} className="contents">
              <Code>{p.token}</Code>
              <div className="flex flex-col gap-1">
                <span className="h-12 rounded-tile border border-line" style={{ background: p.antes }} />
                <span className="font-mono text-[12px] text-muted">{p.antes}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="h-12 rounded-tile border border-line" style={{ background: p.despues }} />
                <span className="font-mono text-[12px] text-muted">{p.despues}</span>
              </div>
              <div>
                <div>{p.uso}</div>
                <div className="text-[13px] text-muted">{p.contraste}</div>
              </div>
            </div>
          ))}
        </div>
      </Row>
      <Row name="Negros cálidos" description="Se quedan igual. Con el oro viejo el fondo se siente más de cuero que de noche.">
        <div className="flex gap-3">
          {NEGROS.map(([n, hex]) => (
            <div key={n} className="flex w-[120px] flex-col gap-1">
              <span className="h-14 rounded-tile border border-line" style={{ background: hex }} />
              <Code>{n}</Code>
              <span className="font-mono text-[12px] text-muted">{hex}</span>
            </div>
          ))}
        </div>
      </Row>
      <Row name="La fuente carga" description="Plus Jakarta Sans 400-700 desde Google Fonts (un woff2). Reemplaza a Space Grotesk y a la del sistema.">
        <div className={NUEVO}>
          <PruebaFuente />
        </div>
      </Row>
      <Row name="Escala tipográfica" description="Cada paso es ~1.25 del siguiente y los títulos van en 500, no en negrita. La bajada va debajo de su título, alineada a la izquierda y a su mismo ancho.">
        <div className={`${NUEVO} @container flex flex-col gap-6`} style={{ width: 1080 }}>
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
      <Row name="Dónde va el dorado" description="Relleno oro viejo solo en la acción principal de cada bloque y en el chip elegido; las secundarias con borde. Etiquetas, costuras y foco en oro; la barra de promos pasa a negro cálido.">
        <div className="flex flex-col gap-6">
          <DondeVaElDorado />
          <DondeVaElDorado nuevo />
        </div>
      </Row>
      <Row name="Aire" description="Cada sección pone la mitad arriba y la mitad abajo.">
        <Ficha
          items={[
            ["Entre secciones", "64 → 72 px en el celular · 112 → 128 px en desktop"],
            ["Título → contenido", "20-24 → 28 px; título → bajada 8 → 16 px"],
            ["Cabecera de página", "pt 28 / 48, pb 32 / 48"],
            ["Tarjetas", "gap 12-20 → 16-32 px; foto → pie 12 → 16 px"],
          ]}
        />
      </Row>
      <Row name="Tiempos" description="Los tres de hoy se quedan para color y foco. Entran cinco para los movimientos y una curva.">
        <div className="grid grid-cols-[220px_110px_1fr] gap-x-6 gap-y-2.5 text-[14px]">
          {[
            ["--motion-fast / med / slow", "120 / 200 / 280 ms", "Igual que hoy: color, bordes, subir del botón, toque"],
            ["--motion-brillo", "900 ms", "El reflejo que cruza el botón"],
            ["--motion-foto", "1100 ms", "Zoom lento de la foto (el color tarda la mitad)"],
            ["--motion-entrada", "900 ms", "Cada línea del titular"],
            ["--motion-escalon", "120 ms", "Espera entre líneas"],
            ["--motion-costura", "700 ms", "La costura del enlace"],
            ["--ease-premium", "cubic-bezier(.2, .8, .2, 1)", "Sale rápido y se posa despacio: todo lo nuevo"],
            ["--shadow-oro", "0 14px 30px -12px oro 70 %", "Halo del botón al subir"],
          ].map(([t, v, u]) => (
            <div key={t} className="contents">
              <Code>{t}</Code>
              <span className="font-mono text-[12px] text-muted">{v}</span>
              <span>{u}</span>
            </div>
          ))}
        </div>
      </Row>
    </Tablero>
  );
}

/* ---------- Lista de cambios para el PR ---------- */

const CAMBIOS: { grupo: string; items: ReactNode[] }[] = [
  {
    grupo: "0 · Cómo pasar el canvas a producción",
    items: [
      <>Copiar refresh.css, refresh-r2.css y refresh-r3.css (en ese orden) a src/styles/tokens.css: variables de .sf-refresh / .sf-r2 / .sf-r3 a @theme, sin esos prefijos, sin lo que va después de cada comentario PUENTE y sin la sección Solo canvas. Lo que va después de un PUENTE se vuelve clases en el componente que nombra.</>,
      <>Un solo PR del Feature Builder, después de PRI-122 (PR #36). Sin dependencias nuevas ni JavaScript en el sitio. Verificación: npm run check, npm test y los E2E de portada, catálogo, visor y promos.</>,
    ],
  },
  {
    grupo: "1 · Tokens (@theme)",
    items: [
      <>--color-accent #FFD700 → #C9A24A · --color-accent-soft #FFD70020 → #C9A24A1F · --color-accent-deep #a8890a → #8C6D2C · --color-secondary #D2BD3C → #E2C47E.</>,
      <>--font-display y --font-body → &apos;Plus Jakarta Sans&apos;, system-ui, sans-serif (body con -apple-system, &apos;Segoe UI&apos;, Roboto de respaldo). --font-titan apunta también a Plus Jakarta Sans.</>,
      <>Movimiento: --motion-brillo 900ms, --motion-foto 1100ms, --motion-entrada 900ms, --motion-escalon 120ms, --motion-costura 700ms, --ease-premium cubic-bezier(.2,.8,.2,1), --shadow-oro (color-mix sobre --color-accent). Se quedan --motion-spin y --motion-shimmer del PR #36.</>,
      <>Escala: --sf-display clamp(48px, 6.9cqi, 88px) · --sf-h1 clamp(44px, 6.25cqi, 80px) · --sf-h2 clamp(40px, 5cqi, 64px) · --sf-h3 clamp(19px, 1.75cqi, 24px) · --sf-lead clamp(17px, 1.6cqi, 21px). Títulos 500, -0.02em, 1.05, text-wrap: balance.</>,
      <>Aire: --sf-aire 36px y --sf-aire-desktop 64px (padding-block de Section; 72 / 128 entre secciones).</>,
    ],
  },
  {
    grupo: "2 · Clases y fuentes (tokens.css, Layout.astro)",
    items: [
      <>sf-brillo, sf-brillo-suave, sf-foto, sf-foto-texto, sf-lineas, sf-entra, sf-entra-scroll, sf-costura, sf-toque, sf-t-display, sf-t-h1, sf-t-h2, sf-t-h3, sf-t-lead, sf-etiqueta, sf-bloque (entra con view()), sf-entra-despues y los keyframes sf-subir, sf-entra y sf-sube. Todas en la lista de prefers-reduced-motion: sin animación, opacity 1, transform none.</>,
      <>sf-ring: el aro pasa a color-mix(in srgb, var(--color-accent) 60%, transparent). Stitch-title: costura de 56 × 2 px, puntada 6/4 px, 20 px debajo del título. html: -webkit-tap-highlight-color: transparent.</>,
      <>src/layouts/Layout.astro y tempo/index.html: Google Fonts pasa a family=Plus+Jakarta+Sans:wght@400..700&amp;display=swap; sale Space Grotesk. src/styles/global.css: borrar .gold-gradient (sin usos).</>,
    ],
  },
  {
    grupo: "3 · Títulos y bajadas",
    items: [
      <>HomePage h1: sf-lineas sf-t-display en dos líneas. Section h2: sf-t-h2. PromosPage H1, NotFoundPage h1, PersonalizaPage h1 y el nombre de CategoryBanner: sf-t-h1. PromoDetailPage h1: sf-t-h2. ViewerPage: el h1 deja de ser sr-only.</>,
      <>Títulos de tarjeta (ProductCard, PromoCard, ServiceCard, pasos de PersonalizaCampos y HojaEnvio): sf-t-h3, 500. PromoAfiche h2: clamp(26px, 3.4cqi, 48px).</>,
      <>Bajadas: sf-t-lead en Section (description), CatalogPage (intro), PromosPage, NotFoundPage, PersonalizaPage y el hero; mt-4.</>,
      <>Regla de cabecera: la bajada va siempre debajo del título y su costura, alineada a la izquierda, max-w 46ch (el ancho de la columna del título). Ninguna cabecera la pone a la derecha del título.</>,
      <>Section h2 + sf-entra-scroll. PromosPage h1, PersonalizaPage h1 y el nombre de CategoryBanner + sf-entra.</>,
    ],
  },
  {
    grupo: "4 · Dorado y botones",
    items: [
      <>Eyebrow: sin borde, fondo ni punto; texto 12 px 600 mayúsculas tracking .16em en text-accent (sf-etiqueta). StatusPill accent: sin bg-accent/12 ni px. ContactList y QuickFacts: el círculo pasa de bg-accent/12 a ring-1 ring-line.</>,
      <>PromoBar: bg-accent text-primary → bg-primary-light text-ink border-b border-line; la etiqueta, texto dorado sin fondo; el subrayado de Ver promo en decoration-accent.</>,
      <>NewBadge y la etiqueta promo del HeroCarousel: bg-primary/85 text-accent, sin sombra. HeroCarousel anim-bar: bg-ink; degradado via-primary/85 via-65%.</>,
      <>Button: whatsapp + sf-brillo, sin shadow-[0_5px_0…] ni active:translate-y-[3px], con shadow-[inset_0_1px_0_rgb(255_255_255/.28)] y font-semibold; secondary + sf-brillo sf-brillo-suave y hover:border-secondary; ghost + sf-costura sin hover:underline. Header y Footer: + sf-costura en los links.</>,
      <>Regla de botones: la acción principal de cada bloque lleva relleno oro viejo; las secundarias, borde line y texto en tinta. Alto mínimo 48 px en el celular y 52 en desktop (min-h-12 @3xl:min-h-[52px]), texto 16 px, padding 24 / 28. Principales: Pedir por WhatsApp (visor, promos, detalle), Diseñar mi prenda, Ver el catálogo del hero, Escríbenos (tarjeta de cierre), Escríbenos por WhatsApp (404) y Enviar del personalizador. Secundarias: Ver todo el catálogo, Ver las N fotos, Ver 80 más, Ver las 24 de Beisbol, Ir al inicio, Cómo llegar, la categoría del visor.</>,
      <>Button: nueva variante primary (relleno oro, sin ícono de WhatsApp) para Ver el catálogo y Diseñar mi prenda, que hoy usan whatsapp con icon null. El ghost sale de los botones de acción: sus usos pasan a secondary.</>,
      <>CategoryNav y Chip: el elegido vuelve al relleno oro (border-accent bg-accent text-primary); los demás con borde line y texto en tinta; min-h 48 / 52, texto 16, el número 13.</>,
      <>Se quedan dorados: los botones principales, el chip elegido, WhatsAppFab, costuras, etiquetas pequeñas, el pin del hero, el recuadro punteado de la vista previa, el foco y el radio elegido.</>,
    ],
  },
  {
    grupo: "5 · Fotos a sangre y tarjetas sin caja",
    items: [
      <>sf-foto (sin group-hover:scale-105 ni duration-500 en la img) en la raíz de ProductCard, ServiceCard, PromoCard, PromoAfiche y en el &lt;a&gt; de cada foto del muro. ProductCard: + sf-foto-texto. PromoAfiche: la img dentro de un div overflow-hidden.</>,
      <>ProductCard y PromoCard: sin border, bg-surface, rounded-card ni hover:border-secondary; rounded-tile en la foto; el pie sin padding lateral. ServiceCard: sin border, bg-surface ni p-3; foto aspect-[4/3] @3xl:aspect-[4/5]. PromoAfiche: sin caja, rounded-tile en la foto.</>,
      <>PromosPage: la primera promo va sola a lo ancho (-mx-4 / -mx-12, foto sin radio, min-h-[560px] en desktop); las demás en PromoGrid con gap-y 40 / 56 px.</>,
      <>CategoryBanner: sin rounded-card ni border, h-[340px] @3xl:h-[520px]; en [...gallery].astro sale el px-4 pt-4 @3xl:px-12 que lo rodea. PromoDetailPage: el afiche sin caja, @4xl:min-h-[680px]; afiche → Más fotos 40 px.</>,
      <>MapCard, EmptyState, ErrorState y la vista previa del personalizador: border-transparent. Envío del personalizador: solo border-t, sin el shadow de su contenedor fijo.</>,
    ],
  },
  {
    grupo: "6 · Portada (HomePage.tsx, ver propuesta/Portada.tsx)",
    items: [
      <>Orden: hero a sangre (h-[640px] @4xl:h-[760px]) → banda del personalizador → Qué hacemos → Disponible ahora → Quiénes somos con Visítanos. Sin Ticker (el componente se queda en el design system).</>,
      <>Fotos del hero en index.astro: estampado-proceso (primera, es el LCP), gorra-bordada-2, una del catálogo (DTF) y gorras-estante; salen las de modelos. Qué hacemos: DTF con una foto del catálogo.</>,
      <>Banda del personalizador: grid de 12 columnas, texto col 1-5 (eyebrow, h2, frase arriba; lista de 3 pasos con filetes y Diseñar mi prenda abajo) y foto col 6-12, 480 px, rounded-tile. En el celular la foto va entre el titular y los pasos, 300 px.</>,
      <>ServiceCard: h3 --sf-h3 con mt 20; descripción 16 / 1.5 a 34ch. ProductCard: foto 4:5, nombre 18 / 1.25, detalle 14, pie pt 16.</>,
      <>Quiénes somos: grid de 12 columnas, items-stretch. Texto (QuienesCopy en sf-t-lead) y Razones en 7 columnas; Visítanos en 5. Razones: lista con filete arriba y entre filas, cada fila flex-1 (reparte el alto), número 22 px en 32 px de ancho, título 17 / 600, detalle 15. MapCard: h-full y el mapa flex-1 (min 160 px), así termina en el mismo borde que la última razón.</>,
    ],
  },
  {
    grupo: "7 · Catálogo, visor, promos y personalizador",
    items: [
      <>Masonry → rejilla: grid-cols-2 @[40rem]:grid-cols-3 @[64rem]:grid-cols-4 (medido sobre el ancho del muro: 3 columnas ya en un iPad vertical), gap 8 / 12, todas las fotos 4:5 (se va el RITMO de alturas). Páginas de 60 (PAGE_SIZE ya es 60, cierra fila con 2, 3 y 4).</>,
      <>Tarjeta de cierre (propuesta/CierreMuro.tsx): último &lt;li&gt; de CatalogPage con subgrid. Una celda de texto 4:5 (surface, borde line, ¿No ves la que buscas?, Te la hacemos con tu logo o tu diseño., Button principal Escríbenos con whatsappUrl) y, si faltan 2 o 3 celdas, la foto estampado-proceso con la etiqueta En el taller en las demás. Posición → celdas: 2 col: 2n → 1. 3 col: 3n+2 → 2, 3n → 1. 4 col: 4n+2 → 3, 4n+3 → 2, 4n → 1. Fila completa: oculta.</>,
      <>Visor desktop: grid de 5 columnas con calle de 24 px. Foto 4:5 en 2 columnas; panel en 3, grid de 3 columnas con align-content: space-between: categoría + Nuevo, h1 (sf-t-h2), Pedir por WhatsApp (2 columnas) con su nota de 14 px, y PhotoThumbs en 3 columnas 4:5 (gap 24, la elegida con anillo de 2 px en tinta). Más de: 5 columnas con calle de 24 y 10 fotos (masDe recorta a múltiplo de 5 en desktop; 6 en el celular). Con 1 sola foto, la fila de miniaturas la ocupan las 3 primeras de Más de con su rótulo.</>,
      <>404 desktop: el bloque de arriba pasa de centrado (max-w 600) a grid de 12: etiqueta, h1, texto y los dos botones alineados a la izquierda en 7 columnas; una foto del taller (gorras-estante, alt vacío, rounded-tile, object-cover) en las otras 5, del borde de arriba al de abajo de los botones. El celular no cambia.</>,
      <>PersonalizaPage desde @4xl: dos columnas que se estiran a la misma fila (items-stretch). Izquierda = prenda, vista previa 4:5, paso 3 y Enviar, con justify-between (reparte lo que falta en sus separaciones); derecha = pasos 1 y 2 sin padding arriba, con gap 48 y el último paso flex-1. Empiezan y terminan en el mismo borde. El orden del DOM no cambia (grid-template-areas).</>,
      <>Cabecera de CatalogPage, PromosPage y el personalizador: pt 28 / 48, pb 32 / 48.</>,
      <>PromoGrid: items-start. PromoAfiche: el bloque de botones sin mt-auto (mt 4) y desde @md en fila. PromoAfiche y PromoCard sin fecha: la línea de la vigencia se reserva (min-height de una StatusPill) cuando van en fila. PromoCard en la 404: sin mt-auto en Ver promo.</>,
    ],
  },
  {
    grupo: "8 · Design system",
    items: [
      <>foundations: BoardColor, BoardTypography, BoardSpacing y BoardMotion con los valores de este tablero; la deuda &quot;Presupuesto de fuentes&quot; y &quot;Duraciones fijas&quot; se cierra. motion: agregar los 4 movimientos y las dos entradas.</>,
      <>Recapturar buttons, cards, labels, media y app-shell. usageInstructions a corregir: ProductCard, PromoCard, ServiceCard, PromoAfiche (sin caja), Eyebrow (etiqueta dorada sin píldora), Section (título 64 / 40), Ticker (fuera de la portada), PromoBar (barra negra cálida) y MapCard (cerrada en la portada).</>,
      <>Deuda que sigue: Diseñar mi prenda usa Button whatsapp (icon null) hacia /personaliza, y el usageInstructions de Button dice que whatsapp va siempre con whatsappUrl(). Decidir entre una variante primary o ampliar esa regla.</>,
    ],
  },
  {
    grupo: "9 · Fuera de este PR",
    items: [
      <>Transiciones entre páginas y estados de carga (PRI-287) se quedan como están. Menú del celular: la página actual sigue marcada solo con color.</>,
    ],
  },
];

/** Los comentarios de Said del 2026-11-01 sobre la ronda 3 y qué se hizo; cada punto se completa al resolver su hilo. */
export const RESUELTOS: { donde: string; dijo: string; hecho: ReactNode }[] = [
  { donde: "Portada · 1280 · Qué hacemos", dijo: "Estas letras flotando aquí no me gustan", hecho: <>La bajada va debajo del título y su costura, a la izquierda y al ancho de su columna. Misma regla en todas las cabeceras de la app.</> },
  { donde: "Portada · 1280 · Disponible ahora", dijo: "aquí también están flotando", hecho: <>Igual: bajada anclada bajo el título.</> },
  { donde: "Promos · 1280 · cabecera", dijo: "Este texto flotando aquí no me gusta", hecho: <>Igual: la bajada bajo Promos de hoy, alineada a la izquierda.</> },
  { donde: "Portada · 1280 · Quiénes somos", dijo: "Mejor uso de los espacios aquí", hecho: <>12 columnas: texto y razones en 7, Visítanos en 5, mismo borde arriba y abajo. Razones en lista con filetes que reparte el alto; el mapa crece hasta el borde.</> },
  { donde: "Catálogo · tarjeta de cierre", dijo: "Me gusta tu idea pero asegurémonos de que sea responsiva y se adapte bien", hecho: <>Siempre una celda de texto del tamaño de una foto y, si faltan 2 o 3, una foto del taller en las demás. Frame nuevo con 390 (1 celda), 768 (1 y 2) y 1280 (1, 2 y 3). El muro pasa a 3 columnas desde 40rem.</> },
  { donde: "Catálogo · chips", dijo: "¿por qué ya no estamos usando el accent color aquí? además estos botones podrían ser más grandes", hecho: <>Chip elegido y toda acción principal en oro viejo; secundarias con borde. Botones y chips de 48 / 52 px con texto 16, en todas las pantallas.</> },
  { donde: "Visor · 1280", dijo: "mejoró pero aún veo un muy mal manejo de los espacios", hecho: <>Rejilla de 5 columnas compartida con Más de: foto 4:5 en 2, panel en 3 con las miniaturas de una columna cada una. Mismo borde arriba y abajo, aire uniforme de ~30 px. Huecos internos: 0.</> },
  { donde: "Personalizador · 1280", dijo: "Este espacio no me gusta, tiene que estar mejor alineado", hecho: <>Las dos columnas empiezan y terminan en el mismo borde (antes ~120 px de escalón abajo y 48 arriba). La izquierda reparte lo que falta en sus separaciones; la vista previa sigue 4:5.</> },
];

/** Zonas vacías revisadas con la regla de la ronda 4 (cero huecos salvo márgenes laterales). */
export const ZONAS: { frame: string; donde: string; antes: string; despues: string }[] = [];

export function Cambios() {
  return (
    <Tablero width={1200}>
      <PageTitle
        title="Lista de cambios para el PR"
        description="Todo lo que el Feature Builder tiene que pasar a producción, en un solo lugar (rondas 1 a 4 juntas). Cada punto nombra el componente; el detalle exacto está en los CSS del canvas."
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
        {RESUELTOS.length > 0 && (
          <section>
            <h2 className="text-[17px] font-semibold">Tus comentarios de la ronda 3</h2>
            <table className="mt-3 w-full text-left text-[14px] leading-relaxed">
              <thead className="text-muted">
                <tr>
                  <th className="py-2 pr-4 font-semibold">Dónde</th>
                  <th className="py-2 pr-4 font-semibold">Dijiste</th>
                  <th className="py-2 font-semibold">Qué cambió</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {RESUELTOS.map((r, i) => (
                  <tr key={i} className="align-top">
                    <td className="py-2 pr-4">{r.donde}</td>
                    <td className="py-2 pr-4 text-muted">&quot;{r.dijo}&quot;</td>
                    <td className="py-2">{r.hecho}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {ZONAS.length > 0 && (
          <section>
            <h2 className="text-[17px] font-semibold">Zonas vacías revisadas (cero huecos)</h2>
            <table className="mt-3 w-full text-left text-[14px] leading-relaxed">
              <thead className="text-muted">
                <tr>
                  <th className="py-2 pr-4 font-semibold">Frame</th>
                  <th className="py-2 pr-4 font-semibold">Dónde</th>
                  <th className="py-2 pr-4 font-semibold">Ronda 3</th>
                  <th className="py-2 font-semibold">Ronda 4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ZONAS.map((z, i) => (
                  <tr key={i} className="align-top">
                    <td className="py-2 pr-4">{z.frame}</td>
                    <td className="py-2 pr-4">{z.donde}</td>
                    <td className="py-2 pr-4 text-muted">{z.antes}</td>
                    <td className="py-2">{z.despues}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </Tablero>
  );
}
