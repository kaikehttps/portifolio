import type { CSSProperties } from 'react'
import { KIND_LABEL, projectNumber, type Project } from '@/content'
import { Star } from './Icons'
import styles from './ProjectArt.module.css'

/*
  Arte gerada para projetos sem imagem — um "cartão de teste" de cinema.
  A variação é escolhida pelo slug, então cada projeto tem sempre a mesma.
*/

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function ProjectArt({
  project,
  shape = 'wide',
  className,
}: {
  project: Project
  shape?: 'wide' | 'phone' | 'poster'
  className?: string
}) {
  const accent = project.accent ?? 'var(--signal)'
  const variant = (['bars', 'target', 'type'] as const)[hash(project.slug) % 3]
  const style = { '--art': accent } as CSSProperties
  const n = projectNumber(project)

  if (shape === 'phone') {
    return (
      <div className={[styles.art, styles.phone, className].filter(Boolean).join(' ')} style={style} aria-hidden="true">
        <div className={styles.status}>
          <span>9:41</span>
          <span className={styles.notch} />
          <span>●●●</span>
        </div>
        <div className={styles.appHead}>
          <span className={styles.appTitle}>{project.title}</span>
          <span className={styles.appDot} />
        </div>
        <div className={styles.hero} />
        <div className={styles.rows}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.tabbar}>
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  }

  return (
    <div
      className={[styles.art, styles[variant], styles[shape], className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    >
      {variant === 'bars' && (
        <>
          <div className={styles.barsTop}>
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} style={{ '--k': i } as CSSProperties} />
            ))}
          </div>
          <div className={styles.barsBottom}>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} style={{ '--k': i } as CSSProperties} />
            ))}
          </div>
          <div className={styles.slate}>
            <span className="t-label">Nº {n} · sem sinal</span>
            <strong>{project.title}</strong>
          </div>
        </>
      )}

      {variant === 'target' && (
        <>
          <svg className={styles.target} viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
            {[90, 70, 50, 30].map((r) => (
              <circle key={r} cx="100" cy="100" r={r} />
            ))}
            <path d="M100 0v200M0 100h200" />
          </svg>
          <span className={styles.bigNum}>{n}</span>
          <div className={styles.corner}>
            <span className="t-label">{KIND_LABEL[project.kind]}</span>
            <strong>{project.title}</strong>
          </div>
        </>
      )}

      {variant === 'type' && (
        <>
          <div className={styles.stack}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={i % 2 ? styles.outline : undefined}>
                {project.title}
              </span>
            ))}
          </div>
          <div className={styles.badge}>
            <Star size={10} />
            <span className="t-label">
              Nº {n} — {project.year}
            </span>
          </div>
        </>
      )}

      <span className={styles.grain} />
    </div>
  )
}
