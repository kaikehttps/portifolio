import type { MediaRef, Project } from '@/content'
import { pictureRatio, projectPicture } from '@/lib/media'

/*
  Numeração de catálogo das imagens da página.
  Índice 0 = capa (FIG. 01); a galeria continua de FIG. 02 em diante.
*/

export const pad = (n: number) => String(n).padStart(2, '0')

export function figNo(index: number): string {
  return `FIG. ${pad(index + 1)}`
}

export function figLabel(index: number, media: MediaRef): string {
  const caption = media.caption ?? (index === 0 ? 'Capa' : undefined)
  return caption ? `${figNo(index)} — ${caption}` : figNo(index)
}

/** Proporção largura/altura do arquivo; sem arquivo, a proporção padrão da moldura. */
export function mediaRatio(project: Project, media: MediaRef): number {
  return pictureRatio(projectPicture(project.slug, media.src)) ?? (media.frame === 'mobile' ? 9 / 19.5 : 16 / 10)
}

/** Endereço do site do projeto (para a barra do BrowserFrame). */
export function siteUrl(project: Project): string | undefined {
  return project.links?.find((l) => l.kind === 'site')?.url
}

/** Todas as imagens na ordem de leitura: capa + galeria. */
export function projectMedia(project: Project): MediaRef[] {
  return [project.cover, ...(project.gallery ?? [])]
}
