/*
  CASES — páginas de projeto contadas como uma história curta (hoje: ApexVet).
  ────────────────────────────────────────────────────────────────
  • Cada capítulo: um título, um ou dois parágrafos curtos e um visual.
  • As imagens vêm da pasta do projeto (src/assets/projects/<slug>/), pelo nome sem extensão.
  • Nada aqui deve ser inventado: datas, eventos, fotos e números só entram quando forem reais.
*/

/** O visual de cada capítulo. */
export type StoryVisual =
  /** Nomes pelos quais o projeto passou até o atual. */
  | { type: 'names'; names: string[]; final: string }
  /** Números grandes, com a fonte explicada na nota. */
  | { type: 'stat'; items: { value: string; label: string }[]; note: string }
  /** Uma captura do site (com moldura de navegador) e, opcional, a linha de tecnologias. */
  | { type: 'shot'; image: string; stack?: { name: string; icon?: string }[] }
  /** Book de fotos: as listadas + qualquer galeria-*.jpg da pasta do projeto. */
  | { type: 'book'; photos: { src: string; caption?: string }[] }

export interface CaseStudy {
  /** Cores da marca: destaque (menta) e institucional (azul). */
  brand: { accent: string; blue: string; logo?: string }
  hero: {
    tagline: string
    intro: string
    meta: { label: string; value: string }[]
  }
  story: { kicker: string; title: string; text: string[]; visual?: StoryVisual }[]
  closing: { line: string; site: string }
}

export const caseStudies: Record<string, CaseStudy> = {
  apexvet: {
    brand: { accent: '#bdee9a', blue: '#0955a1', logo: 'marca' },

    hero: {
      tagline: 'Mais tempo cuidando. Menos tempo preenchendo.',
      intro:
        'Gestão veterinária com inteligência artificial, nascida em Quixadá, no Sertão Central do Ceará.',
      meta: [
        { label: 'Categoria', value: 'Healthtech / Vettech' },
        { label: 'Tipo', value: 'SaaS' },
        { label: 'Base', value: 'Quixadá, CE' },
        { label: 'Participação', value: 'Fundador / Tech lead' },
      ],
    },

    story: [
      {
        kicker: 'O começo',
        title: 'Começou como um TCC',
        text: [
          'A ApexVet nasceu como o meu trabalho de conclusão de curso — a vontade de levar o que eu estava aprendendo para um problema real, fora da sala de aula.',
          'No caminho, a ideia mudou de nome algumas vezes até encontrar o seu.',
        ],
        visual: { type: 'names', names: ['AIVO', 'VetIa', 'AnimaListen'], final: 'ApexVet' },
      },
      {
        kicker: 'O problema',
        title: 'Uma conversa com o Dr. Cláudio',
        text: [
          'Conversando com o professor Cláudio, de Medicina Veterinária da UniCatólica, o problema ficou claro: o trabalho do veterinário não termina quando a consulta acaba. Depois vêm os registros, o prontuário, as receitas.',
        ],
        visual: {
          type: 'stat',
          items: [
            { value: '15 min', label: 'de consulta' },
            { value: '40 min', label: 'de papel depois' },
          ],
          note: 'O que ouvimos nessa conversa — o contexto que acendeu a ideia, não uma média de todas as clínicas.',
        },
      },
      {
        kicker: 'A ideia',
        title: 'Daí nasceu um SaaS',
        text: [
          'Uma plataforma de gestão veterinária em que o veterinário fala e a inteligência artificial organiza o prontuário — ele só revisa e decide. Pacientes, histórico e agenda no mesmo lugar, por assinatura.',
        ],
        visual: {
          type: 'shot',
          image: 'ia',
          stack: [
            { name: 'React', icon: 'react' },
            { name: 'Python', icon: 'python' },
            { name: 'FastAPI', icon: 'fastapi' },
            { name: 'PostgreSQL', icon: 'postgresql' },
            { name: 'Supabase', icon: 'supabase' },
            { name: 'Docker', icon: 'docker' },
            { name: 'Groq · Whisper · Llama' },
          ],
        },
      },
      {
        kicker: 'Hoje',
        title: 'E agora ela só cresce',
        text: [
          'Em 12 de março de 2026, na inauguração da Estação Tecnológica de Quixadá, a ApexVet entrou para o programa de residência em inovação — e ali eu comecei a liderar a equipe, ao lado de Igor Holanda, João Victor e Guilherme.',
          'Desde então, a ApexVet não para de crescer.',
        ],
        // Para alimentar o book: coloque galeria-01.jpg, galeria-02.jpg… na pasta src/assets/projects/apexvet/.
        visual: {
          type: 'book',
          photos: [
            { src: 'foto-time', caption: 'Parte da equipe da ApexVet com o projeto' },
            { src: 'foto-apresentacao', caption: 'Apresentando a ApexVet' },
          ],
        },
      },
    ],

    closing: {
      line: 'Tecnologia para transformar a rotina. Mais espaço para cuidar.',
      site: 'https://apexvet.site/',
    },
  },
}
