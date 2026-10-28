import { useCallback, useEffect, useState, type MouseEvent } from 'react'
import { useLocation } from 'react-router'
import { sections } from '@/content'
import { useScrollTo } from '@/lib/smooth-scroll'
import { focusSection } from './focus'

/* Navegação entre as seções da home, compartilhada por Nav, menu e HUD. */

/** Páginas que contêm as seções com ids: a home (e as páginas de laboratório *.html). */
export function hasSections(pathname: string): boolean {
  return pathname === '/' || pathname.endsWith('.html')
}

/** Clique "comum" (sem modificadores, botão principal) — os outros abrem em nova aba normalmente. */
function isPlainClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
}

/** Atualiza o hash sem disparar navegação (preserva o estado do router). */
export function replaceHash(id: string | null) {
  const url = id ? `#${id}` : `${location.pathname}${location.search}`
  history.replaceState(history.state, '', url)
}

/**
 * Retorna um handler de clique para links de seção (`<Link to="/#id">`).
 * Na home: rola suavemente e troca o hash. Fora dela: deixa o Link navegar para "/#id".
 * `defer` adia a rolagem (ex.: o menu mobile precisa fechar e destravar a página antes).
 */
export function useSectionLink(defer?: (id: string) => void) {
  const { pathname } = useLocation()
  const scrollTo = useScrollTo()
  const local = hasSections(pathname)

  // Rola, troca o hash e leva o foco junto (o preventDefault tirou o foco nativo da âncora).
  const go = useCallback(
    (id: string) => {
      scrollTo(id)
      replaceHash(id)
      focusSection(id)
    },
    [scrollTo],
  )

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, id: string) => {
      if (!local || !isPlainClick(e) || !document.getElementById(id)) return
      e.preventDefault()
      if (defer) defer(id)
      else go(id)
    },
    [local, defer, go],
  )

  return { onClick, go, local }
}

/**
 * Seção ativa: a que cruza a linha de leitura (40% da altura da tela).
 * null no hero ou fora da home. As seções podem montar depois (transição de página,
 * carregamento), então os ids são reconsultados periodicamente — custo desprezível.
 */
export function useActiveSection(): string | null {
  const { pathname } = useLocation()
  const local = hasSections(pathname)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!local) return
    const hits = new Map<string, boolean>()
    const watched = new Map<string, Element>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) hits.set(entry.target.id, entry.isIntersecting)
        let next: string | null = null
        for (const s of sections) if (hits.get(s.id)) next = s.id
        setActive(next)
      },
      { rootMargin: '-40% 0px -59% 0px' },
    )

    const scan = () => {
      for (const s of sections) {
        const el = document.getElementById(s.id)
        const prev = watched.get(s.id)
        if (el === prev) continue
        if (prev) io.unobserve(prev)
        hits.delete(s.id)
        if (el) {
          io.observe(el)
          watched.set(s.id, el)
        } else watched.delete(s.id)
      }
    }

    scan()
    const timer = window.setInterval(scan, 1000)
    return () => {
      window.clearInterval(timer)
      io.disconnect()
    }
  }, [local])

  return local ? active : null
}
