import { m, useInView } from 'motion/react'
import type { ReactNode } from 'react'
import { ease } from '@/lib/motion'
import { useFitText } from './useFitText'
import s from './FitTitle.module.css'

/**
 * Título display que preenche a largura (1 ou 2 linhas), com revelação por
 * máscara linha a linha. O texto inteiro fica numa cópia para leitores de tela.
 */
export function FitTitle({
  text,
  as: Tag = 'h1',
  className,
  titleClassName,
  measureClassName,
  reveal = 'mount',
  ready = true,
  delay = 0,
  echo = false,
  children,
}: {
  text: string
  as?: 'h1' | 'h2' | 'span'
  className?: string
  titleClassName?: string
  /** Classe extra do medidor (ex.: medir na largura expandida). */
  measureClassName?: string
  /** 'mount' anima ao montar (quando `ready`); 'view' quando o bloco entra na tela. */
  reveal?: 'mount' | 'view'
  ready?: boolean
  delay?: number
  /** Eco em contorno deslocado atrás do título (registro de impressão fora do lugar). */
  echo?: boolean
  children?: ReactNode
}) {
  const { boxRef, measureRef, fit } = useFitText(text)
  // observa o bloco visível, não a linha mascarada (que está recortada e nunca "entra")
  const inView = useInView(boxRef, { once: true, amount: 0.35 })
  const lines = fit?.lines ?? [text]
  const show = reveal === 'view' ? inView : ready

  return (
    <div ref={boxRef} className={[s.box, className].filter(Boolean).join(' ')}>
      <span className={s.host} aria-hidden="true">
        <span ref={measureRef} className={['t-display', s.measure, measureClassName].filter(Boolean).join(' ')} />
      </span>
      <Tag
        className={['t-display', s.title, titleClassName].filter(Boolean).join(' ')}
        style={fit ? { fontSize: `${fit.size}px` } : undefined}
        data-lines={lines.length}
      >
        <span className="visually-hidden">{text}</span>
        <span aria-hidden="true" className={s.lines}>
          {lines.map((line, i) => (
            <span key={i} className={s.line}>
              <m.span
                className={s.inner}
                initial={{ y: '135%' }}
                animate={show ? { y: '0%' } : undefined}
                transition={{ duration: 1.25, ease: ease.out, delay: delay + i * 0.1 }}
              >
                {line}
              </m.span>
            </span>
          ))}
        </span>
        {echo && (
          <m.span
            aria-hidden="true"
            className={`${s.lines} ${s.echo}`}
            initial={{ opacity: 0 }}
            animate={show ? { opacity: 1 } : undefined}
            transition={{ duration: 1.2, ease: ease.out, delay: delay + 1.1 }}
          >
            {lines.map((line, i) => (
              <span key={i} className={s.echoLine}>
                {line}
              </span>
            ))}
          </m.span>
        )}
      </Tag>
      {children}
    </div>
  )
}
