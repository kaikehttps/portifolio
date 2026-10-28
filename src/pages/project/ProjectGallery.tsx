import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useId, useMemo, useRef } from 'react'
import type { MediaRef, Project } from '@/content'
import { CropMarks } from '@/components/CropMarks'
import { BrowserFrame, PhoneFrame } from '@/components/Frames'
import { Arrow } from '@/components/Icons'
import { Picture } from '@/components/Picture'
import { ClipReveal, FadeUp } from '@/components/Reveal'
import { useIsMobile } from '@/lib/hooks'
import { Zoom } from './Bits'
import { figLabel, figNo, mediaRatio, pad, siteUrl } from './figures'
import { composeGallery, type Shot, type WideVariant } from './gallery'
import s from './ProjectGallery.module.css'

type Open = (index: number) => void

/** Imagem com cortina de revelação, com ou sem moldura de navegador. */
function Screen({
  project,
  media,
  chrome,
  sizes,
}: {
  project: Project
  media: MediaRef
  chrome: 'browser' | 'plain'
  sizes: string
}) {
  const ratio = String(mediaRatio(project, media))
  const pic = (
    <ClipReveal>
      <Picture project={project} media={media} sizes={sizes} />
    </ClipReveal>
  )
  if (chrome === 'browser') {
    return (
      <BrowserFrame url={siteUrl(project)} ratio={ratio}>
        {pic}
      </BrowserFrame>
    )
  }
  return (
    <div className={s.plain} style={{ aspectRatio: ratio }}>
      {pic}
    </div>
  )
}

function Caption({ shot, side = false }: { shot: Shot; side?: boolean }) {
  return (
    <figcaption className={side ? s.sideCap : s.cap}>
      {side && (
        <span className={`t-display ${s.capBig}`} aria-hidden="true">
          {pad(shot.index + 1)}
        </span>
      )}
      <span className={`t-label ${s.capNo}`}>{figNo(shot.index)}</span>
      {shot.media.caption && <span className={s.capText}>{shot.media.caption}</span>}
    </figcaption>
  )
}

/** Cota técnica ao lado da imagem: fio vertical com a proporção do quadro (eco do 2.39 : 1 da capa). */
function Dim({ project, media }: { project: Project; media: MediaRef }) {
  const ratio = mediaRatio(project, media)
  return (
    <span className={s.dim} aria-hidden="true">
      <span className={`t-label t-mute ${s.dimLabel}`}>{ratio.toFixed(2)} : 1</span>
    </span>
  )
}

/** Captura larga: sangrada ou deslocada (9 de 12 colunas) com legenda lateral. */
function Wide({ project, shot, variant, onOpen }: { project: Project; shot: Shot; variant: WideVariant; onOpen: Open }) {
  const bleed = variant === 'bleed'
  const plain = bleed || shot.media.frame === 'none'
  return (
    <figure className={`${s.wide} ${s[variant]}`}>
      <div className={s.media}>
        <Screen
          project={project}
          media={shot.media}
          chrome={plain ? 'plain' : 'browser'}
          sizes={bleed ? '100vw' : '(min-width: 1025px) 74vw, (min-width: 641px) 90vw, 100vw'}
        />
        {plain && !bleed && <CropMarks />}
        <Zoom label={figLabel(shot.index, shot.media)} onOpen={() => onOpen(shot.index)} />
      </div>
      {!bleed && <Dim project={project} media={shot.media} />}
      <Caption shot={shot} side={!bleed} />
    </figure>
  )
}

/** Dupla: uma captura maior emoldurada e uma menor, solta e mais baixa. */
function Duo({ project, shots, onOpen }: { project: Project; shots: [Shot, Shot]; onOpen: Open }) {
  const [a, b] = shots
  return (
    <div className={s.duo}>
      <figure className={s.duoA}>
        <div className={s.media}>
          <Screen
            project={project}
            media={a.media}
            chrome={a.media.frame === 'none' ? 'plain' : 'browser'}
            sizes="(min-width: 1025px) 56vw, 100vw"
          />
          <Zoom label={figLabel(a.index, a.media)} onOpen={() => onOpen(a.index)} />
        </div>
        <Caption shot={a} />
      </figure>
      <figure className={s.duoB}>
        <div className={s.media}>
          <Screen project={project} media={b.media} chrome="plain" sizes="(min-width: 1025px) 38vw, 82vw" />
          <CropMarks />
          <Zoom label={figLabel(b.index, b.media)} onOpen={() => onOpen(b.index)} />
        </div>
        <Caption shot={b} />
      </figure>
    </div>
  )
}

