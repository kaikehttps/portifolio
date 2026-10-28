import { useId } from 'react'
import { Star } from '@/components/Icons'
import s from './ProjectNotes.module.css'

/** Letras miúdas: avisos e créditos do projeto. */
export function ProjectNotes({ notes }: { notes?: string[] }) {
  const id = useId()
  if (!notes || notes.length === 0) return null
  return (
    <section className={`wrap grid-12 ${s.notes}`} aria-labelledby={id}>
      <h2 id={id} className={`t-label ${s.label}`}>
        Notas
      </h2>
      <ul className={s.list}>
        {notes.map((note, i) => (
          <li key={i} className={s.item}>
            <Star size={9} className={s.star} />
            <p>{note}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
