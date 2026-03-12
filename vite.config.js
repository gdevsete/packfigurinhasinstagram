import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['stickers/logo.png'],
      manifest: {
        name: 'Stories Personalizados Destaques',
        short_name: 'Figurinhas',
        description: 'Figurinhas exclusivas para Instagram Stories',
        theme_color: '#080808',
        background_color: '#080808',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/stickers/logo.png', sizes: '192x192', type: 'image/png' },
          { src: '/stickers/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,webp,gif}'],
        runtimeCaching: [
          {
            urlPattern: /\/stickers\/figurinhas\/.+\.(png|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'stickers-cache',
              expiration: { maxEntries: 1200, maxAgeSeconds: 2592000 },
            },
          },
        ],
      },
    }),
  ],
  server: { port: 3000 },
  optimizeDeps: {
    exclude: ['@imgly/background-removal'],
  },
  build: {
    rollupOptions: {
      external: ['onnxruntime-web/webgpu'],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'virtual': ['react-window', 'react-virtualized-auto-sizer'],
        },
      },
    },
  },
})
