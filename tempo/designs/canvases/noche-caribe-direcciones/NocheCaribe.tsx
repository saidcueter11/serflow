/// <reference types="vite/client" />
// Exploración "Noche caribe" (PRI-121). Canvas-local a propósito: es exploración
// HTML para elegir la fuente display; los componentes reales van en src/components/ui.
// Ronda 2: solo dorado de marca + neutros; portada vende el negocio primero.
import type { CSSProperties, ReactNode } from "react";
import logo from "../../../../src/assets/LOGO SERFLOW.png";

export type Variant = { name: string; display: string };

export const SLAB: Variant = { name: "Dorado + slab", display: "'Alfa Slab One', Georgia, serif" };
export const GROTESK: Variant = { name: "Dorado + Space Grotesk", display: "'Space Grotesk', system-ui, sans-serif" };

const FONTS =
  "@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Space+Grotesk:wght@500;700&display=swap');";

// Datos reales tomados de src/pages/index.astro. La dirección actual del sitio es de relleno.
const WHATSAPP = "+57 315 648 1243";
const EMAIL = "distribuidoraelmayorista@hotmail.com";
const ADDRESS = "Dirección por confirmar";
const HOURS = [
  { day: "Lunes a sábado", time: "8 a.m. – 6 p.m." },
  { day: "Domingo y festivos", time: "8 a.m. – 2 p.m." },
];

// Trama de tela solo con CSS: 0 KB de imagen.
const fabric: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(255,255,255,.028) 0 1px, transparent 1px 5px), repeating-linear-gradient(-45deg, rgba(0,0,0,.22) 0 1px, transparent 1px 5px)",
};

// Mapa ilustrativo en CSS; el mapa real (iframe) carga solo al tocar.
const streets: CSSProperties = {
  backgroundColor: "#22201a",
  backgroundImage:
    "linear-gradient(28deg, transparent 46%, #3a3627 46% 50%, transparent 50%), linear-gradient(-62deg, transparent 58%, #3a3627 58% 61%, transparent 61%), repeating-linear-gradient(28deg, transparent 0 34px, #2c291f 34px 36px), repeating-linear-gradient(-62deg, transparent 0 40px, #2c291f 40px 42px)",
};

function Root({ v, width, children }: { v: Variant; width: number; children: ReactNode }) {
  return (
    <div
      className="relative bg-[#17160f] text-[#F4F1E6] [font-family:system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] antialiased"
      style={{ width, ["--display" as string]: v.display }}
    >
      <style>{FONTS}</style>
      {children}
    </div>
  );
}

function Display({ className, children }: { className: string; children: ReactNode }) {
  return <h2 className={`[font-family:var(--display)] leading-[1.05] tracking-[-0.01em] ${className}`}>{children}</h2>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#3a3627] bg-[#1f1d15] px-3 py-1 text-[12px] font-medium text-[#B8B6AA]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" />
      {children}
    </span>
  );
}

function WaIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

function PinIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function WaButton({ label, full = false }: { label: string; full?: boolean }) {
  return (
    <a
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FFD700] px-6 text-[15px] font-bold text-[#17160f] shadow-[0_5px_0_#a8890a] transition-transform duration-[120ms] active:translate-y-[3px] active:shadow-[0_2px_0_#a8890a] ${full ? "w-full" : ""}`}
    >
      <WaIcon />
      {label}
    </a>
  );
}

function GhostButton({ label, icon, full = false }: { label: string; icon?: ReactNode; full?: boolean }) {
  return (
    <a
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#3a3627] px-6 text-[15px] font-semibold text-[#F4F1E6] ${full ? "w-full" : ""}`}
    >
      {icon}
      {label}
    </a>
  );
}

function Shirt({ color, className }: { color: string; className: string }) {
  return (
    <svg viewBox="0 0 120 116" className={className} aria-hidden>
      <path
        d="M30 10 L48 4 Q60 14 72 4 L90 10 L106 34 L89 43 L86 37 L86 112 L34 112 L34 37 L31 43 L14 34 Z"
        fill={color}
        stroke="rgba(0,0,0,.35)"
        strokeWidth="1.5"
      />
      <rect x="44" y="34" width="32" height="34" rx="3" fill="none" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  );
}

