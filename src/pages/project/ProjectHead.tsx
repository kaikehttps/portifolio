import { m } from 'motion/react'
import { Link } from 'react-router'
import { KIND_LABEL, LINK_LABEL, projectNumber, type Project } from '@/content'
import { Cta } from '@/components/Cta'
import { ExampleBadge } from '@/components/ExampleBadge'
import { Arrow, Star } from '@/components/Icons'
import { useFinePointer } from '@/lib/hooks'
import { useIntroDone } from '@/lib/intro'
import { ease } from '@/lib/motion'
import { Num } from './Bits'
import { FitTitle } from './FitTitle'
import { ProjectCover } from './ProjectCover'
import { SpecSheet } from './SpecSheet'
import s from './ProjectHead.module.css'

/**
 * Cartela de abertura do projeto: HUD de volta, título monumental,
 * subtítulo em serifa, links, ficha técnica e a capa.
 * Desktop: subtítulo/links à esquerda, ficha à direita, capa embaixo.
 * Tablet/celular: a capa vem logo depois do título; a ficha, depois dela.
 */
export function ProjectHead({ project, onOpen }: { project: Project; onOpen: (index: number) => void }) {
  const ready = useIntroDone()
  const fine = useFinePointer()
  const n = projectNumber(project)
  const links = project.links ?? []

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: ease.out, delay },
  })

  return (
    <div className={`wrap ${s.head}`}>
      <m.div className={s.hud} {...enter(0.05)}>
        <Link to="/" state={{ restore: project.slug }} className={s.back}>
          <Arrow direction="left" size={14} className={s.backArrow} />
          <span className="t-label">Projetos</span>
          {fine && (
            <kbd className={s.kbd} aria-hidden="true">
              Esc
            </kbd>
          )}
        </Link>
        <span className={s.rule} aria-hidden="true" />
        <span className={`t-label ${s.no}`}>
          <span className={s.dot} aria-hidden="true" />
          <Num n={n} />
        </span>
        <span className={`t-label t-dim ${s.kind}`}>{KIND_LABEL[project.kind]}</span>
        <span className={s.fill} aria-hidden="true" />
        <ExampleBadge show={project.example} />
      </m.div>

      <FitTitle text={project.title} className={s.title} titleClassName={s.h1} ready={ready} delay={0.12} echo />

      {project.subtitle && (
        <m.p className={`t-serif ${s.sub}`} {...enter(0.45)}>
          <Star size={14} className={s.subStar} />
          <span>{project.subtitle}</span>
        </m.p>
      )}

      {links.length > 0 && (
        <m.div className={s.links} {...enter(0.6)}>
          {links.map((link, i) => (
            <Cta key={link.url + i} href={link.url} kind={link.kind} tone={i === 0 ? 'solid' : 'line'} className={s.cta}>
              {link.label ?? LINK_LABEL[link.kind]}
            </Cta>
          ))}
        </m.div>
      )}

      {/* a capa vem antes da ficha no DOM: é a ordem de leitura no tablet/celular;
          no desktop a grade põe a ficha ao lado do subtítulo (ela não tem foco) */}
      <ProjectCover project={project} onOpen={onOpen} className={s.cover} ready={ready} />

      <SpecSheet project={project} className={s.spec} ready={ready} />
    </div>
  )
}
