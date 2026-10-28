import { m, useInView } from 'motion/react'
import { useId, useRef, type ReactNode } from 'react'
import { KIND_LABEL, type Project } from '@/content'
import { Tag } from '@/components/Cta'
import { Star } from '@/components/Icons'
import { ease } from '@/lib/motion'
import s from './SpecSheet.module.css'

interface Row {
  key: string
  label: string
  value: ReactNode
  /** tags = etiquetas; list = itens com separador que nunca sobra no fim da linha */
  kind?: 'tags' | 'list'
}

/** Ficha técnica: rótulo ······ valor, com linhas pontilhadas de índice. */
export function SpecSheet({ project, className, ready = true }: { project: Project; className?: string; ready?: boolean }) {
  const id = useId()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const show = ready && inView

  const rows: Row[] = [
    { key: 'ano', label: 'Ano', value: project.year },
    { key: 'tipo', label: 'Tipo', value: KIND_LABEL[project.kind] },
  ]
  if (project.role.length > 0) {
    rows.push({
      key: 'role',
      label: 'Participação',
      kind: 'list',
      value: (
        <ul className={s.list}>
          {project.role.map((r) => (
            <li key={r} className={s.item}>
              {r}
            </li>
          ))}
        </ul>
      ),
    })
  }
  if (project.stack.length > 0) {
    rows.push({
      key: 'stack',
      label: 'Tecnologias',
      kind: 'tags',
      value: project.stack.map((t) => <Tag key={t}>{t}</Tag>),
    })
  }
  project.details?.facts?.forEach((f, i) => rows.push({ key: `f${i}`, label: f.label, value: f.value }))

  return (
    <section ref={ref} className={[s.spec, className].filter(Boolean).join(' ')} aria-labelledby={id}>
      <m.div
        className={s.head}
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, ease: ease.out, delay: 0.35 }}
      >
        <Star size={10} className={s.star} />
        <h2 id={id} className="t-label">
          Ficha técnica
        </h2>
        <span className={s.headRule} aria-hidden="true" />
      </m.div>
      <dl className={s.rows}>
        {rows.map((row, i) => (
          <m.div
            key={row.key}
            className={s.row}
            initial={{ opacity: 0, y: 10 }}
            animate={show ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.45 + i * 0.06 }}
          >
            <dt className="t-label">{row.label}</dt>
            <dd className={row.kind === 'tags' ? s.tags : s.value}>{row.value}</dd>
          </m.div>
        ))}
      </dl>
    </section>
  )
}
