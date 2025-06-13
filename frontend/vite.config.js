import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Conditionally configure proxy only in development
const proxyConfig = process.env.NODE_ENV === 'development' ? {
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
} : {}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  ...proxyConfig,
  base: '/', // Important for production deployment
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})