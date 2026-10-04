import { QuickFacts } from "../../../../src/components/ui/QuickFacts";
import { MapCard } from "../../../../src/components/ui/MapCard";
import { ContactList } from "../../../../src/components/ui/ContactList";
import { Arrow, Code, DebtBoard, type DebtRow, Tile } from "../Chrome";

/*
 * Recreaciones "reimplemented for display": los originales viven dentro de
 * archivos .astro y no se pueden renderizar en el canvas de React. Cada copia
 * existe solo para este storyboard; no es un componente para usar.
 */

/** index.astro:140-145 + SectionContainer.astro:26-28 */
function LocationHeaderLookalike() {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted">Calle fictia #67-112</p>
      <p className="text-sm text-muted">🕐 Lunes a sábado, 8 a.m. – 6 p.m.</p>
      <p className="text-sm text-muted">🕐 Domingo y festivos, 8 a.m. – 2 p.m.</p>
    </div>
  );
}

/** index.astro:148-155: el iframe ocupa el lugar del mapa */
function MapIframeLookalike() {
  return (
    <div className="flex aspect-video w-[260px] items-center justify-center rounded-2xl bg-surface-2 text-[12px] text-muted">
      iframe Google Maps · se pide al acercarse con scroll
    </div>
  );
}

/** index.astro:174-189 */
function ContactAsideLookalike() {
  return (
    <div className="flex w-[220px] flex-col gap-4 text-left">
      <div className="flex flex-col gap-1.5">
        <h4 className="text-sm font-medium uppercase tracking-wide text-accent">Correo</h4>
        <span className="break-all text-sm text-muted">distribuidoraelmayorista@hotmail.com</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <h4 className="text-sm font-medium uppercase tracking-wide text-accent">Ubicación</h4>
        <span className="text-sm text-muted">Cartagena, Colombia</span>
      </div>
    </div>
  );
}

/** index.astro:191-214 y Footer.astro:57-87 */
function SocialSoonLookalike() {
  return (
    <div className="flex items-center gap-3 text-[12px]">
      <span className="text-muted/60">Facebook próximamente</span>
      <span className="text-muted/60">Instagram próximamente</span>
      <span className="text-muted/60">TikTok próximamente</span>
    </div>
  );
}

