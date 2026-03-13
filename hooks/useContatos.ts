'use client'

import { useLocalStorage } from './useLocalStorage'

export interface Contato {
  id: string
  nome: string
  icone: string
  ultimaMensagem: string
  ultimoHorario: string
  numero?: string
}

const CONTATOS_PADRAO: Contato[] = [
  { 
    id: 'mae', 
    nome: 'Mamãe', 
    icone: '👩', 
    ultimaMensagem: 'Se divirta aprendendo!', 
    ultimoHorario: '14:30',
    numero: '+55 11 9999-1111'
  },
  { 
    id: 'pai', 
    nome: 'Papai', 
    icone: '👨', 
    ultimaMensagem: 'Parabéns pelo quiz!', 
    ultimoHorario: '12:15',
    numero: '+55 11 9999-2222'
  },
  { 
    id: 'vovo', 
    nome: 'Vovó', 
    icone: '👵', 
    ultimaMensagem: 'Adoro ouvir sobre suas descobertas', 
    ultimoHorario: '10:00',
    numero: '+55 11 9999-3333'
  },
  { 
    id: 'lucas', 
    nome: 'Lucas', 
    icone: '👦', 
    ultimaMensagem: 'App legal demais!', 
    ultimoHorario: 'Ontem',
    numero: '+55 11 9999-4444'
  },
]

export function useContatos() {
  const [contatos, setContatos] = useLocalStorage<Contato[]>('primeiro-passo-contatos', CONTATOS_PADRAO)

  const adicionarContato = (contato: Contato) => {
    setContatos(prev => [...prev, contato])
  }

  const atualizarContato = (id: string, atualizado: Partial<Contato>) => {
    setContatos(prev => 
      prev.map(c => c.id === id ? { ...c, ...atualizado } : c)
    )
  }

  const removerContato = (id: string) => {
    setContatos(prev => prev.filter(c => c.id !== id))
  }

  return { contatos, adicionarContato, atualizarContato, removerContato }
}
