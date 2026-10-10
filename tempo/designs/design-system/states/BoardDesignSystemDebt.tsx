import { Button } from "../../../../src/components/ui/Button";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { Arrow, Code, DebtBoard, type DebtRow, Tile } from "../Chrome";

/*
 * Recreaciones "reimplemented for display": los originales viven dentro de
 * archivos .astro y no se pueden renderizar en el canvas de React. Cada copia
 * existe solo para este storyboard; no es un componente para usar.
 */

/** ProductCardList.astro:101-109 */
function EmptyCategoryLookalike() {
  return (
    <div className="w-[300px] rounded-2xl border border-primary-lighter bg-surface p-8 text-center">
      <p className="text-sm text-muted">No hay productos disponibles en esta categoría por ahora.</p>
    </div>
  );
}

/** 404.astro:9-20 */
function NotFoundLookalike() {
  return (
    <div className="flex w-[300px] flex-col items-center py-4 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">Error 404</p>
      <h1 className="mt-4 font-display text-3xl">Página no encontrada</h1>
      <p className="mt-4 text-sm text-muted">
        Lo sentimos, la página que intentas visitar no está disponible. Puedes regresar al inicio o explorar nuestras
        categorías.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <span className="rounded-full bg-accent px-7 py-3 font-display text-primary">Ir al inicio</span>
        <span className="rounded-full border-2 border-accent px-7 py-3 font-semibold text-accent">Ver productos</span>
      </div>
    </div>
  );
}

