import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Chip } from '../ui/Chip'
import { HojaEnvio, type TipoEnvio } from '../ui/HojaEnvio'
import { BarraEnvio, CampoDiseno, Colores, Grupo, Nota, Paso, Tecnicas } from '../ui/PersonalizaCampos'
import { VistaPrevia, type ModoVista } from '../ui/VistaPrevia'
import { detalleArchivo, leerDiseno, type DisenoLeido } from '../../lib/personaliza/archivo'
import { CANTIDADES, PRENDAS, TECNICAS, fotoDe, type Cantidad, type ColorPrenda, type Prenda, type Tecnica } from '../../lib/personaliza/datos'
import { LUGAR_GORRA, LUGAR_INICIAL, aspectoArea, limitar, tamanoCm, type Lugar } from '../../lib/personaliza/lugar'
import { mensaje, nombreMockup, seMuestra, type EstadoDiseno } from '../../lib/personaliza/mensaje'
import { cargarFoto, mockup, prepararDiseno, type FotoLista } from '../../lib/personaliza/motor'

/*
 * /personaliza (PRI-122): pantalla A (personalizador), hoja B (Revisa y envía) y pantalla C (al volver de WhatsApp).
 * Es la única isla de React del sitio. Nada sale del teléfono: el diseño vive en memoria y el pedido va por wa.me.
 * Las elecciones (no la imagen) se guardan en sessionStorage para sobrevivir una recarga.
 */

const CLAVE = 'serflow:personaliza'
const LENTO_MS = 5000
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
  ayuda: boolean
  chatAbierto: boolean
}

const lugarDe = (p: Prenda) => (p === 'gorra' ? LUGAR_GORRA : LUGAR_INICIAL)

