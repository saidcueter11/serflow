import type { ReactNode } from "react";
import { PageFrame, PageTitle } from "../../design-system/Chrome";

/* Narración de la ronda 3 (espacios): intro, lista de cambios y el separador de la ronda 2. */

const FAMILIA = "refresh · ronda 3 · espacios · PRI-286";

function TableroR3({ width, children }: { width: number; children: ReactNode }) {
  return (
    <div className="sf-refresh sf-r2 sf-r3">
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

/** Lo que Said comentó el 2026-11-01 y qué se hizo; cada punto se completa al resolver su hilo. */
export const RESUELTOS: { donde: string; dijo: string; hecho: ReactNode }[] = [
  { donde: "Portada · 390", dijo: "No tiene sentido el banner tan abajo. lo podriamos quitar", hecho: <>Era el Ticker de usos (no la barra de promos). Se quita de la portada en 390 y 1280.</> },
  {
    donde: "Portada · 1280 · personalizador",
    dijo: "Esta seccion del personalizador me parece muy grande y que ademas no aprovecha bien los espacios",
    hecho: <>Bloque de 480 px (antes ~1060): texto en 5 columnas (titular arriba; frase, los 3 pasos y el botón abajo, al ras de la foto) y la foto en 7. En el celular: titular, foto, pasos y botón.</>,
  },
  {
    donde: "Portada · 1280 · Qué hacemos y Disponible ahora",
    dijo: "Estan cards tambien tienen espacio para mejora / Siento que se pueden mejorar las cards",
    hecho: <>Foto 4:5 en las dos familias (Disponible ahora era 4:3). Pie con jerarquía: 24 + 16 a 34ch en Qué hacemos, 18 + 14 en Disponible ahora. La bajada de la sección sube al lado del título. Antes y después en el tablero &quot;Tarjetas&quot;.</>,
  },
  {
    donde: "Catálogo · 1280",
    dijo: "No me gusta este espacio aqui",
    hecho: <>Era el final del muro: el mosaico deja columnas de distinto largo (hueco de ~290 x 600 abajo a la derecha). Ahora rejilla pareja 4:5 de 4 columnas y páginas que cierran la fila (12 en el frame; 60 en producción, múltiplo de 2, 3 y 4).</>,
  },
  {
    donde: "Visor · 1280 · panel derecho",
    dijo: "Mucho espacio desprovechado",
    hecho: <>Foto 4:5 y panel del mismo alto: título y categoría arriba, Pedir por WhatsApp al medio, las 3 miniaturas grandes (4:5) abajo al ras de la foto. Antes el panel terminaba a 380 px y dejaba ~520 x 420 vacío.</>,
  },
  {
    donde: "Visor · 1280 · Más de Beisbol",
    dijo: "No me gusta que queden estos espacios aca abajo, creo que mejor volvemos a un mosaico mas ordenado",
    hecho: <>Rejilla pareja: 4 columnas iguales, todas 4:5, 12 fotos = 3 filas completas (6 en el celular = 3 filas de 2).</>,
  },
  {
    donde: "Promos · 1280",
    dijo: "Aqui hay un espacio desaprovechado",
    hecho: <>El afiche sin descripción estiraba su pie para alinear los botones con el vecino (~570 x 90 vacío). Ahora cada afiche termina con su texto y los dos botones van en fila. La bajada de la cabecera sube al lado del título.</>,
  },
  {
    donde: "Personalizador · 1280",
    dijo: "Me parece que estamos desaprovechando mucho este espacio aqui",
    hecho: <>Debajo de la vista previa quedaban ~560 x 900 vacíos. Ahora la izquierda lleva prenda, vista previa 4:5 y el paso 3 con el resumen y Enviar (sticky); la derecha, los pasos 1 y 2. Las dos columnas cierran a ~130 px una de otra.</>,
  },
];

/** Zonas revisadas con la regla de vacíos (frame, dónde, tamaño antes -> después). */
export const ZONAS: { frame: string; donde: string; antes: string; despues: string }[] = [
  { frame: "Todas", donde: "Entre secciones", antes: "96 / 176 px", despues: "72 / 128 px" },
  { frame: "Portada 390", donde: "Ticker debajo del personalizador", antes: "banda de 48 px + 48 de aire", despues: "sin ticker" },
  { frame: "Portada 1280", donde: "Banda del personalizador: franja de texto + foto apilada", antes: "~1060 px de alto, derecha del titular vacía ~560 x 200", despues: "480 px, dos columnas llenas" },
  { frame: "Portada 1280", donde: "Cabecera de Qué hacemos / Disponible ahora (derecha del título)", antes: "~600 x 150 vacío", despues: "bajada en columnas 8-12" },
  { frame: "Portada 1280", donde: "Fila de Disponible ahora (fotos 4:3, pie chico)", antes: "fila de 200 px de foto, aire debajo ~1100 x 80", despues: "fotos 4:5 de 330 px" },
  { frame: "Catálogo 1280", donde: "Final del muro, columna 4", antes: "~290 x 600 vacío", despues: "rejilla pareja, fila completa" },
  { frame: "Catálogo 390", donde: "Final del muro", antes: "columnas de distinto largo (~180 x 160)", despues: "6 filas de 2, completas" },
  { frame: "Visor 1280", donde: "Panel derecho bajo las miniaturas", antes: "~520 x 420 vacío", despues: "panel a la altura de la foto; huecos internos de ~520 x 165" },
  { frame: "Promos 1280", donde: "Afiche sin descripción, entre título y botones", antes: "~570 x 90 vacío", despues: "botones pegados al título, en fila" },
  { frame: "Promos 1280", donde: "Cabecera, derecha del título", antes: "~600 x 250 vacío", despues: "bajada en columnas 8-12" },
  { frame: "Personalizador 1280", donde: "Columna izquierda bajo la vista previa", antes: "~560 x 900 vacío", despues: "vista previa 4:5 + paso 3 y Enviar; desfase final ~560 x 130" },
  { frame: "Personalizador 1280", donde: "Cabecera, derecha del h1", antes: "~560 x 120 vacío", despues: "bajada al lado del h1" },
  { frame: "Catálogo 1280 · 10 fotos", donde: "Última fila de una categoría real (Basket, Moda, Niños)", antes: "1 a 3 celdas vacías (hasta ~870 x 362)", despues: "tarjeta \"¿No ves la que buscas?\" ocupa las celdas que faltan" },
  { frame: "Portada 390 / 1280", donde: "Hero → personalizador → Qué hacemos", antes: "aire doble en la banda (128 / 192 px)", despues: "64 / 128 px como el resto" },
  { frame: "404 1280", donde: "Tarjetas de Promos de hoy", antes: "\"Ver promo\" empujado al fondo, títulos a distinta altura", despues: "pegado al texto, títulos alineados" },
  { frame: "404 1280", donde: "A los lados del mensaje centrado", antes: "~300 x 400 c/u", despues: "se queda: composición centrada intencional (decídelo tú)" },
  { frame: "Portada 390, catálogo 390, visor 390, promos 390, detalle 390 y 1280, personalizador 390", donde: "Página completa", antes: "-", despues: "sin zonas > 240 x 240" },
  { frame: "Visor 1280", donde: "Más de Beisbol, abajo", antes: "huecos de ~290 x 120 a ~290 x 300", despues: "3 filas completas" },
];

export function IntroR3() {
  return (
    <TableroR3 width={1000}>
      <PageTitle
        title="Refresh · ronda 3 · espacios"
        description={
          <>
            Tu comentario del 1 de noviembre: &quot;hay un serio problema con el manejo de los espacios&quot;. La causa fue el brief de la ronda 2
            (&quot;50 % más de aire&quot; y &quot;menos cajas&quot;): salió vacío, no composición. Esta ronda compone cada bloque sobre el ancho y devuelve
            el aire a la escala de antes.
          </>
        }
      />
      <div className="grid grid-cols-2 gap-10 pb-10">
        <Lista
          titulo="La regla de esta ronda"
          items={[
            <>A 1280 cada bloque usa el ancho: rejilla de 12 columnas, texto y foto lado a lado.</>,
            <>Una zona vacía de más de ~240 x 240 px que no sea un margen intencional es un defecto.</>,
            <>Entre secciones: 72 / 128 px (master 64 / 112, ronda 2 96 / 176).</>,
            <>Fotos en rejilla pareja 4:5 donde había huecos de mosaico.</>,
          ]}
        />
        <Lista
          titulo="Lo que se queda"
          items={[
            "Plus Jakarta Sans, el oro viejo #C9A24A solo como detalle y los 4 movimientos.",
            "Titulares grandes y livianos: la escala de títulos de la ronda 2 no cambia.",
            "Sin modelos ni mascota.",
          ]}
        />
      </div>
      <div className="rounded-card border border-line bg-surface p-6">
        <h2 className="text-[17px] font-semibold">Cómo leer el canvas</h2>
        <ol className="mt-3 flex list-decimal flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-muted marker:text-accent">
          <li>Arriba: esta intro y la lista de cambios para el PR, con cada comentario tuyo y las zonas revisadas.</li>
          <li>Debajo, una fila por pantalla: antes = la ronda 2 que comentaste, después = la ronda 3. 390 a la izquierda y 1280 a la derecha.</li>
          <li>El después son los componentes de producción con refresh.css + r2 + r3 encima; nada redibujado. JPG fijas en capturas/r3/.</li>
          <li>Más abajo, la fila &quot;Ronda 2 (reemplazada)&quot; con tus comentarios donde los dejaste, y al fondo la ronda 1.</li>
        </ol>
      </div>
    </TableroR3>
  );
}

const CAMBIOS: { grupo: string; items: ReactNode[] }[] = [
  {
    grupo: "Espaciado (refresh-r3.css)",
    items: [
      <>--sf-aire 36 px y --sf-aire-desktop 64 px (la ronda 2 tenía 48 / 88): Section py 36 / 64.</>,
      <>Título de sección → contenido: 28 px. Cabecera de CatalogPage, PromosPage y personalizador: pt 28 / 48, pb 32 / 48.</>,
      <>Entre afiches de /promos: 40 / 56 px. Detalle de promo: afiche → Más fotos 40 px.</>,
    ],
  },
  {
    grupo: "Portada (HomePage.tsx, ver propuesta/PortadaR3.tsx)",
    items: [
      <>Sin Ticker: se borra de HomePage (el componente Ticker queda sin uso en la portada; no se borra del design system en este PR).</>,
      <>Section: con description, a partir de @3xl la cabecera es grid 7fr / 5fr (título y bajada al pie del título, pb 22 px para quedar a la altura de la costura).</>,
      <>ServiceCard: h3 a --sf-h3 (24) con mt 20; descripción 16 / 1.5 a 34ch. Foto 4:5 desde @3xl (4:3 en el celular).</>,
      <>ProductCard: foto 4:5 (antes aspect-[4/3]); nombre 18 / 1.25 y detalle 14; pie con pt 16, sin padding lateral. &quot;Ver todo el catálogo&quot; a 20 px de las tarjetas.</>,
      <>Banda del personalizador: grid de 12 columnas, texto col 1-5 (eyebrow, h2, frase arriba; lista de 3 pasos con filetes y Diseñar mi prenda abajo, justify-end) y foto col 6-12, 480 px de alto, rounded-tile. En el celular la foto va entre el titular y los pasos, 300 px.</>,
    ],
  },
  {
    grupo: "Catálogo y visor",
    items: [
      <>Masonry → rejilla: grid de 2 / 3 / 4 columnas (las de hoy), gap 8 / 12, todas las fotos 4:5 (se va el RITMO de alturas; offset deja de servir). Las páginas del muro son de 60 (PAGE_SIZE ya es 60: cierra fila con 2, 3 y 4 columnas); Más de pasa 12 (6 en el celular).</>,
      <>ViewerPage desktop: items-stretch; el panel derecho flex-col justify-between (título y categoría / botón y nota / miniaturas); botón de 360 px como máximo.</>,
      <>PromosPage desktop: cabecera grid 7fr / 5fr (eyebrow y h1 a la izquierda, bajada a la derecha al pie del h1). PromoGrid: items-start. PromoAfiche: el bloque de botones sin mt-auto (mt 4) y desde @md en fila (Pedir por WhatsApp de ancho propio + Ver las N fotos).</>,
      <>PersonalizaPage (PR #36) desde @4xl: dos columnas; izquierda (sticky top 24) = selector de prenda, vista previa con aspect-[4/5] en vez del alto fijo, paso 3 y la tarjeta de Enviar (sin sticky bottom en desktop); derecha = pasos 1 y 2 con gap 48. Cabecera grid 7fr / 5fr. El orden del DOM no cambia (prenda, vista previa, pasos 1 y 2, paso 3 y Enviar): las columnas se arman con grid-template-areas, así Tab y el lector llegan a Enviar al final. El celular no cambia.</>,
      <>Cierre de la última fila del muro (CatalogPage): si la página no es múltiplo de las columnas, un &lt;li&gt; final con borde punteado, &quot;¿No ves la que buscas?&quot; + &quot;Te la hacemos con tu logo o tu diseño. Escríbenos por WhatsApp →&quot; (link con whatsappUrl) y col-span = celdas que faltan (2 / 3 / 4 columnas). En el canvas va como ::after en refresh-r3.css.</>,
      <>Más de (masDe): recortar a múltiplo de 4 (12, 8 o 4) en desktop; mobileMax 6 se queda.</>,
      <>PromoAfiche y PromoCard sin fecha: el título baja 38 / 34 px (la línea de la vigencia) cuando van en fila, para alinear con el vecino. PromoCard en la 404: sin mt-auto en Ver promo; PromoGrid items-start.</>,
      <>PhotoThumbs desktop: grid de 3 columnas, cada miniatura 4:5 (antes size-14), la elegida con anillo de 2 px en tinta.</>,
    ],
  },
];

export function CambiosR3() {
  return (
    <TableroR3 width={1200}>
      <PageTitle
        title="Lista de cambios para el PR · ronda 3"
        description="Se suma a la lista de la ronda 2 (mismo PR del Feature Builder, después de PRI-122 / PR #36). Sin dependencias nuevas ni JavaScript en el sitio."
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
            <h2 className="text-[17px] font-semibold">Tus 9 comentarios</h2>
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
        <section>
          <h2 className="text-[17px] font-semibold">Zonas revisadas con la regla de vacíos</h2>
          <table className="mt-3 w-full text-left text-[14px] leading-relaxed">
            <thead className="text-muted">
              <tr>
                <th className="py-2 pr-4 font-semibold">Frame</th>
                <th className="py-2 pr-4 font-semibold">Dónde</th>
                <th className="py-2 pr-4 font-semibold">Ronda 2</th>
                <th className="py-2 font-semibold">Ronda 3</th>
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
      </div>
    </TableroR3>
  );
}

/** Separador de la fila de la ronda 2. */
export function Ronda2Separador() {
  return (
    <div className="flex h-[260px] w-[3760px] flex-col justify-center gap-3 border-t-2 border-dashed border-line bg-primary px-12 font-body text-ink">
      <p className="text-[13px] font-semibold uppercase tracking-[.16em] text-muted">Hasta aquí la ronda 3</p>
      <h2 className="font-display text-[56px] font-medium leading-[1.05] tracking-[-0.02em]">Ronda 2 (reemplazada)</h2>
      <p className="max-w-[80ch] text-[16px] text-muted">
        Lo que comentaste el 1 de noviembre, tal como lo viste: tus 9 comentarios siguen pegados a estos frames. No se construye así; la
        ronda 3 de arriba la reemplaza.
      </p>
    </div>
  );
}
