import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev API key — must match shce.api.key in application-dev.properties
const SHCE_DEV_API_KEY = 'yMWuD0FuoI3JaL/Ke4B7Z05yDF12egwiE+QuzsM069g='

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:8443',
        changeOrigin: true,
        secure: false, // allow self-signed cert in dev
        // Sprint 4: inject API key header on every proxied request
        headers: {
          'X-API-Key': SHCE_DEV_API_KEY,
        },
      },
    },
  },
})