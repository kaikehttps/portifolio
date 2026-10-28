import { useEffect, useState, useSyncExternalStore } from 'react'

export { useReducedMotion } from 'motion/react'

/** Assina uma media query. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', notify)
      return () => mql.removeEventListener('change', notify)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Mouse/trackpad de verdade (habilita cursor personalizado e efeitos de hover). */
export function useFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

/** Breakpoints do projeto. */
export const bp = {
  mobile: '(max-width: 640px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1025px)',
}

export function useIsMobile(): boolean {
  return useMediaQuery(bp.mobile)
}

/** Relógio que atualiza a cada `ms`. */
export function useNow(ms = 1000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), ms)
    return () => window.clearInterval(id)
  }, [ms])
  return now
}
