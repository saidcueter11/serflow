import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanEmail, cleanText, cleanUrl, cleanWhatsapp, loadBusinessOverrides, parseBusinessOverrides } from './business-overrides.mjs'
import { jsonLd } from './business'

afterEach(() => vi.unstubAllGlobals())

describe('cleanWhatsapp', () => {
  it('accepts a Colombian mobile with its country code', () => {
    expect(cleanWhatsapp('573001112233')).toBe('573001112233')
  })

  it.each(['3001112233', '+573001112233', '57 300 111 2233', '571234567890', '5730011122334', 'abc', '', null, 573001112233])(
    'rejects %s',
    (value) => {
      expect(cleanWhatsapp(value)).toBeUndefined()
    },
  )
})

describe('cleanUrl', () => {
  const hosts = ['www.instagram.com']

  it('accepts https on an allowed host', () => {
    expect(cleanUrl('https://www.instagram.com/serflow/', hosts)).toBe('https://www.instagram.com/serflow/')
  })

  it.each([
    'javascript:alert(1)',
    'http://www.instagram.com/serflow/',
    'https://www.instagram.com.evil.example/',
    'https://evil.example/www.instagram.com',
    'https://user:pass@www.instagram.com/',
    'no es url',
    '',
    null,
  ])('rejects %s', (value) => {
    expect(cleanUrl(value, hosts)).toBeUndefined()
  })
})

describe('cleanEmail', () => {
  it('accepts a normal address', () => {
    expect(cleanEmail('taller@serflow.co')).toBe('taller@serflow.co')
  })

  it.each(['sin-arroba', 'a@b', 'a@b.com?bcc=x@y.com', 'a b@c.com', '<a@b.com>', ''])('rejects %s', (value) => {
    expect(cleanEmail(value)).toBeUndefined()
  })
})

describe('cleanText', () => {
  it('trims, and treats blank or too long as empty', () => {
    expect(cleanText('  Hola  ', 10)).toBe('Hola')
    expect(cleanText('   ', 10)).toBeUndefined()
    expect(cleanText('12345678901', 10)).toBeUndefined()
    expect(cleanText(7, 10)).toBeUndefined()
  })
})

describe('parseBusinessOverrides', () => {
  it('keeps only what is valid, so the rest falls back to the code', () => {
    expect(
      parseBusinessOverrides({
        whatsapp_number: '3001112233',
        email: 'taller@serflow.co',
        address: '   ',
        directions_url: 'javascript:alert(1)',
        map_embed_url: 'https://www.google.com/maps/search/?q=x',
        instagram_url: 'https://www.instagram.com/nuevo/',
        tiktok_url: 'https://www.instagram.com/nuevo/',
      }),
    ).toEqual({ email: 'taller@serflow.co', instagramUrl: 'https://www.instagram.com/nuevo/' })
  })

  it('takes the Google embed for the map', () => {
    const map = 'https://www.google.com/maps/embed?pb=abc'
    expect(parseBusinessOverrides({ map_embed_url: map })).toEqual({ mapEmbedUrl: map })
  })

  it('takes hours whole or not at all', () => {
    const good = [{ days: 'Lunes', time: '8 a 5' }]
    expect(parseBusinessOverrides({ hours: good }).hours).toEqual([{ days: 'Lunes', short: 'Lunes', time: '8 a 5' }])
    for (const bad of [[], 'Lunes', [...good, { days: 'Martes' }], [null], Array(8).fill(good[0])]) {
      expect(parseBusinessOverrides({ hours: bad }).hours).toBeUndefined()
    }
  })

  it('an empty or missing row overrides nothing', () => {
    expect(parseBusinessOverrides(undefined)).toEqual({})
    expect(parseBusinessOverrides({})).toEqual({})
  })
})

describe('loadBusinessOverrides', () => {
  const json = (body: unknown, status = 200) => async () => new Response(JSON.stringify(body), { status })

  it('a table that does not exist yet or an empty one overrides nothing', async () => {
    vi.stubGlobal('fetch', json({ code: 'PGRST205' }, 404))
    await expect(loadBusinessOverrides('https://x.supabase.co', 'key')).resolves.toEqual({})
    vi.stubGlobal('fetch', json([]))
    await expect(loadBusinessOverrides('https://x.supabase.co', 'key')).resolves.toEqual({})
  })

  it('bad data does not break it', async () => {
    vi.stubGlobal('fetch', json([{ whatsapp_number: '123', email: 'taller@serflow.co' }]))
    await expect(loadBusinessOverrides('https://x.supabase.co', 'key')).resolves.toEqual({ email: 'taller@serflow.co' })
  })

  it('a real read failure throws, so the build keeps the published site', async () => {
    vi.stubGlobal('fetch', json({ message: 'caída' }, 500))
    await expect(loadBusinessOverrides('https://x.supabase.co', 'key')).rejects.toThrow(/HTTP 500/)
    vi.stubGlobal('fetch', async () => {
      throw new Error('network down')
    })
    await expect(loadBusinessOverrides('https://x.supabase.co', 'key')).rejects.toThrow(/network down/)
  })

  it('without env vars it does not call the network', async () => {
    const spy = vi.fn()
    vi.stubGlobal('fetch', spy)
    await expect(loadBusinessOverrides(undefined, undefined)).resolves.toEqual({})
    expect(spy).not.toHaveBeenCalled()
  })
})

describe('removing a social network', () => {
  it('only an explicit false removes it, and the stored link is kept', () => {
    const row = { instagram_visible: false, instagram_url: 'https://www.instagram.com/x/' }
    expect(parseBusinessOverrides(row)).toEqual({ instagramHidden: true, instagramUrl: 'https://www.instagram.com/x/' })
  })

  it.each([true, null, undefined, '', 'false', 0])('%s keeps it visible', (value) => {
    expect(parseBusinessOverrides({ tiktok_visible: value, facebook_visible: value })).toEqual({})
  })
})

describe('jsonLd', () => {
  it('cannot close the script tag and stays valid JSON', () => {
    const value = { address: '</script><script>alert(1)</script> & co' }
    const out = jsonLd(value)
    expect(out).not.toMatch(/[<>&]/)
    expect(JSON.parse(out)).toEqual(value)
  })
})
