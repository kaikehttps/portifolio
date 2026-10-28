import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react'
import { sections } from '@/content'
import { Arrow } from '@/components/Icons'
import { bp, useMediaQuery } from '@/lib/hooks'
import { useIntroDone } from '@/lib/intro'
import { ease } from '@/lib/motion'
import { useScrollTo } from '@/lib/smooth-scroll'
import { focusSection } from './focus'
import { MobileMenu } from './MobileMenu'
import { useStableScrollLock } from './scrollLock'
import { Wordmark } from './Wordmark'
import { replaceHash, useActiveSection, useSectionLink } from './sectionNav'
import styles from './Nav.module.css'

const MENU_ID = 'menu-principal'
const TOP = '__top'
const CONTACT = 'contato'

/*
  Barra discreta: links em texto simples à esquerda, "Contatar" à direita.
  Até 1024px ficam só a assinatura e o botão "Menu".
*/
export function Nav() {
  const { pathname } = useLocation()
  const active = useActiveSection()
  const introDone = useIntroDone()
  const isDesktop = useMediaQuery(bp.desktop)
  const scrollTo = useScrollTo()

  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const barRef = useRef<HTMLElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const pending = useRef<string | null>(null)
  const holdUntil = useRef(0)

  // Fecha o menu ao trocar de rota ou ao virar desktop.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }
  if (open && isDesktop) setOpen(false)

  useStableScrollLock(open)

  // Rolagem pedida pelo menu: só depois que ele fecha (a trava da página já foi solta).
  useEffect(() => {
    if (open || !pending.current) return
    const id = pending.current
    pending.current = null
    holdUntil.current = performance.now() + 1800
    if (id === TOP) {
      scrollTo(0)
      replaceHash(null)
      focusSection(null)
    } else {
      scrollTo(id)
      replaceHash(id)
      focusSection(id)
    }
  }, [open, scrollTo])

  const defer = useCallback((id: string) => {
    pending.current = id
    setOpen(false)
  }, [])
  const sectionLink = useSectionLink()
  const menuLink = useSectionLink(defer)

  // Some ao rolar rápido para baixo, volta ao subir.
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    const dy = y - (scrollY.getPrevious() ?? y)
    setScrolled(y > 12)
    if (y < 140) setHidden(false)
    else if (dy > 6 && performance.now() > holdUntil.current && !barRef.current?.contains(document.activeElement))
      setHidden(true)
    else if (dy < -4) setHidden(false)
  })

  const onDesktopLink = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    holdUntil.current = performance.now() + 1800
    sectionLink.onClick(e, id)
  }

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setOpen(false)
    if (restoreFocus) requestAnimationFrame(() => menuBtnRef.current?.focus({ preventScroll: true }))
  }, [])

  const links = sections.filter((s) => s.id !== CONTACT)
  const contact = sections.find((s) => s.id === CONTACT)

  return (
    <>
      <header
        ref={barRef}
        className={styles.bar}
        data-hidden={hidden && !open}
        data-scrolled={scrolled}
        onFocus={() => setHidden(false)}
      >
        <span className={styles.scrim} aria-hidden="true" />
        <m.div
          className={styles.inner}
          initial={{ opacity: 0, y: -14 }}
          animate={introDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: ease.out, delay: 0.3 }}
        >
          <nav aria-label="Seções" className={styles.desktop}>
            <ul className={styles.list}>
              {links.map((s) => (
                <li key={s.id}>
                  <Link
                    to={{ pathname: '/', hash: `#${s.id}` }}
                    className={styles.link}
                    data-active={active === s.id}
                    aria-current={active === s.id ? 'location' : undefined}
                    onClick={(e) => onDesktopLink(e, s.id)}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.center}>
            <Wordmark />
          </div>

          <div className={styles.end}>
            {contact && (
              <Link
                to={{ pathname: '/', hash: `#${contact.id}` }}
                className={styles.contact}
                onClick={(e) => onDesktopLink(e, contact.id)}
              >
                Contatar
                <span className={styles.contactIcon} aria-hidden="true">
                  <Arrow size={14} direction="down" />
                </span>
              </Link>
            )}
            <button
              ref={menuBtnRef}
              type="button"
              className={styles.menuBtn}
              aria-expanded={open}
              aria-controls={MENU_ID}
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
            >
              <span className={styles.menuIcon} aria-hidden="true">
                <span />
                <span />
              </span>
              Menu
            </button>
          </div>
        </m.div>
      </header>

      <AnimatePresence>
        {open && (
          <MobileMenu
            id={MENU_ID}
            active={active}
            onClose={closeMenu}
            onLink={menuLink.onClick}
            onTop={() => defer(TOP)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
