import { Code, PageFrame, PageTitle, Row } from "../Chrome";

const STEPS = [
  { token: "--motion-fast", ms: 120, use: "Hover, press, cambio de color" },
  { token: "--motion-med", ms: 200, use: "Fade de view transition, abrir menú" },
  { token: "--motion-slow", ms: 280, use: "Entrada de catálogo, hero de categoría" },
];

export function BoardMotion() {
  return (
    <PageFrame family="foundations" width={1100}>
      <PageTitle
        title="Motion"
        description={
          <>
            Tres duraciones y una curva. Cortas a propósito: con mala señal en Cartagena la página ya tarda; la animación no
            puede sumar espera.
          </>
        }
      />

      <Row
        name="Duraciones"
        description={
          <>
            Pasa el cursor por el panel: cada barra recorre la misma distancia con su token y{" "}
            <Code>--ease-out</Code> = <Code>cubic-bezier(0.4, 0, 0.2, 1)</Code>.
          </>
        }
      >
        <div className="group flex flex-col gap-4">
          {STEPS.map((s) => (
            <div key={s.token} className="flex items-center gap-6">
              <div className="w-40 shrink-0">
                <div className="font-mono text-[12px] text-ink">{s.token}</div>
                <div className="text-[12px] text-muted">{s.use}</div>
              </div>
              <div className="relative h-8 flex-1 rounded-full bg-surface-2">
                <div
                  className="absolute left-1 top-1 h-6 w-6 rounded-full bg-accent group-hover:translate-x-[460px]"
                  style={{
                    transitionProperty: "transform",
                    transitionDuration: `var(${s.token})`,
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                />
              </div>
              <div className="w-16 text-right font-display text-[22px] font-bold">{s.ms}</div>
            </div>
          ))}
          <div className="flex items-center gap-6 pt-2">
            <div className="w-40 shrink-0 text-[12px] text-muted">Escala real (ms)</div>
            <div className="flex flex-1 flex-col gap-1.5">
              {STEPS.map((s) => (
                <div key={s.token} className="h-1.5 rounded-full bg-accent/70" style={{ width: `${(s.ms / 280) * 100}%` }} />
              ))}
            </div>
            <div className="w-16" />
          </div>
        </div>
      </Row>

      <Row
        name="Cómo se usan"
        description="En CSS con var(). En clases de Tailwind, con la sintaxis de variable, nunca un número suelto."
      >
        <div className="flex flex-col gap-2 text-[14px]">
          <div>
            <Code>animation: catalog-in var(--motion-slow) var(--ease-out) both;</Code>{" "}
            <span className="text-muted">global.css:109</span>
          </div>
          <div>
            <Code>transition-colors duration-(--motion-fast) ease-(--ease-out)</Code>{" "}
            <span className="text-muted">en vez de duration-300</span>
          </div>
        </div>
      </Row>

      <Row name="Reglas" description="Ninguna animación es necesaria para entender o usar la página.">
        <ul className="flex flex-col gap-3 text-[14px] leading-relaxed">
          <li>
            <span className="font-semibold text-ink">prefers-reduced-motion apaga todo.</span>{" "}
            <span className="text-muted">
              <Code>global.css:30-47</Code> pone <Code>animation: none</Code> y <Code>transition: none</Code> con{" "}
              <Code>!important</Code>, incluidas las view transitions, y quita el scroll suave.
            </span>
          </li>
          <li>
            <span className="font-semibold text-ink">Conexión lenta, sin transiciones.</span>{" "}
            <span className="text-muted">
              <Code>Layout.astro:62</Code> agrega <Code>.slow-connection</Code> al html según la Network Information API;{" "}
              <Code>global.css:19-24</Code> anula animaciones y transiciones, y <Code>:26-28</Code> quita el blur del{" "}
              <Code>.glass</Code>.
            </span>
          </li>
          <li>
            <span className="font-semibold text-ink">Nada bloquea la navegación.</span>{" "}
            <span className="text-muted">
              La view transition de raíz no anima la página saliente (<Code>global.css:58-62</Code>) y la nueva entra con
              un fade de 200 ms. Ningún clic espera a que termine una animación.
            </span>
          </li>
          <li>
            <span className="font-semibold text-ink">Máximo 280 ms.</span>{" "}
            <span className="text-muted">
              Si algo necesita más, probablemente es un loader, no una animación. El escalonado de catálogo suma 55 ms por
              ítem (<Code>global.css:110</Code>): úsalo con pocos ítems.
            </span>
          </li>
        </ul>
      </Row>
    </PageFrame>
  );
}
