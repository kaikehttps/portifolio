import type { MouseEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { profile } from '@/content'
import { Star } from '@/components/Icons'
import { useScrollTo } from '@/lib/smooth-scroll'
import { focusSection } from './focus'
import { hasSections, replaceHash } from './sectionNav'
import styles from './Wordmark.module.css'

/**
 * Assinatura "✦ KAIKE Alves": display comprimido em colisão com a serifa itálica.
 * Na home, volta ao topo (ou chama `onTop`, quando quem usa precisa adiar a rolagem).
 */
export function Wordmark({ onTop }: { onTop?: () => void }) {
  const { pathname } = useLocation()
  const scrollTo = useScrollTo()

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!hasSections(pathname) || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    if (onTop) return onTop()
    scrollTo(0)
    replaceHash(null)
    focusSection(null)
  }

  return (
    <Link to="/" className={styles.mark} onClick={onClick} aria-label={`${profile.name} — início`}>
      <Star size={11} className={styles.star} />
      <span className={styles.first} aria-hidden="true">
        {profile.firstName}
      </span>
      <span className={styles.last} aria-hidden="true">
        {profile.lastName}
      </span>
    </Link>
  )
}
