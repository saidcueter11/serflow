import { useEffect, useState, type ReactNode } from "react";
import { Button } from "../../../../src/components/ui/Button";
import { CategoryNav } from "../../../../src/components/ui/CategoryNav";
import { Chip } from "../../../../src/components/ui/Chip";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { Footer } from "../../../../src/components/ui/Footer";
import { Header } from "../../../../src/components/ui/Header";
import { MapCard } from "../../../../src/components/ui/MapCard";
import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { PromoCard } from "../../../../src/components/ui/PromoCard";
import { Section } from "../../../../src/components/ui/Section";
import { ServiceCard } from "../../../../src/components/ui/ServiceCard";
import { StatusPill } from "../../../../src/components/ui/StatusPill";
import { Ticker } from "../../../../src/components/ui/Ticker";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { Code, PageFrame, PageTitle, Row } from "../../design-system/Chrome";
import { CATALOG_HREF, LOGO, PRODUCTS } from "../../design-system/app-shell/portada";
import { CHIPS, FOTOS, PROMOS } from "./comun";

/* Narración del canvas: intro, los 4 movimientos en vivo, fundamentos, componentes y la lista de cambios. */

const FAMILIA = "refresh oro viejo · PRI-286 + PRI-287";

/** Todo el tablero ya va con el acabado nuevo. */
function Tablero({ width, children }: { width: number; children: ReactNode }) {
  return (
    <div className="sf-refresh">
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

export function Intro() {
  return (
    <Tablero width={1000}>
      <PageTitle
        title="Refresh oro viejo"
        description="Una sola dirección para toda la app, sacada de tus marcas en la página de referencias (23 de octubre). La estructura se queda: Heirest se parece a lo que ya tenemos. Cambia el acabado: la letra, el dorado y cómo responde todo al tocarlo."
      />
      <div className="grid grid-cols-2 gap-10 pb-10">
        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-[.14em] text-accent">Lo que cambia</h2>
          <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed marker:text-accent">
            <li>
              <b>Plus Jakarta Sans</b> en títulos y texto. Sale Space Grotesk (la de esquinas cuadradas) y la fuente del sistema.
            </li>
            <li>
              <b>Oro viejo #C9A24A</b> como único acento, con oro claro, profundo y un tinte suave. Sale el #FFD700.
            </li>
            <li>
              <b>Los 4 movimientos</b> como sistema: botón con brillo, foto que se acerca, titular que entra y enlace que se cose. Más
              un hundido corto al tocar en todo lo tocable.
            </li>
            <li>
              <b>Portada:</b> el personalizador sube justo después del hero y el mapa baja al final, plegado. Hero sin modelos.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-[.14em] text-accent">Lo que se queda</h2>
          <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed marker:text-accent">
            <li>Los negros cálidos, la tinta y el gris de hoy: con el oro viejo siguen funcionando.</li>
            <li>La estructura de cada página, los radios, la trama de tela, el hilo y la costura de los títulos.</li>
            <li>Cero JavaScript nuevo: todo es CSS. Con &quot;reducir movimiento&quot; nada se mueve y nada queda escondido.</li>
            <li>Un solo WhatsApp flotante por página; la acción principal sigue siendo dorada.</li>
            <li>
              Fuera de esta tanda (PRI-287): la 404 hereda el acabado por tokens sin cambios propios; las transiciones entre páginas y
              los estados de carga se quedan como están hoy.
            </li>
          </ul>
        </div>
      </div>
      <div className="rounded-card border border-line bg-surface p-6">
        <h2 className="text-[17px] font-semibold">Cómo leer el canvas</h2>
        <ol className="mt-3 flex list-decimal flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-muted marker:text-accent">
          <li>Arriba, de izquierda a derecha: esta intro, los 4 movimientos en vivo, fundamentos (color, letra, tiempos), componentes antes y después, y la lista de cambios para el PR.</li>
          <li>Debajo, una fila por pantalla (portada, catálogo, promos, personalizador): antes y después lado a lado, primero 390 y luego 1280.</li>
          <li>Todo lo de &quot;después&quot; son los componentes de producción de hoy con el acabado nuevo encima; nada está redibujado.</li>
          <li>Pasa el mouse por cualquier frame de después: los botones, fotos y links responden de verdad. ↻ Repetir vuelve a correr lo que pasa al cargar.</li>
        </ol>
      </div>
    </Tablero>
  );
}

export function Movimientos() {
  return (
    <Tablero width={1500}>
      <PageTitle
        title="Los 4 movimientos"
        description="Los cuatro que marcaste con Sí, aplicados a componentes reales con las mismas reglas de refresh.css que van al PR. Mismo pulso en todos: sale rápido y se posa despacio (ease-premium). En el celular no hay mouse: ahí el gesto es el toque, y las fotos ya están a todo color."
      />
      <Row
        name="1 · Botón con brillo"
        description="Sube 3 px con un halo dorado y le pasa un reflejo de luz. Al tocar se hunde (escala 0.97). Botones whatsapp y secondary."
      >
        <Gesto>
          <Button variant="whatsapp" href={WHATSAPP_URL} external>
            Escríbenos por WhatsApp
          </Button>
          <Button variant="secondary" href="#">
            Ver 78 más
          </Button>
        </Gesto>
        <Ficha
          items={[
            ["Clase", <Code key="c">sf-brillo</Code>],
            ["Tiempos", "subir 280 ms · reflejo 900 ms · hundir 120 ms"],
            ["Dónde", "Button (whatsapp y secondary), la banda del personalizador, el envío del personalizador"],
          ]}
        />
      </Row>
      <Row
        name="2 · Foto que se acerca"
        description="Con el mouse lejos la foto está un poco apagada; al pasar gana color, hace un zoom lento y el texto de la card sube 4 px. En el celular siempre está a todo color y al tocar se acerca un poco."
      >
        <Gesto>
          <div className="w-[220px]">
            <ProductCard name={PRODUCTS[2].name} meta={PRODUCTS[2].meta} href={CATALOG_HREF} image={{ src: PRODUCTS[2].src, alt: PRODUCTS[2].name }} />
          </div>
          <div className="w-[260px]">
            <ServiceCard title="Bordado" description="Hilo con relieve. El clásico de las gorras." image={{ src: FOTOS.mtq2, alt: "Bordado" }} />
          </div>
        </Gesto>
        <Ficha
          items={[
            ["Clase", <Code key="c">sf-foto</Code>],
            ["Tiempos", "zoom 1100 ms · color 600 ms · texto 600 ms"],
            ["Dónde", "ProductCard, ServiceCard, Masonry, PromoCard, PromoAfiche, la banda del personalizador. No en el hero: ya tiene su zoom lento."],
          ]}
        />
      </Row>
      <Row
        name="3 · Titular que entra"
        description="Cada línea del titular sube detrás de una máscara, 120 ms después de la anterior. En el h1 de cada página al cargar; en los títulos de sección, al entrar en pantalla."
      >
        <AlCargar>
          <h1 className="sf-lineas font-display text-[56px] font-semibold leading-[1.02] tracking-[-0.025em]">
            <span>
              <span>Bienvenido</span>
            </span>
            <span>
              <span>a Serflow</span>
            </span>
          </h1>
          <p className="sf-entra mt-6 font-display text-[32px] font-semibold tracking-[-0.022em]">Promos de hoy</p>
        </AlCargar>
        <Ficha
          items={[
            ["Clases", <><Code>sf-lineas</Code> (h1 con una línea por span) y <Code>sf-entra</Code> / <Code>sf-entra-scroll</Code> (una línea)</>],
            ["Tiempos", "900 ms por línea · escalón 120 ms"],
            ["Dónde", "Hero de la portada, Promos de hoy, nombre de la categoría en el banner, Diseña tu prenda, títulos de Section"],
          ]}
        />
      </Row>
      <Row
        name="4 · Enlace que se cose"
        description="Una costura dorada se dibuja debajo, de izquierda a derecha, al pasar, al enfocar con teclado o al tocar. En el menú, la página actual queda cosida (ya no depende solo del color)."
      >
        <Gesto toque={false}>
          <div className="w-[960px] overflow-hidden rounded-tile border border-line">
            <Header logoSrc={LOGO} current="/products" />
          </div>
          <Button variant="ghost" href={CATALOG_HREF}>
            Ver todo →
          </Button>
        </Gesto>
        <Ficha
          items={[
            ["Clase", <Code key="c">sf-costura</Code>],
            ["Tiempos", "700 ms"],
            ["Dónde", "Header (nav), Footer, Button ghost, Ver promo de PromoCard, Ver las fotos de PromoAfiche"],
          ]}
        />
      </Row>
      <Row
        name="Al tocar en el celular"
        description="Todo lo que se toca responde en 120 ms: pestañas, chips y cards se hunden un poco. Sin el resaltado gris del navegador."
      >
        <Gesto>
          <div className="w-[520px]">
            <CategoryNav categories={CHIPS.slice(0, 4)} current="/products" />
          </div>
          <div className="flex gap-2">
            <Chip label="S" name="talla-demo" />
            <Chip label="M" name="talla-demo" selected />
            <Chip label="L" name="talla-demo" />
          </div>
          <WhatsAppFab placement="inline" />
        </Gesto>
        <Ficha
          items={[
            ["Clase", <Code key="c">sf-toque</Code>],
            ["Tiempos", "120 ms, escala 0.96 a 0.98"],
            ["Reducir movimiento", "Nada se mueve, nada queda escondido: el titular aparece completo, las fotos a todo color, la costura aparece sin dibujarse."],
          ]}
        />
      </Row>
    </Tablero>
  );
}

const PALETA: { token: string; antes: string; despues: string; uso: string; contraste: string }[] = [
  { token: "accent", antes: "#FFD700", despues: "#C9A24A", uso: "Único acento: botón principal, etiquetas, números, costuras", contraste: "7.56:1 sobre el fondo · texto negro encima 7.56:1" },
  { token: "secondary (oro claro)", antes: "#D2BD3C", despues: "#E2C47E", uso: "Borde al pasar, brillo, separadores de la cinta", contraste: "10.7:1 sobre el fondo" },
  { token: "accent-deep (oro profundo)", antes: "#A8890A", despues: "#8C6D2C", uso: "Bordes y cantos. Nunca texto", contraste: "3.75:1 sobre el fondo (sirve para bordes)" },
  { token: "accent-soft (tinte)", antes: "#FFD70020", despues: "#C9A24A1F", uso: "Fondo de lo elegido y del foco suave", contraste: "oro encima 6.2:1 · tinta encima 13:1" },
];

const NEGROS = [
  ["primary", "#17160F"],
  ["surface", "#1F1D15"],
  ["surface-2", "#2A271C"],
  ["line", "#3A3627"],
  ["ink", "#F4F1E6"],
  ["muted", "#B8B6AA"],
];

const ESCALA: { nombre: string; spec: string; clase: string; texto: string }[] = [
  { nombre: "Display", spec: "44 / 72 · 600 · -2.5 %", clase: "text-[72px] font-semibold leading-[1.02] tracking-[-0.025em]", texto: "Bienvenido" },
  { nombre: "Título de página", spec: "38 / 68 · 600 · -2.5 %", clase: "text-[52px] font-semibold leading-[1.05] tracking-[-0.025em]", texto: "Promos de hoy" },
  { nombre: "Título de banda", spec: "30 / 46 · 600 · -2.2 %", clase: "text-[46px] font-semibold leading-[1.05] tracking-[-0.022em]", texto: "Tu idea, en tu prenda." },
  { nombre: "Título de sección", spec: "28 / 40 · 600 · -2.2 %", clase: "text-[40px] font-semibold leading-[1.05] tracking-[-0.022em]", texto: "Disponible ahora" },
  { nombre: "Título de card", spec: "15 a 22 · 700", clase: "text-[20px] font-bold leading-tight", texto: "Gorra Chicago" },
  { nombre: "Texto", spec: "15 / 17 · 400 · 1.6", clase: "text-[17px] leading-relaxed text-muted", texto: "Sube tu diseño, míralo sobre la camiseta o la gorra y te la hacemos aquí en el taller." },
  { nombre: "Botón", spec: "15 · 600", clase: "text-[15px] font-semibold", texto: "Diseñar mi prenda" },
  { nombre: "Etiqueta", spec: "12 / 13 · 600 · mayúsculas +14 %", clase: "text-[13px] font-semibold uppercase tracking-[.14em] text-accent", texto: "Mercado Bazurto · Cartagena" },
];

export function Fundamentos() {
  return (
    <Tablero width={1300}>
      <PageTitle
        title="Fundamentos"
        description="Color, letra y tiempos. Los negros, la tinta y el gris no cambian. Todo va en src/styles/tokens.css: el resto de la app los toma solo porque usa las clases de token."
      />
      <Row name="Dorado" description="Más viejo, más cálido y menos chillón que el #FFD700. Todos los pares pasan AA; accent pasa AAA con texto normal.">
        <div className="grid grid-cols-[180px_120px_120px_1fr] items-center gap-x-6 gap-y-4 text-[14px]">
          <span className="text-[12px] uppercase tracking-[.14em] text-muted">Token</span>
          <span className="text-[12px] uppercase tracking-[.14em] text-muted">Antes</span>
          <span className="text-[12px] uppercase tracking-[.14em] text-muted">Después</span>
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
      <Row name="Negros cálidos" description="Se quedan igual. Con el oro viejo el fondo se siente más de cuero que de noche, que es lo que buscabas.">
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
      <Row
        name="Letra"
        description={
          <>
            Plus Jakarta Sans 400 a 700 en una sola fuente variable (Google la sirve en un archivo para latin). Reemplaza a Space Grotesk
            y a la del sistema. Títulos en 600 con el espaciado un poco cerrado; botones en 600 (hoy 700).
          </>
        }
      >
        <div className="grid grid-cols-2 gap-8 border-b border-line pb-6">
          <div className="flex flex-col gap-2" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            <span className="font-body text-[12px] uppercase tracking-[.14em] text-muted">Antes · Space Grotesk 500</span>
            <span className="text-[44px] font-medium leading-[1.02] tracking-[-0.01em]">Bienvenido a Serflow</span>
            <span className="text-[15px] text-muted" style={{ fontFamily: "system-ui, sans-serif" }}>
              Camisetas y gorras con tu logo, tu equipo o tu idea.
            </span>
          </div>
          <div className="flex flex-col gap-2 font-display">
            <span className="text-[12px] uppercase tracking-[.14em] text-muted">Después · Plus Jakarta Sans 600</span>
            <span className="text-[44px] font-semibold leading-[1.02] tracking-[-0.025em]">Bienvenido a Serflow</span>
            <span className="text-[15px] text-muted">Camisetas y gorras con tu logo, tu equipo o tu idea.</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {ESCALA.map((e) => (
            <div key={e.nombre} className="grid grid-cols-[150px_200px_1fr] items-baseline gap-4">
              <span className="text-[14px] font-semibold">{e.nombre}</span>
              <span className="font-mono text-[12px] text-muted">{e.spec}</span>
              <span className={`font-display ${e.clase}`}>{e.texto}</span>
            </div>
          ))}
        </div>
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

/** Un componente de producción dos veces: tal cual y con el acabado nuevo. */
function Par({ nombre, cambio, children }: { nombre: string; cambio: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[200px_1fr_1fr] gap-6 border-t border-line py-6 first:border-t-0">
      <div className="flex flex-col gap-1.5 pt-1">
        <span className="text-[15px] font-semibold">{nombre}</span>
        <span className="text-[13px] leading-snug text-muted">{cambio}</span>
      </div>
      <form className="flex min-w-0 flex-wrap items-center gap-4 rounded-card border border-line bg-primary p-5">{children}</form>
      <form className="sf-refresh flex min-w-0 flex-wrap items-center gap-4 rounded-card border border-accent/40 bg-primary p-5">{children}</form>
    </div>
  );
}

export function Componentes() {
  return (
    <div>
      <PageFrame family={FAMILIA} width={1500}>
        <div className="sf-refresh">
          <PageTitle
            title="Componentes antes y después"
            description="Los de src/components/ui, sin redibujar. Izquierda: como están hoy. Derecha: con el acabado nuevo. Pasa el mouse por la derecha."
          />
        </div>
        <div className="grid grid-cols-[200px_1fr_1fr] gap-6 pb-2 text-[12px] uppercase tracking-[.14em] text-muted">
          <span />
          <span>Antes</span>
          <span className="text-accent">Después</span>
        </div>
        <Par nombre="Button" cambio="whatsapp sin canto 3D, con brillo; secondary con brillo tenue; ghost se cose. Letra 600.">
          <Button variant="whatsapp" href={WHATSAPP_URL} external>
            Pedir por WhatsApp
          </Button>
          <Button variant="secondary" href="#">
            Cómo llegar
          </Button>
          <Button variant="ghost" href="#">
            Ver todo →
          </Button>
        </Par>
        <Par nombre="Chip y CategoryNav" cambio="Oro viejo al elegir, borde oro claro al pasar, se hunden al tocar.">
          <Chip label="S" name="t-a" />
          <Chip label="M" name="t-a" selected />
          <div className="w-full">
            <CategoryNav categories={CHIPS.slice(0, 3)} current="/products" />
          </div>
        </Par>
        <Par nombre="Eyebrow y StatusPill" cambio="Solo color y letra.">
          <Eyebrow>Personalizador</Eyebrow>
          <StatusPill tone="accent">Hasta el 2 de nov.</StatusPill>
          <StatusPill tone="ok">Abierto ahora</StatusPill>
        </Par>
        <Par nombre="ProductCard y ServiceCard" cambio="Foto que se acerca; el texto sube. duration-500 pasa a --motion-foto.">
          <div className="w-[190px]">
            <ProductCard name={PRODUCTS[0].name} meta={PRODUCTS[0].meta} href="#" image={{ src: PRODUCTS[0].src, alt: PRODUCTS[0].name }} />
          </div>
          <div className="w-[210px]">
            <ServiceCard title="DTF" description="Colores vivos y con brillo." image={{ src: FOTOS.mtq5, alt: "DTF" }} />
          </div>
        </Par>
        <Par nombre="PromoCard" cambio="Foto que se acerca y Ver promo se cose.">
          <div className="@container w-full">
            <PromoCard promo={PROMOS[1]} headingLevel={3} />
          </div>
        </Par>
        <Par nombre="Section" cambio="Título en 600 que sube al entrar; la costura del título sigue igual, en oro viejo.">
          <div className="w-full">
            <Section title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño.">
              <span />
            </Section>
          </div>
        </Par>
        <Par nombre="Ticker" cambio="Oro viejo y letra 600. Separadores en oro claro.">
          <div className="w-full">
            <Ticker items={["Uniformes para tu equipo", "Gorras con el logo de tu negocio", "Camisetas para tu evento"]} />
          </div>
        </Par>
        <Par nombre="EmptyState" cambio="Color, letra y el botón con brillo.">
          <div className="w-full">
            <EmptyState
              title="Todavía no hay fotos de Dotación"
              description="Igual te lo hacemos por encargo. Escríbenos por el botón de WhatsApp y te mostramos trabajos parecidos."
              action={{ label: "Ver lo más nuevo", href: "/products" }}
            />
          </div>
        </Par>
        <Par nombre="MapCard cerrada" cambio="La que usa la portada nueva. Pin en oro viejo, Cómo llegar con brillo tenue.">
          <div className="w-[340px]">
            <MapCard title="Visítanos" />
          </div>
        </Par>
        <Par nombre="Footer y WhatsAppFab" cambio="Links que se cosen; el aro del flotante en oro viejo.">
          <div className="relative w-full overflow-hidden rounded-tile border border-line">
            <Footer logoSrc={LOGO} />
            <div className="absolute bottom-4 right-4">
              <WhatsAppFab placement="inline" />
            </div>
          </div>
        </Par>
      </PageFrame>
    </div>
  );
}

const CAMBIOS: { grupo: string; items: ReactNode[] }[] = [
  {
    grupo: "1 · src/styles/tokens.css (@theme)",
    items: [
      <>--color-accent #FFD700 → #C9A24A · --color-accent-soft #FFD70020 → #C9A24A1F · --color-accent-deep #a8890a → #8C6D2C · --color-secondary #D2BD3C → #E2C47E</>,
      <>--font-display y --font-body → &apos;Plus Jakarta Sans&apos;, system-ui, sans-serif (body con -apple-system, &apos;Segoe UI&apos;, Roboto de respaldo). --font-titan apunta también a Plus Jakarta Sans.</>,
      <>Nuevos: --motion-brillo 900ms, --motion-foto 1100ms, --motion-entrada 900ms, --motion-escalon 120ms, --motion-costura 700ms, --ease-premium cubic-bezier(.2,.8,.2,1), --shadow-oro (con color-mix sobre --color-accent).</>,
      <>Se quedan --motion-spin y --motion-shimmer de PRI-122 (PR #36) si ese PR entra antes.</>,
    ],
  },
  {
    grupo: "2 · src/styles/tokens.css (clases)",
    items: [
      <>Copiar tempo/designs/canvases/refresh-oro-viejo/refresh.css sin el prefijo .sf-refresh, sin lo que va después de cada comentario PUENTE dentro de los :is() y sin la sección Solo canvas: sf-brillo, sf-brillo-suave, sf-foto, sf-foto-texto, sf-lineas, sf-entra, sf-entra-scroll, sf-costura, sf-toque y los keyframes sf-subir y sf-entra.</>,
      <>sf-ring: el color del aro pasa a color-mix(in srgb, var(--color-accent) 60%, transparent). Agregar las clases nuevas a la lista de prefers-reduced-motion.</>,
      <>html: -webkit-tap-highlight-color: transparent.</>,
    ],
  },
  {
    grupo: "3 · Fuentes",
    items: [
      <>src/layouts/Layout.astro y tempo/index.html: el link de Google Fonts pasa a family=Plus+Jakarta+Sans:wght@400..700&amp;display=swap; sale Space Grotesk.</>,
      <>src/styles/global.css: .gold-gradient (#FFD700, #CCB429) no tiene usos: borrarla.</>,
    ],
  },
  {
    grupo: "4 · Componentes (clases, sin props nuevas)",
    items: [
      <>Button: whatsapp + sf-brillo, sin shadow-[0_5px_0…] ni active:translate-y-[3px], con shadow-[inset_0_1px_0_rgb(255_255_255/.28)] y font-semibold; secondary + sf-brillo sf-brillo-suave, sin active:translate-y-px y con hover:border-secondary; ghost + sf-costura sin hover:underline (el ghost no lleva sf-brillo: los dos usan ::after).</>,
      <>Header: + sf-costura en los links del nav de escritorio (el de aria-current queda cosido). El menú del celular no: sus links ocupan toda la fila para el toque. Footer (LINK): + sf-costura.</>,
      <>sf-foto (y sin group-hover:scale-105 ni duration-500 en la img): en la raíz de ProductCard, ServiceCard, PromoCard y PromoAfiche, y en el &lt;a&gt; de Tile en Masonry (no en la raíz de Masonry, que es todo el muro). ProductCard: + sf-foto-texto en el bloque de texto.</>,
      <>PromoAfiche: envolver la img en un div overflow-hidden (como PromoCard) para que el zoom no se salga, y items-center en el bloque de los dos botones para que Ver las fotos quede centrado con su costura.</>,
      <>CategoryNav (a) y Chip (span): + sf-toque y hover:border-secondary en los no elegidos. ProductCard, PromoCard y Tile: el hundido al tocar ya viene con sf-foto. WhatsAppFab: queda igual (ya tiene active:scale-95).</>,
      <>font-medium → font-semibold en todo lo font-display: Section h2, CategoryBanner (p del nombre), PromosPage h1, Ticker, los números de Razones en HomePage y, del PR #36, el h1 de PersonalizaPage, los h2 de los pasos de PersonalizaCampos y el h2 de HojaEnvio. tracking-[-0.022em] solo en los de 28 px o más (Section h2, CategoryBanner, PromosPage h1, PersonalizaPage h1). PromoAfiche h2 y PromoCard h3 se quedan en font-bold.</>,
      <>Section h2 + sf-entra-scroll. PromosPage h1, PersonalizaPage h1 y el nombre de CategoryBanner + sf-entra.</>,
      <>HeroCarousel: el degradado pasa de via-primary/55 a via-primary/85, para que la etiqueta dorada y el texto se lean sobre las fotos claras del taller (4.9:1 o más).</>,
      <>Personalizador (PR #36): fuera de esos títulos, VistaPrevia, PersonalizaCampos y HojaEnvio heredan todo por tokens; el botón de envío ya es Button.</>,
    ],
  },
  {
    grupo: "5 · Portada (src/components/home/HomePage.tsx + index.astro)",
    items: [
      <>Orden: hero → Ticker → banda del personalizador → Qué hacemos → Disponible ahora → Quiénes somos con Visítanos (MapCard cerrada, sin open) al lado. Thread se queda.</>,
      <>El hero deja de compartir fila con el mapa: ancho completo, h-[560px] / @4xl:h-[600px]. h1 con sf-lineas en dos líneas (Bienvenido / a Serflow), 44 / 72 px, 600.</>,
      <>Banda del personalizador: tal cual BandaPersonaliza de propuesta/Portada.tsx (la foto de hoy de Diseña la tuya con el recuadro punteado de la vista previa, Eyebrow Personalizador, Tu idea, en tu prenda., una frase, Button Diseñar mi prenda a /personaliza). Reemplaza el bloque Diseña la tuya.</>,
      <>Fotos del hero en index.astro: estampado-proceso (primera, horizontal, es el LCP), gorra-bordada-2, una del catálogo (DTF) y gorras-estante. Salen camisetas-estampadas y amigos-gorras (modelos). Qué hacemos: DTF con una foto del catálogo en vez de camiseta-dtf (persona).</>,
    ],
  },
  {
    grupo: "6 · Design system (canvases y assets)",
    items: [
      <>foundations: BoardColor, BoardTypography y BoardMotion con los valores nuevos; la deuda &quot;Presupuesto de fuentes&quot; y &quot;Duraciones fijas&quot; se cierran en este PR.</>,
      <>buttons, cards, labels, app-shell: recapturar; usageInstructions de ProductCard: cambiar &quot;No le agregues scale en hover&quot; por &quot;el zoom lo pone sf-foto&quot;.</>,
      <>motion: agregar los 4 movimientos (puede copiar el tablero Movimientos de este canvas).</>,
      <>MapCard: la portada ya no usa open; actualizar el usageInstructions.</>,
    ],
  },
  {
    grupo: "7 · Fuera de este PR",
    items: [
      <>404: hereda el acabado por tokens, sin cambios propios. Transiciones entre páginas y estados de carga (PRI-287): se quedan como están; van en otra tanda si las quieres con el movimiento nuevo.</>,
      <>Menú del celular: la página actual sigue marcada solo con color; si se quiere costura ahí, va en un span interno.</>,
    ],
  },
];

export function Cambios() {
  return (
    <Tablero width={1200}>
      <PageTitle
        title="Lista de cambios para el PR"
        description="Un solo PR del Feature Builder después de PRI-122 (PR #36). Nada de esto agrega dependencias ni JavaScript. Verificación: npm run check, npm test y los E2E de portada, catálogo y promos (cambia el orden de la portada y el mapa ya no carga de una)."
      />
      <div className="flex flex-col gap-8">
        {CAMBIOS.map((g) => (
          <section key={g.grupo}>
            <h2 className="text-[17px] font-semibold text-accent">{g.grupo}</h2>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[14px] leading-relaxed marker:text-accent">
              {g.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Tablero>
  );
}
