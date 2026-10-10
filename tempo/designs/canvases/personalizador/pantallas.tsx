import { COLORES_CAMISETA_10, COLORES_GORRA, DISENO, PRENDAS, type Tecnica } from "./data";
import { Colores, Grupo } from "./propuesta/Campos";
import { EditorAjustar, Personalizador } from "./propuesta/Personalizador";
import { VistaPrevia } from "./propuesta/VistaPrevia";

/* Pantallas del canvas: cada una es la página real de la propuesta con un estado fijado. 390 x 844 = Pixel 7 aprox. */

const M = { ancho: 390, alto: 844 } as const;
const D = { ancho: 1280, alto: 800, escritorio: true } as const;
const LUGAR = { cx: 0.5, cy: 0.42, s: 0.62 };
const NOTA = "El logo en dorado, tallas M y L";

/* ---------- Flujo principal (celular) ---------- */
export const PaginaCompleta = () => <Personalizador ancho={390} />;
export const AInicial = () => <Personalizador {...M} />;
export const ADisenoColocado = () => <Personalizador {...M} diseno="imagen" lugar={LUGAR} pista cantidad="2 a 5" />;
export const AMoviendo = () => <Personalizador {...M} diseno="imagen" lugar={{ cx: 0.5, cy: 0.4, s: 0.72 }} vistaModo="ajustando" cantidad="2 a 5" />;
export const BHojaConImagen = () => (
  <Personalizador {...M} diseno="imagen" lugar={LUGAR} cantidad="2 a 5" nota={NOTA} hoja={{ tipo: "imagen" }} />
);
export const BHojaGuardada = () => (
  <Personalizador {...M} diseno="imagen" lugar={LUGAR} cantidad="2 a 5" nota={NOTA} hoja={{ tipo: "imagen", guardada: true, compartir: false }} />
);
export const AEspalda = () => <Personalizador {...M} diseno="imagen" ubicacion="Espalda" color="blanca" tecnica="dtf" lugar={{ cx: 0.5, cy: 0.4, s: 0.8 }} cantidad="6 a 20" />;
export const BHojaCompartir = () => (
  <Personalizador {...M} diseno="imagen" lugar={LUGAR} cantidad="2 a 5" nota={NOTA} hoja={{ tipo: "imagen", guardada: true, alFinal: true }} />
);
export const CVuelta = () => <Personalizador {...M} diseno="imagen" lugar={LUGAR} cantidad="2 a 5" nota={NOTA} hoja={{ tipo: "imagen", vuelta: true }} />;

/* ---------- Estados (celular) ---------- */
export const EProcesando = () => <Personalizador {...M} diseno="procesando" ancla="paso1" />;
export const EProcesandoLento = () => <Personalizador {...M} diseno="procesando" vistaModo="lento" ancla="paso1" />;
export const ESeguirSinVista = () => <Personalizador {...M} diseno="imagen" sinVista ancla="paso1" />;
export const BHojaSinVista = () => <Personalizador {...M} diseno="imagen" sinVista cantidad="2 a 5" hoja={{ tipo: "imagen", sinVistaPrevia: true, compartir: false }} />;
export const ESinDiseno = () => <Personalizador {...M} diseno="ayuda" ancla="paso1" />;
export const EPesada = () => <Personalizador {...M} diseno="pesada" ancla="paso1" />;
export const EBajaCalidad = () => <Personalizador {...M} diseno="baja" lugar={LUGAR} ancla="paso1" />;
export const ENoMostrable = () => <Personalizador {...M} diseno="archivo" ancla="paso1" />;
export const ECargandoColor = () => <Personalizador {...M} diseno="imagen" lugar={LUGAR} cargandoColor="blanca" ancla="paso2" />;
export const ESinSenal = () => <Personalizador {...M} diseno="imagen" lugar={LUGAR} color="blanca" vistaModo="sin-senal" ancla="paso2" />;
export const BHojaSinImagen = () => <Personalizador {...M} diseno="ayuda" cantidad="6 a 20" nota="Quiero algo con el nombre del equipo" hoja={{ tipo: "sin-imagen" }} />;
export const BHojaArchivo = () => <Personalizador {...M} diseno="archivo" cantidad="2 a 5" hoja={{ tipo: "archivo" }} />;
export const BHojaSinSenal = () => (
  <Personalizador {...M} diseno="imagen" lugar={LUGAR} color="blanca" vistaModo="sin-senal" cantidad="2 a 5" hoja={{ tipo: "imagen", sinSenal: true, sinVistaPrevia: true, compartir: false }} />
);
export const CVueltaSinImagen = () => <Personalizador {...M} diseno="ayuda" cantidad="6 a 20" hoja={{ tipo: "sin-imagen", vuelta: true }} />;

/* ---------- Prendas y colores ---------- */
export const GGorra = () => <Personalizador {...M} prenda="gorra" diseno="imagen" lugar={{ cx: 0.5, cy: 0.5, s: 0.62 }} ancla="paso2" />;
export const GGorraArriba = () => <Personalizador {...M} prenda="gorra" color="blanca" diseno="imagen" lugar={{ cx: 0.5, cy: 0.5, s: 0.62 }} cantidad="6 a 20" />;

