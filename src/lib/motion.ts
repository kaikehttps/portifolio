/* Curvas e durações compartilhadas (espelham os tokens CSS). */

export const ease = {
  /** expo out — revelações, entradas */
  out: [0.16, 1, 0.3, 1] as const,
  /** quint in-out — cortinas, transições de página */
  inOut: [0.83, 0, 0.17, 1] as const,
  /** corte seco */
  snap: [0.7, 0, 0.2, 1] as const,
}

export const dur = {
  fast: 0.25,
  base: 0.6,
  slow: 1.1,
}

/** Atraso em cascata para listas de letras/palavras. */
export const stagger = (i: number, step = 0.035, base = 0) => base + i * step

/**
 * Recursos do Motion fora do bundle inicial: a página pinta com os estados `initial`
 * e as animações começam assim que o chunk chega. Use sempre `m.*` (não `motion.*`):
 * o <LazyMotion strict> da raiz acusa erro se um componente completo escapar.
 */
export const loadMotionFeatures = () => import('./motion-features').then((mod) => mod.default)
