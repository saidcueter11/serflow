import type { ReactNode } from "react";

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

export function Intro() {
  return (
    <Card width={620}>
      <Kicker>PRI-286 + PRI-287 · Portada v3 y movimiento</Kicker>
      <Title>El personalizador sube, el mapa baja, y toda la app se mueve igual</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        Dos pedidos de Said del 20 de octubre. La portada parte de la de hoy en master (B ajustada: carrusel, barra de promos, cinta e hilo) y
        prueba tres formas de poner &quot;Diseña tu prenda&quot; arriba. El movimiento parte de tokens.css, global.css y el canvas design-system/motion,
        sin mascota (PRI-124 cancelado).
      </p>
      <Block label="Cómo leer el canvas">
        <Bullets
          items={[
            "Izquierda, fila 1: la portada en celular (390). Hoy, A, B y C lado a lado, con una nota encima de cada una: qué resuelve, qué sacrifica, qué cuesta construirla.",
            "Izquierda, fila 2: las mismas cuatro en escritorio (1280).",
            "Derecha: el sistema de movimiento. Reglas y tokens, qué cuesta cada animación, y las demos en vivo: entradas, entre páginas, tocar, esperar y confirmar. Cada demo tiene Repetir y Reducir movimiento.",
          ]}
        />
      </Block>
      <Block label="Decisiones que ya tomé (iguales en las tres)">
        <Bullets
          items={[
            "El mapa va al final, al lado de Quiénes somos, plegado: MapCard cerrada, con las calles en CSS y el mapa de Google solo al tocarlo. Sale de la primera pantalla y deja de descargarse para quien no lo abre. #visitanos sigue funcionando desde el menú y el footer.",
            "\"Diseña la tuya\" pasa a \"Diseña tu prenda\" y su botón, \"Diseñar mi prenda →\", lleva a /personaliza.",
            "La vista previa de la portada es la misma foto de camiseta y el mismo diseño de ejemplo del personalizador (PRI-122), quieta: no es el editor, avisa qué hay al otro lado. Al tocarla, crece hasta la vista previa del personalizador.",
            "En B y C el botón del hero pasa a ser Diseñar mi prenda. WhatsApp queda en el flotante y en lo contextual (Disponible vacío, cada promo, la 404).",
            "El botón dorado sin ícono es el mismo que hoy usa Diseña la tuya (Button whatsapp con icon null).",
          ]}
        />
      </Block>
      <Block label="Qué es nuevo">
        Carpeta propuesta/: VistaMini y los tres bloques (BloquePersonaliza, TarjetaPersonaliza, HeroPersonaliza). Son bloques de HomePage, no del design
        system. Carpeta motion/: las clases mo-* y cuatro tokens nuevos. Todo lo demás es el design system tal cual.
      </Block>
      <Block label="Fotos">
        Camiseta y diseño de ejemplo del canvas del personalizador, fotos stock que ya usa la portada y fotos del catálogo actual. Ninguna con datos de
        clientes.
      </Block>
    </Card>
  );
}

export function Recomendacion() {
  return (
    <Card width={560} destacada>
      <Kicker>Mi recomendación</Kicker>
      <Title>Portada B y el sistema de movimiento completo</Title>
      <Block label="Portada: B, en el hero">
        Pone el personalizador en la primera pantalla en celular y en escritorio sin perder el carrusel ni la bienvenida. En escritorio la tarjeta
        ocupa justo la columna que hoy tiene el mapa, así que el cambio en HomePage es chico. A lo deja en la segunda pantalla del celular; C
        sacrifica el carrusel y la bienvenida por algo que todavía no se ha probado con clientes.
      </Block>
      <Block label="Movimiento: un idioma, casi sin JS">
        Seguir con el ClientRouter que ya existe y sumarle la foto que crece entre páginas, el hundirse al tocar, la trama de espera, la costura de
        carga con señal lenta y el chulito que se dibuja. JS nuevo: 2 líneas. El color que cambia solo, únicamente si escoges C.
      </Block>
      <Block label="Qué necesito de ti">
        <Bullets
          items={[
            "Cuál portada: A, B o C. Construyo con B si no dices otra cosa.",
            "Si te parece bien que WhatsApp salga del hero en B (queda el flotante, que ya late a los 4 s).",
            "Si apruebas el sistema de movimiento tal cual o quieres quitar alguna pieza.",
          ]}
        />
      </Block>
    </Card>
  );
}

export function Rotulo({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="flex w-[1100px] items-baseline gap-4 border-b border-line pb-3 font-body text-ink antialiased">
      <span className="font-display text-[22px] font-bold">{titulo}</span>
      <span className="text-[15px] text-muted">{texto}</span>
    </div>
  );
}

export function Nota({
  letra,
  titulo,
  resuelve,
  sacrifica,
  construir,
  recomendada = false,
}: {
  letra: string;
  titulo: string;
  resuelve: ReactNode[];
  sacrifica: ReactNode[];
  construir: string;
  recomendada?: boolean;
}) {
  return (
    <div className={`flex w-[390px] flex-col gap-4 rounded-card border bg-surface p-6 font-body text-ink antialiased ${recomendada ? "border-accent" : "border-line"}`}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full border border-accent font-display text-[18px] font-bold text-accent">{letra}</span>
        <span className="font-display text-[20px] font-bold leading-tight">{titulo}</span>
      </div>
      {recomendada && <span className="self-start rounded-full bg-accent px-3 py-1 text-[12px] font-bold text-primary">Recomendada</span>}
      {resuelve.length > 0 && (
        <Block label="Resuelve">
          <Bullets items={resuelve} />
        </Block>
      )}
      {sacrifica.length > 0 && (
        <Block label="Sacrifica">
          <Bullets items={sacrifica} />
        </Block>
      )}
      <Block label="Construirla">
        <span className="text-muted">{construir}</span>
      </Block>
    </div>
  );
}
