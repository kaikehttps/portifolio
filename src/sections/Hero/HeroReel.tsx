import { useEffect, useState } from 'react'
import type { Project } from '@/content'
import { Picture } from '@/components/Picture'
import { projectVideo } from '@/lib/media'
import s from './HeroReel.module.css'

/*
  Fundo do início: as telas dos projetos em destaque ocupam o lado direito,
  sangrando até a borda e dissolvendo no preto do lado do nome — um still de
  filme atrás da cartela, sem moldura. Troca a cada HOLD ms com fusão lenta;
  pausa com o botão, fora da tela ou com movimento reduzido.
*/

const HOLD = 6500

export function HeroReel({ projects, active, reduce }: { projects: Project[]; active: boolean; reduce: boolean }) {
  // capturas de celular não funcionam como fundo largo; capas claras ficam de fora (backdrop: false)
  const items = projects.filter((p) => p.cover.frame !== 'mobile' && p.backdrop !== false)
  const list = items.length > 0 ? items : projects
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const cycling = !reduce && active && !paused && list.length > 1

  useEffect(() => {
    if (!cycling) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % list.length), HOLD)
    return () => window.clearInterval(id)
  }, [cycling, list.length])

  if (list.length === 0) return null

  return (
    <div className={s.reel} data-anim={reduce ? 'still' : undefined}>
      <div className={s.slides} aria-hidden="true">
        {list.map((p, i) => (
          <div key={p.slug} className={s.slide} data-on={i === index ? '' : undefined}>
            <Picture
              project={p}
              media={p.cover}
              sizes="(max-width: 899px) 100vw, 66vw"
              position="64% 30%"
              priority={i === 0}
              // atrás do nome só o movimento do topo do site (capa-topo.webm), e só na imagem em cena
              clip={i === index && projectVideo(p.slug, 'capa-topo') ? 'capa-topo' : false}
            />
          </div>
        ))}
      </div>
      <span className={s.shade} aria-hidden="true" />

      {/* Pausa: invisível até receber foco do teclado (troca automática precisa poder parar) */}
      {list.length > 1 && !reduce && (
        <button
          type="button"
          className={s.pause}
          onClick={() => setPaused((v) => !v)}
          aria-label={paused ? 'Retomar a troca de imagens do fundo' : 'Pausar a troca de imagens do fundo'}
          aria-pressed={paused}
        >
          {paused ? 'Retomar imagens' : 'Pausar imagens'}
        </button>
      )}
    </div>
  )
}
