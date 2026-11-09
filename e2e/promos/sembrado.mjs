// PRI-413: las filas que la migración de siembra escribe en prod, leídas del SQL: así el E2E prueba la migración real y
// no una copia que se pueda desfasar. Solo entiende lo que usan esos archivos: textos, enteros, null y ::jsonb.
import { readFileSync } from 'node:fs'

const leer = (archivo) => readFileSync(new URL(`../../supabase/migrations/${archivo}`, import.meta.url), 'utf8')
const SQL = leer('20261107120000_sembrar_contenido.sql')
// PRI-427: los colores del personalizador.
const COLORES_SQL = leer('20261108154523_sembrar_colores.sql')

const VALOR = /\s*(?:'((?:[^']|'')*)'(::jsonb)?|(\d+)|(null))\s*/y

/** Lee una tupla "(a, b, c)" de sql desde i; devuelve sus valores y dónde terminó. */
function tupla(sql, i) {
  const valores = []
  i = sql.indexOf('(', i) + 1
  for (;;) {
    VALOR.lastIndex = i
    const m = VALOR.exec(sql)
    if (!m) throw new Error(`Valor que sembrado.mjs no entiende: ${sql.slice(i, i + 40)}`)
    const texto = m[1]?.replaceAll("''", "'")
    valores.push(m[4] ? null : m[3] ? Number(m[3]) : m[2] ? JSON.parse(texto) : texto)
    i = VALOR.lastIndex
    if (sql[i] === ')') return { valores, fin: i + 1 }
    i += 1 // la coma
  }
}

/** Las filas de la lista de values que empieza en i, con estas columnas. */
function filas(sql, i, columnas) {
  const lista = []
  for (;;) {
    const { valores, fin } = tupla(sql, i)
    lista.push(Object.fromEntries(columnas.map((c, n) => [c, valores[n]])))
    i = fin
    if (!/^\s*,/.test(sql.slice(i, i + 10))) return lista
  }
}

export function filasDeLaSiembra() {
  const tablas = {}
  for (const insert of SQL.matchAll(/insert into public\.(\w+) \(([^)]+)\)/g)) {
    tablas[insert[1]] = filas(SQL, SQL.indexOf('values', insert.index) + 'values'.length, insert[2].split(', '))
  }
  return { ...tablas, garment_colors: coloresDeLaSiembra() }
}

/** Lo que el sitio lee de garment_colors después de la migración de colores: cada color con sus fotos, en orden. */
export function coloresDeLaSiembra() {
  const lista = (nombre) => {
    const m = COLORES_SQL.match(new RegExp(`${nombre} \\(([^)]+)\\) as \\(values`))
    return filas(COLORES_SQL, m.index + m[0].length - 1, m[1].split(', '))
  }
  const colores = lista('colores')
  const vistas = lista('vistas')
  return ['camiseta', 'gorra'].flatMap((garment) =>
    colores.map((c) => ({
      // El nombre del archivo como id, igual en las dos prendas (en la base es un uuid): el E2E elige colores por value.
      id: c.archivo,
      garment,
      name: c.name,
      hex: c.hex,
      sort_order: c.sort_order,
      garment_photos: vistas
        .filter((v) => v.garment === garment)
        .map((v) => ({ view: v.view, image_url: `repo:personalizador/${garment}-${c.archivo}${v.sufijo}.jpg`, print_area: v.print_area, print_width_cm: v.print_width_cm })),
    })),
  ).sort((a, b) => a.sort_order - b.sort_order)
}
