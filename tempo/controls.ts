// Controles de Tempo para los componentes del design system (src/components/ui).
// Viven aquí y no en cada componente para que el sitio (Astro) no dependa de tempo-sdk.
// Una declaración por componente. Tempo descubre este archivo solo; no importarlo en la app ni en canvases.
import { defineControls } from "tempo-sdk/assets";
import { Button } from "../src/components/ui/Button";
import { WhatsAppFab } from "../src/components/ui/WhatsAppFab";
import { Chip } from "../src/components/ui/Chip";
import { Eyebrow } from "../src/components/ui/Eyebrow";
import { StatusPill } from "../src/components/ui/StatusPill";
import { ServiceCard } from "../src/components/ui/ServiceCard";
import { ProductCard } from "../src/components/ui/ProductCard";
import { WorkCard } from "../src/components/ui/WorkCard";
import { PromoCard } from "../src/components/ui/PromoCard";
import { PromoAfiche } from "../src/components/ui/PromoAfiche";
import { PromoGrid } from "../src/components/ui/PromoGrid";
import { PhotoSlot } from "../src/components/ui/PhotoSlot";
import { MascotSlot } from "../src/components/ui/MascotSlot";
import { QuickFacts } from "../src/components/ui/QuickFacts";
import { MapCard } from "../src/components/ui/MapCard";
import { EmptyState } from "../src/components/ui/EmptyState";
import { ErrorState } from "../src/components/ui/ErrorState";
import { Header } from "../src/components/ui/Header";
import { Section } from "../src/components/ui/Section";
import { Footer } from "../src/components/ui/Footer";
import { HeroCarousel } from "../src/components/ui/HeroCarousel";
import { Ticker } from "../src/components/ui/Ticker";
import { PromoBar } from "../src/components/ui/PromoBar";
import { Thread } from "../src/components/ui/Thread";

defineControls(Button, {
  children: { type: "text" },
  variant: { type: "select" },
  href: { type: "text" },
  external: { type: "boolean" },
  fullWidth: { type: "boolean" },
  icon: false,
});

defineControls(WhatsAppFab, {
  text: { type: "text" },
  placement: { type: "inline-radio" },
});

defineControls(Chip, {
  label: { type: "text" },
  selected: { type: "boolean" },
  name: false,
  value: false,
});

defineControls(Eyebrow, {
  children: { type: "text" },
});

defineControls(StatusPill, {
  tone: { type: "inline-radio" },
  children: { type: "text" },
  dot: { type: "boolean" },
});

defineControls(ServiceCard, {
  title: { type: "text" },
  description: { type: "text" },
  visual: { type: "select" },
  image: false,
});

defineControls(ProductCard, {
  name: { type: "text" },
  meta: { type: "text" },
  confirmedLabel: { type: "text" },
  href: { type: "text" },
  image: { type: "object" },
});

defineControls(WorkCard, {
  title: { type: "text" },
  technique: { type: "text" },
  image: { type: "object" },
});

defineControls(PromoCard, {
  promo: { type: "object" },
  headingLevel: { type: "inline-radio" },
});

defineControls(PromoAfiche, {
  promo: { type: "object" },
});

defineControls(PromoGrid, {
  children: false,
});

defineControls(PhotoSlot, {
  kind: { type: "select" },
  src: { type: "text" },
  alt: { type: "text" },
  caption: { type: "text" },
  priority: { type: "boolean" },
});

defineControls(MascotSlot, {
  size: { type: "inline-radio" },
  placement: { type: "inline-radio" },
  pose: false,
});

defineControls(QuickFacts, {
  openNow: { type: "boolean" },
});

defineControls(MapCard, {
  tall: { type: "boolean" },
  open: { type: "boolean" },
  title: { type: "text" },
});

defineControls(EmptyState, {
  title: { type: "text" },
  description: { type: "text" },
  action: { type: "object" },
  mascot: { type: "boolean" },
});

defineControls(ErrorState, {
  kind: { type: "inline-radio" },
  title: { type: "text" },
  description: { type: "text" },
  retryHref: { type: "text" },
});

defineControls(Header, {
  logoSrc: { type: "text" },
  links: { type: "object" },
  current: { type: "text" },
});

defineControls(Section, {
  id: { type: "text" },
  eyebrow: { type: "text" },
  title: { type: "text" },
  description: { type: "text" },
  tone: { type: "inline-radio" },
  children: false,
});

defineControls(Footer, {
  logoSrc: { type: "text" },
});

defineControls(HeroCarousel, {
  slides: { type: "object" },
  className: { type: "text" },
  children: false,
});

defineControls(Ticker, {
  items: { type: "object" },
});

defineControls(PromoBar, {
  promos: { type: "object" },
});

defineControls(Thread, {
  width: { type: "number" },
  height: { type: "number" },
  viewport: { type: "number" },
});
