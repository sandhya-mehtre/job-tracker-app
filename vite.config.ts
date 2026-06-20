import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split large, stable vendor libraries into their own cacheable chunks
        // so the app code (and the charts chunk) stay small.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('@dnd-kit')) return 'vendor-dnd'
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes('@reduxjs') ||
            id.includes('react-redux')
          ) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})
