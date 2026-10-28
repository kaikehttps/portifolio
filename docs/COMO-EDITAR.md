# Como editar o portfólio

Você não precisa mexer em componentes. Todo o conteúdo fica em `src/content/`.
Depois de salvar, o `npm run dev` atualiza a página na hora.

> **Exemplos.** Itens marcados com `example: true` aparecem só em desenvolvimento, com um selo
> listrado "EXEMPLO", para você ver como cada composição fica. No site publicado eles somem.
> Apague-os quando cadastrar os seus.

---

## 1. Projetos — `src/content/projects.ts`

A ordem da lista é a ordem no site.

### Adicionar um projeto

1. Crie a pasta `src/assets/projects/<slug>/` (ex.: `src/assets/projects/meu-app/`).
2. Coloque as imagens lá (`.jpg`, `.png` ou `.webp`). Use nomes simples: `capa.jpg`, `tela-1.png`…
   - Capturas de celular: comece o nome com `mobile-` (ex.: `mobile-inicio.png`) — elas ganham tamanhos próprios.
   - Desktop: ideal 2400px de largura. Celular: 1170px. O site converte para AVIF/WebP sozinho.
   - **Vídeo (opcional):** um `.webm` ou `.mp4` com o mesmo nome de uma imagem (ex.: `capa.webm` ao lado de
     `capa.jpg`) toca mudo e em loop por cima dela, só enquanto está na tela. A imagem continua sendo a capa
     e a versão para quem prefere movimento reduzido. Prefira vídeos curtos (5–10 s) e leves (até ~2 MB).
3. Adicione um objeto na lista:

```ts
{
  slug: 'meu-app',                 // vira /projetos/meu-app
  title: 'Meu App',
  subtitle: 'Frase curtinha opcional',
  kind: 'app',                     // 'app' | 'site' | 'produto' | 'experimento'
  year: '2025',
  summary: 'Uma ou duas linhas sobre o projeto.',
  role: ['Design', 'Front-end'],   // sua participação
  stack: ['React Native', 'TypeScript'],
  accent: '#7fe0c3',               // cor do projeto (tinge a apresentação dele)
  layout: 'device',                // 'cinema' | 'editorial' | 'device' | 'poster'
  featured: true,                  // true = vitrine principal; false = lista "Outros projetos"
  cover: { src: 'capa', alt: 'Descreva a imagem', frame: 'mobile' },
  gallery: [
    { src: 'mobile-tela-1', alt: '…', caption: 'Onboarding', frame: 'mobile' },
    { src: 'painel', alt: '…', caption: 'Painel', frame: 'desktop' },
  ],
  links: [
    { kind: 'appstore', url: 'https://apps.apple.com/…' },
    { kind: 'googleplay', url: 'https://play.google.com/…' },
  ],
  details: {                       // opcional — enriquece a página do projeto
    intro: 'Um parágrafo curto.',
    facts: [{ label: 'Plataformas', value: 'iOS · Android' }],
    notes: ['Créditos ou avisos.'],
  },
}
```

### Qual `layout` escolher

| Layout | Composição na página inicial |
|---|---|
| `editorial`, `cinema` ou `poster` | **dividida**: imagem de um lado (com uma tela de celular ao lado, se houver), texto do outro. Os lados alternam e todos os projetos têm o mesmo tamanho. |
| `device` | **aparelho**: até três telas de celular num painel. Para apps (os botões de loja aparecem sozinhos). |

### Outros ajustes

- **Sem imagens ainda?** O site desenha uma arte tipográfica no lugar — dá para publicar assim.
- **Sem página de detalhes:** adicione `page: false`.
- **Tirar da vitrine principal:** `featured: false` (vai para a lista "Outros projetos", mais compacta). Nessa lista, quem não tem página própria (`page: false`) abre o site ou a loja de apps, em outra aba.
- **Fundo do início:** as capas dos projetos em destaque passam atrás do seu nome. Capas claras ficam
  lavadas no fundo escuro — use `backdrop: false` para deixar um projeto de fora (ApexVet e Ottolog já estão assim).
