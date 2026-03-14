'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Perfil = 'nenhum' | 'explorador' | 'pais'
type FaixaEtaria = '7-9' | '10-12' | 'nenhuma'

interface PerfilContextType {
  perfil: Perfil
  faixaEtaria: FaixaEtaria
  definirPerfil: (p: Perfil, f?: FaixaEtaria) => void
  sair: () => void
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined)

export function PerfilProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil>('nenhum')
  const [faixaEtaria, setFaixaEtaria] = useState<FaixaEtaria>('nenhuma')

  const definirPerfil = (p: Perfil, f: FaixaEtaria = 'nenhuma') => {
    setPerfil(p)
    setFaixaEtaria(f)
  }

  const sair = () => {
    setPerfil('nenhum')
    setFaixaEtaria('nenhuma')
  }

  return (
    <PerfilContext.Provider value={{ perfil, faixaEtaria, definirPerfil, sair }}>
      {children}
    </PerfilContext.Provider>
  )
}

export function usePerfil() {
  const ctx = useContext(PerfilContext)
  if (!ctx) throw new Error('usePerfil deve ser usado dentro de PerfilProvider')
  return ctx
}
