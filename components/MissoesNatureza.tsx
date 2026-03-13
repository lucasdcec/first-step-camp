'use client'

import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTema } from '@/contexts/ThemeContext'
import AvatarIA from './AvatarIA'

interface MissoesNaturezaProps {
  aoVoltar?: () => void
}

const MISSOES = [
  { id: 1, titulo: "Aventura ao Ar Livre de Hoje", icone: '🌿', descricao: 'Saia e encontre:', tarefas: ['3 folhas diferentes', '1 inseto', 'Algo redondo na natureza'], concluida: false },
  { id: 2, titulo: 'Ouça a Natureza', icone: '🎵', descricao: 'Passe 5 minutos ao ar livre e ouça:', tarefas: ['Sons de pássaros', 'Vento ou folhas', 'Qualquer outro som'], concluida: false },
  { id: 3, titulo: 'Observador de Céu', icone: '☁️', descricao: 'Olhe para o céu e encontre:', tarefas: ['1 forma de nuvem', 'A cor do céu hoje', 'Pássaros ou insetos voando'], concluida: false },
  { id: 4, titulo: 'Explorador de Texturas', icone: '✋', descricao: 'Encontre coisas com texturas:', tarefas: ['Algo liso', 'Algo áspero', 'Algo macio'], concluida: false },
]

export default function MissoesNatureza({ aoVoltar }: MissoesNaturezaProps) {
  const { temaEscuro } = useTema()
  const [missaoSelecionadaId, setMissaoSelecionadaId] = useState<number | null>(null)
  const [resposta, setResposta] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [missoes, setMissoes] = useLocalStorage('primeiro-passo-missoes', MISSOES)

  const missaoAtual = missoes.find(m => m.id === missaoSelecionadaId)

  const aoEnviar = () => {
    if (resposta.trim() && missaoSelecionadaId) {
      setMissoes(missoes.map(m => m.id === missaoSelecionadaId ? { ...m, concluida: true } : m))
      setEnviado(true)
      setTimeout(() => {
        setMissaoSelecionadaId(null)
        setResposta('')
        setEnviado(false)
      }, 2500)
    }
  }

  if (enviado && missaoAtual) {
    return (
      <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'} items-center justify-center p-6`}>
        <AvatarIA tamanho="grande" expressao="animado" animado={true} />
        <div className="text-center space-y-3 mt-4">
          <h2 className={`text-2xl font-bold ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Explorador Incrível!</h2>
          <p className={`text-sm ${temaEscuro ? 'text-gray-300' : 'text-gray-600'}`}>Você completou a missão</p>
          <p className={`text-xs italic ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>"{missaoAtual.titulo}"</p>
          <div className={`mt-4 rounded-xl p-4 border-l-4 ${temaEscuro ? 'bg-green-900/30 border-green-700 text-green-200' : 'bg-green-50 border-green-400 text-green-900'}`}>
            <p className="text-xs"><strong>🌟</strong> Você está se conectando com a natureza! Continue explorando o mundo real.</p>
          </div>
        </div>
      </div>
    )
  }

  if (missaoSelecionadaId && missaoAtual) {
    return (
      <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex items-center justify-between p-4 border-b ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
          <button onClick={() => setMissaoSelecionadaId(null)} className={`transition-colors ${temaEscuro ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-neutral-900'}`}>←</button>
          <h1 className={`font-semibold text-sm ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Completar Missão</h1>
          <div className="w-6" />
        </div>

        <div className={`flex-1 overflow-y-auto p-6 flex flex-col space-y-6 ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center">
            <span className="text-5xl block mb-3">{missaoAtual.icone}</span>
            <h2 className={`text-lg font-semibold mb-2 ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>{missaoAtual.titulo}</h2>
            <p className={`text-sm ${temaEscuro ? 'text-gray-300' : 'text-gray-600'}`}>{missaoAtual.descricao}</p>
          </div>

          <div className={`rounded-2xl p-4 space-y-2 ${temaEscuro ? 'bg-gray-700' : 'bg-gray-50'}`}>
            {missaoAtual.tarefas.map((tarefa, idx) => (
              <div key={idx} className={`flex items-start gap-2 text-sm ${temaEscuro ? 'text-gray-300' : 'text-neutral-900'}`}>
                <span className="text-lg">☐</span>
                <span>{tarefa}</span>
              </div>
            ))}
          </div>

          <div className={`rounded-xl p-3 border-l-4 ${temaEscuro ? 'bg-blue-900/30 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-400 text-blue-900'}`}>
            <p className="text-xs"><strong>💡 Dica:</strong> Saia, complete a missão, e depois conte-nos o que encontrou!</p>
          </div>
        </div>

        <div className={`border-t p-4 space-y-2 ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'}`}>
          <label className={`text-xs font-semibold ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>O que você encontrou?</label>
          <textarea value={resposta} onChange={(e) => setResposta(e.target.value)} placeholder="Conte-nos sobre sua descoberta..." maxLength={200} rows={4} className={`w-full rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${temaEscuro ? 'bg-gray-700 text-white placeholder-gray-500' : 'bg-gray-100 text-neutral-900 placeholder-gray-500'}`} />
          <div className="flex items-center justify-between">
            <p className={`text-xs ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>{resposta.length}/200</p>
            <button onClick={aoEnviar} disabled={!resposta.trim()} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl px-4 py-2 transition-colors font-medium text-sm">Enviar</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`flex items-center justify-between p-4 border-b ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
        <button onClick={aoVoltar} className={`transition-colors ${temaEscuro ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-neutral-900'}`}>←</button>
        <h1 className={`font-semibold text-sm ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Missões da Natureza</h1>
        <div className="w-6" />
      </div>

      <div className={`bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-4 py-3 border-b ${temaEscuro ? 'border-gray-700' : 'border-emerald-200'}`}>
        <p className={`text-xs ${temaEscuro ? 'text-emerald-200' : 'text-emerald-900'}`}><strong>Completadas:</strong> {missoes.filter(m => m.concluida).length}/{missoes.length}</p>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
        {missoes.map((missao) => (
          <button key={missao.id} onClick={() => setMissaoSelecionadaId(missao.id)} disabled={missao.concluida} className={`w-full text-left rounded-2xl p-4 transition-all ${missao.concluida ? (temaEscuro ? 'bg-green-900/30 border-2 border-green-700' : 'bg-green-50 border-2 border-green-300 opacity-75') : (temaEscuro ? 'bg-gray-700 hover:bg-gray-600 border-2 border-gray-600 active:scale-95' : 'bg-gradient-to-br from-emerald-100 to-teal-100 hover:shadow-lg active:scale-95 border-2 border-emerald-300')}`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl">{missao.icone}</span>
              <div className="flex-1">
                <h3 className={`font-semibold text-neutral-900 dark:text-white text-sm`}>{missao.titulo}</h3>
                <p className={`text-xs mt-1 ${temaEscuro ? 'text-gray-400' : 'text-gray-600'}`}>{missao.descricao}</p>
              </div>
              {missao.concluida && <span className="text-xl">✅</span>}
            </div>
          </button>
        ))}
      </div>

      <div className={`border-t p-4 ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'}`}>
        <div className={`rounded-xl p-3 border-l-4 ${temaEscuro ? 'bg-emerald-900/30 border-emerald-700 text-emerald-200' : 'bg-emerald-50 border-emerald-400 text-emerald-900'}`}>
          <p className="text-xs"><strong>🌍:</strong> Saia e explore o mundo real!</p>
        </div>
      </div>
    </div>
  )
}
