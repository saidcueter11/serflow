import { useState, type ReactNode } from "react";
import { PaginaA } from "./ideaA";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { PaginaB } from "./ideaB";
import { PaginaC } from "./ideaC";
import { Hoja, WA_IDEA } from "./comun";
import { Section } from "../../../../src/components/ui/Section";

/* ---------------- Narración del canvas PRI-286 (no es producto) ---------------- */

function Card({ width, children, destacada = false }: { width: number; children: ReactNode; destacada?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-5 rounded-card border bg-surface p-8 font-body text-ink antialiased ${destacada ? "border-accent" : "border-line"}`}
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

export function Intro() {
  return (
    <Card width={620}>
      <Kicker>PRI-286 · Portada nueva · 23 oct</Kicker>
      <Title>Tres portadas desde cero, con el personalizador al frente</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        Said pidió un rediseño libre de la portada con tres ideas nuevas. Reemplaza las opciones A/B/C de portada-v3-motion (la B queda descartada). Las tres
        parten de una hoja en blanco: cambian el layout, la jerarquía, el tono, la tipografía y el movimiento, no solo el orden de las secciones.
      </p>
      <Block label="Cómo leer el canvas">
        <Bullets
          items={[
            "Fila de arriba: esta intro, el tablero de inspiración (solo links y lo que tomé de cada uno) y la lámina que compara las tres en el celular, con mi recomendación.",
            "Debajo, una columna por idea: la nota (inspiración, qué resuelve, qué sacrifica, qué cambia del design system), la página completa en celular (390) y la demo de movimiento con Repetir y Reducir movimiento.",
            "Abajo del todo, las tres páginas completas en escritorio (1280).",
            "La línea verde punteada marca el fin de la primera pantalla: 844 px en celular, 800 en escritorio. Lo que está arriba de ella es lo que la gente ve sin hacer scroll.",
          ]}
        />
      </Block>
      <Block label="Lo que resuelven las tres">
        <Bullets
          items={[
            "El personalizador es lo primero que se ve, con la vista previa de la prenda y el botón Diseñar mi prenda (lleva a /personaliza, PRI-122).",
            "El resultado se muestra con fotos reales: stock de src/assets/images/stock y fotos del catálogo que ya están en el repo. Nada sale de Supabase, así que no aparecen datos personales. El copy no presenta el stock como trabajo del taller (Así puede quedar la tuya, Ideas para la tuya); se cambia por fotos del taller cuando el admin pueda subirlas (PRI-150).",
            "PromoBar de producción arriba, solo si hay promos activas (el canvas la muestra con dos). El catálogo nuevo (/products, PRI-130) entra al menú y tiene su sección.",
            "WhatsApp: el flotante (en C se funde con el dock) más uno contextual, ¿Mejor nos cuentas tu idea?, para quien no tiene diseño.",
            "Dirección y horario salen una sola vez: en la MapCard cerrada, al final. El iframe de Google ya no se descarga si nadie lo abre.",
            "Sin mascota. Movimiento solo con CSS, apagado con Reducir movimiento, sin JS nuevo.",
          ]}
        />
      </Block>
      <Block label="Dependencias">
        <Bullets
          items={[
            "El personalizador sale escondido hasta tener las fotos oficiales (PRI-125); la portada nueva se publica junto con él.",
            "El catálogo nuevo (/products) vive en feat/PRI-130-catalogo, sin mergear todavía.",
            "La prenda de la vista previa es una silueta SVG: las fotos de camiseta que hay hoy son primeros planos de tela y no se leen como camiseta. Cuando lleguen las oficiales (PRI-125), la vista previa usa la misma foto que el personalizador.",
            "Las ideas son propuestas en el canvas. La elegida se construye en src/components/ui con su defineAsset; este run no toca src/.",
          ]}
        />
      </Block>
    </Card>
  );
}

/* ---------------- Inspiración ---------------- */

const REFS = [
  {
    nombre: "Outfit, de ++hellohello",
    url: "https://outfit.hellohello.is/",
    fuente: "Awwwards Site of the Day, 11 mayo 2026 (awwwards.com/sites/outfit)",
    toma: "La prenda reacciona cuando la tocas: hover y animaciones cortas que hacen sentir la tienda viva sin estorbar la compra.",
    sirve: "Idea A: la vista previa que se estampa sola. Idea C: fotos que se acomodan al hacer scroll. Lo hacemos con CSS, no con GSAP.",
  },
  {
    nombre: "KidSuper World, de basement.studio",
    url: "https://basement.studio/showcase/kidsuper-breaking-the-norm",
    fuente: "Awwwards y FWA Site of the Day, Webby 2024",
    toma: "La tienda es el taller: recorres el estudio de la marca en vez de una grilla de productos.",
    sirve: "El taller del Mercado Bazurto es lo que nos diferencia de una tienda de internet. Lo tomo en el tono (A y B), no en 3D: pesaría demasiado con mala señal.",
  },
  {
    nombre: "Brain Dead",
    url: "https://wearebraindead.com/",
    fuente: "Marca de streetwear, sitio actual (temporada FW26)",
    toma: "Banner de promo encima del menú, títulos en mayúscula cortos y una grilla tipo lookbook que manda sobre el texto.",
    sirve: "Idea B: titulares de afiche y la barra de promos como parte del lenguaje. Idea C: el lookbook a pantalla completa.",
  },
  {
    nombre: "Printful · Gorros bordados personalizados (en español)",
    url: "https://www.printful.com/es/gorros-personalizados",
    fuente: "Página de producto de personalización",
    toma: "Tres pasos clarísimos (Elige tu gorro, Ponle tu diseño, Pídelo y estrena) y el plazo de entrega a la vista.",
    sirve: "Las tres ideas llevan los tres pasos al lado del botón. B suma el aviso de qué pasa después: te llega por WhatsApp y te respondemos con el precio.",
  },
  {
    nombre: "Nike By You",
    url: "https://www.nike.com/nike-by-you",
    fuente: "Landing del personalizador de Nike",
    toma: "El personalizador tiene su propia entrada con pasos (elige el modelo, empieza a personalizar) y todo lleva a la misma herramienta.",
    sirve: "Un solo destino: todos los botones de diseño van a /personaliza. Por eso el menú nuevo abre con Diseña la tuya.",
  },
  {
    nombre: "Custom Ink",
    url: "https://www.customink.com/",
    fuente: "Tienda de prendas personalizadas, EE. UU.",
    toma: "Prendas con un recuadro de Tu diseño aquí en vez de un diseño cualquiera: muestra la promesa sin explicarla.",
    sirve: "El recuadro punteado dorado sobre la camiseta, en las tres ideas. Le dice al cliente dónde va lo suyo.",
  },
  {
    nombre: "Vans Customs",
    url: "https://www.vans.com/en-us/p/shoes/icons/authentic-5310/customs-authentic-shoe-VN0A3CS0022",
    fuente: "Personalizador de Vans",
    toma: "Subes tu arte o tu foto y lo ves en el producto; el tiempo de entrega está al lado del botón.",
    sirve: "Confirma que el gancho es ver lo tuyo puesto. La vista previa de las tres ideas usa el mismo diseño de ejemplo que el personalizador.",
  },
];

export function Inspiracion() {
  return (
    <div className="flex w-[1280px] flex-col gap-6 rounded-card border border-line bg-surface p-8 font-body text-ink antialiased">
      <div className="flex items-end justify-between gap-6">
        <div>
          <Kicker>Inspiración</Kicker>
          <h2 className="mt-2 font-display text-[28px] font-bold leading-tight">7 referencias reales y qué tomé de cada una</h2>
        </div>
        <p className="max-w-[440px] text-[14px] leading-relaxed text-muted">
          Solo links y descripción: el repo es público y no subo capturas de sitios ajenos. Revisadas el 23 de octubre de 2026.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4 [&>*:nth-child(7)]:col-span-2">
        {REFS.map((r, i) => (
          <article key={r.url} className="flex flex-col gap-3 rounded-tile border border-line bg-primary p-5">
            <span className="font-display text-[22px] font-medium leading-none text-accent">0{i + 1}</span>
            <h3 className="text-[16px] font-bold leading-snug">{r.nombre}</h3>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="break-all text-[13px] text-accent underline underline-offset-2">
              {r.url.replace("https://", "")}
            </a>
            <p className="text-[12px] text-muted">{r.fuente}</p>
            <div className="text-[14px] leading-relaxed">
              <span className="font-semibold">Qué tomo: </span>
              {r.toma}
            </div>
            <div className="text-[14px] leading-relaxed text-muted">
              <span className="font-semibold text-ink">Por qué sirve: </span>
              {r.sirve}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Notas por idea ---------------- */

function Nota({
  letra,
  nombre,
  linea,
  inspiracion,
  resuelve,
  sacrifica,
  movimiento,
  ds,
  destacada = false,
}: {
  letra: string;
  nombre: string;
  linea: string;
  inspiracion: string;
  resuelve: ReactNode[];
  sacrifica: ReactNode[];
  movimiento: ReactNode[];
  ds: ReactNode[];
  destacada?: boolean;
}) {
  return (
    <Card width={850} destacada={destacada}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-accent font-display text-[20px] font-bold text-primary">{letra}</span>
        <Kicker>{destacada ? "Idea " + letra + " · la que recomiendo" : "Idea " + letra}</Kicker>
      </div>
      <Title>{nombre}</Title>
      <p className="text-[16px] leading-relaxed text-muted">{linea}</p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <Block label="Inspiración">{inspiracion}</Block>
        <Block label="Qué resuelve">
          <Bullets items={resuelve} />
        </Block>
        <Block label="Qué sacrifica">
          <Bullets items={sacrifica} />
        </Block>
        <Block label="Movimiento (PRI-287)">
          <Bullets items={movimiento} />
        </Block>
      </div>
      <Block label="Cambios al design system que propone">
        <Bullets items={ds} />
      </Block>
    </Card>
  );
}

export function NotaA() {
  return (
    <Nota
      letra="A"
      nombre="Taller en vivo"
      destacada
      linea="Dentro de la marca (Noche caribe, dorado, Space Grotesk). El hero es la vista previa del personalizador estampándose sola: el rasero baja, aparece el diseño y la camiseta cambia de negra a blanca. Debajo, el resultado en fotos y el catálogo."
      inspiracion="Outfit (la prenda que reacciona), Custom Ink (Tu diseño aquí), Printful (tres pasos)."
      resuelve={[
        "En el celular se ven el título, la vista previa, Diseñar mi prenda y qué pasa después (gratis, te respondemos por WhatsApp con el precio) sin hacer scroll. Los tres pasos se ven en escritorio.",
        "Muestra qué hace el personalizador en vez de explicarlo.",
        "Estados dibujados: sin promos (la barra no sale) y sin prendas listas para llevar (EmptyState con salida a WhatsApp).",
        "Reutiliza casi todo lo de producción: Header, PromoBar, Ticker, Section, ProductCard, ServiceCard, MapCard, Footer.",
      ]}
      sacrifica={[
        "El carrusel de fotos del hero desaparece: las fotos bajan a Así puede quedar la tuya.",
        "Es la menos sorprendente de las tres: se parece a la marca de hoy.",
      ]}
      movimiento={[
        "Estampado en bucle de 7 s, 3 veces, y se queda con el diseño puesto. Solo clip-path, top y opacity.",
        "Entrada escalonada del título (anim-enter) y reveal-up en las fotos, que ya existen.",
        "Reducir movimiento: la camiseta negra con el diseño puesto, quieta.",
        "Peso: 0 KB de JS. La prenda es un SVG de 1 KB y el cambio de color no pide otra foto.",
      ]}
      ds={[
        "Nuevo componente TallerVivo (vista previa animada) en src/components/ui, sin lógica: prenda, diseño y colores por props. Los chips Camiseta/Gorra son dibujo: toda la tarjeta es un solo link a /personaliza.",
        "WorkCard: variante mosaico (solo foto, técnica en una píldora sobre la foto) para Así puede quedar la tuya. Hoy WorkCard es foto 4:5 con el texto debajo.",
        "Button: variante primary (dorado sin ícono de WhatsApp). Hoy se usa whatsapp con icon={null}.",
        "NAV_LINKS del Header: Diseña la tuya, Catálogo, Promos, Visítanos (es dato, no cambia el componente).",
      ]}
    />
  );
}

export function NotaB() {
  return (
    <Nota
      letra="B"
      nombre="Orden de trabajo"
      linea="Evolución: papel claro, tinta negra y el dorado como resaltador. Titular de afiche en Archivo condensada. El personalizador se presenta como la orden que llena el taller: prenda, lado, diseño y color, con sello de visto bueno."
      inspiracion="Brain Dead (afiche y promo como lenguaje), KidSuper World (la tienda es el taller), Printful (qué pasa después de pedir)."
      resuelve={[
        "Es la que más se diferencia de cualquier tienda: suena a taller de barrio, no a plantilla.",
        "La orden explica el proceso y el precio (gratis, te respondemos por WhatsApp) sin un bloque de texto aparte.",
        "Fondo claro: las fotos de prendas oscuras resaltan más.",
      ]}
      sacrifica={[
        "Rompe con Noche caribe: el fondo de hoy pasa a ser la tinta. Cambia todo el sitio, no solo la portada.",
        "El logo dorado no se lee sobre papel: pide una versión en una tinta.",
        "Una fuente más que descargar (Archivo, peso por medir). La vista previa es más chica que en A y C.",
      ]}
      movimiento={[
        "La orden sale de la impresora al cargar (transform), el sello cae a los 1,3 s y el resaltador pinta tu prenda.",
        "Las fotos se pegan al entrar en pantalla, con view(); sin soporte se ven quietas.",
        "Reducir movimiento: todo en su lugar desde el inicio. 0 KB de JS.",
      ]}
      ds={[
        "Tokens nuevos: --paper, --paper-2, --ticket, --ink-strong, --ink-soft, --tinta-roja y --font-poster (Archivo).",
        "Tema claro del Header (borde de tinta, botón Menú con texto) y logo en una tinta (archivo nuevo).",
        "Componentes nuevos: OrdenDeTrabajo, FotoPegada y la lista tipo tablero para el catálogo.",
        "MapCard y Footer se quedan oscuros como bloque de cierre.",
      ]}
    />
  );
}

export function NotaC() {
  return (
    <Nota
      letra="C"
      nombre="Vitrina"
      linea="Evolución: fotos a sangre y titulares en serif itálica (Instrument Serif), con una noche más profunda. En el celular, capítulos de foto a pantalla completa y un dock fijo con el personalizador. En escritorio, la primera pantalla se parte en dos: foto a la izquierda, personalizador a la derecha."
      inspiracion="Brain Dead (lookbook que manda sobre el texto), Outfit (fotos que se acomodan con el scroll), Nike By You (un solo destino)."
      resuelve={[
        "La más emocional: el trabajo terminado ocupa la pantalla entera.",
        "En el celular el personalizador nunca se va (dock fijo); en escritorio ocupa media primera pantalla.",
        "El dock une Diseña la tuya y WhatsApp en un solo lugar: no hay dos botones flotando. El link contextual va en Ahora la tuya; en escritorio, flotante más link bajo el botón.",
      ]}
      sacrifica={[
        "En el celular, la vista previa grande aparece recién abajo (Ahora la tuya); arriba solo está su miniatura en el dock.",
        "La foto del hero es la imagen más pesada de las tres ideas; con mala señal tarda más en verse.",
        "Pide fotos buenas de verdad: con fotos flojas del cliente se cae la idea.",
      ]}
      movimiento={[
        "Al cargar: la foto se acerca despacio, las palabras del titular suben una por una y el dock entra a 1 s.",
        "Con scroll (view()): cada capítulo se acomoda y el diseño aterriza en la camiseta de Ahora la tuya.",
        "Reducir movimiento: todo quieto y visible. 0 KB de JS; el dock fijo es position: fixed.",
      ]}
      ds={[
        "Fuente nueva: Instrument Serif itálica para titulares (Space Grotesk sigue en botones y texto).",
        "Token --noche, un paso más oscuro que --color-primary.",
        "Header transparente sobre foto (con degradado para que el logo se lea), Dock del personalizador y WhatsAppFab dentro del dock (variante nueva, solo celular).",
        "Componentes nuevos: Capitulo (foto a pantalla completa) y la fila de vitrina.",
      ]}
    />
  );
}

/* ---------------- Rótulos ---------------- */

export function Rotulo({ children }: { children: ReactNode }) {
  return <div className="w-[1200px] font-display text-[40px] font-bold leading-none text-ink">{children}</div>;
}
export const RotuloCelular = () => <Rotulo>Las tres ideas en celular (390 px), página completa</Rotulo>;
export const RotuloEscritorio = () => <Rotulo>Las tres ideas en escritorio (1280 px), página completa</Rotulo>;

/* ---------------- Demos de movimiento ---------------- */

function Demo({ letra, que, children }: { letra: string; que: string; children: ReactNode }) {
  const [vuelta, setVuelta] = useState(0);
  const [reducir, setReducir] = useState(false);
  return (
    <div className="flex w-[440px] flex-col gap-3 rounded-card border border-line bg-surface p-5 font-body text-ink antialiased">
      <div className="flex flex-col gap-3">
        <span className="text-[16px] font-bold">Movimiento · idea {letra}</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => setVuelta((v) => v + 1)} className="min-h-11 rounded-full border border-line px-4 text-[13px] font-semibold hover:border-muted">
            Repetir
          </button>
          <button
            type="button"
            aria-pressed={reducir}
            onClick={() => setReducir((r) => !r)}
            className={`min-h-11 rounded-full px-4 text-[13px] font-semibold ${reducir ? "bg-accent text-primary" : "border border-line"}`}
          >
            Reducir movimiento
          </button>
        </div>
      </div>
      <p className="text-[13px] leading-relaxed text-muted">{que} Haz scroll dentro del teléfono para ver lo que se mueve al bajar.</p>
      <div key={vuelta} className={`h-[844px] w-[400px] self-center overflow-y-auto overflow-x-hidden rounded-tile border border-line ${reducir ? "reducir" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export const DemoA = () => (
  <Demo letra="A" que="El rasero baja y estampa el sol; la camiseta pasa a blanca y vuelve. Tres vueltas y se queda quieta con el diseño puesto.">
    <Hoja width={390} fold={844} className="bg-primary text-ink">
      <PaginaA />
    </Hoja>
  </Demo>
);
export const DemoB = () => (
  <Demo letra="B" que="La orden sale de la impresora, cae el sello de visto bueno y el resaltador pinta tu prenda. Una sola vez, al cargar.">
    <Hoja width={390} fold={844} className="idea-b">
      <PaginaB />
    </Hoja>
  </Demo>
);
export const DemoC = () => (
  <Demo letra="C" que="La foto se acerca despacio, el titular sube palabra por palabra y el dock del personalizador entra desde abajo.">
    <Hoja width={390} fold={844} className="idea-c" fab={false}>
      <PaginaC />
    </Hoja>
  </Demo>
);

/* ---------------- Comparación ---------------- */

const FILAS: [string, string, string, string][] = [
  ["Personalizador arriba del pliegue", "Vista previa grande + botón", "La orden completa + botón", "Miniatura en el dock + botón"],
  ["Resultado (fotos reales)", "Así puede quedar la tuya, debajo", "Ideas para la tuya, debajo", "La foto es la portada"],
  ["Catálogo", "Menú + Listo para llevar", "Menú + Lo que hay hoy", "Menú + En vitrina"],
  ["WhatsApp", "Flotante + Cuéntanos tu idea", "Flotante + Cuéntanos la idea", "Dentro del dock + link en Ahora la tuya"],
  ["Mapa", "Cerrado, al final", "Cerrado, en el bloque oscuro final", "Cerrado, al final"],
  ["Design system", "Sin tokens nuevos; 1 componente", "Tema claro, 7 tokens, 1 fuente", "1 fuente, 1 token, dock"],
  ["Peso extra", "Nada (la prenda es SVG)", "1 fuente", "1 fuente + foto de hero más grande"],
  ["Cuánto cuesta construirla", "Poco: reusa casi todo", "Mucho: cambia el sitio entero", "Medio: portada nueva, resto igual"],
];

function PrimeraPantalla({ children }: { children: ReactNode }) {
  return (
    <div className="h-[675px] w-[312px] overflow-hidden rounded-tile border border-line">
      <div className="origin-top-left scale-[.8]">{children}</div>
    </div>
  );
}

export function Comparacion() {
  return (
    <div className="flex w-[1520px] flex-col gap-6 rounded-card border border-accent bg-surface p-8 font-body text-ink antialiased">
      <div>
        <Kicker>Comparación · celular, primera pantalla</Kicker>
        <h2 className="mt-2 font-display text-[28px] font-bold leading-tight">Las tres, lado a lado, como las ve alguien que entra desde el celular</h2>
      </div>
      <div className="grid grid-cols-[1fr_312px_312px_312px] gap-6">
        <div className="flex flex-col justify-start gap-3 self-start rounded-tile border border-accent bg-primary p-5">
          <Kicker>Recomiendo A · Taller en vivo</Kicker>
          <p className="text-[15px] leading-relaxed">
            Es la única que pone la vista previa grande arriba del pliegue y además la muestra funcionando: el cliente entiende el personalizador antes de leer nada.
          </p>
          <p className="text-[15px] leading-relaxed text-muted">
            No toca tokens ni fuentes, reutiliza casi todo y es la más liviana, así que sale con el personalizador (PRI-125) sin esperar un cambio de marca.
          </p>
          <p className="text-[15px] leading-relaxed text-muted">
            Ya tomé de B el aviso &quot;Gratis. Te llega por WhatsApp y te respondemos con el precio.&quot; bajo el botón. De C me llevaría el dock para cuando el
            hero ya salió de la pantalla.
          </p>
        </div>
        {[
          ["A · Taller en vivo", <Hoja key="a" width={390} fold={844} className="bg-primary text-ink"><PaginaA /></Hoja>],
          ["B · Orden de trabajo", <Hoja key="b" width={390} fold={844} className="idea-b"><PaginaB /></Hoja>],
          ["C · Vitrina", <Hoja key="c" width={390} fold={844} className="idea-c" fab={false}><PaginaC /></Hoja>],
        ].map(([t, page]) => (
          <div key={t as string} className="flex flex-col gap-2">
            <span className="text-[14px] font-bold">{t}</span>
            <PrimeraPantalla>{page}</PrimeraPantalla>
          </div>
        ))}
      </div>
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-line text-left text-muted">
            <th className="py-2 pr-4 font-semibold">Criterio</th>
            <th className="py-2 pr-4 font-semibold text-accent">A · Taller en vivo</th>
            <th className="py-2 pr-4 font-semibold">B · Orden de trabajo</th>
            <th className="py-2 font-semibold">C · Vitrina</th>
          </tr>
        </thead>
        <tbody>
          {FILAS.map(([c, a, b, cc]) => (
            <tr key={c} className="border-b border-line/60 align-top">
              <td className="py-2.5 pr-4 font-semibold">{c}</td>
              <td className="py-2.5 pr-4">{a}</td>
              <td className="py-2.5 pr-4 text-muted">{b}</td>
              <td className="py-2.5 text-muted">{cc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Estados de A ---------------- */

export function EstadosA() {
  return (
    <div className="flex w-[440px] flex-col gap-5 rounded-card border border-line bg-surface p-5 font-body text-ink antialiased">
      <div>
        <Kicker>Idea A · estados</Kicker>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          Arriba: sin promos activas la barra dorada no se pinta y la página arranca en el menú. Abajo: si no hay prendas listas para llevar, la sección
          muestra el EmptyState de producción con salida a WhatsApp, y Diseñar mi prenda sigue arriba.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold">Sin promos · primera pantalla</span>
          <div className="h-[844px] w-[390px] overflow-hidden rounded-tile border border-line">
            <Hoja width={390} fold={844} className="bg-primary text-ink">
              <PaginaA promos={[]} />
            </Hoja>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold">Sin prendas listas para llevar</span>
          <div className="w-[390px] overflow-hidden rounded-tile border border-line bg-primary">
            <Section title="Listo para llevar" description="Lo que ya está hecho en el taller esta semana.">
              <EmptyState
                title="Hoy no hay prendas listas para llevar"
                description="Lo que sale del taller se va rápido. Diseña la tuya y la hacemos, o escríbenos y te contamos qué llega esta semana."
                action={{ label: "Escríbenos por WhatsApp", href: WA_IDEA }}
              />
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
