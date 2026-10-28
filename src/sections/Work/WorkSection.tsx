import { featuredProjects, otherProjects, sectionInfo } from '@/content'
import { SectionHead } from '@/components/SectionHead'
import { FeaturedProject } from './FeaturedProject'
import { OtherProjects } from './OtherProjects'
import s from './Work.module.css'

/*
  PROJETOS — a seção principal. Um projeto por vez, todos do mesmo tamanho
  (imagem ao lado do texto, lados alternados; apps em painel de aparelho) e só o essencial: nome, imagem,
  descrição curta, participação e link. Os não destacados entram numa lista
  compacta no fim.
*/
export function WorkSection() {
  const info = sectionInfo('projetos')
  if (!info) return null

  // Sem destaques marcados, todos entram na vitrine
  const featured = featuredProjects.length > 0 ? featuredProjects : otherProjects
  const others = featuredProjects.length > 0 ? otherProjects : []

  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className={s.section}>
      <div className="container">
        <SectionHead
          id="projetos-titulo"
          index={info.index}
          label={info.label}
          title={
            <>
              Projetos <em>selecionados</em>
            </>
          }
        />
      </div>

      <div className={s.list}>
        {featured.map((project, i) => (
          <FeaturedProject key={project.slug} project={project} order={i} />
        ))}
      </div>

      {others.length > 0 && <OtherProjects projects={others} />}
    </section>
  )
}
