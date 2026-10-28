import { useEffect, useId, useRef, type RefObject } from 'react'
import s from './Sisyphus.module.css'

/*
  SÍSIFO — a encosta, a pedra e quem a empurra, em SVG.
  - A subida acompanha a rolagem: a pedra sobe enquanto a seção passa pela tela
    (e desce se o visitante volta). Um pequeno vaivém contínuo dá o esforço.
  - Com `textRef`, as palavras ([data-w]) perto da pedra cedem ao peso:
    comprimem e se afastam alguns pixels, e voltam quando ela passa.
  - `still`: movimento reduzido — a cena fica parada no meio da subida, sem deformação.
  Tudo é escrito direto nos atributos, num único rAF que só roda com a cena visível.
*/

/** Figura desenhada para uma pedra de raio 56, com o ponto de apoio da pedra em (0, 0). */
const FIG_R = 56

interface Word {
  el: HTMLElement
  x: number
  y: number
  k: number
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/** Encosta: plana à esquerda (sob o texto) e cada vez mais íngreme até o cume, à direita. */
function ridgeFor(w: number, h: number, compact: boolean) {
  const [y0, c1x, c2x, c2y, y3] = compact ? [0.94, 0.3, 0.62, 0.5, 0.14] : [0.985, 0.36, 0.66, 0.56, 0.08]
  return `M ${-0.04 * w} ${y0 * h} C ${c1x * w} ${y0 * h}, ${c2x * w} ${c2y * h}, ${1.03 * w} ${y3 * h}`
}

export function Sisyphus({
  textRef,
  compact = false,
  still = false,
  className,
}: {
  textRef?: RefObject<HTMLElement | null>
  compact?: boolean
  still?: boolean
  className?: string
}) {
  const id = useId().replace(/:/g, '')
  const boxRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const ridgeRef = useRef<SVGPathElement>(null)
  const hillRef = useRef<SVGPathElement>(null)
  const skyRef = useRef<SVGRadialGradientElement>(null)
  const stoneRef = useRef<SVGGElement>(null)
  const spinRef = useRef<SVGGElement>(null)
  const manRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const box = boxRef.current
    const svg = svgRef.current
    const ridge = ridgeRef.current
    const hill = hillRef.current
    const sky = skyRef.current
    const stone = stoneRef.current
    const spin = spinRef.current
    const man = manRef.current
    if (!box || !svg || !ridge || !hill || !sky || !stone || !spin || !man) return

    let w = 0
    let h = 0
    let len = 0
    let r = 40
    let words: Word[] = []
    let cur = -1
    let raf = 0
    let last = 0
    let visible = false

    const relax = () => {
      for (const word of words) word.el.style.transform = ''
    }

    const layout = () => {
      const rect = box.getBoundingClientRect()
      w = rect.width
      h = rect.height
      if (!w || !h) return
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      const d = ridgeFor(w, h, compact)
      ridge.setAttribute('d', d)
      hill.setAttribute('d', `${d} L ${1.03 * w} ${h + 2} L ${-0.04 * w} ${h + 2} Z`)
      sky.setAttribute('cx', String(w * 0.86))
      sky.setAttribute('cy', String(h * 0.12))
      sky.setAttribute('r', String(Math.max(w, h) * 0.75))
      len = ridge.getTotalLength()
      r = clamp(h * (compact ? 0.11 : 0.085), 22, 58)

      // posições das palavras em repouso, no sistema da cena
      relax()
      const el = textRef?.current
      words =
        el && !still
          ? Array.from(el.querySelectorAll<HTMLElement>('[data-w]'), (node) => {
              const b = node.getBoundingClientRect()
              return { el: node, x: b.left + b.width / 2 - rect.left, y: b.top + b.height * 0.6 - rect.top, k: 0 }
            })
          : []
    }

    const draw = (p: number, now: number) => {
      // vaivém do esforço: avança, cede um pouco, avança
      const effort = still ? 0 : Math.sin(now / 1300) * r * 0.07
      // começa com Sísifo inteiro na cena e para pouco antes do cume
      const start = r * 4.2
      const at = clamp(start + (len - start - r * 1.4) * p + effort, 0, len)
      const pt = ridge.getPointAtLength(at)
      const ahead = ridge.getPointAtLength(Math.min(len, at + 2))
      const behind = ridge.getPointAtLength(Math.max(0, at - 2))
      const a = Math.atan2(ahead.y - behind.y, ahead.x - behind.x)
      const deg = (a * 180) / Math.PI
      const cx = pt.x + Math.sin(a) * r
      const cy = pt.y - Math.cos(a) * r

      stone.setAttribute('transform', `translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${(r / FIG_R).toFixed(4)})`)
      spin.setAttribute('transform', `rotate(${((at / r) * 57.2958).toFixed(2)})`)
      // o corpo inclina só metade da encosta: a gravidade puxa para baixo
      man.setAttribute(
        'transform',
        `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)}) rotate(${(deg * 0.55).toFixed(2)}) scale(${(r / FIG_R).toFixed(4)})`,
      )

      const reach = r * 4.4
      for (const word of words) {
        const dx = word.x - cx
        const dy = word.y - cy
        const dist = Math.hypot(dx, dy) || 1
        const k = dist < reach ? (1 - dist / reach) ** 1.6 : 0
        if (Math.abs(k - word.k) < 0.004) continue
        word.k = k
        if (k === 0) {
          word.el.style.transform = ''
          continue
        }
        const ux = dx / dist
        const uy = dy / dist
        word.el.style.transform = `translate(${(ux * 9 * k).toFixed(2)}px, ${(uy * 6 * k + 3 * k).toFixed(2)}px) scale(${(1 + 0.06 * k).toFixed(3)}, ${(1 - 0.24 * k).toFixed(3)})`
      }
    }

    /** Progresso da subida: 0 quando a cena começa a aparecer, 1 quando está saindo por cima. */
    const target = () => {
      if (still) return 0.6
      const rect = box.getBoundingClientRect()
      const vh = window.innerHeight
      return clamp((vh * 0.35 - rect.top) / (rect.height * 0.45 + vh * 0.35), 0, 1)
    }

    const frame = (now: number) => {
      raf = 0
      const dt = last ? Math.min(64, now - last) : 16.7
      last = now
      const t = target()
      cur = cur < 0 ? t : cur + (t - cur) * (1 - Math.pow(0.93, dt / 16.7))
      draw(cur, now)
      if (visible && !still) raf = requestAnimationFrame(frame)
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    layout()
    kick()

    const ro = new ResizeObserver(() => {
      layout()
      kick()
    })
    ro.observe(box)
    if (textRef?.current) ro.observe(textRef.current)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      last = 0
      if (visible) kick()
    })
    io.observe(box)

