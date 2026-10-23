import { useEffect, useState, type ReactNode } from "react";
import { HojaEnvio } from "../../../../src/components/ui/HojaEnvio";
import { PRENDAS, fotoDe } from "../../../../src/lib/personaliza/datos";
import { LUGAR_INICIAL } from "../../../../src/lib/personaliza/lugar";
import { mensaje, type Pedido } from "../../../../src/lib/personaliza/mensaje";
import { cargarFoto, mockup, prepararDiseno } from "../../../../src/lib/personaliza/motor";
import { Code, PageFrame, PageTitle } from "../Chrome";
import { COLORES } from "./colores";
import sol from "./sol-heroica.svg";

const BASE: Pedido = { prenda: "camiseta", color: "Negra", tecnica: "estampado", ubicacion: "Pecho", cantidad: "2 a 5", diseno: "imagen", vistaPrevia: true, tamanoCm: 19, nota: "Tallas M y L" };
const CON_IMAGEN = mensaje(BASE);
const SIN_IMAGEN = mensaje({ ...BASE, diseno: "ayuda", vistaPrevia: false, nota: undefined });
const ARCHIVO = mensaje({ ...BASE, diseno: "archivo", vistaPrevia: false });
const PDF = { nombre: "logo-final.pdf", detalle: "PDF · 2,4 MB" };

// El mockup JPG real que arma el motor (camiseta negra, estampado), como el que se guarda y se manda.
function useMockup() {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const c = COLORES.camiseta[0];
    const info = fotoDe(c, "camiseta", "Pecho")!;
    const img = new Image();
    img.onload = async () => {
      const t = document.createElement("canvas");
      t.width = t.height = 1024;
      t.getContext("2d")!.drawImage(img, 0, 0, 1024, 1024);
      const foto = await cargarFoto(info.image_url, info.print_area, PRENDAS.camiseta.curva);
      setUrl(URL.createObjectURL(await mockup(foto, prepararDiseno(t, "estampado"), LUGAR_INICIAL, "estampado")));
    };
    img.src = sol;
  }, []);
  return url;
}

// transform hace que el fixed de la hoja quede dentro del marco del celular o del escritorio.
function Marco({ label, ancho = 390, alto = 844, children }: { label: string; ancho?: number; alto?: number; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[12px] text-muted">{label}</div>
      <div className="relative overflow-hidden rounded-card border border-line bg-primary" style={{ width: ancho, height: alto, transform: "translateZ(0)" }}>
        {children}
      </div>
    </div>
  );
}

export function BoardHoja() {
  const mock = useMockup();
  return (
    <PageFrame family="personalizador" width={2300}>
      <PageTitle
        title="HojaEnvio"
        description={
          <>
            Pantalla B "Revisa y envía" y pantalla C <Code>vuelta</Code>. Celular: hoja que sube desde abajo. Escritorio (desde 896 px): diálogo
            centrado, en dos columnas si hay vista previa. El mensaje sale de <Code>mensaje()</Code> y el link de <Code>whatsappUrl()</Code>.
          </>
        }
      />
      <div className="flex flex-wrap gap-8">
        <Marco label='tipo="imagen"'><HojaEnvio tipo="imagen" mensaje={CON_IMAGEN} vistaPrevia={mock} diseno={sol} /></Marco>
        <Marco label="imagen · guardada · compartir"><HojaEnvio tipo="imagen" mensaje={CON_IMAGEN} vistaPrevia={mock} diseno={sol} guardada compartir /></Marco>
        <Marco label='tipo="sin-imagen"'><HojaEnvio tipo="sin-imagen" mensaje={SIN_IMAGEN} /></Marco>
        <Marco label='tipo="archivo" · sin señal'><HojaEnvio tipo="archivo" mensaje={ARCHIVO} archivo={PDF} sinSenal /></Marco>
        <Marco label="vuelta (pantalla C)"><HojaEnvio tipo="imagen" mensaje={CON_IMAGEN} vistaPrevia={mock} diseno={sol} vuelta /></Marco>
      </div>
      <div className="mt-10">
        <Marco label="escritorio" ancho={1280} alto={800}><HojaEnvio tipo="imagen" mensaje={CON_IMAGEN} vistaPrevia={mock} diseno={sol} escritorio /></Marco>
      </div>
    </PageFrame>
  );
}
