import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Button } from "../../../../../src/components/ui/Button";
import { LUGAR_INICIAL, type Diseno, type FotoColor, type Lugar, type Tecnica } from "../data";
import { Girador, IconArchivo, IconCentrar, IconMas, IconMenos, IconMover, IconReintentar, IconSinSenal, IconSubir } from "./iconos";

/**
 * PROPUESTA (PRI-122) · Vista previa realista: foto real de la prenda en el color elegido con el diseño encima.
 * Va a src/components/ui/VistaPrevia.tsx. Es la única pieza con JS del personalizador (isla de Astro).
 *
 * Capas sobre la foto (el canvas las aproxima con CSS; el motor final es el del prototipo v4, que además
 * curva el diseño con la malla y lo desplaza con los pliegues):
 *  1. el diseño, con el filtro de su técnica (estampado mate, DTF saturado, bordado con hilos y relieve);
 *  2. sombras de la tela multiplicadas encima, solo donde hay diseño (los pliegues pasan por el diseño);
 *  3. luces de la tela en screen; 4. textura: trama (estampado), brillo (DTF) o nada (el bordado tapa la tela).
 *
 * Mover y escalar: tocar el diseño lo selecciona (así el scroll de la página no lo arrastra sin querer);
 * seleccionado se arrastra con un dedo, se escala con dos (pellizcar) o con las manijas de las esquinas.
 * Alternativa sin arrastrar (WCAG 2.5.7): botones − / + / Centrar, y con teclado flechas, + y −.
 * El diseño nunca sale del área de impresión que calibró el taller.
 */
/**
 * vacio: sin diseño, el área punteada abre el selector de archivos. procesando: brillo de carga; lento: pasaron 5 s,
 * se ofrece seguir sin vista previa. sin-senal: la foto del color no cargó; se reintenta solo la foto (no recarga
 * la página, que borraría la imagen subida) y no hay link a WhatsApp: el envío está en la barra.
 */
export type ModoVista = "vacio" | "listo" | "ajustando" | "procesando" | "lento" | "archivo" | "cargando" | "sin-senal";

interface Props {
  foto: FotoColor;
  /** "Camiseta negra" */
  etiqueta: string;
  modo: ModoVista;
  tecnica: Tecnica;
  diseno?: Diseno;
  lugar?: Lugar;
  onLugar?: (l: Lugar) => void;
  /** Ancho real del área de impresión en cm, para "unos 19 cm de ancho". */
  anchoCm: number;
  archivo?: { nombre: string; detalle: string };
  /** Segunda línea de la tarjeta de archivo. */
  archivoNota?: string;
  /** "Cargando la camiseta blanca…" */
  cargando?: string;
  /** Alto del recorte en px (celular, vista fija). Sin alto, la escena 4:5 completa. */
  alto?: number;
  /** Pista de primer uso arriba de la foto. */
  pista?: boolean;
  /** Opción B: el diseño no se toca aquí; un botón abre el modo ajustar. */
  modoAjustar?: boolean;
  /** Copy de escritorio (clic en vez de toque). */
  escritorio?: boolean;
  /** Sin etiquetas ni botones: miniatura de la vista previa (hoja de envío, miniatura flotante). */
  limpia?: boolean;
}

