/** Reducir movimiento o mala señal: nada viaja ni se esconde. */
export const quieto = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('slow-connection')
