import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: '誰殺了秦得參？',
        short_name: '誰殺了秦得參？',
        description: '一桿秤仔・文學推理 RPG',
        lang: 'zh-Hant',
        start_url: '/',
        display: 'standalone',
        theme_color: '#1b2525',
        background_color: '#f4f0e7',
        icons: [
          {
            src: 'pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ]
})
