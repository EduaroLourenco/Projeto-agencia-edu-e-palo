import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

/*
 * Fontes auto-hospedadas, não via CDN do Google.
 *
 * O <link> pro fonts.googleapis.com bloqueia a pintura da tela: enquanto
 * aquele host não responde, o visitante olha pra uma página em branco.
 * Medido aqui: com o pedido resolvendo rápido a página pinta em ~200ms;
 * dependurada no host externo, esperava. Servindo do nosso próprio
 * domínio, some o DNS + TLS + round-trip pra um terceiro, e a primeira
 * impressão do site deixa de depender de um servidor que não é nosso.
 *
 * Só os pesos que o site realmente usa — cada import extra é bytes.
 */
import '@fontsource/sora/400.css'
import '@fontsource/sora/600.css'
import '@fontsource/sora/700.css'
import '@fontsource/sora/800.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
