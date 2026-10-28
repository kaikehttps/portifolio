import { useId, type ReactNode } from 'react'
import { splitMark, type Project } from '@/content'
import { FadeUp } from '@/components/Reveal'
import s from './ProjectIntro.module.css'

/**
 * Destaque (caixa de cor) no texto: usa [colchetes] se houver;
 * senão, marca a primeira menção ao nome do projeto.
 */
function withMark(text: string, title: string): ReactNode {
  if (/\[[^\]]+\]/.test(text)) {
    return splitMark(text).map((part, i) =>
      part.marked ? (
        <span key={i} className={`t-mark ${s.mark}`}>
          {part.text}
        </span>
      ) : (
        part.text
      ),
    )
  }
  const at = text.indexOf(title)
  if (at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      <span className={`t-mark ${s.mark}`}>{title}</span>
      {text.slice(at + title.length)}
    </>
  )
}

/** Sinopse: um parágrafo editorial grande, linhas curtas. */
export function ProjectIntro({ project }: { project: Project }) {
  const id = useId()
  const text = project.details?.intro ?? project.summary
  if (!text) return null
  return (
    <section className={`wrap grid-12 ${s.intro}`} aria-labelledby={id}>
      <div className={s.aside}>
        <h2 id={id} className={`t-label ${s.label}`}>
          <span className={s.square} aria-hidden="true" />
          Sinopse
        </h2>
      </div>
      <FadeUp className={s.body} amount={0.25}>
        <p className={s.text}>{withMark(text, project.title)}</p>
      </FadeUp>
    </section>
  )
}
