import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { KIND_LABEL, LINK_LABEL, hasPage, projectPath, type Project } from '@/content'
import { Picture } from '@/components/Picture'
import { Arrow } from '@/components/Icons'
import { ExampleBadge } from '@/components/ExampleBadge'
import s from './Work.module.css'

/** Lista compacta dos projetos fora da vitrine: miniatura, nome, tipo, ano. */
export function OtherProjects({ projects }: { projects: Project[] }) {
  return (
    <div className={['container', s.others].join(' ')}>
      <h3 className={s.othersTitle}>
        Outros projetos <span className={s.othersCount}>{String(projects.length).padStart(2, '0')}</span>
      </h3>
      <ul className={s.rows}>
        {projects.map((p) => {
          // sem página própria, a linha abre o site (ou a loja de apps) do projeto, em outra aba
          const link = hasPage(p) ? undefined : (p.links?.find((l) => l.kind === 'site') ?? p.links?.[0])
          const body = (
            <>
              <span className={s.thumb} aria-hidden="true">
                <Picture project={p} media={p.cover} sizes="96px" position="top center" />
              </span>
              <span className={s.rowTitle}>
                {p.title}
                <ExampleBadge show={p.example} />
              </span>
              <span className={s.rowSummary}>{p.summary}</span>
              <span className={s.rowKind}>{KIND_LABEL[p.kind]}</span>
              <span className={s.rowYear}>{p.year}</span>
              {(hasPage(p) || link) && <Arrow size={16} className={s.rowArrow} />}
            </>
          )
          return (
            <li key={p.slug} style={{ '--accent': p.accent } as CSSProperties}>
              {hasPage(p) ? (
                <Link to={projectPath(p)} className={s.row} data-cursor="view" data-cursor-label="Ver projeto">
                  {body}
                </Link>
              ) : link ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.row}
                  data-cursor="view"
                  data-cursor-label={link.kind === 'site' ? 'Ver site' : LINK_LABEL[link.kind]}
                >
                  {body}
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              ) : (
                <div className={s.row}>{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
