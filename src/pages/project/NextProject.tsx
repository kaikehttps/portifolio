import { useId, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { KIND_LABEL, nextProject, projectNumber, projectPath, type Project } from '@/content'
import { Arrow } from '@/components/Icons'
import { Picture } from '@/components/Picture'
import { ExampleBadge } from '@/components/ExampleBadge'
import { Num } from './Bits'
import { FitTitle } from './FitTitle'
import s from './NextProject.module.css'

/**
 * Cartela final: o próximo projeto em letras enormes. No mouse, o título
 * se expande no eixo de largura e a capa abre por uma fresta de letterbox;
 * no toque, já aparece expandido e com a capa aberta.
 */
export function NextProject({ project }: { project: Project }) {
  const id = useId()
  const next = nextProject(project)

  return (
    <section className={s.next} aria-labelledby={id}>
      <h2 id={id} className="visually-hidden">
        Próximo projeto
      </h2>

      {next && (
        <Link
          to={projectPath(next)}
          className={s.link}
          style={{ '--accent': next.accent ?? 'var(--signal)' } as CSSProperties}
          aria-label={`Próximo projeto: ${next.title}${next.example ? ' (exemplo)' : ''}`}
          data-cursor="view"
          data-cursor-label="Abrir"
        >
          <div className={`wrap ${s.hud}`} aria-hidden="true">
            <span className={`t-label ${s.kicker}`}>
              <span className={s.square} />
              Próximo projeto
            </span>
            <span className={s.rule} />
            <span className={`t-label t-dim ${s.meta}`}>
              <Num n={projectNumber(next)} />
              <span className={s.kind}> · {KIND_LABEL[next.kind]}</span>
            </span>
            <ExampleBadge show={next.example} className={s.badge} />
            <span className={s.fill} />
            <Arrow direction="right" size={22} className={s.arrow} />
          </div>

          <div className={s.stage}>
            <div className={s.peek} aria-hidden="true">
              <Picture
                project={next}
                media={next.cover}
                sizes="100vw"
                className={s.peekPic}
                fallback={<span className={s.peekArt} aria-hidden="true" />}
              />
            </div>
            <div className="wrap">
              <FitTitle
                as="span"
                text={next.title}
                className={s.titleBox}
                titleClassName={s.title}
                measureClassName={s.measureWide}
                reveal="view"
              />
            </div>
          </div>
        </Link>
      )}

      <div className={`wrap ${s.after}`}>
        <Link to="/#projetos" className={s.all}>
          <span className="t-label">Todos os projetos</span>
          <Arrow direction="right" size={14} className={s.allArrow} />
        </Link>
      </div>
    </section>
  )
}
