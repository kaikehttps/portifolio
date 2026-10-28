import { useRef, type CSSProperties } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { featuredProjects, profile, projects, sectionInfo, sections } from '@/content'
import { Star } from '@/components/Icons'
import { useFinePointer, useReducedMotion } from '@/lib/hooks'
import { useIntroDone } from '@/lib/intro'
import { axesFor, useNameEngine, type EngineMode } from './useNameEngine'
import { HeroBand } from './HeroBand'
import { HeroReel } from './HeroReel'
import styles from './Hero.module.css'

/*
  HERO — a cartela de título.
  KAIKE monumental (ajustado à largura) + "Alves" em serifa colidindo,
  as telas dos projetos em destaque ao fundo (HeroReel) e a faixa inferior.
*/

export function Hero() {
  const reduce = !!useReducedMotion()
  const fine = useFinePointer()
  const introDone = useIntroDone()

  const rootRef = useRef<HTMLElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)

  const mode: EngineMode = reduce ? 'off' : fine ? 'pointer' : 'wave'
  // medição com o pico do modo atual (sem movimento: sem reserva, 100% da largura)
  const axes = axesFor(mode)
  useNameEngine({ root: rootRef, box: boxRef, measure: measureRef, mode, active: introDone })

  // saída com a rolagem (só transform)
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const alvesX = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const nameDrift = reduce ? undefined : { y: nameY, scale: nameScale }
  const alvesDrift = reduce ? undefined : { x: alvesX, y: nameY }

  const anim = reduce ? 'still' : introDone ? 'go' : 'wait'
  const letters = Array.from(profile.firstName.toUpperCase())
  const reel = featuredProjects.length > 0 ? featuredProjects : projects

  const chars = () =>
    letters.map((ch, i) => (
      <span key={i} className={styles.char} data-char={i} style={{ '--i': i } as CSSProperties}>
        {ch}
      </span>
    ))
  const measureRow = (wdth: number, wght: number) =>
    letters.map((ch, i) => (
      <span key={i} style={{ fontVariationSettings: `'wdth' ${wdth}, 'wght' ${wght}` }}>
        {ch}
      </span>
    ))

  return (
    <section id="inicio" ref={rootRef} className={styles.hero} aria-labelledby="hero-title" data-anim={anim}>
      <HeroReel projects={reel} active={introDone} reduce={reduce} />

      {/* ── Palco: o nome ── */}
      <div className={styles.stage}>
        <div className={styles.nameBlock} ref={boxRef}>
          <m.h1 id="hero-title" className={styles.title} style={nameDrift}>
            <span className="visually-hidden">{profile.name}</span>
            <span className={`t-display ${styles.line}`} aria-hidden="true">
              {chars()}
            </span>
          </m.h1>

          <m.span className={styles.alves} style={alvesDrift} aria-hidden="true">
            <span className={`t-serif ${styles.alvesText}`}>{profile.lastName}</span>
          </m.span>

          <p className={styles.sticker}>
            <Star size={10} className={styles.stickerStar} />
            {profile.role}
          </p>

          {/* clone oculto: mede as letras em repouso e no pico do eixo */}
          <span ref={measureRef} className={`t-display ${styles.measure}`} aria-hidden="true">
            <span data-m="rest">{measureRow(axes.wdRest, axes.wgRest)}</span>
            <span data-m="max">{measureRow(axes.wdMax, axes.wgMax)}</span>
          </span>
        </div>
      </div>

      <HeroBand
        intro={profile.intro}
        disciplines={profile.disciplines}
        next={sectionInfo('projetos') ?? sections[0]}
      />
    </section>
  )
}
