import type { ReactNode } from "react";
import { Mensaje } from "./propuesta/HojaEnvio";
import { mensaje } from "./data";

/* ---------------- Narración del canvas (no es producto) ---------------- */

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

function Propuesta() {
  return <span className="rounded-full border border-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-[.1em] text-accent">Propuesta</span>;
}

export function Intro() {
  return (
    <Card width={620}>
      <Kicker>PRI-122 · Personalizador · versión completa</Kicker>
      <Title>Diseña tu prenda: el personalizador completo</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        La versión "Vista realista" del doc de Producto (Personalizador: flujo y alcance V1). El cliente sube su diseño, lo ve sobre la foto real de la
        prenda en el color que elige, lo mueve y le cambia el tamaño, y lo manda por WhatsApp con el mensaje armado y la vista previa.
      </p>
      <Block label="Cómo leer el canvas">
        <Bullets
          items={[
            "Arriba: recomendación, decisiones que tomé, qué tiene que entregar el taller y el mensaje exacto que llega a WhatsApp.",
            "Fila 1: el flujo principal en celular (390), de izquierda a derecha: A inicial, diseño colocado, moviendo, hoja Revisa y envía (B), guardada, al volver de WhatsApp (C). A la derecha, la página completa.",
            "Filas 2 y 3: cada estado del doc (preparando y tarda más de 5 s, imagen pesada, pequeña, PDF, cargando un color, sin señal, hojas sin imagen, con archivo y sin señal), la espalda y la gorra.",
            "Fila 4: colores (4 y 10) y cómo se ve cada técnica.",
            "Fila 5: las dos decisiones de interacción, con dos opciones lado a lado y mi recomendación.",
            "Fila 6: escritorio (1280).",
          ]}
        />
      </Block>
      <Block label="Qué es nuevo">
        <p>
          <Propuesta /> Todo lo de la carpeta propuesta/: VistaPrevia, CampoDiseno, Colores, Tecnicas, Nota, BarraEnvio, HojaEnvio y la página. Reusa
          del design system Header, Footer, Chip y Button, los tokens y la trama.
        </p>
      </Block>
      <Block label="Pantallas interactivas">
        Las pantallas son la propuesta real con estado local: puedes tocar colores, técnicas, prenda y mover el diseño (tócalo, arrástralo, usa las
        manijas o los botones − + y Centrar).
      </Block>
      <Block label="Fotos">
        De muestra, del repo. Camisetas: un recorte de una foto de stock (sin cara) teñido a cada color; la espalda es una zona de solo tela de la
        misma foto. Gorras: gorras Serflow del catálogo con el parche borrado; la blanca y la gris son la azul teñida. El render final es el motor del prototipo v4 (curva, pliegues, luz y trama); el canvas lo aproxima con capas CSS.
      </Block>
    </Card>
  );
}

export function Recomendacion() {
  return (
    <Card width={560} destacada>
      <Kicker>Mi recomendación</Kicker>
      <Title>Vista fija arriba y mover directo sobre la prenda</Title>
      <Bullets
        items={[
          <>
            <strong>Decisión 1, vista previa mientras eliges:</strong> fija arriba (opción 1). Ver el cambio de color y técnica es la razón de ser de la vista
            realista; la miniatura es muy pequeña para juzgar un bordado.
          </>,
          <>
            <strong>Decisión 2, cómo se mueve el diseño:</strong> directo sobre la prenda (opción A), con "toca para seleccionar" para que el scroll no lo
            arrastre, y botones − + Centrar como alternativa. El modo ajustar (B) queda de plan B si en pruebas con clientes hay arrastres sin querer.
          </>,
          <>
            <strong>Envío:</strong> la hoja guía en 3 pasos (guardar vista previa, abrir el chat con el texto, adjuntar con el clip). Compartir es secundario
            y solo aparece donde el celular lo permite.
          </>,
        ]}
      />
      <Block label="Qué necesito de Said">
        <Bullets
          items={[
            "Aprobar las dos recomendaciones (o elegir las otras opciones).",
            "Confirmar la línea nueva del mensaje: *Tamaño:* unos 19 cm de ancho (sale del área de impresión que mide el taller).",
            "Confirmar el link Diseña tu prenda en el menú del header.",
          ]}
        />
      </Block>
    </Card>
  );
}

