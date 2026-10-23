import { useEffect, useState, type ReactNode } from "react";
import { VistaPrevia, type ModoVista } from "../../../../src/components/ui/VistaPrevia";
import { PRENDAS, fotoDe, type Prenda, type Tecnica } from "../../../../src/lib/personaliza/datos";
import { LUGAR_GORRA, LUGAR_INICIAL } from "../../../../src/lib/personaliza/lugar";
import { cargarFoto, prepararDiseno, type FotoLista } from "../../../../src/lib/personaliza/motor";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
import { COLORES } from "./colores";
import sol from "./sol-heroica.svg";

// Prop wrapper: prepara la foto y el diseño de muestra con el motor real y se los pasa a VistaPrevia.
function Vista({ prenda = "camiseta", color = "negra", ubicacion, tecnica = "estampado", modo, diseno = true, seleccionado, alto = 320 }: {
  prenda?: Prenda; color?: string; ubicacion?: string; tecnica?: Tecnica; modo: ModoVista; diseno?: boolean; seleccionado?: boolean; alto?: number;
}) {
  const c = COLORES[prenda].find((x) => x.id === color)!;
  const ub = ubicacion ?? PRENDAS[prenda].ubicaciones[0].nombre;
  const info = fotoDe(c, prenda, ub)!;
  const [foto, setFoto] = useState<FotoLista | null>(null);
  const [tratado, setTratado] = useState<HTMLCanvasElement | null>(null);
  const [lugar, setLugar] = useState(prenda === "gorra" ? LUGAR_GORRA : LUGAR_INICIAL);
  useEffect(() => void cargarFoto(info.image_url, info.print_area, PRENDAS[prenda].curva).then(setFoto), [info.image_url]);
  useEffect(() => {
    if (!diseno) return;
    const img = new Image();
    img.onload = () => {
      const t = document.createElement("canvas");
      t.width = t.height = 1024;
      t.getContext("2d")!.drawImage(img, 0, 0, 1024, 1024);
      setTratado(prepararDiseno(t, tecnica));
    };
    img.src = sol;
  }, [diseno, tecnica]);
  const nombre = `${PRENDAS[prenda].nombre} ${c.name.toLowerCase()}`;
  return (
    <div className="w-[358px]">
      <VistaPrevia
        foto={modo === "sin-senal" ? null : foto}
        etiqueta={`${nombre}${ub === "Espalda" ? ", espalda" : ""}`}
        modo={modo}
        tecnica={tecnica}
        diseno={tratado}
        lugar={lugar}
        onLugar={setLugar}
        anchoCm={info.print_width_cm}
        archivo={modo === "archivo" ? { nombre: "logo-final.pdf" } : undefined}
        cargando={`Cargando la ${nombre.toLowerCase()}…`}
        alto={alto}
        pista
        seleccionado={seleccionado}
      />
    </div>
  );
}

function Caso({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[12px] text-muted">{label}</div>
      {children}
    </div>
  );
}

export function BoardVistaPrevia() {
  return (
    <PageFrame family="personalizador" width={1400}>
      <PageTitle
        title="VistaPrevia"
        description={
          <>
            La foto de la prenda con el diseño encima, pintada por el motor canvas 2D (<Code>src/lib/personaliza/motor.ts</Code>): lo que se ve es
            lo que se descarga como mockup. Guías, manijas y botones van en HTML encima y no salen en el mockup. Fija arriba en celular (320 px)
            y a la izquierda en escritorio (500 px).
          </>
        }
      />
      <Row name="Flujo" description="Sin diseño el área punteada abre el selector. Con diseño, tocarlo lo selecciona: arrastrar mueve, pellizcar o las manijas escalan, − + Centrar como alternativa.">
        <div className="flex flex-wrap gap-6">
          <Caso label='modo="vacio"'><Vista modo="vacio" diseno={false} /></Caso>
          <Caso label='modo="listo"'><Vista modo="listo" /></Caso>
          <Caso label="listo · seleccionado"><Vista modo="listo" seleccionado /></Caso>
        </div>
      </Row>
      <Row name="Técnicas y prendas" description="El mismo diseño con cada técnica. Gorra solo bordado; espalda usa su propia foto y área.">
        <div className="flex flex-wrap gap-6">
          <Caso label="DTF · azul"><Vista modo="listo" color="azul" tecnica="dtf" /></Caso>
          <Caso label="Bordado · blanca"><Vista modo="listo" color="blanca" tecnica="bordado" /></Caso>
          <Caso label="Espalda · gris"><Vista modo="listo" color="gris" ubicacion="Espalda" /></Caso>
          <Caso label="Gorra · bordado"><Vista modo="listo" prenda="gorra" tecnica="bordado" /></Caso>
        </div>
      </Row>
      <Row name="Estados" description="Preparando hace esperar el envío como mucho 5 s; después, Seguir sin vista previa. Sin señal: Reintentar pide solo la foto.">
        <div className="flex flex-wrap gap-6">
          <Caso label='modo="procesando"'><Vista modo="procesando" /></Caso>
          <Caso label='modo="lento"'><Vista modo="lento" /></Caso>
          <Caso label='modo="archivo"'><Vista modo="archivo" diseno={false} /></Caso>
          <Caso label='modo="cargando"'><Vista modo="cargando" color="blanca" /></Caso>
          <Caso label='modo="sin-senal"'><Vista modo="sin-senal" color="blanca" /></Caso>
        </div>
      </Row>
    </PageFrame>
  );
}
