import type { CSSProperties } from 'react'
import styles from './CropMarks.module.css'

/**
 * Marcas de corte nos quatro cantos do elemento pai (que precisa de position: relative).
 * `inset` negativo põe as marcas por fora da caixa, como numa prova de impressão.
 */
export function CropMarks({
  size = 14,
  inset = -8,
  color,
  className,
}: {
  size?: number
  inset?: number
  color?: string
  className?: string
}) {
  const style = { '--cm-size': `${size}px`, '--cm-inset': `${inset}px`, '--cm-color': color } as CSSProperties
  return (
    <span className={[styles.marks, className].filter(Boolean).join(' ')} style={style} aria-hidden="true">
      <span className={styles.tl} />
      <span className={styles.tr} />
      <span className={styles.bl} />
      <span className={styles.br} />
    </span>
  )
}
