import type { ReactNode } from "react";
import { BarraWhatsApp, FichaA, FichaB, FichaC, ListaA, ListaB, ListaC, Pantalla, type Viewport } from "./paginas";
import {
  BEISBOL_26,
  BEISBOL_HOY,
  BEISBOL_HREF,
  CAMISETAS_HREF,
  CARTAGENA,
  CATEGORIES,
  CATEGORIES_CON_VACIA,
  MTQ_ITEMS,
  PARCHE,
  RELACIONADOS_BEISBOL,
  RELACIONADOS_MODA,
  RELACIONADOS_MTQ,
  SIN_CARGAR,
  TRUCKER,
  mensaje,
  mensajeGrupo,
  mensajeLogo,
  type Producto,
} from "./data";

/* ---------------- Narración (no es producto) ---------------- */

function Card({ width, children }: { width: number; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 rounded-card border border-line bg-surface p-8 font-body text-ink antialiased" style={{ width }}>
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
  return <span className="rounded-full border border-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-[.1em] text-accent">{children}</span>;
}

export function Intro() {
  return (
    <Card width={620}>
      <Kicker>PRI-130 · Catálogo · opciones</Kicker>
      <Title>Lista de categoría y ficha de producto: tres opciones de cada una</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        Las dos páginas pasan al design system de la portada nueva ("B ajustada", en producción). Usan los mismos
        componentes (Header, Footer, ProductCard, Button, EmptyState, Section, Chip) y dos nuevos marcados{" "}
        <Tag>Propuesta</Tag>: CategoryNav (las pestañas) y ProductGallery (las fotos de la ficha).
      </p>
      <p className="text-[15px] leading-relaxed text-muted">
        PhotoSlot no aparece a propósito: su regla dice que no es para fotos del catálogo (es para fotos del taller).
        ProductGallery ocupa ese lugar; al implementarla, la usageInstructions de PhotoSlot pasa a apuntar a ella.
      </p>
      <Block label="Cómo leer el canvas">
        Arriba, las decisiones que aplican a todas las opciones y mi recomendación. Después, una fila por opción: nota
        (qué resuelve y qué sacrifica), mobile 390 y desktop 1280 cortados en el pliegue (844 y 800 px, lo que se ve sin
        hacer scroll). Al final de cada página, la fila de estados de la opción recomendada, a página completa.
      </Block>
      <Block label="Fotos">
        Del catálogo actual (src/assets/images): gorras sobre fondo gris, sin personas ni datos personales. Los nombres y
        descripciones de los mocks son propuestos; la fila "Datos de hoy" muestra cómo se ve con lo que hay en la base.
      </Block>
    </Card>
  );
}

export function Decisiones() {
  return (
    <Card width={980}>
      <Kicker>Decisiones de diseño · valen para todas las opciones</Kicker>
      <Title>Lo que no cambia entre A, B y C</Title>
      <div className="grid grid-cols-2 gap-x-10 gap-y-6">
        <Block label="Precio">
          Nunca se muestra, aunque products.price tenga valor. Una frase lo dice una vez: en la lista, el subtítulo ("Toca el
          que te guste y te damos precio por WhatsApp"); en la ficha, "El precio, los colores y si está disponible te los
          damos por WhatsApp". Al implementar, sacar offers.price "0" del JSON-LD: Google puede mostrar $0.
        </Block>
        <Block label="WhatsApp">
          El flotante sigue siendo la única entrada genérica; Header y Footer sin WhatsApp. En la ficha, "Contactar por
          WhatsApp" lleva el producto en el mensaje (ver "Lo que llega a WhatsApp"). En una categoría vacía, el botón del
          EmptyState reemplaza la grilla. Ya no se manda el link crudo de la foto: WhatsApp arma la vista previa con el
          og:image de la ficha.
        </Block>
        <Block label="Header">
          Se suma "Catálogo" al nav (hoy el catálogo solo se encuentra con "Ver todo" de la portada) y queda marcado en
          estas páginas. Toca NAV_LINKS, así que también se ve en la portada. Necesito tu sí.
        </Block>
        <Block label="Lo que no sale aquí">
          Dirección y horario (solo en #visitanos; el Footer ya tiene "Cómo llegar y horario"), la mascota, el hilo (es de la
          portada) y el banner con flechas de hoy.
        </Block>
        <Block label="Pestañas · CategoryNav (Propuesta)">
          Links y no Chip (cambian la URL). Medidas del Chip: 44 px, 14 px semibold, dorada la actual. Llevan el conteo, así
          una categoría vacía se nota antes de tocarla. Una fila deslizable en el celular. Cero JS: hoy cambiar de pestaña es
          un script que esconde grillas y reescribe la URL; ahora es un link normal (ClientRouter ya hace la transición).
        </Block>
        <Block label="Galería · ProductGallery (Propuesta)">
          Cero JS (hoy ProductPreview.astro tiene ~300 líneas de script). Foto cuadrada que se desliza, miniaturas, "N fotos"
          y "Ver en grande" con popover nativo (se cierra con X, Esc o tocando afuera). La lupa de hover se va: no existe en
          el celular. Con una foto no hay miniaturas.
        </Block>
        <Block label="Movimiento">
          Costura dorada en el título de la lista y en "Más de X" (stitch-title), fotos de las cards que se destapan al
          aparecer (reveal-wipe, ya viene en ProductCard). La foto principal de la ficha no se anima: es lo primero que
          carga. Todo CSS y apagado con reducir movimiento.
        </Block>
        <Block label="ProductCard y descripciones">
          meta = primera línea de la descripción; sin descripción, la card no muestra meta (cambio de una línea en
          ProductCard: no pintar el p vacío). La frase de relleno "¿Te interesa este producto de X?..." cuenta como vacía. El
          nombre largo se parte en líneas, no se corta.
        </Block>
      </div>
    </Card>
  );
}

export function Recomendacion() {
  return (
    <Card width={560}>
      <Kicker>Recomendación de Diseño</Kicker>
      <Title>Lista A · Directo + Ficha B · Barra fija</Title>
      <p className="text-[15px] leading-relaxed">
        <strong>Lista A</strong>: es la única que muestra dos filas completas de gorras antes del pliegue en el celular (B y C,
        una y media), no agrega fotos que cargar y las pestañas con conteo ya dicen qué hay. B se ve más linda, pero su foto de portada hoy sería
        una gorra más de la grilla; C sirve cuando las categorías se distingan entre sí, y hoy todas son gorras sobre gris.
      </p>
      <p className="text-[15px] leading-relaxed">
        <strong>Ficha B</strong>: el botón del producto nunca se va (tampoco mirando "Más de X") y hay un solo WhatsApp en
        pantalla a la vez, porque la barra reemplaza al flotante en esta página. A muestra dos botones de WhatsApp juntos; C
        agrega un paso y en el celular su botón queda debajo del pliegue. Los chips de C se pueden sumar a B después, si
        quieres empujar más la personalización.
      </p>
      <Block label="Qué necesito de Said">
        <Bullets
          items={[
            "Elegir una lista (A, B o C) y una ficha (A, B o C).",
            "¿Sumamos \"Catálogo\" al Header? Recomiendo que sí.",
            "En la ficha B el flotante se oculta (Layout.astro recibe hideFab). ¿De acuerdo?",
            "Cambio chico en el design system: ProductCard con meta opcional (sin descripción no pinta el párrafo); se actualizan su canvas y su asset.",
            "Nombres y descripciones reales en serflow-admin (ver \"Datos de hoy\"): no es código, pero es lo que más va a vender.",
          ]}
        />
      </Block>
    </Card>
  );
}

export function DatosDeHoy() {
  return (
    <Card width={520}>
      <Kicker>Datos de hoy · producción, 2026-10-05</Kicker>
      <Title>Con lo que hay en la base también funciona</Title>
      <Bullets
        items={[
          "5 categorías activas: Mi Tierra Querida 26, Beisbol 23, Moda 23, Basketball 10, Niños 10. Todo son gorras.",
          "Los productos se llaman \"Beisbol #26\" o \"Mi Tierra Querida #1\" y todos tienen la misma descripción de relleno.",
          "Una foto por producto (3:4, gorra al centro sobre gris).",
          "Hay un producto \"prueba\" activo en Mi Tierra Querida; hoy sale en la portada.",
          "Labels tal cual: \"Beisbol\" sin tilde, \"Basketball\" en inglés.",
        ]}
      />
      <Block label="Qué hace el diseño con eso">
        Las cards sin meta, la ficha sin descripción y sin miniaturas, y el mensaje de WhatsApp que se lee bien con
        cualquier nombre ("Me interesa este producto: Beisbol #26"). Está en las filas de estados. Renombrar, describir y
        desactivar "prueba" se hace en serflow-admin.
      </Block>
    </Card>
  );
}

function Seccion({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="flex w-[2200px] items-end gap-6 border-b border-line pb-5 font-body text-ink antialiased">
      <span className="font-display text-[64px] font-bold leading-none text-accent">{n}</span>
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-[40px] font-bold leading-none tracking-tight">{title}</h2>
        <p className="text-[16px] text-muted">{children}</p>
      </div>
    </div>
  );
}

export const SeccionLista = () => (
  <Seccion n="1" title="Lista de categoría">
    /products/[category] · hoy ProductCardList.astro: banner con flechas, pills de 36 px y una caja sin salida cuando está vacía
  </Seccion>
);
export const SeccionFicha = () => (
  <Seccion n="2" title="Ficha de producto">
    /products/[category]/[id] · hoy ProductPreview.astro: font-titan, botones hechos a mano, lupa de hover y ~300 líneas de JS
  </Seccion>
);

function Nota({ letra, nombre, lee, resuelve, sacrifica, whatsapp, nuevo }: {
  letra: string;
  nombre: string;
  lee: string;
  resuelve: string[];
  sacrifica: string[];
  whatsapp: string;
  nuevo: string;
}) {
  return (
    <Card width={400}>
      <Kicker>{letra}</Kicker>
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

export const NotaListaA = () => (
  <Nota
    letra="Lista · opción A · recomendada"
    nombre="Directo"
    lee="El nombre de la categoría, cuántos diseños hay y las primeras gorras."
    resuelve={[
      "Prendas antes del pliegue: dos filas en el celular.",
      "Las pestañas con conteo dicen qué hay en cada categoría sin entrar.",
      "Una sola línea avisa que el precio va por WhatsApp.",
      "No carga ninguna imagen fuera de las gorras.",
    ]}
    sacrifica={[
      "No tiene foto de ambiente: la página es la grilla.",
      "En el celular las pestañas no caben: la quinta queda cortada y se desliza.",
    ]}
    whatsapp="El flotante. Categoría vacía: el botón del EmptyState."
    nuevo="CategoryNav."
  />
);

export const NotaListaB = () => (
  <Nota
    letra="Lista · opción B"
    nombre="Con portada"
    lee="La foto de la categoría con su nombre encima, como el hero de la portada."
    resuelve={[
      "Se siente igual que la portada: foto, degradado y el título que entra.",
      "Cada categoría tiene cara propia si el admin le sube una foto (categories.image_url ya existe).",
      "Sin foto queda el título sobre la trama, nunca un bloque gris (estado abajo).",
    ]}
    sacrifica={[
      "La foto empuja la grilla: en el celular se ve una fila y media de gorras antes del pliegue.",
      "Hoy no hay fotos de ambiente por categoría: sería una gorra más, repetida de la grilla.",
      "Una imagen grande más que cargar con mala señal.",
    ]}
    whatsapp="El flotante. Categoría vacía: el botón del EmptyState."
    nuevo="CategoryNav."
  />
);

export const NotaListaC = () => (
  <Nota
    letra="Lista · opción C"
    nombre="Categorías con foto"
    lee="Las cinco categorías como tarjetas con foto y, debajo, las gorras de la elegida."
    resuelve={[
      "Se ve de un vistazo todo lo que hay.",
      "Quien llega de Google a una categoría descubre las otras.",
    ]}
    sacrifica={[
      "Las tarjetas ocupan un tercio de la primera pantalla antes de la primera gorra.",
      "Cinco fotos más que cargar.",
      "Hoy las tarjetas se parecen entre sí: todas son gorras sobre gris.",
      "Con 8 o más categorías la fila se vuelve larga.",
    ]}
    whatsapp="El flotante. Categoría vacía: el botón del EmptyState."
    nuevo="CategoryNav con variante de tarjetas (CategoryTiles en el canvas)."
  />
);

export const NotaFichaA = () => (
  <Nota
    letra="Ficha · opción A"
    nombre="Vitrina"
    lee="La foto, el nombre y el botón dorado."
    resuelve={[
      "Lo más simple: una columna, el botón en el flujo.",
      "El flotante lleva el producto en el mensaje: no suma otra entrada genérica.",
    ]}
    sacrifica={[
      "Dos botones de WhatsApp en pantalla a la vez (el del producto y el flotante).",
      "Al bajar a \"Más de X\" el botón del producto se pierde de vista.",
    ]}
    whatsapp="Botón del producto + flotante con el mismo mensaje."
    nuevo="ProductGallery."
  />
);

export const NotaFichaB = () => (
  <Nota
    letra="Ficha · opción B · recomendada"
    nombre="Barra fija"
    lee="La foto, el nombre y una barra dorada abajo que no se va."
    resuelve={[
      "El botón del producto siempre a la mano, también mirando relacionados.",
      "Un solo WhatsApp en pantalla: en esta página la barra reemplaza al flotante.",
      "En desktop la columna de datos acompaña el scroll con el botón.",
    ]}
    sacrifica={[
      "La barra ocupa unos 77 px de la pantalla del celular todo el tiempo (más el margen de la barra de inicio del iPhone).",
      "En desktop la columna de datos queda corta al lado de la foto: es el costo de que acompañe el scroll.",
      "Layout.astro necesita una prop hideFab para la ficha.",
    ]}
    whatsapp="Uno: la barra en el celular, el botón de la columna en desktop."
    nuevo="ProductGallery. La barra son 10 líneas en la página, no un componente."
  />
);

export const NotaFichaC = () => (
  <Nota
    letra="Ficha · opción C"
    nombre="A tu gusto"
    lee="La foto, el nombre y la pregunta ¿Cómo lo quieres? con tres opciones."
    resuelve={[
      "Empuja lo que el taller hace (personalizar), no solo lo que hay.",
      "El mensaje llega con lo que el cliente quiere (con su logo, para un grupo): menos ida y vuelta.",
      "Usa Chip tal como está y cambia el mensaje con CSS (:has), sin JS.",
    ]}
    sacrifica={[
      "Un paso más antes del botón; en el celular el botón queda debajo del pliegue.",
      "Dos WhatsApp en pantalla (botón y flotante), como A.",
      "No pregunta talla ni técnica: la base no las tiene (haría falta una columna y serflow-admin).",
    ]}
    whatsapp="Botón del producto (tres mensajes posibles) + flotante genérico."
    nuevo="ProductGallery."
  />
);

export function EstadosLista() {
  return (
    <Card width={400}>
      <Kicker>Lista · estados de la opción A</Kicker>
      <Title>Página completa y bordes</Title>
      <Bullets
        items={[
          "Completa: 10 gorras, una con nombre largo (se parte en tres líneas; la fila se alinea a la card más alta).",
          "Categoría vacía: la pestaña dice 0 antes de entrar; EmptyState con salida a WhatsApp y el mensaje \"Busco algo de Camisetas, hecho por encargo\".",
          "Pestaña actual fuera de pantalla (la sexta en el celular): entra sola al cargar con scroll-initial-target; donde no exista, una línea de script (scrollIntoView). El canvas no la mueve.",
          "Datos de hoy: nombres con número y sin meta.",
          "Sin estado de carga ni de error: la página es estática; si Supabase falla, falla el build y sigue el deploy anterior. Con señal lenta, cada foto muestra la trama del marco hasta cargar.",
        ]}
      />
    </Card>
  );
}

export function EstadosFicha() {
  return (
    <Card width={400}>
      <Kicker>Ficha · estados de la opción B</Kicker>
      <Title>Página completa y bordes</Title>
      <Bullets
        items={[
          "Varias fotos (4): miniaturas y \"4 fotos\".",
          "Una foto: sin miniaturas ni etiqueta; queda el botón de ver en grande.",
          "Nombre largo y sin descripción: el h1 se parte en líneas; sin párrafo vacío.",
          "Ver en grande: popover a pantalla completa, fotos a lo ancho, X de 44 px.",
          "Señal lenta: la foto deja su marco con trama; nombre y botón se leen igual.",
          "Datos de hoy: \"Beisbol #26\", una foto, la descripción de relleno oculta.",
          "Sin relacionados (categoría con un solo producto): \"Más de X\" no se pinta.",
        ]}
      />
    </Card>
  );
}

function Burbuja({ titulo, texto }: { titulo: string; texto: string }) {
  const [linea, url] = texto.split("\n");
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[13px] font-semibold uppercase tracking-[.08em] text-muted">{titulo}</div>
      <div className="self-end rounded-[14px] rounded-tr-[4px] border border-line bg-surface-2 px-4 py-3 text-[15px] leading-relaxed">
        <p>{linea}</p>
        <p className="mt-1 break-all text-accent underline">{url}</p>
      </div>
    </div>
  );
}

export function Mensajes() {
  return (
    <Card width={520}>
      <Kicker>Lo que llega a WhatsApp</Kicker>
      <Title>El mensaje es copy: lo escribe el diseño</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        Prellenado con whatsappUrl() (encodeURIComponent). El cliente lo puede editar antes de mandarlo. WhatsApp muestra
        debajo la vista previa con la foto (og:image).
      </p>
      <Burbuja titulo="A y B, y la opción Así como está de C" texto={mensaje(CARTAGENA)} />
      <Burbuja titulo="C · Con mi logo o nombre" texto={mensajeLogo(CARTAGENA)} />
      <Burbuja titulo="C · Varias, para un grupo" texto={mensajeGrupo(CARTAGENA)} />
      <Burbuja titulo="Con los nombres de hoy" texto={mensaje(BEISBOL_26)} />
    </Card>
  );
}

/* ---------------- Pantallas: lista ---------------- */

const MTQ = CATEGORIES[0].href;
const lista = (L: typeof ListaA, viewport: Viewport, fold = true) => () => (
  <Pantalla viewport={viewport} fold={fold}>
    <L categories={CATEGORIES} current={MTQ} items={MTQ_ITEMS} />
  </Pantalla>
);

export const ListaAMobile = lista(ListaA, "mobile");
export const ListaADesktop = lista(ListaA, "desktop");
export const ListaBMobile = lista(ListaB, "mobile");
export const ListaBDesktop = lista(ListaB, "desktop");
export const ListaCMobile = lista(ListaC, "mobile");
export const ListaCDesktop = lista(ListaC, "desktop");
export const ListaAMobileCompleta = lista(ListaA, "mobile", false);
export const ListaADesktopCompleta = lista(ListaA, "desktop", false);

export const ListaAMobileVacia = () => (
  <Pantalla viewport="mobile">
    <ListaA categories={CATEGORIES_CON_VACIA} current={CAMISETAS_HREF} items={[]} />
  </Pantalla>
);
export const ListaADesktopVacia = () => (
  <Pantalla viewport="desktop">
    <ListaA categories={CATEGORIES_CON_VACIA} current={CAMISETAS_HREF} items={[]} />
  </Pantalla>
);
export const ListaAMobileHoy = () => (
  <Pantalla viewport="mobile" fold>
    <ListaA categories={CATEGORIES} current={BEISBOL_HREF} items={BEISBOL_HOY} />
  </Pantalla>
);
export const ListaBMobileSinFoto = () => (
  <Pantalla viewport="mobile" fold>
    <ListaB categories={CATEGORIES.map((c) => ({ ...c, image: undefined }))} current={MTQ} items={MTQ_ITEMS} />
  </Pantalla>
);

/* ---------------- Pantallas: ficha ---------------- */

const fichaA = (viewport: Viewport, p: Producto = PARCHE, fold = true) => () => (
  <Pantalla viewport={viewport} fold={fold} fab="producto" fabText={mensaje(p)}>
    <FichaA p={p} related={RELACIONADOS_MODA} />
  </Pantalla>
);
const fichaC = (viewport: Viewport) => () => (
  <Pantalla viewport={viewport} fold>
    <FichaC p={PARCHE} related={RELACIONADOS_MODA} />
  </Pantalla>
);
function FichaBPantalla({ viewport, p, related, fold = true, zoomOpen }: { viewport: Viewport; p: Producto; related: typeof RELACIONADOS_MODA; fold?: boolean; zoomOpen?: boolean }) {
  return (
    <Pantalla viewport={viewport} fold={fold} fab={null} bar={<BarraWhatsApp p={p} />}>
      <FichaB p={p} related={related} zoomOpen={zoomOpen} />
    </Pantalla>
  );
}

export const FichaAMobile = fichaA("mobile");
export const FichaADesktop = fichaA("desktop");
export const FichaBMobile = () => <FichaBPantalla viewport="mobile" p={PARCHE} related={RELACIONADOS_MODA} />;
export const FichaBDesktop = () => <FichaBPantalla viewport="desktop" p={PARCHE} related={RELACIONADOS_MODA} />;
export const FichaCMobile = fichaC("mobile");
export const FichaCDesktop = fichaC("desktop");

export const FichaBMobileCompleta = () => <FichaBPantalla viewport="mobile" p={PARCHE} related={RELACIONADOS_MODA} fold={false} />;
export const FichaBDesktopCompleta = () => <FichaBPantalla viewport="desktop" p={PARCHE} related={RELACIONADOS_MODA} fold={false} />;
export const FichaBMobileUnaFoto = () => <FichaBPantalla viewport="mobile" p={CARTAGENA} related={RELACIONADOS_MTQ} fold={false} />;
export const FichaBMobileNombreLargo = () => <FichaBPantalla viewport="mobile" p={TRUCKER} related={RELACIONADOS_MTQ} />;
export const FichaBMobileZoom = () => <FichaBPantalla viewport="mobile" p={PARCHE} related={RELACIONADOS_MODA} zoomOpen />;
export const FichaBMobileCargando = () => (
  <FichaBPantalla
    viewport="mobile"
    p={{ ...PARCHE, images: PARCHE.images.map((i) => ({ ...i, src: SIN_CARGAR })) }}
    related={RELACIONADOS_MODA}
  />
);
export const FichaBMobileHoy = () => <FichaBPantalla viewport="mobile" p={BEISBOL_26} related={RELACIONADOS_BEISBOL} fold={false} />;
export const FichaBDesktopUnaFoto = () => <FichaBPantalla viewport="desktop" p={CARTAGENA} related={[]} fold={false} />;
