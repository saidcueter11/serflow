import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { VistaPrevia } from "../../../../src/components/ui/VistaPrevia";
import { HojaEnvio } from "../../../../src/components/ui/HojaEnvio";
import { Aviso, BarraEnvio, CampoDiseno, Colores, Grupo, Nota, Paso, Tecnicas } from "../../../../src/components/ui/PersonalizaCampos";
import { PaginaCelular, PaginaEscritorio } from "./Pagina";
import { BoardVistaPrevia } from "./BoardVistaPrevia";
import { BoardCampos } from "./BoardCampos";
import { BoardHoja } from "./BoardHoja";

// PRI-122: la página /personaliza y sus piezas, con los componentes de producción y las fotos de muestra.
export default function PersonalizadorCanvas() {
  return (
    <Canvas name="Personalizador">
      <Storyboard id="PaginaCelular" name="Página · celular 390" component={PaginaCelular} layout={{ x: 0, y: 0 }} />
      <Storyboard id="PaginaEscritorio" name="Página · escritorio 1280" component={PaginaEscritorio} layout={{ x: 440, y: 0 }} />
      <Storyboard id="VistaPrevia" name="VistaPrevia" component={BoardVistaPrevia} layout={{ x: 0, y: 2450 }} />
      <Storyboard id="Campos" name="Campos del pedido" component={BoardCampos} layout={{ x: 1500, y: 2450 }} />
      <Storyboard id="HojaEnvio" name="HojaEnvio" component={BoardHoja} layout={{ x: 0, y: 4500 }} />
    </Canvas>
  );
}

const PEDIDO =
  "¡Hola, Serflow! Quiero cotizar esta prenda personalizada:\n\n*Prenda:* Gorra negra\n*Técnica:* Bordado\n*Ubicación:* Frente\n*Cantidad:* 1\n*Diseño:* todavía no tengo, quiero que me ayuden\n\nArmado en la web de Serflow";

defineAsset(VistaPrevia, {
  libraries: ["Design System"],
  usageInstructions:
    "Solo en /personaliza: la prenda con el diseño del cliente, pintada por el motor canvas 2D (foto de cargarFoto, diseño de prepararDiseno). Fija arriba en celular (alto 320) y a la izquierda en escritorio (alto 500). Sin foto preparada solo muestra los estados cargando y sin-senal. No para fotos de productos del catálogo (usa PhotoSlot).",
  variants: {
    "Sin señal": { props: { foto: null, etiqueta: "Camiseta negra", modo: "sin-senal", tecnica: "estampado", lugar: { cx: 0.5, cy: 0.42, s: 0.62 }, anchoCm: 30, alto: 320 } },
    Cargando: { props: { foto: null, etiqueta: "Camiseta blanca", modo: "cargando", tecnica: "estampado", lugar: { cx: 0.5, cy: 0.42, s: 0.62 }, anchoCm: 30, cargando: "Cargando la camiseta blanca…", alto: 320 } },
  },
});

defineAsset(HojaEnvio, {
  libraries: ["Design System"],
  usageInstructions:
    "Hoja \"Revisa y envía\" del personalizador (pantalla B) y su estado vuelta (pantalla C, al volver de WhatsApp). Muestra el mensaje exacto y los pasos guardar, abrir chat (whatsappUrl) y adjuntar. Diálogo modal con foco atrapado. No para otros links de WhatsApp (usa Button whatsapp o WhatsAppFab).",
  variants: {
    "Sin imagen": { props: { tipo: "sin-imagen", mensaje: PEDIDO } },
    "Archivo PDF": { props: { tipo: "archivo", mensaje: PEDIDO, archivo: { nombre: "logo-final.pdf", detalle: "PDF · 2,4 MB" } } },
    "Al volver": { props: { tipo: "sin-imagen", mensaje: PEDIDO, vuelta: true } },
  },
});

