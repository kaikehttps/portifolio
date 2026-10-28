# Direção de arte

Portfólio de **Kaike Alves**, desenvolvedor front-end. Este documento é a fonte de verdade visual:
qualquer componente novo deve parecer pertencer a ele.

---

## 1. Conceito — maximalismo com espaço para respirar

A grandiosidade de Cyberpunk e Deadlock (tipografia expressiva, imagens enormes, composição de cinema)
organizada com a clareza do KC1T (coluna central, margens generosas, seções bem separadas).

- O maximalismo está na **qualidade** de cada peça — não na quantidade de elementos.
- **Uma coisa por vez.** Em cada tela existe um elemento dominante (o nome, uma imagem de projeto,
  um título). O resto é discreto.
- Quem abre a página precisa entender a estrutura passando o olho: toda seção começa do mesmo jeito
  (fio, `01 — Rótulo`, título em serifa).
- Nada de elementos sobrepostos sem motivo, palavras-fantasma de fundo, HUDs, timecodes ou faixas
  decorativas competindo com o conteúdo.

---

## 2. Cor

| Token | Valor | Uso |
|---|---|---|
| `--ink-0` | `#050505` | fundo da página (predominante) |
| `--ink-1/2/3` | `#0b0b0c` `#131315` `#1c1c1f` | superfícies, painéis, hover |
| `--bone` | `#ece6da` | texto principal (osso, quente) |
| `--bone-dim` | 66% | texto secundário — passa AA |
| `--bone-mute` | 40% | **só** rótulos decorativos, nunca texto que precisa ser lido |
| `--line` / `--line-strong` | 12% / 28% | fios e contornos |
| `--signal` | `#ff4d1a` | o único acento do site: números de seção, foco, hover do contato |
| `--accent` | por projeto | cada projeto traz sua cor (`project.accent`) e tinge só a própria apresentação |

- O sinal é **pontual**. A cor extra vem das imagens dos projetos.
- Proibido: gradientes roxos genéricos, neon com glow, sombras coloridas difusas.
- Textura: granulação discreta em `overlay` (`src/components/Grain`) — some no preto, aparece nas imagens.

---

## 3. Tipografia

| Papel | Fonte | Uso |
|---|---|---|
| Display | Archivo (variável, eixo `wdth`) comprimida, caixa-alta | nome no início, títulos de projeto, redes do contato |
| Serifa | Instrument Serif (normal e itálico) | títulos de seção, citação do Sobre, subtítulos |
| Mono | IBM Plex Mono | rótulos pequenos: `01 — Projetos`, metadados, botões |
| Texto | Archivo normal | parágrafos |

- Títulos de seção: serifa, `clamp(2.5rem, 5vw, 4.75rem)`. Um trecho em `<em>` vira itálico mais apagado.
- Títulos de projeto: display comprimida, `clamp(2.5rem, 4.6vw, 4.5rem)`.
- Parágrafos com no máximo ~44 caracteres por linha e entrelinha 1.6.

---

## 4. Composição

- Coluna central `.container` (`--content: 1240px`) com margem lateral `--gutter`; imagens grandes podem
  usar `.container-wide` (`--content-wide: 1480px`).
- Espaço entre seções: `--section-pad`. Entre projetos: `clamp(120px, 14vw, 220px)`.
- Cabeçalho de seção: sempre `<SectionHead>` (`src/components/SectionHead.tsx`).
- Projetos (`src/sections/Work`): todos do mesmo tamanho — **dividida** (imagem ao lado do texto, lados
  alternados) ou **aparelho** (`device`, telas de celular num painel).
  Cada uma mostra só nome, imagem, descrição curta, participação e links.

---

## 5. Movimento

Poucos efeitos, bem feitos:

1. Abertura curta (contador e obturador) na primeira visita.
2. O nome do início reage ao ponteiro (o eixo de largura cresce perto do mouse).
3. Imagens entram com uma placa que sai do quadro (`ClipReveal`).
4. Títulos de seção sobem da máscara (`MaskReveal`); blocos de texto com `FadeUp`.
5. Troca de página com obturador; capa do projeto abre em letterbox.

Tudo respeita `prefers-reduced-motion` (MotionConfig `reducedMotion="user"` + regras CSS).
Animação via `LazyMotion` estrito: use sempre `m.div`, `m.span`… importando `{ m }` de `motion/react`.

---

## 6. Cursor (contrato)

Cursor "visor" só em ponteiro fino. Os elementos declaram o estado:

| Atributo | Efeito |
|---|---|
| `data-cursor="view"` + `data-cursor-label="Ver projeto"` | visor abre com rótulo (imagens e títulos de projeto) |
| `data-cursor="link"` | visor enquadra o alvo (botões e links) |
| `data-cursor="drag"` | rótulo "Arraste" (carrosséis) |
| `data-cursor="hide"` | esconde o visor |

Links e botões comuns ganham o estado `link` automaticamente.

---

## 7. Responsividade

Não é encolher: é reorganizar.
- ≤ 960px: projetos em uma coluna (imagem primeiro), Skills com o rótulo do grupo em cima.
- ≤ 640px: o nome do início ocupa a largura, o quadro de projeção vira uma faixa abaixo dele;
  linhas de contato com o usuário embaixo do nome da rede.
- Celular deitado / telas baixas: o nome mede pela altura para caber no primeiro quadro.

---

## 8. Acessibilidade

- Um `h1` (o nome), um `h2` por seção, `h3` para projetos e grupos.
- Foco visível em tudo (`:focus-visible` com o sinal); link "Pular para o conteúdo".
- Visuais clicáveis duplicados ficam fora da ordem de tabulação (`tabIndex=-1`); o título é o link.
- Links externos avisam "(abre em nova aba)" para leitores de tela.

---

## 9. Conteúdo

Tudo em `src/content/`. Nada de texto de conteúdo fixo dentro de componentes.
Itens com `example: true` aparecem só em desenvolvimento. Nunca inventar projetos, resultados ou links.

---

## 10. Código

- React + TypeScript estrito, CSS Modules por componente, tokens de `src/styles/tokens.css`.
- Bibliotecas: `motion` (`motion/react`), `lenis`, `react-router`, `simple-icons` (ícones das ferramentas).
- Revelações prontas em `src/components/Reveal.tsx`. Regra: o elemento observado nunca é o que está
  escondido (no Chromium, um alvo recortado a zero nunca "entra" na tela).
