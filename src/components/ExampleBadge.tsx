import styles from './ExampleBadge.module.css'

/** Selo para conteúdo de demonstração (`example: true`), visível só em desenvolvimento. */
export function ExampleBadge({
  show,
  className,
  label = 'Exemplo',
  title = 'Conteúdo de exemplo — some no site publicado',
}: {
  show?: boolean
  className?: string
  label?: string
  title?: string
}) {
  if (!show) return null
  return (
    <span className={[styles.badge, className].filter(Boolean).join(' ')} title={title}>
      {label}
    </span>
  )
}
