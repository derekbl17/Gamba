import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port:3000, // sets which port front will run on
    proxy:{
      '/api':{
        target:'http://localhost:5001',
        changeOrigin:true
      }
    }
  }
})
