import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import type { CaseStudy, MediaRef, Project, StoryVisual } from '@/content'
import { Picture } from '@/components/Picture'
import { BrowserFrame } from '@/components/Frames'
import { Cta } from '@/components/Cta'
import { Arrow } from '@/components/Icons'
import { FadeUp, MaskReveal } from '@/components/Reveal'
import { projectImageNames, projectPicture } from '@/lib/media'
import { useIntroDone } from '@/lib/intro'
import { TECH_ICONS } from '@/lib/tech-icons'
import { ProjectCover } from '../project/ProjectCover'
import { Zoom } from '../project/Bits'
import { figLabel, projectMedia, siteUrl } from '../project/figures'
import { PhotoBook } from './PhotoBook'
import s from './Case.module.css'

/*
  Página de projeto contada como uma história curta: abertura, poucos capítulos
  (cada um com um título, um ou dois parágrafos e um visual) e encerramento.
*/

const pad = (n: number) => String(n).padStart(2, '0')

/** Captura do site, com moldura de navegador e botão de ampliar. */
function Shot({ project, name, onOpen }: { project: Project; name: string; onOpen: (index: number) => void }) {
  const media = projectMedia(project)
  const index = media.findIndex((m) => m.src === name)
  const ref: MediaRef = index >= 0 ? media[index] : { src: name, alt: '', frame: 'desktop' }
  return (
    <div className={s.shotMedia}>
      <BrowserFrame url={siteUrl(project)}>
        <Picture project={project} media={ref} sizes="(max-width: 960px) 100vw, 60vw" position="top center" />
      </BrowserFrame>
      {index >= 0 && <Zoom label={figLabel(index, ref)} onOpen={() => onOpen(index)} />}
    </div>
  )
}

function Visual({ project, visual, onOpen }: { project: Project; visual: StoryVisual; onOpen: (index: number) => void }) {
  switch (visual.type) {
    case 'names':
      return (
        <ol className={s.names} aria-label="Nomes do projeto">
          {visual.names.map((n) => (
            <li key={n} className={s.oldName}>
              {n}
            </li>
          ))}
          <li className={s.finalName}>{visual.final}</li>
        </ol>
      )
    case 'stat':
      return (
        <div className={s.stat}>
          <div className={s.statRow}>
            {visual.items.map((it, i) => (
              <div key={it.label} className={s.statItem} data-weight={i === visual.items.length - 1 ? 'heavy' : undefined}>
                <span className={s.statValue}>{it.value}</span>
                <span className={s.statLabel}>{it.label}</span>
              </div>
            ))}
          </div>
          <p className={s.statNote}>{visual.note}</p>
        </div>
      )
    case 'shot':
      return (
        <div>
          <Shot project={project} name={visual.image} onOpen={onOpen} />
          {visual.stack && (
            <ul className={s.stackLine} aria-label="Tecnologias">
              {visual.stack.map((t) => {
                const icon = t.icon ? TECH_ICONS[t.icon] : undefined
                return (
                  <li key={t.name} className={s.stackChip}>
                    {icon && (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                        <path d={icon.path} />
                      </svg>
                    )}
                    {t.name}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )
    case 'book': {
      // as listadas + qualquer galeria-* da pasta do projeto
      const listed = visual.photos.filter((p) => projectPicture(project.slug, p.src))
      const photos = [
        ...listed,
        ...projectImageNames(project.slug, 'galeria-')
          .filter((src) => !listed.some((p) => p.src === src))
          .map((src) => ({ src })),
      ]
      return photos.length > 0 ? <PhotoBook project={project} photos={photos} /> : null
    }
  }
}

export function CaseStudyView({
  project,
  study,
  onOpen,
}: {
  project: Project
  study: CaseStudy
  onOpen: (index: number) => void
}) {
  const ready = useIntroDone()
  const site = study.closing.site
  const style = { '--accent': study.brand.accent, '--brand-blue': study.brand.blue } as CSSProperties

  return (
    <div className={s.case} style={style}>
      <header className={s.hero}>
        <div className="container">
          <Link to="/" state={{ restore: project.slug }} className={s.back}>
            <Arrow size={14} direction="left" />
            Projetos
          </Link>
          <div className={s.heroGrid}>
            <div className={s.heroMain}>
              {study.brand.logo && (
                <span className={s.logo}>
                  <Picture project={project} media={{ src: study.brand.logo, alt: '' }} sizes="96px" fit="contain" priority />
                </span>
              )}
              <h1 className={s.name}>{project.title}</h1>
              <p className={s.tagline}>{study.hero.tagline}</p>
              <p className={s.intro}>{study.hero.intro}</p>
              <div className={s.heroActions}>
                <Cta href={site} tone="solid">
                  Visitar apexvet.site
                </Cta>
              </div>
            </div>
            <dl className={s.meta}>
              {study.hero.meta.map((m) => (
                <div key={m.label} className={s.metaRow}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className={['container', s.cover].join(' ')}>
          <ProjectCover project={project} onOpen={onOpen} ready={ready} />
        </div>
      </header>

      {study.story.map((ch, i) => {
        const id = `capitulo-${i + 1}`
        // o book precisa da largura toda; os demais visuais ficam ao lado do texto
        const wide = ch.visual?.type === 'book' || ch.visual?.type === 'stat'
        return (
          <section key={ch.title} className={s.chapter} aria-labelledby={`${id}-titulo`}>
            <div className="container">
              <div className={s.story} data-wide={wide ? '' : undefined} data-flip={i % 2 ? '' : undefined}>
                <FadeUp className={s.storyText} amount={0.3}>
                  <p className={s.chapterNo}>
                    {pad(i + 1)} — {ch.kicker}
                  </p>
                  <h2 id={`${id}-titulo`} className={s.storyTitle}>
                    <MaskReveal block>{ch.title}</MaskReveal>
                  </h2>
                  {ch.text.map((p, j) => (
                    <p key={j} className={s.storyBody}>
                      {p}
                    </p>
                  ))}
                </FadeUp>
                {ch.visual && (
                  <FadeUp className={s.storyVisual} amount={0.2}>
                    <Visual project={project} visual={ch.visual} onOpen={onOpen} />
                  </FadeUp>
                )}
              </div>
            </div>
          </section>
        )
      })}

      <section className={s.closing} aria-labelledby="encerramento-titulo">
        <div className="container">
          <h2 id="encerramento-titulo" className={s.closingName}>
            {project.title}
          </h2>
          <p className={s.closingLine}>{study.closing.line}</p>
          <div className={s.heroActions}>
            <Cta href={site} tone="solid">
              Visitar apexvet.site
            </Cta>
            <Link to="/" state={{ restore: project.slug }} className={s.others}>
              Ver outros projetos
              <Arrow size={14} direction="right" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
