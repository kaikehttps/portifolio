import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import type { MediaRef, Project } from '@/content'
import { projectPicture, projectVideo } from '@/lib/media'
import { ProjectArt } from './ProjectArt'
import styles from './Picture.module.css'

/**
 * Imagem responsiva de projeto (AVIF/WebP em vários tamanhos).
 * - layout="fill": preenche o pai (que define o tamanho; use position: relative).
 * - layout="natural": ocupa a largura e mantém a proporção da imagem.
 * Se o arquivo não existir, desenha a arte tipográfica do projeto.
 * Se houver um vídeo com o mesmo nome (capa.webm ao lado de capa.jpg), ele toca em loop
 * por cima da imagem — que segue como pôster e como versão sem movimento.
 */
export function Picture({
  project,
  media,
  sizes,
  layout = 'fill',
  fit = 'cover',
  position,
  priority = false,
  className,
  style,
  fallback,
  clip,
}: {
  project: Project
  media: MediaRef
  /** Ex.: "(min-width: 1024px) 60vw, 100vw" — essencial para baixar o tamanho certo. */
  sizes: string
  layout?: 'fill' | 'natural'
  fit?: 'cover' | 'contain'
  /** object-position, ex.: "top center" */
  position?: string
  priority?: boolean
  className?: string
  style?: CSSProperties
  fallback?: ReactNode
  /** Vídeo a tocar por cima: outro nome de arquivo (ex.: 'capa-topo'), ou false para nenhum. Padrão: o mesmo nome da imagem. */
  clip?: string | false
}) {
  const pic = projectPicture(project.slug, media.src)
  const video = clip === false ? undefined : projectVideo(project.slug, clip ?? media.src)
  const cls = [styles.picture, styles[layout], className].filter(Boolean).join(' ')

  if (!pic) {
    if (import.meta.env.DEV && !project.example) {
      console.warn(`[Picture] imagem não encontrada: src/assets/projects/${project.slug}/${media.src}.*`)
    }
    const fallbackRatio = media.frame === 'mobile' ? '9 / 19.5' : '16 / 10'
    return (
      <div
        className={cls}
        style={{ ...(layout === 'natural' ? { aspectRatio: fallbackRatio } : null), ...style }}
        role="img"
        aria-label={media.alt}
      >
        {fallback ?? <ProjectArt project={project} shape={media.frame === 'mobile' ? 'phone' : 'wide'} />}
      </div>
    )
  }

  const ratio = `${pic.img.w} / ${pic.img.h}`
  const box = { ...(layout === 'natural' ? { aspectRatio: ratio } : null), ...style }
  const picture = (
    <picture className={video ? styles.under : cls} style={video ? undefined : box}>
      {pic.sources.avif && <source type="image/avif" srcSet={pic.sources.avif} sizes={sizes} />}
      {pic.sources.webp && <source type="image/webp" srcSet={pic.sources.webp} sizes={sizes} />}
      <img
        src={pic.img.src}
        width={pic.img.w}
        height={pic.img.h}
        alt={media.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
        style={{ objectFit: fit, objectPosition: position }}
      />
    </picture>
  )
  if (!video) return picture
  return (
    <div className={cls} style={box}>
      {picture}
      <LoopVideo src={video} fit={fit} position={position} />
    </div>
  )
}

/**
 * Vídeo mudo em loop sobre a imagem: só baixa e toca enquanto está na tela,
 * aparece com fade quando começa. Sem vídeo com movimento reduzido ou economia de dados.
 */
function LoopVideo({ src, fit, position }: { src: string; fit: 'cover' | 'contain'; position?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const saveData =
    typeof navigator !== 'undefined' &&
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
  const off = reduce || saveData

  useEffect(() => {
    const v = ref.current
    if (!v || off) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { rootMargin: '200px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [off])

  if (off) return null
  return (
    <video
      ref={ref}
      className={styles.video}
      data-on={playing ? '' : undefined}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      onPlaying={() => setPlaying(true)}
      style={{ objectFit: fit, objectPosition: position }}
    />
  )
}
