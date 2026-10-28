import type { Profile } from './types'

/*
  PERFIL
  ────────────────────────────────────────────────────────────────
  Textos curtos de propósito. Os rascunhos abaixo usam só fatos que você
  já publicou (no Projeto Celeste) — reescreva com as suas palavras.
*/

export const profile: Profile = {
  name: 'Kaike Alves',
  firstName: 'Kaike',
  lastName: 'Alves',
  role: 'Desenvolvedor full stack',

  // apresentação do hero (1–2 linhas)
  intro:
    'Desenvolvedor e estudante de Sistemas de Informação, construo sistemas, aplicações e produtos digitais. Sou fundador da ApexVet e atuo como desenvolvedor na Ottolog Express, sempre buscando transformar ideias em soluções reais.',

  disciplines: ['Apps', 'Sites', 'Produtos', 'Experimentos', 'Agents de IA'],

  about: {
    // Até 2 parágrafos curtos. Vazio = em desenvolvimento aparece um lembrete; no site publicado o bloco some.
    body: [
      'Sou desenvolvedor e estudante de Sistemas de Informação. Gosto de criar soluções, compartilhar o que aprendo e aprender com as pessoas ao meu redor. Recentemente, também tive a experiência de dar aulas, algo que reforçou meu gosto por ensinar e me comunicar.',
    ],
    // Citação em destaque. A palavra entre [colchetes] ganha a cor de sinal.
    // Última frase de "O Mito de Sísifo" (1942): « Il faut imaginer Sisyphe heureux. »
    quote: {
      text: 'É preciso imaginar Sísifo [feliz].',
      author: 'Albert Camus',
      source: 'O Mito de Sísifo',
      year: '1942',
    },
  },

  // Currículo: o PDF vai em src/assets/curriculo/. Data opcional, ex.: 'mar 2026'.
  resume: { updated: '' },

  /*
    Links do encerramento. `url` vazio = ainda não configurado:
    aparece como "pendente" em desenvolvimento e fica oculto no site publicado.
    O LinkedIn veio dos créditos do site do Projeto Celeste.
  */
  socials: [
    {
      network: 'instagram',
      label: 'Instagram',
      handle: 'kaike_alvesz',
      url: 'https://www.instagram.com/kaike_alvesz/',
      primary: true,
    },
    {
      network: 'linkedin',
      label: 'LinkedIn',
      handle: 'kaikeferreiraalves',
      url: 'https://www.linkedin.com/in/kaikeferreiraalves',
      primary: true,
    },
    // Outras redes (aparecem menores, abaixo das principais). Ex.: o X dos créditos do Projeto Celeste:
    // { network: 'x', label: 'X', handle: '@meruem085', url: 'https://x.com/meruem085' },
  ],
}
