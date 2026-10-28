import {
  siAngular,
  siClaude,
  siCss,
  siDart,
  siDocker,
  siExpo,
  siExpress,
  siFastapi,
  siFigma,
  siFirebase,
  siFlutter,
  siGit,
  siGithub,
  siGithubactions,
  siHtml5,
  siJavascript,
  siJest,
  siJsonwebtokens,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siOpenai,
  siOpenjdk,
  siPostgresql,
  siPostman,
  siPrisma,
  siPython,
  siReact,
  siReactquery,
  siRedux,
  siSpringboot,
  siStyledcomponents,
  siSupabase,
  siSwagger,
  siTailwindcss,
  siTestinglibrary,
  siTypescript,
  siVercel,
  siVite,
  siVitest,
} from 'simple-icons'

/*
  Ícones das ferramentas (Simple Icons — https://simpleicons.org).
  Para adicionar: importe o ícone acima (ex.: siSupabase) e crie uma chave aqui;
  depois use a chave no campo `icon` de src/content/stack.ts.
  Só os ícones importados entram no site (o resto da biblioteca não pesa).
*/

export interface TechIcon {
  /** Caminho SVG em viewBox 0 0 24 24. */
  path: string
  /** Cor oficial da marca (hex sem #). */
  hex: string
}

/** Forma de onda desenhada à mão: a Web Audio API não tem logotipo oficial. */
const waveform: TechIcon = {
  path: 'M2 11h2v2H2zm3-3h2v8H5zm3-4h2v16H8zm3 6h2v4h-2zm3-4h2v12h-2zm3 3h2v6h-2zm3 2h2v2h-2z',
  hex: 'ECE6DA',
}

/** Conceitos sem logotipo oficial: ícones simples desenhados à mão (mesma cor de texto). */
const concept = (path: string): TechIcon => ({ path, hex: 'ECE6DA' })
const restIcon = concept('M7 4 3 8l4 4V9h8V7H7V4zm10 8v3H9v2h8v3l4-4-4-4z')
const nlpIcon = concept('M4 4h16v12H9l-5 4V4zm4 4v2h8V8H8zm0 4v1.5h5V12H8z')
const llmIcon = concept('M12 2l2.2 6.3L21 10.5l-6.8 2.2L12 20l-2.2-7.3L3 10.5l6.8-2.2L12 2z')
const contextIcon = concept('M10.5 3h3v3h-3zM3 17h3v3H3zm7.5 0h3v3h-3zM18 17h3v3h-3zM11.25 6h1.5v5h-1.5zM4.5 10.5h15V12h-15zM4.5 12H6v5H4.5zm13.5 0h1.5v5H18zm-6.75 0h1.5v5h-1.5z')

export const TECH_ICONS: Record<string, TechIcon> = {
  html5: siHtml5,
  javascript: siJavascript,
  flutter: siFlutter,
  dart: siDart,
  reactquery: siReactquery,
  context: contextIcon,
  nestjs: siNestjs,
  express: siExpress,
  java: siOpenjdk,
  springboot: siSpringboot,
  jwt: siJsonwebtokens,
  rest: restIcon,
  mysql: siMysql,
  prisma: siPrisma,
  whisper: waveform,
  nlp: nlpIcon,
  llm: llmIcon,
  jest: siJest,
  vitest: siVitest,
  testinglibrary: siTestinglibrary,
  swagger: siSwagger,
  postman: siPostman,
  githubactions: siGithubactions,
  angular: siAngular,
  styledcomponents: siStyledcomponents,
  redux: siRedux,
  firebase: siFirebase,
  react: siReact,
  typescript: siTypescript,
  nextjs: siNextdotjs,
  vite: siVite,
  css: siCss,
  tailwind: siTailwindcss,
  webaudio: waveform,
  expo: siExpo,
  python: siPython,
  nodejs: siNodedotjs,
  fastapi: siFastapi,
  postgresql: siPostgresql,
  supabase: siSupabase,
  docker: siDocker,
  vercel: siVercel,
  git: siGit,
  github: siGithub,
  figma: siFigma,
  claude: siClaude,
  openai: siOpenai,
}
