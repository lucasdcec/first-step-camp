'use client'

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface ThemeContextType {
  temaEscuro: boolean
  alternarTema: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [temaEscuro, setTemaEscuro] = useLocalStorage('primeiro-passo-tema', false)
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    setMontado(true)
    // Aplicar tema ao documento
    if (temaEscuro) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [temaEscuro])

  const alternarTema = () => setTemaEscuro(!temaEscuro)

  // Não renderizar até montar no cliente
  if (!montado) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ temaEscuro, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTema() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTema deve ser usado dentro de ThemeProvider')
  }
  return context
}
