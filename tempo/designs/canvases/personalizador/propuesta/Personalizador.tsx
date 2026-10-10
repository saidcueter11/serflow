/// <reference types="vite/client" />
import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import logo from "../../../../../src/assets/LOGO SERFLOW.png";
import { Header, NAV_LINKS } from "../../../../../src/components/ui/Header";
import { Footer } from "../../../../../src/components/ui/Footer";
import { Chip } from "../../../../../src/components/ui/Chip";
import { Button } from "../../../../../src/components/ui/Button";
import {
  ARCHIVO_PDF,
  ARCHIVO_PESADO,
  CANTIDADES,
  DISENO,
  DISENO_PEQUENO,
  LUGAR_INICIAL,
  PRENDAS,
  TECNICAS,
  mensaje,
  tamanoCm,
  type Cantidad,
  type ColorPrenda,
  type EstadoDiseno,
  type Lugar,
  type Prenda,
  type Tecnica,
} from "../data";
import { BarraEnvio, CampoDiseno, Colores, Grupo, Nota, Paso, Tecnicas } from "./Campos";
import { EstilosPersonalizador } from "./estilos";
import { HojaEnvio, type TipoEnvio } from "./HojaEnvio";
import { VistaPrevia, type ModoVista } from "./VistaPrevia";
import { IconCerrar } from "./iconos";

/*
 * PROPUESTA (PRI-122) · Pantalla A: /personaliza. Va a src/components/personaliza/PersonalizaPage.tsx
 * (y src/pages/personaliza.astro). Header y Footer del design system; sin WhatsAppFab: aquí el envío lo reemplaza.
 * Container queries (@4xl = 896px) como HomePage, así el canvas y el sitio se ven igual.
 * Las props de abajo son solo para dibujar estados en el canvas; en el sitio todo es estado local de la página.
 */

const LOGO: string = logo;
export const LINKS = [...NAV_LINKS, { label: "Diseña tu prenda", href: "/personaliza" }];

export interface HojaProps {
  tipo: TipoEnvio;
  /** La foto no cargó o se siguió sin vista previa: la hoja no tiene paso de guardar. */
  sinVistaPrevia?: boolean;
  guardada?: boolean;
  sinSenal?: boolean;
  vuelta?: boolean;
  compartir?: boolean;
  alFinal?: boolean;
}

export interface PersonalizadorProps {
  ancho: number;
  /** Alto de la pantalla del celular o del navegador. Sin alto, la página completa. */
  alto?: number;
  escritorio?: boolean;
  /** Dónde arranca el scroll de la pantalla dibujada. */
  ancla?: "paso1" | "paso2" | "paso3";
  prenda?: Prenda;
  colores?: ColorPrenda[];
  color?: string;
  tecnica?: Tecnica;
  ubicacion?: string;
  cantidad?: Cantidad;
  nota?: string;
  diseno?: EstadoDiseno;
  lugar?: Lugar;
  /** Fuerza un estado de la vista previa: ajustando (moviendo), lento o sin-senal. */
  vistaModo?: ModoVista;
  /** Id del color que se está cargando: se ve la foto anterior atenuada. */
  cargandoColor?: string;
  pista?: boolean;
  /** Decisión 1: vista fija arriba (recomendada) o miniatura flotante. */
  vista?: "fija" | "mini";
  /** Decisión 2: mover directo sobre la prenda (recomendada) o con el modo ajustar. */
  mover?: "directo" | "modo";
  hoja?: HojaProps;
  /** El cliente tocó Seguir sin vista previa: el diseño queda como archivo y la hoja sale sin paso de guardar. */
  sinVista?: boolean;
}

