import { useEffect, useRef, type RefObject } from 'react'

/*
  Motor do nome do hero:
  1. Ajuste: mede as letras (num clone oculto a 1000px) e calcula o corpo que
     faz KAIKE ocupar a largura disponível. Em repouso a palavra quase encosta
     na margem; o pico do eixo usa uma pequena reserva + parte da calha direita
     (nunca os últimos 16px da tela). Sem movimento, ocupa 100%.
  2. Eixo vivo: um único rAF escreve variáveis CSS por letra (--wd/--wg),
     com mola independente da taxa de quadros. Mouse → lente de proximidade;
     toque → uma onda única na entrada.
  3. Parallax do mouse: escreve `translate` direto nos elementos [data-parallax]
     ("x,y" em px por unidade) — nada de variável herdada na seção inteira.
  Nada de estado React por quadro.
*/

export type EngineMode = 'pointer' | 'wave' | 'off'

/** Eixos do nome: repouso → pico. Sem movimento não há pico. */
export function axesFor(mode: EngineMode) {
  if (mode === 'off') return { wdRest: 62, wdMax: 62, wgRest: 820, wgMax: 820 }
  return { wdRest: 62, wdMax: mode === 'wave' ? 82 : 100, wgRest: 820, wgMax: 900 }
}

/** Quanto da maior expansão de UMA letra fica reservado em repouso. */
const RESERVE: Record<EngineMode, number> = { pointer: 0.55, wave: 0.5, off: 0 }
const MEASURE = 1000
const WAVE_MS = 1700
const FRAME = 1000 / 60

interface Metrics {
  /** corpo do nome, px */
  size: number
  /** centro de cada letra em repouso, px a partir da esquerda da caixa */
  centers: number[]
  /** largura extra de cada letra no pico, px */
  extra: number[]
  /** crescimento total permitido, px */
  budget: number
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function useNameEngine({
  root,
  box,
  measure,
  mode,
  active,
}: {
  root: RefObject<HTMLElement | null>
  box: RefObject<HTMLElement | null>
  measure: RefObject<HTMLElement | null>
  mode: EngineMode
  /** a abertura terminou (a onda espera por isso) */
  active: boolean
}) {
  const metrics = useRef<Metrics | null>(null)

  /* ── 1. Ajuste à largura ─────────────────────────────────── */
  useEffect(() => {
    const rootEl = root.current
    const boxEl = box.current
    const m = measure.current
    if (!rootEl || !boxEl || !m) return

    const widths = (sel: string) =>
      Array.from(m.querySelectorAll<HTMLElement>(sel), (e) => e.getBoundingClientRect().width)

    const fit = () => {
      const rest = widths('[data-m="rest"] > span')
      const max = widths('[data-m="max"] > span')
      const boxW = boxEl.clientWidth
      if (!rest.length || !boxW) return
      const sum = rest.reduce((a, b) => a + b, 0)
      const extra = rest.map((w, i) => Math.max(0, (max[i] ?? w) - w))
      const css = getComputedStyle(rootEl)
      // o pico pode invadir parte da calha direita, nunca os últimos 16px da tela
      const gutter = parseFloat(css.paddingRight) || 0
      const overhang = mode === 'off' ? 0 : Math.max(0, Math.min(gutter * 0.75, gutter - 16))
      const room = boxW + overhang
      const reserve = Math.max(0, ...extra) * RESERVE[mode]
      // teto de altura: fração do palco (desktop, altura fixa) ou da tela (layouts empilhados)
      const fill = parseFloat(css.getPropertyValue('--name-fill')) || 0
      const k = parseFloat(css.getPropertyValue('--name-k')) || 0.6
      // teto absoluto (px, sem unidade) para telas grandes
      const cap = parseFloat(css.getPropertyValue('--name-max')) || Infinity
      const stageH = boxEl.parentElement?.clientHeight ?? 0
      // repouso + reserva cabem na sala; o repouso sozinho nunca passa da caixa
      const byWidth = Math.min(room / (sum + reserve), boxW / sum) * MEASURE
      const byHeight = (fill > 0 && stageH > 0 ? stageH * fill : window.innerHeight * k) / 0.82
      const size = Math.max(48, Math.min(byWidth, byHeight, cap))
      const s = size / MEASURE
      const word = sum * s
      let acc = 0
      metrics.current = {
        size,
        centers: rest.map((w) => {
          const c = (acc + w / 2) * s
          acc += w
          return c
        }),
        extra: extra.map((e) => e * s),
        budget: Math.max(0, room - word),
      }
      rootEl.style.setProperty('--name-size', `${size.toFixed(2)}px`)
      rootEl.style.setProperty('--word-w', `${word.toFixed(2)}px`)
    }

    fit()
    let alive = true
    // um observador para largura (caixa) e altura (seção): um ajuste por mudança
    const ro = new ResizeObserver(fit)
    ro.observe(boxEl)
    ro.observe(rootEl)
    const fonts = document.fonts
    fonts?.ready.then(() => alive && fit())
    fonts?.addEventListener('loadingdone', fit)
    return () => {
      alive = false
      ro.disconnect()
      fonts?.removeEventListener('loadingdone', fit)
    }
  }, [root, box, measure, mode]) // mode muda a linha de medição → remede

  /* ── 2 + 3. Eixo vivo e parallax ─────────────────────────── */
  useEffect(() => {
    const rootEl = root.current
    const boxEl = box.current
    if (!rootEl || !boxEl || mode === 'off' || !active) return

    // letras agrupadas por índice: [sólida, contorno]
    const groups: HTMLElement[][] = []
    rootEl.querySelectorAll<HTMLElement>('[data-char]').forEach((el) => {
      const i = Number(el.dataset.char)
      ;(groups[i] ??= []).push(el)
    })
    const layers = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-parallax]'), (el) => {
      const [x, y] = (el.dataset.parallax ?? '0,0').split(',').map(Number)
      return { el, x: x || 0, y: y || 0 }
    })
    const n = groups.length
    const AXES = axesFor(mode)
    const val = new Array<number>(n).fill(0)
    const vel = new Array<number>(n).fill(0)
    const shown = new Array<number>(n).fill(-1)
    const target = new Array<number>(n).fill(0)

