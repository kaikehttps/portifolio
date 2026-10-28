import type { ReactNode } from 'react'
import type { ProjectLinkKind } from '@/content'
import { Arrow, LinkIcon } from './Icons'
import styles from './Cta.module.css'

/**
 * Botão-link com canto chanfrado (corte industrial).
 * Externo por padrão; para rotas internas use o <Link> do router com `className={ctaClass}`.
 */
export function Cta({
  href,
  children,
  kind,
  tone = 'line',
  external = true,
  className,
}: {
  href: string
  children: ReactNode
  /** Ícone de App Store / Google Play etc. */
  kind?: ProjectLinkKind
  tone?: 'line' | 'solid'
  external?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      className={[styles.cta, styles[tone], className].filter(Boolean).join(' ')}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-cursor="link"
    >
      {kind && kind !== 'site' && <LinkIcon kind={kind} size={15} />}
      <span className={styles.label}>{children}</span>
      <Arrow size={14} className={styles.arrow} />
      {external && <span className="visually-hidden"> (abre em nova aba)</span>}
    </a>
  )
}

export const ctaClass = styles.cta
/** Versão cheia (cor do projeto) para links internos com <Link>. */
export const ctaSolidClass = [styles.cta, styles.solid].join(' ')

/** Etiqueta mono pequena (tecnologias, papéis). */
export function Tag({ children, tone = 'line' }: { children: ReactNode; tone?: 'line' | 'solid' | 'ghost' }) {
  return <span className={[styles.tag, styles[`tag-${tone}`]].join(' ')}>{children}</span>
}
