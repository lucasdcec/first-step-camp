'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Perfil = 'nenhum' | 'explorador' | 'pais'

interface PerfilContextType {
  perfil: Perfil
  definirPerfil: (p: Perfil) => void
  sair: () => void
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined)

export function PerfilProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil>('nenhum')

  const definirPerfil = (p: Perfil) => setPerfil(p)
  const sair = () => setPerfil('nenhum')

  return (
    <PerfilContext.Provider value={{ perfil, definirPerfil, sair }}>
      {children}
    </PerfilContext.Provider>
  )
}

export function usePerfil() {
  const ctx = useContext(PerfilContext)
  if (!ctx) throw new Error('usePerfil deve ser usado dentro de PerfilProvider')
  return ctx
}