/** Fileira de celulares em escada, com parallax; no celular, 2 lado a lado ou carrossel. */
function Phones({ project, shots, alt, onOpen }: { project: Project; shots: Shot[]; alt: boolean; onOpen: Open }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const mobile = useIsMobile()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // deslocamento contido (±40px ≈ 7% do aparelho): legendas nunca encostam na borda do painel
  const up = useTransform(scrollYProgress, [0, 1], [40, -40])
  const down = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const still = reduce || mobile
  const scroller = mobile && shots.length >= 3
  // painel espelhado usa a palavra da primeira tela, para o letreiro não se repetir
  const ghost = alt ? (shots[0].media.caption?.split(',')[0]?.trim() || project.title) : project.title

  return (
    <div ref={ref} className={s.phones} data-count={shots.length} data-alt={alt || undefined}>
      <span className={`t-display ${s.ghost}`} aria-hidden="true">
        {ghost}
      </span>
      <p className={`t-label t-mute ${s.phonesMeta}`} aria-hidden="true">
        <span>{pad(shots.length)} telas</span>
        <span>9:19.5</span>
      </p>
      <div className={scroller ? s.track : s.row} data-cursor={scroller ? 'drag' : undefined}>
        {shots.map((shot, i) => (
          <m.figure key={shot.index} className={s.phone} style={still ? undefined : { y: i % 2 ? down : up }}>
            <FadeUp delay={i * 0.12} amount={0.2}>
              <div className={s.phoneMedia}>
                <PhoneFrame>
                  <Picture
                    project={project}
                    media={shot.media}
                    sizes="(min-width: 1025px) 300px, (min-width: 641px) 30vw, 62vw"
                  />
                </PhoneFrame>
                <Zoom label={figLabel(shot.index, shot.media)} onOpen={() => onOpen(shot.index)} />
              </div>
            </FadeUp>
            <figcaption className={s.phoneCap}>
              <span className="t-label">{figNo(shot.index)}</span>
              {shot.media.caption && <span className={s.phoneCapText}>{shot.media.caption}</span>}
            </figcaption>
          </m.figure>
        ))}
      </div>
      {scroller && (
        <p className={`t-label t-dim ${s.hint}`} aria-hidden="true">
          Deslize <Arrow direction="right" size={12} />
        </p>
      )}
    </div>
  )
}

/** Galeria: compõe as imagens por tipo de moldura para criar ritmo. */
export function ProjectGallery({ project, onOpen }: { project: Project; onOpen: Open }) {
  const id = useId()
  const gallery = project.gallery
  const blocks = useMemo(() => composeGallery(gallery ?? [], 1), [gallery])
  if (!gallery || gallery.length === 0) return null
  const last = gallery.length + 1

  return (
    <section className={s.gallery} aria-labelledby={id}>
      <div className={`wrap ${s.head}`}>
        <h2 id={id} className={`t-label ${s.title}`}>
          <span className={s.square} aria-hidden="true" />
          Fotogramas
        </h2>
        <span className={s.rule} aria-hidden="true" />
        <span className="t-label t-dim">{pad(gallery.length)} quadros</span>
        <span className={s.fill} aria-hidden="true" />
        <span className={`t-label t-mute ${s.range}`} aria-hidden="true">
          FIG. 02 — {pad(last)}
        </span>
      </div>

      <div className={`wrap ${s.blocks}`}>
        {blocks.map((block, b) => {
          if (block.kind === 'wide') {
            return (
              <Wide
                key={block.shot.index}
                project={project}
                shot={block.shot}
                variant={block.variant}
                onOpen={onOpen}
              />
            )
          }
          if (block.kind === 'duo') {
            return <Duo key={block.shots[0].index} project={project} shots={block.shots} onOpen={onOpen} />
          }
          // fileiras de celular alternam o espelhamento para não repetir a mesma cena
          const alt = blocks.slice(0, b).filter((x) => x.kind === 'phones').length % 2 === 1
          return <Phones key={block.shots[0].index} project={project} shots={block.shots} alt={alt} onOpen={onOpen} />
        })}
      </div>
    </section>
  )
}