const ROWS: DebtRow[] = [
  {
    title: "Dirección de relleno publicada: 'Calle fictia #67-112'",
    body: (
      <>
        La sección Encuéntranos muestra una dirección inventada como si fuera real. Un cliente puede ir a buscarla.{" "}
        <Code>business.ts</Code> ya tiene <Code>ADDRESS = null</Code> y los componentes dicen &quot;Dirección por
        confirmar&quot;.
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/index.astro:143</Code> <span>description=&quot;Calle fictia #67-112&quot;</span>
      </>,
    ],
    fix: (
      <>
        Reemplazar la sección Encuéntranos (index.astro:140-156) por <Code>{"<MapCard />"}</Code>. Cuando el cliente
        confirme, se llena <Code>ADDRESS</Code> en un solo lugar.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="index.astro:140-145" reimplemented>
          <LocationHeaderLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="MapCard">
          <div className="w-[340px]">
            <MapCard />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Horario como líneas con emoji y copiado en tres formatos",
    body: (
      <>
        SectionContainer recibe el horario como texto libre y lo pinta con 🕐. El footer lo repite con otro formato
        (&quot;Lun–Sáb&quot;) y más emojis. Ninguno lee <Code>HOURS</Code>. (La fila de SectionContainer también está en
        la deuda de Etiquetas.)
      </>
    ),
    bullets: [
      <>
        <Code>src/components/SectionContainer.astro:8-9, 27-28</Code> <span>props scheduleWeekday/Weekend + 🕐</span>
      </>,
      <>
        <Code>src/pages/index.astro:144-145</Code> <span>el texto del horario escrito a mano</span>
      </>,
      <>
        <Code>src/components/Footer.astro:53-56</Code> <span>📍 📧 🕐 🕐 con datos repetidos</span>
      </>,
    ],
    fix: (
      <>
        Borrar <Code>description</Code>, <Code>scheduleWeekday</Code> y <Code>scheduleWeekend</Code> de
        SectionContainer; el horario lo pintan MapCard y QuickFacts desde <Code>HOURS</Code>. El footer usa{" "}
        <Code>HOURS[i].short</Code>.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="SectionContainer.astro:27-28" reimplemented>
          <LocationHeaderLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="QuickFacts">
          <div className="w-[340px]">
            <QuickFacts />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "El mapa de Google se pide sin que el usuario lo pida",
    body: (
      <>
        El iframe ya tiene <Code>loading=&quot;lazy&quot;</Code> y está en la 4.ª sección, así que no carga en la
        primera pintura (no es eager). Pero se pide en cuanto el usuario se acerca con scroll, quiera o no el mapa: cientos
        de KB de Google con mala señal. Además la URL del embed está copiada a mano.
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/index.astro:149-154</Code> <span>iframe lazy, siempre visible</span>
      </>,
      <>
        <Code>src/pages/index.astro:151</Code> <span>URL duplicada de MAP_EMBED_URL</span>
      </>,
    ],
    fix: (
      <>
        MapCard: mapa ilustrativo en CSS y el iframe dentro de un <Code>{"<details>"}</Code> cerrado. Verificado en
        Chromium: 0 requests a Google hasta tocar.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="warn" label="index.astro:148-155" reimplemented>
          <MapIframeLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="MapCard · details cerrado">
          <div className="w-[340px]">
            <MapCard />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "ContactForm arma el link de WhatsApp a mano y abre sin noopener",
    body: (
      <>
        El script del formulario tiene su propio número y construye la URL wa.me en vez de usar{" "}
        <Code>whatsappUrl()</Code>. <Code>window.open(url, &apos;_blank&apos;)</Code> sin <Code>noopener</Code> deja a la
        pestaña nueva con acceso a <Code>window.opener</Code>. El mensaje también usa emojis.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/ContactForm.astro:64</Code> <span>const localPhone = &apos;+573156481243&apos;</span>
      </>,
      <>
        <Code>src/components/ContactForm.astro:76</Code> <span>URL wa.me construida a mano</span>
      </>,
      <>
        <Code>src/components/ContactForm.astro:77</Code> <span>window.open(url, &apos;_blank&apos;)</span>
      </>,
    ],
    fix: (
      <>
        Importar <Code>whatsappUrl</Code> de <Code>business.ts</Code> en el script y abrir con{" "}
        <Code>window.open(url, &apos;_blank&apos;, &apos;noopener&apos;)</Code>. O decidir si el formulario sobra: la
        ContactList ya abre WhatsApp sin JS.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="target" label="ContactList · rel=noopener, sin JS">
          <div className="w-[340px]">
            <ContactList />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "JSON-LD sin dirección ni horario, con datos copiados",
    body: (
      <>
        El schema LocalBusiness del home no tiene <Code>streetAddress</Code> ni <Code>openingHoursSpecification</Code>, y
        el teléfono y el correo están escritos a mano. Podría leer <Code>business.ts</Code> (frontmatter de Astro) y
        agregar <Code>openingHoursSpecification</Code> desde <Code>HOURS</Code>; la dirección cuando{" "}
        <Code>ADDRESS</Code> deje de ser null.
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/index.astro:19-37</Code> <span>localBusinessSchema</span>
      </>,
      <>
        <Code>src/pages/index.astro:25-26</Code> <span>telephone y email literales</span>
      </>,
      <>
        <Code>src/pages/index.astro:27-31</Code> <span>address solo con ciudad y país</span>
      </>,
    ],
    fix: (
      <>
        Importar <Code>WHATSAPP_DISPLAY</Code>, <Code>EMAIL</Code>, <Code>HOURS</Code> y <Code>ADDRESS</Code> en el
        frontmatter y construir el schema con ellos. Ojo: <Code>HOURS.time</Code> es texto para personas; el schema
        necesita horas en formato 08:00.
      </>
    ),
    visual: <div />,
  },
  {
    title: "Correo y teléfono repetidos en tres archivos",
    body: (
      <>
        El mismo correo y el mismo número aparecen escritos a mano en el home, el footer y el formulario. Un cambio de
        número hoy son 6 ediciones.
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/index.astro:26, 180</Code> <span>correo</span>
      </>,
      <>
        <Code>src/pages/index.astro:25, 35, 203</Code> <span>teléfono / wa.me</span>
      </>,
      <>
        <Code>src/components/Footer.astro:54</Code> <span>correo</span> · <Code>:74</Code> <span>wa.me</span>
      </>,
      <>
        <Code>src/components/ContactForm.astro:64</Code> <span>teléfono</span>
      </>,
    ],
    fix: (
      <>
        Sección Contáctanos (index.astro:174-189) y bloque Contacto del footer pasan a <Code>{"<ContactList />"}</Code>;
        el resto importa de <Code>business.ts</Code>.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="index.astro:174-189" reimplemented>
          <ContactAsideLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="ContactList">
          <div className="w-[340px]">
            <ContactList />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Redes sociales como íconos apagados 'próximamente'",
    body: (
      <>
        Facebook, Instagram y TikTok se pintan en gris sin link. Ocupan espacio, parecen rotos y no llevan a ningún lado.
        ContactList no los incluye a propósito.
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/index.astro:196-201, 211-213</Code> <span>3 spans &quot;próximamente&quot;</span>
      </>,
      <>
        <Code>src/components/Footer.astro:61-62, 68-69, 84-85</Code> <span>los mismos 3</span>
      </>,
    ],
    fix: <>Quitarlos hasta que existan las cuentas; entonces se agregan como filas de ContactList con su link real.</>,
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="index.astro:196-213" reimplemented>
          <SocialSoonLookalike />
        </Tile>
      </div>
    ),
  },
];

export function BoardDesignSystemDebt() {
  return <DebtBoard family="info del negocio" rows={ROWS} />;
}