    let alive = true
    document.fonts?.ready.then(() => {
      if (!alive) return
      layout()
      kick()
    })

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      relax()
    }
  }, [textRef, compact, still])

  return (
    <div ref={boxRef} className={[s.scene, className].filter(Boolean).join(' ')} aria-hidden="true">
      <svg ref={svgRef} className={s.svg} preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient ref={skyRef} id={`${id}-sky`} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2a4f9e" stopOpacity="0.55" />
            <stop offset="0.45" stopColor="#14295a" stopOpacity="0.32" />
            <stop offset="1" stopColor="#050505" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-hill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b1222" />
            <stop offset="0.5" stopColor="#060810" />
            <stop offset="1" stopColor="#050505" />
          </linearGradient>
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--signal)" stopOpacity="0" />
            <stop offset="0.55" stopColor="var(--signal)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--signal)" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id={`${id}-stone`} cx="0.62" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#2b3c63" />
            <stop offset="0.55" stopColor="#111a2e" />
            <stop offset="1" stopColor="#06080e" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${id}-sky)`} />

        <path ref={hillRef} fill={`url(#${id}-hill)`} />
        <path ref={ridgeRef} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="1.25" />

        {/* Sísifo: silhueta com um fio de luz do lado do cume */}
        <g ref={manRef}>
          <g className={s.rimLight} transform="translate(1.6 -1.6)">
            <Figure />
          </g>
          <g className={s.body}>
            <Figure />
          </g>
        </g>

        {/* A pedra: a luz fica parada (vem do cume); só a superfície gira */}
        <g ref={stoneRef}>
          <circle cx="2.2" cy="-2.2" r={FIG_R} className={s.stoneRim} />
          <circle r={FIG_R} fill={`url(#${id}-stone)`} />
          <g ref={spinRef} className={s.stoneMarks}>
            <path d="M -30 -18 q 10 -8 22 -4" />
            <path d="M 8 22 q 12 4 20 -6" />
            <path d="M -14 30 q -10 -4 -14 -14" />
            <path d="M 20 -30 q 8 6 6 16" />
            <circle cx="-6" cy="4" r="3" />
            <circle cx="26" cy="8" r="2" />
          </g>
        </g>
      </svg>
    </div>
  )
}

/**
 * Corpo inclinado contra a pedra; ponto de apoio da pedra em (0, 0), pedra em (0, -56).
 * Membros em segmentos de espessuras diferentes (coxa > panturrilha, braço > antebraço);
 * os do lado de lá (`far`) ficam mais apagados, para dar profundidade.
 */
function Figure() {
  return (
    <>
      {/* lado de lá: perna de trás, esticada, e o braço de baixo */}
      <g data-far="">
        <path d="M -121 -62 L -146 -34" strokeWidth="14" />
        <path d="M -146 -34 L -170 -6" strokeWidth="10" />
        <path d="M -177 -2 L -162 -1" strokeWidth="6" />
        <path d="M -86 -96 L -71 -79" strokeWidth="9" />
        <path d="M -71 -79 L -53 -78" strokeWidth="7.5" />
        <circle cx="-52" cy="-78" r="4.2" />
      </g>
      {/* perna da frente, dobrada sob o corpo */}
      <path d="M -117 -60 L -92 -50" strokeWidth="15" />
      <path d="M -92 -50 L -100 -8" strokeWidth="10.5" />
      <path d="M -104 -3 L -87 -1" strokeWidth="6.5" />
      {/* tronco: quadril estreito, peito mais largo */}
      <path d="M -123 -64 L -96 -88" strokeWidth="20" />
      <path d="M -108 -78 L -84 -99" strokeWidth="25" />
      {/* pescoço e cabeça baixa, quase encostada na pedra */}
      <path d="M -84 -102 L -72 -108" strokeWidth="8" />
      <circle cx="-64" cy="-111" r="10.5" />
      {/* braço de cima, apoiado na pedra */}
      <path d="M -82 -102 L -66 -97" strokeWidth="9" />
      <path d="M -66 -97 L -50 -92" strokeWidth="7.5" />
      <circle cx="-49" cy="-92" r="4.2" />
    </>
  )
}
