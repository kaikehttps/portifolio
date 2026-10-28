import { projects as allProjects } from './projects'
import { stack as allStack } from './stack'
import { profile as rawProfile } from './profile'
import { resumeUrl } from './resume'
import type { Profile, Project, ProjectKind, ProjectLinkKind, StackGroup } from './types'

export type * from './types'
export { resumeUrl } from './resume'
export { caseStudies, type CaseStudy, type StoryVisual } from './cases'

/*
  Exemplos aparecem em `npm run dev` e somem no build.
  Força: VITE_SHOW_EXAMPLES=true (mostra sempre) | false (esconde sempre).
*/
const flag = import.meta.env.VITE_SHOW_EXAMPLES as string | undefined
export const SHOW_EXAMPLES = flag === 'true' ? true : flag === 'false' ? false : import.meta.env.DEV

const keep = <T extends { example?: boolean }>(item: T) => SHOW_EXAMPLES || !item.example

export const projects: Project[] = allProjects.filter(keep)
export const stack: StackGroup[] = allStack
  .map((group) => ({ ...group, items: group.items.filter(keep) }))
  .filter((group) => group.items.length > 0)

/** Lembrete exibido só em desenvolvimento enquanto o "Sobre" não tem texto. */
const ABOUT_PLACEHOLDER = 'Espaço para sua apresentação: duas ou três frases sobre como você trabalha e o que procura construir.'

const aboutBody = (rawProfile.about.body ?? []).filter((p) => p.trim() !== '')

export const profile: Profile = {
  ...rawProfile,
  about: {
    ...rawProfile.about,
    body: aboutBody.length > 0 || !SHOW_EXAMPLES ? aboutBody : [ABOUT_PLACEHOLDER],
  },
  socials: rawProfile.socials.filter((s) => SHOW_EXAMPLES || s.url.trim() !== ''),
}

/* ── Projetos: derivados ─────────────────────────────────────── */

export const KIND_LABEL: Record<ProjectKind, string> = {
  app: 'Aplicativo',
  site: 'Site',
  produto: 'Produto',
  experimento: 'Experimento',
}

/** Plural para filtros. */
export const KIND_LABEL_PLURAL: Record<ProjectKind, string> = {
  app: 'Apps',
  site: 'Sites',
  produto: 'Produtos',
  experimento: 'Experimentos',
}

export const LINK_LABEL: Record<ProjectLinkKind, string> = {
  site: 'Visitar site',
  appstore: 'App Store',
  googleplay: 'Google Play',
  repo: 'Código',
  video: 'Vídeo',
  outro: 'Link',
}

export const featuredProjects = projects.filter((p) => p.featured)
export const otherProjects = projects.filter((p) => !p.featured)

/** Número de catálogo de um projeto: "01", "02"… pela ordem no arquivo. */
export function projectNumber(project: Project): string {
  return String(projects.indexOf(project) + 1).padStart(2, '0')
}

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

/** Projeto seguinte (circular) para o rodapé da página de detalhes. */
export function nextProject(project: Project): Project | undefined {
  const withPage = projects.filter(hasPage)
  if (withPage.length < 2) return undefined
  const i = withPage.indexOf(project)
  return withPage[(i + 1) % withPage.length]
}

export function hasPage(project: Project): boolean {
  return project.page !== false
}

export function projectPath(project: Project): string {
  return `/projetos/${project.slug}`
}

/** Divide "texto com [destaque]" em partes para renderizar a palavra marcada. */
export function splitMark(text: string): { text: string; marked: boolean }[] {
  return text
    .split(/(\[[^\]]+\])/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('[') && part.endsWith(']')
        ? { text: part.slice(1, -1), marked: true }
        : { text: part, marked: false },
    )
}

/* ── Seções da home (ordem, numeração e visibilidade) ────────── */

export interface SectionInfo {
  id: string
  label: string
  /** "01", "02"… recalculado conforme as seções visíveis. */
  index: string
}

const sectionDefs: { id: string; label: string; visible: boolean }[] = [
  { id: 'projetos', label: 'Projetos', visible: projects.length > 0 },
  { id: 'ferramentas', label: 'Ferramentas', visible: stack.length > 0 },
  { id: 'curriculo', label: 'Currículo', visible: !!resumeUrl || SHOW_EXAMPLES },
  { id: 'sobre', label: 'Sobre', visible: true },
  { id: 'contato', label: 'Contato', visible: true },
]

export const sections: SectionInfo[] = sectionDefs
  .filter((s) => s.visible)
  .map((s, i) => ({ id: s.id, label: s.label, index: String(i + 1).padStart(2, '0') }))

export function sectionInfo(id: string): SectionInfo | undefined {
  return sections.find((s) => s.id === id)
}
