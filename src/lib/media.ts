import type { Picture } from 'vite-imagetools'

/*
  Resolve imagens de src/assets/projects/<slug>/<nome>.(jpg|png|webp)
  para conjuntos AVIF/WebP responsivos (vite-imagetools).
  Capturas de celular (arquivos "mobile-*") usam larguras menores.
*/

const wide = import.meta.glob<Picture>(
  ['../assets/projects/**/*.{jpg,jpeg,png,webp}', '!**/mobile-*'],
  { query: { w: '640;1024;1600;2400', format: 'avif;webp', as: 'picture' }, import: 'default', eager: true },
)

const tall = import.meta.glob<Picture>('../assets/projects/**/mobile-*.{jpg,jpeg,png,webp}', {
  query: { w: '360;720;1170', format: 'avif;webp', as: 'picture' },
  import: 'default',
  eager: true,
})

const index = new Map<string, Picture>()
for (const [path, pic] of Object.entries({ ...wide, ...tall })) {
  const match = path.match(/projects\/([^/]+)\/([^/]+)\.\w+$/)
  if (match) index.set(`${match[1]}/${match[2]}`, pic)
}

/*
  Vídeos: um .webm ou .mp4 com o mesmo nome da imagem (ex.: capa.webm ao lado de capa.jpg)
  toca em loop por cima dela. A imagem continua sendo o pôster e a versão sem movimento.
*/
const clips = import.meta.glob<string>('../assets/projects/**/*.{webm,mp4}', {
  query: '?url',
  import: 'default',
  eager: true,
})
const videos = new Map<string, string>()
for (const [path, url] of Object.entries(clips)) {
  const match = path.match(/projects\/([^/]+)\/([^/]+)\.\w+$/)
  if (match) videos.set(`${match[1]}/${match[2]}`, url)
}

/** Vídeo em loop do projeto com o mesmo nome da imagem, se existir. */
export function projectVideo(slug: string, name: string): string | undefined {
  return videos.get(`${slug}/${name}`)
}

export type { Picture }

/** Nomes das imagens do projeto que começam com `prefix` (ex.: 'galeria-'), em ordem alfabética. */
export function projectImageNames(slug: string, prefix: string): string[] {
  const head = `${slug}/${prefix}`
  return [...index.keys()]
    .filter((key) => key.startsWith(head))
    .map((key) => key.slice(slug.length + 1))
    .sort()
}

/** Imagem otimizada do projeto, ou undefined se o arquivo não existir. */
export function projectPicture(slug: string, name: string): Picture | undefined {
  return index.get(`${slug}/${name}`)
}

/** Proporção (largura / altura) da imagem, se existir. */
export function pictureRatio(pic: Picture | undefined): number | undefined {
  return pic ? pic.img.w / pic.img.h : undefined
}
