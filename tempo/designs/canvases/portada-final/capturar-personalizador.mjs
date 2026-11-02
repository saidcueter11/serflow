/*
 * PRI-286 · captura del personalizador (/personaliza, PR #36, sin mergear) con el sistema de la portada encima.
 * El PR #36 no está en esta rama, así que el frame es una foto: el deploy preview + refresh*.css + portada.css + pantallas.css,
 * y las clases pf-* que en el PR van en el JSX de PersonalizaPage (PUENTE, ver pantallas.css sección 4).
 * Uso (desde la raíz, con node_modules): node tempo/designs/canvases/portada-final/capturar-personalizador.mjs 1280|390
 * CHROMIUM=<ruta> si el navegador de Playwright instalado no es el de la versión del paquete.
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const aqui = new URL('.', import.meta.url).pathname;
const hojas = ['../refresh-oro-viejo/refresh.css', '../refresh-oro-viejo/refresh-r2.css', '../refresh-oro-viejo/refresh-r3.css', 'portada.css', 'pantallas.css'];
const css = hojas.map((f) => readFileSync(aqui + f, 'utf8')).join('\n');
const width = Number(process.argv[2]);

const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
try {
  const p = await b.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await p.goto('https://deploy-preview-36--serflowctg.netlify.app/personaliza/', { waitUntil: 'load' });
  // La foto de la prenda llega aparte: se espera a que la vista previa deje de estar atenuada.
  await p.waitForFunction(() => document.querySelector('form > main canvas') && !document.querySelector('form > main .opacity-40'), null, { timeout: 60000 });
  await p.addStyleTag({ url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..700&display=swap' });
  await p.addStyleTag({ content: css });
  await p.evaluate(() => {
    // Fuera la barra de Netlify del deploy preview.
    [...document.body.children].forEach((e) => e.tagName === 'DIV' && !e.querySelector('main') && e.remove());
    document.body.classList.add('sf-refresh', 'sf-r2', 'sf-r3');
    const main = document.querySelector('form > main');
    main.closest('form').parentElement.classList.add('pf');
    main.classList.add('pf-v', 'pf-pz');
    const [titulo, prenda, vista, pasos] = main.children;
    titulo.classList.add('pf-pz-titulo');
    titulo.querySelector('h1').className = 'pf-display';
    titulo.querySelector('p').className = 'pf-lead';
    prenda.classList.add('pf-pz-prenda');
    vista.classList.add('pf-pz-vista');
    pasos.classList.add('pf-pz-pasos');
    pasos.querySelectorAll(':scope > section').forEach((s) => s.classList.add('pf-pz-paso'));
    pasos.querySelector(':scope > div').classList.add('pf-pz-envio');
  });
  await p.evaluate(() => document.fonts.ready);
  // Viewport del alto de la página: lo sticky (vista previa y barra de Enviar en el celular) queda en su lugar.
  await p.setViewportSize({ width, height: await p.evaluate(() => document.documentElement.scrollHeight) });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${aqui}capturas/personalizador-${width}.jpg`, fullPage: true, type: 'jpeg', quality: 85 });
} finally {
  await b.close();
}
