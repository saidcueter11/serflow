import { Header } from "../../../../src/components/ui/Header";
import { Section } from "../../../../src/components/ui/Section";
import { Footer } from "../../../../src/components/ui/Footer";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { Button } from "../../../../src/components/ui/Button";
import { QuickFacts } from "../../../../src/components/ui/QuickFacts";
import { MascotSlot } from "../../../../src/components/ui/MascotSlot";
import { ServiceCard } from "../../../../src/components/ui/ServiceCard";
import { MapCard } from "../../../../src/components/ui/MapCard";
import { ContactList } from "../../../../src/components/ui/ContactList";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { PinIcon } from "../../../../src/components/icons/PinIcon";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import {
  CATALOG_HREF,
  CanvasNote,
  DisponibleSinProductos,
  type EstadoDisponible,
  LOGO,
  PersonalizadorEntry,
  ProductItems,
  QuienesCopy,
  Razones,
  SERVICES,
} from "./portada";

/** La portada a 1280px, armada solo con componentes de src/components/ui. */
export function BoardPortadaDesktop({ estado = "productos" }: { estado?: EstadoDisponible }) {
  return (
    <div className="relative bg-primary font-body text-ink antialiased" style={{ width: 1280 }}>
      <Header logoSrc={LOGO} />

      <main>
        <section className="fabric relative grid grid-cols-[1.15fr_1fr] items-center gap-14 px-12 py-16">
          <div>
            <Eyebrow>Taller en Cartagena</Eyebrow>
            <h1 className="mt-5 font-display text-[68px] font-medium leading-[1.05] tracking-[-0.01em]">
              Camisetas y gorras con tu sello.
            </h1>
            <p className="mt-5 max-w-[500px] text-[19px] leading-relaxed text-muted">
              Estampamos, imprimimos en DTF y bordamos en Cartagena. Ven al taller o escríbenos.
            </p>
            <div className="mt-8 flex gap-3">
              <Button variant="whatsapp" href={WHATSAPP_URL} external>
                Escríbenos por WhatsApp
              </Button>
              <Button variant="secondary" href="#ubicacion" icon={<PinIcon className="size-4" />}>
                Cómo llegar
              </Button>
            </div>
            <div className="mt-8 max-w-[520px]">
              <QuickFacts />
            </div>
          </div>
          {/* En desktop el mapa sube al hero y hace de #ubicacion; la sección Dónde estamos es solo móvil. */}
          <div id="ubicacion" className="relative">
            <MapCard tall />
            <MascotSlot size="lg" placement="corner" />
          </div>
        </section>

        <Section id="quienes-somos" title="Quiénes somos">
          <div className="grid grid-cols-2 gap-14">
            <QuienesCopy className="text-[18px]" />
            <Razones />
          </div>
        </Section>

        <Section
          id="que-hacemos"
          title="Qué hacemos"
          description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño."
        >
          <div className="grid grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <ServiceCard key={s.title} title={s.title} description={s.description} visual={s.visual} />
            ))}
          </div>
          <div className="mt-5">
            <PersonalizadorEntry desktop />
          </div>
        </Section>

        <Section id="disponible" title="Disponible ahora" description="Lo que hay en el taller esta semana.">
          {estado === "productos" ? (
            <>
          <div className="grid grid-cols-4 gap-4">
            <ProductItems count={4} />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <Button variant="ghost" href={CATALOG_HREF}>
              Ver todo →
            </Button>
            <span className="text-[12px] text-muted">fotos de ejemplo</span>
          </div>
            </>
          ) : (
            <DisponibleSinProductos estado={estado} />
          )}
        </Section>

        <div className="px-8">
          <CanvasNote>
            Trabajos hechos va aquí y no se renderiza: todavía no hay fotos reales de trabajos. Dónde estamos tampoco:
            en desktop el mapa está en el hero.
          </CanvasNote>
        </div>

        <Section id="contacto" title="Hablemos" description="Mándanos tu idea, una foto o el logo de tu negocio." tone="panel">
          <div className="grid grid-cols-[minmax(0,560px)_auto] items-center gap-10">
            <ContactList />
            <div>
              <Button variant="whatsapp" href={WHATSAPP_URL} external>
                Escríbenos por WhatsApp
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer logoSrc={LOGO} />
      <div className="absolute bottom-5 right-6">
        <WhatsAppFab placement="inline" />
      </div>
    </div>
  );
}
