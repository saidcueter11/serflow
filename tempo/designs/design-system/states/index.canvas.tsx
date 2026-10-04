import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { ErrorState } from "../../../../src/components/ui/ErrorState";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { BoardIntro } from "./BoardIntro";
import { BoardEmptyState } from "./BoardEmptyState";
import { BoardErrorState } from "./BoardErrorState";
import { BoardCuandoUsar } from "./BoardCuandoUsar";
import { BoardDesignSystemDebt } from "./BoardDesignSystemDebt";

export default function StatesCanvas() {
  return (
    <Canvas name="States" backgroundColor="#232323">
      <Storyboard
        id="Intro"
        name="Intro"
        component={BoardIntro}
        layout={{ x: 0, y: 0, width: 1000, height: 1000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="EmptyState"
        name="EmptyState"
        component={BoardEmptyState}
        layout={{ x: 1050, y: 0, width: 1300, height: 1500, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ErrorState"
        name="ErrorState"
        component={BoardErrorState}
        layout={{ x: 2400, y: 0, width: 1300, height: 1400, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="CuandoUsar"
        name="Cuándo usar cuál"
        component={BoardCuandoUsar}
        layout={{ x: 3750, y: 0, width: 1200, height: 1100, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesignSystemDebt"
        name="Design System Debt"
        component={BoardDesignSystemDebt}
        layout={{ x: 5000, y: 0, width: 1400, height: 2600, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

defineAsset(EmptyState, {
  libraries: ["Design System"],
  usageInstructions:
    "Lista o sección que el cliente vino a ver y hoy está vacía: Disponible ahora sin prendas confirmadas, una categoría sin productos. Siempre con action (WhatsApp por defecto: un href de whatsappUrl() se pinta solo con el botón whatsapp). mascot solo si no hay otra mascota en la página. No para errores o falta de señal (usa ErrorState), no para secciones opcionales vacías como Trabajos hechos sin fotos (esas no se renderizan) y no para la 404.",
  variants: {
    "Sin prendas disponibles": {
      props: {
        title: "No hay prendas disponibles en este momento",
        description: "Escríbenos y te contamos qué hay en el taller.",
        action: { label: "Pregunta por WhatsApp", href: WHATSAPP_URL },
      },
    },
    "Categoría vacía": {
      props: {
        title: "Todavía no hay gorras aquí",
        description: "Mientras llegan, mira otras prendas del taller.",
        action: { label: "Ver otras prendas", href: "/products/mi-tierra-querida" },
      },
    },
    "Con mascota": {
      props: {
        title: "No hay prendas disponibles en este momento",
        description: "Escríbenos y te contamos qué hay en el taller.",
        action: { label: "Pregunta por WhatsApp", href: WHATSAPP_URL },
        mascot: true,
      },
    },
  },
});

defineAsset(ErrorState, {
  libraries: ["Design System"],
  usageInstructions:
    "Algo falló al cargar un bloque en el cliente: offline cuando no hay señal (navigator.onLine false), load cuando hay señal pero la carga falló (p. ej. el personalizador de PRI-122). Siempre trae Reintentar (link a retryHref, sin JS) y WhatsApp; role=status. Las páginas SSG no lo necesitan para Supabase: si el fetch falla en el build, el build falla. No para listas vacías (usa EmptyState) ni para la 404.",
  variants: {
    "Sin conexión": { props: { kind: "offline", retryHref: "/products/mi-tierra-querida" } },
    "Error al cargar": { props: { kind: "load", retryHref: "/" } },
    "Fotos sin cargar": {
      props: {
        kind: "load",
        retryHref: "/products/mi-tierra-querida",
        title: "Las fotos no cargaron",
        description: "La señal está lenta. Intenta otra vez o pídenos las fotos por WhatsApp.",
      },
    },
  },
});
