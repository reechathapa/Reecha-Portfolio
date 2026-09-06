import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['.e2b.app', 'localhost'],
    watch: { ignored: ['**/.cache/**', '**/test-results/**', '**/playwright-report/**'] },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['.e2b.app', 'localhost'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          motion: ['motion/react'],
          gsap: ['gsap', 'gsap/ScrollTrigger'],
          'magnetic-physics': ['react-motion'],
        },
      },
    },
  },
})
