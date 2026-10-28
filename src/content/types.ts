/* Tipos do conteúdo editável. Os componentes só leem estes formatos. */

/** Categoria do projeto — define rótulos e filtros. */
export type ProjectKind = 'app' | 'site' | 'produto' | 'experimento'

/**
 * Composição do projeto na vitrine principal.
 * - cinema:    quase tela cheia, imagem dominante (ideal para o projeto nº 1)
 * - editorial: imagem grande + colagem de imagens menores, assimétrico
 * - device:    telas de celular escalonadas (ideal para apps)
 * - poster:    capa vertical alta, título lateral (experimentos, peças visuais)
 */
export type ShowcaseLayout = 'cinema' | 'editorial' | 'device' | 'poster'

/** Uma imagem do projeto. */
export interface MediaRef {
  /** Nome do arquivo em src/assets/projects/<slug>/, sem extensão. Ex.: 'capa' */
  src: string
  /** Texto alternativo (acessibilidade). Descreva o que aparece. */
  alt: string
  /** Legenda curta opcional, exibida como "FIG. 0X — legenda". */
  caption?: string
  /** Como apresentar: captura de desktop, de celular, ou arte sem moldura. */
  frame?: 'desktop' | 'mobile' | 'none'
}

export type ProjectLinkKind = 'site' | 'appstore' | 'googleplay' | 'repo' | 'video' | 'outro'

export interface ProjectLink {
  kind: ProjectLinkKind
  url: string
  /** Texto do link (opcional — há um padrão por tipo). */
  label?: string
}

export interface Fact {
  label: string
  value: string
}

export interface Quote {
  text: string
  author: string
  /** Obra de onde a frase vem. */
  source?: string
  year?: string
}

export interface Project {
  /** Identificador na URL: /projetos/<slug>. Use minúsculas e hífens. */
  slug: string
  title: string
  /** Frase curtíssima complementar ao título (opcional). */
  subtitle?: string
  kind: ProjectKind
  /** Ano ou intervalo. Ex.: '2025' ou '2023—2024' */
  year: string
  /** Uma ou duas linhas. */
  summary: string
  /** Sua participação. Ex.: ['Design', 'Front-end'] */
  role: string[]
  /** Tecnologias relevantes. */
  stack: string[]
  cover: MediaRef
  /** Imagens extras para a vitrine e para a página de detalhes. */
  gallery?: MediaRef[]
  links?: ProjectLink[]
  /** Cor de destaque do projeto (hex). Tinge a apresentação dele. */
  accent?: string
  /** Composição na vitrine. Padrão: 'editorial'. */
  layout?: ShowcaseLayout
  /** true = aparece na vitrine principal; false = só na galeria e no índice. */
  featured?: boolean
  /** false = a capa não entra no fundo do início (capas claras ficam lavadas ali). Padrão: true. */
  backdrop?: boolean
  /** Conteúdo extra da página de detalhes. */
  details?: {
    intro?: string
    facts?: Fact[]
    notes?: string[]
  }
  /** false desliga a página de detalhes deste projeto. Padrão: true. */
  page?: boolean
  /** Conteúdo de demonstração: só aparece em desenvolvimento. Apague ao cadastrar os reais. */
  example?: boolean
}

export interface StackItem {
  name: string
  /** Ícone: nome da chave em src/lib/tech-icons.ts (ex.: 'react'). Sem ícone, aparece a inicial. */
  icon?: string
  /** Destaque curto ao lado do nome: um modelo ou recurso específico (ex.: o nome de um modelo). */
  note?: string
  /** Ferramentas principais aparecem primeiro e com mais peso. */
  core?: boolean
  example?: boolean
}

export interface StackGroup {
  label: string
  /** Uma linha sobre o grupo, sob o título. */
  note?: string
  /** Grupo de apoio (ex.: "No radar"): aparece mais discreto, com contorno tracejado. */
  soft?: boolean
  items: StackItem[]
}

export type SocialNetwork =
  | 'instagram'
  | 'linkedin'
  | 'x'
  | 'github'
  | 'behance'
  | 'dribbble'
  | 'youtube'
  | 'email'
  | 'outro'

export interface Social {
  network: SocialNetwork
  label: string
  handle?: string
  /** URL completa. Vazio = link ainda não configurado (fica oculto no site publicado). */
  url: string
  /** Links principais ganham destaque monumental no encerramento. */
  primary?: boolean
}

export interface Profile {
  name: string
  firstName: string
  lastName: string
  /** Função em poucas palavras. */
  role: string
  /** Apresentação breve do hero (1–2 linhas). */
  intro: string
  /** Frentes de trabalho exibidas no hero. */
  disciplines: string[]
  about: {
    /** Até 2 parágrafos curtos. */
    body?: string[]
    /** Citação em destaque. Envolva uma palavra em [colchetes] para destacá-la. */
    quote?: Quote
  }
  /** Currículo em PDF: o arquivo fica em src/assets/curriculo/. */
  resume?: {
    /** Data exibida ao lado do botão. Ex.: 'mar 2026'. Vazio = sem data. */
    updated?: string
  }
  socials: Social[]
}
