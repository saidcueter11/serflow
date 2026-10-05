import { threadSvg } from '../lib/thread'

// Dibuja el hilo (Thread) con el tamaño real de la página. Se vuelve a dibujar si cambia el alto o el ancho.
function draw() {
  const svg = document.querySelector<SVGSVGElement>('svg[data-thread]')
  const host = svg?.parentElement
  if (!svg || !host) return
  const width = host.clientWidth
  const height = host.scrollHeight
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.innerHTML = threadSvg(width, height, window.innerHeight)
}

let observer: ResizeObserver | undefined
document.addEventListener('astro:page-load', () => {
  observer?.disconnect()
  const host = document.querySelector('svg[data-thread]')?.parentElement
  if (!host) return
  observer = new ResizeObserver(() => requestAnimationFrame(draw))
  observer.observe(host)
})
