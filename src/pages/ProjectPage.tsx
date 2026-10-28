import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useParams } from 'react-router'
import { caseStudies, getProject, hasPage, type Project } from '@/content'
import { usePageScroll } from '@/lib/smooth-scroll'
import { NotFound } from './NotFound'
import { CaseStudyView } from './case/CaseStudyView'
import { projectMedia } from './project/figures'
import { Lightbox } from './project/Lightbox'
import { NextProject } from './project/NextProject'
import { ProjectFooter } from './project/ProjectFooter'
import { ProjectGallery } from './project/ProjectGallery'
import { ProjectHead } from './project/ProjectHead'
import { ProjectIntro } from './project/ProjectIntro'
import { ProjectNotes } from './project/ProjectNotes'
import { useEscBack } from './project/useEscBack'
import styles from './ProjectPage.module.css'

/* Página de detalhes: /projetos/:slug */
export default function ProjectPage() {
  usePageScroll()
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project || !hasPage(project)) return <NotFound />
  return <ProjectView key={project.slug} project={project} />
}

function ProjectView({ project }: { project: Project }) {
  const [viewer, setViewer] = useState<number | null>(null)
  const media = useMemo(() => projectMedia(project), [project])
  const close = useCallback(() => setViewer(null), [])

  useEffect(() => {
    const previous = document.title
    document.title = `${project.title} — Kaike Alves`
    return () => {
      document.title = previous
    }
  }, [project.title])

  useEscBack(project.slug)

  const style = { '--accent': project.accent ?? 'var(--signal)' } as CSSProperties
  const notes = project.details?.notes

  const study = caseStudies[project.slug]
  if (study) {
    // case em capítulos: abertura e capítulos próprios; ampliação, próximo projeto e rodapé compartilhados
    return (
      <main id="conteudo" className={styles.page} style={style}>
        <CaseStudyView project={project} study={study} onOpen={setViewer} />
        <NextProject project={project} />
        <ProjectFooter />
        <Lightbox project={project} items={media} index={viewer} onIndex={setViewer} onClose={close} />
      </main>
    )
  }

  return (
    <main id="conteudo" className={styles.page} style={style}>
      <ProjectHead project={project} onOpen={setViewer} />
      <ProjectIntro project={project} />
      <ProjectGallery project={project} onOpen={setViewer} />
      <ProjectNotes notes={notes} />
      <NextProject project={project} />
      <ProjectFooter />
      <Lightbox project={project} items={media} index={viewer} onIndex={setViewer} onClose={close} />
    </main>
  )
}
