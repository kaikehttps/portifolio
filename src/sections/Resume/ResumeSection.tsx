import { profile, resumeUrl, sectionInfo } from '@/content'
import { SectionHead } from '@/components/SectionHead'
import { Arrow } from '@/components/Icons'
import { ExampleBadge } from '@/components/ExampleBadge'
import { FadeUp } from '@/components/Reveal'
import s from './Resume.module.css'

/*
  CURRÍCULO — no lugar da trajetória: experiência, formação e detalhes
  ficam no PDF. Uma linha grande para baixar e um link para abrir no navegador.
  Sem PDF em src/assets/curriculo/, a seção só aparece em desenvolvimento (como pendente).
*/

/** Folha com a dobra no canto: o ícone do documento. */
function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" className={s.doc}>
      <path d="M6 2.75h8.5L19.25 7.5v13.75H6z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.25 2.75V7.75h5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12h7M9 15h7M9 18h4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function ResumeSection() {
  const info = sectionInfo('curriculo')
  if (!info) return null

  const updated = profile.resume?.updated?.trim()
  const fileName = `${profile.name.replace(/\s+/g, '-')}-Curriculo.pdf`
  const meta = (
    <span className={s.meta}>
      PDF{updated && <> · atualizado em {updated}</>}
    </span>
  )

  return (
    <section id="curriculo" aria-labelledby="curriculo-titulo" className={s.section}>
      <div className="container">
        <SectionHead
          id="curriculo-titulo"
          index={info.index}
          label={info.label}
          title={
            <>
              Currículo <em>completo</em>
            </>
          }
          aside="Experiência, formação e projetos reunidos em um PDF para baixar ou imprimir."
        />

        <FadeUp amount={0.4}>
          {resumeUrl ? (
            <>
              <a href={resumeUrl} download={fileName} className={s.download} data-cursor="link">
                <DocIcon />
                <span className={s.label}>Baixar currículo</span>
                {meta}
                <span className={s.go} aria-hidden="true">
                  <Arrow size={22} direction="down" />
                </span>
              </a>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={s.view}>
                Ver no navegador
                <Arrow size={14} />
                <span className="visually-hidden"> (abre em nova aba)</span>
              </a>
            </>
          ) : (
            <div className={s.download} data-pending="">
              <DocIcon />
              <span className={s.label}>Baixar currículo</span>
              <ExampleBadge
                show
                className={s.badge}
                label="Pendente"
                title="Coloque o PDF em src/assets/curriculo/ — sem ele, a seção some do site publicado"
              />
              <span className={s.go} aria-hidden="true">
                <Arrow size={22} direction="down" />
              </span>
            </div>
          )}
        </FadeUp>
      </div>
    </section>
  )
}
