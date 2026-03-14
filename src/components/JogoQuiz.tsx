'use client'

import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTema } from '@/contexts/ThemeContext'
import AvatarIA from './AvatarIA'

interface JogoQuizProps {
  aoVoltar?: () => void
}

const QUIZZES = [
  { id: 1, pergunta: 'Qual planeta é conhecido como o Planeta Vermelho?', opcoes: ['Terra', 'Marte', 'Júpiter'], correto: 1, explicacao: 'Marte é vermelho porque seu solo contém óxido de ferro, o que dá uma cor ferrugem!' },
  { id: 2, pergunta: 'O que os dinossauros e pássaros têm em comum?', opcoes: ['Podem voar', 'Alguns tinham penas', 'Vivem hoje'], correto: 1, explicacao: 'Muitos dinossauros realmente tinham penas! Os cientistas descobriram que pássaros são descendentes de dinossauros.' },
  { id: 3, pergunta: 'Qual animal pode dormir com um olho aberto?', opcoes: ['Golfinho', 'Gato', 'Coelho'], correto: 0, explicacao: 'Golfinhos dormem com um olho aberto para respirar e ficar atento ao perigo ao mesmo tempo!' },
  { id: 4, pergunta: 'Qual é a profundidade do oceano mais profundo?', opcoes: ['1 km', '5 km', '11 km'], correto: 2, explicacao: 'A Fossa das Marianas tem cerca de 11 km de profundidade - mais profunda que o Monte Everest é alto!' },
  { id: 5, pergunta: 'O que as plantas fazem que respiramos?', opcoes: ['Água', 'Oxigênio', 'Carbono'], correto: 1, explicacao: 'As plantas fazem oxigênio através da fotossíntese. Sem plantas, não teríamos o ar que respiramos!' }
]

