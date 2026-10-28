import type { CSSProperties, ReactNode } from 'react'
import styles from './Frames.module.css'

/**
 * Moldura de celular minimalista (fio osso, tela 9:19.5).
 * Coloque um <Picture layout="fill" … /> dentro.
 */
export function PhoneFrame({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={[styles.phone, className].filter(Boolean).join(' ')} style={style}>
      <div className={styles.screen}>{children}</div>
      <span className={styles.island} aria-hidden="true" />
    </div>
  )
}

/**
 * Moldura de navegador industrial: barra fina com três quadrados e o endereço em mono.
 * `url` só é exibida (texto), não é link.
 */
export function BrowserFrame({
  children,
  url,
  className,
  style,
  ratio = '16 / 10',
}: {
  children: ReactNode
  url?: string
  className?: string
  style?: CSSProperties
  /** Proporção da área da página (sem a barra). */
  ratio?: string
}) {
  const host = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : undefined
  return (
    <div className={[styles.browser, className].filter(Boolean).join(' ')} style={style}>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        {host && <span className={styles.url}>{host}</span>}
      </div>
      <div className={styles.viewport} style={{ aspectRatio: ratio }}>
        {children}
      </div>
    </div>
  )
}
