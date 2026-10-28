import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { m, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { Arrow } from '@/components/Icons'
import { useFinePointer } from '@/lib/hooks'
import styles from './Cursor.module.css'

/*
  Cursor "visor de câmera" (contrato em docs/DIRECAO-DE-ARTE.md §7).
  Ponto instantâneo + quatro cantos que seguem com mola. Sobre links e botões pequenos
  o visor "trava o foco": os cantos enquadram o alvo, com um leve puxão magnético para o ponteiro.
  Lê data-cursor por delegação no document; a posição anda por motion values (sem re-render por movimento).
*/

type Mode = 'default' | 'link' | 'view' | 'drag' | 'hide'
interface CursorState {
  mode: Mode
  /** Último rótulo de quadro (mantido durante a saída para não "piscar" vazio). */
  chip: 'view' | 'drag'
  label: string
}
interface Resolved {
  mode: Mode
  el: Element | null
  chip?: CursorState['chip']
  label?: string
}

const TARGETS = '[data-cursor], a[href], button, [role="button"], label[for], summary, select'
const SPRING = { stiffness: 520, damping: 42, mass: 0.55 }
const FRAME = { default: 30, link: 46 }
/** Trava no alvo: só em alvos até este tamanho; folga em volta; fração do puxão para o ponteiro. */
const LOCK = { maxW: 360, maxH: 120, padX: 14, padY: 10, pull: 0.12 }

function resolve(target: EventTarget | null): Resolved {
  const el = target instanceof Element ? target.closest(TARGETS) : null
  if (!el) return { mode: 'default', el: null }
  const kind = el.getAttribute('data-cursor')
  const label = el.getAttribute('data-cursor-label')
  if (kind === 'view') return { mode: 'view', el, chip: 'view', label: label || 'Abrir' }
  if (kind === 'drag') return { mode: 'drag', el, chip: 'drag', label: label || 'Arraste' }
  if (kind === 'hide') return { mode: 'hide', el }
  if (kind === 'link') return { mode: 'link', el }
  if (el.matches(':disabled, [aria-disabled="true"]')) return { mode: 'default', el: null }
  if (kind) return { mode: 'default', el: null }
  return { mode: 'link', el }
}

export function Cursor() {
  const fine = useFinePointer()

  useEffect(() => {
    if (!fine) return
    const root = document.documentElement
    root.classList.add('has-custom-cursor')
    return () => root.classList.remove('has-custom-cursor')
  }, [fine])

  return fine ? <Viewfinder /> : null
}

function Viewfinder() {
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  // Ponteiro cru (ponto) e alvo do quadro (ponteiro, ou o centro do link travado).
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const tx = useMotionValue(-200)
  const ty = useMotionValue(-200)
  const sx = useSpring(tx, SPRING)
  const sy = useSpring(ty, SPRING)
  const fx = reduce ? tx : sx
  const fy = reduce ? ty : sy

  const [state, setState] = useState<CursorState>({ mode: 'default', chip: 'view', label: 'Abrir' })
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [locked, setLocked] = useState(false)
  const pos = useRef({ x: -200, y: -200, seen: false, shown: false })
  const lockEl = useRef<Element | null>(null)
  const lockSize = useRef('')
  const modeRef = useRef<Mode>('default')
  const frameRef = useRef<HTMLDivElement>(null)
  const chipRef = useRef<HTMLSpanElement>(null)
  const applyRef = useRef<(target: EventTarget | null) => void>(() => {})

  useEffect(() => {
    const frame = () => frameRef.current

    /** Posiciona o alvo do quadro: travado no link (se couber) ou no ponteiro. */
    const place = () => {
      const { x: px, y: py } = pos.current
      const el = lockEl.current
      if (el) {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && r.width <= LOCK.maxW && r.height <= LOCK.maxH) {
          const cx = r.left + r.width / 2
          const cy = r.top + r.height / 2
          tx.set(cx + (px - cx) * LOCK.pull)
          ty.set(cy + (py - cy) * LOCK.pull)
          const size = `${Math.round(r.width + LOCK.padX)}x${Math.round(r.height + LOCK.padY)}`
          if (size !== lockSize.current) {
            lockSize.current = size
            frame()?.style.setProperty('--w', `${Math.round(r.width + LOCK.padX)}px`)
            frame()?.style.setProperty('--h', `${Math.round(r.height + LOCK.padY)}px`)
            setLocked(true)
          }
          return
        }
      }
      tx.set(px)
      ty.set(py)
      if (lockSize.current) {
        lockSize.current = ''
        // Volta ao tamanho do estado atual (o efeito de layout não roda se o modo não mudou).
        const s = modeRef.current === 'link' ? FRAME.link : FRAME.default
        frame()?.style.setProperty('--w', `${s}px`)
        frame()?.style.setProperty('--h', `${s}px`)
        setLocked(false)
      }
    }

    const apply = (target: EventTarget | null) => {
      const next = resolve(target)
      lockEl.current = next.mode === 'link' ? next.el : null
      setState((prev) => {
        const merged: CursorState = {
          mode: next.mode,
          chip: next.chip ?? prev.chip,
          label: next.label ?? prev.label,
        }
        return merged.mode === prev.mode && merged.label === prev.label && merged.chip === prev.chip ? prev : merged
      })
      place()
    }
    applyRef.current = apply

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      x.set(e.clientX)
      y.set(e.clientY)
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      if (!pos.current.shown) {
        pos.current.shown = true
        if (!pos.current.seen) {
          pos.current.seen = true
          apply(e.target)
        } else place()
        // (Re)aparição: os cantos nascem no lugar, sem voar de onde o ponteiro saiu.
        sx.jump(tx.get())
        sy.jump(ty.get())
        setVisible(true)
        return
      }
      place()
    }
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') apply(e.target)
    }
    const hide = () => {
      pos.current.shown = false
      setVisible(false)
    }
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) hide()
    }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') setPressed(true)
    }
    const onUp = () => setPressed(false)
    const onBlur = () => {
      hide()
      setPressed(false)
    }

    // Ao rolar, o alvo sob o ponteiro muda (ou anda) sem pointerover: reconsulta por quadro.
    let raf = 0
    const onScroll = () => {
      if (raf || !pos.current.seen) return
      raf = requestAnimationFrame(() => {
        raf = 0
        apply(document.elementFromPoint(pos.current.x, pos.current.y))
      })
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut)
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('blur', onBlur)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('mouseout', onOut)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [x, y, tx, ty, sx, sy])

  // Troca de rota: o alvo sob o ponteiro pode ter sumido.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!pos.current.seen) return
      applyRef.current(document.elementFromPoint(pos.current.x, pos.current.y))
    }, 1200)
    return () => window.clearTimeout(id)
  }, [pathname])

  // Tamanho do quadro por estado (CSS vars → transições de transform nos cantos).
  const { mode, chip, label } = state
  useLayoutEffect(() => {
    modeRef.current = mode
    const frame = frameRef.current
    if (!frame || lockSize.current) return
    let w: number = FRAME.default
    let h: number = FRAME.default
    if (mode === 'link') w = h = FRAME.link
    if ((mode === 'view' || mode === 'drag') && chipRef.current) {
      w = chipRef.current.offsetWidth + 26
      h = chipRef.current.offsetHeight + 26
    }
    frame.style.setProperty('--w', `${w}px`)
    frame.style.setProperty('--h', `${h}px`)
  }, [mode, chip, label])

  return (
    <>
      <div
        className={styles.blend}
        data-mode={mode}
        data-locked={locked && mode === 'link'}
        data-visible={visible}
        data-pressed={pressed}
        aria-hidden="true"
      >
        <m.div className={styles.anchor} style={{ x: fx, y: fy }}>
          <div ref={frameRef} className={styles.frame}>
            <span className={styles.corner} data-c="tl" />
            <span className={styles.corner} data-c="tr" />
            <span className={styles.corner} data-c="bl" />
            <span className={styles.corner} data-c="br" />
          </div>
        </m.div>
        <m.div className={styles.anchor} style={{ x, y }}>
          <span className={styles.dot} />
        </m.div>
      </div>

      <div className={styles.solid} data-mode={mode} data-visible={visible} data-pressed={pressed} aria-hidden="true">
        <m.div className={styles.anchor} style={{ x: fx, y: fy }}>
          <span ref={chipRef} className={styles.chip} data-chip={chip}>
            {chip === 'drag' ? (
              <Arrow direction="left" size={12} className={styles.arrowL} />
            ) : (
              <span className={styles.rec} />
            )}
            <span className={styles.chipLabel}>{label}</span>
            {chip === 'drag' && <Arrow direction="right" size={12} className={styles.arrowR} />}
          </span>
        </m.div>
      </div>
    </>
  )
}
