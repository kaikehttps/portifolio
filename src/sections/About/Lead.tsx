import { useRef, type CSSProperties } from 'react'
import { useInView } from 'motion/react'
import { splitMark } from '@/content'
import styles from './Lead.module.css'

/**
 * Frase principal em serifa itálica, palavra por palavra subindo da máscara.
 * O trecho entre [colchetes] ganha a caixa .t-mark, que varre da esquerda
 * para a direita depois que as palavras assentam.
 */
export function Lead({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const parts = splitMark(text)
  const plain = parts.map((p) => p.text).join('')

  let w = 0
  const total = parts.reduce((sum, p) => sum + (p.marked ? 1 : p.text.split(/\s+/).filter(Boolean).length), 0)

  return (
    <p
      ref={ref}
      className={[styles.lead, inView && styles.in, className].filter(Boolean).join(' ')}
      style={{ '--n': total } as CSSProperties}
    >
      <span className="visually-hidden">{plain}</span>
      <span aria-hidden="true">
        {parts.map((part, pi) => {
          if (part.marked) {
            const i = w++
            return (
              <span key={pi} className={styles.word} style={{ '--w': i } as CSSProperties}>
                <span className={styles.wordInner}>
                  <span className={styles.markBase}>
                    {part.text}
                    <span className={`t-mark ${styles.markInk}`}>{part.text}</span>
                  </span>
                </span>
              </span>
            )
          }
          // Mantém os espaços como texto comum para a quebra de linha natural
          return part.text.split(/(\s+)/).map((token, ti) => {
            if (token === '') return null
            if (/^\s+$/.test(token)) return ' '
            const i = w++
            return (
              <span key={`${pi}-${ti}`} className={styles.word} style={{ '--w': i } as CSSProperties}>
                <span className={styles.wordInner}>{token}</span>
              </span>
            )
          })
        })}
      </span>
    </p>
  )
}
