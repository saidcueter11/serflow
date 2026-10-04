import { Header } from "../../../../src/components/ui/Header";
import { Section } from "../../../../src/components/ui/Section";
import { Footer } from "../../../../src/components/ui/Footer";
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
  WorkItems,
  DisponibleSinProductos,
  type EstadoDisponible,
  LOGO,
  PersonalizadorEntry,
  ProductItems,
  QuienesCopy,
  Razones,
  SERVICES,
} from "./portada";

/** La portada a 390px, armada solo con componentes de src/components/ui. */
export function BoardPortadaMobile({ estado = "productos" }: { estado?: EstadoDisponible }) {
  return (
    <div className="relative bg-primary font-body text-ink antialiased" style={{ width: 390 }}>
      <Header logoSrc={LOGO} />

      <main>
        <section className="fabric relative overflow-hidden px-4 pb-8 pt-6">
          <h1 className="font-display text-[38px] font-medium leading-[1.05] tracking-[-0.01em]">
            Camisetas y gorras con tu sello.
          </h1>
          <div className="mt-3 flex items-start gap-2">
            <p className="flex-1 text-[16px] leading-relaxed text-muted">
              Estampamos, imprimimos en DTF y bordamos en Cartagena. Ven al taller o escríbenos.
            </p>
            <MascotSlot size="lg" />
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth>
              Escríbenos por WhatsApp
            </Button>
            <Button variant="secondary" href="#ubicacion" fullWidth icon={<PinIcon className="size-4" />}>
              Cómo llegar
            </Button>
          </div>
          <div className="mt-6">
            <QuickFacts />
          </div>
        </section>

        <Section id="quienes-somos" title="Quiénes somos">
          <QuienesCopy className="text-[16px]" />
          <div className="mt-6">
            <Razones />
          </div>
        </Section>

        <Section
          id="que-hacemos"
          title="Qué hacemos"
          description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño."
        >
          <div className="grid gap-3">
            {SERVICES.map((s) => (
              <ServiceCard key={s.title} title={s.title} description={s.description} image={{ src: s.src, alt: s.title }} />
            ))}
          </div>
          <div className="mt-4">
            <PersonalizadorEntry />
          </div>
        </Section>

        <Section id="disponible" title="Disponible ahora" description="Lo que hay en el taller esta semana.">
          {estado === "productos" ? (
            <>
          <div className="-mx-4 grid snap-x auto-cols-[200px] grid-flow-col gap-3 overflow-x-auto px-4 pb-1">
            <ProductItems count={4} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <Button variant="ghost" href={CATALOG_HREF}>
              Ver todo →
            </Button>
          </div>
            </>
          ) : (
            <DisponibleSinProductos estado={estado} />
          )}
        </Section>

        <Section id="trabajos" title="Trabajos hechos" description="Algunas piezas que han salido del taller.">
          <div className="grid grid-cols-2 gap-3">
            <WorkItems />
          </div>
        </Section>

        <Section id="ubicacion" title="Dónde estamos">
          <MapCard />
        </Section>

        <Section id="contacto" title="Hablemos" description="Mándanos tu idea, una foto o el logo de tu negocio." tone="panel">
          <ContactList />
          <div className="mt-4">
            <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth>
              Escríbenos por WhatsApp
            </Button>
          </div>
        </Section>
      </main>

      <Footer logoSrc={LOGO} />
      <div className="absolute bottom-5 right-4">
        <WhatsAppFab placement="inline" />
      </div>
    </div>
  );
}
