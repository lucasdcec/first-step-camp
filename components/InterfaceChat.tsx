'use client'

import { useState } from 'react'
import { useHistoricoChat } from '@/hooks/useHistoricoChat'
import { useTema } from '@/contexts/ThemeContext'
import AvatarIA from './AvatarIA'

interface InterfaceChatProps {
  aoExplorar?: () => void
}

const RESPOSTAS_IA = [
  {
    pergunta: 'Por que o céu é azul?',
    resposta: 'O céu fica azul porque a luz solar se dispersa na atmosfera. A luz azul tem ondas curtas e se espalha mais facilmente, por isso vemos o céu azul!',
    curiosidade: 'Você sabia? Em Marte, o céu é na verdade marrom-dourado!',
    sugestao: 'Quer aprender sobre arco-íris?'
  },
  {
    pergunta: 'Como os dinossauros existiam?',
    resposta: 'Dinossauros viveram na Terra milhões de anos atrás, muito antes dos humanos. Eram répteis incríveis, alguns tão pequenos quanto galinhas e outros gigantescos!',
    curiosidade: 'Você sabia? Alguns dinossauros tinham penas como pássaros!',
    sugestao: 'Quer aprender sobre fósseis?'
  },
  {
    pergunta: 'O que é o espaço?',
    resposta: 'Espaço é tudo além da atmosfera da Terra. É vasto e contém estrelas, planetas, galáxias e muito que ainda estamos descobrindo. Nosso Sol é apenas uma estrela entre bilhões!',
    curiosidade: 'Você sabia? Um dia em Vênus é mais longo que seu ano!',
    sugestao: 'Quer explorar os planetas?'
  },
  {
    pergunta: 'Por que os oceanos existem?',
    resposta: 'Oceanos são enormes corpos de água salgada que cobrem a maior parte da Terra. Foram formados há bilhões de anos e são lar de milhões de criaturas incríveis!',
    curiosidade: 'Você sabia? O oceano é mais profundo que o Monte Everest é alto!',
    sugestao: 'Quer aprender sobre animais marinhos?'
  },
  {
    pergunta: 'O que são animais?',
    resposta: 'Animais são criaturas vivas que respiram, comem e se movem. Existem milhões de tipos diferentes, desde insetos minúsculos até baleias gigantes!',
    curiosidade: 'Você sabia? Uma borboleta sente o gosto com os pés!',
    sugestao: 'Quer descobrir animais selvagens?'
  }
]

interface Mensagem {
  tipo: 'usuario' | 'ia'
  texto: string
  curiosidade?: string
  sugestao?: string
}

