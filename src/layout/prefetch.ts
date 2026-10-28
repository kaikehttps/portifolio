import { useEffect } from 'react'
import { useIntroDone } from '@/lib/intro'

/*
  A página de projeto é carregada sob demanda. Para o obturador não ficar fechado
  esperando a rede, o pedaço é aquecido antes do clique: quando o navegador fica ocioso
  depois da abertura e quando um link de projeto recebe ponteiro, toque ou foco.
  (O Vite junta os dois import() no mesmo arquivo.)
*/

let requested = false

export function prefetchProjectPage() {
  if (requested) return
  requested = true
  import('@/pages/ProjectPage').catch(() => {
    requested = false
  })
}

const PROJECT_LINK = 'a[href^="/projetos/"]'

export function usePrefetchProjectPage() {
  const introDone = useIntroDone()

  // Intenção: ponteiro, toque ou foco num link de projeto.
  useEffect(() => {
    const onIntent = (e: Event) => {
      if (e.target instanceof Element && e.target.closest(PROJECT_LINK)) prefetchProjectPage()
    }
    const opts = { passive: true, capture: true }
    document.addEventListener('pointerover', onIntent, opts)
    document.addEventListener('pointerdown', onIntent, opts)
    document.addEventListener('focusin', onIntent, opts)
    return () => {
      document.removeEventListener('pointerover', onIntent, opts)
      document.removeEventListener('pointerdown', onIntent, opts)
      document.removeEventListener('focusin', onIntent, opts)
    }
  }, [])

  // Ocioso: depois da abertura, sem disputar com o hero; respeita economia de dados.
  useEffect(() => {
    if (!introDone) return
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData) return
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetchProjectPage, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(prefetchProjectPage, 2500)
    return () => clearTimeout(id)
  }, [introDone])
}
