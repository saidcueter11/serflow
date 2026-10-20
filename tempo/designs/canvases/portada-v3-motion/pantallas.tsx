import { BoardPortada } from "../../design-system/app-shell/BoardPortada";
import { Nota, Rotulo } from "./narracion";
import { PortadaA, PortadaB, PortadaC } from "./propuesta/Portada";

// Hoy: la portada real de master (HomePage) con dos promos, como referencia.
export const HoyMobile = () => <BoardPortada width={390} estado="promos" />;
export const HoyDesktop = () => <BoardPortada width={1280} estado="promos" />;
export const AMobile = () => <PortadaA width={390} />;
export const ADesktop = () => <PortadaA width={1280} />;
export const BMobile = () => <PortadaB width={390} />;
export const BDesktop = () => <PortadaB width={1280} />;
export const CMobile = () => <PortadaC width={390} />;
export const CDesktop = () => <PortadaC width={1280} />;

export const RotuloPortada = () => (
  <Rotulo titulo="Portada · celular 390" texto="Hoy y las tres opciones. El mapa va igual en las tres: abajo y plegado. Las frames se pueden tocar." />
);
export const RotuloEscritorio = () => <Rotulo titulo="Portada · escritorio 1280" texto="Mismo orden: hoy, A, B, C." />;
export const RotuloMotion = () => (
  <Rotulo titulo="Movimiento de toda la app (PRI-287)" texto="Reglas, costos y demos en vivo: Repetir y Reducir movimiento en cada una." />
);

export const NotaHoy = () => (
  <Nota
    letra="0"
    titulo="Hoy (master)"
    resuelve={[]}
    sacrifica={[
      "El mapa de Google abierto es lo segundo que ves: en celular justo después de la cinta, en escritorio al lado del carrusel, a la misma altura.",
      "Diseña la tuya es el quinto bloque y su botón no lleva a ninguna parte.",
    ]}
    construir="Referencia para comparar."
  />
);

export const NotaA = () => (
  <Nota
    letra="A"
    titulo="Bloque después del hero"
    resuelve={[
      "El cambio más chico: el hero no se toca y el bloque completo (vista previa, tres pasos, botón) queda justo después de la cinta.",
      "Es el que más explica el personalizador antes de entrar.",
    ]}
    sacrifica={[
      "En celular queda en la segunda pantalla: el hero de 540 px ocupa la primera.",
      "Dos botones dorados seguidos (WhatsApp del hero y Diseñar mi prenda) compiten.",
      "En escritorio el hero pasa a todo el ancho: mucha foto, mismo texto.",
    ]}
    construir="Poco: mover el bloque, cambiarle la foto y el botón, y pasar el mapa al final sin open."
  />
);

export const NotaB = () => (
  <Nota
    letra="B"
    titulo="En el hero"
    recomendada
    resuelve={[
      "El botón principal del hero es Diseñar mi prenda. La tarjeta con la vista previa se ve completa en escritorio y asoma en la primera pantalla del celular.",
      "En escritorio la tarjeta ocupa la columna que hoy tiene el mapa, a la misma altura del carrusel.",
      "Se queda el carrusel con la bienvenida y la promo que entra primero.",
    ]}
    sacrifica={[
      "WhatsApp sale del hero (queda el flotante, que late a los 4 s).",
      "En celular el hero baja de 540 a 500 px para que la tarjeta asome en la primera pantalla.",
      "Botón y tarjeta llevan al mismo lugar: es a propósito (uno lo dice, la otra lo muestra).",
    ]}
    construir="Poco: copy y botón del hero, la tarjeta en el lugar del mapa y el mapa al final sin open."
  />
);

export const NotaC = () => (
  <Nota
    letra="C"
    titulo="El personalizador es el hero"
    resuelve={[
      "Lo primero que ves es un diseño sobre la camiseta: el título dice lo que hace a Serflow distinto.",
      "La camiseta cambia de negra a blanca sola: se entiende que el color se escoge.",
    ]}
    sacrifica={[
      "Se van el carrusel de trabajos (y la promo que entra primero en él; queda la barra) y el Bienvenido a Serflow.",
      "Apuesta la portada a una función que aún no se ha probado con clientes.",
      "El único bucle nuevo de adorno y una foto más; la foto principal (LCP) pasa a ser la camiseta.",
    ]}
    construir="Medio: hero nuevo y HeroCarousel queda sin uso en el sitio."
  />
);
