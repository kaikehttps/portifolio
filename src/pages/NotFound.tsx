import { useEffect } from 'react'
import { Link } from 'react-router'
import { usePageScroll } from '@/lib/smooth-scroll'
import { Arrow } from '@/components/Icons'
import styles from './NotFound.module.css'

export function NotFound() {
  usePageScroll()
  useEffect(() => {
    document.title = 'Sem sinal — Kaike Alves'
  }, [])
  return (
    <main id="conteudo" className={styles.page}>
      <p className="t-label t-signal">Erro 404 · Fora do rolo</p>
      <h1 className={`t-display ${styles.title}`}>Sem sinal</h1>
      <Link to="/" className={`t-label ${styles.back}`} data-cursor="link">
        <Arrow direction="left" size={14} /> Voltar ao início
      </Link>
    </main>
  )
}