function Cap({ color, className }: { color: string; className: string }) {
  return (
    <svg viewBox="0 0 130 90" className={className} aria-hidden>
      <path d="M18 66 Q18 22 62 18 Q104 22 106 66 Z" fill={color} stroke="rgba(0,0,0,.35)" strokeWidth="1.5" />
      <path d="M62 66 Q104 62 126 74 Q96 84 60 76 Z" fill={color} stroke="rgba(0,0,0,.35)" strokeWidth="1.5" />
      <rect x="44" y="34" width="34" height="20" rx="3" fill="none" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  );
}

// Placeholder de la mascota: silueta de tití cabeciblanco. El personaje real es PRI-124.
export function Titi({ className }: { className: string }) {
  return (
    <figure className={`flex flex-col items-center ${className}`}>
      <svg viewBox="0 0 160 190" className="h-full w-full" role="img" aria-label="Tití cabeciblanco saludando (placeholder)">
        <path d="M104 160 Q156 162 150 118 Q146 86 122 96" fill="none" stroke="#4a3b2e" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="80" cy="128" rx="32" ry="40" fill="#4a3b2e" />
        <ellipse cx="80" cy="136" rx="18" ry="26" fill="#e9e2cf" opacity=".9" />
        <path d="M52 112 Q30 96 36 70" fill="none" stroke="#4a3b2e" strokeWidth="9" strokeLinecap="round" />
        <circle cx="36" cy="66" r="7" fill="#2b211a" />
        <ellipse cx="80" cy="74" rx="23" ry="21" fill="#2b211a" />
        <path d="M50 70 Q46 34 68 30 Q80 8 94 30 Q116 34 110 70 Q100 50 80 48 Q60 50 50 70 Z" fill="#F4F1E6" />
        <circle cx="72" cy="74" r="3.2" fill="#F4F1E6" />
        <circle cx="88" cy="74" r="3.2" fill="#F4F1E6" />
        <path d="M74 86 Q80 90 86 86" fill="none" stroke="#F4F1E6" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <figcaption className="mt-1 whitespace-nowrap rounded-full bg-[#2a271c] px-2 py-0.5 text-[10px] uppercase tracking-[.08em] text-[#B8B6AA]">
        Tití · placeholder
      </figcaption>
    </figure>
  );
}

const RAZONES = [
  { n: "01", title: "A tu gusto", copy: "Cada prenda sale de tu idea. Nada genérico." },
  { n: "02", title: "Acabados que duran", copy: "Bordado y estampado con materiales de calidad." },
  { n: "03", title: "Atención directa", copy: "Te asesoramos por WhatsApp, sin vueltas." },
];

const TECNICAS = [
  { name: "Estampado", copy: "Mate, toma la textura de la tela. Ideal para camisetas." },
  { name: "DTF", copy: "Colores vivos y con brillo. Fotos y degradados." },
  { name: "Bordado", copy: "Hilo con relieve. El clásico de las gorras." },
];

function Swatch({ kind }: { kind: string }) {
  if (kind === "DTF")
    return (
      <div className="relative h-16 overflow-hidden rounded-[12px] bg-[linear-gradient(135deg,#D2BD3C,#FFD700_55%,#F4F1E6)]">
        <div className="absolute -left-4 top-0 h-full w-10 rotate-12 bg-white/40 blur-[6px]" />
      </div>
    );
  if (kind === "Bordado")
    return (
      <div className="flex h-16 items-center justify-center rounded-[12px] bg-[#2a271c]" style={fabric}>
        <div className="h-9 w-20 rounded-full border-[3px] border-dashed border-[#FFD700] shadow-[inset_0_2px_0_rgba(255,255,255,.15)]" />
      </div>
    );
  return (
    <div className="relative h-16 overflow-hidden rounded-[12px] bg-[#D2BD3C]">
      <div className="absolute inset-0 mix-blend-multiply" style={fabric} />
    </div>
  );
}

function TecnicaCard({ t }: { t: (typeof TECNICAS)[number] }) {
  return (
    <article className="rounded-[20px] border border-[#3a3627] bg-[#1f1d15] p-3">
      <Swatch kind={t.name} />
      <h3 className="mt-3 text-[16px] font-bold">{t.name}</h3>
      <p className="mt-1 text-[13px] leading-snug text-[#B8B6AA]">{t.copy}</p>
    </article>
  );
}

