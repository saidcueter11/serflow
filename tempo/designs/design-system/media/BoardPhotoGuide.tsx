import { Code, PageFrame, PageTitle, Row } from "../Chrome";

const KINDS = [
  {
    kind: "local",
    ratio: "4 / 3",
    title: "El local",
    what: "La fachada con el letrero, de día, desde la acera del frente. Y el mostrador con alguien atendiendo.",
    tips: ["Horizontal, celular a la altura del pecho", "Sin carros ni gente tapando la entrada", "Luz de mañana, sin el sol de frente"],
  },
  {
    kind: "estanterias",
    ratio: "4 / 5",
    title: "Estanterías",
    what: "Los estantes de frente, ordenados, con las prendas dobladas o colgadas por color.",
    tips: ["Vertical, de frente (no en diagonal)", "Luz pareja: luces del local prendidas, sin flash", "Llenar el cuadro con el estante, sin techo ni piso"],
  },
  {
    kind: "equipo",
    ratio: "3 / 2",
    title: "El equipo",
    what: "Personas trabajando de verdad: en la máquina de bordar, en la plancha de estampado, empacando un pedido.",
    tips: ["Horizontal, manos y cara en el cuadro", "Pedir permiso a cada persona que salga", "Nada de poses mirando a cámara si se puede evitar"],
  },
  {
    kind: "trabajo",
    ratio: "4 / 5",
    title: "Trabajos terminados",
    what: "Cada prenda terminada sola, sobre fondo liso (pared blanca, tela gris o cartulina).",
    tips: ["Vertical, prenda centrada y estirada", "Luz de ventana de lado, sin flash", "Una foto del detalle: bordado o estampado de cerca"],
  },
];

const BUDGET = [
  ["Formato", "WebP o AVIF (JPG solo como fuente para convertir)"],
  ["Ancho máximo", "1600 px; el sitio nunca la muestra más grande"],
  ["Peso objetivo", "menos de 150 KB por foto ya exportada"],
  ["Prioridad", "una sola foto con priority por página (la del hero)"],
  ["Cantidad", "3 a 6 por tipo; mejor pocas buenas que muchas regulares"],
  ["Derechos", "solo fotos propias del taller; nada de stock ni de Google"],
];

export function BoardPhotoGuide() {
  return (
    <PageFrame family="fotos y mascota" width={1200}>
      <PageTitle
        title="Guía de fotos para el cliente"
        description="Qué fotografiar para que cada PhotoSlot tenga contenido real. Se puede hacer con el celular. Mientras falte una foto, su sección no aparece en el sitio: no hay apuro, pero tampoco relleno."
      />

      <Row name="Qué fotografiar" description="Un encuadre por tipo. El marco gris muestra la proporción en la que se va a recortar.">
        <div className="grid grid-cols-2 gap-5">
          {KINDS.map((k) => (
            <div key={k.kind} className="flex gap-4 rounded-tile border border-line bg-primary p-4">
              <div
                className="w-[72px] shrink-0 self-start rounded-tile border-2 border-dashed border-line"
                style={{ aspectRatio: k.ratio }}
                aria-hidden="true"
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[16px] font-bold">{k.title}</span>
                  <Code>{`kind="${k.kind}"`}</Code>
                </div>
                <p className="text-[13px] leading-relaxed text-muted">{k.what}</p>
                <ul className="flex flex-col gap-1 text-[13px] leading-snug text-muted">
                  {k.tips.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="text-accent">·</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Row>

      <Row name="Presupuesto de peso" description="El sitio se abre con mala señal. Una foto de celular pesa 3 a 5 MB; hay que exportarla antes de subirla.">
        <table className="w-full text-left text-[14px]">
          <tbody>
            {BUDGET.map(([k, v]) => (
              <tr key={k} className="border-t border-line first:border-t-0">
                <td className="w-[160px] py-2 pr-4 font-semibold text-ink">{k}</td>
                <td className="py-2 text-muted">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Row>

      <Row name="Luz y encuadre" description="Lo que más cambia el resultado con un celular.">
        <ul className="flex flex-col gap-2 text-[14px] leading-relaxed text-muted">
          <li>Limpiar el lente antes de cada sesión.</li>
          <li>Sin flash y sin zoom digital: acercarse caminando.</li>
          <li>Luz de día o las luces del taller prendidas; evitar contraluz (ventana detrás de la persona o la prenda).</li>
          <li>Dejar margen alrededor: el marco recorta según el tipo, lo importante va al centro.</li>
          <li>Nombrar los archivos por tipo: <Code>trabajo-gorra-bordada-01.jpg</Code>, para saber dónde va cada una.</li>
        </ul>
      </Row>
    </PageFrame>
  );
}
