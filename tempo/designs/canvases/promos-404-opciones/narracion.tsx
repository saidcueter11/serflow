import type { ReactNode } from "react";
import { PromoBar } from "../../../../src/components/ui/PromoBar";
import { PROMO_EQUIPOS, PROMO_GORRAS, PROMO_NINOS, PROMOS_1, PROMOS_3, withPhotoCount } from "./data";
import { PromoBarPropuesta, PromoCard, PromoGallery } from "./propuestas";
import { barLinks } from "./pantallas";

/* ---------------- Narración (no es producto) ---------------- */

function Card({ width, children, tone = "plain" }: { width: number; children: ReactNode; tone?: "plain" | "rec" }) {
  return (
    <div
      className={`flex flex-col gap-5 rounded-card border bg-surface p-8 font-body text-ink antialiased ${tone === "rec" ? "border-accent/70" : "border-line"}`}
      style={{ width }}
    >
      {children}
    </div>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return <div className="text-[12px] uppercase tracking-[.14em] text-accent">{children}</div>;
}

function Title({ children }: { children: ReactNode }) {
  return <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-tight">{children}</h1>;
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[13px] font-semibold uppercase tracking-[.08em] text-muted">{label}</div>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-relaxed marker:text-accent">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-accent/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[.1em] text-accent">{children}</span>;
}

function Nota({ opcion, nombre, lee, resuelve, sacrifica, whatsapp, nuevo, rec = false }: {
  opcion: string;
  nombre: string;
  lee: string;
  resuelve: string[];
  sacrifica: string[];
  whatsapp: string;
  nuevo: string;
  rec?: boolean;
}) {
  return (
    <Card width={400} tone={rec ? "rec" : "plain"}>
      <div className="flex items-center gap-2">
        <Kicker>{opcion}</Kicker>
        {rec && <Tag>Recomendada</Tag>}
      </div>
      <Title>{nombre}</Title>
      <Block label="Lo que se lee en 1 segundo">{lee}</Block>
      <Block label="Qué resuelve">
        <Bullets items={resuelve} />
      </Block>
      <Block label="Qué sacrifica">
        <Bullets items={sacrifica} />
      </Block>
      <Block label="WhatsApp">{whatsapp}</Block>
      <Block label="Nuevo en el design system">{nuevo}</Block>
    </Card>
  );
}

export function Intro() {
  return (
    <Card width={620}>
      <Kicker>PRI-131 · Promos y 404 · opciones</Kicker>
      <Title>Promos de verdad (varias, con vigencia) y una 404 que no deja a nadie botado</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        Después del SQL de PRI-131 una promo trae descripción, fecha de fin (ends_at) y orden (sort_order), y puede haber
        varias activas. Este canvas propone las cuatro piezas que eso toca, con 2 o 3 opciones por página.
      </p>
      <Bullets
        items={[
          <><strong>Barra de promos</strong> (portada): con varias, toda la barra lleva a /promos.</>,
          <><strong>/promos</strong> (nueva): lista de promos vigentes, con su estado vacío.</>,
          <><strong>/promos/[slug]</strong>: título, descripción, "Válida hasta", fotos sin huecos y WhatsApp con la promo en el mensaje.</>,
          <><strong>404</strong>: titular, Eyebrow y Button (WhatsApp e "Ir al inicio"), con el espacio de la mascota reservado.</>,
        ]}
      />
      <Block label="Cómo leer el canvas">
        De arriba abajo sigue el camino del cliente: 1 barra, 2 lista, 3 detalle, 4 404. En cada bloque, una fila por opción:
        nota (qué resuelve y qué sacrifica), mobile 390 y desktop 1280; a la derecha de la recomendada, sus estados (1 promo,
        ninguna, 1, 2, 3 y 5 fotos, promo sin fecha y sin otras promos, 404 con promos). Señal lenta y promo sin descripción
        están en el tablero de componentes. Lo marcado <Tag>Propuesta</Tag> es UI nueva que no existe en src/components/ui todavía.
      </Block>
      <Block label="Datos y fotos">
        Promos de ejemplo (2x1 en gorras, 10% en camisetas para equipos, gorras para niños): no existen en la base. Fotos de
        src/assets/images y src/assets/images/stock. "Hoy" en el canvas es el lunes 5 de octubre de 2026.
      </Block>
    </Card>
  );
}

function Paso({ titulo, detalle, tono = "plain" }: { titulo: string; detalle: string; tono?: "plain" | "gold" | "muted" }) {
  const t = { plain: "border-line bg-surface", gold: "border-accent/70 bg-surface", muted: "border-dashed border-line bg-primary" }[tono];
  return (
    <div className={`flex w-[190px] shrink-0 flex-col gap-1.5 rounded-tile border p-4 ${t}`}>
      <div className="font-display text-[16px] font-bold leading-snug">{titulo}</div>
      <div className="text-[13px] leading-snug text-muted">{detalle}</div>
    </div>
  );
}

function Flecha({ label }: { label?: string }) {
  return (
    <div className="flex w-[70px] shrink-0 flex-col items-center gap-1 text-accent">
      {label && <span className="text-center text-[11px] leading-tight text-muted">{label}</span>}
      <span className="text-[22px] leading-none">→</span>
    </div>
  );
}

export function Flujo() {
  return (
    <Card width={1180}>
      <Kicker>El camino del cliente</Kicker>
      <div className="flex items-center">
        <Paso titulo="Portada" detalle="Barra dorada arriba de todo, solo si hay promos vigentes." />
        <Flecha label="2 o más" />
        <Paso titulo="/promos" detalle="Todas las vigentes, en el orden del admin (sort_order)." tono="gold" />
        <Flecha label="toca una" />
        <Paso titulo="/promos/[slug]" detalle="Fotos, descripción, válida hasta y el botón de pedir." tono="gold" />
        <Flecha label="Pedir" />
        <Paso titulo="WhatsApp" detalle='"Hola! Me interesa la promo "2x1 en gorras bordadas". <link>"' />
      </div>
      <div className="flex items-center pl-[260px]">
        <div className="flex w-[260px] flex-col items-end pr-3 text-[12px] text-muted">con 1 sola promo, la barra va directo al detalle ↗</div>
      </div>
      <div className="flex items-center gap-0 border-t border-line pt-5">
        <Paso titulo="Link viejo" detalle="Una promo vencida o borrada que sigue circulando por WhatsApp." tono="muted" />
        <Flecha label="no se genera" />
        <Paso titulo="404" detalle="Dice qué pasó, ofrece WhatsApp e Ir al inicio y muestra las promos de hoy." tono="gold" />
        <div className="ml-6 max-w-[480px] text-[14px] leading-relaxed text-muted">
          El sitio es estático: una promo vencida desaparece en el siguiente build. Por eso la 404 es la red de seguridad de las
          promos y no solo de los links mal escritos (decisión abajo).
        </div>
      </div>
    </Card>
  );
}

export function Decisiones() {
  return (
    <Card width={720}>
      <Kicker>Decisiones de diseño (las tomé yo; van también al issue)</Kicker>
      <Bullets
        items={[
          <><strong>"Promo" en vez de "Campaña"</strong> en el Eyebrow del detalle: la barra, la URL y la lista ya dicen promo. Una sola palabra para lo mismo.</>,
          <><strong>Fecha absoluta, nunca relativa.</strong> "Válida hasta el domingo 11 de octubre" (Intl es-CO, zona America/Bogota). El sitio se construye una vez: "termina hoy" quedaría mal al día siguiente. Sin ends_at no se muestra nada (ni "sin fecha", ni "por tiempo limitado").</>,
          <><strong>Vencida = no existe.</strong> No se lista en /promos, no sale en la barra, su página no se genera y su link cae en la 404, que muestra las promos de hoy.</>,
          <><strong>Barra con varias promos = un solo link a /promos.</strong> Los títulos rotan pero lo que se toca no se mueve. Con una promo queda como hoy (va al detalle).</>,
          <><strong>La barra sigue solo en la portada.</strong> En /promos sería repetir la lista; en el detalle, la sección "Otras promos" cumple ese papel.</>,
          <><strong>Volver:</strong> "← Todas las promos" si hay más de una; "← Volver al inicio" si es la única. Nada de "Volver atrás".</>,
          <><strong>Fotos sin huecos:</strong> la primera a lo ancho (4:3), las demás de a dos en cuadrado, y si sobra una va a lo ancho al final. Sirve para cualquier cantidad.</>,
          <><strong>WhatsApp:</strong> el flotante de siempre + uno contextual solo donde reemplaza algo: el botón del detalle (reemplaza al viejo, ahora con whatsappUrl()), el del estado vacío y el de la 404. En el detalle el flotante lleva el mismo mensaje de la promo (WhatsAppFab ya acepta text).</>,
          <><strong>Sin Header nuevo:</strong> no agrego "Promos" al menú. La entrada es la barra; si no hay promos, el link no tendría a dónde llevar.</>,
          <><strong>Títulos de página:</strong> "Promos de hoy · Serflow" (/promos), "{"{título}"} · Serflow" con la description como meta description (detalle) y "Página no encontrada · Serflow" (404). Sin "Campana" ni guiones largos.</>,
          <><strong>Sin descripción:</strong> se omite el párrafo (tarjeta y detalle). Sin fotos extra: solo la portada, a lo ancho.</>,
          <><strong>Mascota en la 404:</strong> caja vacía aria-hidden con la proporción de MascotSlot (72 px de ancho en mobile, 120 en desktop). El punteado y el texto son solo del canvas.</>,
          <><strong>Si se aprueba "Promo":</strong> actualizar la variante "Campaña" de Eyebrow y el fix escrito en labels/BoardDesignSystemDebt.</>,
          <><strong>Movimiento:</strong> solo lo que ya existe en tokens.css (anim-enter, reveal-up, reveal-wipe, hover de cards) y el hilo de la 404, todo CSS y apagado con reducir movimiento.</>,
        ]}
      />
      <Block label="Para quién construye">
        <Bullets
          items={[
            "getActivePromos(): filtrar ends_at > ahora (o null) y ordenar por sort_order. Si falla la consulta, que falle el build (hoy devuelve [] y una promo que circula da 404: deuda del canvas de estados).",
            "PromoCard a src/components/ui (familia cards) y PromoGallery (familia media), con defineAsset en sus canvases. PromoBar cambia: con 2 o más, un solo <a href=\"/promos\">.",
            "Layout.astro: prop whatsappText para pasarle el mensaje de la promo al WhatsAppFab del detalle.",
            "404.astro: lee getActivePromos() en el build para el bloque de promos.",
            "Errores: no hay estados de error en runtime; las páginas son SSG. Una foto que no carga deja su marco con la trama (fabric) y el alt.",
          ]}
        />
      </Block>
    </Card>
  );
}

export function Recomendacion() {
  return (
    <Card width={560} tone="rec">
      <Kicker>Recomendación de Diseño</Kicker>
      <Title>Lista A · Detalle A · 404 B con promos</Title>
      <Block label="/promos · A Tarjetas">
        Un solo componente nuevo (PromoCard) que también sirve en la 404 y en "Otras promos". Con 3 promos se ve todo en dos
        scrolls del celular y la tarjeta se parece a ProductCard, así que el cliente ya sabe que se toca.
      </Block>
      <Block label="/promos/[slug] · A Ficha">
        En un celular de 390, título, vigencia, descripción y el botón de pedir caben antes del pliegue. Las fotos vienen después
        y nunca dejan huecos. No pone texto encima de la foto, así que no depende de qué tan clara sea.
      </Block>
      <Block label="404 · B Hilo suelto + promos de hoy">
        Usa el hilo de la portada, así que se siente Serflow. Dice lo que más pasa (una promo que ya terminó) y debajo muestra
        las promos vigentes. Sin promos, queda solo el titular con WhatsApp e Ir al inicio.
      </Block>
      <Block label="Qué necesito de Said">
        <Bullets
          items={[
            "Elegir una opción por página (o decir 'la recomendada').",
            "Confirmar el titular de la 404: \"Se nos soltó el hilo\" o el neutro \"Esta página no existe\".",
            "Confirmar \"Promo\" en vez de \"Campaña\" en el detalle.",
          ]}
        />
      </Block>
    </Card>
  );
}

/* ---------------- Notas por opción ---------------- */

export const NotaListaA = () => (
  <Nota
    opcion="/promos · A"
    nombre="Tarjetas"
    rec
    lee="'Promos de hoy' y tarjetas con foto, hasta cuándo va y qué es."
    resuelve={[
      "Todas pesan lo mismo: el orden lo pone sort_order, no el diseño.",
      "Un componente nuevo (PromoCard) que se reusa en la 404 y en el detalle.",
      "Funciona igual con 1, 3 o 6 promos.",
    ]}
    sacrifica={["Con 1 sola promo la página se ve vacía (pasa poco: la barra va directo al detalle).", "En el celular cada tarjeta mide unos 430 px: con 5 promos hay scroll."]}
    whatsapp="Solo el flotante. Se pide desde el detalle."
    nuevo="PromoCard (familia cards)."
  />
);

export const NotaListaB = () => (
  <Nota
    opcion="/promos · B"
    nombre="Destacada + filas"
    lee="Una promo grande arriba y las demás en filas cortas."
    resuelve={["La primera se vende sola, con su descripción completa.", "Las demás ocupan poco: 3 o 4 promos caben en una pantalla."]}
    sacrifica={["Dos componentes nuevos (destacada y fila) en vez de uno.", "Las de abajo se ven menos: hay que cuidar el orden en el admin.", "La fila no muestra descripción."]}
    whatsapp="Solo el flotante."
    nuevo="Dos tarjetas: destacada y fila (en el canvas, Destacada y Fila)."
  />
);

export const NotaListaC = () => (
  <Nota
    opcion="/promos · C"
    nombre="Afiches con WhatsApp"
    lee="Cada promo completa, con su propio botón dorado de pedir."
    resuelve={["Se pide en un toque, sin entrar al detalle.", "La descripción se lee completa."]}
    sacrifica={[
      "Rompe la regla del design system: un botón de WhatsApp por sección visible. Con 3 promos hay 3 botones dorados + el flotante.",
      "El detalle pierde su papel: queda solo para ver fotos.",
    ]}
    whatsapp="Uno por promo + el flotante."
    nuevo="Tarjeta afiche con botón (en el canvas, Afiche)."
  />
);

export const NotaDetalleA = () => (
  <Nota
    opcion="Detalle · A"
    nombre="Ficha"
    rec
    lee="Qué es, hasta cuándo va y el botón de pedir, antes que las fotos."
    resuelve={[
      "Todo lo que decide la compra cabe en la primera pantalla del celular.",
      "Fotos sin huecos con 1, 2, 3, 4 o 5 (estados abajo).",
      "Ningún texto encima de la foto: se lee igual con cualquier banner.",
    ]}
    sacrifica={["La foto principal queda debajo del pliegue en el celular.", "Se parece a una ficha de producto; menos 'cartel' que B."]}
    whatsapp="Botón 'Pedir esta promo por WhatsApp' con la promo en el mensaje. El flotante lleva el mismo mensaje."
    nuevo="PromoGallery (familia media)."
  />
);

export const NotaDetalleB = () => (
  <Nota
    opcion="Detalle · B"
    nombre="Afiche"
    lee="La foto de la promo a toda pantalla con el título encima."
    resuelve={["Entra por los ojos: parece un cartel de la tienda.", "Las otras fotos van en una fila que se desliza, sin huecos por construcción."]}
    sacrifica={[
      "En el celular el botón de pedir queda debajo del pliegue.",
      "El título encima de la foto depende del degradado; con un banner muy claro se lee peor.",
      "La fila deslizable esconde fotos: hay que saber que se desliza.",
    ]}
    whatsapp="Igual que A."
    nuevo="Nada más allá de PromoCard."
  />
);

export const Nota404A = () => (
  <Nota
    opcion="404 · A"
    nombre="Directa"
    lee="Error 404, 'Esta página no existe' y dos salidas."
    resuelve={["Es la propuesta del canvas de estados, tal cual.", "Corta: carga y se entiende en un segundo."]}
    sacrifica={["No dice nada de promos, que es la causa más probable de un link viejo.", "Se siente genérica."]}
    whatsapp="Botón 'Escríbenos por WhatsApp' (con un mensaje que dice que llegó de un link roto) + el flotante."
    nuevo="Nada."
  />
);

export const Nota404B = () => (
  <Nota
    opcion="404 · B"
    nombre="Hilo suelto"
    rec
    lee="'Se nos soltó el hilo' con la costura de la portada cortada."
    resuelve={[
      "Usa el hilo de la portada: se siente Serflow y no una página de error.",
      "Explica el caso más común: una promo que ya terminó.",
      "Con promos vigentes las muestra debajo (estado a la derecha).",
      "El hilo se cose una vez al cargar; con reducir movimiento aparece quieto.",
    ]}
    sacrifica={["El juego de palabras no es para todos; la alternativa es el titular de A.", "Una ilustración más que mantener (SVG chico, sin JS)."]}
    whatsapp="Igual que A."
    nuevo="Ilustración HiloSuelto (SVG en la página, no es componente del sistema)."
  />
);

export const Nota404C = () => (
  <Nota
    opcion="404 · C"
    nombre="Con salidas"
    lee="La 404 directa y debajo 'Lo que sí está': las promos de hoy o las secciones de la portada."
    resuelve={["Nunca queda en un callejón: siempre hay a dónde ir.", "Sin promos, ofrece Qué hacemos, Disponible ahora y Visítanos."]}
    sacrifica={["Más larga: el mensaje principal pierde peso.", "Las tres secciones repiten el menú del Header."]}
    whatsapp="Igual que A."
    nuevo="Nada (usa PromoCard)."
  />
);

/* ---------------- Tableros de componentes ---------------- */

function Etiqueta({ children, propuesta = false }: { children: ReactNode; propuesta?: boolean }) {
  return (
    <div className="flex items-center gap-2 pb-2 text-[13px] text-muted">
      {children}
      {propuesta && <Tag>Propuesta</Tag>}
    </div>
  );
}

export function BarraBoard() {
  return (
    <Card width={1380}>
      <div className="flex items-center gap-2">
        <Kicker>Barra de promos · portada</Kicker>
        <Tag>Propuesta</Tag>
      </div>
      <Title>Con varias promos, la barra entera lleva a /promos</Title>
      <p className="max-w-[760px] text-[15px] leading-relaxed text-muted">
        Hoy cada título que rota es su propio link: el blanco se mueve debajo del dedo cada 5 s. Propuesta: con 2 o más, toda la
        barra es un solo link a /promos y "Ver las 3" queda quieto a la derecha. Los títulos siguen rotando (pausa con mouse o
        foco, quietos con reducir movimiento). Con una sola promo no cambia nada: va directo al detalle.
      </p>
      <div>
        <Etiqueta propuesta>3 promos · desktop 1280</Etiqueta>
        <div className="w-[1280px]">
          <PromoBarPropuesta promos={barLinks(PROMOS_3)} />
        </div>
      </div>
      <div className="grid grid-cols-[390px_1fr] gap-10">
        <div className="flex flex-col gap-6">
          <div>
            <Etiqueta>Hoy · 3 promos · mobile</Etiqueta>
            <div className="w-[390px]">
              <PromoBar promos={barLinks(PROMOS_3)} />
            </div>
          </div>
          <div>
            <Etiqueta propuesta>3 promos · mobile · toda la barra → /promos</Etiqueta>
            <div className="w-[390px]">
              <PromoBarPropuesta promos={barLinks(PROMOS_3)} />
            </div>
          </div>
          <div>
            <Etiqueta>1 promo · mobile · igual que hoy, → /promos/2x1-gorras-bordadas</Etiqueta>
            <div className="w-[390px]">
              <PromoBarPropuesta promos={barLinks(PROMOS_1)} />
            </div>
          </div>
          <div>
            <Etiqueta>0 promos · no se pinta</Etiqueta>
            <div className="rounded-tile border border-dashed border-line px-4 py-3 text-[13px] text-muted">(nada: el Header queda arriba de todo)</div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <Block label="Lector de pantalla">
            Con varias, el link se anuncia como "Ver las 3 promos de hoy" y los títulos que rotan quedan aria-hidden: no se leen
            cada 5 s. Con una, se lee el título y "Ver promo".
          </Block>
          <Block label="Lo que no cambia">Barra dorada arriba de todo, solo en la portada, sin promos no aparece, mismo alto que hoy (64 px, todo tocable).</Block>
        </div>
      </div>
    </Card>
  );
}

const TRANSPARENTE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export function ComponentesBoard() {
  const cargando = { ...PROMO_EQUIPOS, cover: { ...PROMO_EQUIPOS.cover, src: TRANSPARENTE } };
  return (
    <Card width={1380}>
      <div className="flex items-center gap-2">
        <Kicker>Componentes nuevos</Kicker>
        <Tag>Propuesta</Tag>
      </div>
      <Title>PromoCard y PromoGallery</Title>
      <div className="grid grid-cols-4 gap-6">
        <div className="grid grid-rows-[auto_1fr]">
          <Etiqueta propuesta>PromoCard · con fecha</Etiqueta>
          <PromoCard promo={PROMO_GORRAS} />
        </div>
        <div className="grid grid-rows-[auto_1fr]">
          <Etiqueta propuesta>PromoCard · sin ends_at (sin píldora)</Etiqueta>
          <PromoCard promo={PROMO_NINOS} />
        </div>
        <div className="grid grid-rows-[auto_1fr]">
          <Etiqueta propuesta>PromoCard · sin descripción</Etiqueta>
          <PromoCard promo={{ ...PROMO_GORRAS, description: null }} />
        </div>
        <div className="grid grid-rows-[auto_1fr]">
          <Etiqueta propuesta>PromoCard · foto cargando con señal lenta</Etiqueta>
          <PromoCard promo={cargando} />
        </div>
      </div>
      <p className="max-w-[760px] text-[15px] leading-relaxed text-muted">
        PromoCard: toda la card es un link (foco visible dorado), foto 4:3 como ProductCard, vigencia en StatusPill accent,
        título h2 (h3 dentro de una Section como "Otras promos"), descripción a 2 líneas. Sin ends_at no hay píldora; sin descripción, no hay párrafo. Mientras la foto carga se
        ve la trama de tela, sin saltos de layout.
      </p>
      <div className="border-t border-line pt-6">
        <Etiqueta propuesta>PromoGallery · la misma regla con 1, 2, 3, 4 y 5 fotos: nunca queda un hueco</Etiqueta>
        <div className="grid grid-cols-5 items-start gap-5">
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <div key={n} className="@container flex flex-col gap-2">
              <div className="text-[13px] font-semibold">{n === 1 ? "1 foto" : `${n} fotos`}</div>
              <PromoGallery photos={[PROMO_GORRAS.cover, ...withPhotoCount(PROMO_GORRAS, n === 4 ? 5 : n).photos].slice(0, n)} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
