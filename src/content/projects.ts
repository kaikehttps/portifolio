import type { Project } from './types'

/*
  PROJETOS
  ────────────────────────────────────────────────────────────────
  • A ordem desta lista é a ordem no site.
  • Imagens: crie a pasta src/assets/projects/<slug>/ e coloque os arquivos
    (jpg, png ou webp). Referencie pelo nome, sem extensão: { src: 'capa' }.
    Elas são convertidas para AVIF/WebP em vários tamanhos automaticamente.
  • Sem imagem? O site gera uma arte tipográfica no lugar.
  • Entradas com `example: true` só aparecem em desenvolvimento (npm run dev).
    Apague-as quando cadastrar seus projetos reais.
*/

export const projects: Project[] = [
  {
    slug: 'apexvet',
    title: 'ApexVet',
    subtitle: 'Mais tempo cuidando. Menos tempo preenchendo.',
    kind: 'produto',
    year: '2026', // confirme (o site oficial traz © 2026)
    summary:
      'Plataforma de gestão veterinária com inteligência artificial: pacientes, prontuários e consultas em um só lugar, com a IA organizando o atendimento em um rascunho para o veterinário revisar.',
    role: ['Fundador', 'Tech lead'],
    stack: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'Supabase', 'Docker', 'Groq API'],
    accent: '#bdee9a',
    layout: 'editorial',
    featured: true,
    backdrop: false, // site claro: fica lavado no fundo escuro do início
    cover: {
      src: 'capa',
      alt: 'Página inicial do site oficial da ApexVet: "Uma nova forma de cuidar da sua clínica veterinária", com uma ilustração do painel da plataforma.',
      caption: 'Site oficial',
      frame: 'desktop',
    },
    gallery: [
      {
        src: 'problema',
        alt: 'Seção "Seu tempo é para cuidar. Não para preencher papel." do site oficial.',
        caption: 'Seu tempo é para cuidar',
        frame: 'desktop',
      },
      {
        src: 'mobile-inicio',
        alt: 'Página inicial do site da ApexVet no celular.',
        caption: 'Início, no celular',
        frame: 'mobile',
      },
      {
        src: 'ia',
        alt: 'Seção sobre a inteligência artificial: consulta, ApexVet entende as informações, prontuário estruturado.',
        caption: 'A IA que entende o que importa',
        frame: 'desktop',
      },
      {
        src: 'mobile-ia',
        alt: 'Seção da inteligência artificial no celular.',
        caption: 'A IA, no celular',
        frame: 'mobile',
      },
      {
        src: 'recursos',
        alt: 'Seção "Tudo o que sua rotina precisa. Em um só lugar." com os recursos da plataforma.',
        caption: 'Recursos',
        frame: 'desktop',
      },
      {
        src: 'passos',
        alt: 'Seção "Comece em três passos": cadastre sua clínica, registre os atendimentos, organize sua rotina.',
        caption: 'Comece em três passos',
        frame: 'desktop',
      },
    ],
    links: [{ kind: 'site', url: 'https://apexvet.site/' }],
  },

  {
    slug: 'projeto-celeste',
    title: 'Projeto Celeste',
    subtitle: 'Deadlock fã dublado em PT-BR',
    kind: 'site',
    year: '2026', // confirme
    summary:
      'O site da dublagem brasileira de Deadlock feita por fãs: o elenco, quem dá voz a cada personagem e as falas em português.',
    role: ['Interface', 'Desenvolvimento front-end'], // confirme sua participação
    stack: ['React', 'Vite', 'Web Audio API'],
    accent: '#e4a7f3',
    layout: 'cinema',
    featured: true,
    cover: {
      src: 'capa',
      alt: 'Página inicial do Projeto Celeste: logotipo de Deadlock, a chamada "Eles já têm uma história. Agora, têm uma voz." e um mural em movimento com as cartas dos personagens do elenco.',
      frame: 'desktop',
    },
    gallery: [
      {
        src: 'elenco',
        alt: 'Seção "O elenco da cidade" com a personagem Celeste em destaque, número 01 de 31 e a voz responsável.',
        caption: 'O elenco da cidade',
        frame: 'desktop',
      },
      {
        src: 'mobile-inicio',
        alt: 'Página inicial do Projeto Celeste no celular.',
        caption: 'Início, no celular',
        frame: 'mobile',
      },
      {
        src: 'mobile-elenco',
        alt: 'Seção do elenco no celular, com a moldura de jornal e a personagem Celeste.',
        caption: 'Elenco, no celular',
        frame: 'mobile',
      },
      {
        src: 'expediente',
        alt: 'Expediente com a lista de personagens, vozes e créditos, ao lado de um aviso em papel rasgado.',
        caption: 'Expediente',
        frame: 'desktop',
      },
      {
        src: 'redes',
        alt: 'Seção lilás "Siga o projeto" com os canais oficiais no YouTube e no X.',
        caption: 'Siga o projeto',
        frame: 'desktop',
      },
      {
        src: 'mobile-expediente',
        alt: 'Expediente no celular, com linhas pontilhadas ligando personagens e vozes.',
        caption: 'Expediente, no celular',
        frame: 'mobile',
      },
      {
        src: 'mobile-redes',
        alt: 'Seção de redes do projeto no celular.',
        caption: 'Redes, no celular',
        frame: 'mobile',
      },
      {
        src: 'download',
        alt: 'Cartão de download do pacote da dublagem, marcado como "em breve".',
        caption: 'Download',
        frame: 'desktop',
      },
    ],
    links: [
      { kind: 'site', url: 'https://siteprojetoceleste.vercel.app/' },
      { kind: 'repo', url: 'https://github.com/kaikehttps/siteprojetoceleste', label: 'Repositório' },
    ],
    details: {
      intro:
        'O Projeto Celeste é uma iniciativa de fãs que dá vozes brasileiras aos personagens de Deadlock. O site reúne o elenco, quem dá voz a cada personagem, amostras de voz e os canais oficiais do projeto.',
      facts: [
        { label: 'Formato', value: 'Site oficial do projeto' },
        { label: 'Elenco', value: '31 personagens' },
      ],
      notes: [
        'Projeto independente de fãs, sem fins lucrativos e sem vínculo com a Valve. Deadlock, seus personagens e artes pertencem à Valve Corporation.',
      ],
    },
  },
  {
    slug: 'deadlock-fa-dublado',
    title: 'Deadlock Fã Dublado',
    subtitle: 'Duas vozes. Um universo que nunca dorme.',
    kind: 'experimento',
    year: '2026', // confirme
    summary:
      'Demonstração independente de fã dublagem em PT-BR: o Vendedor e a Urna Espiritual, numa experiência interativa com cara de jogo.',
    role: ['Voz', 'Interface', 'Desenvolvimento front-end'], // confirme sua participação
    stack: ['React', 'Vite', 'Web Audio API'],
    accent: '#f2b45c',
    layout: 'editorial',
    featured: true,
    cover: {
      src: 'capa',
      alt: 'Tela de abertura: a cidade de Deadlock ao entardecer, entre prédios com janelas acesas, e o título "Deadlock fã dublado em PT-BR".',
      frame: 'desktop',
    },
    gallery: [
      {
        src: 'menu',
        alt: 'Menu inicial com as opções Entrar na cidade, Ouvir as demonstrações, Conhecer o projeto e Sobre mim.',
        caption: 'Menu de abertura',
        frame: 'desktop',
      },
      {
        src: 'urna',
        alt: 'Seção "Soul Urn": a Urna Espiritual ilustrada ao lado de uma lista de sete gravações com player de áudio.',
        caption: 'A Urna Espiritual',
        frame: 'desktop',
      },
      {
        src: 'mobile-inicio',
        alt: 'Tela de abertura no celular.',
        caption: 'Abertura, no celular',
        frame: 'mobile',
      },
      {
        src: 'mobile-urna',
        alt: 'Player da Urna Espiritual no celular.',
        caption: 'Player, no celular',
        frame: 'mobile',
      },
      {
        src: 'mobile-shopkeeper',
        alt: 'Título "The Shopkeeper" e a vitrine da loja do Vendedor no celular.',
        caption: 'O Vendedor, no celular',
        frame: 'mobile',
      },
      {
        src: 'por-tras',
        alt: 'Dossiê em papel "Por trás dessas vozes", com texto de apresentação e um player.',
        caption: 'Por trás dessas vozes',
        frame: 'desktop',
      },
      {
        src: 'shopkeeper',
        alt: 'Título monumental "The Shopkeeper" sobre a fachada da loja.',
        caption: 'Registro de voz nº 001',
        frame: 'desktop',
      },
      {
        src: 'vendedor',
        alt: 'A loja do Vendedor iluminada e o player com capítulos por herói.',
        caption: 'O Vendedor',
        frame: 'desktop',
      },
      {
        src: 'epilogo',
        alt: 'Epílogo: "A cidade nunca dorme. Eu também não." com a última gravação.',
        caption: 'Epílogo',
        frame: 'desktop',
      },
    ],
    links: [
      { kind: 'site', url: 'https://projetoceleste.vercel.app/' },
      { kind: 'repo', url: 'https://github.com/kaikehttps/projetoceleste', label: 'Repositório' },
    ],
    details: {
      intro:
        'Uma demonstração de fã dublagem em português brasileiro com duas vozes de Deadlock que não são heróis, mas sempre roubam a cena. A experiência abre como um jogo — tela de título, menu, capítulos — e cada gravação tem player próprio, com saltos por interação.',
      facts: [
        { label: 'Formato', value: 'Fã dublagem independente' },
        { label: 'Personagens', value: 'O Vendedor · A Urna Espiritual' },
        { label: 'Gravações', value: '8 interpretações — 1 do Vendedor, 7 da Urna' },
        { label: 'Tempo de voz', value: '4 min 28 s' },
      ],
      notes: [
        'Projeto independente de fã, sem vínculo com a Valve. Deadlock e seus personagens pertencem à Valve Corporation.',
      ],
    },
  },

  {
    slug: 'ottolog-express',
    title: 'Ottolog Express',
    subtitle: 'Site e aplicativo do cliente',
    kind: 'site',
    year: '2026', // confirme
    summary:
      'Site e app do cliente da transportadora: rastreamento de encomendas, cotação de frete e contato, com a experiência pensada para ser acessível a todos os públicos.',
    role: ['Desenvolvimento front-end', 'UX e acessibilidade'],
    stack: [],
    accent: '#f47b20',
    layout: 'editorial',
    featured: true,
    backdrop: false, // site claro
    page: false,
    cover: {
      src: 'capa',
      alt: 'Página inicial do site da Ottolog Express: "Soluções logísticas que impulsionam seu negócio", com o rastreamento de encomendas e os caminhões da frota.',
      frame: 'desktop',
    },
    gallery: [
      {
        src: 'mobile-inicio',
        alt: 'Página inicial da Ottolog Express no celular, com o campo de rastreamento.',
        caption: 'Início, no celular',
        frame: 'mobile',
      },
      {
        src: 'plataforma',
        alt: 'Seção "Mais que uma transportadora, uma plataforma logística".',
        caption: 'A plataforma',
        frame: 'desktop',
      },
      {
        src: 'app',
        alt: 'Seção do aplicativo do cliente, com rastreamento e link para o Google Play.',
        caption: 'Aplicativo do cliente',
        frame: 'desktop',
      },
    ],
    links: [
      { kind: 'site', url: 'https://ottologexpress.com/' },
      { kind: 'googleplay', url: 'https://play.google.com/store/apps/details?id=com.ottologexpress.cliente' },
    ],
  },

  {
    slug: 'concurso-publico-ia',
    title: 'Concurso Público: Simulados',
    subtitle: 'IA que explica as questões',
    kind: 'app',
    year: '2026', // confirme
    summary:
      'IA que explica as questões ao aluno, nos acertos e nos erros, para apoiar a compreensão do raciocínio. As explicações bem avaliadas ficam guardadas por questão e são reaproveitadas, acelerando as próximas consultas. Implementada em 3 dias.',
    role: ['IA de explicação das questões'],
    stack: ['Python', 'NoSQL', 'Dart', 'Flutter', 'TypeScript'],
    accent: '#7aa7ff',
    featured: false,
    page: false,
    cover: { src: 'icone', alt: 'Ícone do aplicativo Concurso Público: Simulados', frame: 'none' },
    links: [{ kind: 'googleplay', url: 'https://play.google.com/store/apps/details?id=com.bluebusiness.concursopublico' }],
  },

  {
    slug: 'cartaz-pro',
    title: 'Cartaz.Pro',
    subtitle: 'Cartazes promocionais',
    kind: 'produto',
    year: '2026', // confirme
    summary:
      'Plataforma SaaS para criar cartazes promocionais: colar a lista, escolher o modelo e imprimir. Atuação em UX/UI e QA — prototipagem no Figma, testes funcionais, validação de fluxos e reporte de bugs.',
    role: ['UX/UI', 'QA'],
    stack: ['Figma'],
    accent: '#ffb347',
    featured: false,
    page: false,
    cover: { src: 'icone-2', alt: 'Logo do Cartaz.Pro: uma impressora em um quadrado vermelho', frame: 'none' },
    links: [{ kind: 'site', url: 'https://cartaz.pro/' }],
  },
]
