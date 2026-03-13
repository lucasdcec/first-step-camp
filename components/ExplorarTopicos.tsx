'use client'

import { useState } from 'react'
import { useTema } from '@/contexts/ThemeContext'

interface ExplorarTopicosProps {
  aoSelecionarPergunta?: (pergunta: string) => void
  aoVoltar?: () => void
}

const TOPICOS = [
  {
    id: 'espaco',
    icone: '🚀',
    label: 'Espaço',
    cor: 'from-blue-400 to-blue-600',
    descricao: 'Explore planetas, estrelas e o universo',
    perguntas: ['O que é a Lua?', 'Por que o espaço é escuro?', 'Quantos planetas existem?', 'O que é um buraco negro?'],
  },
  {
    id: 'dinossauros',
    icone: '🦖',
    label: 'Dinossauros',
    cor: 'from-green-400 to-green-600',
    descricao: 'Aprenda sobre criaturas antigas',
    perguntas: ['Por que os dinossauros desapareceram?', 'Qual era o maior dinossauro?', 'Os dinossauros tinham penas?', 'Como sabemos sobre dinossauros?'],
  },
  {
    id: 'oceano',
    icone: '🌊',
    label: 'Oceano',
    cor: 'from-cyan-400 to-blue-600',
    descricao: 'Descubra as profundezas do mar',
    perguntas: ['Por que as baleias cantam?', 'O que é corais?', 'Os tubarões são perigosos?', 'Quão profundo é o oceano?'],
  },
  {
    id: 'animais',
    icone: '🦁',
    label: 'Animais',
    cor: 'from-orange-400 to-red-600',
    descricao: 'Aprenda sobre animais selvagens',
    perguntas: ['Por que os animais têm caudas?', 'Como os pássaros voam?', 'Os animais dormem?', 'Por que as zebras têm listras?'],
  },
  {
    id: 'invencoes',
    icone: '💡',
    label: 'Invenções',
    cor: 'from-yellow-400 to-orange-600',
    descricao: 'Descubra criações incríveis',
    perguntas: ['Quem inventou a roda?', 'Como a eletricidade funciona?', 'O que é um robô?', 'Como os aviões voam?'],
  },
  {
    id: 'terra',
    icone: '🌍',
    label: 'Terra',
    cor: 'from-teal-400 to-cyan-600',
    descricao: 'Aprenda sobre nosso planeta',
    perguntas: ['Por que temos estações?', 'O que causa terremotos?', 'Por que vulcões entram em erupção?', 'O que é clima?'],
  }
]

export default function ExplorarTopicos({ aoSelecionarPergunta, aoVoltar }: ExplorarTopicosProps) {
  const { temaEscuro } = useTema()
  const [topicoSelecionado, setTopicoSelecionado] = useState<string | null>(null)
  const topicoAtual = TOPICOS.find(t => t.id === topicoSelecionado)

  if (topicoSelecionado && topicoAtual) {
    return (
      <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex items-center justify-between p-4 border-b ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
          <button onClick={() => setTopicoSelecionado(null)} className={`transition-colors ${temaEscuro ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-neutral-900'}`}>← Voltar</button>
          <h1 className={`font-semibold text-sm ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>{topicoAtual.label}</h1>
          <div className="text-2xl">{topicoAtual.icone}</div>
        </div>

        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`bg-gradient-to-br ${topicoAtual.cor} rounded-2xl p-4 text-white`}>
            <p className="text-sm font-medium">{topicoAtual.descricao}</p>
          </div>

          <div>
            <h2 className={`text-sm font-semibold mb-3 ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Perguntas que você pode explorar:</h2>
            <div className="space-y-2">
              {topicoAtual.perguntas.map((pergunta, idx) => (
                <button key={idx} onClick={() => { aoSelecionarPergunta?.(pergunta); setTopicoSelecionado(null) }} className={`w-full text-left rounded-xl px-4 py-3 transition-colors border ${temaEscuro ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' : 'bg-gray-50 hover:bg-gray-100 text-neutral-900 border-gray-200'}`}>
                  <p className="text-sm font-medium">• {pergunta}</p>
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-xl p-3 border-l-4 ${temaEscuro ? 'bg-purple-900/30 border-purple-700 text-purple-200' : 'bg-purple-50 border-purple-400 text-purple-900'}`}>
            <p className="text-xs"><strong>Curiosidade!</strong> Cada tópico tem perguntas ilimitadas para explorar!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`flex items-center justify-between p-4 border-b ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
        <button onClick={aoVoltar} className={`transition-colors ${temaEscuro ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-neutral-900'}`}>←</button>
        <h1 className={`font-semibold text-sm ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Explorar Tópicos</h1>
        <div className="w-6" />
      </div>

      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
        {TOPICOS.map((topico) => (
          <button key={topico.id} onClick={() => setTopicoSelecionado(topico.id)} className={`w-full text-left bg-gradient-to-br ${topico.cor} hover:shadow-lg rounded-2xl p-4 transition-all active:scale-95`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{topico.icone}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">{topico.label}</h3>
                <p className="text-white/90 text-xs">{topico.descricao}</p>
              </div>
              <span className="text-white text-xl">→</span>
            </div>
          </button>
        ))}
      </div>

      <div className={`border-t p-3 text-center text-xs ${temaEscuro ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-500'}`}>
        <p>Clique em qualquer tópico para ver perguntas</p>
      </div>
    </div>
  )
}
