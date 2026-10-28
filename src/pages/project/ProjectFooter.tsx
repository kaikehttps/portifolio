import { profile } from '@/content'
import { SocialIcon } from '@/components/Icons'
import s from './ProjectFooter.module.css'

/** Rodapé curto: assinatura e redes (só as que têm endereço). */
export function ProjectFooter() {
  const socials = profile.socials.filter((so) => so.url.trim() !== '')
  return (
    <footer className={`wrap ${s.foot}`}>
      <p className={`t-label ${s.sign}`}>
        <span>{profile.name}</span>
        <span className="t-dim">{profile.role}</span>
      </p>
      {socials.length > 0 && (
        <ul className={s.socials}>
          {socials.map((so) => (
            <li key={so.network + so.url}>
              <a href={so.url} target="_blank" rel="noopener noreferrer" className={s.social}>
                <SocialIcon network={so.network} size={15} />
                <span className="t-label">{so.label}</span>
                <span className="visually-hidden"> (abre em nova aba)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </footer>
  )
}
