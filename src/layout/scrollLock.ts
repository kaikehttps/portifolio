import { useEffect } from 'react'
import { useScrollLock } from '@/lib/smooth-scroll'

let locks = 0
let previous = ''

/**
 * useScrollLock sem "pulo" lateral: overflow hidden tira a barra de rolagem clássica
 * (Windows, ~11px) e tudo que é alinhado à direita anda. Enquanto travado,
 * a calha da barra fica reservada (scrollbar-gutter: stable), então nada se move.
 * Declarado antes do useScrollLock: reserva a calha antes do overflow mudar.
 */
export function useStableScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const root = document.documentElement
    if (locks++ === 0) {
      previous = root.style.scrollbarGutter
      root.style.scrollbarGutter = 'stable'
    }
    return () => {
      if (--locks === 0) root.style.scrollbarGutter = previous
    }
  }, [locked])
  useScrollLock(locked)
}
