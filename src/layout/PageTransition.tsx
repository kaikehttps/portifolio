import { Activity, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { UNSAFE_LocationContext as LocationContext, useLocation } from 'react-router'
import { AnimatePresence, m, PresenceContext, useIsPresent, useReducedMotion } from 'motion/react'
import { getProject, projectNumber } from '@/content'
import { Star } from '@/components/Icons'
import { ease } from '@/lib/motion'
import type { RestoreState } from '@/lib/smooth-scroll'
import { focusQuietly } from './focus'
import { usePrefetchProjectPage } from './prefetch'
import styles from './PageTransition.module.css'

/*
  Troca de rota = corte de cena: o obturador fecha (cima/baixo), a página troca
  por baixo dele (a nova monta e posiciona a rolagem) e o obturador abre.
  Só a troca de pathname anima; mudar só o hash não dispara nada.

  Dois cuidados de tempo:
  - A página que sai fica congelada na própria localização (<Freeze>). Sem isso o <Routes>
    antigo ainda ouve o roteador e re-renderiza a página inteira dentro da transição
    do React Router antes de o obturador poder começar a fechar (~300 ms na home).
  - Enquanto o obturador fecha, a rota nova é pré-renderizada escondida (<Activity hidden>,
    sem efeitos) só para resolver o import sob demanda da página de projeto. Assim, quando
    ela monta de verdade, não suspende — e o React não segura a revelação por mais 300 ms.
*/

const CLOSE = 0.46
const OPEN = 0.52
const HOLD = 0.06
/** Teto de espera pela página nova com o obturador fechado (ms). */
const MAX_WAIT = 1500
/** Depois disso fechado, o letreiro mostra que está carregando (ms). */
const SLOW = 220
/** URL trocada sem a rota chegar em tanto tempo: desiste e reabre (ms). */
const NEVER = 3000

/** Só em desenvolvimento: ?shutter=hold segura o obturador fechado (para inspecionar o letreiro). */
const HOLD_SHUT =
  import.meta.env.DEV && typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('shutter') === 'hold'
    : false

type Phase = 'idle' | 'closing' | 'opening'

/**
 * Foco depois do corte: o destino da rolagem (projeto de onde se voltou ou #seção)
 * ou o <main> da página nova — o teclado não fica preso no link que sumiu.
 */
function focusPage(node: HTMLElement, hash: string, state: unknown) {
  const restore = (state as RestoreState | null)?.restore
  const id = restore ? `projeto-${restore}` : hash.slice(1)
  const target = (id && document.getElementById(id)) || node.querySelector<HTMLElement>('main')
  focusQuietly(target)
}

/** Rotas carregadas sob demanda (vale a pena pré-renderizar escondido). */
const isLazyRoute = (pathname: string) => pathname !== '/'

/**
 * Isola a página do AnimatePresence da troca de rota:
 * - mantém a página que está saindo na localização em que ela estava;
 * - corta o PresenceContext: o initial={false} (sem fade na primeira carga) vale só para
 *   o invólucro — sem o corte, ele ficaria memorizado no contexto e bloquearia o `initial`
 *   de todas as revelações motion.* da primeira página. E a saída da página não acorda
 *   cada componente motion dela (as saídas internas usam AnimatePresence próprios).
 */
function Freeze({ children }: { children: ReactNode }) {
  const live = useContext(LocationContext)
  const present = useIsPresent()
  const [kept, setKept] = useState(live)
  if (present && kept !== live) setKept(live)
  return (
    <PresenceContext.Provider value={null}>
      <LocationContext.Provider value={present ? live : kept}>{children}</LocationContext.Provider>
    </PresenceContext.Provider>
  )
}

/** Nome do destino para o letreiro da emenda. */
function destination(pathname: string): { index: string; name: string } {
  if (pathname === '/') return { index: 'Rolo 00', name: 'Índice' }
  const match = pathname.match(/^\/projetos\/([^/]+)\/?$/)
  const project = match ? getProject(match[1]) : undefined
  if (project) return { index: `Nº ${projectNumber(project)}`, name: project.title }
  return { index: 'Erro 404', name: 'Sem sinal' }
}

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const reduce = useReducedMotion()
  const [path, setPath] = useState(location.pathname)
  const [phase, setPhase] = useState<Phase>('idle')
  const [slow, setSlow] = useState(false)
  const [prerender, setPrerender] = useState<string | null>(null)
  /** Destino já pedido (URL trocada) que o roteador ainda não renderizou. */
  const [pending, setPending] = useState<string | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const shown = useRef(location.pathname)
  /** Quando o obturador começou a fechar (a saída da página só dura o que falta). */
  const closingAt = useRef(0)
  const wait = useRef(0)
  const focused = useRef(true)

  usePrefetchProjectPage()

  // Nova rota: o obturador fecha (se a intenção já não o fez) e a página antiga sai.
  if (path !== location.pathname) {
    setPath(location.pathname)
    setPhase('closing')
    setPending(null)
    setPrerender(isLazyRoute(location.pathname) ? location.pathname : null)
  }
  useEffect(() => {
    shown.current = path
  }, [path])
  useLayoutEffect(() => {
    if (phase !== 'closing') closingAt.current = 0
    else if (!closingAt.current) closingAt.current = performance.now()
  }, [phase])

  // Intenção: o React Router troca a URL na hora, mas renderiza a rota numa transição que
  // pode levar alguns quadros. O obturador responde já no quadro do clique/tecla/voltar.
  useEffect(() => {
    if (reduce) return
    const onIntent = () => {
      const next = window.location.pathname
      if (next === shown.current) return
      if (!closingAt.current) closingAt.current = performance.now()
      setPending(next)
      setPhase('closing')
    }
    document.addEventListener('click', onIntent)
    document.addEventListener('keydown', onIntent)
    window.addEventListener('popstate', onIntent)
    return () => {
      document.removeEventListener('click', onIntent)
      document.removeEventListener('keydown', onIntent)
      window.removeEventListener('popstate', onIntent)
    }
  }, [reduce])
  // Segurança: se a rota nunca chegar, o obturador reabre.
  useEffect(() => {
    if (!pending) return
    const id = window.setTimeout(() => {
      setPending(null)
      setPhase('opening')
    }, NEVER)
    return () => window.clearTimeout(id)
  }, [pending])

  // A página nova pode ser carregada sob demanda: só abre quando o <main> dela existir.
  const { pathname: target, hash, state } = location
  const tryFocus = () => {
    const node = pageRef.current
    if (focused.current || !node || node.dataset.path !== target || !node.querySelector('main')) return
    focused.current = true
    focusPage(node, hash, state)
  }
  const onExitComplete = () => {
    cancelAnimationFrame(wait.current)
    setPrerender(null)
    focused.current = false
    const started = performance.now()
    let flagged = false
    const check = () => {
      const node = pageRef.current
      const mounted = node?.dataset.path === target && node.querySelector('main') != null
      const elapsed = performance.now() - started
      if (HOLD_SHUT) return setSlow(true)
      if (mounted || elapsed > MAX_WAIT) {
        tryFocus()
        setSlow(false)
        return setPhase('opening')
      }
      if (elapsed > SLOW && !flagged) {
        flagged = true
        setSlow(true)
      }
      wait.current = requestAnimationFrame(check)
    }
    wait.current = requestAnimationFrame(check)
  }
  // Outra navegação (ou desmontagem) cancela a espera anterior.
  useEffect(() => {
    cancelAnimationFrame(wait.current)
    return () => cancelAnimationFrame(wait.current)
  }, [location.pathname])

  const dest = destination(pending ?? location.pathname)

  return (
    <>
      <AnimatePresence mode="wait" initial={false} onExitComplete={onExitComplete}>
        <m.div
          ref={pageRef}
          key={location.pathname}
          data-path={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: reduce ? 0.25 : 0.01 } }}
          variants={{
            // Resolvida quando a saída começa: acompanha o obturador, que pode ter fechado antes.
            exit: () => {
              if (reduce) return { opacity: 0, transition: { duration: 0.18 } }
              const left = CLOSE - (performance.now() - closingAt.current) / 1000
              return { opacity: 0.3, transition: { duration: Math.max(0.08, left), ease: ease.out } }
            },
          }}
          exit="exit"
        >
          <Freeze>{children}</Freeze>
        </m.div>
      </AnimatePresence>

      {prerender === location.pathname && <Activity mode="hidden">{children}</Activity>}

      {!reduce && (
        <Shutter
          phase={phase}
          slow={slow}
          index={dest.index}
          name={dest.name}
          onOpened={() => {
            // Se a página chegou depois do teto de espera, o foco vai agora.
            tryFocus()
            setPhase('idle')
          }}
        />
      )}

      {/* Leitores de tela: anuncia a página nova (o texto inicial não é lido) */}
      <p className="visually-hidden" aria-live="polite">
        {`Página: ${dest.name}`}
      </p>
    </>
  )
}

