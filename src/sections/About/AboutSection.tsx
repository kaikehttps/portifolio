import { profile, sectionInfo } from '@/content'
import { SectionHead } from '@/components/SectionHead'
import { FadeUp } from '@/components/Reveal'
import s from './About.module.css'

/*
  SOBRE — minimalista: a apresentação à esquerda e, ao lado, a citação de
  Albert Camus. (A cena de Sísifo está guardada em ./Sisyphus.tsx, fora de uso.)
*/
export function AboutSection() {
  const info = sectionInfo('sobre')
  if (!info) return null

  const { body = [], quote } = profile.about
  const paragraphs = body.filter((p) => p.trim() !== '').slice(0, 2)

  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className={s.section}>
      <div className="container">
        <SectionHead id="sobre-titulo" index={info.index} label={info.label} />

        <div className={s.body}>
          <FadeUp className={s.copy} amount={0.4}>
            {paragraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </FadeUp>

          {quote && (
            <FadeUp className={s.quote} amount={0.6}>
              <figure>
                <blockquote>
                  <p className={s.quoteText}>“{marked(quote.text)}”</p>
                </blockquote>
                <figcaption className={s.cite}>
                  — {quote.author}
                  {quote.source && (
                    <>
                      , <cite>{quote.source}</cite>
                    </>
                  )}
                  {quote.year && <> ({quote.year})</>}
                </figcaption>
              </figure>
            </FadeUp>
          )}
        </div>
      </div>
    </section>
  )
}

/** `[palavra]` ganha a cor de sinal. */
function marked(text: string) {
  return text.split(/\[([^\]]+)\]/).map((part, i) =>
    i % 2 ? (
      <span key={i} className={s.mark}>
        {part}
      </span>
    ) : (
      part
    ),
  )
}
