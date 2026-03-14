'use client'

import { useState, useRef, useEffect } from 'react'
import { useTema } from '@/contexts/ThemeContext'
import { usePerfil } from '@/contexts/PerfilContext'
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
  const { faixaEtaria } = usePerfil()
  const [escutando, setEscutando] = useState(false)
  const [falando, setFalando] = useState(false)
  const [transcricao, setTranscricao] = useState('')
  const [resposta, setResposta] = useState('')
  const [carregando, setCarregando] = useState(false)
  const reconhecimentoRef = useRef<SpeechRecognitionInstance | null>(null)

  // Cores dinâmicas por faixa etária
  const configIdade = {
    '7-9': {
      bgNebulosa: temaEscuro ? 'bg-pink-900/20' : 'bg-pink-100/50',
      orb: 'from-pink-400 via-orange-400 to-yellow-400',
      glow: 'shadow-[0_0_80px_rgba(248,113,113,0.4)]',
      label: '🐥 Pequeno Explorador'
    },
    '10-12': {
      bgNebulosa: temaEscuro ? 'bg-indigo-900/20' : 'bg-blue-100/50',
      orb: 'from-pink-500 via-purple-600 to-indigo-700',
      glow: 'shadow-[0_0_80px_rgba(168,85,247,0.4)]',
      label: '🦁 Jovem Explorador'
    },
    'nenhuma': {
      bgNebulosa: temaEscuro ? 'bg-purple-900/10' : 'bg-violet-100/40',
      orb: 'from-pink-500 via-purple-600 to-indigo-700',
      glow: 'shadow-[0_0_80px_rgba(168,85,247,0.4)]',
      label: 'Explorador'
    }
  }[faixaEtaria]
  
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
        body: JSON.stringify({ pergunta, faixaEtaria })
      })
      const data = await res.json()
      const textoIA = data.resposta || 'Não entendi, pode repetir?'
      
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
    
    // Divide o texto em frases para sincronizar o balão
    const frases = texto.split(/(?<=[.?!])\s+/)
    setFalando(true)
    setTranscricao('') // Limpa a voz do usuário para dar lugar à resposta do Primo

    let index = 0
    const falarProximaFrase = () => {
      if (index >= frases.length) {
        setFalando(false)
        return
      }

      // Atualiza o que aparece no balão para a frase ATUAL
      setResposta(frases[index])

      const utter = new SpeechSynthesisUtterance(frases[index])
      utter.lang = 'pt-BR'
      utter.rate = (faixaEtaria === '7-9' ? 0.85 : 0.95)
      utter.pitch = 1.1

      utter.onend = () => {
        index++
        // Pequena pausa natural no balão antes da próxima frase
        setTimeout(falarProximaFrase, 400)
      }

      utter.onerror = () => setFalando(false)
      window.speechSynthesis.speak(utter)
    }

    falarProximaFrase()
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
      
      {/* Background Decorativo Adaptável */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-all duration-1000 ${configIdade.bgNebulosa}`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-all duration-1000 ${temaEscuro ? 'bg-indigo-600/10' : 'bg-indigo-200/30'}`} />

      {/* Elementos Lúdicos para 7-9 anos (Bolhas Mágicas) */}
      {faixaEtaria === '7-9' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[10%] text-4xl animate-bounce opacity-40">🎈</div>
          <div className="absolute top-[60%] right-[15%] text-4xl animate-float-slow opacity-30">⭐</div>
          <div className="absolute bottom-[20%] left-[20%] text-3xl animate-pulse opacity-20">🌈</div>
          <div className="absolute top-[30%] right-[5%] text-2xl animate-bounce opacity-30" style={{ animationDelay: '1s' }}>🍭</div>
        </div>
      )}

      {/* Elementos para 10-12 anos (Tecnologia e Espaço) */}
      {faixaEtaria === '10-12' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] right-[10%] text-3xl opacity-20 animate-pulse">🚀</div>
          <div className="absolute bottom-[30%] left-[8%] text-3xl opacity-20 animate-float-slow">🪐</div>
          <div className="absolute top-[50%] right-[5%] text-2xl opacity-15 animate-spin-slow">⚛️</div>
          {/* Partículas de "Tech" */}
          <div className="absolute top-[20%] left-[20%] w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-30" />
          <div className="absolute bottom-[40%] right-[25%] w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '1.5s' }} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-6 z-10">
        <button onClick={aoVoltar} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${temaEscuro ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-slate-700'}`}>
          <span className="text-xl">‹</span>
        </button>
        <div className="text-center">
          <h2 className={`font-bold text-sm tracking-tight ${temaEscuro ? 'text-white' : 'text-slate-800'}`}>{configIdade.label}</h2>
          <p className={`text-[10px] ${temaEscuro ? 'text-gray-400' : 'text-slate-500'}`}>Falando com o Primo</p>
        </div>
        <div className="w-10" />
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
              bg-gradient-to-br ${configIdade.orb}
              ${configIdade.glow}
              transition-all duration-100 ease-out
              flex items-center justify-center
              overflow-hidden
              relative
            `}
          >
            {/* Efeito de malha/glow interno */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]" />
            
            {/* Avatar do Primo no centro da esfera */}
            <div className={`transition-all duration-500 ${falando ? 'scale-105 sm:scale-110' : 'scale-90 sm:scale-100'}`}>
              <AvatarIA 
                tamanho="grande" 
                expressao={falando ? 'feliz' : escutando ? 'pensando' : 'feliz'} 
                estaFalando={falando}
              />
            </div>

            {/* Partículas flutuantes internas */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-pink-200 rounded-full animate-bounce delay-75" />
            </div>
          </div>

          {/* BALÃO DE FALA (Speech Bubble) */}
          {(resposta || transcricao || carregando) && (
            <div className={`
              absolute z-20 transition-all duration-500 animate-fade-in
              bottom-[115%] sm:bottom-auto sm:left-[110%] sm:top-0
              w-[220px] sm:w-[280px]
            `}>
              <div className={`
                relative p-4 rounded-3xl shadow-2xl border-2
                ${temaEscuro ? 'bg-gray-800 border-indigo-500/30 text-white' : 'bg-white border-violet-100 text-slate-800'}
              `}>
                {carregando ? (
                  <div className="flex gap-1 py-1">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base font-medium leading-relaxed">
                    {transcricao || resposta}
                  </p>
                )}
                
                {/* Triângulo do Balão (Mobile: Embaixo | Desktop: Lado) */}
                <div className={`
                  absolute w-4 h-4 rotate-45 border-2 border-t-0 border-l-0
                  ${temaEscuro ? 'bg-gray-800 border-indigo-500/30' : 'bg-white border-violet-100'}
                  bottom-[-9px] left-1/2 -translate-x-1/2 
                  sm:bottom-auto sm:left-[-9px] sm:top-1/2 sm:-translate-y-1/2
                `} />
              </div>
            </div>
          )}
        </div>


      <div className="h-4" /> {/* Spacer */}
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
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