function Shutter({
  phase,
  slow,
  index,
  name,
  onOpened,
}: {
  phase: Phase
  slow: boolean
  index: string
  name: string
  onOpened: () => void
}) {
  const closed = phase === 'closing'
  const transition = closed
    ? { duration: CLOSE, ease: ease.inOut }
    : { duration: OPEN, ease: ease.inOut, delay: HOLD }

  return (
    <div className={styles.shutter} data-phase={phase} data-slow={slow} aria-hidden="true">
      <m.div
        className={styles.top}
        initial={false}
        animate={{ y: closed ? '0%' : '-101%' }}
        transition={transition}
      >
        <span className={styles.ghost}>{name}</span>
      </m.div>
      <m.div
        className={styles.bottom}
        initial={false}
        animate={{ y: closed ? '0%' : '101%' }}
        transition={transition}
        onAnimationComplete={() => phase === 'opening' && onOpened()}
      >
        <span className={styles.line} />
        <span className={styles.scan} />
        <span className={styles.slate}>
          <span className={styles.reel}>
            <span className={styles.dot} />
            Rolo →
          </span>
          <span className={styles.rule} />
          <span className={styles.index}>{index}</span>
          <Star size={9} className={styles.star} />
          <span className={styles.name}>{name}</span>
        </span>
      </m.div>
    </div>
  )
}
