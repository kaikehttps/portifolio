import type { StackGroup } from './types'

/*
  SKILLS E FERRAMENTAS
  ────────────────────────────────────────────────────────────────
  • `icon`: chave do ícone em src/lib/tech-icons.ts (React, Docker, Claude…).
    Para uma tecnologia nova, adicione o ícone lá (Simple Icons) e use a chave aqui.
    Sem `icon`, aparece a inicial do nome.
  • `note` (no item): destaque curto ao lado do nome — um modelo ou recurso específico.
  • `soft: true` (no grupo) deixa o grupo mais discreto — usado em "No radar".
  • Itens com `example: true` só aparecem em desenvolvimento.
    Um grupo sem itens reais some do site publicado.
*/

export const stack: StackGroup[] = [
  {
    label: 'Interface & Mobile',
    note: 'Interfaces web em React e apps em Flutter',
    items: [
      { name: 'HTML5', icon: 'html5' },
      { name: 'CSS', icon: 'css' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'React', icon: 'react' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
      { name: 'Context API', icon: 'context' },
      { name: 'React Query', icon: 'reactquery' },
      { name: 'Flutter', icon: 'flutter' },
      { name: 'Dart', icon: 'dart' },
    ],
  },
  {
    label: 'Backend & APIs',
    note: 'APIs REST, autenticação e regras de negócio',
    items: [
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'NestJS', icon: 'nestjs' },
      { name: 'Express', icon: 'express' },
      { name: 'Python', icon: 'python' },
      { name: 'FastAPI', icon: 'fastapi' },
      { name: 'Java', icon: 'java' },
      { name: 'Spring Boot', icon: 'springboot' },
      { name: 'C#', icon: 'csharp' },
      { name: 'JWT', icon: 'jwt' },
      { name: 'REST', icon: 'rest' },
    ],
  },
  {
    label: 'Dados & Cloud',
    note: 'Bancos relacionais, ORM e deploy',
    items: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Prisma', icon: 'prisma' },
      { name: 'Supabase', icon: 'supabase' },
      { name: 'Vercel', icon: 'vercel' },
    ],
  },
  {
    label: 'IA aplicada',
    note: 'Explorando IA — ex.: transcrição de áudio com Whisper',
    items: [
      { name: 'Whisper', icon: 'whisper' },
      { name: 'NLP', icon: 'nlp' },
      { name: 'LLMs', icon: 'llm' },
      { name: 'Claude', icon: 'claude' },
      { name: 'ChatGPT', icon: 'openai' },
    ],
  },
  {
    label: 'Qualidade & Workflow',
    note: 'Testes, documentação, CI e containers',
    items: [
      { name: 'Jest', icon: 'jest' },
      { name: 'Vitest', icon: 'vitest' },
      { name: 'Testing Library', icon: 'testinglibrary' },
      { name: 'Swagger', icon: 'swagger' },
      { name: 'Postman', icon: 'postman' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'GitHub Actions', icon: 'githubactions' },
      { name: 'Docker', icon: 'docker' },
      { name: 'Vite', icon: 'vite' },
    ],
  },
  {
    label: 'No radar',
    note: 'Tenho contato, mas ainda fora dos meus repositórios públicos',
    soft: true,
    items: [
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'Angular', icon: 'angular' },
      { name: 'styled-components', icon: 'styledcomponents' },
      { name: 'React Native', icon: 'react' },
      { name: 'Expo', icon: 'expo' },
      { name: 'Redux', icon: 'redux' },
      { name: 'Zustand' },
      { name: 'Firebase', icon: 'firebase' },
    ],
  },
]
