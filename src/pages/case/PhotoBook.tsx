import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import type { Project } from '@/content'
import { Picture } from '@/components/Picture'
import { Arrow } from '@/components/Icons'
import s from './PhotoBook.module.css'

/*
  Book de fotos: as fotos passam de um lado para o outro, uma em destaque e a
  próxima aparecendo na borda. Avança sozinho (pausa com o botão, com o mouse em
  cima, com foco dentro, fora da tela ou com movimento reduzido); setas, teclado
  e arrastar no celular.
*/

const HOLD = 5200
const pad = (n: number) => String(n).padStart(2, '0')

export function PhotoBook({ project, photos }: { project: Project; photos: { src: string; caption?: string }[] }) {
  const reduce = useReducedMotion()
  // pos vai de 0 a n: a posição n é uma cópia da primeira foto, para a passagem dar a volta sem pulo
  const [pos, setPos] = useState(0)
  const [snap, setSnap] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hold, setHold] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; id: number } | null>(null)
  const n = photos.length
  const index = pos % n
  const loop = n > 1
  const auto = !reduce && !paused && !hold && visible && n > 1

  // sem animação (movimento reduzido) não há fim de transição: troca direto
  const next = () => setPos((p) => (reduce || !loop ? (p + 1) % n : p >= n ? 1 : p >= n - 1 ? n : p + 1))
  const prev = () => {
    if (reduce || !loop) {
      setPos((p) => (p - 1 + n) % n)
    } else if (pos === 0) {
      // salta sem animação para a cópia e volta uma
      setSnap(true)
      setPos(n)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setSnap(false)
        setPos(n - 1)
      }))
    } else setPos((p) => p - 1)
  }
  const go = (i: number) => setPos(i)

  // chegou na cópia da primeira: troca pela original sem animação
  const onTrackEnd = () => {
    if (pos === n) {
      setSnap(true)
      setPos(0)
      requestAnimationFrame(() => requestAnimationFrame(() => setSnap(false)))
    }
  }

  // só anda enquanto está na tela
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!auto) return
    const id = window.setTimeout(next, HOLD)
    return () => window.clearTimeout(id)
  }, [auto, pos, n])

  if (n === 0) return null

  const onDown = (e: PointerEvent) => {
    drag.current = { x: e.clientX, id: e.pointerId }
  }
  const onUp = (e: PointerEvent) => {
    const d = drag.current
    drag.current = null
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
  }

  const current = photos[index]

  return (
    <div
      ref={ref}
      className={s.book}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Fotos do projeto"
      style={{ '--i': pos, '--hold': `${HOLD}ms` } as CSSProperties}
      data-snap={snap ? '' : undefined}
      data-auto={auto ? '' : undefined}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next()
        if (e.key === 'ArrowLeft') prev()
      }}
    >
      <div className={s.viewport} onPointerDown={onDown} onPointerUp={onUp} data-cursor={n > 1 ? 'drag' : undefined}>
        <ul className={s.track} onTransitionEnd={(e) => e.target === e.currentTarget && onTrackEnd()}>
          {(loop ? [...photos, photos[0]] : photos).map((p, i) => (
            <li
              key={`${p.src}-${i}`}
              className={s.slide}
              data-on={i === pos ? '' : undefined}
              role="group"
              aria-roledescription="foto"
              aria-label={`${(i % n) + 1} de ${n}`}
              aria-hidden={i === pos ? undefined : true}
              onClick={() => i !== pos && (i === n ? next() : go(i))}
            >
              <div className={s.frame}>
                <Picture
                  project={project}
                  media={{ src: p.src, alt: p.caption ?? `Foto ${i + 1} do projeto` }}
                  sizes="(max-width: 760px) 88vw, 72vw"
                  priority={i === 0}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={s.bar}>
        <p className={s.count} aria-live={auto ? 'off' : 'polite'}>
          <span className={s.countNow}>{pad(index + 1)}</span>
          <span className={s.countTotal}>/ {pad(n)}</span>
          {current.caption && <span className={s.caption}>{current.caption}</span>}
        </p>

        {n > 1 && (
          <div className={s.controls}>
            <span className={s.progress} aria-hidden="true">
              <span key={`${index}-${auto}`} className={s.progressFill} />
            </span>
            {!reduce && (
              <button
                type="button"
                className={s.btn}
                onClick={() => setPaused((v) => !v)}
                aria-label={paused ? 'Retomar a passagem das fotos' : 'Pausar a passagem das fotos'}
                aria-pressed={paused}
              >
                {paused ? (
                  <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
                    <path d="M3 1.5v9l7-4.5z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
                    <path d="M3 1.5h2v9H3zm4 0h2v9H7z" fill="currentColor" />
                  </svg>
                )}
              </button>
            )}
            <button type="button" className={s.btn} onClick={prev} aria-label="Foto anterior">
              <Arrow size={14} direction="left" />
            </button>
            <button type="button" className={s.btn} onClick={next} aria-label="Próxima foto">
              <Arrow size={14} direction="right" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
