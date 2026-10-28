import { profile, sectionInfo } from '@/content'
import { SectionHead } from '@/components/SectionHead'
import { FadeUp } from '@/components/Reveal'
import { Star } from '@/components/Icons'
import { Lead } from './Lead'
import s from './About.module.css'

/*
  SOBRE — pequeno de propósito: uma frase em serifa à esquerda e, ao lado,
  até dois parágrafos curtos e a assinatura. Sem foto.
*/
export function AboutSection() {
  const info = sectionInfo('sobre')
  if (!info) return null

  const { lead, body = [], facts = [] } = profile.about
  const paragraphs = body.filter((p) => p.trim() !== '').slice(0, 2)

  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className={s.section}>
      <div className="container">
        <SectionHead id="sobre-titulo" index={info.index} label={info.label} title="Sobre mim" />

        <div className={s.body}>
          <Lead text={lead} className={s.lead} />

          {(paragraphs.length > 0 || facts.length > 0) && (
            <FadeUp className={s.text} amount={0.4}>
              {paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
              {facts.length > 0 && (
                <dl className={s.facts}>
                  {facts.map((fact) => (
                    <div key={fact.label} className={s.fact}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </FadeUp>
          )}

          <FadeUp className={s.sign} amount={0.8}>
            <Star size={12} className={s.star} />
            <span className={s.name}>{profile.name}</span>
            <span className={s.signRole}>{profile.role}</span>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
