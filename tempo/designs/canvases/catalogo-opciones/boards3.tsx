import type { ComponentType, ReactNode } from "react";
import type { Viewport } from "./paginas";
import { BEISBOL, DIAS_NUEVO, DOTACION, type Grupo, type Prenda } from "./datos3";
import { MasonryGaleria, MasonryVisor, MuroGaleria, MuroVisor, PerfilGaleria, PerfilVisor, UsoGaleria, UsoVisor } from "./direcciones";

/* ---------------- Narración de la ronda 3 (no es producto) ---------------- */

function Card({ width, children, destacada = false }: { width: number; children: ReactNode; destacada?: boolean }) {
  return (
    <div className={`flex flex-col gap-5 rounded-card border bg-surface p-8 font-body text-ink antialiased ${destacada ? "border-accent" : "border-line"}`} style={{ width }}>
      {children}
    </div>
  );
}
const Kicker = ({ children }: { children: ReactNode }) => <div className="text-[12px] uppercase tracking-[.14em] text-accent">{children}</div>;
const Title = ({ children }: { children: ReactNode }) => <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-tight">{children}</h1>;
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

export function Intro3() {
  return (
    <Card width={620}>
      <Kicker>PRI-130 · Catálogo · ronda 3</Kicker>
      <Title>Cuatro maneras de que el catálogo se sienta cálido sin inventar texto</Title>
      <p className="text-[15px] leading-relaxed text-muted">
        Said rechazó A, B y C de la ronda 2: "se ve frío y simplón". Los datos no cambian: cada prenda tiene categoría,
        varias fotos, fecha y un número, y nombre y descripción pueden estar vacíos o ser basura. Así que el calor
        tiene que salir del diseño: cómo se presentan las fotos, la bienvenida, las categorías y una frase por categoría
        (eso sí vale, es un texto que escribe Said una vez, no uno por prenda).
      </p>
      <Block label="Cómo leer el canvas">
        Una fila por dirección: nota (qué la inspira, qué la hace cálida, qué cuesta), mobile 390 y desktop 1280 de
        "Todo" cortados en el pliegue, el visor abierto (foto grande + WhatsApp + "Más de Béisbol") en 390 y 1280, y la
        categoría vacía. Al final, la lámina "Comparación" con las cuatro lado a lado y mi recomendación. Abajo del todo,
        atenuado, lo descartado en la ronda 2.
      </Block>
      <Block label="Fotos">
        Las del catálogo actual (gorras sobre fondo gris, con su número de hoy) y las de Unsplash que ya usa la portada
        (gente con camisetas y gorras), mientras llegan las reales (PRI-150). Las de Unsplash tienen fecha vieja: no salen
        como "Nuevo" ni arriba de todo, así lo primero que se ve es el catálogo de hoy. Aquí aparecen como prendas (N.º 93
        a 98) solo para ver cada dirección con fotos de gente; en producción no son productos: van como portadas de
        categoría hasta que el taller suba las suyas. El visor de las cuatro usa la misma prenda,
        Béisbol N.º 26, una foto real del catálogo: así se compara el diseño, no la foto.
      </Block>
      <Block label="Te dejé un comentario en cada nota">Responde ahí qué te gusta y qué no de cada dirección; no hace falta elegir una sola.</Block>
    </Card>
  );
}

