import { useLayoutEffect, useRef, useState } from 'react'

/*
  Ajusta um título display à largura do contêiner.
  Mede o texto num corpo de referência e calcula o corpo que preenche a
  largura. Se numa linha só ficaria pequeno demais, quebra em duas linhas
  equilibradas (a divisão que rende o maior corpo).
*/

export interface Fit {
  lines: string[]
  size: number
}

const UNIT = 100 // corpo do medidor, em px

/** Abaixo desta proporção (corpo / largura), uma linha só fica tímida: quebra em duas. */
const minRatio = (w: number) => (w >= 1000 ? 0.1 : 0.19)

/** Teto do corpo: nunca mais que ~1/3 da altura da tela. */
const maxSize = (w: number) => Math.min(w * 0.2, document.documentElement.clientHeight * 0.2)

export function useFitText(text: string) {
  const boxRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [fit, setFit] = useState<Fit | null>(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    const meas = measureRef.current
    const words = text.trim().split(/\s+/).filter(Boolean)
    if (!box || !meas || words.length === 0) return
    let alive = true
    let frame = 0

    const run = () => {
      if (!alive) return
      const w = box.clientWidth
      if (w <= 0) return
      const widthOf = (s: string) => {
        meas.textContent = s
        return meas.getBoundingClientRect().width || 1
      }
      const sizeFor = (lines: string[]) => (w * 0.992 * UNIT) / Math.max(...lines.map(widthOf))

      let lines = [words.join(' ')]
      let size = sizeFor(lines)
      if (words.length > 1 && size < w * minRatio(w)) {
        let best = 0
        for (let k = 1; k < words.length; k++) {
          const cand = [words.slice(0, k).join(' '), words.slice(k).join(' ')]
          const s = sizeFor(cand)
          if (s > best) {
            best = s
            lines = cand
          }
        }
        size = best
      }
      meas.textContent = ''
      size = Math.floor(Math.min(size, maxSize(w)) * 10) / 10
      setFit((prev) =>
        prev && prev.size === size && prev.lines.join('\n') === lines.join('\n') ? prev : { lines, size },
      )
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(run)
    }

    run()
    const ro = new ResizeObserver(schedule)
    ro.observe(box)
    window.addEventListener('resize', schedule)
    const fonts = document.fonts
    void fonts.ready.then(schedule)
    fonts.addEventListener('loadingdone', schedule)
    return () => {
      alive = false
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', schedule)
      fonts.removeEventListener('loadingdone', schedule)
    }
  }, [text])

  return { boxRef, measureRef, fit }
}
