import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null, // registrado a mano en main.tsx via virtual:pwa-register
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        // Identidad de instalación: la Calculadora, no UniCali (la app nativa
        // real se promociona aparte en /descargar). Evita que el usuario
        // confunda este PWA ligero con la app Android completa.
        id: '/herramientas/calculadora-unsa',
        name: 'Calculadora de Notas UNSA',
        short_name: 'Calc. UNSA',
        description: 'Calcula tu promedio ponderado UNSA (evaluación continua + parcial) al instante, incluso sin conexión.',
        start_url: '/herramientas/calculadora-unsa?source=pwa',
        scope: '/herramientas/',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'es-PE',
        theme_color: '#8b004a',
        background_color: '#f2efe7',
        categories: ['education', 'utilities', 'productivity'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        screenshots: [
          {
            src: '/screenshots/calculadora.png',
            sizes: '720x1600',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Calculadora de Notas UNSA',
          },
        ],
      },
      workbox: {
        // El bundle es único para todo el SPA — el precache de shell/JS/CSS
        // beneficia a todas las rutas, no solo a la calculadora (mejora de
        // performance/Core Web Vitals general del sitio).
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/elements\//],
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
