import type { ReactNode } from "react";
import { CapaB, EstantesC, FinDeBloque, GaleriaA, GaleriaB, Pantalla, VisorPagina } from "./paginas";
import { BEISBOL, BEISBOL_340, CAMISETAS, CATS, CATS_CON_VACIA, DESCRIPCION, MODA, MTQ, SIN_CARGAR, UNA_FOTO, pedido } from "./data";

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
      <Kicker>PRI-130 · Catálogo · segunda ronda</Kicker>
      <Title>El catálogo es una galería de fotos, no fichas de producto</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        Corrección de Said: no hay descripciones y puede que ni haya nombre. El catálogo son fotos de gorras y camisetas
        que el taller tiene o puede hacer, por categoría. Así que nada depende de nombre, descripción, talla ni precio, y
        los nombres de hoy ("Beisbol #26") no se muestran.
      </p>
      <p className="text-[15px] leading-relaxed text-muted">
        Dos componentes nuevos marcados <Tag>Propuesta</Tag>: PhotoGrid (la galería) y PhotoViewer (el visor). Siguen
        CategoryNav (pestañas, ya propuesta) y lo del design system: Header, Footer, WhatsAppFab, Button, EmptyState,
        Section. Las opciones de la ronda anterior (lista y ficha) se reemplazaron; quedan en el commit d017e24.
      </p>
      <Block label="Cómo leer el canvas">
        Arriba, las decisiones que valen para todas las opciones, la recomendación y el mensaje de WhatsApp. Después, una
        fila por opción: nota (qué resuelve y qué sacrifica), galería y visor en mobile 390 y desktop 1280, cortados en
        el pliegue. Al final, los estados de la opción recomendada a página completa.
      </Block>
      <Block label="Fotos">
        Las del catálogo actual (src/assets/images), con el número que cada una tiene hoy en producción. Sin personas ni
        datos personales.
      </Block>
    </Card>
  );
}

