import { PageFrame, PageTitle } from "../../design-system/Chrome";
import { NUEVO } from "../refresh-oro-viejo/comun";

/* Narración: el sistema medido en heirest.com (Playwright, 1280 y 390, 2026-11-01) y el valor que usa la portada. */

type Fila = { medida: string; heirest: string; serflow: string; porque?: string };

const FILAS: Fila[] = [
  { medida: "Contenedor y margen lateral", heirest: "A lo ancho · 16 / 12", serflow: "A lo ancho · 48 / 16", porque: "48 / 16 es el borde del logo en el Header y el Footer de producción: todo arranca en la misma línea." },
  { medida: "Columnas y calle", heirest: "12 col de 96,7 · calle 8 / 1 col, 2 en grillas · calle 4", serflow: "12 col de 91,3 · calle 8 / 1 col, 2 en Disponible · calle 8", porque: "En el celular 8 y no 4: con 4 dos fotos de gorra vecinas se leen como una." },
  { medida: "Cabecera de sección", heirest: "Título solo a la izquierda; la acción en la misma fila a la derecha", serflow: "Igual. La bajada va 12 debajo del título; Ver todo a la derecha (en 390, debajo de las prendas)", porque: "Las bajadas ya existen en master; en 390 la acción no cabe en la fila del título." },
  { medida: "Titular del hero", heirest: "62 / 1,15 · 400 · -4,5 % / 38", serflow: "64 / 1,05 · 500 · -2 % / 40", porque: "Plus Jakarta a 400 queda delgada sobre la foto oscura; 500 la sostiene." },
  { medida: "Título de sección (h2)", heirest: "47 / 1,15 · 400 / 34", serflow: "48 / 1,1 · 500 / 34", porque: "500 por la misma razón que el titular; 48 cae en la escala de 8." },
  { medida: "Título de tarjeta", heirest: "22 / 1,25 · 500 / 20", serflow: "22 servicio, 20 prenda · 500 / 18 y 16", porque: "En dos columnas de 175 px, 20 parte el nombre de la prenda en tres líneas." },
  { medida: "Bajada", heirest: "22 / 1,25 / 20", serflow: "22 / 1,45 / 18", porque: "Interlínea más abierta: la bajada de Serflow es de 2 líneas, no de una frase." },
  { medida: "Cuerpo", heirest: "15 / 1,43 / 17", serflow: "16 / 1,5 / 16", porque: "16 es el mínimo del design system (y en iOS no hace zoom)." },
  { medida: "Pie y etiqueta", heirest: "13 mono mayúsculas / 12", serflow: "13 mayúsculas · 600 · oro / 13", porque: "Sin mono: la familia es una sola y sin letras cuadradas." },
  { medida: "Aire entre secciones", heirest: "92 arriba del título (64-104) / 48-64", serflow: "96 / 64 hasta la mayúscula del título, igual en todas", porque: "Heirest varía por sección; aquí un solo valor, múltiplo de 8." },
  { medida: "Título -> contenido", heirest: "20-32 / 20-28", serflow: "32 / 24", porque: "Dentro del rango de Heirest, pero fijo." },
  { medida: "Hero", heirest: "A sangre · 800 de alto / 844", serflow: "A sangre · 720 / 600", porque: "Viewport menos el Header: se ve que la página sigue." },
  { medida: "Fotos de tarjeta", heirest: "Verticales (0,71-0,87) · sin radio · pie 8-12 debajo, sin caja", serflow: "Prenda 4:5 (0,8) · servicio 1:1 en 1280, 4:5 en 390 · radio 12 · pie 12-16 debajo, sin caja", porque: "Radio 12 = radius-tile del refresh. Servicio cuadrado para que no pese más que Disponible ahora." },
  { medida: "Botones", heirest: "38 alto · 14 mayúsculas · radio 3 · borde", serflow: "52 / 48 alto · 16 · píldora · oro relleno o borde", porque: "Decisión de la ronda 4: target táctil de 48 y el oro solo en la acción principal." },
];

export function Sistema() {
  return (
    <div className={NUEVO}>
      <PageFrame family="portada final · PRI-286" width={1240}>
        <div className="px-12 py-12">
          <PageTitle
            title="Sistema (de Heirest)"
            description="Medido con Playwright en heirest.com a 1280 y 390. Cada valor va como 1280 / 390. La portada usa el mismo valor o el de la derecha, con su razón en una línea."
          />
          <table className="w-full border-collapse text-left text-[14px] leading-snug">
            <thead>
              <tr className="border-b border-line text-[12px] uppercase tracking-[.14em] text-muted">
                <th className="w-[200px] py-3 pr-6 font-semibold">Medida</th>
                <th className="w-[300px] py-3 pr-6 font-semibold">Heirest</th>
                <th className="w-[300px] py-3 pr-6 font-semibold">Serflow</th>
                <th className="py-3 font-semibold">Por qué distinto</th>
              </tr>
            </thead>
            <tbody>
              {FILAS.map((f) => (
                <tr key={f.medida} className="border-b border-line align-top">
                  <td className="py-3 pr-6 font-semibold text-ink">{f.medida}</td>
                  <td className="py-3 pr-6 text-muted">{f.heirest}</td>
                  <td className="py-3 pr-6 text-ink">{f.serflow}</td>
                  <td className="py-3 text-muted">{f.porque ?? "Igual."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageFrame>
    </div>
  );
}
