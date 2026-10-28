import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    react(),
    // Gera AVIF + WebP em várias larguras a partir das imagens em src/assets/projects.
    imagetools({
      removeMetadata: true,
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    // PDFs (currículo) sempre como arquivo próprio, nunca embutidos no JS
    assetsInlineLimit: (file) => (file.endsWith('.pdf') ? false : undefined),
  },
  // 5180 para não colidir com outros projetos Vite rodando na 5173.
  server: { port: 5180 },
  preview: { port: 4180 },
})