export function Personalizador(p: PersonalizadorProps) {
  const { ancho, alto, escritorio = false, ancla, vista = "fija", mover = "directo", hoja } = p;
  const [prenda, setPrenda] = useState<Prenda>(p.prenda ?? "camiseta");
  const def = PRENDAS[prenda];
  const colores = p.colores ?? def.colores;
  const [colorId, setColorId] = useState(p.color ?? colores[0].id);
  const [tecnica, setTecnica] = useState<Tecnica>(p.tecnica ?? def.tecnicas[0]);
  const [ubicacion, setUbicacion] = useState(p.ubicacion ?? def.ubicaciones[0]);
  const [cantidad, setCantidad] = useState<Cantidad>(p.cantidad ?? "1");
  const [lugar, setLugar] = useState<Lugar>(p.lugar ?? LUGAR_INICIAL);
  const estado = p.diseno ?? "ninguno";
  const scroller = useRef<HTMLDivElement>(null);
  const fija = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const s = scroller.current;
    const el = ancla && s?.querySelector<HTMLElement>(`[data-ancla="${ancla}"]`);
    if (!s || !el) return;
    const top = el.getBoundingClientRect().top - s.getBoundingClientRect().top + s.scrollTop;
    s.scrollTop = top - (escritorio || vista === "mini" ? 24 : (fija.current?.offsetHeight ?? 340) + 12);
  }, [ancla, escritorio, vista]);

  const cambiar = (e: FormEvent<HTMLFormElement>) => {
    const t = e.target as HTMLInputElement;
    if (t.name === "prenda") {
      const n = t.value as Prenda;
      setPrenda(n);
      setColorId(PRENDAS[n].colores[0].id);
      setTecnica(PRENDAS[n].tecnicas[0]);
      setUbicacion(PRENDAS[n].ubicaciones[0]);
    }
    if (t.name === "color") setColorId(t.value);
    if (t.name === "tecnica") setTecnica(t.value as Tecnica);
    if (t.name === "ubicacion") setUbicacion(t.value);
    if (t.name === "cantidad") setCantidad(t.value as Cantidad);
  };

  const color = colores.find((c) => c.id === colorId) ?? colores[0];
  const nuevo = p.cargandoColor ? colores.find((c) => c.id === p.cargandoColor) : undefined;
  const espalda = ubicacion === "Espalda";
  const fotoDe = (c: ColorPrenda) => (espalda ? c.espalda : c.foto);
  const foto = fotoDe(color) ?? fotoDe(colores[0])!;
  const visible = nuevo ?? color;
  const etiqueta = `${def.nombre} ${visible.nombre.toLowerCase()}${espalda ? ", espalda" : ""}`;

  const diseno = estado === "baja" ? DISENO_PEQUENO : estado === "imagen" || estado === "procesando" ? DISENO : undefined;
  const archivo =
    estado === "archivo" ? ARCHIVO_PDF : estado === "pesada" ? ARCHIVO_PESADO : p.sinVista ? { nombre: DISENO.nombre, detalle: "" } : undefined;
  const modo: ModoVista =
    p.vistaModo ??
    (p.sinVista ? "archivo" : nuevo ? "cargando" : estado === "procesando" ? "procesando" : diseno ? "listo" : archivo ? "archivo" : "vacio");
  const cm = tamanoCm(prenda, ubicacion, lugar.s);
  const resumen = [`${def.nombre} ${visible.nombre.toLowerCase()}`, TECNICAS[tecnica].nombre, ubicacion, cantidad === "1" ? "1 unidad" : `${cantidad} unidades`].join(" · ");

  const vistaProps = {
    foto,
    etiqueta,
    tecnica,
    diseno,
    lugar,
    onLugar: setLugar,
    anchoCm: def.anchoCm[ubicacion],
    archivo,
  };
  const preview = (
    <VistaPrevia
      {...vistaProps}
      modo={modo}
      cargando={nuevo ? `Cargando la ${def.nombre.toLowerCase()} ${nuevo.nombre.toLowerCase()}…` : undefined}
      alto={escritorio ? 500 : 320}
      pista={p.pista}
      modoAjustar={mover === "modo"}
      escritorio={escritorio}
      archivoNota={p.sinVista ? "Sin vista previa: va en el chat" : undefined}
    />
  );
  const miniatura = <VistaPrevia {...vistaProps} modo="listo" limpia />;

  return (
    <div className="@container relative overflow-hidden bg-primary font-body text-ink antialiased" style={{ width: ancho, height: alto }}>
      <EstilosPersonalizador />
      <div ref={scroller} className={alto ? "h-full overflow-y-auto [scrollbar-width:none]" : ""}>
        <Header logoSrc={LOGO} links={LINKS} current="/personaliza" />
        <form onChange={cambiar} onSubmit={(e) => e.preventDefault()} aria-label="Arma tu pedido">
          <main className="grid grid-cols-[minmax(0,1fr)] @4xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @4xl:grid-rows-[auto_auto_1fr] @4xl:gap-x-12 @4xl:px-12">
            <div className="px-4 pb-4 pt-6 @4xl:col-span-2 @4xl:px-0 @4xl:pb-5 @4xl:pt-8">
              <h1 className="font-display text-[32px] font-medium leading-[1.05] tracking-[-0.01em] @4xl:text-[48px]">Diseña tu prenda</h1>
              <p className="mt-2 text-[16px] leading-relaxed text-muted @4xl:text-[18px]">Arma tu pedido y nos llega por WhatsApp.</p>
            </div>

            <fieldset className="px-4 pb-3 @4xl:col-start-1 @4xl:row-start-2 @4xl:px-0">
              <legend className="sr-only">Prenda</legend>
              <div className="flex gap-2">
                <Chip label="Camiseta" name="prenda" value="camiseta" selected={prenda === "camiseta"} />
                <Chip label="Gorra" name="prenda" value="gorra" selected={prenda === "gorra"} />
              </div>
            </fieldset>

            <div
              ref={fija}
              className={`z-20 bg-primary px-4 pb-3 @4xl:col-start-1 @4xl:row-start-3 @4xl:self-start @4xl:px-0 @4xl:pb-0 ${vista === "fija" ? "sticky top-0 pt-2 @4xl:top-6" : "@4xl:sticky @4xl:top-6"}`}
            >
              {preview}
            </div>

            <div className="flex flex-col gap-10 px-4 pb-8 pt-6 @4xl:col-start-2 @4xl:row-span-2 @4xl:row-start-2 @4xl:px-0 @4xl:pt-0">
              <Paso n={1} titulo="Sube tu diseño o una foto" ancla="paso1">
                <CampoDiseno key={estado} estado={estado} diseno={diseno} archivo={archivo} escritorio={escritorio} />
              </Paso>

              <Paso n={2} titulo="Elige color y técnica" ancla="paso2">
                <Grupo legend="Color" valor={visible.nombre} key={`c-${prenda}`}>
                  <Colores colores={colores} elegido={visible.id} cargando={nuevo?.id} />
                </Grupo>
                <Grupo legend="Técnica" valor={def.tecnicas.length > 1 ? TECNICAS[tecnica].nombre : undefined} key={`t-${prenda}`}>
                  <Tecnicas opciones={def.tecnicas} elegida={tecnica} />
                </Grupo>
                <Grupo legend="Ubicación" key={`u-${prenda}`}>
                  {def.ubicaciones.length > 1 ? (
                    <div className="flex flex-wrap gap-2">
                      {def.ubicaciones.map((u) => (
                        <Chip key={u} label={u} name="ubicacion" selected={u === ubicacion} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-[15px]">{def.ubicaciones[0]}. Si la quieres en otro lado, cuéntanos en la nota.</p>
                  )}
                </Grupo>
                <Grupo legend="Cantidad" nota="Las tallas van en la nota o en el chat.">
                  <div className="flex flex-wrap gap-2">
                    {CANTIDADES.map((c) => (
                      <Chip key={c} label={c} name="cantidad" selected={c === cantidad} />
                    ))}
                  </div>
                </Grupo>
                <Nota valor={p.nota} />
              </Paso>

              <Paso n={3} titulo="Mándanoslo por WhatsApp" ancla="paso3">
                <p className="text-[15px] leading-relaxed text-muted">
                  Antes de abrir WhatsApp te mostramos el mensaje armado{diseno ? " y la vista previa para guardarla" : ""}. El taller te responde por el chat con
                  el precio.
                </p>
              </Paso>
              {escritorio && (
                <div className="sticky bottom-0 -mt-4 bg-primary pb-6 pt-2 shadow-[0_-24px_24px_var(--color-primary)]">
                  <BarraEnvio resumen={resumen} fija={false} esperando={modo === "procesando" || modo === "lento"} conVista={modo === "listo" || modo === "ajustando" || modo === "procesando" || modo === "lento" || modo === "cargando"} />
                </div>
              )}
            </div>
          </main>
          {!escritorio && <BarraEnvio resumen={resumen} esperando={modo === "procesando" || modo === "lento"} conVista={modo === "listo" || modo === "ajustando" || modo === "procesando" || modo === "lento" || modo === "cargando"} />}
        </form>
        <Footer logoSrc={LOGO} />
      </div>

      {vista === "mini" && !escritorio && (
        <button
          type="button"
          aria-label="Ver arriba la vista previa"
          className="absolute right-3 top-3 z-30 flex w-[84px] flex-col overflow-hidden rounded-tile border-2 border-accent bg-surface shadow-[0_8px_24px_rgba(0,0,0,.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="block aspect-[4/5]">{miniatura}</span>
          <span className="py-1 text-center text-[12px] font-semibold">Ver arriba ↑</span>
        </button>
      )}

      {hoja && (
        <HojaEnvio
          {...hoja}
          escritorio={escritorio}
          mensaje={mensaje({
            prenda,
            color: visible.nombre,
            tecnica,
            ubicacion,
            cantidad,
            diseno: hoja.tipo === "sin-imagen" ? "ayuda" : hoja.tipo === "archivo" ? "archivo" : estado,
            tamanoCm: cm,
            nota: p.nota,
            vistaPrevia: !hoja.sinVistaPrevia,
          })}
          diseno={hoja.tipo === "imagen" ? diseno : undefined}
          archivo={hoja.tipo === "archivo" ? ARCHIVO_PDF : undefined}
          vistaPrevia={hoja.tipo === "imagen" && !hoja.sinVistaPrevia ? miniatura : undefined}
        />
      )}
    </div>
  );
}

/**
 * Opción B de "cómo se mueve el diseño": un modo aparte, a pantalla completa, para mover y escalar.
 * La página no hace scroll mientras está abierto; Listo vuelve con el diseño en su lugar.
 */
export function EditorAjustar({ ancho, alto }: { ancho: number; alto: number }) {
  const [lugar, setLugar] = useState<Lugar>({ cx: 0.5, cy: 0.42, s: 0.62 });
  const def = PRENDAS.camiseta;
  return (
    <div className="flex flex-col bg-primary font-body text-ink antialiased" style={{ width: ancho, height: alto }}>
      <EstilosPersonalizador />
      <div className="grid grid-cols-[44px_1fr_auto] items-center border-b border-line px-2 py-1.5">
        <button
          type="button"
          aria-label="Cancelar y volver"
          className="flex size-11 items-center justify-center rounded-full text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <IconCerrar />
        </button>
        <h2 className="text-center font-display text-[17px] font-medium">Mover y ajustar</h2>
        <Button variant="secondary">Listo</Button>
      </div>
      <div className="px-4 pt-4">
        <div className="overflow-hidden rounded-card border border-line"><VistaPrevia foto={def.colores[0].foto!} etiqueta="Camiseta negra" modo="ajustando" tecnica="estampado" diseno={DISENO} lugar={lugar} onLugar={setLugar} anchoCm={def.anchoCm.Pecho} limpia /></div>
      </div>
      <div className="flex flex-col gap-4 px-4 pt-5">
        <label className="flex flex-col gap-2">
          <span className="flex justify-between text-[14px]">
            <span className="font-semibold">Tamaño</span>
            <span className="text-muted">unos {tamanoCm("camiseta", "Pecho", lugar.s)} cm de ancho</span>
          </span>
          <input
            type="range"
            min={20}
            max={100}
            value={Math.round(lugar.s * 100)}
            onChange={(e) => setLugar({ ...lugar, s: Number(e.target.value) / 100 })}
            className="h-11 w-full accent-accent"
          />
        </label>
        <div className="flex gap-2">
          <Button variant="secondary">Centrar</Button>
          <Button variant="secondary">Como estaba</Button>
        </div>
        <p className="text-[13px] text-muted">Arrastra con un dedo. Pellizca para cambiar el tamaño.</p>
      </div>
    </div>
  );
}