const FILTRO: Record<Tecnica, string> = {
  estampado: "saturate(.75) contrast(.9) brightness(.97)",
  dtf: "saturate(1.6) contrast(1.15) drop-shadow(0 0 1px rgb(255 255 255 / .75))",
  bordado: "",
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const pos = (p: number, size: number) => (size >= 100 ? 0 : (p / (100 - size)) * 100);

export function VistaPrevia({
  foto,
  etiqueta,
  modo,
  tecnica,
  diseno,
  lugar,
  onLugar,
  anchoCm,
  archivo,
  archivoNota = "No se puede ver aquí",
  cargando,
  alto,
  pista = false,
  modoAjustar = false,
  limpia = false,
  escritorio = false,
}: Props) {
  const fid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const escena = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState<Lugar>(lugar ?? LUGAR_INICIAL);
  const l = lugar ?? local;
  const set = (n: Lugar) => (onLugar ? onLugar(n) : setLocal(n));
  const [sel, setSel] = useState(modo === "ajustando");
  const punteros = useRef(new Map<number, { x: number; y: number }>());
  const inicio = useRef<{ l: Lugar; dist: number; x: number; y: number; manija: boolean } | null>(null);

  if (modo === "sin-senal") {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-3 rounded-card border border-line bg-surface px-6 text-center font-body text-ink"
        style={alto ? { height: alto } : { aspectRatio: "4 / 5" }}
      >
        <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-danger">
          <IconSinSenal className="size-6" />
        </span>
        <p className="font-display text-[18px] font-bold leading-snug">No cargó la foto de la {etiqueta.toLowerCase()}</p>
        <p className="max-w-[32ch] text-[14px] leading-relaxed text-muted">Se fue la señal. Tus elecciones siguen aquí y puedes enviar tu pedido igual, sin vista previa.</p>
        <Button variant="secondary" icon={<IconReintentar />}>
          Reintentar
        </Button>
      </div>
    );
  }

  const a = foto.area;
  const ratio = diseno?.ratio ?? 1;
  const W = l.s * a.w;
  const H = (W / ratio) * 0.8;
  const L = a.x + l.cx * a.w - W / 2;
  const T = a.y + l.cy * a.h - H / 2;
  const ajustando = !modoAjustar && (modo === "ajustando" || sel) && !!diseno;
  const espera = modo === "procesando" || modo === "lento";
  const conDiseno = !!diseno && (modo === "listo" || modo === "ajustando" || espera || modo === "cargando");
  const centrado = Math.abs(l.cx - 0.5) < 0.01;

  const limitar = (n: Lugar): Lugar => {
    const s = clamp(n.s, 0.2, 1);
    const hw = s / 2;
    const hh = ((s * a.w) / ratio) * 0.8 / a.h / 2;
    return { s, cx: clamp(n.cx, Math.min(hw, 0.5), Math.max(1 - hw, 0.5)), cy: clamp(n.cy, Math.min(hh, 0.5), Math.max(1 - hh, 0.5)) };
  };

  const area = () => {
    const r = escena.current!.getBoundingClientRect();
    return { w: (r.width * a.w) / 100, h: (r.height * a.h) / 100, r };
  };

  const down = (e: PointerEvent, manija = false) => {
    if (modoAjustar) return;
    e.stopPropagation();
    if (!sel && !manija) {
      setSel(true);
      return;
    }
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const ps = [...punteros.current.values()];
    const dist = ps.length > 1 ? Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y) : 0;
    inicio.current = { l, dist, x: e.clientX, y: e.clientY, manija };
  };
  const move = (e: PointerEvent) => {
    if (!inicio.current || !punteros.current.has(e.pointerId)) return;
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const { w, h, r } = area();
    const ps = [...punteros.current.values()];
    const i = inicio.current;
    if (ps.length > 1 && i.dist) {
      set(limitar({ ...i.l, s: (i.l.s * Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y)) / i.dist }));
    } else if (i.manija) {
      const centroX = r.left + ((a.x + i.l.cx * a.w) / 100) * r.width;
      set(limitar({ ...i.l, s: (2 * Math.abs(e.clientX - centroX)) / w }));
    } else {
      set(limitar({ ...i.l, cx: i.l.cx + (e.clientX - i.x) / w, cy: i.l.cy + (e.clientY - i.y) / h }));
    }
  };
  const up = (e: PointerEvent) => {
    punteros.current.delete(e.pointerId);
    inicio.current = null;
  };
  const tecla = (e: KeyboardEvent) => {
    const d = 0.02;
    const k: Record<string, Partial<Lugar>> = {
      ArrowLeft: { cx: l.cx - d },
      ArrowRight: { cx: l.cx + d },
      ArrowUp: { cy: l.cy - d },
      ArrowDown: { cy: l.cy + d },
      "+": { s: l.s + 0.06 },
      "=": { s: l.s + 0.06 },
      "-": { s: l.s - 0.06 },
    };
    if (k[e.key]) {
      e.preventDefault();
      set(limitar({ ...l, ...k[e.key] }));
    }
  };

  const caja: CSSProperties = { left: `${L}%`, top: `${T}%`, width: `${W}%`, height: `${H}%` };
  const mascara: CSSProperties = diseno
    ? {
        WebkitMaskImage: `url(${diseno.src})`,
        maskImage: `url(${diseno.src})`,
        WebkitMaskSize: `${W}% ${H}%`,
        maskSize: `${W}% ${H}%`,
        WebkitMaskPosition: `${pos(L, W)}% ${pos(T, H)}%`,
        maskPosition: `${pos(L, W)}% ${pos(T, H)}%`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }
    : {};
  const tela: CSSProperties = { backgroundImage: `url(${foto.src})`, backgroundSize: "100% 100%" };
  const sombra = tecnica === "bordado" ? 0.5 : tecnica === "dtf" ? (foto.oscura ? 0.85 : 0.5) : 0.8;
  const luz = tecnica === "bordado" ? 0.15 : tecnica === "dtf" ? 0.3 : foto.oscura ? 0.25 : 0.35;
  const tamano = `unos ${Math.round(anchoCm * l.s)} cm de ancho`;

  // Recorte centrado en el foco de la foto, sin dejar franjas vacías arriba ni abajo.
  const escenaStyle: CSSProperties = alto
    ? { top: `clamp(calc(${alto}px - 125cqw), calc(${alto / 2}px - ${foto.foco * 1.25}cqw), 0px)` }
    : { top: 0 };

  return (
    <div
      className={`@container relative overflow-hidden bg-surface-2 font-body text-ink ${limpia ? "h-full" : "rounded-card border border-line"}`}
      style={alto ? { height: alto } : { aspectRatio: "4 / 5" }}
      onPointerDown={() => setSel(false)}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id={`bordado-${fid}`} x="-5%" y="-5%" width="110%" height="115%" colorInterpolationFilters="sRGB">
          {/* Hilo: pocos colores, rayas de puntada, borde de satín más oscuro, relieve con luz y sombra sobre la tela. */}
          <feComponentTransfer in="SourceGraphic" result="poster">
            <feFuncR type="discrete" tableValues="0 .3 .6 .85 1" />
            <feFuncG type="discrete" tableValues="0 .3 .6 .85 1" />
            <feFuncB type="discrete" tableValues="0 .3 .6 .85 1" />
          </feComponentTransfer>
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.38" numOctaves="1" seed="4" result="ruido" />
          <feColorMatrix in="ruido" type="saturate" values="0" result="gris" />
          <feComponentTransfer in="gris" result="hilos">
            <feFuncR type="linear" slope="2.2" intercept="-.2" />
            <feFuncG type="linear" slope="2.2" intercept="-.2" />
            <feFuncB type="linear" slope="2.2" intercept="-.2" />
          </feComponentTransfer>
          <feBlend in="poster" in2="hilos" mode="multiply" result="cosido" />
          <feMorphology in="SourceAlpha" operator="erode" radius="1.6" result="dentro" />
          <feComposite in="SourceAlpha" in2="dentro" operator="out" result="borde" />
          <feFlood floodColor="black" floodOpacity=".45" />
          <feComposite in2="borde" operator="in" result="bordeOscuro" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="relieve" />
          <feSpecularLighting in="relieve" surfaceScale="3" specularConstant=".55" specularExponent="18" lightingColor="white" result="brillo">
            <feDistantLight azimuth="225" elevation="42" />
          </feSpecularLighting>
          <feComposite in="brillo" in2="SourceAlpha" operator="in" result="brilloDentro" />
          <feComposite in="cosido" in2="brilloDentro" operator="arithmetic" k1="0" k2="1" k3=".35" k4="0" result="luz" />
          <feMerge result="conBorde">
            <feMergeNode in="luz" />
            <feMergeNode in="bordeOscuro" />
          </feMerge>
          <feComposite in="conBorde" in2="SourceAlpha" operator="in" result="cuerpo" />
          <feDropShadow in="cuerpo" dx="1" dy="2.2" stdDeviation="1.4" floodColor="black" floodOpacity=".7" />
        </filter>
      </svg>

      <div ref={escena} className={`absolute inset-x-0 aspect-[4/5] transition-opacity duration-(--motion-med) ${modo === "cargando" ? "opacity-40 blur-[2px]" : ""}`} style={escenaStyle}>
        <img
          key={foto.src}
          src={foto.src}
          alt={`${etiqueta}${diseno && conDiseno ? " con tu diseño" : ""}`}
          className="pz-fade absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {(modo === "vacio" || ajustando) && (
          <div className="pointer-events-none absolute rounded-tile border-2 border-dashed border-accent" style={{ left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}%`, height: `${a.h}%` }}>
            {modo === "vacio" && (
              <label className="pointer-events-auto absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-tile p-2 text-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent">
                <input type="file" accept="image/*,.pdf,.ai,.psd,.svg" className="sr-only" />
                <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                  <IconSubir className="size-5" />
                </span>
                <span className="flex flex-col rounded-tile bg-primary/85 px-3 py-1.5 text-ink">
                  <span className="text-[14px] font-semibold">Tu diseño va aquí</span>
                  <span className="text-[12px] text-muted">{escritorio ? "Haz clic o arrástralo aquí" : "Toca para subirlo"}</span>
                </span>
              </label>
            )}
            {ajustando && (
              <>
                <span className="absolute inset-y-0 left-1/2 border-l border-dashed border-accent/60" />
                {centrado && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2 py-0.5 text-[12px] font-bold text-primary">Centrado</span>
                )}
              </>
            )}
          </div>
        )}

        {conDiseno && diseno && (
          <>
            <img
              src={diseno.src}
              alt=""
              draggable={false}
              className="pointer-events-none absolute object-fill"
              style={{
                ...caja,
                filter: tecnica === "bordado" ? `url(#bordado-${fid})` : FILTRO[tecnica],
                opacity: espera ? 0.35 : 1,
                imageRendering: diseno.pixelada ? "pixelated" : undefined,
              }}
            />
            {!espera && (
              <>
                <div className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ ...tela, ...mascara, opacity: sombra, filter: `grayscale(1) brightness(${foto.luz}) contrast(1.2)` }} />
                <div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ ...tela, ...mascara, opacity: luz, filter: "grayscale(1) contrast(2.6) brightness(.7)" }} />
                {tecnica === "estampado" && <div className="fabric pointer-events-none absolute inset-0 mix-blend-overlay opacity-50" style={mascara} />}
                {tecnica === "dtf" && (
                  <div
                    className="pointer-events-none absolute inset-0 mix-blend-screen"
                    style={{ ...mascara, backgroundImage: `linear-gradient(115deg, transparent ${L + W * 0.18}%, rgb(255 255 255 / .6) ${L + W * 0.3}%, transparent ${L + W * 0.42}%, rgb(255 255 255 / .2) ${L + W * 0.7}%, transparent ${L + W * 0.8}%)` }}
                  />
                )}
              </>
            )}
            {espera && (
              <div className="pz-shimmer pointer-events-none absolute overflow-hidden rounded-tile bg-ink/10" style={caja} />
            )}

            {!espera && modo !== "cargando" && !modoAjustar && (
              <div
                role="group"
                tabIndex={0}
                aria-label={`Tu diseño, ${tamano}. Arrástralo para moverlo; con el teclado, flechas para moverlo y más o menos para el tamaño.`}
                onPointerDown={(e) => down(e)}
                onPointerMove={move}
                onPointerUp={up}
                onPointerCancel={up}
                onKeyDown={tecla}
                onFocus={() => setSel(true)}
                className={`absolute rounded-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent ${ajustando ? "cursor-move ring-[1.5px] ring-accent" : "cursor-pointer"}`}
                style={{ ...caja, touchAction: ajustando ? "none" : "auto" }}
              >
                {ajustando && (
                  <>
                    {(["-left-[22px] -top-[22px]", "-right-[22px] -top-[22px]", "-left-[22px] -bottom-[22px]", "-right-[22px] -bottom-[22px]"] as const).map((p) => (
                      <span
                        key={p}
                        aria-hidden="true"
                        onPointerDown={(e) => down(e, true)}
                        onPointerMove={move}
                        onPointerUp={up}
                        className={`absolute ${p} flex size-11 cursor-nwse-resize items-center justify-center`}
                        style={{ touchAction: "none" }}
                      >
                        <span className="size-3 rounded-[3px] border-2 border-accent bg-ink" />
                      </span>
                    ))}
                    <span className="pointer-events-none absolute left-1/2 top-full mt-4 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary/90 px-2.5 py-1 text-[12px] font-semibold text-ink">
                      {tamano}
                    </span>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {modo === "archivo" && archivo && (
          <div className="absolute flex items-center justify-center" style={{ left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}%`, height: `${a.h}%` }}>
            <div className="flex max-w-full flex-col items-center gap-1.5 rounded-tile border border-line bg-primary/90 px-3 py-3 text-center">
              <IconArchivo className="size-7 text-muted" />
              <span className="max-w-[18ch] truncate text-[13px] font-semibold">{archivo.nombre}</span>
              <span className="text-[12px] leading-tight text-muted">{archivoNota}</span>
            </div>
          </div>
        )}
      </div>

      {modo === "cargando" && cargando && (
        <div role="status" className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-[14px] font-semibold">
            <Girador /> {cargando}
          </span>
        </div>
      )}
      {modo === "lento" && (
        <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-primary/75 p-4 text-center">
          <span className="rounded-full bg-primary/90 px-4 py-2 text-[14px] font-semibold">Esto está tardando más de lo normal</span>
          <Button variant="secondary" icon={null}>
            Seguir sin vista previa
          </Button>
        </div>
      )}
      {modo === "procesando" && (
        <div role="status" className="absolute inset-x-0 top-3 flex justify-center">
          <span className="flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-[14px] font-semibold">
            <Girador /> Preparando tu diseño…
          </span>
        </div>
      )}
      {pista && modo === "listo" && !ajustando && (
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
          <span className="pz-fade rounded-full bg-primary/90 px-3 py-1.5 text-[13px] font-semibold">{escritorio ? "Haz clic en tu diseño para moverlo o cambiar el tamaño" : "Toca tu diseño para moverlo o cambiar el tamaño"}</span>
        </div>
      )}

      {!limpia && (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5">
        <span className="min-w-0 truncate rounded-full bg-primary/85 px-3 py-1 text-[12px] text-ink">
          <span className="sr-only">Vista previa: </span>
          {etiqueta}
        </span>
        {conDiseno && !espera && modo !== "cargando" && (
          <div className="pointer-events-auto flex shrink-0 gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
            {modoAjustar ? (
              <BotonFoto etiqueta="Ajustar" texto>
                <IconMover className="size-5" />
              </BotonFoto>
            ) : (
              <>
                <BotonFoto etiqueta="Hacer el diseño más pequeño" onClick={() => set(limitar({ ...l, s: l.s - 0.08 }))}>
                  <IconMenos />
                </BotonFoto>
                <BotonFoto etiqueta="Hacer el diseño más grande" onClick={() => set(limitar({ ...l, s: l.s + 0.08 }))}>
                  <IconMas />
                </BotonFoto>
                <BotonFoto etiqueta="Centrar el diseño" onClick={() => set(limitar({ ...l, cx: 0.5 }))}>
                  <IconCentrar />
                </BotonFoto>
              </>
            )}
          </div>
        )}
      </div>
      )}
    </div>
  );
}

function BotonFoto({ etiqueta, onClick, children, texto = false }: { etiqueta: string; onClick?: () => void; children: ReactNode; texto?: boolean }) {
  return (
    <button
      type="button"
      aria-label={texto ? undefined : etiqueta}
      onClick={onClick}
      className={`flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-primary/90 text-ink transition-colors duration-(--motion-fast) hover:border-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${texto ? "px-4 text-[14px] font-semibold" : "w-11"}`}
    >
      {children}
      {texto && etiqueta}
    </button>
  );
}
