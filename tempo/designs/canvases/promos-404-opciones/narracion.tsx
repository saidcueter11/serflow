import type { ReactNode } from "react";
import { PromoBar } from "../../../../src/components/ui/PromoBar";
import { PROMO_EQUIPOS, PROMO_GORRAS, PROMO_NINOS, PROMOS_1, PROMOS_3, withPhotoCount } from "./data";
import { PromoAfiche, PromoBarPropuesta, PromoCard, PromoGrid } from "./propuestas";
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

function Nota({ opcion, nombre, lee, resuelve, sacrifica, whatsapp, nuevo }: {
  opcion: string;
  nombre: string;
  lee: string;
  resuelve: string[];
  sacrifica: string[];
  whatsapp: string;
  nuevo: string;
}) {
  return (
    <Card width={400}>
      <div className="flex items-center gap-2">
        <Kicker>{opcion}</Kicker>
        <Tag>Descartada</Tag>
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
    <Card width={620} tone="rec">
      <div className="flex items-center gap-2">
        <Kicker>PRI-131 · Promos y 404</Kicker>
        <Tag>Final aprobada</Tag>
      </div>
      <Title>Promos con su botón de WhatsApp, un afiche por promo y una 404 con salidas</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        Después del SQL de PRI-131 una promo trae descripción, fecha de fin (ends_at) y orden (sort_order), y puede haber
        varias activas. Said eligió una opción por página y pidió arreglar los huecos; esta fila es lo que se construye.
      </p>
      <Bullets
        items={[
          <><strong>/promos · C Afiches con WhatsApp:</strong> cada promo con su botón de pedir y el mensaje ya escrito con esa promo.</>,
          <><strong>/promos/[slug] · B Afiche:</strong> en desktop la descripción y el botón van dentro del afiche; las fotos, en filas que llenan el ancho.</>,
          <><strong>404 · C Con salidas:</strong> titular directo, WhatsApp e Ir al inicio, y debajo las promos de hoy o las secciones de la portada.</>,
          <><strong>Barra de promos</strong> (portada): con varias, toda la barra lleva a /promos (Propuesta: cambia el link de la barra de hoy).</>,
        ]}
      />
      <Block label="Cómo leer el canvas">
        Arriba, la final: una fila por página con su nota (qué pediste y qué cambié), mobile 390, desktop 1280 y sus estados a la
        derecha. Debajo, la barra y los componentes nuevos. Al final, la fila Descartadas con las opciones que no se eligieron.
        Lo marcado <Tag>Propuesta</Tag> es UI nueva que todavía no existe en src/components/ui.
      </Block>
      <Block label="Datos y fotos">
        Promos de ejemplo (2x1 en gorras, 10% en camisetas para equipos, gorras para niños): no existen en la base. Fotos de
        src/assets/images y src/assets/images/stock, sin caras reconocibles. "Hoy" en el canvas es el lunes 5 de octubre de 2026.
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
        <Paso titulo="/promos" detalle="Todas las vigentes, en el orden del admin, cada una con su botón de pedir." tono="gold" />
        <Flecha label="ver fotos" />
        <Paso titulo="/promos/[slug]" detalle="Fotos, descripción, válida hasta y el botón de pedir." tono="gold" />
        <Flecha label="Pedir" />
        <Paso titulo="WhatsApp" detalle='"¡Hola! Me interesa la promo "2x1 en gorras bordadas". <link>"' />
      </div>
      <div className="flex items-center pl-[260px]">
        <div className="flex w-[260px] flex-col items-end pr-3 text-[12px] text-muted">con 1 sola promo, la barra va directo al detalle</div>
        <div className="flex flex-1 justify-center text-[12px] text-muted">o "Pedir por WhatsApp" desde la lista, sin entrar al detalle</div>
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
      <Kicker>Decisiones de diseño de la final (van también al issue)</Kicker>
      <Bullets
        items={[
          <><strong>"Promo" en vez de "Campaña"</strong> en el Eyebrow del detalle: la barra, la URL y la lista ya dicen promo. Una sola palabra para lo mismo.</>,
          <><strong>Fecha absoluta, nunca relativa.</strong> "Válida hasta el domingo 11 de octubre" (Intl es-CO, zona America/Bogota). El sitio se construye una vez: "termina hoy" quedaría mal al día siguiente. Sin ends_at no se muestra nada (ni "sin fecha", ni "por tiempo limitado").</>,
          <><strong>Vencida = no existe.</strong> No se lista en /promos, no sale en la barra, su página no se genera y su link cae en la 404, que muestra las promos de hoy.</>,
          <><strong>Barra con varias promos = un solo link a /promos.</strong> Los títulos rotan pero lo que se toca no se mueve. Con una promo queda como hoy (va al detalle).</>,
          <><strong>La barra sigue solo en la portada.</strong> En /promos sería repetir la lista; en el detalle, la sección "Otras promos" cumple ese papel.</>,
          <><strong>Volver:</strong> "← Todas las promos" si hay más de una; "← Volver al inicio" si es la única. Nada de "Volver atrás".</>,
          <><strong>Ningún hueco, con cualquier cantidad:</strong> las listas de promos (PromoGrid) ponen hasta 3 por fila y la última fila se reparte el ancho; una card sola en su fila se pone horizontal. Las fotos del detalle van en filas de 4 en desktop y la última se reparte el ancho (5 extra = 4 + 1 a lo ancho). Estado vacío y salidas de la 404, a lo ancho del contenido.</>,
          <><strong>Detalle B en desktop:</strong> descripción y botón de pedir dentro del afiche, sobre un degradado de izquierda a derecha (el texto nunca queda sobre la foto sola). El afiche mide al menos 560 px y crece con la descripción.</>,
          <><strong>WhatsApp:</strong> el flotante de siempre + uno contextual: uno por promo en /promos (decisión de Said: pedir en un toque), el del detalle, el del estado vacío y el de la 404. Todos con el mensaje ya escrito: "¡Hola! Me interesa la promo "2x1 en gorras bordadas". {"<link>"}". En el detalle el flotante lleva el mismo mensaje (WhatsAppFab ya acepta text).</>,
          <><strong>Sin Header nuevo:</strong> no agrego "Promos" al menú. La entrada es la barra; si no hay promos, el link no tendría a dónde llevar.</>,
          <><strong>Títulos de página:</strong> "Promos de hoy · Serflow" (/promos), "{"{título}"} · Serflow" con la description como meta description (detalle) y "Página no encontrada · Serflow" (404). Nada de "Campana" sin tilde ni guiones largos.</>,
          <><strong>Sin descripción:</strong> se omite el párrafo (tarjeta y detalle). Sin fotos extra: solo la portada, a lo ancho.</>,
          <><strong>Sin mascota en la 404</strong> (PRI-124 en pausa): no se reserva espacio. Si vuelve, entra encima del Eyebrow.</>,
          <><strong>Si se aprueba "Promo":</strong> actualizar la variante "Campaña" de Eyebrow y el fix escrito en labels/BoardDesignSystemDebt.</>,
          <><strong>Movimiento:</strong> solo lo que ya existe en tokens.css (anim-enter, reveal-wipe, hover de cards), todo CSS y apagado con reducir movimiento.</>,
        ]}
      />
      <Block label="Para quién construye">
        <Bullets
          items={[
            "getActivePromos(): filtrar ends_at > ahora (o null) y ordenar por sort_order. Si falla la consulta, que falle el build (hoy devuelve [] y una promo que circula da 404: deuda del canvas de estados).",
            "PromoCard, PromoAfiche y PromoGrid a src/components/ui (familia cards), con defineAsset en su canvas. PromoBar cambia: con 2 o más, un solo <a href=\"/promos\">. PromoGallery se descartó con el detalle A.",
            "PromoAfiche usa whatsappUrl() con el mensaje de la promo (título + link). Actualizar la regla de Button whatsapp en el design system: en /promos va uno por promo.",
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
    <Card width={560}>
      <div className="flex items-center gap-2">
        <Kicker>Recomendación original de Diseño</Kicker>
        <Tag>Descartada</Tag>
      </div>
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

/* ---------------- Notas de la final ---------------- */

function NotaFinal({ pagina, nombre, pediste, cambie, estados, whatsapp }: {
  pagina: string;
  nombre: string;
  pediste: string;
  cambie: ReactNode[];
  estados: string[];
  whatsapp: string;
}) {
  return (
    <Card width={400} tone="rec">
      <div className="flex items-center gap-2">
        <Kicker>{pagina}</Kicker>
        <Tag>Final aprobada</Tag>
      </div>
      <Title>{nombre}</Title>
      <Block label="Lo que pediste">
        <span className="italic text-muted">"{pediste}"</span>
      </Block>
      <Block label="Qué cambié">
        <Bullets items={cambie} />
      </Block>
      <Block label="Estados en esta fila">
        <Bullets items={estados} />
      </Block>
      <Block label="WhatsApp">{whatsapp}</Block>
    </Card>
  );
}

export const NotaFinalLista = () => (
  <NotaFinal
    pagina="/promos · C"
    nombre="Afiches con WhatsApp"
    pediste="Me gusta más esta opción donde tengan acceso a WhatsApp directamente y que el mensaje ya tenga un mensaje prefilled."
    cambie={[
      "Cada promo lleva su botón 'Pedir por WhatsApp' con el mensaje de esa promo ya escrito.",
      "Sin columnas vacías: con 1 promo (o la que sobre en la última fila) el afiche se pone horizontal y llena el ancho.",
      "Sin promos: el aviso va a lo ancho del contenido, no en una caja angosta a la izquierda.",
      "El texto de arriba dice que se pide por WhatsApp. Con 1 sola foto el link dice 'Ver la promo'.",
    ]}
    estados={["3 promos (una sin fecha de cierre)", "1 promo", "Sin promos"]}
    whatsapp={'Uno por promo + el flotante. Mensaje: ¡Hola! Me interesa la promo "2x1 en gorras bordadas". serflowctg.netlify.app/promos/2x1-gorras-bordadas'}
  />
);

export const NotaFinalDetalle = () => (
  <NotaFinal
    pagina="/promos/[slug] · B"
    nombre="Afiche"
    pediste="Me gusta la opción B pero necesito un mejor manejo de espacios. / Aquí también."
    cambie={[
      "Desktop: descripción y botón de pedir dentro del afiche. Ya no queda una columna corta de texto junto a una larga de fotos.",
      "Más fotos: filas de 4 en desktop; la última se reparte el ancho (4 + 1 a lo ancho, 2 mitades). En mobile, fila deslizable; con una sola foto, a lo ancho.",
      "Otras promos: sin tercera columna vacía. Con 2 van en dos mitades; con 1, a lo ancho y horizontal.",
      "Menos aire muerto entre bloques (el espacio lo pone cada sección, no se suma dos veces).",
    ]}
    estados={["5 fotos y 2 otras promos", "3 fotos y 1 otra promo", "1 foto y ninguna otra promo (vuelve al inicio)"]}
    whatsapp="Botón 'Pedir esta promo por WhatsApp' con la promo en el mensaje. El flotante lleva el mismo mensaje."
  />
);

export const NotaFinal404 = () => (
  <NotaFinal
    pagina="404 · C"
    nombre="Con salidas"
    pediste="Me voy con esta opción."
    cambie={[
      "Sin el espacio de la mascota: el titular sube y la página se lee en un vistazo.",
      "Promos de hoy en la misma lista sin huecos del detalle (con 1 o 2 promos tampoco queda una columna vacía).",
      "Sin promos, 'Lo que sí está' va en tres bloques a lo ancho en desktop y en lista en mobile.",
    ]}
    estados={["Sin promos", "Con 3 promos"]}
    whatsapp="Botón 'Escríbenos por WhatsApp' (el mensaje dice que llegó a una página que no existe) + el flotante."
  />
);

/* ---------------- Notas de las descartadas ---------------- */

export const NotaListaA = () => (
  <Nota
    opcion="/promos · A"
    nombre="Tarjetas"
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

export const NotaDetalleA = () => (
  <Nota
    opcion="Detalle · A"
    nombre="Ficha"
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
      <Title>PromoCard, PromoGrid y PromoAfiche</Title>
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
      <div className="flex flex-col gap-4 border-t border-line pt-6">
        <Etiqueta propuesta>PromoGrid · 4 promos: 3 en la fila y la cuarta a lo ancho, con la card en horizontal (nunca una columna vacía)</Etiqueta>
        <div className="@container">
          <PromoGrid>{[...PROMOS_3, { ...PROMO_EQUIPOS, slug: "estampado-dtf", title: "Estampado DTF desde 1 unidad" }].map((p) => <PromoCard key={p.slug} promo={p} />)}</PromoGrid>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-line pt-6">
        <Etiqueta propuesta>PromoAfiche · la card de /promos con su botón de pedir. Bordes: sin fecha de cierre, sin descripción y con 1 sola foto</Etiqueta>
        <div className="grid grid-cols-3 items-stretch gap-5">
          <div className="flex">
            <PromoAfiche promo={PROMO_NINOS} />
          </div>
          <div className="flex">
            <PromoAfiche promo={{ ...PROMO_GORRAS, description: null }} />
          </div>
          <div className="flex">
            <PromoAfiche promo={withPhotoCount(PROMO_GORRAS, 1)} />
          </div>
        </div>
        <p className="max-w-[760px] text-[15px] leading-relaxed text-muted">
          Desde 672 px de ancho se pone horizontal (se ve en la fila final con 1 promo). El botón dorado abre WhatsApp con el
          mensaje de esa promo; "Ver las N fotos" lleva al detalle. Sin descripción no hay párrafo y los botones se quedan abajo.
        </p>
      </div>
    </Card>
  );
}
