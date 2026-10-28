import type { ReactNode } from 'react'
import { MaskReveal } from './Reveal'
import styles from './SectionHead.module.css'

/**
 * Cabeçalho comum das seções: fio, número + rótulo em mono, título em serifa
 * e, opcionalmente, uma frase curta à direita. O mesmo desenho em todas as
 * seções — quem passa o olho entende a estrutura da página.
 * No título, um trecho entre <em> ganha itálico (ex.: <>Projetos <em>selecionados</em></>).
 * Sem `title`, fica só o fio com o número e o rótulo (que vira o <h2>).
 */
export function SectionHead({
  id,
  index,
  label,
  title,
  aside,
}: {
  /** id do <h2> (para aria-labelledby da seção). */
  id: string
  index: string
  label: string
  title?: ReactNode
  aside?: ReactNode
}) {
  const meta = (
    <>
      <span className={styles.index}>{index}</span>
      <span className={styles.label}>{label}</span>
    </>
  )

  if (!title)
    return (
      <header className={styles.head} data-compact="true">
        <h2 id={id} className={styles.meta}>
          {meta}
        </h2>
        {aside && <p className={styles.aside}>{aside}</p>}
      </header>
    )

  return (
    <header className={styles.head}>
      <p className={styles.meta}>{meta}</p>
      <h2 id={id} className={styles.title}>
        <MaskReveal block>{title}</MaskReveal>
      </h2>
      {aside && <p className={styles.aside}>{aside}</p>}
    </header>
  )
}
