import { useEffect } from 'react'
import { useNavigate } from 'react-router'

/**
 * Esc volta para a lista de projetos (posicionada neste projeto).
 * Ignora quando algo já tratou a tecla (visualizador), quando há um diálogo
 * ou menu aberto (rolagem travada) ou quando o foco está num campo de texto.
 */
export function useEscBack(slug: string) {
  const navigate = useNavigate()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      const target = e.target instanceof Element ? e.target : null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (document.querySelector('dialog[open], [aria-modal="true"]')) return
      if (document.documentElement.style.overflow === 'hidden') return
      navigate('/', { state: { restore: slug } })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, slug])
}