export function Decisiones() {
  return (
    <Card width={760}>
      <Kicker>Decisiones de diseño (las tomé yo, están en el PRD)</Kicker>
      <Bullets
        items={[
          "Una sola página /personaliza con los 3 pasos del doc. El paso 2 se llama Elige color y técnica: la prenda se elige arriba de la vista previa porque cambia la foto.",
          "Vista previa recortada a 320 px de alto en celular, centrada en el área de impresión (foco por foto). En escritorio, 500 px y fija a la izquierda.",
          "La etiqueta de la vista previa dice la prenda y el color (Camiseta negra). La barra de envío repite: Vista previa: el taller confirma colores y medidas.",
          "Mover y escalar: tocar selecciona; seleccionado se arrastra, se pellizca o se usan las manijas (44 px de toque). Guías: área de impresión punteada en dorado, línea de centro y Centrado al alinear. Tamaño en cm debajo del diseño.",
          "El diseño nunca sale del área de impresión. Tamaño entre 20 % y 100 % del ancho del área.",
          "Técnica en tarjetas con pista y muestra (la de ServiceCard). En gorra no hay selector: una línea dice Bordado y por qué.",
          "Colores: círculos de 44 px con nombre debajo, en una grilla que se reparte sola (4 en una fila, 10 en dos). Elegido = anillo dorado y check, no solo color.",
          "Cambiar de color nunca deja una caja vacía: la foto anterior atenuada con Cargando la camiseta blanca. El círculo elegido muestra el girador.",
          "Avisos de imagen (pesada, pequeña, PDF) en neutro con ícono, no en rojo: no son errores y no bloquean. Sin señal lleva el ícono rojo, en la vista previa y en la hoja.",
          "Sin señal: la caja va dentro de la vista previa y Reintentar vuelve a pedir solo la foto. No uso ErrorState aquí: su Reintentar recarga la página (borraría la imagen subida) y trae un link a WhatsApp que se saltaría el mensaje armado. Deuda para el design system: ErrorState con reintento por acción y WhatsApp opcional.",
          "Sin diseño, el área punteada de la vista previa abre el selector de archivos (Tu diseño va aquí · toca para subirlo): el paso 1 se ve desde la primera pantalla.",
          "Si preparar el diseño tarda más de 5 s: Seguir sin vista previa. La hoja de envío sale sin el paso de guardar y el mensaje dice te lo mando en el siguiente mensaje.",
          "Espalda: otra foto por color y otra área (35 cm). Cambiar de pecho a espalda conserva el diseño y su tamaño relativo.",
          "Barra de envío fija abajo en celular con el resumen en una línea (prenda, técnica, ubicación y cantidad); reemplaza al WhatsAppFab en esta página. En escritorio va al final del panel, fija abajo. Mientras prepara la vista previa, el botón muestra el girador.",
          "Guardar vista previa en celular usa el menú de compartir (en iPhone, Guardar imagen la deja en Fotos; una descarga quedaría en Archivos). Guardada sale solo si esa acción terminó.",
          "Hoja de envío: el mensaje primero (Así le llega a Serflow), luego pasos numerados. Volver al chat (pantalla C) abre wa.me sin texto para no duplicar el pedido; ahí se puede guardar la vista previa otra vez.",
          "Escritorio: la hoja es un diálogo de dos columnas con la vista previa grande a la izquierda y el botón dice Descargar.",
          "Deuda de design system que deja este feature (anotada en el tablero de States): ErrorState con reintento por acción y WhatsApp opcional; Button con estado disabled y una variante principal que no sea WhatsApp (hoy Enviar usa whatsapp porque lleva al chat); la muestra de ServiceCard exportada con tamaño.",
          "Header: se suma Diseña tu prenda al menú, marcado como página actual.",
          "Movimiento: hoja que sube 280 ms, foto que entra con fundido, brillo de carga. Todo se apaga con prefers-reduced-motion.",
        ]}
      />
    </Card>
  );
}