function Chip({ label, on = false }: { label: string; on?: boolean }) {
  return (
    <span
      className={`inline-flex min-h-[44px] items-center rounded-full border px-4 text-[14px] font-semibold ${on ? "border-[#FFD700] bg-[#FFD700] text-[#17160f]" : "border-[#3a3627] bg-[#1f1d15] text-[#F4F1E6]"}`}
    >
      {label}
    </span>
  );
}

const COLORS = ["#F4F1E6", "#17160f", "#1f3a5f", "#7a1f2b", "#3f5a3a"];

function ColorDots({ selected = 1 }: { selected?: number }) {
  return (
    <div className="flex gap-2">
      {COLORS.map((c, i) => (
        <span
          key={c}
          className={`flex h-11 w-11 items-center justify-center rounded-full ${i === selected ? "ring-2 ring-[#FFD700] ring-offset-2 ring-offset-[#17160f]" : ""}`}
        >
          <span className="h-8 w-8 rounded-full border border-white/20" style={{ background: c }} />
        </span>
      ))}
    </div>
  );
}

function ProductCard({ name, meta, garment }: { name: string; meta: string; garment: "shirt" | "cap" }) {
  return (
    <article className="w-[200px] shrink-0 overflow-hidden rounded-[20px] border border-[#3a3627] bg-[#1f1d15]">
      <div className="flex h-[150px] items-center justify-center bg-[#2a271c]" style={fabric}>
        {garment === "shirt" ? <Shirt color="#F4F1E6" className="h-28" /> : <Cap color="#1f3a5f" className="h-20" />}
      </div>
      <div className="p-3">
        <span className="text-[11px] font-semibold uppercase tracking-[.06em] text-[#D2BD3C]">Confirmado hace 2 días</span>
        <h3 className="mt-1 text-[15px] font-bold leading-tight">{name}</h3>
        <p className="mt-0.5 text-[13px] text-[#B8B6AA]">{meta}</p>
      </div>
    </article>
  );
}

function OpenNow() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4ADE80]/10 px-2.5 py-1 text-[12px] font-semibold text-[#4ADE80]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" /> Abierto ahora
    </span>
  );
}

function Header({ desktop = false }: { desktop?: boolean }) {
  return (
    <header className={`flex items-center justify-between border-b border-[#3a3627]/60 ${desktop ? "px-12 py-4" : "px-4 py-3"}`}>
      <img src={logo} alt="Serflow" className={desktop ? "h-9" : "h-7"} />
      {desktop ? (
        <nav className="flex items-center gap-8 text-[15px] font-medium text-[#B8B6AA]">
          <a className="text-[#F4F1E6]">Quiénes somos</a>
          <a>Qué hacemos</a>
          <a>Disponible ahora</a>
          <a>Ubicación</a>
          <WaButton label="Escríbenos" />
        </nav>
      ) : (
        <button aria-label="Abrir menú" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3a3627]">
          <span className="block h-[2px] w-5 bg-[#F4F1E6] shadow-[0_6px_0_#F4F1E6,0_-6px_0_#F4F1E6]" />
        </button>
      )}
    </header>
  );
}

// Datos rápidos del negocio: lo primero que se ve después del titular.
function QuickFacts() {
  return (
    <ul className="divide-y divide-[#3a3627] rounded-[20px] border border-[#3a3627] bg-[#1f1d15]">
      <li className="flex min-h-[56px] items-center gap-3 px-4">
        <PinIcon className="h-5 w-5 shrink-0 text-[#FFD700]" />
        <span className="text-[14px]">
          Cartagena · <span className="text-[#B8B6AA]">{ADDRESS}</span>
        </span>
      </li>
      <li className="flex min-h-[56px] items-center justify-between gap-3 px-4">
        <span className="text-[14px]">
          Lun a sáb <span className="text-[#B8B6AA]">8 a.m. – 6 p.m.</span>
        </span>
        <OpenNow />
      </li>
      <li className="flex min-h-[56px] items-center gap-3 px-4">
        <WaIcon size={18} />
        <span className="text-[14px]">
          {WHATSAPP} <span className="text-[#B8B6AA]">· te respondemos aquí</span>
        </span>
      </li>
    </ul>
  );
}

