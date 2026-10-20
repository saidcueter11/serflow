/// <reference types="vite/client" />
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Button } from "../../../../../src/components/ui/Button";
import { ErrorState } from "../../../../../src/components/ui/ErrorState";
import { HeroCarousel } from "../../../../../src/components/ui/HeroCarousel";
import { ProductCard } from "../../../../../src/components/ui/ProductCard";
import { PromoCard } from "../../../../../src/components/ui/PromoCard";
import { PromoGrid } from "../../../../../src/components/ui/PromoGrid";
import { Section } from "../../../../../src/components/ui/Section";
import { WhatsAppFab } from "../../../../../src/components/ui/WhatsAppFab";
import type { PromoView } from "../../../../../src/lib/promos";
import { CATALOG_HREF, HOME_SLIDES, PRODUCTS } from "../../../design-system/app-shell/portada";
import { CAP_GREEN, CAP_NAVY, SHIRT_WHITE } from "../../../design-system/cards/samples";
import { VistaMini } from "../propuesta/VistaMini";
import { Demo, Tablero } from "./Demo";
import { EstilosMotion, MOTION_CSS_BYTES } from "./estilos";
// Fotos del catálogo actual (src/assets/images), las mismas que usa la propuesta de PRI-130.
import f1 from "../../../../../src/assets/images/moda/moda1.webp";
import f2 from "../../../../../src/assets/images/beisbol/beisbol2.webp";
import f3 from "../../../../../src/assets/images/miTierraQuerida/miTierraQuerida2.webp";
import f4 from "../../../../../src/assets/images/kids/kid1.webp";
import f5 from "../../../../../src/assets/images/basket/basket1.webp";
import f6 from "../../../../../src/assets/images/moda/moda5.webp";

const FOTOS = [f1, f2, f3, f4, f5, f6];
const RITMO = ["3/4", "1/1", "4/5", "2/3", "1/1", "3/4"];

/** Same-document view transition para la demo. En el sitio la hace el ClientRouter al navegar, con el mismo CSS. */
function transicion(rm: boolean, nombre: string, antes: HTMLElement | null | undefined, update: () => void, despues?: () => HTMLElement | null | undefined) {
  if (rm || !document.startViewTransition) {
    update();
    return;
  }
  if (antes) antes.style.viewTransitionName = nombre;
  const vt = document.startViewTransition(() => {
    flushSync(update);
    if (antes) antes.style.viewTransitionName = "";
    const d = despues?.();
    if (d) d.style.viewTransitionName = nombre;
  });
  vt.finished.finally(() => {
    const d = despues?.();
    if (d) d.style.viewTransitionName = "";
  });
}

function Volver({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-3 top-3 z-10 flex min-h-11 items-center rounded-full border border-line bg-primary/85 px-4 text-[14px] font-semibold text-ink hover:border-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      ← Volver
    </button>
  );
}

function Pista({ children }: { children: ReactNode }) {
  return <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-primary/85 px-3 py-1 text-[12px] text-muted">{children}</div>;
}

/* ================================ Sistema ================================ */

function Regla({ n, titulo, children }: { n: string; titulo: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="font-display text-[22px] font-medium leading-none text-accent">{n}</span>
      <div>
        <h3 className="text-[16px] font-bold">{titulo}</h3>
        <p className="mt-1 text-[14px] leading-relaxed text-muted">{children}</p>
      </div>
    </li>
  );
}

const C = ({ children }: { children: ReactNode }) => <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[12px] text-ink">{children}</code>;

