import type { ReactNode } from "react";
import { Arrow, Code, DebtBoard, Tile, type DebtRow } from "../Chrome";

function Note({ children }: { children: ReactNode }) {
  return <span className="text-muted">{children}</span>;
}

function Chip({ cls, label }: { cls: string; label?: string }) {
  return <div className={`h-10 w-10 rounded-tile ${cls}`} title={label} />;
}

const ROWS: DebtRow[] = [
  {
    title: "font-vend-sans (Inter) sigue en 31 usos, 15 archivos",
    body: (
      <>
        El texto nuevo usa <Code>font-body</Code> (fuente del sistema, 0 descarga). Los .astro siguen pidiendo{" "}
        <Code>font-vend-sans</Code>, que es Inter desde Google Fonts. <Code>tokens.css:34-36</Code> lo marca como legado.
      </>
    ),
    bullets: [
      <>
        <Code>src/layouts/Layout.astro:69</Code> <Note>en el body: todo el sitio hereda Inter</Note>
      </>,
      <>
        <Code>src/pages/index.astro:83,87,103,117,168,174</Code> <Note>6 usos</Note>
      </>,
      <>
        <Code>src/components/Footer.astro:16,23,50,97,100</Code> <Note>5 usos</Note>
      </>,
      <>
        <Code>src/components/SectionContainer.astro:26-28</Code> · <Code>ProductCardList.astro:65,84,106</Code>{" "}
        <Note>3 + 3</Note>
      </>,
      <>
        <Code>Header.astro:34,112</Code> · <Code>SlideShow.astro:47,56</Code> · <Code>404.astro:10,12</Code>{" "}
        <Note>2 cada uno</Note>
      </>,
      <>
        <Code>Card.astro:30</Code> · <Code>PromoBanner.astro:30</Code> · <Code>CategoryShowcase.astro:33</Code> ·{" "}
        <Code>WhatsAppFAB.astro:16</Code> · <Code>ContactForm.astro:5</Code> · <Code>products/[category]/[id].astro:115</Code>{" "}
        · <Code>promos/[slug].astro:27</Code> <Note>1 cada uno</Note>
      </>,
      <>
        <Code>src/styles/global.css:123</Code> <Note>.btn-outline</Note>
      </>,
    ],
    fix: (
      <>
        Reemplazar por <Code>font-body</Code> (empezando por Layout.astro:69, que arregla la herencia de golpe), luego
        borrar <Code>--font-vend-sans</Code> de tokens.css.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="font-vend-sans · Inter">
          <span className="text-[16px]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Ven al taller
          </span>
        </Tile>
        <Arrow />
        <Tile tone="target" label="font-body">
          <span className="font-body text-[16px]">Ven al taller</span>
        </Tile>
      </div>
    ),
  },
  {
    title: "Presupuesto de fuentes: Layout carga 8 pesos, el sistema usa 2",
    body: (
      <>
        Layout pide Space Grotesk 400/500/600/700 e Inter 400/500/600/700. El sistema solo necesita Space Grotesk 500 y
        700. Además 15 usos de <Code>font-titan font-normal</Code> piden el peso 400.
      </>
    ),
    bullets: [
      <>
        <Code>src/layouts/Layout.astro:34</Code>{" "}
        <Note>family=Space+Grotesk:wght@400;500;600;700&amp;family=Inter:wght@400;500;600;700</Note>
      </>,
      <>
        <Code>src/styles/global.css:119</Code> <Note>.btn-primary con font-titan font-normal</Note>
      </>,
      <>
        <Code>src/components/Title.astro:12</Code> <Note>títulos de sección con font-titan font-normal</Note>
      </>,
    ],
    fix: (
      <>
        Dejar <Code>Space+Grotesk:wght@500;700</Code> y quitar Inter cuando la fila anterior llegue a cero. Migrar{" "}
        <Code>font-titan font-normal</Code> a <Code>font-display font-medium</Code>.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="8 pesos">
          <span className="font-mono text-[12px] text-muted">SG 400 500 600 700 · Inter 400 500 600 700</span>
        </Tile>
        <Arrow />
        <Tile tone="target" label="2 pesos">
          <span className="font-mono text-[12px] text-ink">SG 500 700</span>
        </Tile>
      </div>
    ),
  },
  {
    title: "Duraciones fijas ignoran los tokens de motion (16 usos)",
    body: (
      <>
        <Code>duration-300</Code>, <Code>duration-500</Code> y <Code>duration-[480ms]</Code> están por encima del máximo
        de 280 ms y no siguen a <Code>--motion-*</Code>. Solo las keyframes de global.css usan los tokens.
      </>
    ),
    bullets: [
      <>
        <Code>src/styles/global.css:115,119,123</Code> <Note>.underline-hover, .btn-primary, .btn-outline · 300 ms</Note>
      </>,
      <>
        <Code>src/components/Header.astro:9,18,86</Code> <Note>300 ms, incluido el menú mobile</Note>
      </>,
      <>
        <Code>src/components/ProductCard.astro:24,49</Code> · <Code>Card.astro:16</Code> ·{" "}
        <Code>CategoryShowcase.astro:13</Code> · <Code>ProductPreview.astro:34</Code> · <Code>WhatsAppFAB.astro:10</Code> ·{" "}
        <Code>index.astro:110</Code> · <Code>ProductCardList.astro:84</Code> <Note>300 ms</Note>
      </>,
      <>
        <Code>src/components/Card.astro:25</Code> <Note>duration-500 en el zoom de imagen</Note>
      </>,
      <>
        <Code>src/components/ProductCardList.astro:36</Code> <Note>duration-[480ms] (el valor viejo de --motion-slow)</Note>
      </>,
    ],
    fix: (
      <>
        <Code>duration-(--motion-fast)</Code> para hover/color, <Code>duration-(--motion-med)</Code> para menú,{" "}
        <Code>duration-(--motion-slow)</Code> para carruseles; <Code>ease-(--ease-out)</Code>.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="duration-300 / 500 / [480ms]">
          <span className="font-mono text-[13px] text-muted">300 · 500 · 480</span>
        </Tile>
        <Arrow />
        <Tile tone="target" label="--motion-*">
          <span className="font-mono text-[13px] text-ink">120 · 200 · 280</span>
        </Tile>
      </div>
    ),
  },
  {
    title: "Hex fuera de paleta",
    body: (
      <>
        Tres lugares escriben color a mano. El verde de WhatsApp es de marca externa y puede quedarse, pero como token,
        no como hex suelto.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/WhatsAppFAB.astro:10</Code> <Note>bg-[#25D366] hover:bg-[#20BD5A]</Note>
      </>,
      <>
        <Code>src/styles/global.css:135</Code> <Note>.gold-gradient: #FFD700 a #CCB429 (#CCB429 no es token)</Note>
      </>,
      <>
        <Code>src/styles/global.css:15</Code> <Note>gradiente del body con #232116 (no es token) y #17160f (= primary)</Note>
      </>,
    ],
    fix: (
      <>
        Botón de WhatsApp en dorado (<Code>bg-accent text-primary</Code>) o un token <Code>--color-whatsapp</Code> si se
        decide mantener el verde. Gradiente con <Code>accent</Code> a <Code>accent-deep</Code>; body con{" "}
        <Code>var(--color-primary-light)</Code> y <Code>var(--color-primary)</Code>.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="#25D366 · #CCB429 · #232116">
          <div className="flex gap-2">
            <Chip cls="bg-[#25D366]" />
            <Chip cls="bg-[#CCB429]" />
            <Chip cls="bg-[#232116] border border-line" />
          </div>
        </Tile>
        <Arrow />
        <Tile tone="target" label="accent · accent-deep · primary-light">
          <div className="flex gap-2">
            <Chip cls="bg-accent" />
            <Chip cls="bg-accent-deep" />
            <Chip cls="bg-primary-light border border-line" />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "text-white en lugar de text-ink (34 usos)",
    body: (
      <>
        Blanco puro (#FFFFFF) sobre el fondo cálido rompe el tono; <Code>text-ink</Code> (#F4F1E6) es el blanco del
        sistema. <Code>text-white/80</Code> imita a muted sin serlo.
      </>
    ),
    bullets: [
      <>
        <Code>src/layouts/Layout.astro:69</Code> <Note>body text-white: el default de todo el sitio</Note>
      </>,
      <>
        <Code>src/components/Title.astro:12</Code> · <Code>index.astro:114,165</Code> ·{" "}
        <Code>products/[category]/[id].astro:145</Code> · <Code>promos/[slug].astro:49</Code> <Note>títulos</Note>
      </>,
      <>
        <Code>src/components/Header.astro:38,46,54,62,95</Code> · <Code>Footer.astro:28,33,38,43</Code>{" "}
        <Note>hover:text-white en navegación</Note>
      </>,
      <>
        <Code>src/components/ContactForm.astro:9,21,33</Code> <Note>texto de inputs</Note>
      </>,
      <>
        <Code>src/components/Card.astro:30</Code> · <Code>SlideShow.astro:56</Code> <Note>text-white/80</Note>
      </>,
    ],
    fix: (
      <>
        <Code>text-white</Code> a <Code>text-ink</Code>, <Code>text-white/80</Code> a <Code>text-muted</Code>. Sobre fotos
        (SlideShow, ProductPreview) también ink.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="text-white">
          <span className="font-display text-[18px] font-medium text-white">Qué hacemos</span>
        </Tile>
        <Arrow />
        <Tile tone="target" label="text-ink">
          <span className="font-display text-[18px] font-medium text-ink">Qué hacemos</span>
        </Tile>
      </div>
    ),
  },
  {
    title: "Bordes blancos translúcidos en lugar de border-line",
    body: (
      <>
        <Code>border-white/5</Code> y <Code>ring-white/20</Code> cambian según el fondo y no son el borde del sistema.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/Card.astro:16</Code> <Note>border-white/5</Note>
      </>,
      <>
        <Code>src/components/ProductCard.astro:24</Code> · <Code>CategoryShowcase.astro:13</Code>{" "}
        <Note>ring-white/20, hover ring-white/40</Note>
      </>,
      <>
        <Code>src/components/PromoBanner.astro:19</Code> <Note>ring-white/15</Note>
      </>,
    ],
    fix: (
      <>
        <Code>border-line</Code> (o <Code>ring-line</Code>) en reposo y <Code>hover:border-accent/30</Code> como ya hace
        Card.astro:16.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="border-white/5">
          <div className="h-12 w-20 rounded-card border border-white/5 bg-surface" />
        </Tile>
        <Arrow />
        <Tile tone="target" label="border-line">
          <div className="h-12 w-20 rounded-card border border-line bg-surface" />
        </Tile>
      </div>
    ),
  },
  {
    title: "Radios fuera de escala: rounded-2xl / rounded-xl (21 usos)",
    body: (
      <>
        Cards e imágenes usan <Code>rounded-2xl</Code> (16 px) y los inputs <Code>rounded-xl</Code> (12 px). El sistema
        tiene <Code>rounded-card</Code> (20) y <Code>rounded-tile</Code> (12).
      </>
    ),
    bullets: [
      <>
        <Code>src/components/ProductCard.astro:24,29,49</Code> · <Code>Card.astro:16</Code> ·{" "}
        <Code>CategoryShowcase.astro:13</Code> · <Code>PromoBanner.astro:19</Code> <Note>rounded-2xl en cards</Note>
      </>,
      <>
        <Code>src/pages/index.astro:110,148</Code> · <Code>promos/[slug].astro:37,59</Code> ·{" "}
        <Code>ProductCardList.astro:104</Code> <Note>rounded-2xl</Note>
      </>,
      <>
        <Code>src/components/ContactForm.astro:9,21,33</Code> <Note>rounded-xl en inputs</Note>
      </>,
      <>
        <Code>src/styles/global.css:82</Code> <Note>view transition category-hero con border-radius: 1rem</Note>
      </>,
    ],
    fix: (
      <>
        Cards a <Code>rounded-card</Code>, inputs y miniaturas a <Code>rounded-tile</Code> (mismo valor que rounded-xl,
        pero con nombre).
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="remove" label="rounded-2xl · 16px">
          <div className="h-12 w-20 rounded-2xl border border-line bg-surface-2" />
        </Tile>
        <Arrow />
        <Tile tone="target" label="rounded-card · 20px">
          <div className="h-12 w-20 rounded-card border border-line bg-surface-2" />
        </Tile>
      </div>
    ),
  },
  {
    title: "Padding de sección distinto al de la dirección",
    body: (
      <>
        <Code>.section-padding</Code> usa <Code>px-6 md:px-12 lg:px-20</Code>. La dirección aprobada usa{" "}
        <Code>px-4</Code> en mobile y <Code>px-12</Code> en desktop.
      </>
    ),
    bullets: [
      <>
        <Code>src/styles/global.css:130-132</Code> <Note>la definición</Note>
      </>,
      <>
        <Code>src/components/SectionContainer.astro:20</Code> · <Code>Footer.astro:11</Code> · <Code>404.astro:9</Code>{" "}
        <Note>consumidores</Note>
      </>,
    ],
    fix: <>Cambiar a <Code>px-4 md:px-12</Code> al migrar cada sección; revisar en 375 px.</>,
    visual: null,
  },
  {
    title: "Vigilar: --motion-* pasó de 220/320/480 a 120/200/280",
    body: (
      <>
        Cambio de esta pasada (PRI-121). Todo lo que ya usaba los tokens ahora es más rápido. No es deuda todavía; hay
        que mirarlo en el sitio.
      </>
    ),
    bullets: [
      <>
        <Code>git show HEAD:src/styles/global.css</Code> <Note>líneas 17-19: 220ms / 320ms / 480ms</Note>
      </>,
      <>
        <Code>src/styles/tokens.css:43-45</Code> <Note>ahora 120ms / 200ms / 280ms</Note>
      </>,
      <>
        <Code>src/styles/global.css:65,86,92,109</Code>{" "}
        <Note>afectados: fade de view transition, hero de categoría, entrada de catálogo</Note>
      </>,
    ],
    fix: <>Revisar en mobile la transición de categoría y el catalog-in; si se sienten cortadas, ajustar el token, no el uso.</>,
    visual: null,
  },
  {
    title: "Nombre engañoso: primary es el fondo",
    body: (
      <>
        En casi cualquier sistema <Code>primary</Code> es el color de acción. Aquí es el fondo de página, así que{" "}
        <Code>text-primary</Code> significa texto oscuro. Es fácil que alguien (o un agente) ponga{" "}
        <Code>bg-primary</Code> en un botón esperando dorado.
      </>
    ),
    bullets: [
      <>
        <Code>src/styles/tokens.css:7-8</Code> <Note>el comentario lo advierte</Note>
      </>,
      <>
        <Code>src/styles/global.css:119,123</Code> <Note>text-primary / hover:text-primary sobre dorado</Note>
      </>,
      <>
        <Code>src/styles/global.css:127</Code> <Note>.glass: bg-primary/70</Note>
      </>,
    ],
    fix: (
      <>
        Renombrar a <Code>--color-bg</Code> (y <Code>bg-light</Code>, <Code>bg-lighter</Code>) en una pasada propia con
        reemplazo global. Mientras tanto, la regla está en el storyboard Color.
      </>
    ),
    visual: (
      <div className="flex items-start gap-4 pt-1">
        <Tile tone="warn" label="bg-primary ≠ acento">
          <div className="flex gap-2">
            <Chip cls="bg-primary border border-line" />
            <Chip cls="bg-accent" />
          </div>
        </Tile>
      </div>
    ),
  },
  {
    title: "Íconos con APIs distintas y color fijo adentro",
    body: (
      <>
        Cada ícono tiene su propia firma: unos aceptan <Code>className</Code>, otros un <Code>size</Code> numérico que
        arma la clase en tiempo de ejecución, y varios fijan su color dentro del SVG. Una clase armada así no la detecta
        Tailwind: <Code>size-5</Code> solo funciona si otra parte del código la usa.
      </>
    ),
    bullets: [
      <>
        <Code>src/components/icons/LeftArrowIcon.tsx:1</Code> y <Code>RightArrowIcon.tsx:1</Code> · <Code>{"size-${size}"}</Code> y{" "}
        <Code>fill-primary</Code> fijo
      </>,
      <>
        <Code>src/components/icons/MenuIcon.tsx:13</Code> · <Code>size-7 stroke-accent</Code> fijo, sin <Code>className</Code>
      </>,
      <>
        <Code>src/components/icons/TiktokIcon.tsx:9</Code> · <Code>size-6 fill-accent</Code> fijo; Facebook e Instagram fijan{" "}
        <Code>size-6</Code>
      </>,
    ],
    fix: (
      <>
        Una sola firma para todos: <Code>{"({ className = 'size-6' })"}</Code> con <Code>currentColor</Code> y{" "}
        <Code>aria-hidden</Code>, como <Code>WhatsappIcon.tsx</Code> y <Code>PinIcon.tsx</Code>. Se migra cuando cada .astro
        que los usa pase al sistema nuevo.
      </>
    ),
    visual: null,
  },
  {
    title: "Íconos y componentes sin uso",
    body: <>Código que nadie importa: confunde a quien busca qué reutilizar.</>,
    bullets: [
      <>
        <Code>src/components/icons/CloseIcon.tsx</Code> · 0 imports
      </>,
      <>
        <Code>src/components/icons/RightArrowIcon.tsx</Code> · 0 imports
      </>,
      <>
        <Code>src/components/utils/BackButton.tsx</Code> · 0 imports; es el único que usa <Code>LeftArrowIcon</Code>
      </>,
    ],
    fix: <>Borrarlos en el PR que migre el catálogo. Si el Header nuevo necesita una X, crear una con la firma estándar.</>,
    visual: null,
  },
];

export function BoardDesignSystemDebt() {
  return (
    <div>
      <DebtBoard family="foundations" rows={ROWS} />
    </div>
  );
}
