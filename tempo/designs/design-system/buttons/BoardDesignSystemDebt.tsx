import { Button } from "../../../../src/components/ui/Button";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { WhatsAppIcon } from "../../../../src/components/icons/WhatsappIcon";
import { whatsappUrl } from "../../../../src/lib/business";
import { Arrow, Code, DebtBoard, Tile, type DebtRow } from "../Chrome";

/*
 * Recreaciones "reimplemented for display": los originales son clases @apply y
 * markup dentro de .astro, que no se pueden renderizar en el canvas. Existen solo
 * para ilustrar la deuda en este storyboard. Nadie debe usarlas.
 */

/** .btn-primary de src/styles/global.css:118 */
function BtnPrimaryLookalike({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 font-display text-[15px] text-primary">
      {children}
    </span>
  );
}

/** .btn-outline de src/styles/global.css:122 */
function BtnOutlineLookalike({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-accent px-7 py-3 text-[15px] font-semibold text-accent">
      <WhatsAppIcon className="size-5" />
      {children}
    </span>
  );
}

/** WhatsAppFAB.astro:10-19, con el tooltip visible. */
function GreenFabLookalike() {
  return (
    <div className="flex items-center gap-3">
      <span className="whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-[13px] font-medium text-gray-800 shadow-md">
        ¡Escríbenos! 💬
      </span>
      <span className="flex rounded-full bg-[#25D366] p-4 text-white shadow-lg shadow-black/30">
        <WhatsAppIcon className="size-7" />
      </span>
    </div>
  );
}

/** Botón dorado a mano de ProductPreview.astro:154-161 (y promos/[slug].astro:77). */
function SquareGoldLookalike() {
  return (
    <span className="flex w-[300px] items-center justify-center gap-3 rounded-2xl bg-accent px-6 py-4 font-display text-[18px] text-primary shadow-lg shadow-accent/10">
      <WhatsAppIcon className="size-5" />
      Preguntar por WhatsApp
    </span>
  );
}