function PanelColores({ colores, elegido }: { colores: typeof COLORES_CAMISETA_10; elegido: string }) {
  const c = colores.find((x) => x.id === elegido)!;
  return (
    <div className="bg-primary p-4 font-body text-ink" style={{ width: 390 }}>
      <Grupo legend="Color" valor={c.nombre}>
        <Colores colores={colores} elegido={elegido} />
      </Grupo>
    </div>
  );
}
export const Colores4 = () => <PanelColores colores={PRENDAS.camiseta.colores} elegido="negra" />;
export const Colores10 = () => <PanelColores colores={COLORES_CAMISETA_10} elegido="vinotinto" />;
export const Colores4Gorra = () => <PanelColores colores={COLORES_GORRA} elegido="blanca" />;

/* ---------- Técnicas: la misma camiseta con las tres ---------- */
const NOMBRE_TECNICA: Record<Tecnica, string> = { estampado: "Estampado", dtf: "DTF", bordado: "Bordado" };

function Muestra({ t, color = 0, prenda = "camiseta" }: { t: Tecnica; color?: number; prenda?: "camiseta" | "gorra" }) {
  const def = PRENDAS[prenda];
  const c = def.colores[color];
  return (
    <VistaPrevia
      foto={c.foto!}
      etiqueta={`${def.nombre} ${c.nombre.toLowerCase()}`}
      modo="listo"
      tecnica={t}
      diseno={DISENO}
      lugar={prenda === "gorra" ? { cx: 0.5, cy: 0.5, s: 0.7 } : { cx: 0.5, cy: 0.42, s: 0.7 }}
      anchoCm={def.anchoCm[def.ubicaciones[0]]}
      limpia
    />
  );
}

function Tecnica(props: { t: Tecnica; color?: number; prenda?: "camiseta" | "gorra" }) {
  const def = PRENDAS[props.prenda ?? "camiseta"];
  return (
    <figure className="flex flex-col gap-2">
      <div className="aspect-[4/5] overflow-hidden rounded-card border border-line">
        <Muestra {...props} />
      </div>
      <figcaption className="text-[14px]">
        <strong className="font-semibold">{NOMBRE_TECNICA[props.t]}</strong>
        <span className="text-muted"> · {def.nombre.toLowerCase()} {def.colores[props.color ?? 0].nombre.toLowerCase()}</span>
      </figcaption>
    </figure>
  );
}
/** Detalle: la misma vista previa ampliada sobre el diseño, para ver la terminación de cada técnica. */
function Zoom({ t, gorra = false }: { t: Tecnica; gorra?: boolean }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-card border border-line">
      <div className={`absolute inset-x-0 top-0 aspect-[4/5] scale-[2.6] ${gorra ? "origin-[50%_42%]" : "origin-[52%_32%]"}`}>
        {gorra ? <Muestra t={t} prenda="gorra" /> : <Muestra t={t} color={2} />}
      </div>
      <span className="absolute bottom-2.5 left-2.5 rounded-full bg-primary/85 px-3 py-1 text-[12px] text-ink">
        Detalle · {NOMBRE_TECNICA[t]}
        {gorra ? " en gorra" : " en camiseta gris"}
      </span>
    </div>
  );
}

export function TecnicasComparadas() {
  return (
    <div className="grid grid-cols-4 gap-4 bg-primary p-6 font-body text-ink" style={{ width: 1440 }}>
      <Tecnica t="estampado" />
      <Tecnica t="dtf" />
      <Tecnica t="bordado" />
      <Tecnica t="bordado" prenda="gorra" />
      <Tecnica t="estampado" color={1} />
      <Tecnica t="dtf" color={1} />
      <Tecnica t="bordado" color={1} />
      <Tecnica t="bordado" prenda="gorra" color={3} />
      <Zoom t="estampado" />
      <Zoom t="dtf" />
      <Zoom t="bordado" />
      <Zoom t="bordado" gorra />
    </div>
  );
}

/* ---------- Decisión 1: dónde va la vista previa mientras eliges ---------- */
export const D1Fija = () => <Personalizador {...M} diseno="imagen" lugar={LUGAR} ancla="paso2" tecnica="dtf" />;
export const D1Mini = () => <Personalizador {...M} diseno="imagen" lugar={LUGAR} ancla="paso2" tecnica="dtf" vista="mini" />;

/* ---------- Decisión 2: cómo se mueve el diseño ---------- */
export const D2Directo = () => <Personalizador {...M} diseno="imagen" lugar={{ cx: 0.5, cy: 0.4, s: 0.72 }} vistaModo="ajustando" />;
export const D2Modo = () => <Personalizador {...M} diseno="imagen" lugar={LUGAR} mover="modo" />;
export const D2Editor = () => <EditorAjustar {...M} />;

/* ---------- Escritorio 1280 ---------- */
export const DInicial = () => <Personalizador {...D} />;
export const DMoviendo = () => <Personalizador {...D} ancla="paso2" diseno="imagen" lugar={{ cx: 0.5, cy: 0.4, s: 0.72 }} vistaModo="ajustando" tecnica="dtf" cantidad="6 a 20" />;
export const DHoja = () => <Personalizador {...D} diseno="imagen" lugar={LUGAR} cantidad="2 a 5" nota={NOTA} hoja={{ tipo: "imagen", compartir: false }} />;
export const DVuelta = () => <Personalizador {...D} diseno="imagen" lugar={LUGAR} cantidad="2 a 5" nota={NOTA} hoja={{ tipo: "imagen", vuelta: true }} />;
export const DGorra = () => <Personalizador {...D} prenda="gorra" color="gris" diseno="imagen" lugar={{ cx: 0.5, cy: 0.5, s: 0.62 }} />;