export function MotionSistema() {
  return (
    <Tablero
      titulo="Un solo idioma de movimiento: costura, no fuegos artificiales"
      texto="Todo se cose, se posa o se hunde, como en el taller. Parte de lo que ya hay en tokens.css y global.css (entrada del hero, reveal, costura de títulos, hilo, cinta, carrusel, ClientRouter con fundido) y le suma lo que falta: tocar, esperar, confirmar y pasar de una página a otra."
    >
      <div className="grid w-full grid-cols-[1fr_1fr] gap-10">
        <ul className="flex flex-col gap-5">
          <Regla n="01" titulo="Una entrada por pantalla, no por elemento">
            Lo de arriba entra al cargar (<C>anim-enter</C>, máximo 4 piezas). Lo de abajo aparece al bajar con <C>reveal-up</C>, por bloque y no
            por card. El catálogo es la excepción: cada foto se destapa (<C>reveal-wipe</C>, PRI-130) porque la foto es el contenido.
          </Regla>
          <Regla n="02" titulo="Navegar se siente continuo">
            El ClientRouter que ya está hace fundido de 200 ms, deja quieto el header y ya hace
            crecer la foto del catálogo hasta su página. Se extiende a la promo (al detalle) y a la vista previa de la portada (al personalizador).
          </Regla>
          <Regla n="03" titulo="Tocar responde en 120 ms y se hunde">
            Todo lo tocable se hunde: los botones como ya lo hacen (el dorado 3 px, lo que mide su sombra; el secundario 1 px) y cards y fotos 2 px,
            que hoy no hacen nada. El flotante se encoge porque flota. Con mouse, la card sube y el borde se aclara (ya existe). Nada de escalar cards
            ni de rebotes.
          </Regla>
          <Regla n="04" titulo="Esperar se ve como tela, nunca bloquea">
            Mientras llega una foto se ve la trama con un barrido suave (6 pasadas y quieta). Si una página tarda más de 280 ms, una costura dorada
            avanza arriba. El girador solo en el personalizador, y después de 5 s hay salida.
          </Regla>
          <Regla n="05" titulo="Confirmar cosiendo">
            Lo que sale bien se dibuja (el chulito de Vista previa guardada, el hilo suelto de la 404). Los errores aparecen con un fundido, sin
            sacudidas.
          </Regla>
          <Regla n="06" titulo="Lo que se repite solo, contado">
            Bucles solo los que ya existen (cinta, carrusel, barra de promos) más los de espera. Ninguno nuevo de adorno, salvo el color que cambia en
            la opción C de la portada.
          </Regla>
        </ul>
        <div className="flex flex-col gap-6">
          <div className="rounded-card border border-line bg-surface p-5">
            <h3 className="text-[15px] font-bold">Tokens</h3>
            <table className="mt-3 w-full text-left text-[14px]">
              <tbody className="divide-y divide-line">
                {[
                  ["--motion-fast", "120 ms", "Tocar, hover de color", "Ya existe"],
                  ["--motion-med", "200 ms", "Fundidos, cambio de página", "Ya existe"],
                  ["--motion-slow", "280 ms", "Hojas, foto que crece, card que sube", "Ya existe"],
                  ["--motion-enter", "600 ms", "Entradas y lo que se posa (hoy 0.7s fijo en anim-enter)", "Nuevo"],
                  ["--ease-enter", "0.2, 0.7, 0.2, 1", "Entradas (hoy fija en anim-enter)", "Nuevo"],
                  ["--motion-spin", "900 ms", "Girador del personalizador (PRI-122)", "Nuevo"],
                  ["--motion-shimmer", "1.4 s", "Barrido de espera (PRI-122)", "Nuevo"],
                ].map(([t, v, uso, e]) => (
                  <tr key={t}>
                    <td className="py-2 pr-3 font-mono text-[12px]">{t}</td>
                    <td className="py-2 pr-3">{v}</td>
                    <td className="py-2 pr-3 text-muted">{uso}</td>
                    <td className={`whitespace-nowrap py-2 text-[12px] font-semibold ${e === "Nuevo" ? "text-accent" : "text-muted"}`}>{e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-card border border-line bg-surface p-5">
            <h3 className="text-[15px] font-bold">Dos interruptores que ya existen y lo apagan todo</h3>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-[14px] leading-relaxed text-muted marker:text-accent">
              <li>
                <span className="text-ink">Reducir movimiento</span> (global.css): sin animaciones ni transiciones; se ve todo quieto y completo. Cada demo
                tiene el interruptor para verlo.
              </li>
              <li>
                <span className="text-ink">Señal lenta</span> (<C>.slow-connection</C>, con 2G o ahorro de datos): igual. Se le suma apagar también las
                view transitions, que hoy se le escapan.
              </li>
              <li>Lo que depende del scroll usa animation-timeline: donde el navegador no lo soporta, se ve quieto.</li>
            </ul>
          </div>
          <div className="rounded-card border border-line bg-surface p-5">
            <h3 className="text-[15px] font-bold">Lo que hoy está disparejo (y se arregla con esto)</h3>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-[14px] leading-relaxed text-muted marker:text-accent">
              <li>Las cards y las fotos no responden al tocar en el celular; solo los botones lo hacen.</li>
              <li>
                La card que sube con el mouse salta en vez de deslizarse: Tailwind 4 mueve con la propiedad <C>translate</C> y ProductCard y PromoCard solo
                animan <C>transform</C>. Se arregla sumando translate a su transición.
              </li>
              <li>
                ProductCard, PromoCard y ServiceCard acercan la foto con el mouse, contra lo que dice el uso de ProductCard en el design system (&quot;sin scale en hover&quot;): se
                quita. El acercamiento queda solo en las fotos del catálogo (PRI-130).
              </li>
              <li>
                Duración fija fuera de los tokens: <C>0.7s</C> en anim-enter pasa a <C>--motion-enter</C>. El paso de <C>55ms</C> del escalonado de catalog-in se queda, documentado en su clase (<C>--stagger-step</C>), como <C>--swap-cycle</C>.
              </li>
              <li>El personalizador (PRI-122) trae sus propias pz-spin, pz-shimmer, pz-sheet y pz-fade: pasan a ser las del sistema.</li>
            </ul>
          </div>
        </div>
      </div>
    </Tablero>
  );
}

/* ================================ Costos ================================ */

type Fila = [string, string, string, string, string, string];

const FILAS: Fila[] = [
  ["Entrada del hero (anim-enter)", "Portada, 404, promos", "transform, opacity", "0", "Una vez", "Muy bajo"],
  ["Bloques al bajar (reveal-up) y costura de títulos", "Todas", "transform, opacity", "0", "Una vez", "Muy bajo"],
  ["Foto que se destapa (reveal-wipe)", "Catálogo, Disponible", "clip-path (repinta la foto)", "0", "Una vez por foto", "Bajo"],
  ["El diseño se posa (mo-land)", "Portada, personalizador", "transform, opacity", "0", "Una vez", "Muy bajo"],
  ["Color que cambia solo (mo-swap)", "Solo portada C", "opacity + 1 foto más", "0", "Bucle cada 10 s", "Medio"],
  ["Hilo suelto de la 404 (mo-loose)", "404", "trazo SVG", "0", "Una vez", "Bajo"],
  ["Fundido entre páginas", "Todas", "opacity (captura de pantalla)", "Ya está (ClientRouter)", "Al navegar", "Muy bajo"],
  ["Foto que crece a la página siguiente", "Catálogo (ya existe), promos, portada", "transform (captura)", "0 (transition:name)", "Al navegar", "Bajo"],
  ["Costura de carga arriba (mo-navbar)", "Todas", "transform", "2 líneas", "Solo si tarda > 280 ms", "Muy bajo"],
  ["Se hunde al tocar (mo-card)", "Cards, fotos", "transform", "0", "Al tocar", "Muy bajo"],
  ["Card que sube con el mouse", "Cards (ya existe)", "translate, border", "0", "Al pasar", "Muy bajo"],
  ["Barrido de espera (mo-wait)", "Fotos", "transform", "0", "6 pasadas", "Bajo"],
  ["Brillo y girador (mo-shine, mo-spin)", "Personalizador", "transform", "0", "Bucle mientras espera", "Bajo"],
  ["Hoja que sube (mo-sheet)", "Personalizador", "transform, opacity", "0", "Una vez", "Muy bajo"],
  ["Chulito que se dibuja (mo-check)", "Personalizador", "trazo SVG", "0", "Una vez", "Bajo"],
  ["Cinta, carrusel y barra de promos", "Portada (ya existen)", "transform, opacity", "0", "Bucle siempre", "Medio"],
  ["Latido del flotante (anim-ring)", "Todas (ya existe)", "box-shadow (repinta)", "0", "3 veces a los 4 s", "Bajo"],
  ["Hilo de bordado", "Portada (ya existe)", "trazo SVG con el scroll", "thread.ts (ya está)", "Con el scroll", "Bajo"],
];

export function MotionCostos() {
  return (
    <Tablero
      titulo="Qué cuesta cada una"
      texto={
        <>
          Estimado para un celular con mala señal, por lo que mueve cada una. Todo es CSS que viaja con la hoja de estilos que ya se descarga: el CSS nuevo suma{" "}
          <span className="font-semibold text-ink">{MOTION_CSS_BYTES.toLocaleString("es-CO")} bytes sin comprimir</span> (medido en vivo sobre la
          propuesta), y JS nuevo solo las 2 líneas de la costura de carga. Muy bajo = solo mueve transform u opacity, una vez, en la GPU sin repintar. Bajo
          = repinta un área chica, o es un bucle que solo corre mientras se espera. Medio = bucle que corre todo el tiempo o descarga extra.
        </>
      }
    >
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-line text-[12px] uppercase tracking-[.1em] text-muted">
            {["Animación", "Dónde", "Qué mueve", "JS", "Cuándo corre", "Costo"].map((h) => (
              <th key={h} className="py-3 pr-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {FILAS.map((f) => (
            <tr key={f[0]}>
              {f.map((c, i) => (
                <td key={i} className={`py-2.5 pr-4 ${i === 0 ? "font-semibold" : "text-muted"} ${i === 5 && c === "Medio" ? "!text-danger" : ""} ${i === 5 && c === "Muy bajo" ? "!text-ok" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Tablero>
  );
}

/* ================================ Entradas ================================ */

const enCarga = { mueve: "transform, opacity", js: "0", nivel: "muy bajo" } as const;

function Masonry({ wipe = true }: { wipe?: boolean }) {
  return (
    <ul className="columns-2 gap-2">
      {[...FOTOS, ...FOTOS].map((src, i) => (
        <li key={i} className="mb-2 break-inside-avoid">
          <img src={src} alt="" className={`fabric w-full rounded-tile bg-surface-2 object-cover ${wipe ? "reveal-wipe" : ""}`} style={{ aspectRatio: RITMO[i % RITMO.length] }} />
        </li>
      ))}
    </ul>
  );
}

export function MotionEntradas() {
  return (
    <Tablero
      titulo="Entradas: lo de arriba entra, lo de abajo aparece al bajar"
      texto="Las de scroll se prueban desplazándose dentro del recuadro. Repetir vuelve a montar la demo; Reducir movimiento la muestra como la ve quien tiene esa opción."
    >
      <EstilosMotion />
      <Demo titulo="Entrada del hero" texto="Kicker, título, texto y botón suben uno tras otro (100 ms entre cada uno). Pasa a usar --motion-enter." costo={{ ...enCarga, estado: "Cambia" }}>
        <HeroCarousel slides={HOME_SLIDES} className="h-[320px] w-full">
          <div className="anim-enter absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-5">
            <span className="text-[12px] font-semibold uppercase tracking-[.14em] text-accent">Mercado Bazurto · Cartagena</span>
            <span className="font-display text-[34px] font-medium leading-none">Bienvenido a Serflow</span>
            <span className="text-[14px] text-ink/85">Camisetas y gorras con tu logo, tu equipo o tu idea.</span>
            <Button variant="whatsapp" href="#" icon={null}>
              Diseñar mi prenda →
            </Button>
          </div>
        </HeroCarousel>
      </Demo>
      <Demo titulo="El diseño se posa sobre la prenda" texto="En la vista previa de la portada y al subir un diseño en el personalizador: cae un poco desde arriba y se asienta sobre la tela." costo={{ ...enCarga, estado: "Nuevo" }}>
        <VistaMini className="h-[320px] w-full" />
      </Demo>
      <Demo titulo="Bloques al bajar" texto="Cada sección sube al entrar y la costura dorada del título se cose. Por bloque, no por card. Desplázate dentro del recuadro." costo={{ ...enCarga, mueve: "transform, opacity, scaleX", estado: "Ya existe" }}>
        <div className="h-[320px] overflow-y-auto">
          <div className="flex h-[300px] items-center justify-center text-[14px] text-muted">Desplázate hacia abajo ↓</div>
          <Section title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño.">
            <div className="reveal-up grid grid-cols-3 gap-2">
              {FOTOS.slice(0, 3).map((s) => (
                <img key={s} src={s} alt="" className="aspect-square w-full rounded-tile object-cover" />
              ))}
            </div>
          </Section>
          <Section title="Disponible ahora" description="Lo que hay en el taller esta semana.">
            <div className="reveal-up h-[120px] rounded-card border border-line bg-surface" />
          </Section>
        </div>
      </Demo>
      <Demo titulo="Catálogo: cada foto se destapa" texto="La propuesta de PRI-130: la foto se descubre de arriba abajo al entrar. Recorta (clip-path), así que repinta la foto: bien para fotos, no para texto." costo={{ mueve: "clip-path", js: "0", nivel: "bajo", estado: "Ya existe" }}>
        <div className="h-[320px] overflow-y-auto p-2">
          <div className="h-[200px]" />
          <Masonry />
        </div>
      </Demo>
      <Demo titulo="404: el hilo se suelta" texto="El hilo sale de la aguja y queda suelto bajo el título, una vez. Reemplaza la mascota que ya no va (PRI-124)." costo={{ mueve: "trazo SVG", js: "0", nivel: "bajo", estado: "Nuevo" }}>
        <div className="flex h-[320px] flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="anim-enter flex flex-col items-center gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-[.14em] text-accent">Error 404</span>
            <span className="font-display text-[40px] font-bold leading-none">Esta página no existe</span>
          </div>
          <svg viewBox="0 0 400 90" className="mo-loose w-[340px]" aria-hidden="true">
            <ellipse cx="22" cy="58" rx="16" ry="3" transform="rotate(-24 22 58)" fill="var(--color-muted)" />
            <path pathLength={1} d="M36 52 C 90 8, 130 92, 190 46 S 300 10, 330 58 S 372 86, 388 70" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="text-[14px] text-muted">Puede que el link esté viejo o mal copiado.</span>
        </div>
      </Demo>
      <Demo titulo="Color que cambia solo (solo portada C)" texto="La camiseta pasa de negra a blanca y vuelve cada 10 s, para decir sin palabras que el color se escoge. Pide una foto más." costo={{ mueve: "opacity + 1 foto", js: "0", nivel: "medio", estado: "Nuevo" }}>
        <VistaMini alterna aterriza="no" etiqueta="Así se ve tu diseño" className="h-[320px] w-full" />
      </Demo>
    </Tablero>
  );
}

/* ================================ Entre páginas ================================ */

function CatalogoVisor({ rm }: { rm: boolean }) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const ultima = useRef(0);
  const grid = useRef<HTMLDivElement>(null);
  const visor = useRef<HTMLImageElement>(null);
  const abrir = (e: MouseEvent<HTMLButtonElement>, i: number) => {
    ultima.current = i;
    transicion(rm, "foto", e.currentTarget.querySelector("img"), () => setAbierta(i), () => visor.current);
  };
  const cerrar = () => transicion(rm, "foto", visor.current, () => setAbierta(null), () => grid.current?.querySelectorAll("img")[ultima.current] as HTMLElement | undefined);
  return (
    <div className="h-[380px]">
      {abierta === null ? (
        <div ref={grid} className="grid h-full grid-cols-3 gap-2 overflow-hidden p-2">
          {FOTOS.map((src, i) => (
            <button key={src} type="button" onClick={(e) => abrir(e, i)} className="mo-card overflow-hidden rounded-tile transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0.5" aria-label={`Abrir foto ${i + 1}`}>
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          <Pista>Toca una foto</Pista>
        </div>
      ) : (
        <div className="relative flex h-full items-center justify-center bg-primary">
          <Volver onClick={cerrar} />
          <img ref={visor} src={FOTOS[abierta]} alt="" className="h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}

const PROMOS: PromoView[] = [
  {
    slug: "2x1-gorras-bordadas",
    title: "2x1 en gorras bordadas",
    description: "Llevas dos gorras con el mismo bordado y pagas una.",
    endsAt: "2026-10-31T23:59:00-05:00",
    cover: { src: CAP_NAVY, alt: "Gorra azul oscuro bordada (foto de ejemplo)" },
    photos: [{ src: CAP_GREEN, alt: "Gorra verde bordada (foto de ejemplo)" }],
  },
  {
    slug: "camisetas-equipos",
    title: "10% en camisetas para equipos",
    description: "Desde 10 camisetas con nombre y número.",
    endsAt: null,
    cover: { src: SHIRT_WHITE, alt: "Camiseta blanca estampada (foto de ejemplo)" },
    photos: [],
  },
];

function PromoDetalle({ rm }: { rm: boolean }) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const ultima = useRef(0);
  const lista = useRef<HTMLDivElement>(null);
  const portada = useRef<HTMLImageElement>(null);
  const abrir = (e: MouseEvent<HTMLDivElement>, i: number) => {
    e.preventDefault();
    ultima.current = i;
    transicion(rm, "promo", e.currentTarget.querySelector("img"), () => setAbierta(i), () => portada.current);
  };
  const cerrar = () =>
    transicion(rm, "promo", portada.current, () => setAbierta(null), () => lista.current?.querySelectorAll("img")[ultima.current] as HTMLElement | undefined);
  const p = abierta === null ? null : PROMOS[abierta];
  return (
    <div className="@container min-h-[430px] overflow-hidden">
      {p ? (
        <div className="relative flex h-full flex-col">
          <Volver onClick={cerrar} />
          <img ref={portada} src={p.cover!.src} alt={p.cover!.alt} className="h-[230px] w-full bg-surface-2 object-cover" />
          <div className="mo-fade flex flex-col gap-1 p-5">
            <span className="text-[12px] font-semibold uppercase tracking-[.14em] text-accent">Promo</span>
            <span className="font-display text-[26px] font-bold leading-tight">{p.title}</span>
            <span className="text-[14px] text-muted">{p.description}</span>
          </div>
        </div>
      ) : (
        <div ref={lista} className="relative p-3">
          <PromoGrid>
            {PROMOS.slice(0, 1).map((promo, i) => (
              <div key={promo.slug} className="mo-card w-full" onClickCapture={(e) => abrir(e, i)}>
                <PromoCard promo={promo} headingLevel={3} />
              </div>
            ))}
          </PromoGrid>
          <Pista>Toca la promo</Pista>
        </div>
      )}
    </div>
  );
}

function PortadaAlPersonalizador({ rm }: { rm: boolean }) {
  const [en, setEn] = useState<"portada" | "personaliza">("portada");
  const ir = (a: "portada" | "personaliza") => transicion(rm, "x", null, () => setEn(a));
  return (
    <div className="h-[380px]">
      {en === "portada" ? (
        <div className="relative flex h-full flex-col justify-end gap-3 p-4">
          <img src={HOME_SLIDES[0].src} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: HOME_SLIDES[0].position }} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
          <div className="relative font-display text-[26px] font-medium leading-tight">Bienvenido a Serflow</div>
          <button
            type="button"
            onClick={() => ir("personaliza")}
            className="mo-card relative flex overflow-hidden rounded-card border border-secondary/50 bg-surface text-left transition-transform active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <VistaMini morph etiqueta="" aterriza="no" className="h-[140px] w-[112px] shrink-0" />
            <span className="flex flex-col justify-center gap-1 p-4">
              <span className="font-display text-[20px] font-medium">Diseña tu prenda</span>
              <span className="text-[14px] font-semibold text-accent">Probar el personalizador →</span>
            </span>
          </button>
        </div>
      ) : (
        <div className="relative grid h-full grid-cols-[1.1fr_1fr]">
          <Volver onClick={() => ir("portada")} />
          <VistaMini morph aterriza="no" etiqueta="Camiseta negra" className="h-full" />
          <div className="mo-sheet flex flex-col justify-center gap-2 p-5">
            <span className="text-[12px] font-semibold uppercase tracking-[.14em] text-accent">Paso 1 de 3</span>
            <span className="font-display text-[22px] font-medium leading-tight">Sube tu diseño o una foto</span>
            <span className="text-[13px] text-muted">El panel del personalizador (PRI-122) sube con la hoja; la foto ya estaba.</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SenalLenta({ rm }: { rm: boolean }) {
  const [estado, setEstado] = useState<"inicio" | "cargando" | "listo">("inicio");
  useEffect(() => {
    if (estado !== "cargando") return;
    const t = setTimeout(() => setEstado("listo"), 3200);
    return () => clearTimeout(t);
  }, [estado]);
  return (
    <div className="relative flex h-[200px] flex-col items-center justify-center gap-3 p-4 text-center">
      <span className={`mo-navbar ${estado === "cargando" ? "mo-navbar-on" : ""}`} />
      {estado === "listo" ? (
        <>
          <span className="mo-fade font-display text-[22px] font-medium">Gorras · Mi tierra querida</span>
          <button type="button" onClick={() => setEstado("inicio")} className="text-[14px] font-semibold text-accent underline-offset-4 hover:underline">
            Otra vez
          </button>
        </>
      ) : (
        <>
          <span className="text-[14px] text-muted">{estado === "cargando" ? "Cargando la página (3 s de espera)…" : "Simula tocar un link cuando la página tarda en llegar."}</span>
          <div onClick={() => setEstado("cargando")}>
            <Button variant="secondary" icon={null}>
              Ver gorras →
            </Button>
          </div>
        </>
      )}
      {rm && <span className="text-[12px] text-muted">Con reducir movimiento (o con 2G y ahorro de datos) la costura aparece fija, sin avanzar.</span>}
    </div>
  );
}

export function MotionPaginas() {
  return (
    <Tablero
      titulo="Entre páginas: la foto que tocas te acompaña"
      texto={
        <>
          El sitio ya usa el ClientRouter de Astro (Layout.astro): fundido de 200 ms, header quieto y la foto del catálogo que crece hasta su página
          (transition:name en cada foto, 0 JS). Propongo quedarnos con él (los scripts ya escuchan astro:page-load y el visor de PRI-130 usa
          data-astro-history), llevar ese mismo crecer a promos y portada, y sumar la costura de carga con señal lenta. Aquí se simula en la misma
          página con un poco de JS de demo; en el sitio lo hace el router con el mismo CSS.
        </>
      }
    >
      <EstilosMotion />
      <Demo titulo="Catálogo → visor" texto="La foto crece del mosaico al visor y vuelve a su sitio con Volver. Ya pasa hoy en el catálogo (un nombre por foto); se mantiene en el mosaico de PRI-130 con la duración del sistema." costo={{ mueve: "transform (captura)", js: "0", nivel: "bajo", estado: "Ya existe" }}>
        {(rm) => <CatalogoVisor rm={rm} />}
      </Demo>
      <Demo titulo="Promo → detalle" texto="La portada de la promo crece hasta la cabecera del detalle; el texto entra con un fundido." costo={{ mueve: "transform (captura)", js: "0", nivel: "bajo", estado: "Nuevo" }}>
        {(rm) => <PromoDetalle rm={rm} />}
      </Demo>
      <Demo titulo="Portada → personalizador" texto="La vista previa de la portada se vuelve la vista previa de /personaliza: misma foto, más grande. El panel de pasos sube." costo={{ mueve: "transform (captura)", js: "0", nivel: "bajo", estado: "Nuevo" }}>
        {(rm) => <PortadaAlPersonalizador rm={rm} />}
      </Demo>
      <Demo titulo="Señal lenta: costura de carga" texto="Si la página siguiente tarda más de 280 ms, una costura dorada avanza arriba. Así nadie toca dos veces. Con señal rápida no se alcanza a ver; con 2G o ahorro de datos sale fija." costo={{ mueve: "transform", js: "2 líneas", nivel: "muy bajo", estado: "Nuevo" }}>
        {(rm) => <SenalLenta rm={rm} />}
      </Demo>
    </Tablero>
  );
}

/* ================================ Tocar ================================ */

export function MotionTocar() {
  return (
    <Tablero titulo="Tocar y pasar el mouse" texto="Pruébalas con el mouse: pasa por encima y haz clic sostenido. En el celular solo existe el tocar, así que todo lo importante pasa ahí.">
      <EstilosMotion />
      <Demo titulo="Botones" texto="El dorado se hunde 3 px y pierde la sombra; el secundario baja 1 px y aclara el borde. Ya están así: es la referencia del resto." costo={{ mueve: "transform, box-shadow", js: "0", nivel: "muy bajo", estado: "Ya existe" }}>
        <div className="flex h-[200px] flex-col items-center justify-center gap-3 p-4">
          <Button variant="whatsapp" icon={null}>
            Diseñar mi prenda →
          </Button>
          <Button variant="secondary" icon={null}>
            Cómo llegar
          </Button>
        </div>
      </Demo>
      <Demo titulo="Cards" texto="Con mouse sube 4 px y el borde se aclara (ya existe; hoy salta, se arregla la transición). Nuevo: al tocar se hunde 2 px. Se quita el acercamiento de la foto que tiene hoy, porque su uso en el design system lo prohíbe (aquí todavía se acerca: es el componente de hoy)." costo={{ mueve: "translate, border, transform", js: "0", nivel: "muy bajo", estado: "Cambia" }}>
        <div className="grid h-[300px] grid-cols-2 items-center gap-3 p-4" onClickCapture={(e) => e.preventDefault()}>
          {PRODUCTS.slice(0, 2).map((p) => (
            <div key={p.name} className="mo-card">
              <ProductCard name={p.name} meta={p.meta} href={CATALOG_HREF} image={{ src: p.src, alt: p.name }} />
            </div>
          ))}
        </div>
      </Demo>
      <Demo titulo="Fotos del catálogo" texto="Con mouse la foto se acerca y aparece su categoría (propuesta de PRI-130). Al tocar se hunde 2 px antes de crecer al visor." costo={{ mueve: "transform, opacity", js: "0", nivel: "muy bajo", estado: "Cambia" }}>
        <div className="grid h-[300px] grid-cols-3 items-center gap-2 p-4">
          {FOTOS.slice(0, 3).map((src) => (
            <button key={src} type="button" className="mo-card group relative aspect-[3/4] overflow-hidden rounded-tile transition-transform active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-(--motion-slow) ease-out group-hover:scale-105" />
              <span className="absolute bottom-2 left-2 rounded-full border border-line bg-primary/85 px-2.5 py-1 text-[12px] font-semibold text-ink opacity-0 transition-opacity duration-(--motion-med) group-hover:opacity-100 group-focus-visible:opacity-100">
                Gorras
              </span>
            </button>
          ))}
        </div>
      </Demo>
      <Demo titulo="Botón flotante de WhatsApp" texto="Late 3 veces a los 4 s de cargar y se encoge al tocarlo. Se queda como está: es lo único flotante." costo={{ mueve: "box-shadow (repinta), transform", js: "0", nivel: "bajo", estado: "Ya existe" }}>
        <div className="flex h-[300px] items-center justify-center">
          <WhatsAppFab placement="inline" />
        </div>
      </Demo>
    </Tablero>
  );
}

/* ================================ Cargas y feedback ================================ */

function FotoQueLlega() {
  const [llego, setLlego] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLlego(true), 2800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="grid h-[300px] grid-cols-2 gap-3 p-4">
      {[f2, f5].map((src) => (
        <div key={src} className="mo-wait fabric rounded-tile bg-surface-2">
          {llego && <img src={src} alt="" className="mo-fade h-full w-full object-cover" />}
        </div>
      ))}
      <Pista>{llego ? "Llegó la foto" : "Esperando la foto (3 s)…"}</Pista>
    </div>
  );
}

function Girador({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`mo-spin ${className}`} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function HojaQueSube() {
  const [abierta, setAbierta] = useState(false);
  const [guardada, setGuardada] = useState(false);
  const disparador = useRef<HTMLDivElement>(null);
  const hoja = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (abierta) hoja.current?.focus();
  }, [abierta]);
  const cerrar = () => {
    setAbierta(false);
    setGuardada(false);
    disparador.current?.querySelector("button")?.focus();
  };
  return (
    <div className="relative h-[300px]">
      {/* Los Button sin href son <button>: el clic sube hasta este div. */}
      <div ref={disparador} className="flex h-full items-end p-4" onClick={() => setAbierta(true)}>
        <div className="w-full">
          <Button variant="whatsapp" icon={null} fullWidth>
            Enviar por WhatsApp
          </Button>
        </div>
      </div>
      {abierta && (
        <div className="absolute inset-0 flex items-end bg-primary/70 mo-fade">
          <div
            ref={hoja}
            tabIndex={-1}
            role="dialog"
            aria-label="Revisa y envía"
            onKeyDown={(e) => e.key === "Escape" && cerrar()}
            className="mo-sheet flex w-full flex-col gap-3 rounded-t-card border-t border-line bg-surface p-5 outline-none"
          >
            <span className="font-display text-[20px] font-medium">Revisa y envía</span>
            {guardada ? (
              <span className="mo-fade flex items-center gap-2 text-[15px] font-semibold text-ok" role="status">
                <svg viewBox="0 0 24 24" className="mo-check size-6" fill="none" aria-hidden="true">
                  <path pathLength={1} d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Vista previa guardada
              </span>
            ) : (
              <div onClick={() => setGuardada(true)}>
                <Button variant="secondary" icon={null} fullWidth>
                  Guardar la vista previa
                </Button>
              </div>
            )}
            <button type="button" onClick={cerrar} className="min-h-11 text-[14px] font-semibold text-muted hover:text-ink">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function MotionCargas() {
  return (
    <Tablero titulo="Esperar y confirmar" texto="Las cargas nunca bloquean la página; lo que confirma se dibuja. Preparando, la hoja y el chulito son del personalizador (PRI-122), unificados con el resto.">
      <EstilosMotion />
      <Demo titulo="Foto que llega tarde" texto="Mientras llega, la trama con un barrido suave detrás; la foto la tapa al llegar. Son 6 pasadas (unos 8 s) y se queda quieta, para no gastar batería con una foto que no llegó." costo={{ mueve: "transform", js: "0", nivel: "bajo", estado: "Nuevo" }}>
        <FotoQueLlega />
      </Demo>
      <Demo titulo="Preparando tu diseño" texto="Personalizador: brillo sobre la vista previa y girador en el botón. A los 5 s aparece Seguir sin vista previa (PRI-122)." costo={{ mueve: "transform", js: "0", nivel: "bajo", estado: "Cambia" }}>
        <div className="flex h-[300px] flex-col items-center gap-3 p-4">
          <div className="mo-shine h-[212px] w-[220px] shrink-0 overflow-hidden rounded-tile">
            <VistaMini aterriza="no" etiqueta="" className="h-full w-full" />
          </div>
          <div className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-bold text-primary" role="status">
            <Girador className="size-5" /> Preparando tu diseño…
          </div>
        </div>
      </Demo>
      <Demo titulo="Hoja que sube y vista previa guardada" texto="Toca Enviar: la hoja sube en 280 ms. Toca Guardar: el chulito se dibuja. Cerrar o Esc la cierran y el foco vuelve al botón." costo={{ mueve: "transform, opacity, trazo", js: "0", nivel: "bajo", estado: "Cambia" }}>
        <HojaQueSube />
      </Demo>
      <Demo titulo="Error que aparece" texto="Entra con un fundido de 200 ms, sin sacudirse: quien está sin señal no necesita que la pantalla tiemble." costo={{ mueve: "opacity", js: "0", nivel: "muy bajo", estado: "Cambia" }}>
        <div className="mo-fade p-4">
          <ErrorState kind="offline" retryHref="#" />
        </div>
      </Demo>
    </Tablero>
  );
}
