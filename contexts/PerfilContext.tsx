'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Perfil = 'nenhum' | 'explorador' | 'pais'
export type MotivoBloqueio = 'pausado' | 'tempo'

interface PerfilContextType {
  perfil: Perfil
  definirPerfil: (p: Perfil) => void
  sair: () => void
  bloqueado: boolean
  motivoBloqueio: MotivoBloqueio
  bloquear: (motivo: MotivoBloqueio) => void
  desbloquear: () => void
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined)

export function PerfilProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil>('nenhum')
  const [bloqueado, setBloqueado] = useState(false)
  const [motivoBloqueio, setMotivoBloqueio] = useState<MotivoBloqueio>('pausado')

  const definirPerfil = (p: Perfil) => setPerfil(p)
  const sair = () => setPerfil('nenhum')
  const bloquear = (motivo: MotivoBloqueio) => { setBloqueado(true); setMotivoBloqueio(motivo) }
  const desbloquear = () => setBloqueado(false)

  return (
    <PerfilContext.Provider value={{ perfil, definirPerfil, sair, bloqueado, motivoBloqueio, bloquear, desbloquear }}>
      {children}
    </PerfilContext.Provider>
  )
}

export function usePerfil() {
  const ctx = useContext(PerfilContext)
  if (!ctx) throw new Error('usePerfil deve ser usado dentro de PerfilProvider')
  return ctx
}
