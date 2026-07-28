import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { CartProvider } from './cartcontext'

createRoot(document.getElementById('root')!).render(
    <CartProvider>
  <StrictMode>
    <App />
  </StrictMode>,
    
    </CartProvider>
)
