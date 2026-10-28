import { useSyncExternalStore } from 'react'

/*
  Sinal "a abertura terminou". A Intro chama markIntroDone();
  o Hero espera por ele para iniciar a própria animação de entrada.
*/

let done = false
const listeners = new Set<() => void>()

export function markIntroDone() {
  if (done) return
  done = true
  listeners.forEach((l) => l())
}

export function isIntroDone() {
  return done
}

export function useIntroDone(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => done,
    () => done,
  )
}
