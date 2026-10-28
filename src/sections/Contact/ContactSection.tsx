import { profile, sectionInfo } from '@/content'
import { SectionHead } from '@/components/SectionHead'
import { Arrow, SocialIcon } from '@/components/Icons'
import { ExampleBadge } from '@/components/ExampleBadge'
import { useScrollTo } from '@/lib/smooth-scroll'
import s from './Contact.module.css'

/*
  CONTATO — só links diretos, sem formulário nem convite longo.
  As redes principais (Instagram e LinkedIn) em linhas grandes; as demais,
  se houver, menores logo abaixo. Rodapé com o voltar ao topo.
*/
export function ContactSection() {
  const info = sectionInfo('contato')
  const scrollTo = useScrollTo()
  if (!info) return null

  const primary = profile.socials.filter((x) => x.primary)
  const secondary = profile.socials.filter((x) => !x.primary)

  return (
    <section id="contato" aria-labelledby="contato-titulo" className={s.section}>
      <div className="container">
        <SectionHead
          id="contato-titulo"
          index={info.index}
          label={info.label}
          title={
            <>
              Onde me <em>encontrar</em>
            </>
          }
        />

        <ul className={s.links}>
          {primary.map((social) => {
            const pending = social.url.trim() === ''
            const inner = (
              <>
                <SocialIcon network={social.network} size={28} className={s.icon} />
                <span className={s.network}>{social.label}</span>
                {social.handle && <span className={s.handle}>{social.handle}</span>}
                <ExampleBadge show={pending} className={s.pending} label="Pendente" title="Sem link ainda — some no site publicado" />
                <Arrow size={28} className={s.arrow} />
              </>
            )
            return (
              <li key={social.network + social.label}>
                {pending ? (
                  <span className={s.link} data-pending="">
                    {inner}
                  </span>
                ) : (
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.link}
                    data-cursor="link"
                  >
                    {inner}
                    <span className="visually-hidden"> (abre em nova aba)</span>
                  </a>
                )}
              </li>
            )
          })}
        </ul>

        {secondary.length > 0 && (
          <ul className={s.secondary}>
            {secondary.map((social) => (
              <li key={social.network + social.label}>
                <a href={social.url} target="_blank" rel="noopener noreferrer" className={s.small}>
                  <SocialIcon network={social.network} size={16} />
                  {social.label}
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className={['container', s.footer].join(' ')}>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className={s.footRole}>{profile.role}</p>
        <button type="button" className={s.top} onClick={() => scrollTo(0)}>
          Voltar ao topo
          <Arrow size={14} direction="up" />
        </button>
      </footer>
    </section>
  )
}
