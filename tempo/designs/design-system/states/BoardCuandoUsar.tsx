import { Code, PageFrame, PageTitle } from "../Chrome";

type Answer = "EmptyState" | "ErrorState" | "Ocultar" | "Nada" | "404";

const ANSWER: Record<Answer, string> = {
  EmptyState: "border-accent/50 text-accent",
  ErrorState: "border-danger/60 text-danger",
  Ocultar: "border-line text-muted",
  Nada: "border-line text-muted",
  "404": "border-line text-ink",
};

const ROWS: { situation: string; answer: Answer; why: string }[] = [
  {
    situation: "Disponible ahora con 0 prendas confirmadas",
    answer: "EmptyState",
    why: "El cliente vino a eso. Esconder la sección lo deja buscando; el estado le dice qué pasa y lo manda a WhatsApp.",
  },
  {
    situation: "Página de una categoría sin productos activos",
    answer: "EmptyState",
    why: "La URL existe y alguien llegó. Acción: otra categoría o WhatsApp.",
  },
  {
    situation: "Card de esa categoría en el home (CategoryShowcase)",
    answer: "Ocultar",
    why: "Hoy dice \"0 productos\" y lleva a la página vacía. Mejor no ofrecer un camino sin nada al final.",
  },
  {
    situation: "Trabajos hechos sin fotos",
    answer: "Ocultar",
    why: "Sección opcional: nadie la busca. Un \"todavía no hay trabajos\" resta confianza. WorkCard y PhotoSlot ya lo asumen.",
  },
  {
    situation: "Sin campaña activa · sin productos relacionados",
    answer: "Ocultar",
    why: "Ya se hace: index.astro:73 y [id].astro:143 solo renderizan si hay datos.",
  },
  {
    situation: "Bloque de cliente sin señal (PRI-122)",
    answer: "ErrorState",
    why: "kind=\"offline\". Reintentar cuando vuelva la señal; WhatsApp encola el mensaje.",
  },
  {
    situation: "Bloque de cliente que falló con señal",
    answer: "ErrorState",
    why: "kind=\"load\". Solo reemplaza ese bloque; el resto de la página sigue.",
  },
  {
    situation: "Supabase falla durante el build",
    answer: "Nada",
    why: "El build falla y sigue el deploy anterior. Ningún visitante lo ve, así que no hay estado que diseñar.",
  },
  {
    situation: "URL que no existe",
    answer: "404",
    why: "La página 404.astro, no estos componentes. Debe ganar la salida por WhatsApp (ver Debt).",
  },
];

export function BoardCuandoUsar() {
  return (
    <PageFrame family="estados" width={1200}>
      <PageTitle
        title="Cuándo usar cuál"
        description={
          <>
            Tres preguntas, en orden. ¿Algo falló? <Code>ErrorState</Code>. ¿El cliente vino a ver justo esto?{" "}
            <Code>EmptyState</Code>. ¿Es opcional? No se renderiza: ni título, ni caja vacía.
          </>
        }
      />
      <div className="overflow-hidden rounded-card border border-line">
        <div className="grid grid-cols-[320px_140px_1fr] gap-6 border-b border-line bg-surface-2 px-6 py-3 text-[12px] uppercase tracking-[.14em] text-muted">
          <span>Situación</span>
          <span>Qué mostrar</span>
          <span>Por qué</span>
        </div>
        {ROWS.map((r) => (
          <div
            key={r.situation}
            className="grid grid-cols-[320px_140px_1fr] items-start gap-6 border-b border-line bg-surface px-6 py-4 last:border-b-0"
          >
            <span className="text-[15px] font-semibold leading-snug text-ink">{r.situation}</span>
            <span>
              <span className={`inline-flex rounded-full border px-3 py-1 font-mono text-[12px] ${ANSWER[r.answer]}`}>
                {r.answer}
              </span>
            </span>
            <span className="text-[14px] leading-relaxed text-muted">{r.why}</span>
          </div>
        ))}
      </div>
    </PageFrame>
  );
}
