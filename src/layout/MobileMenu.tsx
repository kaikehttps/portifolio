import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react'
import { Link } from 'react-router'
import { m, useReducedMotion } from 'motion/react'
import { profile, sections } from '@/content'
import { Arrow, SocialIcon } from '@/components/Icons'
import { ease } from '@/lib/motion'
import { Wordmark } from './Wordmark'
import styles from './MobileMenu.module.css'

const initials = `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`
const year = String(new Date().getFullYear()).slice(-2)

/**
 * Menu em tela cheia (≤1024px): cortina que desce, rolos em display gigante,
 * redes no rodapé. Diálogo modal com foco preso; Esc fecha.
 */
export function MobileMenu({
  id,
  active,
  onClose,
  onLink,
  onTop,
}: {
  id: string
  active: string | null
  onClose: (restoreFocus: boolean) => void
  onLink: (e: MouseEvent<HTMLAnchorElement>, id: string) => void
  onTop: () => void
}) {
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const socials = profile.socials.filter((s) => s.url.trim() !== '')

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
    // Captura: com o menu aberto, o Esc é dele (a página não deve reagir junto).
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      onClose(true)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  // Foco preso dentro do menu
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const items = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    if (!items || items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const curtain = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { clipPath: 'inset(0% 0% 100% 0%)' },
        animate: { clipPath: 'inset(0% 0% 0% 0%)' },
        exit: { clipPath: 'inset(0% 0% 100% 0%)' },
      }

  return (
    <m.div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className={styles.menu}
      data-lenis-prevent
      onKeyDown={onKeyDown}
      {...curtain}
      transition={{ duration: reduce ? 0.2 : 0.75, ease: ease.inOut }}
    >
      <div className={styles.head}>
        <Wordmark onTop={onTop} />
        <button ref={closeRef} type="button" className={styles.close} onClick={() => onClose(true)}>
          Fechar
          <span className={styles.x} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.kicker} aria-hidden="true">
        <span className={styles.kickerDot} />
        <span>Índice</span>
        <span className={styles.rule} />
        <span className={styles.count}>{String(sections.length).padStart(2, '0')} seções</span>
      </div>

      {/* Rolo atual em contorno gigante: orientação + camada gráfica */}
      <div className={styles.stage} aria-hidden="true">
        <m.span
          className={styles.reelNo}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: ease.out, delay: 0.25 }}
        >
          <span className={styles.no}>Nº</span>
          {sections.find((s) => s.id === active)?.index ?? '00'}
        </m.span>
      </div>

      <nav aria-label="Seções" className={styles.nav}>
        <ol className={styles.list}>
          {sections.map((s, i) => {
            const current = active === s.id
            return (
              <li key={s.id} className={styles.item}>
                <Link
                  to={{ pathname: '/', hash: `#${s.id}` }}
                  className={styles.row}
                  data-active={current}
                  aria-current={current ? 'location' : undefined}
                  onClick={(e) => onLink(e, s.id)}
                >
                  <span className={styles.mask}>
                    <m.span
                      className={styles.label}
                      initial={reduce ? false : { y: '108%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.95, ease: ease.out, delay: 0.32 + i * 0.065 }}
                    >
                      {s.label}
                    </m.span>
                  </span>
                  <m.span
                    className={styles.num}
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.55 + i * 0.065 }}
                  >
                    {current && <span className={styles.sq} />}
                    {s.index}
                  </m.span>
                </Link>
              </li>
            )
          })}
        </ol>
      </nav>

      <m.div
        className={styles.foot}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.75 }}
      >
        {socials.length > 0 && (
          <ul className={styles.socials}>
            {socials.map((s) => {
              const external = !s.url.startsWith('mailto:')
              return (
                <li key={s.network + s.url}>
                  <a
                    href={s.url}
                    className={styles.social}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <SocialIcon network={s.network} size={15} />
                    <span>{s.label}</span>
                    <Arrow size={12} className={styles.socialArrow} />
                    {external && <span className="visually-hidden"> (abre em nova aba)</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        )}
        <p className={styles.sign} aria-hidden="true">
          <span>
            {initials}/{year}
          </span>
          <span className={styles.signRule} />
          <span>{profile.role}</span>
        </p>
      </m.div>
    </m.div>
  )
}
