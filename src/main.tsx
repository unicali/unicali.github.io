import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

registerSW({ immediate: true })

// El build prerenderiza title/canonical/OG/JSON-LD por ruta (scripts/prerender.mjs)
// para que crawlers sin JS vean el meta correcto. React monta con createRoot
// (no hydrateRoot) y <Helmet> no sabe que esos tags ya existen, así que los
// volvería a insertar duplicados. Se limpian antes de montar; Helmet los
// recrea de inmediato con el mismo contenido.
document.querySelectorAll('[data-prerendered]').forEach((el) => el.remove())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
