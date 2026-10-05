import type { ReactNode } from "react";
import { HeroA, HeroB, HeroC, NAV, Screen } from "./heroes";

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

export function Intro() {
  return (
    <Card width={620}>
      <Kicker>PRI-129 · Portada · opciones</Kicker>
      <Title>Primera pantalla de la portada: 3 opciones</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        Said revisó la portada nueva (canvas portada-final, PR #31). Lo que dijo, y cómo lo resuelven las tres opciones:
      </p>
      <Bullets
        items={[
          <>
            <strong>"No dice nada del producto."</strong> Las tres muestran prenda real arriba y un h1 que dice qué es: camisetas
            y gorras personalizadas en Cartagena.
          </>,
          <>
            <strong>"Se repite horario y ubicación."</strong> Sale QuickFacts. Dirección y horario van una sola vez en la página,
            en Visítanos (#visitanos). El Footer los cambia por el link "Cómo llegar y horario".
          </>,
          <>
            <strong>"Demasiados WhatsApp."</strong> De 7 entradas genéricas pasamos a 1 o 2 (ver la política al lado).
          </>,
          <>
            <strong>"La mascota se ve horrible."</strong> Sale de la portada en las tres.
          </>,
        ]}
      />
      <Block label="Cómo leer el canvas">
        Una fila por opción: nota (qué resuelve y qué sacrifica), mobile 390 y desktop 1280, y los estados a la derecha. Cada
        pantalla está cortada en el pliegue (844 px en mobile, 800 en desktop): es exactamente lo que se ve sin hacer scroll.
        Los nombres y el contenido son los del doc de Producto. Los h1 bajan a 30-32 px en mobile y 56-60 px en desktop
        (la portada aprobada usa 38 y 68) porque el título ahora suma "en Cartagena" y tiene que caber con la foto antes del
        pliegue.
      </Block>
      <Block label="Fotos">
        Son de ejemplo, del catálogo actual (src/assets/images). Todas son gorras: no hay ninguna foto de camiseta. Ver
        "Qué necesito de Said".
      </Block>
    </Card>
  );
}

const POLICY: { punto: string; a: string; b: string; c: string }[] = [
  { punto: "Botón del hero", a: "Sale: el CTA es Ver lo que hacemos", b: "Queda", c: "Sale" },
  { punto: "Botón flotante", a: "Pastilla con texto: Pide por WhatsApp", b: "Ícono (el de hoy)", c: "Ícono (el de hoy)" },
  { punto: "Header (desktop y menú móvil)", a: "Sale", b: "Sale", c: "Sale" },
  { punto: "QuickFacts del hero", a: "Sale", b: "Sale", c: "Sale" },
  { punto: "Sección Hablemos", a: "Sale", b: "Sale", c: "Sale" },
  { punto: "Footer", a: "Sale WhatsApp (número y link)", b: "Sale WhatsApp (número y link)", c: "Sale WhatsApp (número y link)" },
  { punto: "Diseña la tuya (personalizador)", a: "No cuenta: su botón lleva al personalizador", b: "No cuenta: su botón lleva al personalizador", c: "No aparece" },
  { punto: "Estado vacío de Disponible ahora", a: "Queda (contextual)", b: "Queda (contextual)", c: "Queda (contextual)" },
  { punto: "Ficha de producto", a: "Queda (contextual)", b: "Queda (contextual)", c: "Queda (contextual)" },
];

function Cell({ children }: { children: string }) {
  const tone = children.startsWith("Sale") ? "text-muted" : "text-ink";
  return <td className={`border-t border-line px-3 py-2.5 align-top ${tone}`}>{children}</td>;
}

export function Politica() {
  return (
    <Card width={1100}>
      <Kicker>Política de WhatsApp y datos del negocio</Kicker>
      <Title>Una entrada genérica a WhatsApp, dos como máximo</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        Hoy hay 7 lugares que abren WhatsApp en la portada. La regla nueva: una entrada genérica que siempre esté a mano, y
        WhatsApp contextual solo donde reemplaza algo (la ficha de un producto, la lista vacía).
      </p>
      <table className="w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="text-[12px] uppercase tracking-[.08em] text-muted">
            <th className="px-3 py-2 font-semibold">Punto de hoy</th>
            <th className="px-3 py-2 font-semibold">A · Vitrina</th>
            <th className="px-3 py-2 font-semibold">B · Taller</th>
            <th className="px-3 py-2 font-semibold">C · Tienda</th>
          </tr>
        </thead>
        <tbody>
          {POLICY.map((r) => (
            <tr key={r.punto}>
              <td className="border-t border-line px-3 py-2.5 align-top font-semibold">{r.punto}</td>
              <Cell>{r.a}</Cell>
              <Cell>{r.b}</Cell>
              <Cell>{r.c}</Cell>
            </tr>
          ))}
          <tr className="font-display text-[16px] font-bold">
            <td className="border-t border-line px-3 py-3">Entradas genéricas</td>
            <td className="border-t border-line px-3 py-3 text-accent">1</td>
            <td className="border-t border-line px-3 py-3 text-accent">2</td>
            <td className="border-t border-line px-3 py-3 text-accent">1</td>
          </tr>
        </tbody>
      </table>
      <div className="grid grid-cols-2 gap-8">
        <Block label="Dirección y horario">
          Una vez en la página, en Visítanos (#visitanos, reemplaza a #ubicacion): MapCard en A y C; en B es la tarjeta
          compacta del hero y no se repite abajo. En A y C el hero solo dice "Cartagena"; en B el hero es Visítanos. El
          Footer muestra el link "Cómo llegar y horario" a /#visitanos.
        </Block>
        <Block label="Cambios en el design system al implementar">
          <Bullets
            items={[
              "Header: sin botón de WhatsApp, y en NAV_LINKS Visítanos (#visitanos) reemplaza a Ubicación (las 3).",
              "Footer: sin horario, dirección ni WhatsApp; link a /#visitanos (las 3).",
              "Foto de prenda del hero: alto fijo, eager y fetchpriority high (A y B).",
              "WhatsAppFab: prop label para la pastilla (solo A).",
              "MapCard: variante compacta (solo B).",
            ]}
          />
        </Block>
      </div>
    </Card>
  );
}

function Nota({ letra, nombre, lee, resuelve, sacrifica, whatsapp, orden, nuevo }: {
  letra: string;
  nombre: string;
  lee: string;
  resuelve: string[];
  sacrifica: string[];
  whatsapp: string;
  orden: string;
  nuevo: string;
}) {
  return (
    <Card width={400}>
      <Kicker>Opción {letra}</Kicker>
      <Title>{nombre}</Title>
      <Block label="Lo que se lee en 1 segundo">{lee}</Block>
      <Block label="Qué resuelve">
        <Bullets items={resuelve} />
      </Block>
      <Block label="Qué sacrifica">
        <Bullets items={sacrifica} />
      </Block>
      <Block label="WhatsApp">{whatsapp}</Block>
      <Block label="Orden de la página">{orden}</Block>
      <Block label="Nuevo en el design system">{nuevo}</Block>
    </Card>
  );
}

export function NotaA() {
  return (
    <Nota
      letra="A · recomendada"
      nombre="Vitrina"
      lee="Una gorra bordada que dice Cartagena, el título &quot;Camisetas y gorras personalizadas en Cartagena&quot; y las tres técnicas."
      resuelve={[
        "La foto es lo primero: se sabe que es ropa antes de leer.",
        "El título y las técnicas dicen qué hacen y dónde.",
        "Una sola entrada a WhatsApp, con texto y siempre al alcance del pulgar.",
        "Una sola foto arriba: carga rápido con mala señal.",
      ]}
      sacrifica={[
        "El hero no tiene botón de WhatsApp: lo reemplaza la pastilla flotante.",
        "Dirección y horario quedan al final, en Visítanos.",
        "Sale la sección Quiénes somos: queda la frase del hero.",
        "La pastilla mide unos 220 px de ancho: al hacer scroll tapa más contenido que el ícono (el Footer ya deja libre el final).",
        "El link del hero es de baja énfasis a propósito: la única acción dorada en pantalla es la pastilla.",
      ]}
      whatsapp="1 genérica (la pastilla flotante) + la ficha de producto y el estado vacío."
      orden="Hero, Qué hacemos, Disponible ahora, Diseña la tuya (si hay personalizador), Visítanos, Footer."
      nuevo="WhatsAppFab con label (pastilla de 48 px) y la foto de prenda del hero. Con señal lenta la foto deja su marco y el texto se lee igual (estado a la derecha; en B se comporta igual)."
    />
  );
}

export function NotaB() {
  return (
    <Nota
      letra="B"
      nombre="Taller"
      lee="Qué es, una foto de la prenda y dónde queda el taller con su horario."
      resuelve={[
        "Quien quiere ir al taller tiene todo sin hacer scroll.",
        "La ubicación sale una sola vez: esa tarjeta es la sección Visítanos.",
        "El botón del hero dice lo que hace: Escríbenos por WhatsApp.",
      ]}
      sacrifica={[
        "La foto queda chica (190 px en mobile) y compite con la tarjeta.",
        "La primera pantalla va llena: cuatro bloques, nada respira.",
        "Dos entradas a WhatsApp visibles a la vez (el botón y el flotante).",
      ]}
      whatsapp="2 genéricas (botón del hero + flotante) + la ficha y el estado vacío."
      orden="Hero con Visítanos, Qué hacemos, Disponible ahora, Quiénes somos corto, Diseña la tuya, Footer."
      nuevo="MapCard compacta (dirección, dos horarios y Cómo llegar) y la foto de prenda del hero."
    />
  );
}

export function NotaC() {
  return (
    <Nota
      letra="C"
      nombre="Tienda"
      lee="&quot;Esto es una tienda&quot;: prendas con foto, nombre y color, listas para tocar."
      resuelve={[
        "Lo más concreto posible: lo que hay hoy en el taller.",
        "Cada prenda lleva a su ficha, que ya tiene su WhatsApp.",
      ]}
      sacrifica={[
        "Depende de que haya prendas activas en el admin. Vacía, la primera pantalla no muestra ninguna prenda (estado a la derecha).",
        "Vende inventario y no personalización: va contra el PRD.",
        "Fotos chicas (200 px) y cuatro imágenes que cargar arriba.",
        "El hero no tiene acción dorada: la acción son las prendas.",
        "Hoy las primeras prendas son gorras de equipos con licencia (Chicago, Expos): en una portada que dice personalizadas, confunde.",
      ]}
      whatsapp="1 genérica (flotante) + cada ficha + el estado vacío."
      orden="Hero con Disponible ahora, Qué hacemos, Visítanos, Footer."
      nuevo="Nada: usa ProductCard y EmptyState como están."
    />
  );
}

export function Recomendacion() {
  return (
    <Card width={560}>
      <Kicker>Recomendación de Diseño</Kicker>
      <Title>A · Vitrina</Title>
      <p className="text-[15px] leading-relaxed">
        Es la única que contesta las tres quejas sin abrir una nueva: la prenda y el qué se ven antes que cualquier dato, hay
        una sola entrada a WhatsApp y la ubicación vive en un solo lugar. Producto recomienda la misma.
      </p>
      <p className="text-[15px] leading-relaxed text-muted">
        B sirve si la mayoría de los clientes llega al local a pie; C solo si Said se compromete a mantener Disponible ahora
        con prendas activas todas las semanas.
      </p>
      <Block label="Qué necesito de Said">
        <Bullets
          items={[
            "Elegir A, B o C.",
            "2 o 3 fotos de camisetas hechas en el taller: hoy todas las fotos son gorras y el título promete camisetas.",
            "Confirmar las técnicas que se muestran (Estampado, DTF, Bordado).",
          ]}
        />
      </Block>
    </Card>
  );
}

/* ---------------- Pantallas ---------------- */

export const AMobile = () => (
  <Screen viewport="mobile" links={NAV.a} fab="pill">
    <HeroA viewport="mobile" />
  </Screen>
);
export const ADesktop = () => (
  <Screen viewport="desktop" links={NAV.a} fab="pill">
    <HeroA viewport="desktop" />
  </Screen>
);
export const AMobileCargando = () => (
  <Screen viewport="mobile" links={NAV.a} fab="pill">
    <HeroA viewport="mobile" loading />
  </Screen>
);
export const BMobile = () => (
  <Screen viewport="mobile" links={NAV.b} fab="icon">
    <HeroB viewport="mobile" />
  </Screen>
);
export const BDesktop = () => (
  <Screen viewport="desktop" links={NAV.b} fab="icon">
    <HeroB viewport="desktop" />
  </Screen>
);
export const CMobile = () => (
  <Screen viewport="mobile" links={NAV.c} fab="icon">
    <HeroC viewport="mobile" />
  </Screen>
);
export const CDesktop = () => (
  <Screen viewport="desktop" links={NAV.c} fab="icon">
    <HeroC viewport="desktop" />
  </Screen>
);
export const CMobileVacio = () => (
  <Screen viewport="mobile" links={NAV.c} fab="icon">
    <HeroC viewport="mobile" vacio />
  </Screen>
);
