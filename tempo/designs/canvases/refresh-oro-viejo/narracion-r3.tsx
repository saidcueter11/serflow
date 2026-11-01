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
];

/** Zonas revisadas con la regla de vacíos (frame, dónde, tamaño antes -> después). */
export const ZONAS: { frame: string; donde: string; antes: string; despues: string }[] = [
  { frame: "Todas", donde: "Entre secciones", antes: "96 / 176 px", despues: "72 / 128 px" },
  { frame: "Portada 390", donde: "Ticker debajo del personalizador", antes: "banda de 48 px + 48 de aire", despues: "sin ticker" },
  { frame: "Portada 1280", donde: "Banda del personalizador: franja de texto + foto apilada", antes: "~1060 px de alto, derecha del titular vacía ~560 x 200", despues: "480 px, dos columnas llenas" },
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
      <>Banda del personalizador: grid de 12 columnas, texto col 1-5 (eyebrow, h2, frase arriba; lista de 3 pasos con filetes y Diseñar mi prenda abajo, justify-end) y foto col 6-12, 480 px de alto, rounded-tile. En el celular la foto va entre el titular y los pasos, 300 px.</>,
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