    let px = -1e5
    let py = -1e5
    let tx = 0
    let ty = 0
    let sx = 0
    let sy = 0
    let raf = 0
    let last = 0
    let running = false
    let inView = true
    let waveT0 = -1
    // posição da caixa em coordenadas do documento: lida só ao (re)começar o laço
    let boxTop = 0
    let boxLeft = 0
    let boxH = 0
    const readBox = () => {
      const r = boxEl.getBoundingClientRect()
      boxTop = r.top + window.scrollY
      boxLeft = r.left + window.scrollX
      boxH = r.height
    }

    const write = (i: number, r: number) => {
      if (Math.abs(r - shown[i]) < 0.002) return
      shown[i] = r
      const wd = (AXES.wdRest + (AXES.wdMax - AXES.wdRest) * r).toFixed(2)
      const wg = (AXES.wgRest + (AXES.wgMax - AXES.wgRest) * r).toFixed(1)
      for (const el of groups[i]) {
        el.style.setProperty('--wd', wd)
        el.style.setProperty('--wg', wg)
      }
    }

    const step = (now: number) => {
      // fator de quadro: a mola anda igual a 60Hz e a 120Hz
      const f = last ? Math.min(2, (now - last) / FRAME) : 1
      last = now
      let moving = false
      const m = metrics.current
      if (m && n) {
        target.fill(0)
        if (mode === 'pointer') {
          const left = boxLeft - window.scrollX
          const cy = boxTop - window.scrollY + boxH / 2
          // lente estreita: uma letra por vez, vizinhas de leve
          const rx = m.size * 0.34
          const ry = m.size * 0.6
          const dy = (py - cy) / ry
          for (let i = 0; i < n; i++) {
            const dx = (px - (left + m.centers[i])) / rx
            target[i] = Math.exp(-dx * dx - dy * dy)
          }
        } else if (waveT0 >= 0) {
          const t = (now - waveT0) / WAVE_MS
          if (t >= 1) waveT0 = -1
          else {
            moving = true
            const c = -1.2 + (n + 1.4) * easeInOut(t)
            for (let i = 0; i < n; i++) target[i] = Math.exp(-((i - c) * (i - c)) / 0.5)
          }
        }
        // mola leve, depois normaliza para nunca passar da folga
        const damp = Math.pow(0.72, f)
        let sum = 0
        for (let i = 0; i < n; i++) {
          vel[i] = (vel[i] + (target[i] - val[i]) * 0.11 * f) * damp
          val[i] = Math.min(1.1, Math.max(0, val[i] + vel[i] * f))
          if (Math.abs(vel[i]) > 1e-4 || Math.abs(target[i] - val[i]) > 1e-3) moving = true
          sum += val[i] * m.extra[i]
        }
        const norm = sum > m.budget && sum > 0 ? m.budget / sum : 1
        for (let i = 0; i < n; i++) write(i, Math.min(1, val[i] * norm))
      }

      if (mode === 'pointer' && layers.length) {
        const k = 1 - Math.pow(1 - 0.07, f)
        sx += (tx - sx) * k
        sy += (ty - sy) * k
        if (Math.abs(tx - sx) > 5e-4 || Math.abs(ty - sy) > 5e-4) moving = true
        for (const l of layers) l.el.style.translate = `${(sx * l.x).toFixed(2)}px ${(sy * l.y).toFixed(2)}px`
      }

      if (moving && inView) raf = requestAnimationFrame(step)
      else running = false
    }

    const kick = () => {
      if (running || !inView) return
      running = true
      last = 0
      readBox()
      raf = requestAnimationFrame(step)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      px = e.clientX
      py = e.clientY
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
      kick()
    }
    const onLeave = () => {
      px = py = -1e5
      kick()
    }

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) kick()
    })
    io.observe(rootEl)
    // layout mudou (resize, fontes) → relê a caixa
    const ro = new ResizeObserver(() => readBox())
    ro.observe(rootEl)

    let waveTimer = 0
    if (mode === 'pointer') {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('scroll', kick, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    } else {
      // espera as letras subirem antes da onda
      waveTimer = window.setTimeout(() => {
        waveT0 = performance.now()
        kick()
      }, 1250)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(waveTimer)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', kick)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      for (const g of groups) for (const el of g) {
        el.style.removeProperty('--wd')
        el.style.removeProperty('--wg')
      }
      for (const l of layers) l.el.style.removeProperty('translate')
    }
  }, [root, box, mode, active])
}
