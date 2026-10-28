import Lenis from 'lenis'
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { useReducedMotion } from 'motion/react'

/*
  Rolagem suave com Lenis (só no desktop com mouse; toque e "movimento
  reduzido" usam a rolagem nativa). A rolagem continua sendo a do
  navegador, então position: sticky e useScroll do Motion funcionam.
*/

const LenisContext = createContext<Lenis | null>(null)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false })
    let frame = requestAnimationFrame(function loop(time) {
      instance.raf(time)
      frame = requestAnimationFrame(loop)
    })
    setLenis(instance)
    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      setLenis(null)
    }
  }, [reduce])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

type ScrollTarget = string | number | HTMLElement

/** Rola até um id ("#projetos" ou "projetos"), elemento ou posição. */
export function useScrollTo() {
  const lenis = useLenis()
  const reduce = useReducedMotion()
  return useCallback(
    (target: ScrollTarget, opts: { immediate?: boolean; offset?: number } = {}) => {
      const resolved =
        typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target
      if (resolved == null) return
      const immediate = opts.immediate || reduce
      const offset = opts.offset ?? 0
      if (lenis) {
        lenis.scrollTo(resolved, {
          offset,
          immediate: !!immediate,
          duration: 1.6,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        })
        return
      }
      const top =
        typeof resolved === 'number'
          ? resolved
          : resolved.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
    },
    [lenis, reduce],
  )
}

/** Trava a rolagem (menu aberto, transições). */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (!locked) return
    lenis?.stop()
    const { overflow } = document.documentElement.style
    document.documentElement.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = overflow
    }
  }, [locked, lenis])
}

/** Estado de navegação para voltar à home já posicionado num projeto. */
export interface RestoreState {
  restore?: string
}

/**
 * Chamado por cada página ao montar: posiciona a rolagem.
 * - state.restore = slug → volta para #projeto-<slug>
 * - hash na URL → vai para a seção
 * - senão → topo
 */
export function usePageScroll() {
  const location = useLocation()
  const scrollTo = useScrollTo()
  const lenis = useLenis()

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const state = location.state as RestoreState | null
    const targetId = state?.restore ? `projeto-${state.restore}` : location.hash.slice(1)
    lenis?.resize()
    if (targetId && document.getElementById(targetId)) {
      scrollTo(targetId, { immediate: true, offset: state?.restore ? -80 : 0 })
    } else {
      window.scrollTo(0, 0)
      lenis?.scrollTo(0, { immediate: true, force: true })
    }
    // Só ao montar a página.
  }, [])
}
