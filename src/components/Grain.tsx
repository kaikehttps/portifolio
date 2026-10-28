import styles from './Grain.module.css'

/** Granulação de película sobre o site inteiro (puramente decorativa). */
export function Grain() {
  return <div className={styles.grain} aria-hidden="true" />
}
