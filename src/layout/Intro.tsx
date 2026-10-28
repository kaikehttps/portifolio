import { useCallback, useEffect, useRef, useState } from 'react'
import { m } from 'motion/react'
import { profile } from '@/content'
import { Star } from '@/components/Icons'
import { markIntroDone } from '@/lib/intro'
import { ease } from '@/lib/motion'
import { timecode } from '@/lib/timecode'
import { useStableScrollLock } from './scrollLock'
import styles from './Intro.module.css'

/*
  Abertura (≤ 1,6 s): tela preta com contador 000→100 preso ao carregamento
  das fontes; em 100 o obturador se parte ao meio e revela a página.
  Só na primeira visita à "/" na sessão. ?intro=1 força (laboratório).
*/

const KEY = 'ka:intro'
/** Contagem mínima e teto antes de abrir o obturador (ms). */
const MIN = 720
const CAP = 1000
/** Duração da abertura (s). CAP + SPLIT ≤ 1,6 s. */
const SPLIT = 0.6

const initials = `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`
const year = String(new Date().getFullYear()).slice(-2)
/** O que o contador realmente espera: as três famílias do site. */
const MANIFEST = ['Archivo', 'Instrument Serif', 'IBM Plex Mono']

/** Só em desenvolvimento: ?intro=hold congela a abertura em 87 (para inspecionar a composição). */
const HOLD =
  import.meta.env.DEV && typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('intro') === 'hold'
    : false

function shouldPlay(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const forced = new URLSearchParams(window.location.search).get('intro')
  if (forced === '1' || HOLD) return true
  if (window.location.pathname !== '/') return false
  try {
    return sessionStorage.getItem(KEY) !== 'seen'
  } catch {
    return true
  }
}

export function Intro() {
  const [playing, setPlaying] = useState(shouldPlay)

  // Em todos os casos de pulo, libera o hero imediatamente.
  useEffect(() => {
    if (!playing) markIntroDone()
  }, [playing])

  const done = useCallback(() => setPlaying(false), [])
  return playing ? <Reel onDone={done} /> : null
}

function Reel({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const countRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const tcRef = useRef<HTMLSpanElement>(null)

  useStableScrollLock(true)

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, 'seen')
    } catch {
      /* sem armazenamento: toca de novo na próxima visita */
    }

    let fontsReady = !document.fonts
    let finished = false
    let alive = true
    document.fonts?.ready.then(() => {
      fontsReady = true
      if (alive && !HOLD) setLoaded(true)
    })

    const paint = (p: number, ms: number) => {
      if (countRef.current) countRef.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      if (tcRef.current) tcRef.current.textContent = timecode(ms / 1000)
    }

    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(raf)
      paint(1, performance.now() - start)
      markIntroDone()
      setOpen(true)
    }

    const start = performance.now()
    if (HOLD) {
      paint(0.87, 1234)
      return
    }
    let raf = requestAnimationFrame(function tick(now) {
      const t = now - start
      // Sobe até 92 sozinho; os últimos números esperam as fontes.
      const linear = Math.min(t / MIN, 1)
      const eased = 1 - Math.pow(1 - linear, 3)
      paint(Math.min(eased, fontsReady ? 1 : 0.92), t)
      if ((fontsReady && t >= MIN) || t >= CAP) return finish()
      raf = requestAnimationFrame(tick)
    })

    // Clique ou qualquer tecla pula.
    window.addEventListener('pointerdown', finish)
    window.addEventListener('keydown', finish)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointerdown', finish)
      window.removeEventListener('keydown', finish)
    }
  }, [])

  // Segurança: nunca prende a página se a animação não reportar o fim.
  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(onDone, SPLIT * 1000 + 400)
    return () => window.clearTimeout(id)
  }, [open, onDone])

  const split = { duration: SPLIT, ease: ease.inOut }

  return (
    <div className={styles.intro} aria-hidden="true" data-open={open}>
      <m.div className={styles.top} initial={false} animate={{ y: open ? '-101%' : '0%' }} transition={split}>
        <div className={styles.row}>
          <span className={styles.brand}>
            <Star size={10} className={styles.star} />
            {initials}/{year} — Portfólio
          </span>
          <span className={styles.rec}>
            <span className={styles.recDot} />
            Rec <span ref={tcRef} className={styles.tc}>{timecode(0)}</span>
          </span>
        </div>
        <div className={styles.counterWrap}>
          <span ref={countRef} className={styles.counter}>
            000
          </span>
          <span className={styles.pct}>/100</span>
        </div>
      </m.div>

      <m.div
        className={styles.bottom}
        initial={false}
        animate={{ y: open ? '101%' : '0%' }}
        transition={split}
        onAnimationComplete={() => open && onDone()}
      >
        <span className={styles.seam}>
          <span ref={barRef} className={styles.bar} />
        </span>
        <div className={styles.row}>
          <span>Rolo 00 — Abertura</span>
          <span className={styles.plus}>+</span>
        </div>
        <ul className={styles.manifest}>
          {MANIFEST.map((font) => (
            <li key={font}>
              <span>{font}</span>
              <span className={styles.leader} />
              <span className={loaded ? styles.ok : styles.wait}>{loaded ? 'OK' : '···'}</span>
            </li>
          ))}
        </ul>
        <div className={`${styles.row} ${styles.foot}`}>
          <span className={styles.name}>{profile.name}</span>
          <span className={styles.dim}>{profile.role}</span>
        </div>
      </m.div>
    </div>
  )
}
