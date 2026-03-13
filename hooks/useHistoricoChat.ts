'use client'

import { useLocalStorage } from './useLocalStorage'

interface Mensagem {
  tipo: 'usuario' | 'ia'
  texto: string
  timestamp: number
}

export function useHistoricoChat() {
  const [historico, setHistorico] = useLocalStorage<Mensagem[]>('primeiro-passo-chat', [])

  const adicionarMensagem = (mensagem: Omit<Mensagem, 'timestamp'>) => {
    const novaMensagem = {
      ...mensagem,
      timestamp: Date.now()
    }
    setHistorico(prev => [...prev, novaMensagem])
  }

  const limparHistorico = () => setHistorico([])

  return { historico, adicionarMensagem, limparHistorico }
}