const FOTOS: { prenda: string; vistas: string; colores: string }[] = [
  { prenda: "Camiseta", vistas: "Frente y espalda", colores: "Blanca, negra, gris y azul (y cada color nuevo que se active en el admin)" },
  { prenda: "Gorra", vistas: "Frente", colores: "Blanca, negra, gris y azul (y cada color nuevo)" },
];

export function Taller() {
  return (
    <Card width={900}>
      <Kicker>Lo que el taller tiene que entregar (PRI-125 y PRI-127)</Kicker>
      <Title>Una foto por color y vista, y el área de impresión medida</Title>
      <table className="w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="text-[12px] uppercase tracking-[.08em] text-muted">
            <th className="px-3 py-2 font-semibold">Prenda</th>
            <th className="px-3 py-2 font-semibold">Vistas</th>
            <th className="px-3 py-2 font-semibold">Colores</th>
          </tr>
        </thead>
        <tbody>
          {FOTOS.map((f) => (
            <tr key={f.prenda}>
              <td className="border-t border-line px-3 py-2.5 font-semibold">{f.prenda}</td>
              <td className="border-t border-line px-3 py-2.5">{f.vistas}</td>
              <td className="border-t border-line px-3 py-2.5">{f.colores}</td>
            </tr>
          ))}
          <tr className="font-display text-[16px] font-bold">
            <td className="border-t border-line px-3 py-3" colSpan={2}>
              Mínimo para salir
            </td>
            <td className="border-t border-line px-3 py-3 text-accent">12 fotos: 8 de camiseta (4 colores x 2 vistas) y 4 de gorra</td>
          </tr>
        </tbody>
      </table>
      <div className="grid grid-cols-2 gap-8">
        <Block label="Cómo tomar cada foto">
          <Bullets
            items={[
              "Prenda lisa, sin logo ni etiqueta a la vista, planchada pero puesta (en maniquí o persona, sin cara): así salen pliegues reales.",
              "Mismo encuadre, distancia y luz en todos los colores: de frente, luz pareja de un lado, fondo liso de tono medio (gris), el mismo para todos.",
              "Vertical 4:5, mínimo 1600 x 2000 px. Se publica en WebP de menos de 150 KB.",
              "Gorra: de frente, a la altura de la visera, con el frente completo a la vista.",
            ]}
          />
        </Block>
        <Block label="Áreas de impresión (por foto, en el admin)">
          <Bullets
            items={[
              "Marcar sobre cada foto las 4 esquinas del área donde se puede estampar o bordar.",
              "Medir su ancho real en cm. Propongo: pecho 30 cm, espalda 35 cm, frente de gorra 12 cm. Con eso el sitio dice unos 19 cm de ancho.",
              "Ajustar la luz de la foto (qué tanto se ven los pliegues sobre el diseño); en telas oscuras va más alta.",
              "Si un color no tiene foto, no se activa: el selector solo muestra colores con foto.",
            ]}
          />
        </Block>
      </div>
    </Card>
  );
}

export function MensajeWhatsApp() {
  const base = { prenda: "camiseta", color: "Negra", tecnica: "estampado", ubicacion: "Pecho", cantidad: "2 a 5" } as const;
  return (
    <Card width={980}>
      <Kicker>Qué llega a WhatsApp</Kicker>
      <Title>El mensaje, siempre en el mismo orden</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        El del doc de Producto, más una línea: *Tamaño:* sale del área de impresión y del tamaño que dejó el cliente. Solo va cuando hay una imagen que se
        puede mostrar. La nota se corta en 300 caracteres y su línea no va si está vacía. El texto pasa siempre por encodeURIComponent (whatsappUrl).
      </p>
      <div className="grid grid-cols-3 gap-4">
        <Block label="Con imagen">
          <Mensaje texto={mensaje({ ...base, diseno: "imagen", tamanoCm: 19, nota: "El logo en dorado, tallas M y L" })} />
        </Block>
        <Block label="Sin imagen">
          <Mensaje texto={mensaje({ ...base, cantidad: "6 a 20", diseno: "ayuda", nota: "Quiero algo con el nombre del equipo" })} />
        </Block>
        <Block label="Archivo PDF, AI o PSD · gorra">
          <Mensaje texto={mensaje({ prenda: "gorra", color: "Blanca", tecnica: "bordado", ubicacion: "Frente", cantidad: "Más de 20", diseno: "archivo" })} />
        </Block>
      </div>
    </Card>
  );
}

