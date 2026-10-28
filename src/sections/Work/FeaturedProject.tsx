import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import {
  KIND_LABEL,
  LINK_LABEL,
  hasPage,
  projectNumber,
  projectPath,
  type MediaRef,
  type Project,
  caseStudies,
} from '@/content'
import { Picture } from '@/components/Picture'
import { PhoneFrame } from '@/components/Frames'
import { ClipReveal, FadeUp } from '@/components/Reveal'
import { Cta, ctaSolidClass } from '@/components/Cta'
import { Arrow, LinkIcon } from '@/components/Icons'
import { ExampleBadge } from '@/components/ExampleBadge'
import s from './Work.module.css'

type Variant = 'split' | 'device'

/** Composição: aparelho para apps (`device`); os demais, imagem ao lado do texto — todos do mesmo tamanho. */
function variantOf(p: Project): Variant {
  if (p.layout === 'device') return 'device'
  return 'split'
}

const portraits = (p: Project): MediaRef[] =>
  [p.cover, ...(p.gallery ?? [])].filter((m) => m.frame === 'mobile')

/**
 * Envolve o visual: com site, a imagem abre o site (outra aba); com case próprio ou sem site,
 * abre a página do projeto. O título é o link focável, por isso o visual fica fora da ordem de tabulação.
 */
function Visual({ project, className, children }: { project: Project; className?: string; children: ReactNode }) {
  // projeto com case próprio (página em capítulos): a imagem abre a página; os demais abrem o site
  const site = caseStudies[project.slug] ? undefined : project.links?.find((l) => l.kind === 'site')
  if (site) {
    return (
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        tabIndex={-1}
        aria-hidden="true"
        data-cursor="view"
        data-cursor-label="Ver site"
      >
        {children}
      </a>
    )
  }
  if (!hasPage(project)) return <div className={className}>{children}</div>
  return (
    <Link
      to={projectPath(project)}
      className={className}
      tabIndex={-1}
      aria-hidden="true"
      data-cursor="view"
      data-cursor-label="Ver projeto"
    >
      {children}
    </Link>
  )
}

function Phone({ project, media, sizes }: { project: Project; media: MediaRef; sizes: string }) {
  return (
    <PhoneFrame className={s.phone}>
      <Picture project={project} media={media} sizes={sizes} position="top center" className={s.img} />
    </PhoneFrame>
  )
}

export function FeaturedProject({ project: p, order }: { project: Project; order: number }) {
  const variant = variantOf(p)
  const flip = variant === 'split' && order % 2 === 1
  const phones = portraits(p)
  const cover = p.cover
  const coverIsPhone = p.cover.frame === 'mobile'
  const sidePhone = variant === 'split' && !coverIsPhone ? phones[0] : undefined

  let visual: ReactNode
  if (variant === 'device' || coverIsPhone) {
    const shots = (phones.length > 0 ? phones : [p.cover]).slice(0, 3)
    visual = (
      <div className={s.devicePanel} data-count={shots.length}>
        {shots.map((m, i) => (
          <Phone key={`${m.src}-${i}`} project={p} media={m} sizes="(max-width: 760px) 40vw, 18vw" />
        ))}
      </div>
    )
  } else {
    visual = (
      <div className={s.shots} data-side={sidePhone ? '' : undefined}>
        <div className={s.frame}>
          <ClipReveal from="bottom">
            <Picture
              project={p}
              media={cover}
              sizes="(max-width: 760px) 100vw, 60vw"
              className={s.img}
            />
          </ClipReveal>
        </div>
        {sidePhone && <Phone project={p} media={sidePhone} sizes="14vw" />}
      </div>
    )
  }

  const site = p.links?.find((l) => l.kind === 'site')
  const stores = p.links?.filter((l) => l.kind === 'appstore' || l.kind === 'googleplay') ?? []
  const repo = p.links?.find((l) => l.kind === 'repo')
  const external = site ? [site, ...stores] : stores

  return (
    <article
      id={`projeto-${p.slug}`}
      className={s.item}
      data-variant={variant}
      data-flip={flip ? '' : undefined}
      aria-labelledby={`projeto-${p.slug}-titulo`}
      style={{ '--accent': p.accent } as CSSProperties}
    >
      <div className="container">
        <div className={s.grid}>
          <Visual project={p} className={s.visual}>
            {visual}
          </Visual>

          <FadeUp className={s.info} amount={0.25}>
            <p className={s.meta}>
              <span className={s.num}>{projectNumber(p)}</span>
              <span>{KIND_LABEL[p.kind]}</span>
              <span className={s.dot} aria-hidden="true" />
              <span>{p.year}</span>
              <ExampleBadge show={p.example} />
            </p>

            <h3 id={`projeto-${p.slug}-titulo`} className={s.title}>
              {hasPage(p) ? (
                <Link to={projectPath(p)} className={s.titleLink} data-cursor="view" data-cursor-label="Ver projeto">
                  {p.title}
                </Link>
              ) : (
                p.title
              )}
            </h3>

            {p.subtitle && <p className={s.subtitle}>{p.subtitle}</p>}
            <p className={s.summary}>{p.summary}</p>

            {p.role.length > 0 && (
              <dl className={s.role}>
                <dt>Participação</dt>
                <dd>{p.role.join(' · ')}</dd>
              </dl>
            )}

            <div className={s.actions}>
              {/* com repositório: o site é o botão de destaque e o código vem discreto no fim */}
              {hasPage(p) && !repo && (
                <Link to={projectPath(p)} className={ctaSolidClass} data-cursor="link">
                  <span>Ver projeto</span>
                  <Arrow size={14} direction="right" />
                </Link>
              )}
              {external.map((l, i) => (
                <Cta key={`${l.kind}-${l.url}`} href={l.url} kind={l.kind} tone={repo && i === 0 ? 'solid' : 'line'}>
                  {l.label ?? LINK_LABEL[l.kind]}
                </Cta>
              ))}
              {repo && (
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className={s.repoLink} data-cursor="link">
                  <LinkIcon kind="repo" size={14} />
                  {repo.label ?? LINK_LABEL.repo}
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              )}
            </div>
          </FadeUp>
        </div>
      </div>
    </article>
  )
}
