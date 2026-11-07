// De dónde puede bajar fotos el build (PRI-423). Es .mjs porque también lo importa astro.config.mjs.

/**
 * El host del proyecto Supabase propio. Los E2E leen la base por un proxy local y usan fotos reales
 * (e2e/promos/server.mjs): el host real les llega en PUBLIC_SUPABASE_FOTOS_URL. Netlify y CI no necesitan esa variable.
 */
export function hostDeFotos(env) {
  const url = env.PUBLIC_SUPABASE_FOTOS_URL || env.PUBLIC_SUPABASE_URL
  return url ? new URL(url).hostname : undefined
}

/** Solo https del proyecto propio: lo mismo que image.remotePatterns de astro.config.mjs. */
export function esUrlPermitida(url, env = import.meta.env) {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && u.hostname === hostDeFotos(env)
  } catch {
    return false
  }
}
