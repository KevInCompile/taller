import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './routes/index.tsx'
import { Toaster } from 'sonner'
import { ThemeProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-right" richColors />
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  </StrictMode>,
)
