/*
  CURRÍCULO
  ────────────────────────────────────────────────────────────────
  Coloque o PDF em src/assets/curriculo/ (qualquer nome .pdf).
  O site encontra o arquivo sozinho: sem PDF, a seção some do site publicado.
  A data de atualização (opcional) fica em profile.ts → resume.updated.
*/
const files = import.meta.glob<string>('../assets/curriculo/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** Endereço do PDF do currículo (o primeiro em ordem alfabética), ou undefined. */
export const resumeUrl: string | undefined = Object.keys(files)
  .sort()
  .map((key) => files[key])[0]
