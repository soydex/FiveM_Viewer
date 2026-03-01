import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/fivem': {
        target: 'https://servers-frontend.fivem.net/api',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api\/fivem/, '')
      }
    }
  }
})
