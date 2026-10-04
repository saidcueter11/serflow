import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { PhotoSlot } from './PhotoSlot'

describe('PhotoSlot', () => {
  it('no renderiza nada sin src (regla: sin foto, la sección desaparece)', () => {
    expect(renderToStaticMarkup(<PhotoSlot kind="local" />)).toBe('')
  })

  it('con src: lazy por defecto, eager + fetchpriority high con priority', () => {
    const lazy = renderToStaticMarkup(<PhotoSlot kind="trabajo" src="/t.webp" alt="Gorra bordada" />)
    expect(lazy).toContain('loading="lazy"')
    expect(lazy).toContain('alt="Gorra bordada"')
    const hero = renderToStaticMarkup(<PhotoSlot kind="local" src="/l.webp" alt="Fachada" priority />)
    expect(hero).toContain('loading="eager"')
    expect(hero.toLowerCase()).toContain('fetchpriority="high"')
  })
})
