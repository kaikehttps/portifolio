import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { Project } from '@/content'
import { CropMarks } from '@/components/CropMarks'
import { PhoneFrame } from '@/components/Frames'
import { Picture } from '@/components/Picture'
import { ease } from '@/lib/motion'
import { Zoom } from './Bits'
import { figLabel, siteUrl } from './figures'
import s from './ProjectCover.module.css'

/**
 * Capa quase sangrada. Entrada: um fio de luz se acende e a cortina abre até
 * o letterbox (2.39:1); ao rolar até o centro, as barras recolhem e a imagem
 * aparece inteira. Parallax leve na imagem.
 */
export function ProjectCover({
  project,
  onOpen,
  className,
  ready = true,
}: {
  project: Project
  onOpen: (index: number) => void
  className?: string
  ready?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const media = project.cover
  const phone = media.frame === 'mobile'

  const { scrollYProgress: approach } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const bars = useTransform(approach, [0.2, 1], [1, 0])
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(pass, [0, 1], ['-4%', '4%'])

  const host = siteUrl(project)?.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const label = figLabel(0, media)

  return (
    <figure ref={ref} className={[s.cover, phone && s.isPhone, className].filter(Boolean).join(' ')}>
      <div className={s.shell}>
        <div className={s.frame}>
          <m.div className={s.media} style={reduce ? undefined : { y: drift }}>
            {phone ? (
              <div className={s.stage}>
                <span className={`t-display ${s.ghost}`} aria-hidden="true">
                  {project.title}
                </span>
                <div className={s.phoneSlot}>
                  <PhoneFrame>
                    <Picture project={project} media={media} sizes="(min-width: 641px) 30vw, 60vw" priority />
                  </PhoneFrame>
                </div>
              </div>
            ) : (
              <Picture project={project} media={media} sizes="100vw" priority />
            )}
          </m.div>

          {!reduce && (
            <>
              <m.span className={`${s.bar} ${s.top}`} style={{ scaleY: bars }} aria-hidden="true" />
              <m.span className={`${s.bar} ${s.bottom}`} style={{ scaleY: bars }} aria-hidden="true" />
              <m.span
                className={`${s.curtain} ${s.top}`}
                aria-hidden="true"
                initial={{ scaleY: 1 }}
                animate={ready ? { scaleY: 0 } : undefined}
                transition={{ duration: 1.4, ease: ease.inOut, delay: 0.95 }}
              />
              <m.span
                className={`${s.curtain} ${s.bottom}`}
                aria-hidden="true"
                initial={{ scaleY: 1 }}
                animate={ready ? { scaleY: 0 } : undefined}
                transition={{ duration: 1.4, ease: ease.inOut, delay: 0.95 }}
              />
              <m.span
                className={s.seam}
                aria-hidden="true"
                initial={{ scaleX: 0, opacity: 1 }}
                animate={ready ? { scaleX: 1, opacity: [1, 1, 0] } : undefined}
                transition={{
                  scaleX: { duration: 0.8, ease: ease.out, delay: 0.35 },
                  opacity: { duration: 1.6, times: [0, 0.6, 1], delay: 0.35 },
                }}
              />
            </>
          )}
          <Zoom label={label} onOpen={() => onOpen(0)} />
        </div>
        <CropMarks className={s.marks} />
      </div>

      <figcaption className={s.cap}>
        <span className="t-label">{label}</span>
        <span className={s.capRule} aria-hidden="true" />
        {host && (
          <span className="t-label t-dim" aria-hidden="true">
            {host}
          </span>
        )}
      </figcaption>
    </figure>
  )
}
