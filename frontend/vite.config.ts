import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/restaurants': 'https://food-delivery-service-production.up.railway.app',
    },
  },
})
