import type { CSSProperties } from 'react'
import type { SectionInfo } from '@/content'
import { Arrow } from '@/components/Icons'
import { useScrollTo } from '@/lib/smooth-scroll'
import styles from './Hero.module.css'

/** Faixa inferior: apresentação curta, frentes de trabalho e o convite para descer. */
export function HeroBand({
  intro,
  disciplines,
  next,
}: {
  intro: string
  disciplines: string[]
  next?: SectionInfo
}) {
  const scrollTo = useScrollTo()
  return (
    <div className={styles.band}>
      <div className={styles.synopsis}>
        <p className={styles.intro}>{intro}</p>
      </div>

      {disciplines.length > 0 && (
        <ul className={styles.genres} aria-label="Frentes de trabalho">
          {disciplines.map((d, i) => (
            <li key={d} className={styles.genre} style={{ '--g': i } as CSSProperties}>
              {d}
            </li>
          ))}
        </ul>
      )}

      {next && (
        <button type="button" className={styles.cue} onClick={() => scrollTo(next.id)}>
          Ver {next.label.toLowerCase()}
          <span className={styles.cueIcon} aria-hidden="true">
            <Arrow size={14} direction="down" />
          </span>
        </button>
      )}
    </div>
  )
}
