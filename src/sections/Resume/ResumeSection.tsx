import { profile, resumeUrl, sectionInfo } from '@/content'
import { SectionHead } from '@/components/SectionHead'
import { Arrow, FileIcon } from '@/components/Icons'
import { ExampleBadge } from '@/components/ExampleBadge'
import { FadeUp } from '@/components/Reveal'
import s from './Resume.module.css'

/*
  CURRÍCULO — a pílula "Baixar currículo" (o mesmo desenho do "Contatar" da barra),
  o link para abrir o PDF no navegador e uma legenda em mono.
  Sem PDF em src/assets/curriculo/, a seção só aparece em desenvolvimento (como pendente).
*/
export function ResumeSection() {
  const info = sectionInfo('curriculo')
  if (!info) return null

  const fileName = `${profile.name.replace(/\s+/g, '-')}-Curriculo.pdf`

  // duas setas empilhadas: no hover a de cima sai por baixo e a outra entra por cima (um "download")
  const icon = (
    <span className={s.icon} aria-hidden="true">
      <span className={s.arrows}>
        <Arrow size={17} direction="down" />
        <Arrow size={17} direction="down" />
      </span>
    </span>
  )

  return (
    <section id="curriculo" aria-labelledby="curriculo-titulo" className={s.section}>
      <div className="container">
        <SectionHead id="curriculo-titulo" index={info.index} label={info.label} />

        <FadeUp amount={0.5}>
          <div className={s.stage}>
            <div className={s.actions}>
              {resumeUrl ? (
                <>
                  <a href={resumeUrl} download={fileName} className={s.pill}>
                    <FileIcon size={20} className={s.file} />
                    <span className={s.text}>Baixar currículo</span>
                    {icon}
                  </a>
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={s.view}>
                    Ver no navegador
                    <span className="visually-hidden"> (abre em nova aba)</span>
                  </a>
                </>
              ) : (
                <>
                  <ExampleBadge
                    show
                    label="Pendente"
                    title="Coloque o PDF em src/assets/curriculo/ — sem ele, a seção some do site publicado"
                  />
                  <span className={s.pill} data-pending="">
                    <FileIcon size={20} className={s.file} />
                    <span className={s.text}>Baixar currículo</span>
                    {icon}
                  </span>
                </>
              )}
            </div>

            <p className={s.caption}>
              <span className={s.mark} aria-hidden="true" />
              PDF · Currículo profissional
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
