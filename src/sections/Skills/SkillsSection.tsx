import type { CSSProperties } from 'react'
import { sectionInfo, stack, type StackItem } from '@/content'
import { SectionHead } from '@/components/SectionHead'
import { ExampleBadge } from '@/components/ExampleBadge'
import { TECH_ICONS } from '@/lib/tech-icons'
import s from './Skills.module.css'

/*
  SKILLS E FERRAMENTAS — uma faixa única e discreta: logo + nome de cada
  tecnologia passando devagar, na ordem dos grupos de src/content/stack.ts.
  Pausa com o mouse, com foco ou com movimento reduzido (aí vira lista corrida).
  Os itens de "No radar" (grupo `soft`) ficam mais apagados, no fim.
*/

/** Marcas quase pretas (Next.js, Vercel…) somem no fundo: só ganham a cor da marca se forem claras. */
function brandColor(hex: string): string | undefined {
  const n = parseInt(hex, 16)
  const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255
  return lum > 0.28 ? `#${hex}` : undefined
}

function Tool({ item, soft }: { item: StackItem; soft?: boolean }) {
  const icon = item.icon ? TECH_ICONS[item.icon] : undefined
  const color = icon ? brandColor(icon.hex) : undefined
  return (
    <li className={s.tool} data-soft={soft ? '' : undefined} style={color ? ({ '--brand': color } as CSSProperties) : undefined}>
      <span className={s.icon} aria-hidden="true">
        {icon ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d={icon.path} />
          </svg>
        ) : (
          <span className={s.initial}>{item.name.length <= 2 ? item.name : item.name.charAt(0)}</span>
        )}
      </span>
      <span className={s.name}>{item.name}</span>
      {item.note && <span className={s.note}>{item.note}</span>}
      <ExampleBadge show={item.example} />
    </li>
  )
}

export function SkillsSection() {
  const info = sectionInfo('ferramentas')
  if (!info) return null

  // uma lista só: os grupos principais primeiro, "No radar" por último
  const ordered = [...stack].sort((a, b) => Number(!!a.soft) - Number(!!b.soft))
  const items = ordered.flatMap((g) => g.items.map((item) => ({ item, soft: !!g.soft })))
  const seen = new Set<string>()
  const unique = items.filter(({ item }) => (seen.has(item.name) ? false : (seen.add(item.name), true)))

  return (
    <section id="ferramentas" aria-labelledby="ferramentas-titulo" className={s.section}>
      <div className="container">
        <SectionHead
          id="ferramentas-titulo"
          index={info.index}
          label={info.label}
        />
      </div>

      <div className={s.strip}>
        <div className={s.rail}>
          {/* lista lida uma vez; a cópia que fecha o loop fica escondida dos leitores de tela */}
          <ul className={s.row} aria-label="Tecnologias que eu uso">
            {unique.map(({ item, soft }) => (
              <Tool key={item.name} item={item} soft={soft} />
            ))}
          </ul>
          <ul className={s.row} aria-hidden="true">
            {unique.map(({ item, soft }) => (
              <Tool key={item.name} item={item} soft={soft} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