export default function JogoQuiz({ aoVoltar }: JogoQuizProps) {
  const { temaEscuro } = useTema()
  const [indiceQuizAtual, setIndiceQuizAtual] = useState(0)
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null)
  const [respondido, setRespondido] = useState(false)
  const [pontos, setPontos] = useState(0)
  const [concluido, setConcluido] = useState(false)
  const [progresso, setProgresso] = useLocalStorage('primeiro-passo-quiz-progresso', { indiceAtual: 0, pontos: 0, concluido: false })

  useEffect(() => {
    setIndiceQuizAtual(progresso.indiceAtual)
    setPontos(progresso.pontos)
    setConcluido(progresso.concluido)
  }, [])

  useEffect(() => {
    setProgresso({ indiceAtual: indiceQuizAtual, pontos, concluido })
  }, [indiceQuizAtual, pontos, concluido])

  const quizAtual = QUIZZES[indiceQuizAtual]
  const estaCorreto = respostaSelecionada === quizAtual?.correto

  const aoClicarResposta = (indice: number) => {
    setRespostaSelecionada(indice)
    setRespondido(true)
    if (indice === quizAtual.correto) {
      setPontos(pontos + 1)
    }
  }

  const aoClicarProximo = () => {
    if (indiceQuizAtual < QUIZZES.length - 1) {
      setIndiceQuizAtual(indiceQuizAtual + 1)
      setRespostaSelecionada(null)
      setRespondido(false)
    } else {
      setConcluido(true)
    }
  }

  const aoReiniciar = () => {
    setIndiceQuizAtual(0)
    setRespostaSelecionada(null)
    setRespondido(false)
    setPontos(0)
    setConcluido(false)
  }

  if (!quizAtual) {
    return <div className={`flex items-center justify-center h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}><p>Carregando...</p></div>
  }

  if (concluido) {
    return (
      <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex items-center justify-between p-4 border-b ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
          <button onClick={aoVoltar} className={`transition-colors ${temaEscuro ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-neutral-900'}`}>←</button>
          <h1 className={`font-semibold text-sm ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Quiz Completo!</h1>
          <div className="w-6" />
        </div>

        <div className={`flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center space-y-6 ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
          <AvatarIA tamanho="grande" expressao="animado" animado={true} />
          <div className="text-center space-y-3">
            <h2 className={`text-2xl font-bold ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Parabéns!</h2>
            <p className={`text-sm ${temaEscuro ? 'text-gray-300' : 'text-gray-600'}`}>Você aprendeu muito hoje</p>
          </div>

          <div className={`w-full max-w-xs rounded-2xl p-6 text-center border-2 ${temaEscuro ? 'bg-gray-700 border-blue-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500'}`}>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{pontos}/5</p>
            <p className={`text-sm ${temaEscuro ? 'text-gray-300' : 'text-neutral-900'}`}>Respostas Corretas</p>
          </div>

          <div className={`rounded-xl p-4 border-l-4 text-center ${temaEscuro ? 'bg-green-900/30 border-green-700 text-green-200' : 'bg-green-50 border-green-400 text-green-900'}`}>
            <p className="text-xs"><strong>🎉 Incrível!</strong> Continue explorando e aprendendo mais tópicos!</p>
          </div>

          <div className="flex gap-2 w-full max-w-xs">
            <button onClick={aoReiniciar} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition-colors">Tentar Novamente</button>
            <button onClick={aoVoltar} className={`flex-1 font-semibold py-2 rounded-xl transition-colors ${temaEscuro ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-neutral-900'}`}>Início</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`flex items-center justify-between p-4 border-b ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
        <button onClick={aoVoltar} className={`transition-colors ${temaEscuro ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-neutral-900'}`}>←</button>
        <div className="text-center">
          <h1 className={`font-semibold text-sm ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Hora do Quiz!</h1>
          <p className={`text-xs ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>Pergunta {indiceQuizAtual + 1} de {QUIZZES.length}</p>
        </div>
        <div className="w-6" />
      </div>

      <div className={`bg-gray-200 dark:bg-gray-700 h-1 ${temaEscuro ? '' : ''}`}>
        <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${((indiceQuizAtual + 1) / QUIZZES.length) * 100}%` }} />
      </div>

      <div className={`flex-1 overflow-y-auto p-6 flex flex-col justify-center ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="mb-8">
          <h2 className={`text-lg font-semibold mb-6 ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>{quizAtual.pergunta}</h2>

          <div className="space-y-3">
            {quizAtual.opcoes.map((opcao, idx) => {
              let estilos = `${temaEscuro ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-neutral-900'}`
              
              if (respondido) {
                if (idx === quizAtual.correto) {
                  estilos = `${temaEscuro ? 'bg-green-600 border-green-600 text-white' : 'bg-green-100 border-green-400 border-2 text-green-900'}`
                } else if (idx === respostaSelecionada && !estaCorreto) {
                  estilos = `${temaEscuro ? 'bg-red-600 border-red-600 text-white' : 'bg-red-100 border-red-400 border-2 text-red-900'}`
                }
              }

              return (
                <button key={idx} onClick={() => !respondido && aoClicarResposta(idx)} disabled={respondido} className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${estilos}`}>
                  <p className="text-sm font-medium">{String.fromCharCode(65 + idx)}) {opcao}</p>
                </button>
              )
            })}
          </div>
        </div>

        {respondido && (
          <div className={`border-l-4 rounded-xl p-4 mb-6 animate-slide-up ${estaCorreto ? (temaEscuro ? 'bg-green-900/30 border-green-700 text-green-200' : 'bg-green-50 border-green-400 text-green-900') : (temaEscuro ? 'bg-blue-900/30 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-400 text-blue-900')}`}>
            <p className="text-sm leading-relaxed">{estaCorreto ? '✅ Correto! ' : '💡 Por quê: '} {quizAtual.explicacao}</p>
          </div>
        )}
      </div>

      {respondido && (
        <div className={`border-t p-4 ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'}`}>
          <button onClick={aoClicarProximo} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors">
            {indiceQuizAtual < QUIZZES.length - 1 ? 'Próxima Pergunta' : 'Ver Resultados'}
          </button>
        </div>
      )}
    </div>
  )
}
