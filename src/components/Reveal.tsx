import { m, useReducedMotion, type Variants } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { ease } from '@/lib/motion'
import styles from './Reveal.module.css'

/*
  Regra das revelações: o elemento OBSERVADO nunca é o que está escondido.
  No Chromium o IntersectionObserver aplica o recorte do próprio alvo (clip-path,
  overflow do pai), e um alvo recortado a zero nunca "entra" na tela. Por isso o
  gatilho fica no invólucro visível e o conteúdo anima por variants.
*/

type Common = {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
  /** Fração visível do elemento para disparar (0–1). */
  amount?: number
  once?: boolean
}

const rise: Variants = {
  hidden: { y: '110%' },
  show: (delay: number) => ({ y: '0%', transition: { duration: 1.1, ease: ease.out, delay } }),
}

/**
 * Máscara: o conteúdo sobe de dentro de uma janela (títulos, linhas).
 * Envolva cada linha separadamente para efeito em cascata.
 */
export function MaskReveal({
  children,
  delay = 0,
  className,
  innerClassName,
  style,
  amount = 0.3,
  once = true,
  block = false,
}: Common & {
  innerClassName?: string
  /** Ocupa a linha inteira (display: block) em vez de inline-block. */
  block?: boolean
}) {
  const reduce = useReducedMotion()
  const Outer = block ? m.div : m.span
  const Inner = block ? m.div : m.span
  return (
    <Outer
      className={[styles.mask, block && styles.block, className].filter(Boolean).join(' ')}
      style={style}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once, amount }}
    >
      <Inner className={[styles.inner, innerClassName].filter(Boolean).join(' ')} variants={rise} custom={delay}>
        {children}
      </Inner>
    </Outer>
  )
}

/** Surge com leve subida e fade (parágrafos, rótulos, blocos). */
export function FadeUp({ children, delay = 0, className, style, amount = 0.3, once = true }: Common) {
  const reduce = useReducedMotion()
  return (
    <m.div
      className={className}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: reduce ? 0.3 : 0.9, ease: ease.out, delay }}
    >
      {children}
    </m.div>
  )
}

/** De onde a imagem começa a aparecer; a placa sai para o lado oposto. */
const PLATE_EXIT = {
  bottom: { y: '-101%' },
  top: { y: '101%' },
  left: { x: '101%' },
  right: { x: '-101%' },
} as const

/**
 * Cortina para imagens: uma placa escura com um fio no acento do projeto
 * varre o quadro e a imagem assenta (escala 1.12 → 1).
 * Só transform — diferente de um clip-path, não segura o carregamento
 * preguiçoso da imagem (o Chrome não carrega <img loading=lazy> recortada a zero).
 * Preenche o pai, que precisa de position: relative e tamanho próprio.
 */
export function ClipReveal({
  children,
  delay = 0,
  className,
  style,
  amount = 0.2,
  once = true,
  from = 'bottom',
}: Common & { from?: keyof typeof PLATE_EXIT }) {
  const reduce = useReducedMotion()
  const cls = [styles.clip, className].filter(Boolean).join(' ')
  if (reduce) {
    return (
      <div className={cls} style={style}>
        {children}
      </div>
    )
  }
  return (
    <m.div className={cls} style={style} initial="hidden" whileInView="shown" viewport={{ once, amount }}>
      <m.div
        className={styles.settle}
        variants={{ hidden: { scale: 1.12 }, shown: { scale: 1 } }}
        transition={{ duration: 1.8, ease: ease.out, delay }}
      >
        {children}
      </m.div>
      <m.span
        className={styles.plate}
        data-from={from}
        aria-hidden="true"
        variants={{ hidden: { x: 0, y: 0 }, shown: PLATE_EXIT[from] }}
        transition={{ duration: 1.25, ease: ease.inOut, delay }}
      />
    </m.div>
  )
}