export function Decisiones3() {
  return (
    <Card width={980}>
      <Kicker>Decisiones de diseño · valen para las cuatro</Kicker>
      <Title>Lo que no cambia entre direcciones</Title>
      <div className="grid grid-cols-2 gap-x-10 gap-y-6">
        <Block label="Bienvenida">
          Título "Así quedan los trabajos" y una línea: "Gorras y camisetas que salieron del taller. Toca la que te guste
          y te hacemos una igual, o a tu manera." Dice qué es la página y qué hacer, en el tono de la portada.
        </Block>
        <Block label="Categorías con conteo">
          "Todo" primero (/products, la entrada nueva de "Catálogo" en el Header) y luego cada categoría con cuántas fotos
          tiene. Es CategoryNav de la ronda 2; en la dirección 4 son las historias destacadas, con el mismo conteo.
        </Block>
        <Block label="Orden y Nuevo">
          Lo más nuevo primero (created_at). "Nuevo" sale si la prenda se subió hace menos de {DIAS_NUEVO} días: es un dato
          real, no inventado. En "Todo" las demás se intercalan por categoría para que no salgan 24 gorras de béisbol
          seguidas. En el visor: "Hace 4 días", también de created_at.
        </Block>
        <Block label="Varias fotos por prenda">
          Las tarjetas muestran la primera foto con un ícono de fotos apiladas y cuántas son. En el visor, carrusel que se
          desliza con el dedo (scroll-snap, sin JS) y puntos debajo.
        </Block>
        <Block label="Sin nombre ni descripción">
          Ninguna tarjeta tiene texto de la prenda. Lo que se lee es de la categoría: su label y su frase ("Gorras
          bordadas para tu equipo o tu liga"). La frase es una columna nueva, categories.tagline, opcional y editable en
          serflow-admin; sin frase se muestra solo el label. El número (N.º 26) queda chico, para hablar por WhatsApp.
        </Block>
        <Block label="WhatsApp">
          En el visor, un botón whatsapp con categoría, número y link a la foto (WhatsApp muestra la vista previa):
          "Pedir una así" en 1 y 2, "Quiero una así" en 3, "Pedir uno así" en 4 (el nombre que pediste). Al elegir, queda
          uno solo. En el visor no va el flotante, para no tener dos. Galería y categoría vacía: solo el flotante.
        </Block>
        <Block label="Categoría vacía">
          EmptyState: "Todavía no hay fotos de Dotación", que igual la hacemos por encargo, y "Ver lo más nuevo" como
          salida (WhatsApp ya está en el flotante).
        </Block>
        <Block label="Movimiento y accesibilidad">
          Lo de la portada: las fotos se destapan al entrar (reveal-wipe), con el mouse suben y hacen zoom (lift y zoom de
          ProductCard), títulos con costura (stitch-title). Con reducir movimiento se apaga todo, también el lift, el zoom y
          el enderezado (motion-reduce). Chips de 44 px, foco
          dorado, alt "Béisbol, foto N.º 26", "Nuevo" siempre con texto, nunca solo color.
        </Block>
        <Block label="Componentes">
          Del design system: Header, Footer, WhatsAppFab, Button whatsapp/secondary/ghost, Section, EmptyState, Thread
          (1), Ticker (3). Propuestas: CategoryNav, Nuevo, FotosPrenda (visor) y la pieza de cada dirección (Polaroid y
          Marquilla, Masonry, GrupoUso, Perfil). La tarjeta solo-foto de 3 no es un componente nuevo: ProductCard gana
          name y meta opcionales, aspect (4:3 o 4:5) y las marcas Nuevo y varias fotos encima. Al aprobar, el papel del
          muro y la marquilla piden un token de superficie clara y un radio chico.
        </Block>
        <Block label="Lo que pide fuera de este repo">
          serflow-admin: la frase por categoría y cambiar las portadas de categoría (image_url), que hoy son fotos
          genéricas (un estadio para Béisbol, una guacamaya para Mi Tierra Querida). Pesan en 3 y 4.
        </Block>
      </div>
    </Card>
  );
}

function Nota({ n, nombre, inspira, calida, cuesta, pide }: { n: string; nombre: string; inspira: ReactNode; calida: ReactNode[]; cuesta: ReactNode[]; pide: ReactNode }) {
  return (
    <Card width={420}>
      <Kicker>Dirección {n}</Kicker>
      <Title>{nombre}</Title>
      <Block label="Qué la inspira">{inspira}</Block>
      <Block label="Qué la hace cálida">
        <Bullets items={calida} />
      </Block>
      <Block label="Qué cuesta">
        <Bullets items={cuesta} />
      </Block>
      <Block label="Qué pide">{pide}</Block>
      <p className="rounded-tile border border-line bg-surface-2 px-4 py-3 text-[14px] leading-relaxed text-muted">Said: tu opinión en el comentario de esta nota.</p>
    </Card>
  );
}

export const Nota1 = () => (
  <Nota
    n="1 · recomendada"
    nombre="Muro del taller"
    inspira="El corcho de un taller de costura: fotos impresas pegadas con cinta o con alfiler, cada una con su marquilla, y el hilo de la portada cruzando el muro."
    calida={[
      "El oficio: papel, cinta, alfiler, marquilla cosida con puntada dorada. Es de Serflow, no de otra app.",
      "Continúa la portada: el mismo hilo y la misma costura en los títulos.",
      "Funciona con las fotos de hoy: el marco de papel les da el contexto que no tienen (gorra sobre fondo gris).",
      "El giro leve (±2°) se endereza al pasar el mouse: se siente a mano, no a plantilla.",
    ]}
    cuesta={[
      "Menos fotos por pantalla: 4 en el celular antes del pliegue (2 columnas), 5 a 10 en desktop.",
      "El Thread hoy es solo de la portada (regla del design system): hay que ampliarla al catálogo.",
    ]}
    pide="En la base, solo la frase de categoría (categories.tagline, opcional: sin ella sale solo el label). Marquilla y Polaroid nuevos en el design system."
  />
);

export const Nota2 = () => (
  <Nota
    n="2"
    nombre="Pinterest / Unsplash"
    inspira="Pinterest y Unsplash: la foto es todo, en columnas de alturas distintas; el visor es la página de una foto con más parecidas debajo."
    calida={[
      "La variedad: alturas mezcladas, la foto de gente al lado de la gorra sola.",
      "Fotos protagonistas, sin marcos: el ojo no se cansa porque el ritmo cambia.",
      "El chip de categoría aparece al pasar el mouse; la tarjeta queda limpia.",
    ]}
    cuesta={[
      "Las fotos del catálogo son todas 3:4 sobre gris: el ritmo sale de recortarlas (1:1, 4:5, 2:3). Con solo esas fotos se ve como una grilla gris.",
      "En el celular no hay hover: la categoría solo se ve en el visor.",
      "El orden baja por columna: \"lo más nuevo primero\" se lee menos claro.",
    ]}
    pide="La frase de categoría (opcional) en el visor. Gana mucho con fotos de gente usando las prendas (PRI-150)."
  />
);

export const Nota3 = () => (
  <Nota
    n="3"
    nombre="Fotos por uso"
    inspira="customink.com/photos/tags/teams: cada grupo abre con una foto grande y una frase de para qué sirve; debajo, sus fotos."
    calida={[
      "La frase de la categoría hace el trabajo del nombre que no hay: \"Para los pelaos de la casa\".",
      "Portadas grandes de gente: se ve el resultado puesto, no la prenda sola.",
      "El Ticker de la portada corre con las frases de uso.",
    ]}
    cuesta={[
      "Depende de las portadas de categoría: hoy son fotos genéricas (estadio, guacamaya). Sin cambiarlas en el admin, se cae.",
      "Agrupa por categoría, no por uso real (Equipos, Negocios...): ese dato no existe. Si Said quiere grupos por uso, es una tabla nueva.",
      "Es la más larga: para llegar a Niños hay que pasar 4 grupos (o tocar el chip).",
      "Se parece a los estantes (C) de la ronda 2, con portada y frase.",
    ]}
    pide="categories.tagline (frase) y portadas nuevas en serflow-admin."
  />
);

export const Nota4 = () => (
  <Nota
    n="4"
    nombre="Perfil de Instagram"
    inspira="El perfil de Instagram: quien llega a Serflow casi siempre viene de ahí. Historias destacadas = categorías, grilla de 3, el visor es un post."
    calida={[
      "La familiaridad: nadie tiene que aprender nada.",
      "El post habla en primera persona (\"serflow Gorras bordadas para tu equipo...\") y dice hace cuánto se hizo.",
      "Más fotos por pantalla que ninguna: 9 enteras antes del pliegue en el celular, y 3 asomadas.",
    ]}
    cuesta={[
      "Se ve como Instagram, no como Serflow: la marca queda en el avatar.",
      "La grilla de 3 es la de la opción A de la ronda 2; el calor lo pone el marco del perfil, no las fotos.",
      "Si el cliente ya vio el Instagram, es lo mismo otra vez.",
    ]}
    pide="Portadas de categoría para las destacadas (las de hoy no sirven)."
  />
);

/** Lámina de comparación: las cuatro en mobile, mismo pliegue, y la recomendación. */
export function Comparacion() {
  const col = (titulo: string, sub: string, Board: ComponentType<{ vp: Viewport }>) => (
    <div className="flex flex-col gap-3">
      <div>
        <p className="font-display text-[22px] font-bold">{titulo}</p>
        <p className="text-[14px] text-muted">{sub}</p>
      </div>
      <div className="w-fit overflow-hidden rounded-[28px] border-4 border-line">
        <Board vp="mobile" />
      </div>
    </div>
  );
  return (
    <div className="flex gap-10 rounded-card border border-line bg-surface p-10 font-body text-ink antialiased" style={{ width: 2400 }}>
      <div className="flex w-[420px] shrink-0 flex-col gap-5">
        <Kicker>Comparación · mobile 390, mismo pliegue</Kicker>
        <Title>Recomiendo 1, Muro del taller</Title>
        <p className="text-[15px] leading-relaxed">
          Es la única donde el calor es de Serflow y no de las fotos. Las del catálogo son gorras sobre fondo gris: 2 y 3
          solo se ven bien con fotos de gente (y 3 además con portadas nuevas), y 4 se ve como Instagram. El muro les pone
          el contexto que no tienen: papel, cinta, la marquilla cosida y el hilo de la portada.
        </p>
        <p className="text-[15px] leading-relaxed">
          Lo que le tomo a las otras: la frase de categoría de 3 (al lado de la marquilla cuando eliges una categoría, y
          como título del visor) y el "Hace 4 días" de 4.
        </p>
        <Block label="Lo que cuesta y cómo lo bajo">
          <Bullets
            items={[
              "Menos fotos por pantalla: 2 columnas en el celular. El visor tiene \"Más de Béisbol\" para seguir sin volver.",
              "El giro queda fijo por posición (no aleatorio) y en ±2°, para que se lea ordenado.",
              "El hilo deja de ser solo de la portada: cambio de regla del design system, una línea en el asset de Thread.",
            ]}
          />
        </Block>
        <Block label="Qué necesito de Said">
          <Bullets
            items={[
              "Elegir dirección (o mezclar: dime qué de cuál).",
              "OK a la frase por categoría (columna nueva en serflow-admin). Las de este canvas son borrador.",
              "OK a sumar \"Catálogo\" al Header, a /products.",
            ]}
          />
        </Block>
      </div>
      <div className="grid flex-1 grid-cols-4 gap-8">
        {col("1 · Muro del taller", "Oficio, papel y el hilo", MuroGaleria)}
        {col("2 · Pinterest", "Alturas mezcladas, sin texto", MasonryGaleria)}
        {col("3 · Por uso", "Portada y frase por categoría", UsoGaleria)}
        {col("4 · Instagram", "Perfil, destacadas, grilla de 3", PerfilGaleria)}
      </div>
    </div>
  );
}

function Seccion({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="flex w-[4450px] items-end gap-6 border-b border-line pb-5 font-body text-ink antialiased">
      <span className="font-display text-[64px] font-bold leading-none text-accent">{n}</span>
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-[40px] font-bold leading-none tracking-tight">{title}</h2>
        <p className="text-[16px] text-muted">{children}</p>
      </div>
    </div>
  );
}

export const SeccionRonda3 = () => (
  <Seccion n="R3" title="Ronda 3: cuatro direcciones con más calor">
    Cada fila: nota · Todo en mobile 390 y desktop 1280 (cortados en el pliegue) · visor en 390 y 1280 · categoría vacía
  </Seccion>
);
export const SeccionDescartadas = () => (
  <Seccion n="R2" title="Descartadas en la ronda 2 (referencia)">
    A, B y C y los estados de A. Said: "se ve frío y simplón". Quedan atenuadas para comparar; no se construyen.
  </Seccion>
);

/* ---------------- Storyboards: cada página con sus datos ---------------- */

const VISOR: Prenda = BEISBOL.prendas[1];
const pag = (C: ComponentType<{ vp: Viewport; cat?: Grupo }>, vp: Viewport, cat?: Grupo) => () => <C vp={vp} cat={cat} />;
const vis = (C: ComponentType<{ vp: Viewport; p: Prenda }>, vp: Viewport) => () => <C vp={vp} p={VISOR} />;

export const MuroMobile = pag(MuroGaleria, "mobile");
export const MuroDesktop = pag(MuroGaleria, "desktop");
export const MuroVisorMobile = vis(MuroVisor, "mobile");
export const MuroVisorDesktop = vis(MuroVisor, "desktop");
export const MuroVacia = pag(MuroGaleria, "mobile", DOTACION);
export const MuroBeisbol = pag(MuroGaleria, "mobile", BEISBOL);

export const MasonryMobile = pag(MasonryGaleria, "mobile");
export const MasonryDesktop = pag(MasonryGaleria, "desktop");
export const MasonryVisorMobile = vis(MasonryVisor, "mobile");
export const MasonryVisorDesktop = vis(MasonryVisor, "desktop");
export const MasonryVacia = pag(MasonryGaleria, "mobile", DOTACION);

export const UsoMobile = pag(UsoGaleria, "mobile");
export const UsoDesktop = pag(UsoGaleria, "desktop");
export const UsoVisorMobile = vis(UsoVisor, "mobile");
export const UsoVisorDesktop = vis(UsoVisor, "desktop");
export const UsoVacia = pag(UsoGaleria, "mobile", DOTACION);

export const PerfilMobile = pag(PerfilGaleria, "mobile");
export const PerfilDesktop = pag(PerfilGaleria, "desktop");
export const PerfilVisorMobile = vis(PerfilVisor, "mobile");
export const PerfilVisorDesktop = vis(PerfilVisor, "desktop");
export const PerfilVacia = pag(PerfilGaleria, "mobile", DOTACION);
