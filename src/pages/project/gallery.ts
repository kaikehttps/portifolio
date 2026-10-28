import type { MediaRef } from '@/content'

/*
  Composição automática da galeria.
  - Capturas de celular consecutivas viram fileiras de 2–3 aparelhos.
  - Capturas largas seguem um ritmo: deslocada à direita → sangrada →
    deslocada à esquerda → dupla (quando há duas seguidas). Assim nenhuma
    página vira uma grade de cards iguais.
  - A última captura larga fecha em sangria (plano final), para a galeria
    não terminar repetindo a composição de abertura.
*/

export interface Shot {
  media: MediaRef
  /** Posição na lista do visualizador (0 = capa). */
  index: number
}

export type WideVariant = 'right' | 'bleed' | 'left'

export type Block =
  | { kind: 'wide'; variant: WideVariant; shot: Shot }
  | { kind: 'duo'; shots: [Shot, Shot] }
  | { kind: 'phones'; shots: Shot[] }

const RHYTHM = ['right', 'bleed', 'left', 'duo'] as const

/** Divide uma sequência de celulares em grupos de até 3, sem deixar um sozinho no fim. */
function chunkPhones(shots: Shot[]): Shot[][] {
  const out: Shot[][] = []
  let rest = shots
  while (rest.length > 0) {
    const take = rest.length === 4 ? 2 : Math.min(3, rest.length)
    out.push(rest.slice(0, take))
    rest = rest.slice(take)
  }
  return out
}

export function composeGallery(gallery: MediaRef[], first = 1): Block[] {
  const shots: Shot[] = gallery.map((media, i) => ({ media, index: first + i }))

  // 1. sequências: celulares consecutivos juntos; cada captura larga sozinha
  const runs: { mobile: boolean; shots: Shot[] }[] = []
  for (const shot of shots) {
    const mobile = shot.media.frame === 'mobile'
    const last = runs[runs.length - 1]
    if (mobile && last?.mobile) last.shots.push(shot)
    else runs.push({ mobile, shots: [shot] })
  }

  // 2. ritmo
  const blocks: Block[] = []
  let beat = 0
  let lastOffset: 'right' | 'left' = 'left'
  for (let r = 0; r < runs.length; r++) {
    const run = runs[r]
    if (run.mobile) {
      for (const group of chunkPhones(run.shots)) blocks.push({ kind: 'phones', shots: group })
      continue
    }
    const shot = run.shots[0]
    const step = RHYTHM[beat % RHYTHM.length]
    beat++
    if (step === 'duo') {
      const next = runs[r + 1]
      if (next && !next.mobile) {
        blocks.push({ kind: 'duo', shots: [shot, next.shots[0]] })
        r++
        continue
      }
      // sem par: espelha o último deslocamento em vez de repetir sempre o mesmo lado
      lastOffset = lastOffset === 'right' ? 'left' : 'right'
      blocks.push({ kind: 'wide', variant: lastOffset, shot })
      continue
    }
    if (step !== 'bleed') lastOffset = step
    blocks.push({ kind: 'wide', variant: step, shot })
  }

  // 3. final: a última captura larga fecha em sangria, como um plano de encerramento
  const end = blocks[blocks.length - 1]
  if (end?.kind === 'wide' && end.variant !== 'bleed') {
    const before = blocks.slice(0, -1).reverse().find((b) => b.kind !== 'phones')
    if (!(before?.kind === 'wide' && before.variant === 'bleed')) end.variant = 'bleed'
  }
  return blocks
}
