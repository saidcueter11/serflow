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
  { medida: "Hero", heirest: "A sangre · 800 de alto / 844", serflow: "A sangre · 720 / 600 · carrusel de master: 4 fotos, 6 s cada una, barras de avance en el margen (abajo a la derecha / debajo del botón)", porque: "Viewport menos el Header: se ve que la página sigue. Las barras dicen que hay más fotos; con reducir movimiento, la primera fija y su barra llena." },
  { medida: "Fotos de tarjeta", heirest: "Verticales (0,71-0,87) · sin radio · pie 8-12 debajo, sin caja", serflow: "Prenda 4:5 (0,8) · servicio 1:1 en 1280, 4:5 en 390 · radio 12 · pie 12-16 debajo, sin caja", porque: "Radio 12 = radius-tile del refresh. Servicio cuadrado para que no pese más que Disponible ahora." },
  { medida: "Botones", heirest: "38 alto · 14 mayúsculas · radio 3 · borde", serflow: "52 / 48 alto · 16 · píldora · oro relleno o borde", porque: "Decisión de la ronda 4: target táctil de 48 y el oro solo en la acción principal." },
  /* Patrones del resto de las pantallas: salen de las filas de arriba, sin medidas nuevas. */
  { medida: "Título de página interior", heirest: "Sale de Aire, Titular y Bajada", serflow: "96 / 64 de aire arriba · pie · titular 64 / 40 · bajada 12 debajo", porque: "Promos, 404 y personalizador: la página arranca como una sección más." },
  { medida: "Banner de categoría", heirest: "Sale de Hero", serflow: "A sangre · 520 / 340 · nombre (h1) y bajada abajo a la izquierda en el margen", porque: "El texto del hero sobre la foto de la categoría; sin \"N productos\" (ya está en la pestaña)." },
  { medida: "Muro del catálogo y Más de", heirest: "Sale de Columnas y calle", serflow: "4 / 2 columnas (3 de 12) · calle 8 · fotos 4:5 · radio 12 · chevrón en círculo de 28 abajo a la derecha · última fila con las fotos que haya", porque: "La misma celda que Disponible ahora. El chevrón (el del muro de master antes de PRI-130) dice que la foto se abre, también sin mouse." },
  { medida: "Foto abierta (modal)", heirest: "Sale del modal de foto de Unsplash y el pin de Pinterest", serflow: "Velo sobre el muro · foto entera (contain) a todo el alto menos 24 · franja de 300 al lado, pegada al borde de abajo · contador arriba a la izquierda, X arriba a la derecha, flechas de 48 a 24 del borde / pantalla completa: contador y X arriba, foto con orillas de 12 de la anterior y la siguiente (botones), franja con Pedir fija abajo", porque: "No es una tienda: solo la foto, qué es y cómo pedirla. Sin página de detalle ni Más de." },
  { medida: "Promo en la lista", heirest: "Sale de Diseña la tuya (5 | 6 desde la 7)", serflow: "Texto en 5 · foto 16:9 en 6 · botones en el borde de abajo", porque: "Fotos parejas en la lista; si el texto es más alto, la foto crece con él." },
  { medida: "Tarjetas de promo", heirest: "Sale de Fotos de tarjeta", serflow: "Horizontales con caja (superficie, borde, radio 16) · foto chica a todo el alto (112 / 200) · vigencia oro, título 22, Ver promo con borde de 44 · una fila llena: 2 en 6 columnas, 3 en 4", porque: "Otras promos y la 404: se leen como promos, no como otra galería de fotos." },
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