- **Página em capítulos (case):** a ApexVet usa uma página própria, com os textos em `src/content/cases.ts`
  (problema, linha do tempo, funcionalidades, tecnologia, IA, equipe, jornada, encerramento).
  - Datas da linha do tempo: campo `date` (ex.: `'mar 2025'`). Marcos com `pending: true` só aparecem em desenvolvimento.
  - Funcionalidades: `status` `'disponivel'`, `'desenvolvimento'`, `'planejado'` ou `'confirmar'` (este último fica oculto
    no site publicado). Com `image: 'nome'`, a funcionalidade ganha uma linha com imagem grande.
  - Fotos da equipe: `equipe-kaike.jpg`, `equipe-igor.jpg`, `equipe-joao.jpg`, `equipe-guilherme.jpg` na pasta
    `src/assets/projects/apexvet/`. Sem foto, aparecem as iniciais.
  - Jornada da startup: preencha `text` (e `image`, se quiser) em cada item — só os preenchidos aparecem no site.
  - **Galeria (book de fotos):** coloque `galeria-01.jpg`, `galeria-02.jpg`… em `src/assets/projects/apexvet/` —
    elas entram sozinhas no carrossel, na ordem do nome. Para dar legenda, liste a foto em `photos` no `cases.ts`.
- **Remover:** apague o objeto e a pasta de imagens.
- `frame`: `'desktop'` (moldura de navegador), `'mobile'` (moldura de celular) ou `'none'` (sem moldura).

---

## 2. Perfil, apresentação e contato — `src/content/profile.ts`

- `intro`: a apresentação curta da tela inicial (1–2 linhas).
- `about.body`: até dois parágrafos curtos da seção Sobre. Enquanto estiver vazio, aparece um lembrete só em
  `npm run dev`; no site publicado o bloco some.
- `about.quote`: a citação em destaque (`text`, `author`, `source`, `year`). Uma palavra entre `[colchetes]`
  ganha a cor de sinal. Hoje: "É preciso imaginar Sísifo [feliz]." — Albert Camus, *O Mito de Sísifo* (1942).
- `role`: o cargo da assinatura e da etiqueta do início ("Desenvolvedor full stack").
- A cena de Sísifo (encosta, pedra e figura) está guardada em `src/sections/About/Sisyphus.tsx`, fora de uso por enquanto.
- `socials`: os links do contato. **Instagram e LinkedIn** têm `primary: true` e aparecem grandes.
  - Preencha `url` com o endereço completo. Com `url` vazio o link aparece como "pendente" em
    desenvolvimento e fica oculto no site publicado. Instagram: `kaike_alvesz`.
  - O LinkedIn (`kaikeferreiraalves`) veio dos créditos do site do Projeto Celeste — confira.
  - Outras redes (sem `primary`) aparecem pequenas abaixo; o X dos créditos está comentado no arquivo.

Os textos atuais de `intro` e `about` são **rascunhos** baseados no que você já publicou. Reescreva com as suas palavras.

---

## 3. Currículo — `src/assets/curriculo/`

Coloque o seu currículo em PDF nessa pasta (qualquer nome terminado em `.pdf`). O site encontra o
arquivo sozinho e mostra a seção **Currículo** com o botão "Baixar currículo" e o link "Ver no navegador".

- O arquivo baixa com o nome `Kaike-Alves-Curriculo.pdf`, seja qual for o nome original.
- Data de atualização (opcional): `resume.updated` em `src/content/profile.ts` (ex.: `'mar 2026'`).
- Para trocar o currículo, substitua o PDF e gere o build de novo.
- Sem PDF, a seção aparece como "pendente" em desenvolvimento e some do site publicado.

---

## 4. Skills e ferramentas — `src/content/stack.ts`

Grupos (Front-end, Mobile, Back-end, Infraestrutura, IA) com ferramentas:

```ts
{ name: 'Docker', icon: 'docker' }
{ name: 'Claude', icon: 'claude', core: true, note: 'Nome do modelo' }
```

- `icon`: chave do ícone em `src/lib/tech-icons.ts`. Para uma ferramenta nova, procure o ícone em
  https://simpleicons.org, importe-o nesse arquivo (ex.: `siSupabase`) e crie a chave. Sem ícone, aparece a inicial.
- `note`: um destaque curto ao lado do nome (um modelo ou recurso específico).
- `core: true`: a ferramenta vem primeiro no grupo, com mais peso.
- Itens com `example: true` são sugestões (só em desenvolvimento). Um grupo sem itens reais some do site.

---

## 5. Cores, fontes e espaçamentos

Em `src/styles/tokens.css`. O acento do site é `--signal` (vermelho-sinal). A cor de cada projeto vem do
campo `accent` dele. As regras visuais estão em `docs/DIRECAO-DE-ARTE.md`.
