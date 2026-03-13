'use client'

import { useState, useRef, useEffect } from 'react'
import { useTema } from '@/contexts/ThemeContext'
import AvatarIA from './AvatarIA'

interface VozInterfaceProps {
  aoVoltar: () => void
}

// Tipagem para Web Speech API
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

export default function VozInterface({ aoVoltar }: VozInterfaceProps) {
  const { temaEscuro } = useTema()
  const [escutando, setEscutando] = useState(false)
  const [falando, setFalando] = useState(false)
  const [transcricao, setTranscricao] = useState('')
  const [resposta, setResposta] = useState('')
  const [carregando, setCarregando] = useState(false)
  const reconhecimentoRef = useRef<SpeechRecognitionInstance | null>(null)
  
  // Efeito da esfera
  const [esferaEscala, setEsferaEscala] = useState(1)

  useEffect(() => {
    if (falando) {
      const interval = setInterval(() => {
        setEsferaEscala(1 + Math.random() * 0.15)
      }, 100)
      return () => clearInterval(interval)
    } else {
      setEsferaEscala(1)
    }
  }, [falando])

  const iniciarEscuta = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Seu navegador não suporta reconhecimento de voz.')
      return
    }

    if (escutando) {
      reconhecimentoRef.current?.stop()
      return
    }

    const SR = webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'pt-BR'
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onresult = (e: any) => {
      const current = e.results[e.results.length - 1]
      const text = current[0].transcript
      setTranscricao(text)
      if (current.isFinal) {
        enviarParaIA(text)
      }
    }

    rec.onend = () => {
      setEscutando(false)
    }

    rec.onerror = (e: any) => {
      console.error('Erro no microfone:', e)
      setEscutando(false)
    }

    reconhecimentoRef.current = rec
    rec.start()
    setEscutando(true)
    setResposta('')
    setFalando(false)
    window.speechSynthesis.cancel()
  }

  const enviarParaIA = async (pergunta: string) => {
    setCarregando(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta })
      })
      const data = await res.json()
      const textoIA = data.resposta || 'Não entendi, pode repetir?'
      
      setResposta(textoIA)
      falarIA(textoIA)
    } catch (err) {
      console.error(err)
      setResposta('Tive um problema de rede, amiguinho.')
    } finally {
      setCarregando(false)
    }
  }

  const falarIA = (texto: string) => {
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(texto)
    utter.lang = 'pt-BR'
    utter.rate = 0.9
    utter.pitch = 1.1

    utter.onstart = () => setFalando(true)
    utter.onend = () => setFalando(false)
    utter.onerror = () => setFalando(false)

    window.speechSynthesis.speak(utter)
  }

  const resetar = () => {
    window.speechSynthesis.cancel()
    setFalando(false)
    setEscutando(false)
    setTranscricao('')
    setResposta('')
    setCarregando(false)
  }

  return (
    <div className={`flex flex-col h-full ${temaEscuro ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'} overflow-hidden relative transition-colors duration-500`}>
      
      {/* Background Decorativo - Nebulosa Suave */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-colors duration-1000 ${temaEscuro ? 'bg-purple-600/10' : 'bg-violet-200/40'}`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-colors duration-1000 ${temaEscuro ? 'bg-pink-600/10' : 'bg-pink-200/30'}`} />

      {/* Header */}
      <div className="flex items-center justify-between p-6 z-10">
        <button onClick={aoVoltar} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${temaEscuro ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-slate-700'}`}>
          <span className="text-xl">‹</span>
        </button>
        <div className="text-center">
          <h2 className={`font-bold text-sm tracking-tight ${temaEscuro ? 'text-white' : 'text-slate-800'}`}>Primo — IA Voz</h2>
          <p className={`text-[10px] ${temaEscuro ? 'text-gray-400' : 'text-slate-500'}`}>Modo Interativo</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Área Central: Esfera */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 mt-[-20px] sm:mt-[-40px]">
        
        {/* Esfera Animada (A Esfera Mágica do Primo) */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
          
          {/* Anéis Pulsantes (Apenas quando ouvindo ou falando) */}
          {(escutando || falando || carregando) && (
            <>
              <div className="absolute inset-0 rounded-full border border-pink-500/30 animate-ping opacity-20" />
              <div className="absolute inset-[-10px] sm:inset-[-20px] rounded-full border border-purple-500/20 animate-pulse opacity-10" />
            </>
          )}

          {/* O Corno central (Orb) */}
          <div 
            style={{ 
              transform: `scale(${esferaEscala})`,
            }}
            className={`
              w-36 h-36 sm:w-48 sm:h-48 rounded-full 
              bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700
              shadow-[0_0_40px_rgba(168,85,247,0.3)] sm:shadow-[0_0_80px_rgba(168,85,247,0.4)]
              transition-transform duration-100 ease-out
              flex items-center justify-center
              overflow-hidden
              relative
            `}
          >
            {/* Efeito de malha/glow interno */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]" />
            
            {/* Avatar do Primo no centro da esfera */}
            <div className={`transition-all duration-500 ${falando ? 'scale-105 sm:scale-110' : 'scale-90 sm:scale-100'}`}>
              <AvatarIA tamanho={window.innerWidth < 640 ? 'medio' : 'grande'} expressao={falando ? 'feliz' : escutando ? 'pensando' : 'feliz'} />
            </div>

            {/* Partículas flutuantes internas */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-pink-200 rounded-full animate-bounce delay-75" />
            </div>
          </div>
        </div>

        {/* Texto Dinâmico */}
        <div className="mt-8 sm:mt-12 text-center max-w-xs sm:max-w-sm px-4 min-h-[60px] sm:min-h-[80px]">
          {carregando ? (
            <div className="space-y-2">
              <p className="text-violet-500 text-xs sm:text-sm italic animate-pulse tracking-wide font-medium">Primo está pensando...</p>
              <div className="flex justify-center gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }} />
                ))}
              </div>
            </div>
          ) : (
            <p className={`text-lg sm:text-xl font-medium leading-relaxed tracking-tight animate-fade-in ${temaEscuro ? 'text-gray-100' : 'text-slate-800'}`}>
              {transcricao || resposta || 'Toque no microfone para conversar com o Primo!'}
            </p>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className={`p-6 sm:p-10 flex items-center justify-around z-10 border-t backdrop-blur-sm transition-colors ${temaEscuro ? 'border-white/5 bg-black/20' : 'border-black/5 bg-white/40'}`}>
        
        {/* Reiniciar */}
        <button 
          onClick={resetar}
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full active:scale-90 transition-all ${temaEscuro ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-black/5 text-slate-400 hover:text-slate-700'}`}
        >
          <span className="text-lg sm:text-xl rotate-[-45deg]">↺</span>
        </button>

        {/* Microfone Principal */}
        <button 
          onClick={iniciarEscuta}
          className={`
            relative group
            w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center
            transition-all duration-300 active:scale-95
            ${escutando 
              ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' 
              : 'bg-gradient-to-tr from-pink-500 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.2)]'}
          `}
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          
          <span className="text-2xl sm:text-3xl">
            {escutando ? '⏹' : '🎙️'}
          </span>

          {/* Efeito de pulso extra se estiver escutando */}
          {escutando && (
             <div className="absolute inset-[-6px] sm:inset-[-8px] rounded-full border-2 border-red-500 animate-ping opacity-30" />
          )}
        </button>

        {/* Fechar */}
        <button 
          onClick={aoVoltar}
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full active:scale-90 transition-all ${temaEscuro ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-black/5 text-slate-400 hover:text-slate-700'}`}
        >
          <span className="text-lg sm:text-xl">✕</span>
        </button>

      </div>

      {/* CSS extra para animações */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