export function Decisiones() {
  return (
    <Card width={980}>
      <Kicker>Decisiones de diseño · valen para A, B y C</Kicker>
      <Title>Lo que no cambia entre opciones</Title>
      <div className="grid grid-cols-2 gap-x-10 gap-y-6">
        <Block label="Cómo se nombra una foto">
          Categoría + número: "Béisbol · N.º 26". El número es el de hoy (legacy_id, el mismo del slug beisbol-26), así
          las URLs no cambian y ningún link viejo se rompe. Ya es único en todo el catálogo (Béisbol va del 26 al 49,
          Niños del 82 al 91): con el número solo, el taller encuentra la foto. Cada foto nueva recibe en serflow-admin
          el siguiente número; no se reutiliza ni se renumera al reordenar o borrar.
        </Block>
        <Block label="Nombre y descripción">
          La galería no muestra texto encima de las fotos. El visor muestra la descripción solo si el admin escribió una
          de verdad (la frase de relleno de hoy cuenta como vacía): bajo el título, hasta dos líneas en el celular para
          que el botón no se vaya del pliegue. El nombre no sale en ninguna parte. alt = "Béisbol, foto N.º 26"; en el
          visor, la descripción si existe.
        </Block>
        <Block label="WhatsApp">
          El flotante en la galería y en los estantes. En el visor, "Pedir esta por WhatsApp" con categoría, número y
          link (ver "Lo que llega a WhatsApp"); ahí el flotante se oculta para no tener dos. Header, Footer y la galería
          vacía sin WhatsApp propio (la vacía señala el flotante). Precio nunca, aunque products.price tenga valor.
        </Block>
        <Block label="Moverse entre fotos">
          Flechas de 44 px a los lados de la foto: links a la anterior y la siguiente, funcionan sin JS. Con ~15 líneas
          de script: deslizar con el dedo y ← → en el teclado. Cambiar de foto reemplaza el historial, así Atrás vuelve a
          la galería y no foto por foto. En la primera foto no hay flecha atrás; en la última, no hay siguiente.
        </Block>
        <Block label="Moverse entre categorías">
          CategoryNav arriba de la galería: links con el conteo de fotos, una fila que se desliza en el celular, la
          actual en dorado. Desde el visor, "← Béisbol" vuelve a la galería en la misma foto (#f-26), también si llegó
          por un link de WhatsApp o de Google; si la foto está después de la 60, vuelve a su bloque (/p/2#f-...).
        </Block>
        <Block label="Cientos de fotos y señal lenta">
          El HTML trae bloques de 60. Miniaturas de 320 px en WebP (~12 KB), lazy salvo las primeras 9, con tamaño fijo
          (no salta nada) y la trama del marco mientras cargan. Al final del bloque, "Ver 60 más": link a la página
          estática siguiente (/products/beisbol/p/2), sin JS; con JS agrega las fotos ahí mismo y guarda en history.state
          cuántos bloques hay, así Atrás desde el visor los vuelve a poner y cae en la foto. Sin scroll infinito: el footer
          se alcanza y el cliente decide cuándo gastar datos.
        </Block>
        <Block label="Movimiento (todo CSS)">
          Costura dorada en el título (stitch-title). Las fotos se destapan al entrar (reveal-wipe, como ProductCard); con
          el mouse, un borde gris (sin scale: está en la deuda de cards). Al abrir el visor, la foto crece desde su cuadro
          (view-transition-name con el ClientRouter que ya existe). Todo apagado con reducir movimiento y con la clase
          slow-connection de global.css; al implementar, sumarle .slow-connection::view-transition-group(*), -old(*) y
          -new(*), que hoy no cubre.
        </Block>
        <Block label="SEO y lo que no sale">
          Cada foto con visor propio tiene título "Béisbol N.º 26 · Serflow", og:image (la vista previa de WhatsApp) y
          JSON-LD ImageObject en vez de Product (sin precio $0). Sin dirección ni horario, sin mascota, sin el hilo de la
          portada. Labels "Béisbol" y "Básquet" como los escribe Said (en la base: Beisbol, Basketball).
        </Block>
      </div>
    </Card>
  );
}

export function Recomendacion() {
  return (
    <Card width={560}>
      <Kicker>Recomendación de Diseño</Kicker>
      <Title>A · Muro con visor en página propia</Title>
      <p className="text-[15px] leading-relaxed">
        <strong>Galería de 3 columnas</strong>: en el celular se ven 12 fotos antes del pliegue (B, 6). Para un
        catálogo que puede llegar a cientos de fotos, recorrer rápido importa más que el tamaño: la foto grande está a un
        toque.
      </p>
      <p className="text-[15px] leading-relaxed">
        <strong>Visor como página</strong>, no como capa: cada foto tiene link propio, así que el mensaje de WhatsApp
        abre exactamente esa foto, Google la indexa y la vista previa de WhatsApp la muestra. Atrás del celular hace lo
        que el cliente espera. Funciona sin JS. La capa de B se siente más rápida, pero Atrás en Android saca de la
        galería si no se programa aparte, y la capa igual necesitaría una página por foto para el link.
      </p>
      <p className="text-[15px] leading-relaxed">
        <strong>Estantes (C)</strong> sirven el día que haya 10 o más categorías; con 5, las pestañas ya dicen todo y C
        agrega un paso antes de ver la categoría completa.
      </p>
      <Block label="Qué necesito de Said">
        <Bullets
          items={[
            "Elegir A, B o C.",
            "Número de foto = el de hoy (legacy_id, ya en el slug, único en todo el catálogo); serflow-admin asigna el siguiente a las nuevas. ¿De acuerdo? Toca serflow-admin.",
            "Links de fotos borradas: una regla en netlify.toml que manda a la galería con aviso, en vez de la 404. Es zona sensible (pasa por Seguridad).",
            "Renombrar en serflow-admin \"Beisbol\" y \"Basketball\" a Béisbol y Básquet, si te gustan así.",
            "Sigue pendiente de la ronda anterior: sumar \"Catálogo\" al Header. Recomiendo que sí.",
          ]}
        />
      </Block>
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
      <Title>Identifica la foto sin nombre</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        Prellenado con whatsappUrl() (encodeURIComponent); el cliente lo puede editar antes de mandarlo. Categoría +
        número para hablar ("la 26 de béisbol") y el link al visor, que WhatsApp muestra con la foto (og:image). El
        taller abre el link y ve la foto exacta.
      </p>
      <Burbuja titulo="Desde el visor (A, B y C)" texto={pedido(BEISBOL, BEISBOL.photos[11])} />
      <Burbuja titulo="Otra categoría" texto={pedido(MTQ, MTQ.photos[5])} />
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

export const SeccionOpciones = () => (
  <Seccion n="1" title="Tres opciones: galería y visor">
    /products/[category] y /products/[category]/[id] · cada fila: nota, galería y visor en 390 y 1280, cortados en el pliegue
  </Seccion>
);
export const SeccionEstados = () => (
  <Seccion n="2" title="Estados de A (recomendada)">
    Páginas completas, categoría vacía, señal lenta, cientos de fotos, primera foto, foto con descripción
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

export const NotaA = () => (
  <Nota
    letra="Opción A · recomendada"
    nombre="Muro + visor en página"
    lee="Muchas fotos de la categoría; tocar una la abre en grande con su botón."
    resuelve={[
      "12 fotos enteras antes del pliegue en el celular (3 columnas) y 12 en desktop (6), con la fila siguiente asomada.",
      "Cada foto tiene URL propia: el link de WhatsApp abre esa foto, Google la indexa, la vista previa la muestra.",
      "Atrás vuelve a la galería en la misma foto. Todo funciona sin JS.",
      "El visor trae \"Más de Béisbol\" debajo: se sigue mirando sin volver.",
    ]}
    sacrifica={[
      "Las miniaturas son chicas (127 px en el celular): el detalle se ve en el visor.",
      "Pasar de foto carga una página (~1 foto); con mala señal tarda lo que tarda esa foto, con la miniatura de fondo mientras.",
    ]}
    whatsapp="Flotante en la galería; en el visor, el botón de la foto (sin flotante)."
    nuevo="PhotoGrid (dense) y PhotoViewer (page)."
  />
);

export const NotaB = () => (
  <Nota
    letra="Opción B"
    nombre="Fotos grandes + visor encima"
    lee="Fotos grandes de dos en dos; tocar una abre una capa negra para pasar de foto deslizando."
    resuelve={[
      "La galería se ve mejor: las fotos ya son grandes (173 px en el celular).",
      "Pasar de foto en la capa es inmediato: no carga página.",
      "Cerrar la capa deja la galería donde estaba.",
    ]}
    sacrifica={[
      "6 fotos antes del pliegue en el celular, la mitad que A: con cientos es mucho scroll.",
      "Abrir en la foto tocada, deslizar y cerrar necesitan JS (~40 líneas); Atrás en Android sale de la página si no se programa.",
      "Para compartir y para Google igual hace falta una página por foto: son dos visores que mantener.",
    ]}
    whatsapp="Flotante en la galería; en la capa, el botón de la foto (la capa tapa el flotante)."
    nuevo="PhotoGrid (comfy) y PhotoViewer (layer)."
  />
);

export const NotaC = () => (
  <Nota
    letra="Opción C"
    nombre="Estantes por categoría"
    lee="Todas las categorías en una página, una fila de fotos cada una."
    resuelve={[
      "Se ve de un vistazo todo lo que hay; quien llega a una categoría descubre las otras.",
      "Sirve como portada del catálogo (/products) cuando haya muchas categorías.",
    ]}
    sacrifica={[
      "Un paso más: para ver una categoría entera hay que tocar \"Ver las N\" (y se llega a la galería de A).",
      "30 miniaturas en la primera página, aunque lazy.",
      "Con 5 categorías, las pestañas de A ya dicen lo mismo.",
    ]}
    whatsapp="Flotante. El visor es el de A."
    nuevo="PhotoShelf (estante), además de PhotoGrid y PhotoViewer de A."
  />
);

export function EstadosA() {
  return (
    <Card width={400}>
      <Kicker>Opción A · estados</Kicker>
      <Title>Páginas completas y bordes</Title>
      <Bullets
        items={[
          "Galería completa: Mi Tierra Querida, 25 fotos, en 390 y 1280.",
          "Señal lenta: las fotos que no han llegado muestran la trama del marco; el resto de la página se lee y se toca igual.",
          "Categoría vacía: la pestaña dice 0 antes de entrar; EmptyState sin WhatsApp propio (señala el flotante) y salida a otra categoría.",
          "Cientos (340 en Béisbol): cierre del primer bloque con \"Ver 60 más\", cargando y sin señal (aviso propio y no ErrorState, que trae su WhatsApp; cuando se toque src/, una opción de ErrorState sin WhatsApp lo reemplaza).",
          "Visor completo con \"Más de Béisbol\" y footer.",
          "Primera foto: sin flecha atrás.",
          "Con descripción real: una línea bajo el título.",
          "Foto grande llegando: se ve la miniatura (fondo del marco, ~12 KB) hasta que la grande la tapa; el botón ya funciona. Si la grande no llega, queda la miniatura.",
          "Foto después de la 60: \"← Béisbol\" vuelve a su bloque. La página del bloque dice \"Fotos 61 a 120 de 340\" y tiene \"← Ver las anteriores\".",
          "Categoría con una foto: \"1 foto\" en singular; el visor sin flechas ni \"Más de\".",
          "Link viejo a una foto borrada: la galería de su categoría con un aviso arriba, no la 404.",
          "Sin estado de error de página: es estática; si Supabase falla, falla el build y sigue el deploy anterior.",
        ]}
      />
    </Card>
  );
}

/* ---------------- Pantallas ---------------- */

const lenta = { ...MTQ, photos: MTQ.photos.map((p, i) => (i < 4 || i === 7 ? p : { ...p, src: SIN_CARGAR, thumb: SIN_CARGAR })) };
const bloque = BEISBOL_340.photos.slice(51, 60);
const MORE = { href: "/products/beisbol/p/2", shown: 60, total: 340 };

// Opción A
export const GaleriaAMobile = () => (
  <Pantalla viewport="mobile" fold>
    <GaleriaA c={MTQ} cats={CATS} />
  </Pantalla>
);
export const GaleriaADesktop = () => (
  <Pantalla viewport="desktop" fold>
    <GaleriaA c={MTQ} cats={CATS} />
  </Pantalla>
);
export const VisorAMobile = () => (
  <Pantalla viewport="mobile" fold fab={false}>
    <VisorPagina c={BEISBOL} i={11} />
  </Pantalla>
);
export const VisorADesktop = () => (
  <Pantalla viewport="desktop" fold fab={false}>
    <VisorPagina c={BEISBOL} i={11} />
  </Pantalla>
);

// Opción B
export const GaleriaBMobile = () => (
  <Pantalla viewport="mobile" fold>
    <GaleriaB c={MTQ} cats={CATS} />
  </Pantalla>
);
export const GaleriaBDesktop = () => (
  <Pantalla viewport="desktop" fold>
    <GaleriaB c={MTQ} cats={CATS} />
  </Pantalla>
);
export const CapaBMobile = () => (
  <Pantalla viewport="mobile" fold fab={false}>
    <CapaB c={BEISBOL} cats={CATS} i={11} />
  </Pantalla>
);
export const CapaBDesktop = () => (
  <Pantalla viewport="desktop" fold fab={false}>
    <CapaB c={BEISBOL} cats={CATS} i={11} />
  </Pantalla>
);

// Opción C
export const EstantesCMobile = () => (
  <Pantalla viewport="mobile" fold>
    <EstantesC cats={CATS} />
  </Pantalla>
);
export const EstantesCDesktop = () => (
  <Pantalla viewport="desktop" fold>
    <EstantesC cats={CATS} />
  </Pantalla>
);

// Estados de A
export const GaleriaAMobileCompleta = () => (
  <Pantalla viewport="mobile">
    <GaleriaA c={MTQ} cats={CATS} />
  </Pantalla>
);
export const GaleriaADesktopCompleta = () => (
  <Pantalla viewport="desktop">
    <GaleriaA c={MTQ} cats={CATS} />
  </Pantalla>
);
export const GaleriaAMobileLenta = () => (
  <Pantalla viewport="mobile" fold>
    <GaleriaA c={lenta} cats={CATS} />
  </Pantalla>
);
export const GaleriaAMobileVacia = () => (
  <Pantalla viewport="mobile" fold>
    <GaleriaA c={CAMISETAS} cats={CATS_CON_VACIA} />
  </Pantalla>
);
export const GaleriaAMobileCientos = () => (
  <Pantalla viewport="mobile" header={false}>
    <FinDeBloque photos={bloque} arriba={51} more={MORE} />
  </Pantalla>
);
export const GaleriaAMobileCargandoMas = () => (
  <Pantalla viewport="mobile" header={false}>
    <FinDeBloque
      arriba={51}
      photos={[...bloque, ...BEISBOL_340.photos.slice(60, 66).map((p) => ({ ...p, src: SIN_CARGAR, thumb: SIN_CARGAR }))]}
      more={{ ...MORE, state: "loading" }}
    />
  </Pantalla>
);
export const GaleriaAMobileSinSenal = () => (
  <Pantalla viewport="mobile" header={false}>
    <FinDeBloque photos={bloque} arriba={51} more={{ ...MORE, state: "error" }} />
  </Pantalla>
);
export const VisorAMobileCompleta = () => (
  <Pantalla viewport="mobile" fab={false}>
    <VisorPagina c={BEISBOL} i={11} />
  </Pantalla>
);
export const VisorAMobilePrimera = () => (
  <Pantalla viewport="mobile" fold fab={false}>
    <VisorPagina c={MODA} i={0} />
  </Pantalla>
);
export const VisorAMobileDescripcion = () => (
  <Pantalla viewport="mobile" fold fab={false}>
    <VisorPagina c={MTQ} i={5} description={DESCRIPCION} />
  </Pantalla>
);
export const VisorAMobileCargando = () => (
  <Pantalla viewport="mobile" fold fab={false}>
    <VisorPagina c={{ ...BEISBOL, photos: BEISBOL.photos.map((p, i) => (i === 11 ? { ...p, src: SIN_CARGAR } : p)) }} i={11} />
  </Pantalla>
);
export const VisorADesktopCompleta = () => (
  <Pantalla viewport="desktop" fab={false}>
    <VisorPagina c={MTQ} i={5} description={DESCRIPCION} />
  </Pantalla>
);
export const GaleriaAMobileFotoQuitada = () => (
  <Pantalla viewport="mobile" fold>
    <GaleriaA c={BEISBOL} cats={CATS} quitada />
  </Pantalla>
);
export const VisorAMobileUnaFoto = () => (
  <Pantalla viewport="mobile" fab={false}>
    <VisorPagina c={UNA_FOTO} i={0} />
  </Pantalla>
);
export const GaleriaAMobileBloque2 = () => (
  <Pantalla viewport="mobile" fold>
    <GaleriaA
      c={BEISBOL_340}
      cats={CATS.map((c) => (c.slug === BEISBOL_340.slug ? BEISBOL_340 : c))}
      photos={BEISBOL_340.photos.slice(60, 120)}
      bloque={{ desde: 61, hasta: 120, anterior: BEISBOL_340.href }}
      more={{ href: "/products/beisbol/p/3", shown: 120, total: 340 }}
    />
  </Pantalla>
);
export const GaleriaAMobileUnaFoto = () => (
  <Pantalla viewport="mobile" fold>
    <GaleriaA c={UNA_FOTO} cats={[...CATS, UNA_FOTO]} />
  </Pantalla>
);