function useEscritorio() {
  const [escritorio, setEscritorio] = useState(false)
  useEffect(() => {
    const mq = matchMedia('(min-width: 896px)')
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
  const [tecnica, setTecnica] = useState<Tecnica>(def.tecnicas[0])
  const [ubicacion, setUbicacion] = useState(def.ubicaciones[0].nombre)
  const [cantidad, setCantidad] = useState<Cantidad>('1')
  const [nota, setNota] = useState('')
  const [lugar, setLugar] = useState<Lugar>(LUGAR_INICIAL)
  const [ayuda, setAyuda] = useState(false)
  const [leido, setLeido] = useState<DisenoLeido | null>(null)
  const [procesando, setProcesando] = useState<File | null>(null)
  const [lento, setLento] = useState(false)
  const [sinVista, setSinVista] = useState(false)
  const [quitarFondo, setQuitarFondo] = useState(true)
  const [tocado, setTocado] = useState(false)
  const [hoja, setHoja] = useState<null | 'envio' | 'vuelta'>(null)
  const [mock, setMock] = useState<{ url: string; archivo: File } | null>(null)
  const [guardada, setGuardada] = useState(false)
  const [puedeCompartir, setPuedeCompartir] = useState(false)
  const [sinSenal, setSinSenal] = useState(false)
  // Cambia para remontar los radios sin controlar (al restaurar o al empezar otra prenda).
  const [version, setVersion] = useState(0)
  const [restaurado, setRestaurado] = useState(false)
  const chatAbierto = useRef(false)
  const subida = useRef(0)
  const escritorio = useEscritorio()

  const color = lista.find((c) => c.id === colorId) ?? lista[0]
  const fotoInfo = fotoDe(color, prenda, ubicacion) ?? fotoDe(lista[0], prenda, ubicacion)!
  const anchoCm = fotoInfo.print_width_cm

  // Foto del color y la vista elegidos: solo se baja esa. Mientras llega, se ve la anterior atenuada.
  const fotos = useRef(new Map<string, FotoLista>())
  const [foto, setFoto] = useState<FotoLista | null>(null)
  const [fotoEstado, setFotoEstado] = useState<'cargando' | 'lista' | 'error'>('cargando')
  const [intento, setIntento] = useState(0)
  useEffect(() => {
    const url = fotoInfo.image_url
    const guardada = fotos.current.get(url)
    if (guardada) {
      setFoto(guardada)
      setFotoEstado('lista')
      return
    }
    let vivo = true
    setFotoEstado('cargando')
    cargarFoto(url, fotoInfo.print_area, def.curva).then(
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

  const estado: EstadoDiseno = leido ? leido.estado : ayuda ? 'ayuda' : 'ninguno'
  const fuente = leido?.trabajo && seMuestra(leido.estado) ? (quitarFondo && leido.sinFondo ? leido.sinFondo : leido.trabajo) : null
  const tratado = useMemo(() => (fuente ? prepararDiseno(fuente, tecnica) : null), [fuente, tecnica])
  const ratio = tratado ? tratado.width / tratado.height : 1

  // Un diseño con otra proporción o un área nueva pueden dejar la caja afuera: se vuelve a limitar.
  useEffect(() => {
    if (tratado) setLugar((l) => limitar(l, ratio, aspectoArea(fotoInfo.print_area)))
  }, [ratio, fotoInfo.print_area, tratado])

  // Restaurar las elecciones de esta pestaña (y la pantalla C si volvió de WhatsApp tras una recarga).
  useEffect(() => {
    try {
      const g = JSON.parse(sessionStorage.getItem(CLAVE) ?? 'null') as Elecciones | null
      if (g && PRENDAS[g.prenda]) {
        const d = PRENDAS[g.prenda]
        setPrenda(g.prenda)
        if (colores[g.prenda].some((c) => c.id === g.colorId)) setColorId(g.colorId)
        else setColorId(colores[g.prenda][0].id)
        setTecnica(d.tecnicas.includes(g.tecnica) ? g.tecnica : d.tecnicas[0])
        setUbicacion(d.ubicaciones.some((u) => u.nombre === g.ubicacion) ? g.ubicacion : d.ubicaciones[0].nombre)
        if (CANTIDADES.includes(g.cantidad)) setCantidad(g.cantidad)
        setNota(String(g.nota ?? ''))
        if (g.lugar) setLugar(limitar(g.lugar, 1, 1))
        setAyuda(!!g.ayuda)
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
      const e: Elecciones = { prenda, colorId, tecnica, ubicacion, cantidad, nota, lugar, ayuda, chatAbierto: chatAbierto.current, ...extra }
      sessionStorage.setItem(CLAVE, JSON.stringify(e))
    } catch {
      // Igual que arriba: sin almacenamiento no se recuerda nada.
    }
  }
  useEffect(() => {
    if (restaurado) guardar()
  }, [restaurado, prenda, colorId, tecnica, ubicacion, cantidad, nota, lugar, ayuda])

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
    if (leido?.url) URL.revokeObjectURL(leido.url)
    setLeido(null)
  }

  async function subir(f: File) {
    const id = ++subida.current
    soltarDiseno()
    setAyuda(false)
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
    if (t.name === 'tecnica') setTecnica(t.value as Tecnica)
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
  const tipo: TipoEnvio = seMuestra(estado) ? 'imagen' : estado === 'archivo' || estado === 'pesada' ? 'archivo' : 'sin-imagen'
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
    setGuardada(false)
    setSinSenal(!navigator.onLine)
    setHoja('envio')
    if (mock) URL.revokeObjectURL(mock.url)
    setMock(null)
    let m: File | null = null
    if (vio && foto && tratado) {
      const blob = await mockup(foto, tratado, lugar, tecnica)
      m = new File([blob], nombreMockup(prenda, color.name, ubicacion), { type: 'image/jpeg' })
      setMock({ url: URL.createObjectURL(blob), archivo: m })
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
    setAyuda(false)
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
    <div className="@container bg-primary font-body text-ink" onPointerDownCapture={() => tratado && setTocado(true)}>
      <form key={version} onChange={cambiar} onSubmit={(e) => e.preventDefault()} aria-label="Arma tu pedido">
        <main className="grid grid-cols-[minmax(0,1fr)] @4xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @4xl:grid-rows-[auto_auto_1fr] @4xl:gap-x-12 @4xl:px-12">
          <div className="px-4 pb-4 pt-6 @4xl:col-span-2 @4xl:px-0 @4xl:pb-5 @4xl:pt-8">
            <h1 className="font-display text-[32px] font-medium leading-[1.05] tracking-[-0.01em] @4xl:text-[48px]">Diseña tu prenda</h1>
            <p className="mt-2 text-[16px] leading-relaxed text-muted @4xl:text-[18px]">Arma tu pedido y nos llega por WhatsApp.</p>
          </div>

          <fieldset className="px-4 pb-3 @4xl:col-start-1 @4xl:row-start-2 @4xl:px-0">
            <legend className="sr-only">Prenda</legend>
            <div className="flex gap-2">
              <Chip label="Camiseta" name="prenda" value="camiseta" selected={prenda === 'camiseta'} />
              <Chip label="Gorra" name="prenda" value="gorra" selected={prenda === 'gorra'} />
            </div>
          </fieldset>

          <div className="sticky top-0 z-20 bg-primary px-4 pb-3 pt-2 @4xl:top-6 @4xl:col-start-1 @4xl:row-start-3 @4xl:self-start @4xl:px-0 @4xl:pb-0 @4xl:pt-0">
            <VistaPrevia
              foto={foto}
              etiqueta={`${nombreColor}${ubicacion === 'Espalda' ? ', espalda' : ''}`}
              modo={modo}
              tecnica={tecnica}
              diseno={tratado}
              lugar={lugar}
              onLugar={setLugar}
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

          <div className="flex flex-col gap-10 px-4 pb-8 pt-6 @4xl:col-start-2 @4xl:row-span-2 @4xl:row-start-2 @4xl:px-0 @4xl:pt-0">
            <Paso n={1} titulo="Sube tu diseño o una foto">
              <CampoDiseno
                estado={procesando ? 'procesando' : estado}
                nombre={procesando?.name ?? leido?.archivo.name}
                detalle={leido?.detalle}
                miniatura={leido?.url}
                quitarFondo={leido?.sinFondo && !procesando ? quitarFondo : undefined}
                escritorio={escritorio}
                onArchivo={subir}
                onQuitar={() => {
                  subida.current++
                  setProcesando(null)
                  setSinVista(false)
                  soltarDiseno()
                }}
                onAyuda={setAyuda}
                onQuitarFondo={setQuitarFondo}
              />
            </Paso>

            <Paso n={2} titulo="Elige color y técnica">
              <Grupo legend="Color" valor={color.name} key={`c-${prenda}`}>
                <Colores colores={lista} elegido={color.id} cargando={fotoEstado === 'cargando' ? color.id : undefined} />
              </Grupo>
              <Grupo legend="Técnica" valor={def.tecnicas.length > 1 ? TECNICAS[tecnica].nombre : undefined} key={`t-${prenda}`}>
                <Tecnicas opciones={def.tecnicas} elegida={tecnica} />
              </Grupo>
              <Grupo legend="Ubicación" key={`u-${prenda}`}>
                {def.ubicaciones.length > 1 ? (
                  <div className="flex flex-wrap gap-2">
                    {def.ubicaciones.map((u) => (
                      <Chip key={u.nombre} label={u.nombre} name="ubicacion" selected={u.nombre === ubicacion} />
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
              <p className="text-[15px] leading-relaxed text-muted">
                Antes de abrir WhatsApp te mostramos el mensaje armado{tratado ? ' y la vista previa para guardarla' : ''}. El taller te responde por el chat con el precio.
              </p>
            </Paso>
            <div className="sticky bottom-0 -mt-4 hidden bg-primary pb-6 pt-2 shadow-[0_-24px_24px_var(--color-primary)] @4xl:block">
              <BarraEnvio resumen={resumen} fija={false} esperando={!!procesando} conVista={conVista} onEnviar={enviar} />
            </div>
          </div>
        </main>
        <div className="contents @4xl:hidden">
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
