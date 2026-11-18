import type { ReactNode } from "react";

// Narración del canvas (intro y "Falta en el DS"): explica la propuesta, no se usa en el sitio.

const Hoja = ({ eyebrow, titulo, children }: { eyebrow: string; titulo: string; children: ReactNode }) => (
  <div className="w-[720px] rounded-card border border-line bg-primary p-12 font-body text-ink antialiased">
    <p className="text-[12px] font-semibold uppercase tracking-[.14em] text-accent">{eyebrow}</p>
    <h1 className="mt-3 font-display text-[32px] font-semibold leading-tight tracking-tight">{titulo}</h1>
    <div className="mt-6 flex flex-col gap-6 text-[15px] leading-relaxed text-muted">{children}</div>
  </div>
);

const Lista = ({ items }: { items: ReactNode[] }) => (
  <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-accent">
    {items.map((it, i) => (
      <li key={i}>{it}</li>
    ))}
  </ul>
);

const B = ({ children }: { children: ReactNode }) => <b className="font-semibold text-ink">{children}</b>;

export function Intro() {
  return (
    <Hoja eyebrow="PRI-529 · paso 2" titulo="Ficha de producto">
      <p>
        Réplica del prototipo aprobado (v7, "Monograma") con <B>solo piezas del design system en master</B>: Header,
        Footer, Button, ColoresDisponibles, ProductCard y las seis de PR #88 (Costura, Monograma, GaleriaProducto, Lupa,
        VisorFotos, BarraPedir). Mismos textos, orden y jerarquía; datos reales de los 3 productos del prototipo.
      </p>
      <Lista
        items={[
          <><B>Fila 1, escritorio 1280:</B> con precio y colores, sin precio, varias fotos y lupa encendida.</>,
          <><B>Fila 2, celular 390:</B> lo mismo y "Mantén para acercar" activo. Cada uno es la pantalla del teléfono (844): la barra de pedir queda pegada abajo y el resto se ve con scroll; el primero va también de largo completo.</>,
          <><B>Fila 3:</B> el visor abierto (1280 y 390) y el celular de 320.</>,
          <><B>A la derecha:</B> lo que no sale igual con el design system de hoy. No se inventó nada: se usó la pieza que hay y queda anotado.</>,
        ]}
      />
      <Lista
        items={[
          <>Página propia en <B>/catalogo/&lt;cat&gt;/&lt;slug&gt;/</B>; el muro sigue abriendo el modal de siempre.</>,
          <>Un solo WhatsApp por pantalla: en el celular la BarraPedir reemplaza al WhatsAppFab; en escritorio el botón va con la información.</>,
          <>Sin precio no sale nada. "‹ Categoría" hace de categoría y de volver (las migas siguen en el JSON-LD).</>,
          <>Mientras la lupa está encendida se esconden la costura y la S, y el panel tapa la información (composición de página).</>,
          <>Movimiento: la foto entra creciendo, el texto línea por línea (anim-enter), la S con su brillo lento y el brillo del botón al pasar. Con reducir movimiento no se anima nada.</>,
        ]}
      />
      <p>
        Prototipo: claude.ai/artifact/J4DqMW5EmtRBzVbweKzCyc · Decisiones: doc "Ficha de producto con zoom (PRI-529):
        prototipo aprobado".
      </p>
    </Hoja>
  );
}

const Falta = ({ n, titulo, hoy, proto, nota }: { n: number; titulo: string; hoy: ReactNode; proto: ReactNode; nota: ReactNode }) => (
  <div className="flex flex-col gap-2 border-t border-line pt-5">
    <p className="text-[16px] font-semibold text-ink">
      {n}. {titulo}
    </p>
    <p>
      <B>Hoy en el DS:</B> {hoy}
    </p>
    <p>
      <B>Prototipo:</B> {proto}
    </p>
    <p className="text-[14px]">{nota}</p>
  </div>
);

export function FaltaEnElDS() {
  return (
    <Hoja eyebrow="Para que Said decida" titulo="Falta en el DS">
      <p>Diferencias con el prototipo que el design system de hoy no cubre. En el canvas va la pieza actual, sin variantes nuevas.</p>
      <Falta
        n={1}
        titulo={'ProductCard en "Más de <categoría>"'}
        hoy="foto 4:5 y nombre de 16 px (20 px en escritorio)."
        proto="foto 3:4 y nombre de 14 px."
        nota="Se usa la de hoy. Said decide si hace falta una proporción 3:4."
      />
      <Falta
        n={2}
        titulo="ProductCard pide meta"
        hoy={<>meta es obligatorio; aquí va vacío y deja un párrafo sin texto debajo del nombre.</>}
        proto="solo el nombre."
        nota="Arreglo compatible posible: meta opcional (no se tocó src/)."
      />
      <Falta
        n={3}
        titulo="ColoresDisponibles"
        hoy="lista compacta: punto de 14 px y nombre de 13 px en gris."
        proto="píldoras de 36 px con borde, punto de 20 px y nombre de 14 px en blanco."
        nota="Se usa la de hoy, la misma del modal y de ProductCard."
      />
      <Falta
        n={4}
        titulo={'"Ver todo" (Button ghost)'}
        hoy="texto blanco con la costura al pasar."
        proto="texto en oro claro."
        nota="Se usa ghost, que es el link 'Ver todo' del sistema."
      />
      <Falta
        n={5}
        titulo="Button whatsapp en el celular"
        hoy="48 px de alto (52 desde escritorio)."
        proto="52 px."
        nota="Decidido: se queda como está."
      />
    </Hoja>
  );
}
