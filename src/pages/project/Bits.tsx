import s from './Bits.module.css'

/** Número de obra: "Nº 01" com o º em serifa. */
export function Num({ n, className }: { n: string; className?: string }) {
  return (
    <span className={[s.num, className].filter(Boolean).join(' ')}>
      N<span className={s.ord}>º</span>
      <span className={s.digits}>{n}</span>
    </span>
  )
}

/** Botão invisível sobre uma imagem: abre o visualizador em tela cheia. */
export function Zoom({ label, onOpen }: { label: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      className={s.zoom}
      onClick={onOpen}
      aria-label={`Ampliar ${label}`}
      data-cursor="view"
      data-cursor-label="Ampliar"
    />
  )
}