function Razones() {
  return (
    <ul className="space-y-4">
      {RAZONES.map((r) => (
        <li key={r.n} className="flex gap-4">
          <span className="[font-family:var(--display)] text-[22px] leading-none text-[#FFD700]">{r.n}</span>
          <div>
            <h3 className="text-[16px] font-bold">{r.title}</h3>
            <p className="mt-0.5 text-[14px] text-[#B8B6AA]">{r.copy}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MapCard({ tall = false }: { tall?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#3a3627] bg-[#1f1d15]">
      <div className={`relative flex items-center justify-center ${tall ? "h-[260px]" : "h-[180px]"}`} style={streets}>
        <PinIcon className="h-12 w-12 text-[#FFD700] drop-shadow-[0_4px_8px_rgba(0,0,0,.6)]" />
        <span className="absolute bottom-2 left-3 rounded-full bg-[#17160f]/80 px-2 py-0.5 text-[11px] text-[#B8B6AA]">
          Toca para abrir el mapa
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-[16px] font-bold">Serflow · Cartagena</h3>
          <p className="text-[14px] text-[#B8B6AA]">{ADDRESS}</p>
        </div>
        <dl className="space-y-1 text-[14px]">
          {HOURS.map((h) => (
            <div key={h.day} className="flex justify-between gap-4">
              <dt className="text-[#B8B6AA]">{h.day}</dt>
              <dd>{h.time}</dd>
            </div>
          ))}
        </dl>
        <GhostButton label="Cómo llegar" icon={<PinIcon className="h-4 w-4" />} full />
      </div>
    </div>
  );
}

function ContactList() {
  return (
    <ul className="divide-y divide-[#3a3627] rounded-[20px] border border-[#3a3627] bg-[#1f1d15]">
      <li className="flex min-h-[56px] items-center justify-between gap-3 px-4">
        <span className="text-[13px] uppercase tracking-[.08em] text-[#B8B6AA]">WhatsApp</span>
        <span className="text-[15px] font-semibold">{WHATSAPP}</span>
      </li>
      <li className="flex min-h-[56px] items-center justify-between gap-3 px-4">
        <span className="text-[13px] uppercase tracking-[.08em] text-[#B8B6AA]">Correo</span>
        <span className="truncate text-[13px]">{EMAIL}</span>
      </li>
    </ul>
  );
}

// Entrada al personalizador: secundaria, después de presentar el negocio.
function PersonalizadorTeaser({ desktop = false }: { desktop?: boolean }) {
  return (
    <div className={`flex items-center gap-4 rounded-[20px] border border-dashed border-[#D2BD3C]/60 bg-[#1f1d15] ${desktop ? "p-8" : "p-4"}`} style={fabric}>
      <div className={`flex shrink-0 items-center justify-center rounded-[12px] bg-[#2a271c] ${desktop ? "h-32 w-32" : "h-24 w-24"}`}>
        <Shirt color="#17160f" className={desktop ? "h-24" : "h-[72px]"} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className={`font-bold ${desktop ? "text-[22px]" : "text-[17px]"}`}>¿Ya tienes tu diseño?</h3>
        <p className="mt-1 text-[14px] text-[#B8B6AA]">Pruébalo sobre la camiseta o la gorra y mándanos el resultado.</p>
        <a className="mt-2 inline-flex min-h-[44px] items-center text-[14px] font-semibold text-[#FFD700]">Probar el personalizador →</a>
      </div>
    </div>
  );
}

function WaFab() {
  return (
    <span
      aria-label="Escríbenos por WhatsApp"
      className="absolute bottom-5 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFD700] text-[#17160f] shadow-[0_8px_24px_rgba(0,0,0,.5)]"
    >
      <WaIcon size={28} />
    </span>
  );
}

export function PortadaMobile({ v }: { v: Variant }) {
  return (
    <Root v={v} width={390}>
      <Header />
      <section className="relative overflow-hidden px-4 pb-8 pt-6" style={fabric}>
        <div className="absolute -right-16 -top-10 h-56 w-56 rounded-full bg-[#FFD700] opacity-[.08] blur-2xl" />
        <Eyebrow>Taller en Cartagena</Eyebrow>
        <Display className="mt-4 pr-24 text-[38px]">Camisetas y gorras con tu sello.</Display>
        <p className="mt-3 pr-28 text-[16px] leading-relaxed text-[#B8B6AA]">
          Estampamos, imprimimos en DTF y bordamos en Cartagena. Ven al taller o escríbenos.
        </p>
        <Titi className="absolute right-2 top-24 h-[150px] w-[110px]" />
        <div className="mt-6 flex flex-col gap-3">
          <WaButton label="Escríbenos por WhatsApp" full />
          <GhostButton label="Cómo llegar" icon={<PinIcon className="h-4 w-4" />} full />
        </div>
        <div className="mt-6">
          <QuickFacts />
        </div>
      </section>

      <section className="px-4 py-8">
        <Display className="text-[28px]">Quiénes somos</Display>
        <p className="mt-3 text-[16px] leading-relaxed text-[#B8B6AA]">
          Somos un taller en <span className="text-[#F4F1E6]">Cartagena</span> que hace prendas personalizadas. La ropa no solo se usa,{" "}
          <span className="text-[#F4F1E6]">se vive</span>: por eso cada pieza lleva algo tuyo.
        </p>
        <div className="mt-6">
          <Razones />
        </div>
      </section>

      <section className="px-4 py-8">
        <Display className="text-[28px]">Qué hacemos</Display>
        <p className="mt-2 text-[15px] text-[#B8B6AA]">Camisetas y gorras, con la técnica que mejor le quede a tu diseño.</p>
        <div className="mt-4 grid grid-cols-1 gap-3">
          {TECNICAS.map((t) => (
            <TecnicaCard key={t.name} t={t} />
          ))}
        </div>
        <div className="mt-4">
          <PersonalizadorTeaser />
        </div>
      </section>

      <section className="py-8">
        <div className="flex items-end justify-between px-4">
          <Display className="text-[22px]">Disponible ahora</Display>
          <a className="flex min-h-[44px] items-center text-[14px] font-semibold text-[#FFD700]">Ver todo →</a>
        </div>
        <p className="px-4 text-[13px] text-[#B8B6AA]">Lo que hay en el taller esta semana.</p>
        <div className="mt-4 flex gap-3 overflow-hidden px-4">
          <ProductCard name="Camiseta oversize" meta="Blanca · S a XL" garment="shirt" />
          <ProductCard name="Gorra trucker" meta="Azul · bordado" garment="cap" />
        </div>
      </section>

      <section className="px-4 py-8">
        <Display className="text-[28px]">Dónde estamos</Display>
        <div className="mt-4">
          <MapCard />
        </div>
      </section>

      <section className="px-4 py-8">
        <Display className="text-[28px]">Hablemos</Display>
        <p className="mt-2 text-[15px] text-[#B8B6AA]">Mándanos tu idea, una foto o el logo de tu negocio.</p>
        <div className="mt-4">
          <ContactList />
        </div>
        <div className="mt-4">
          <WaButton label="Escríbenos por WhatsApp" full />
        </div>
      </section>

      <footer className="border-t border-[#3a3627]/60 px-4 pb-24 pt-6 text-[13px] text-[#B8B6AA]">
        <img src={logo} alt="Serflow" className="h-6" />
        <p className="mt-3">Camisetas y gorras personalizadas · Cartagena, Colombia</p>
      </footer>
      <WaFab />
    </Root>
  );
}

export function FichaMobile({ v }: { v: Variant }) {
  return (
    <Root v={v} width={390}>
      <header className="flex items-center justify-between px-4 py-3">
        <button aria-label="Volver" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3a3627] text-[18px]">
          ←
        </button>
        <img src={logo} alt="Serflow" className="h-6" />
        <span className="w-11" />
      </header>
      <div className="mx-4 flex h-[340px] items-center justify-center rounded-[20px] bg-[#2a271c]" style={fabric}>
        <Shirt color="#17160f" className="h-64" />
      </div>
      <div className="mt-4 px-4">
        <ColorDots />
      </div>
      <section className="px-4 pt-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/12 px-3 py-1 text-[12px] font-semibold text-[#FFD700]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700]" /> Disponible · confirmado hace 2 días
        </span>
        <Display className="mt-3 text-[32px]">Camiseta oversize negra</Display>
        <p className="mt-2 text-[15px] text-[#B8B6AA]">Algodón peinado, corte amplio. Lista para personalizar o llevar tal cual.</p>

        <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[.08em] text-[#B8B6AA]">Talla</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip label="S" />
          <Chip label="M" />
          <Chip label="L" on />
          <Chip label="XL" />
        </div>

        <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[.08em] text-[#B8B6AA]">¿Le ponemos algo?</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip label="Así está bien" on />
          <Chip label="Estampado" />
          <Chip label="DTF" />
          <Chip label="Bordado" />
        </div>
        <p className="mt-4 rounded-[12px] border border-dashed border-[#3a3627] p-3 text-[13px] text-[#B8B6AA]">
          El taller te confirma colores, medidas y tiempo por WhatsApp.
        </p>
      </section>
      <div className="mt-8 space-y-2 border-t border-[#3a3627] bg-[#17160f]/95 px-4 pb-5 pt-3">
        <WaButton label="Pedir por WhatsApp" full />
        <GhostButton label="Personalizar esta" full />
      </div>
    </Root>
  );
}

export function PortadaDesktop({ v }: { v: Variant }) {
  return (
    <Root v={v} width={1280}>
      <Header desktop />
      <section className="relative grid grid-cols-[1.15fr_1fr] items-center gap-14 overflow-hidden px-12 py-16" style={fabric}>
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#FFD700] opacity-[.07] blur-3xl" />
        <div>
          <Eyebrow>Taller en Cartagena</Eyebrow>
          <Display className="mt-5 text-[68px]">Camisetas y gorras con tu sello.</Display>
          <p className="mt-5 max-w-[500px] text-[19px] leading-relaxed text-[#B8B6AA]">
            Estampamos, imprimimos en DTF y bordamos en Cartagena. Ven al taller o escríbenos y lo armamos contigo.
          </p>
          <div className="mt-8 flex gap-3">
            <WaButton label="Escríbenos por WhatsApp" />
            <GhostButton label="Cómo llegar" icon={<PinIcon className="h-4 w-4" />} />
          </div>
        </div>
        <div className="relative">
          <MapCard />
          <Titi className="absolute -left-24 -top-10 h-[170px] w-[124px]" />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-14 px-12 py-14">
        <div>
          <Display className="text-[40px]">Quiénes somos</Display>
          <p className="mt-4 text-[18px] leading-relaxed text-[#B8B6AA]">
            Somos un taller en <span className="text-[#F4F1E6]">Cartagena</span> que hace prendas personalizadas. La ropa no solo se usa,{" "}
            <span className="text-[#F4F1E6]">se vive</span>: por eso cada pieza lleva algo tuyo.
          </p>
        </div>
        <div className="pt-3">
          <Razones />
        </div>
      </section>

      <section className="px-12 py-14">
        <Display className="text-[40px]">Qué hacemos</Display>
        <p className="mt-2 text-[17px] text-[#B8B6AA]">Camisetas y gorras, con la técnica que mejor le quede a tu diseño.</p>
        <div className="mt-6 grid grid-cols-3 gap-5">
          {TECNICAS.map((t) => (
            <TecnicaCard key={t.name} t={t} />
          ))}
        </div>
        <div className="mt-5">
          <PersonalizadorTeaser desktop />
        </div>
      </section>

      <section className="grid grid-cols-[1fr_2fr] gap-10 px-12 py-14">
        <div>
          <Display className="text-[36px]">Disponible ahora</Display>
          <p className="mt-3 text-[16px] text-[#B8B6AA]">Lo que hay en el taller esta semana.</p>
          <a className="mt-4 inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[#FFD700]">Ver todo →</a>
        </div>
        <div className="flex gap-4">
          <ProductCard name="Camiseta oversize" meta="Blanca · S a XL" garment="shirt" />
          <ProductCard name="Gorra trucker" meta="Azul · bordado" garment="cap" />
          <ProductCard name="Camiseta básica" meta="Negra · S a XXL" garment="shirt" />
        </div>
      </section>

      <section className="mx-12 mb-14 grid grid-cols-2 items-center gap-10 rounded-[20px] border border-[#3a3627] bg-[#1f1d15] px-10 py-10" style={fabric}>
        <div>
          <Display className="text-[40px]">Hablemos</Display>
          <p className="mt-2 text-[17px] text-[#B8B6AA]">Mándanos tu idea, una foto o el logo de tu negocio.</p>
          <div className="mt-6">
            <WaButton label="Escríbenos por WhatsApp" />
          </div>
        </div>
        <ContactList />
      </section>

      <footer className="flex items-center justify-between border-t border-[#3a3627]/60 px-12 py-6 text-[14px] text-[#B8B6AA]">
        <img src={logo} alt="Serflow" className="h-7" />
        <p>Camisetas y gorras personalizadas · Cartagena, Colombia</p>
      </footer>
    </Root>
  );
}
