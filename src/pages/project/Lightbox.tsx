import { AnimatePresence, m } from 'motion/react'
import { useEffect, useId, useRef, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import type { MediaRef, Project } from '@/content'
import { Arrow } from '@/components/Icons'
import { Picture } from '@/components/Picture'
import { ease } from '@/lib/motion'
import { useScrollLock } from '@/lib/smooth-scroll'
import { figLabel, mediaRatio, pad } from './figures'
import s from './Lightbox.module.css'

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

/**
 * Visualizador em tela cheia. Esc fecha, ← → navegam, deslizar no toque troca
 * de imagem. O foco fica preso aqui e volta para a imagem de origem ao fechar.
 */
export function Lightbox({
  project,
  items,
  index,
  onIndex,
  onClose,
}: {
  project: Project
  items: MediaRef[]
  index: number | null
  onIndex: (index: number) => void
  onClose: () => void
}) {
  const open = index !== null
  const total = items.length
  const titleId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dir = useRef(1)
  const swipe = useRef<{ x: number; moved: boolean } | null>(null)

  useScrollLock(open)

  // foco: entra no botão fechar; ao sair, volta ao gatilho. O resto da página fica inerte.
  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const page = document.getElementById('conteudo')
    page?.setAttribute('inert', '')
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      page?.removeAttribute('inert')
      trigger?.focus({ preventScroll: true })
    }
  }, [open])

  const go = (step: number) => {
    if (index === null || total < 2) return
    dir.current = step
    onIndex((index + step + total) % total)
  }

  // teclado na fase de captura: chega antes do "Esc volta" da página
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        if (total < 2) return
        const step = e.key === 'ArrowRight' ? 1 : -1
        dir.current = step
        onIndex((index + step + total) % total)
      } else if (e.key === 'Tab' && rootRef.current) {
        const nodes = [...rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
        if (nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        const active = document.activeElement
        if (e.shiftKey && (active === first || !rootRef.current.contains(active))) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && (active === last || !rootRef.current.contains(active))) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [index, total, onClose, onIndex])

  const media = index !== null ? items[index] : undefined
  const ratio = media ? mediaRatio(project, media) : 1.6
  const style = { '--accent': project.accent ?? 'var(--signal)', '--ar': ratio } as CSSProperties

  return createPortal(
    <AnimatePresence>
      {open && media && index !== null && (
        <m.div
          key="viewer"
          ref={rootRef}
          className={s.root}
          style={style}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: ease.out }}
        >
          <div className={s.bar}>
            <p id={titleId} className={`t-label ${s.title}`}>
              {figLabel(index, media)}
            </p>
            <span className={`t-label t-dim ${s.count}`} aria-hidden="true">
              {pad(index + 1)} / {pad(total)}
            </span>
            <button ref={closeRef} type="button" className={s.close} onClick={onClose} aria-label="Fechar">
              <span className="t-label">Fechar</span>
              <span className={s.x} aria-hidden="true" />
            </button>
          </div>

          <div
            className={s.stage}
            onClick={(e) => {
              if (swipe.current?.moved) return
              if (e.target === e.currentTarget) onClose()
            }}
            onPointerDown={(e) => {
              swipe.current = e.pointerType === 'mouse' ? null : { x: e.clientX, moved: false }
            }}
            onPointerUp={(e) => {
              const start = swipe.current
              if (!start) return
              const dx = e.clientX - start.x
              if (Math.abs(dx) > 48) {
                start.moved = true
                go(dx < 0 ? 1 : -1)
              }
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <m.div
                key={index}
                className={s.box}
                initial={{ opacity: 0, x: dir.current * 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir.current * -48 }}
                transition={{ duration: 0.55, ease: ease.out }}
              >
                <Picture
                  project={project}
                  media={media}
                  sizes={media.frame === 'mobile' ? '(min-width: 641px) 40vw, 90vw' : '100vw'}
                  className={s.pic}
                />
              </m.div>
            </AnimatePresence>
          </div>

          <div className={s.foot}>
            {total > 1 && (
              <button type="button" className={s.nav} onClick={() => go(-1)} aria-label="Imagem anterior">
                <Arrow direction="left" size={16} />
                <span className="t-label">Anterior</span>
              </button>
            )}
            <p className={s.alt} aria-hidden="true">
              {media.alt}
            </p>
            {total > 1 && (
              <button type="button" className={`${s.nav} ${s.next}`} onClick={() => go(1)} aria-label="Próxima imagem">
                <span className="t-label">Próxima</span>
                <Arrow direction="right" size={16} />
              </button>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
