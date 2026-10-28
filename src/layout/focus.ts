/*
  Foco depois de navegar: leva o teclado/leitor de tela até o destino
  (seção ou página nova) sem rolar de novo e sem desenhar contorno num bloco inteiro.
*/

/** Foca um destino não interativo (seção, <main>). O tabindex temporário some no blur. */
export function focusQuietly(el: HTMLElement | null | undefined) {
  if (!el || !el.isConnected) return
  const added = !el.hasAttribute('tabindex')
  const { outline } = el.style
  if (added) el.setAttribute('tabindex', '-1')
  el.style.outline = 'none'
  el.addEventListener(
    'blur',
    () => {
      if (added) el.removeAttribute('tabindex')
      el.style.outline = outline
    },
    { once: true },
  )
  el.focus({ preventScroll: true })
}

/** Destino de uma seção da home pelo id; sem id, o conteúdo principal. */
export function focusSection(id: string | null) {
  const el = id ? document.getElementById(id) : document.querySelector<HTMLElement>('main')
  focusQuietly(el)
}
