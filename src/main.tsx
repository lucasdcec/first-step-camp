import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { PerfilProvider } from '@/contexts/PerfilContext'
import '@/assets/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PerfilProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PerfilProvider>
  </React.StrictMode>,
)
