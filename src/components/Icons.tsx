import type { SocialNetwork, ProjectLinkKind } from '@/content'

type IconProps = { size?: number; className?: string }

/** Estrela de quatro pontas — assinatura herdada do Projeto Celeste. */
export function Star({ size = 14, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className}>
      <path
        d="M12 0C12.7 6.4 17.6 11.3 24 12 17.6 12.7 12.7 17.6 12 24 11.3 17.6 6.4 12.7 0 12 6.4 11.3 11.3 6.4 12 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

type Direction = 'up-right' | 'right' | 'down' | 'left' | 'up'
const ROTATION: Record<Direction, number> = { right: 0, down: 90, left: 180, up: -90, 'up-right': -45 }

/** Seta de traço fino. */
export function Arrow({ size = 16, className, direction = 'up-right' }: IconProps & { direction?: Direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      style={{ transform: `rotate(${ROTATION[direction]}deg)` }}
    >
      <path d="M3 12h17M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  )
}

/** Folha de documento com canto dobrado e linhas de texto (currículo). */
export function FileIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className}>
      <path
        d="M6 2.5h8.5L19.5 7.5V21.5H6Z M14.5 2.5v5h5 M9 12.5h7 M9 15.5h7 M9 18.5h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </svg>
  )
}

/** Mira / retícula de enquadramento. */
export function Reticle({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M12 0v8M12 16v8M0 12h8M16 12h8" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

const SOCIAL_PATHS: Partial<Record<SocialNetwork, string>> = {
  instagram:
    'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2ZM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9Z',
  linkedin:
    'M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.6V9h3.5v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z',
  x: 'M18.9 1.2h3.7l-8 9.2 9.4 12.4h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.4h2L6.5 3.2H4.3l13.3 17.4Z',
  github:
    'M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3',
  youtube:
    'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z',
  behance:
    'M22 7h-7V5h7v2Zm1.7 10c-.4 1.3-2.1 3-5.3 3-3.3 0-6-1.9-6-6 0-4.2 2.5-6.3 5.9-6.3 3.3 0 5.4 1.9 5.8 4.8.1.5.1 1.3.1 2.4h-8.7c.1 2.5 2.7 2.6 3.6 1.6h3.6Zm-7.7-4.1h5.4c-.1-1.2-.9-1.8-2.6-1.8-1.6 0-2.6.7-2.8 1.8ZM5.6 20H0V4h6c4.7.1 4.8 4.7 2.3 6 3 1.1 3.1 10-2.7 10ZM3 10.4h3.1c2.2 0 2.5-3 .4-3H3v3Zm3.4 3H3V17h3.3c3.1 0 2.9-3.6.1-3.6Z',
  dribbble:
    'M12 24a12 12 0 1 1 0-24 12 12 0 0 1 0 24Zm10.1-10.4c-.4-.1-3.2-.9-6.4-.4 1.3 3.7 1.9 6.7 2 7.3a10.3 10.3 0 0 0 4.4-6.9ZM16 21.3c-.2-.9-.7-4-2.2-7.8-5.7 2-7.8 5.9-7.9 6.3A10.2 10.2 0 0 0 16 21.3ZM4.6 18.7c.2-.4 3-5 8.2-6.7l.4-.1-.8-1.6c-5 1.5-9.8 1.4-10.3 1.4v.3c0 2.6 1 5 2.5 6.7ZM2.2 9.8c.5 0 4.6 0 9.2-1.2-1.6-2.9-3.4-5.3-3.6-5.6a10.3 10.3 0 0 0-5.6 6.8ZM9.6 2.2c.3.4 2.1 2.8 3.6 5.7 3.5-1.3 5-3.3 5.2-3.5a10.2 10.2 0 0 0-8.8-2.2Zm10 3.3c-.2.3-1.9 2.4-5.5 3.9l.7 1.5c.1.2.2.4.2.5 3.4-.4 6.7.3 7 .3a10.2 10.2 0 0 0-2.4-6.2Z',
  email: 'M0 4h24v16H0V4Zm2 2v.5l10 6.3 10-6.3V6H2Zm20 2.9-10 6.3L2 8.9V18h20V8.9Z',
}

/** Ícone da rede social (cai numa seta quando não há ícone). */
export function SocialIcon({ network, size = 18, className }: IconProps & { network: SocialNetwork }) {
  const d = SOCIAL_PATHS[network]
  if (!d) return <Arrow size={size} className={className} />
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className}>
      <path d={d} fill="currentColor" />
    </svg>
  )
}

const LINK_PATHS: Partial<Record<ProjectLinkKind, string>> = {
  appstore:
    'M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4.1ZM13.9 5c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3-1.5Z',
  googleplay:
    'M3.6 1.3 13.8 12 3.6 22.7c-.4-.2-.6-.7-.6-1.2V2.5c0-.5.2-1 .6-1.2Zm11.3 9.6 2.6-2.6 3.3 1.9c1 .6 1 1.6 0 2.2l-3.3 1.9-2.6-2.6v-.8Zm-1 1.1 2.5 2.5-11.4 6.6L13.9 12Zm0-1L4.4 1.3l11.4 6.6-2.5 2.5-.1.6Z',
  repo: 'M8.3 17.6 2.7 12l5.6-5.6 1.4 1.4L5.5 12l4.2 4.2-1.4 1.4Zm7.4 0-1.4-1.4 4.2-4.2-4.2-4.2 1.4-1.4 5.6 5.6-5.6 5.6Z',
  video: 'M4 4h16v16H4V4Zm6 4.5v7l6-3.5-6-3.5Z',
}

/** Ícone de link de projeto (App Store, Google Play…). */
export function LinkIcon({ kind, size = 16, className }: IconProps & { kind: ProjectLinkKind }) {
  const d = LINK_PATHS[kind]
  if (!d) return <Arrow size={size} className={className} />
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className}>
      <path d={d} fill="currentColor" />
    </svg>
  )
}
