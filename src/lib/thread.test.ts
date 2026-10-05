import { describe, expect, it } from 'vitest'
import { threadPath, threadSvg } from './thread'

describe('threadPath', () => {
  it('starts at 70% of the first screen and ends 30% above the bottom of the page', () => {
    const { d, turns } = threadPath(1280, 3000, 800)
    expect(d.startsWith('M 1266 560')).toBe(true)
    expect(turns.at(-1)?.y).toBe(3000 - 800 * 0.3)
  })

  it('alternates sides on every turn', () => {
    const { turns } = threadPath(390, 5000, 844)
    expect(turns.length).toBeGreaterThan(2)
    turns.forEach((t, i) => expect(t.x).toBe(i % 2 ? 376 : 14))
  })

  it('still draws one curve on a page shorter than the screen', () => {
    expect(threadPath(390, 500, 844).turns).toHaveLength(1)
  })
})

describe('threadSvg', () => {
  it('puts the needle on the same path the thread is drawn on', () => {
    const { d } = threadPath(1280, 3000, 800)
    const svg = threadSvg(1280, 3000, 800)
    expect(svg.split(d).length - 1).toBe(4) // mask, two strands, needle offset-path
  })
})
