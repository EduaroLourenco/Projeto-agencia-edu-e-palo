import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fonte auto-hospedada para não depender de um servidor externo na primeira pintura.
import '@fontsource-variable/familjen-grotesk/wght.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
