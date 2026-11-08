import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Chip } from '../ui/Chip'
import { Palabras } from '../ui/Palabras'
import { HojaEnvio, type TipoEnvio } from '../ui/HojaEnvio'
import { BarraEnvio, CampoDiseno, Colores, Grupo, Nota, Paso, Tecnicas } from '../ui/PersonalizaCampos'
import { VistaPrevia, type ModoVista } from '../ui/VistaPrevia'
import { detalleArchivo, leerDiseno, type DisenoLeido } from '../../lib/personaliza/archivo'
import { quitarFondoIa, soporteIa, type FondoIa } from '../../lib/personaliza/fondo-ia'
import { CANTIDADES, PRENDAS, TECNICAS, fotoDe, tecnicasDe, ubicacionesDe, type Cantidad, type ColorPrenda, type Prenda, type Tecnica } from '../../lib/personaliza/datos'
import { LUGAR_GORRA, LUGAR_INICIAL, escalaMax, tamanoCm, type Lugar } from '../../lib/personaliza/lugar'
import { mensaje, nombreMockup, seMuestra, type EstadoDiseno } from '../../lib/personaliza/mensaje'
import { cargarFoto, mockup, prepararDiseno, type FotoLista } from '../../lib/personaliza/motor'
import { quieto } from '../../scripts/quieto'

/*
 * /personaliza (PRI-122): pantalla A (personalizador), hoja B (Revisa y envía) y pantalla C (al volver de WhatsApp).
 * Es la única isla de React del sitio. Nada sale del teléfono: el diseño vive en memoria y el pedido va por wa.me.
 * Las elecciones (no la imagen) se guardan en sessionStorage para sobrevivir una recarga.
 */

const CLAVE = 'serflow:personaliza'
const LENTO_MS = 5000
/** En celular se baja la foto liviana; solo el ancho de escritorio (el mismo del layout) pide la grande. */
const ESCRITORIO = '(min-width: 896px)'
// ponytail: guarda las 3 últimas fotos preparadas (cada una ~10 MB de canvas); subir si cambiar de color se siente lento.
const FOTOS_EN_MEMORIA = 3

interface Elecciones {
  prenda: Prenda
  colorId: string
  tecnica: Tecnica
  ubicacion: string
  cantidad: Cantidad
  nota: string
  lugar: Lugar
  chatAbierto: boolean
}

/** Lo máximo que el mockup espera la foto grande (unos 32 KB: en Slow 4G, 1 a 2 s calculados, sin medir). */
const ESPERA_FOTO = 6000
const lugarDe = (p: Prenda) => (p === 'camiseta' ? LUGAR_INICIAL : LUGAR_GORRA)

function useEscritorio() {
  const [escritorio, setEscritorio] = useState(false)
  useEffect(() => {
    const mq = matchMedia(ESCRITORIO)
    const cambiar = () => setEscritorio(mq.matches)
    cambiar()
    mq.addEventListener('change', cambiar)
    return () => mq.removeEventListener('change', cambiar)
  }, [])
  return escritorio
}

function descargar(f: File) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(f)
  a.download = f.name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000)
}

