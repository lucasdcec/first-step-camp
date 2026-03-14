'use client'

import { useState, useRef, useEffect } from 'react'
import { useHistoricoChat } from '@/hooks/useHistoricoChat'
import { useTema } from '@/contexts/ThemeContext'
import { usePerfil } from '@/contexts/PerfilContext'
import AvatarIA from './AvatarIA'
import { enviarPerguntaIA } from '@/services/aiService'

interface InterfaceChatProps {
  aoExplorar?: () => void
  aoVoltar?: () => void
}





interface Mensagem {
  tipo: 'usuario' | 'ia'
  texto: string
  curiosidade?: string
  sugestao?: string
}

// Tipagem mínima para Web Speech API
type SpeechRecognitionInstance = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  onresult: ((e: any) => void) | null
  onerror: ((e: any) => void) | null
  onend: (() => void) | null
}

declare const webkitSpeechRecognition: new () => SpeechRecognitionInstance

function falar(texto: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(texto)
  utter.lang = 'pt-BR'
  utter.rate = 0.95
  utter.pitch = 1.1
  window.speechSynthesis.speak(utter)
}

const suporta_stt = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

export default function InterfaceChat({ aoVoltar }: InterfaceChatProps) {
  const { historico, adicionarMensagem } = useHistoricoChat()
  const { temaEscuro } = useTema()
  const { faixaEtaria } = usePerfil()
  const [mensagens, setMensagens] = useState<Mensagem[]>(
    historico.length > 0
      ? historico.map(m => ({ tipo: m.tipo, texto: m.texto })) as Mensagem[]
      : [{ tipo: 'ia', texto: 'Olá, explorador! 🚀 Sou o Primo, seu assistente de aprendizado. Faça uma pergunta sobre ciência, natureza ou curiosidades!' }]
  )
  const [inputValue, setInputValue] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [vozAtiva, setVozAtiva] = useState(false)
  const [escutando, setEscutando] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const reconhecimentoRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, carregando])

  const aoEnviarMensagem = async (pergunta: string) => {
    if (!pergunta.trim() || carregando) return

    const msgUser: Mensagem = { tipo: 'usuario', texto: pergunta }
    setMensagens(prev => [...prev, msgUser])
    adicionarMensagem({ tipo: 'usuario', texto: pergunta })
    setInputValue('')
    setCarregando(true)

    try {
      const respostaIA = await enviarPerguntaIA(pergunta, faixaEtaria);
      
      const msgIA: Mensagem = { 
        tipo: 'ia', 
        texto: respostaIA.resposta || 'Ops, tive um errinho!', 
        curiosidade: respostaIA.curiosidade, 
        sugestao: respostaIA.sugestao 
      };
      setMensagens(prev => [...prev, msgIA])
      adicionarMensagem({ tipo: 'ia', texto: msgIA.texto })
      if (vozAtiva) falar(msgIA.texto)
    } catch(err) {
      console.error(err)
      const msgErro: Mensagem = { tipo: 'ia', texto: 'Desculpe, tive um problema de rede!' }
      setMensagens(prev => [...prev, msgErro])
    } finally {
      setCarregando(false)
    }
  }

  const toggleMicrofone = () => {
    if (!suporta_stt) return

    if (escutando) {
      reconhecimentoRef.current?.stop()
      setEscutando(false)
      return
    }

    const SR = (window as any).SpeechRecognition ?? webkitSpeechRecognition
    const rec: SpeechRecognitionInstance = new SR()
    rec.lang = 'pt-BR'
    rec.interimResults = false
    rec.maxAlternatives = 1

    rec.onresult = (e: any) => {
      const transcricao = e.results[0][0].transcript
      setInputValue(transcricao)
      setEscutando(false)
    }
    rec.onerror = () => setEscutando(false)
    rec.onend = () => setEscutando(false)

    reconhecimentoRef.current = rec
    rec.start()
    setEscutando(true)
  }

  // Estilos
  const bg       = temaEscuro ? 'bg-gray-800' : 'bg-white'
  const headerBg = temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'
  const footerBg = temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'
  const inputCls = temaEscuro ? 'bg-gray-700 text-white placeholder-gray-500' : 'bg-gray-100 text-neutral-900 placeholder-gray-400'
  const texto    = temaEscuro ? 'text-white' : 'text-neutral-900'

  return (
    <div className={`flex flex-col h-full ${bg}`}>
      {/* Cabeçalho */}
      <div className={`flex items-center gap-2 p-4 border-b ${headerBg}`}>
        {aoVoltar && (
          <button onClick={aoVoltar} className={`mr-1 text-lg ${temaEscuro ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-neutral-900'} transition-colors`}>‹</button>
        )}
        <AvatarIA tamanho="pequeno" expressao="feliz" />
        <div className="flex-1">
          <h2 className={`font-bold text-sm ${texto}`}>Primo — IA Educacional</h2>
          <p className={`text-xs ${temaEscuro ? 'text-green-400' : 'text-green-500'}`}>● Online · Modo explorador</p>
        </div>
        {/* Toggle voz */}
        <button
          onClick={() => setVozAtiva(v => !v)}
          title={vozAtiva ? 'Desligar voz' : 'Ligar voz'}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-all
            ${vozAtiva ? 'bg-violet-500 text-white' : temaEscuro ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400'}`}
        >
          {vozAtiva ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Decorações Lúdicas para 7-9 anos */}
      {faixaEtaria === '7-9' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-[15%] right-[10%] text-2xl animate-bounce">🎈</div>
          <div className="absolute bottom-[25%] left-[5%] text-2xl animate-spin-slow">⭐</div>
          <div className="absolute top-[40%] left-[2%] text-xl opacity-50">☁️</div>
        </div>
      )}

      {/* Decorações Tech/Space para 10-12 anos */}
      {faixaEtaria === '10-12' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-[10%] left-[5%] text-2xl animate-pulse">🛸</div>
          <div className="absolute bottom-[20%] right-[10%] text-2xl animate-float-slow">🪐</div>
          <div className="absolute top-[30%] right-[2%] text-xl">🔭</div>
          <div className="absolute bottom-[40%] left-[8%] text-xl opacity-40">⚛️</div>
        </div>
      )}

      {/* Mensagens */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${bg}`}>
        {mensagens.map((msg, idx) => (
          <div key={idx} className={`animate-slide-up ${msg.tipo === 'usuario' ? 'flex justify-end' : 'flex justify-start'}`}>
            {msg.tipo === 'ia' ? (
              <div className="max-w-xs space-y-2">
                <div className={`
                    px-4 py-3 shadow-sm
                    ${faixaEtaria === '7-9' ? 'rounded-[2rem] rounded-tl-none border-2 border-violet-100 shadow-violet-200/50' : 'rounded-2xl rounded-tl-sm'}
                    ${temaEscuro ? 'bg-gray-700 text-white' : 'bg-gray-100 text-neutral-900'}
                  `}>
                  <p className="text-sm leading-relaxed">{msg.texto}</p>
                </div>
                {msg.curiosidade && (
                  <div className={`rounded-2xl rounded-tl-sm px-4 py-2.5 border-l-4 ${temaEscuro ? 'bg-violet-900/30 border-violet-600 text-violet-200' : 'bg-violet-50 border-violet-400 text-violet-900'}`}>
                    <p className="text-xs">{msg.curiosidade}</p>
                  </div>
                )}
                {msg.sugestao && (
                  <button
                    onClick={() => aoEnviarMensagem(msg.sugestao!)}
                    className={`text-left w-full rounded-2xl rounded-tl-sm px-4 py-2.5 border text-xs font-medium transition-colors
                      ${temaEscuro ? 'bg-gray-700 hover:bg-gray-600 text-blue-300 border-gray-600' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'}`}
                  >
                    → {msg.sugestao}
                  </button>
                )}
              </div>
            ) : (
              <div className={`
                  text-white px-4 py-3 max-w-xs shadow-md 
                  ${faixaEtaria === '7-9' 
                    ? 'bg-gradient-to-br from-pink-400 via-orange-400 to-yellow-400 rounded-[2.5rem] rounded-tr-none shadow-orange-500/30' 
                    : 'bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl rounded-tr-sm shadow-violet-500/20'}
                `}>
                <p className="text-sm font-bold">{msg.texto}</p>
              </div>
            )}
          </div>
        ))}

        {carregando && (
          <div className="flex justify-start">
            <div className={`rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 ${temaEscuro ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`border-t p-3 space-y-2 ${footerBg}`}>
        {mensagens.length <= 1 && (
          <div className="space-y-1">
            <p className={`text-xs font-semibold ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>Tente perguntar:</p>
            {['Por que o céu é azul?', 'Como viviam os dinossauros?', 'O que existe no espaço?'].map(p => (
              <button key={p} onClick={() => aoEnviarMensagem(p)} className={`block w-full text-left text-xs px-2 py-1 rounded-lg transition-colors ${temaEscuro ? 'text-violet-400 hover:bg-gray-700' : 'text-violet-600 hover:bg-violet-50'}`}>
                • {p}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {/* Microfone (se suportado) */}
          {suporta_stt && (
            <button
              onClick={toggleMicrofone}
              title={escutando ? 'Parar de escutar' : 'Falar com a IA'}
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
                ${escutando
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40'
                  : temaEscuro ? 'bg-gray-700 text-gray-300 hover:bg-violet-700 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-violet-100 hover:text-violet-700'}`}
            >
              {escutando ? '⏹' : '🎙️'}
            </button>
          )}

          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && aoEnviarMensagem(inputValue)}
            placeholder={escutando ? 'Ouvindo...' : 'Faça uma pergunta...'}
            disabled={escutando}
            className={`flex-1 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${inputCls}`}
          />
          <button
            onClick={() => aoEnviarMensagem(inputValue)}
            disabled={!inputValue.trim() || carregando}
            className="bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-40 text-white rounded-2xl px-4 py-2.5 transition-all duration-200 font-semibold text-sm shadow-md shadow-violet-500/30"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
