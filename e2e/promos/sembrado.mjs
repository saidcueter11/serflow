// PRI-413: las filas que la migración de siembra escribe en prod, leídas del SQL: así el E2E prueba la migración real y
// no una copia que se pueda desfasar. Solo entiende lo que usa ese archivo: textos, enteros, null y ::jsonb.
import { readFileSync } from 'node:fs'

const SQL = readFileSync(new URL('../../supabase/migrations/20261107120000_sembrar_contenido.sql', import.meta.url), 'utf8')

const VALOR = /\s*(?:'((?:[^']|'')*)'(::jsonb)?|(\d+)|(null))\s*/y

/** Lee una tupla "(a, b, c)" desde i; devuelve sus valores y dónde terminó. */
function tupla(i) {
  const valores = []
  i = SQL.indexOf('(', i) + 1
  for (;;) {
    VALOR.lastIndex = i
    const m = VALOR.exec(SQL)
    if (!m) throw new Error(`Valor que sembrado.mjs no entiende: ${SQL.slice(i, i + 40)}`)
    const texto = m[1]?.replaceAll("''", "'")
    valores.push(m[4] ? null : m[3] ? Number(m[3]) : m[2] ? JSON.parse(texto) : texto)
    i = VALOR.lastIndex
    if (SQL[i] === ')') return { valores, fin: i + 1 }
    i += 1 // la coma
  }
}

export function filasDeLaSiembra() {
  const tablas = {}
  for (const insert of SQL.matchAll(/insert into public\.(\w+) \(([^)]+)\)/g)) {
    const columnas = insert[2].split(', ')
    const filas = []
    let i = SQL.indexOf('values', insert.index) + 'values'.length
    for (;;) {
      const { valores, fin } = tupla(i)
      filas.push(Object.fromEntries(columnas.map((c, n) => [c, valores[n]])))
      i = fin
      if (!/^\s*,/.test(SQL.slice(i, i + 10))) break
    }
    tablas[insert[1]] = filas
  }
  return tablas
}