export function PersonalizaPage({ colores }: { colores: Record<Prenda, ColorPrenda[]> }) {
  const [prenda, setPrenda] = useState<Prenda>('camiseta')
  const def = PRENDAS[prenda]
  const lista = colores[prenda]
  const [colorId, setColorId] = useState(lista[0].id)
  const [tecnicaElegida, setTecnica] = useState<Tecnica>(def.tecnicas[0])
  const [elegida, setUbicacion] = useState(def.ubicaciones[0].nombre)
  const [cantidad, setCantidad] = useState<Cantidad>('1')
  const [nota, setNota] = useState('')
  const [lugar, setLugar] = useState<Lugar>(LUGAR_INICIAL)
  const [leido, setLeido] = useState<DisenoLeido | null>(null)
  const [rechazado, setRechazado] = useState(false)
  const [procesando, setProcesando] = useState<File | null>(null)
  const [lento, setLento] = useState(false)
  const [sinVista, setSinVista] = useState(false)
  const [quitarFondo, setQuitarFondo] = useState(true)
  const [fondoIa, setFondoIa] = useState<FondoIa>({ fase: 'listo' })
  const ia = useRef<AbortController | null>(null)
  const [tocado, setTocado] = useState(false)
  const [hoja, setHoja] = useState<null | 'envio' | 'vuelta'>(null)
  const [mock, setMock] = useState<{ url: string; archivo: File } | null>(null)
  const [guardada, setGuardada] = useState(false)
  // Mientras se arma el mockup (en celular baja la foto grande) no se puede guardar: se guardaría solo el diseño.
  const [preparando, setPreparando] = useState(false)
  const [puedeCompartir, setPuedeCompartir] = useState(false)
  const [sinSenal, setSinSenal] = useState(false)
  // Cambia para remontar los radios sin controlar (al restaurar o al empezar otra prenda).
  const [version, setVersion] = useState(0)
  const [restaurado, setRestaurado] = useState(false)
  const chatAbierto = useRef(false)
  const subida = useRef(0)
  const envio = useRef(0)
  const escritorio = useEscritorio()

  const color = lista.find((c) => c.id === colorId) ?? lista[0]
  // Una técnica sin dónde ir en este color no se ofrece; una ubicación sin foto, o que no es para la técnica elegida (la
  // gorra acrílica), queda deshabilitada y se muestra la que sí sirve.
  const ofrecidas = tecnicasDe(color, prenda)
  const tecnica = ofrecidas.includes(tecnicaElegida) ? tecnicaElegida : ofrecidas[0]
  const conFoto = ubicacionesDe(color, prenda, tecnica)
  const sinFoto = def.ubicaciones.filter((u) => !color.photos.some((f) => f.view === u.vista))
  const sinColores = (Object.keys(PRENDAS) as Prenda[]).filter((p) => !colores[p].length)
  const ubicacion = conFoto.some((u) => u.nombre === elegida) ? elegida : conFoto[0].nombre
  const fotoInfo = fotoDe(color, prenda, ubicacion) ?? fotoDe(lista[0], prenda, ubicacion)!
  const anchoCm = fotoInfo.print_width_cm
  const maxS = escalaMax(prenda, tecnica, anchoCm)

  // Foto del color y la vista elegidos: solo se baja esa. Mientras llega, se ve la anterior atenuada.
  const fotos = useRef(new Map<string, FotoLista>())
  const [foto, setFoto] = useState<FotoLista | null>(null)
  const [fotoEstado, setFotoEstado] = useState<'cargando' | 'lista' | 'error'>('cargando')
  const [intento, setIntento] = useState(0)
  useEffect(() => {
    const url = matchMedia(ESCRITORIO).matches ? fotoInfo.image_url : fotoInfo.image_url_movil
    const guardada = fotos.current.get(url)
    if (guardada) {
      setFoto(guardada)
      setFotoEstado('lista')
      return
    }
    let vivo = true
    setFotoEstado('cargando')
    cargarFoto(url, fotoInfo.print_area, def.curva, fotoInfo.sombra_url).then(
      (f) => {
        if (!vivo) return
        fotos.current.set(url, f)
        if (fotos.current.size > FOTOS_EN_MEMORIA) fotos.current.delete(fotos.current.keys().next().value!)
        setFoto(f)
        setFotoEstado('lista')
      },
      () => vivo && setFotoEstado('error'),
    )
    return () => {
      vivo = false
    }
  }, [fotoInfo.image_url, intento])

  const estado: EstadoDiseno = leido ? leido.estado : 'ninguno'
  const fuente = leido?.trabajo && seMuestra(leido.estado) ? (quitarFondo && leido.sinFondo ? leido.sinFondo : leido.trabajo) : null
  const tratado = useMemo(() => (fuente ? prepararDiseno(fuente, tecnica) : null), [fuente, tecnica])

  // PRI-435: en el celular la vista previa baja con la página. Cuando se va casi entera por arriba, "Ver cómo queda" la
  // trae. El form se vuelve a montar con otra prenda (version): ahí se observa la vista nueva.
  const vista = useRef<HTMLDivElement>(null)
  const [lejos, setLejos] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setLejos(e.intersectionRatio < 0.25 && e.boundingClientRect.top < 0), { threshold: 0.25 })
    io.observe(vista.current!)
    return () => io.disconnect()
  }, [version])

  // Restaurar las elecciones de esta pestaña (y la pantalla C si volvió de WhatsApp tras una recarga).
  useEffect(() => {
    try {
      const g = JSON.parse(sessionStorage.getItem(CLAVE) ?? 'null') as Elecciones | null
      if (g && PRENDAS[g.prenda] && colores[g.prenda].length) {
        const d = PRENDAS[g.prenda]
        setPrenda(g.prenda)
        if (colores[g.prenda].some((c) => c.id === g.colorId)) setColorId(g.colorId)
        else setColorId(colores[g.prenda][0].id)
        setTecnica(d.tecnicas.includes(g.tecnica) ? g.tecnica : d.tecnicas[0])
        setUbicacion(d.ubicaciones.some((u) => u.nombre === g.ubicacion) ? g.ubicacion : d.ubicaciones[0].nombre)
        if (CANTIDADES.includes(g.cantidad)) setCantidad(g.cantidad)
        setNota(String(g.nota ?? ''))
        if (g.lugar) setLugar(g.lugar)
        chatAbierto.current = !!g.chatAbierto
        if (g.chatAbierto) setHoja('vuelta')
        setVersion((v) => v + 1)
      }
    } catch {
      // Sin sessionStorage (modo privado, bloqueado): la página funciona igual, sin recordar.
    }
    setRestaurado(true)
  }, [])

  const guardar = (extra?: Partial<Elecciones>) => {
    try {
      const e: Elecciones = { prenda, colorId, tecnica, ubicacion, cantidad, nota, lugar, chatAbierto: chatAbierto.current, ...extra }
      sessionStorage.setItem(CLAVE, JSON.stringify(e))
    } catch {
      // Igual que arriba: sin almacenamiento no se recuerda nada.
    }
  }
  useEffect(() => {
    if (restaurado) guardar()
  }, [restaurado, prenda, colorId, tecnica, ubicacion, cantidad, nota, lugar])

  // Pantalla C: al volver a la página después de abrir el chat.
  useEffect(() => {
    const volver = () => document.visibilityState === 'visible' && chatAbierto.current && setHoja('vuelta')
    const mostrar = (e: PageTransitionEvent) => e.persisted && chatAbierto.current && setHoja('vuelta')
    document.addEventListener('visibilitychange', volver)
    window.addEventListener('pageshow', mostrar)
    return () => {
      document.removeEventListener('visibilitychange', volver)
      window.removeEventListener('pageshow', mostrar)
    }
  }, [])

  const soltarDiseno = () => {
    ia.current?.abort()
    setFondoIa({ fase: 'listo' })
    if (leido?.url) URL.revokeObjectURL(leido.url)
    setLeido(null)
  }

  // PRI-436: el automático no pudo; el modelo corre en el navegador y su resultado es el sinFondo de siempre (el interruptor lo deshace).
  async function quitarConIa() {
    const d = leido
    if (!d?.trabajo) return
    const puede = soporteIa()
    if (puede !== 'ok') return setFondoIa({ fase: 'error', motivo: puede })
    const control = new AbortController()
    ia.current = control
    setFondoIa({ fase: 'bajando', pct: 0 })
    try {
      const sinFondo = await quitarFondoIa(d.trabajo, (pct) => setFondoIa(pct === null ? { fase: 'quitando' } : { fase: 'bajando', pct }), control.signal)
      setLeido({ ...d, sinFondo, fondoFijo: false })
      setQuitarFondo(true)
      setFondoIa({ fase: 'listo' })
    } catch (e) {
      // Cancelado (por el botón o porque cambió el diseño): quien canceló ya dejó el estado como va.
      if (control.signal.aborted) return
      const m = (e as Error).message
      setFondoIa({ fase: 'error', motivo: m === 'red' || m === 'memoria' ? m : 'fallo' })
    }
  }

  async function subir(f: File) {
    const id = ++subida.current
    soltarDiseno()
    setRechazado(false)
    setSinVista(false)
    setLento(false)
    setTocado(false)
    setProcesando(f)
    const t = setTimeout(() => subida.current === id && setLento(true), LENTO_MS)
    const r = await leerDiseno(f)
    clearTimeout(t)
    if (subida.current !== id) return
    setProcesando(null)
    setLento(false)
    setQuitarFondo(true)
    setLeido(r)
    setRechazado(!r)
  }

  const cambiarPrenda = (n: Prenda) => {
    setPrenda(n)
    setColorId(colores[n][0].id)
    setTecnica(PRENDAS[n].tecnicas[0])
    setUbicacion(PRENDAS[n].ubicaciones[0].nombre)
    setLugar(lugarDe(n))
  }

  const cambiar = (e: FormEvent<HTMLFormElement>) => {
    const t = e.target as HTMLInputElement
    if (t.name === 'prenda') cambiarPrenda(t.value as Prenda)
    if (t.name === 'color') setColorId(t.value)
    if (t.name === 'tecnica') {
      setTecnica(t.value as Tecnica)
      // En la gorra acrílica la técnica cambia de foto (frente o lado): el diseño vuelve a su lugar inicial, como al cambiar de ubicación.
      if (!ubicacionesDe(color, prenda, t.value as Tecnica).some((u) => u.nombre === ubicacion)) setLugar(lugarDe(prenda))
    }
    if (t.name === 'ubicacion') {
      setUbicacion(t.value)
      setLugar(lugarDe(prenda))
    }
    if (t.name === 'cantidad') setCantidad(t.value as Cantidad)
  }

  const modo: ModoVista =
    fotoEstado === 'error'
      ? 'sin-senal'
      : procesando
        ? lento
          ? 'lento'
          : 'procesando'
        : sinVista && leido
          ? 'archivo'
          : fotoEstado === 'cargando'
            ? 'cargando'
            : tratado
              ? 'listo'
              : leido
                ? 'archivo'
                : 'vacio'
  // El cliente vio su diseño sobre la prenda: solo entonces el mensaje dice el tamaño (decisión del canvas).
  const vio = !!tratado && !sinVista && fotoEstado === 'lista'
  const tipo: TipoEnvio = seMuestra(estado) ? 'imagen' : estado === 'pesada' ? 'archivo' : 'sin-imagen'
  const texto = mensaje({
    prenda,
    color: color.name,
    tecnica,
    ubicacion,
    cantidad,
    diseno: estado,
    vistaPrevia: vio,
    sinFondo: !!leido?.sinFondo && quitarFondo && seMuestra(estado),
    tamanoCm: tamanoCm(anchoCm, lugar.s),
    nota,
  })
  const nombreColor = `${def.nombre} ${color.name.toLowerCase()}`
  const resumen = [nombreColor, TECNICAS[tecnica].nombre, ubicacion, cantidad === '1' ? '1 unidad' : `${cantidad} unidades`].join(' · ')

  const archivos = () => [...(leido ? [leido.archivo] : []), ...(tipo === 'imagen' && mock ? [mock.archivo] : [])]

  async function enviar() {
    const id = ++envio.current
    setGuardada(false)
    setPuedeCompartir(false)
    setPreparando(false)
    setSinSenal(!navigator.onLine)
    setHoja('envio')
    if (mock) URL.revokeObjectURL(mock.url)
    setMock(null)
    let m: File | null = null
    if (vio && foto && tratado) {
      setPreparando(true)
      // En celular la vista usa la foto de 720 px; el mockup (1080 × 1350) sale de la grande. Sin señal, de la que ya está.
      // Con señal mala tampoco se espera para siempre: a los ESPERA_FOTO ms sale de la que ya está y Guardar se habilita.
      const grande =
        fotos.current.get(fotoInfo.image_url) ??
        (await Promise.race([cargarFoto(fotoInfo.image_url, fotoInfo.print_area, def.curva, fotoInfo.sombra_url).catch(() => foto), new Promise<FotoLista>((ok) => setTimeout(() => ok(foto), ESPERA_FOTO))]))
      const blob = await mockup(grande, tratado, lugar, tecnica).catch(() => null)
      if (envio.current !== id) return
      setPreparando(false)
      if (blob) {
        m = new File([blob], nombreMockup(prenda, color.name, ubicacion), { type: 'image/jpeg' })
        setMock({ url: URL.createObjectURL(blob), archivo: m })
      }
    }
    const files = [...(leido ? [leido.archivo] : []), ...(m ? [m] : [])]
    setPuedeCompartir(files.length > 0 && !!navigator.canShare?.({ files }))
  }

  async function guardarImagenes() {
    const files = archivos()
    if (!escritorio && navigator.canShare?.({ files })) {
      try {
        await navigator.share({ files })
        setGuardada(true)
      } catch {
        // Canceló el menú: sigue en el paso 1.
      }
      return
    }
    files.forEach(descargar)
    setGuardada(true)
  }

  async function compartir() {
    try {
      await navigator.share({ files: archivos(), text: texto })
    } catch {
      // Canceló el menú de compartir.
    }
  }

  const abrirChat = () => {
    chatAbierto.current = true
    guardar({ chatAbierto: true })
  }

  const cerrarHoja = () => {
    if (hoja === 'vuelta') {
      chatAbierto.current = false
      guardar({ chatAbierto: false })
    }
    setHoja(null)
  }

  const otraPrenda = () => {
    chatAbierto.current = false
    soltarDiseno()
    setSinVista(false)
    setRechazado(false)
    setNota('')
    setCantidad('1')
    cambiarPrenda('camiseta')
    setHoja(null)
    setVersion((v) => v + 1)
    try {
      sessionStorage.removeItem(CLAVE)
    } catch {
      // Sin almacenamiento.
    }
    window.scrollTo({ top: 0 })
  }

  const conVista = (!!tratado && !sinVista) || !!procesando
  const archivoVista = leido && (sinVista ? { nombre: leido.archivo.name, nota: 'Sin vista previa: va en el chat' } : { nombre: leido.archivo.name })

  return (
    <div className="pf bg-primary font-body text-ink" onPointerDownCapture={() => tratado && setTocado(true)}>
      <form key={version} onChange={cambiar} onSubmit={(e) => e.preventDefault()} aria-label="Arma tu pedido">
        <main className="pf-v pf-pz">
          <div className="pf-pz-titulo">
            <h1 className="pf-display">
              <Palabras text="Diseña tu prenda" />
            </h1>
            <p className="pf-lead sf-bajada">
              <Palabras text="Arma tu pedido y nos llega por WhatsApp." />
            </p>
          </div>

          <div className="pf-pz-izq">
            <fieldset className="pf-pz-prenda">
              <legend className="sr-only">Prenda</legend>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PRENDAS) as Prenda[]).map((p) => (
                  <Chip key={p} label={PRENDAS[p].nombre} name="prenda" value={p} selected={prenda === p} disabled={!colores[p].length} />
                ))}
              </div>
              {sinColores.length > 0 && (
                <p className="mt-2 text-[13px] leading-snug text-muted">
                  La {sinColores.map((p) => PRENDAS[p].nombre.toLowerCase()).join(' y la ')} todavía no tiene foto. Si la quieres, cuéntanos en la nota.
                </p>
              )}
            </fieldset>

            <div className="pf-pz-vista" ref={vista}>
              <VistaPrevia
                foto={foto}
                fotoInicial={fotoInfo}
                etiqueta={`${nombreColor}${{ frente: '', espalda: ', espalda', lado: ', de lado' }[fotoInfo.view]}`}
                modo={modo}
                tecnica={tecnica}
                diseno={tratado}
                lugar={lugar}
                onLugar={setLugar}
                maxS={maxS}
                anchoCm={anchoCm}
                archivo={archivoVista ?? undefined}
                cargando={`Cargando la ${nombreColor.toLowerCase()}…`}
                alto={escritorio ? 500 : 320}
                pista={!tocado}
                escritorio={escritorio}
                onArchivo={subir}
                onReintentar={() => setIntento((i) => i + 1)}
                onSeguirSinVista={() => {
                  // El archivo queda como tarjeta y va al chat; si termina de abrirse después, igual sigue sin vista previa.
                  if (procesando) setLeido({ estado: 'imagen', archivo: procesando, detalle: detalleArchivo(procesando) })
                  setSinVista(true)
                  setProcesando(null)
                  setLento(false)
                }}
              />
            </div>
          </div>

          <div className="pf-pz-pasos">
            <Paso n={1} titulo="Sube tu diseño o una foto">
              <CampoDiseno
                estado={procesando ? 'procesando' : estado}
                nombre={procesando?.name ?? leido?.archivo.name}
                detalle={leido?.detalle}
                miniatura={leido?.url}
                quitarFondo={leido?.sinFondo && !procesando ? quitarFondo : undefined}
                fondoFijo={leido?.fondoFijo}
                fondoIa={fondoIa}
                onFondoIa={quitarConIa}
                onCancelarFondoIa={() => {
                  ia.current?.abort()
                  setFondoIa({ fase: 'listo' })
                }}
                rechazado={rechazado}
                escritorio={escritorio}
                onArchivo={subir}
                onQuitar={() => {
                  subida.current++
                  setProcesando(null)
                  setSinVista(false)
                  soltarDiseno()
                }}
                onQuitarFondo={setQuitarFondo}
              />
            </Paso>

            <Paso n={2} titulo="Elige color y técnica">
              <Grupo legend="Color" valor={color.name} key={`c-${prenda}`}>
                <Colores colores={lista} elegido={color.id} cargando={fotoEstado === 'cargando' ? color.id : undefined} />
              </Grupo>
              <Grupo
                legend="Técnica"
                valor={TECNICAS[tecnica].nombre}
                nota={tecnica === 'bordado' && def.bordadoMaxCm ? `El bordado es para piezas pequeñas, como un logo o un nombre: hasta unos ${def.bordadoMaxCm} cm de ancho.` : undefined}
                key={`t-${prenda}-${ofrecidas.join()}`}
              >
                <Tecnicas opciones={ofrecidas} elegida={tecnica} />
              </Grupo>
              <Grupo
                legend="Ubicación"
                nota={[
                  def.nota,
                  sinFoto.length && `La ${nombreColor.toLowerCase()} todavía no tiene foto de ${sinFoto.map((u) => u.nombre.toLowerCase()).join(' ni ')}. Si la quieres ahí, cuéntanos en la nota.`,
                ]
                  .filter(Boolean)
                  .join(' ') || undefined}
                key={`u-${prenda}-${conFoto.map((u) => u.nombre).join()}`}
              >
                {def.ubicaciones.length > 1 ? (
                  <div className="flex flex-wrap gap-2">
                    {def.ubicaciones.map((u) => (
                      <Chip key={u.nombre} label={u.nombre} name="ubicacion" selected={u.nombre === ubicacion} disabled={!conFoto.includes(u)} />
                    ))}
                  </div>
                ) : (
                  <p className="text-[15px]">{def.ubicaciones[0].nombre}. Si la quieres en otro lado, cuéntanos en la nota.</p>
                )}
              </Grupo>
              <Grupo legend="Cantidad" nota="Las tallas van en la nota o en el chat.">
                <div className="flex flex-wrap gap-2">
                  {CANTIDADES.map((c) => (
                    <Chip key={c} label={c} name="cantidad" selected={c === cantidad} />
                  ))}
                </div>
              </Grupo>
              <Nota valor={nota} onCambio={setNota} />
            </Paso>

            <Paso n={3} titulo="Mándanoslo por WhatsApp">
              <p className="text-[16px] leading-normal text-muted">
                Antes de abrir WhatsApp te mostramos el mensaje armado{tratado ? ' y la vista previa para guardarla' : ''}. El taller te responde por el chat con el precio.
              </p>
            </Paso>
            <div className="pf-pz-envio">
              <BarraEnvio resumen={resumen} fija={false} esperando={!!procesando} conVista={conVista} onEnviar={enviar} />
            </div>
          </div>
        </main>
        <div className="sticky bottom-0 z-30 @4xl:hidden">
          {lejos && (
            <button
              type="button"
              className="pz-sheet absolute bottom-full right-4 mb-3 flex h-11 items-center gap-2 rounded-full border border-line bg-surface pl-3 pr-4 text-[14px] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={() => vista.current!.scrollIntoView({ behavior: quieto() ? 'auto' : 'smooth', block: 'start' })}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              Ver cómo queda
            </button>
          )}
          <BarraEnvio resumen={resumen} esperando={!!procesando} conVista={conVista} onEnviar={enviar} />
        </div>
      </form>

      {hoja && (
        <HojaEnvio
          tipo={tipo}
          mensaje={texto}
          vistaPrevia={tipo === 'imagen' ? mock?.url : undefined}
          diseno={tipo === 'imagen' ? leido?.url : undefined}
          archivo={tipo === 'archivo' && leido ? { nombre: leido.archivo.name, detalle: leido.detalle } : undefined}
          guardada={guardada}
          preparando={preparando}
          compartir={puedeCompartir}
          sinSenal={sinSenal}
          escritorio={escritorio}
          vuelta={hoja === 'vuelta'}
          onCerrar={cerrarHoja}
          onGuardar={guardarImagenes}
          onCompartir={compartir}
          onAbrirChat={abrirChat}
          onOtra={otraPrenda}
        />
      )}
    </div>
  )
}