/** CategoryShowcase.astro:25 / ProductCardList.astro:58 */
function GrayTileLookalike({ fabric }: { fabric?: boolean }) {
  return (
    <div
      className={`relative aspect-[3/4] w-[120px] overflow-hidden rounded-2xl ${fabric ? "fabric bg-surface-2" : "bg-zinc-800"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="font-display text-[15px] leading-tight text-white">Gorras</div>
        <div className="text-[11px] text-muted">{fabric ? "6 productos" : "0 productos"}</div>
      </div>
    </div>
  );
}

const ROWS: DebtRow[] = [
  {
    title: "Categoría vacía: una caja sin salida en ProductCardList",
    body: (
      <>
        Cuando una categoría no tiene productos activos se pinta una caja con una sola frase. No hay acción: el cliente
        llegó, no ve nada y no sabe a dónde ir. Además usa <Code>rounded-2xl</Code>, <Code>border-primary-lighter</Code>{" "}
        y <Code>font-vend-sans</Code> en vez de los tokens de la familia.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/ProductCardList.astro:100-109</Code> la rama <Code>list.length === 0</Code>
      </>,
    ],
    fix: (
      <>
        Reemplazar el <Code>{"<div>"}</Code> por <Code>{"<EmptyState>"}</Code> con salida por WhatsApp (
        <Code>whatsappUrl()</Code>) o a otra categoría. El wrapper conserva <Code>data-grid</Code> y{" "}
        <Code>hidden</Code> para el script de pestañas.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="ProductCardList.astro:101" reimplemented>
          <EmptyCategoryLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="EmptyState">
          <div className="w-[340px]">
            <EmptyState
              title="Todavía no hay gorras aquí"
              description="Escríbenos: las hacemos por encargo y te contamos tiempos."
              action={{ label: "Pregunta por WhatsApp", href: WHATSAPP_URL }}
            />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Conteo de productos: el error de Supabase se traga y sale \"0 productos\"",
    body: (
      <>
        Las demás funciones de catálogo lanzan si Supabase falla, así que el build falla y sigue el deploy anterior (bien:
        ningún visitante ve un catálogo roto). <Code>getCategoriesWithCounts</Code> solo revisa el error de categorías; si
        falla la consulta de productos, cada categoría queda en 0 y el home publica "0 productos" en todas las cards.
      </>
    ),
    bullets: [
      <>
        <Code>src/lib/products.ts:13, :75, :89</Code> <Code>throw</Code> en getCategories, getProducts,
        getProductsByCategory
      </>,
      <>
        <Code>src/lib/products.ts:50-56</Code> se revisa <Code>categoriesRes.error</Code> pero no{" "}
        <Code>productsRes.error</Code>
      </>,
      <>
        <Code>src/components/CategoryShowcase.astro:34</Code> pinta <Code>{"{cat.product_count} productos"}</Code>
      </>,
    ],
    fix: (
      <>
        Lanzar también con <Code>productsRes.error</Code>, igual que las otras funciones. No hace falta ErrorState: en SSG
        el error nunca llega al visitante.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="CategoryShowcase.astro:34" reimplemented>
          <GrayTileLookalike />
        </Tile>
      </div>
    ),
  },
  {
    title: "if (error) return null: un fallo se ve igual que \"no hay datos\"",
    body: (
      <>
        Cuatro funciones convierten el error en vacío. En promos es grave: si Supabase falla en el build, no se generan
        las páginas de campaña y un link de promo que ya circula por WhatsApp da 404. Las dos de slug no tienen ningún
        llamador. Los dos <Code>catch {"{}"}</Code> del sitio no son deuda: dan un valor de respaldo razonable (og:image
        sin convertir, foto vacía en el mensaje).
      </>
    ),
    bullets: [
      <>
        <Code>src/lib/products.ts:123</Code> getActivePromos → <Code>[]</Code>; lo usa{" "}
        <Code>src/pages/promos/[slug].astro:9</Code> en getStaticPaths
      </>,
      <>
        <Code>src/lib/products.ts:113</Code> getActivePromo → <Code>null</Code>; <Code>index.astro:73</Code> esconde el
        banner
      </>,
      <>
        <Code>src/lib/products.ts:27, :102</Code> getCategoryBySlug y getProductBySlug: 0 llamadores
      </>,
      <>
        <Code>[id].astro:53</Code>, <Code>ProductPreview.astro:365</Code> catch con respaldo: se quedan
      </>,
    ],
    fix: (
      <>
        Lanzar en getActivePromos y getActivePromo con error (sin campaña activa sigue siendo <Code>[]</Code> o{" "}
        <Code>null</Code>, y la sección se oculta). Borrar las dos funciones de slug sin llamadores.
      </>
    ),
    visual: null,
  },
  {
    title: "Caja gris bg-zinc-800 cuando una categoría no tiene imagen",
    body: (
      <>
        Color fuera de la paleta y un relleno que la regla de fotos prohíbe ("una sección sin su foto nunca muestra
        relleno"). En una card que es link no se puede ocultar solo la foto, así que el respaldo debe venir de los tokens.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/CategoryShowcase.astro:25</Code> card del home
      </>,
      <>
        <Code>src/components/ProductCardList.astro:58</Code> banner de la categoría
      </>,
    ],
    fix: (
      <>
        Cambiar a <Code>bg-surface-2 fabric</Code> (0 KB, en paleta). Y en CategoryShowcase, no listar categorías con{" "}
        <Code>product_count === 0</Code>: no ofrecer un camino que termina vacío.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="bg-zinc-800" reimplemented>
          <GrayTileLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="bg-surface-2 fabric" reimplemented>
          <GrayTileLookalike fabric />
        </Tile>
      </div>
    ),
  },
  {
    title: "404.astro: el único estado \"no encontrado\", con estilos legado y sin WhatsApp",
    body: (
      <>
        Micro-etiqueta con tracking fuera de escala, botones de clases globales legado, fuentes legado y un link fijo a una
        categoría que puede dejar de existir. Pide disculpas pero no ofrece hablar con el taller. Es una página, no una
        sección: se compone con Eyebrow y Button, no con EmptyState.
      </>
    ),
    bullets: [
      <>
        <Code>src/pages/404.astro:10</Code> <Code>tracking-[0.25em] uppercase text-xs</Code>,{" "}
        <Code>font-vend-sans</Code>
      </>,
      <>
        <Code>src/pages/404.astro:11</Code> <Code>font-titan</Code>
      </>,
      <>
        <Code>src/pages/404.astro:18-19</Code> <Code>btn-primary</Code> / <Code>btn-outline</Code> (global.css:118, :122)
      </>,
      <>
        <Code>src/pages/404.astro:19</Code> <Code>/products/mi-tierra-querida</Code> fijo (también Header.astro:45,
        Footer.astro:32, SlideShow.astro:62)
      </>,
    ],
    fix: (
      <>
        <Code>{"<Eyebrow>Error 404</Eyebrow>"}</Code> + título en <Code>font-display</Code> + copy cercano +{" "}
        <Code>{'<Button variant="whatsapp" href={whatsappUrl()}>'}</Code> y{" "}
        <Code>{'<Button variant="secondary" href="/">'}</Code>. Borrar btn-primary/btn-outline cuando no queden usos.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-4">
        <Tile tone="remove" label="404.astro:9-20" reimplemented>
          <NotFoundLookalike />
        </Tile>
        <Arrow />
        <Tile tone="target" label="Eyebrow + Button">
          <div className="flex w-[300px] flex-col items-center gap-4 py-4 text-center">
            <Eyebrow>Error 404</Eyebrow>
            <h1 className="font-display text-[30px] font-bold leading-tight text-ink">Esta página no existe</h1>
            <p className="text-[15px] leading-relaxed text-muted">
              Puede que el link esté viejo. Escríbenos y te mandamos lo que buscabas.
            </p>
            <Button variant="whatsapp" href={WHATSAPP_URL} external>
              Escríbenos por WhatsApp
            </Button>
            <Button variant="secondary" href="/">
              Ir al inicio
            </Button>
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "ErrorState no sirve para bloques que se reintentan sin recargar (personalizador, PRI-122)",
    body: (
      <>
        Su Reintentar es un link a <Code>retryHref</Code>: recarga la página. En el personalizador eso borra la imagen que el
        cliente subió (no se guarda en ningún lado). Además trae siempre "Escríbenos por WhatsApp" con el texto genérico,
        que en /personaliza se salta el mensaje armado. El canvas del personalizador dibuja por eso una caja propia
        dentro de la vista previa.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/ui/ErrorState.tsx</Code> Reintentar con <Code>href</Code> y WhatsApp fijo
      </>,
      <>
        <Code>tempo/designs/canvases/personalizador/propuesta/VistaPrevia.tsx</Code> modo <Code>sin-senal</Code>
      </>,
    ],
    fix: (
      <>
        Sumar a ErrorState un modo de reintento por acción (botón, para islas con JS) y un prop para ocultar WhatsApp donde
        la página ya tiene su envío. Relacionado (familia buttons): Button sin estado <Code>disabled</Code> y sin variante
        principal que no sea WhatsApp; la muestra de técnica de ServiceCard exportada con tamaño.
      </>
    ),
    visual: null,
  },
];

export function BoardDesignSystemDebt() {
  return <DebtBoard family="estados" rows={ROWS} />;
}