export default function InterfaceChat({ aoExplorar }: InterfaceChatProps) {
  const { historico, adicionarMensagem } = useHistoricoChat()
  const { temaEscuro } = useTema()
  const [mensagens, setMensagens] = useState<Mensagem[]>(
    historico.length > 0 
      ? historico.map(m => ({ tipo: m.tipo, texto: m.texto })) as Mensagem[]
      : [{ tipo: 'ia', texto: 'Olá! Sou seu assistente de aprendizado. Faça-me qualquer pergunta e vou mostrar fatos incríveis!' }]
  )
  const [inputValue, setInputValue] = useState('')
  const [estáCarregando, setEstáCarregando] = useState(false)

  const obterRespostaFallback = () => {
    const r = RESPOSTAS_IA[Math.floor(Math.random() * RESPOSTAS_IA.length)]
    return { resposta: r.resposta, curiosidade: r.curiosidade, sugestao: r.sugestao }
  }

  const aoEnviarMensagem = async (pergunta: string) => {
    if (!pergunta.trim()) return

    const mensagemUsuario: Mensagem = { tipo: 'usuario', texto: pergunta }
    setMensagens(prev => [...prev, mensagemUsuario])
    adicionarMensagem({ tipo: 'usuario', texto: pergunta })
    setInputValue('')
    setEstáCarregando(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta: pergunta.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.erro || 'Erro ao obter resposta')
      }

      const mensagemIA: Mensagem = {
        tipo: 'ia',
        texto: data.resposta || data.texto || '',
        curiosidade: data.curiosidade || undefined,
        sugestao: data.sugestao || undefined,
      }
      setMensagens(prev => [...prev, mensagemIA])
      adicionarMensagem({ tipo: 'ia', texto: mensagemIA.texto })
    } catch {
      const fallback = obterRespostaFallback()
      const mensagemIA: Mensagem = {
        tipo: 'ia',
        texto: fallback.resposta,
        curiosidade: fallback.curiosidade,
        sugestao: fallback.sugestao,
      }
      setMensagens(prev => [...prev, mensagemIA])
      adicionarMensagem({ tipo: 'ia', texto: fallback.resposta })
    } finally {
      setEstáCarregando(false)
    }
  }

  return (
    <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Cabeçalho */}
      <div className={`flex items-center gap-2 p-4 border-b ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
        <AvatarIA tamanho="pequeno" expressao="feliz" />
        <div>
          <h2 className={`font-semibold text-sm ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Primeiro Passo</h2>
          <p className={`text-xs ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>Assistente de Aprendizado</p>
        </div>
      </div>

      {/* Área de mensagens */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
        {mensagens.map((msg, idx) => (
          <div key={idx} className={`animate-slide-up ${msg.tipo === 'usuario' ? 'flex justify-end' : 'flex justify-start'}`}>
            {msg.tipo === 'ia' ? (
              <div className="max-w-xs space-y-3">
                {/* Resposta principal */}
                <div className={`rounded-2xl rounded-tl-sm px-4 py-3 ${temaEscuro ? 'bg-gray-700 text-white' : 'bg-gray-100 text-neutral-900'}`}>
                  <p className="text-sm leading-relaxed">{msg.texto}</p>
                </div>

                {/* Curiosidade */}
                {msg.curiosidade && (
                  <div className={`rounded-2xl rounded-tl-sm px-4 py-3 border-l-4 ${temaEscuro ? 'bg-blue-900/30 border-blue-700 text-blue-200' : 'bg-blue-100 border-blue-400 text-blue-900'}`}>
                    <p className="text-xs font-semibold mb-1">✨ {msg.curiosidade.split('\n')[0]}</p>
                    <p className="text-sm">{msg.curiosidade.split('\n').slice(1).join('\n')}</p>
                  </div>
                )}

                {/* Sugestão */}
                {msg.sugestao && (
                  <button
                    onClick={() => aoEnviarMensagem(msg.sugestao!)}
                    className={`text-left w-full rounded-2xl rounded-tl-sm px-4 py-3 transition-colors duration-200 border text-sm font-medium ${temaEscuro ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' : 'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-neutral-900 border-blue-300'}`}
                  >
                    → {msg.sugestao}
                  </button>
                )}
              </div>
            ) : (
              <div className={`rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs ${temaEscuro ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
                <p className="text-sm">{msg.texto}</p>
              </div>
            )}
          </div>
        ))}

        {estáCarregando && (
          <div className="flex justify-start">
            <div className={`rounded-2xl rounded-tl-sm px-4 py-3 ${temaEscuro ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm flex items-center gap-1 ${temaEscuro ? 'text-gray-300' : 'text-neutral-900'}`}>
                Pensando<span className="animate-bounce">.</span><span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span><span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Área de input */}
      <div className={`border-t p-4 space-y-3 ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'}`}>
        {/* Sugestões de prompts */}
        {mensagens.length <= 1 && (
          <div className="space-y-2">
            <p className={`text-xs font-semibold ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>Tente perguntar:</p>
            <div className="space-y-1.5">
              {['Por que o céu é azul?', 'Por que vulcões entram em erupção?', 'Por que as baleias cantam?'].map((p) => (
                <button
                  key={p}
                  onClick={() => aoEnviarMensagem(p)}
                  className={`w-full text-left text-xs px-2 py-1.5 transition-colors ${temaEscuro ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  • {p}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && aoEnviarMensagem(inputValue)}
            placeholder="Faça uma pergunta..."
            className={`flex-1 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${temaEscuro ? 'bg-gray-700 text-white placeholder-gray-500' : 'bg-gray-100 text-neutral-900 placeholder-gray-500'}`}
          />
          <button
            onClick={() => aoEnviarMensagem(inputValue)}
            disabled={!inputValue.trim() || estáCarregando}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-2xl px-4 py-2.5 transition-colors duration-200 font-medium text-sm"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