defineAsset(CampoDiseno, {
  libraries: ["Design System"],
  usageInstructions:
    "Paso 1 del personalizador: subir el diseño (galería, cámara o soltar en escritorio), con el interruptor Quitar el fondo cuando hay fondo plano y los avisos de pesada, baja calidad o formato no mostrable. Acepta imágenes y PDF/AI/PSD.",
  variants: {
    Inicial: { props: { estado: "ninguno" } },
    "Con fondo plano": { props: { estado: "imagen", nombre: "logo-heroica.png", detalle: "PNG · 1200 × 1200 px", quitarFondo: true } },
    "Baja calidad": { props: { estado: "baja", nombre: "logo-whatsapp.jpg", detalle: "JPG · 48 × 48 px" } },
    "Archivo PDF": { props: { estado: "archivo", nombre: "logo-final.pdf", detalle: "PDF · 2,4 MB" } },
    "No tengo diseño": { props: { estado: "ayuda" } },
  },
});

defineAsset(Colores, {
  libraries: ["Design System"],
  usageInstructions:
    "Colores de una prenda como radios (name=\"color\") con círculo de 44 px y nombre. La lista viene del admin y crece en grilla. Va dentro de un form que lee el onChange. No para filtros del catálogo (usa Chip).",
  variants: {
    "4 colores": {
      props: {
        colores: [
          { id: "negra", name: "Negra", hex: "#1d1c1a" },
          { id: "blanca", name: "Blanca", hex: "#f2f0ea" },
          { id: "gris", name: "Gris", hex: "#8a8781" },
          { id: "azul", name: "Azul", hex: "#2f56a3" },
        ],
        elegido: "negra",
      },
    },
  },
});

defineAsset(Tecnicas, {
  libraries: ["Design System"],
  usageInstructions:
    "Técnica de la prenda: tarjetas radio (name=\"tecnica\") con pista y muestra. Con una sola técnica (gorra: bordado) pinta una línea fija sin selector.",
  variants: {
    Camiseta: { props: { opciones: ["estampado", "dtf", "bordado"], elegida: "estampado" } },
    Gorra: { props: { opciones: ["bordado"], elegida: "bordado" } },
  },
});

defineAsset(BarraEnvio, {
  libraries: ["Design System"],
  usageInstructions:
    "Envío del personalizador: en celular barra fija abajo (en /personaliza reemplaza al WhatsAppFab), en escritorio tarjeta (fija=false). Abre la hoja Revisa y envía, no WhatsApp directo.",
  variants: {
    Fija: { props: { resumen: "Camiseta negra · Estampado · Pecho · 1 unidad" } },
    Esperando: { props: { resumen: "Camiseta negra · Estampado · Pecho · 1 unidad", esperando: true } },
    Escritorio: { props: { resumen: "Camiseta negra · Estampado · Pecho · 1 unidad", fija: false } },
  },
});

defineAsset(Paso, {
  libraries: ["Design System"],
  usageInstructions: "Encabezado de paso numerado del personalizador (el mismo círculo de \"Diseña la tuya\" en la portada) con su contenido debajo.",
  variants: {
    "Paso 1": { props: { n: 1, titulo: "Sube tu diseño o una foto" } },
  },
});

defineAsset(Grupo, {
  libraries: ["Design System"],
  usageInstructions: "Fieldset con legend en versalitas para un grupo de opciones del personalizador; valor muestra lo elegido y nota va debajo.",
  variants: {
    Color: { props: { legend: "Color", valor: "Negra" } },
    "Con nota": { props: { legend: "Cantidad", nota: "Las tallas van en la nota o en el chat." } },
  },
});

defineAsset(Nota, {
  libraries: ["Design System"],
  usageInstructions: "Nota opcional del pedido, máximo 300 caracteres con contador. Va al mensaje de WhatsApp.",
  variants: {
    Vacía: { props: { valor: "" } },
    "Con texto": { props: { valor: "El logo en dorado, tallas M y L" } },
  },
});

defineAsset(Aviso, {
  libraries: ["Design System"],
  usageInstructions:
    "Aviso neutro que no bloquea (imagen pesada, pequeña, archivo que no se muestra, sin señal en la hoja). No para errores que cortan el flujo (usa ErrorState).",
  variants: {
    "Baja calidad": { props: { titulo: "Tu imagen es pequeña", children: "Puede verse pixelada en la prenda. Si tienes una más grande, súbela." } },
  },
});