/* Rótulos de fila y flechas del flujo */

export function Rotulo({ titulo, texto, width = 900 }: { titulo: string; texto: string; width?: number }) {
  return (
    <div className="flex flex-col gap-1 font-body text-ink antialiased" style={{ width }}>
      <h2 className="font-display text-[26px] font-bold tracking-tight">{titulo}</h2>
      <p className="text-[15px] text-muted">{texto}</p>
    </div>
  );
}

export function Flecha({ texto }: { texto: string }) {
  return (
    <div className="flex w-[100px] flex-col items-center gap-2 font-body text-ink antialiased">
      <p className="text-center text-[13px] leading-snug text-muted">{texto}</p>
      <svg viewBox="0 0 100 24" className="w-full text-accent" aria-hidden="true">
        <path d="M2 12h90M82 4l10 8-10 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function NotaOpcion({ letra, nombre, recomendada, resuelve, sacrifica }: { letra: string; nombre: string; recomendada?: boolean; resuelve: string[]; sacrifica: string[] }) {
  return (
    <div className={`flex flex-col gap-4 rounded-tile border p-5 ${recomendada ? "border-accent" : "border-line"}`}>
      <div className="flex items-center gap-2">
        <span className="font-display text-[18px] font-bold">
          {letra} · {nombre}
        </span>
        {recomendada && <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-primary">Recomendada</span>}
      </div>
      <Block label="Qué resuelve">
        <Bullets items={resuelve} />
      </Block>
      <Block label="Qué sacrifica">
        <Bullets items={sacrifica} />
      </Block>
    </div>
  );
}

export function NotaD1() {
  return (
    <Card width={420}>
      <Kicker>Decisión 1</Kicker>
      <Title>¿Dónde va la vista previa mientras eliges?</Title>
      <NotaOpcion
        letra="1"
        nombre="Fija arriba"
        recomendada
        resuelve={["Cada toque en color o técnica se ve al instante, en grande.", "Se puede mover el diseño sin volver a subir."]}
        sacrifica={["Ocupa unos 340 px (foto de 320 más márgenes): con la barra de envío quedan unos 350 px para elegir.", "En celulares bajos aprieta más; hay que probarlo en un teléfono real."]}
      />
      <NotaOpcion
        letra="2"
        nombre="Miniatura flotante"
        resuelve={["Toda la pantalla para elegir.", "La página se lee como un formulario normal."]}
        sacrifica={["A 84 px no se distingue estampado de bordado.", "Para mover el diseño hay que volver arriba.", "Una cosa más flotando: tapa parte de los colores y las opciones."]}
      />
    </Card>
  );
}

export function NotaD2() {
  return (
    <Card width={420}>
      <Kicker>Decisión 2</Kicker>
      <Title>¿Cómo se mueve y escala el diseño?</Title>
      <NotaOpcion
        letra="A"
        nombre="Directo sobre la prenda"
        recomendada
        resuelve={[
          "Cero pasos extra: tocas, arrastras, pellizcas.",
          "Tocar primero para seleccionar evita mover el diseño al hacer scroll.",
          "− + y Centrar para quien no arrastra (y para accesibilidad).",
        ]}
        sacrifica={["En la vista recortada el diseño es pequeño (unos 120 px) para pellizcar.", "Hay que enseñar el gesto: pista Toca tu diseño la primera vez."]}
      />
      <NotaOpcion
        letra="B"
        nombre="Modo ajustar"
        resuelve={["Pantalla completa: diseño grande, precisión.", "No hay conflicto con el scroll.", "Control de tamaño con regla en cm."]}
        sacrifica={["Un toque más para entrar y otro (Listo) para salir.", "Mientras ajustas no ves los colores ni las técnicas."]}
      />
    </Card>
  );
}