const ROWS: DebtRow[] = [
  {
    title: "Clases .btn-primary / .btn-outline con @apply: 7 usos y jerarquía al revés",
    body: (
      <>
        Los botones viejos son dos clases globales en <Code>global.css</Code>, con <Code>font-titan</Code> (legado),{" "}
        <Code>duration-300</Code> fuera de los tokens de motion y sin sombra de presión. Los call sites las parchan con{" "}
        <Code>!important</Code>, y en el hero el dorado lleno es "Ver productos" mientras WhatsApp queda en outline: la
        acción que vende es la de menos peso.
      </>
    ),
    bullets: [
      <>
        <Code>src/styles/global.css:118</Code> .btn-primary · <Code>:122</Code> .btn-outline
      </>,
      <>
        <Code>src/components/Header.astro:72</Code> <Code>btn-primary text-sm !py-2 !px-5</Code> (override con !important) ·{" "}
        <Code>:136</Code> CTA móvil
      </>,
      <>
        <Code>src/components/SlideShow.astro:63</Code> btn-primary en "Ver productos" · <Code>:71</Code> btn-outline en el
        link de WhatsApp
      </>,
      <>
        <Code>src/components/ContactForm.astro:43</Code> btn-primary en el submit (Button aún no hace{" "}
        <Code>type="submit"</Code>; se agrega cuando se migre este form)
      </>,
      <>
        <Code>src/pages/404.astro:18</Code> btn-primary · <Code>:19</Code> btn-outline
      </>,
    ],
    fix: (
      <>
        Reemplazar cada uso por <Code>{"<Button>"}</Code>: WhatsApp en <Code>variant="whatsapp"</Code>, el resto en{" "}
        <Code>secondary</Code>. Con 0 usos, borrar las dos clases de <Code>global.css</Code>.
      </>
    ),
    visual: (
      <div className="flex flex-wrap items-start gap-4 pt-4">
        <Tile tone="remove" label="SlideShow.astro:63" reimplemented>
          <BtnPrimaryLookalike>Ver productos</BtnPrimaryLookalike>
        </Tile>
        <Tile tone="remove" label="SlideShow.astro:71" reimplemented>
          <BtnOutlineLookalike>Contáctanos</BtnOutlineLookalike>
        </Tile>
        <Arrow />
        <Tile tone="target" label="Button whatsapp + secondary">
          <div className="flex gap-3">
            <Button variant="whatsapp" href={whatsappUrl()} external>
              Escríbenos por WhatsApp
            </Button>
            <Button variant="secondary" href="/products/mi-tierra-querida">
              Ver productos
            </Button>
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "WhatsAppFAB.astro: verde fuera de paleta, tooltip blanco con emoji",
    body: (
      <>
        El flotante actual usa el verde de WhatsApp, que no existe en Noche caribe, un tooltip blanco que solo aparece con
        hover (no existe en el celular), <Code>hover:scale-110</Code> con <Code>duration-300</Code> y el número escrito a
        mano.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/WhatsAppFAB.astro:10</Code> <Code>bg-[#25D366] hover:bg-[#20BD5A]</Code>,{" "}
        <Code>duration-300</Code>, <Code>bottom-6 right-6</Code>
      </>,
      <>
        <Code>src/components/WhatsAppFAB.astro:16-18</Code> tooltip <Code>bg-white text-gray-800</Code>,{" "}
        <Code>font-vend-sans</Code>, "¡Escríbenos! 💬"
      </>,
      <>
        <Code>src/components/WhatsAppFAB.astro:6</Code> href con el número a mano
      </>,
      <>
        <Code>src/layouts/Layout.astro:82</Code> único montaje (correcto: uno por página)
      </>,
    ],
    fix: (
      <>
        En <Code>Layout.astro</Code> cambiar <Code>{"<WhatsAppFAB />"}</Code> por{" "}
        <Code>{"<WhatsAppFab />"}</Code> de <Code>src/components/ui</Code> y borrar el .astro.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="WhatsAppFAB.astro:10" reimplemented>
          <GreenFabLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="WhatsAppFab">
          <WhatsAppFab placement="inline" />
        </Tile>
      </div>
    ),
  },
  {
    title: "Número de WhatsApp escrito a mano en 10 lugares",
    body: (
      <>
        <Code>573156481243</Code> aparece literal en 8 archivos, con dos formatos (con y sin <Code>+</Code>; wa.me espera
        el número sin +). Si el taller cambia de línea, hay que acordarse de todos.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/Header.astro:69</Code> · <Code>:133</Code>
      </>,
      <>
        <Code>src/components/SlideShow.astro:68</Code> · <Code>src/components/WhatsAppFAB.astro:6</Code>
      </>,
      <>
        <Code>src/components/Footer.astro:74</Code> · <Code>src/pages/index.astro:35</Code> (JSON-LD) ·{" "}
        <Code>src/pages/index.astro:203</Code>
      </>,
      <>
        <Code>src/pages/promos/[slug].astro:74</Code> <Code>wa.me/+573156481243</Code> (con +)
      </>,
      <>
        <Code>src/components/ProductPreview.astro:359</Code> · <Code>src/components/ContactForm.astro:64</Code>{" "}
        <Code>'+573156481243'</Code> en scripts de cliente
      </>,
    ],
    fix: (
      <>
        Todo link pasa por <Code>whatsappUrl(text)</Code> de <Code>src/lib/business.ts</Code>; el JSON-LD usa{" "}
        <Code>WHATSAPP_NUMBER</Code>. Los componentes nuevos ya lo hacen.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="10 literales">
          <code className="font-mono text-[12px] text-danger">wa.me/573156481243?text=...</code>
        </Tile>
        <Arrow />
        <Tile tone="target" label="src/lib/business.ts">
          <code className="font-mono text-[12px] text-ok">whatsappUrl("Hola! ...")</code>
        </Tile>
      </div>
    ),
  },
  {
    title: "ProductPreview y ContactForm arman su propio link de WhatsApp en JS",
    body: (
      <>
        Los dos repiten la lógica de <Code>whatsappUrl</Code> dentro de un <Code>{"<script>"}</Code> y abren con{" "}
        <Code>window.open</Code>. ContactForm lo hace sin <Code>noopener</Code>. El botón de ProductPreview y el de promos
        son un tercer y cuarto estilo de botón dorado: <Code>rounded-2xl</Code>, <Code>py-4</Code>, <Code>font-titan</Code>.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/ProductPreview.astro:372</Code> arma la URL · <Code>:374</Code> window.open
      </>,
      <>
        <Code>src/components/ProductPreview.astro:154-161</Code> botón dorado a mano, "Preguntar por WhatsApp"
      </>,
      <>
        <Code>src/components/ContactForm.astro:76</Code> arma la URL · <Code>:77</Code>{" "}
        <Code>window.open(url, '_blank')</Code> sin noopener
      </>,
      <>
        <Code>src/pages/promos/[slug].astro:77</Code> mismo botón cuadrado, en un link
      </>,
    ],
    fix: (
      <>
        Importar <Code>whatsappUrl</Code> desde <Code>src/lib/business</Code> en ambos scripts (Astro empaqueta el import).
        Los botones pasan a <Code>{"<Button variant=\"whatsapp\" fullWidth>"}</Code>; promos con <Code>href</Code>,
        ProductPreview queda con su script porque el texto depende de la foto activa.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="ProductPreview.astro:154" reimplemented>
          <SquareGoldLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="Button whatsapp fullWidth">
          <div className="w-[300px]">
            <Button variant="whatsapp" fullWidth>
              Preguntar por WhatsApp
            </Button>
          </div>
        </Tile>
      </div>
    ),
  },
];

export function BoardDesignSystemDebt() {
  return <DebtBoard family="botones" rows={ROWS} />;
}
