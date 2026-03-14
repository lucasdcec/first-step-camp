'use client'

import { useState, useRef, useEffect } from 'react'
import { useTema } from '@/contexts/ThemeContext'
import { usePerfil } from '@/contexts/PerfilContext'
import AvatarIA from './AvatarIA'
import { enviarPerguntaIA } from '@/services/aiService'

interface VozInterfaceProps {
  aoVoltar: () => void
}

// Tipagem para Web Speech API
type SpeechRecognitionInstance = {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: any) => void) | null
  onerror: ((e: any) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
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
  const transcricaoRef = useRef('') // Ref para capturar o texto mais recente de forma síncrona

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
  
  const [esferaEscala, setEsferaEscala] = useState(1)

  // Função pra gerar sons sintéticos
  const tocarSom = (tipo: 'ligar' | 'desligar') => {
    if (typeof window === 'undefined') return
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    if (tipo === 'ligar') {
      // Som de "subida" (Blip alegre)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    } else {
      // Som de "descida" (Pop suave)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(660, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    }

    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  }

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
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Seu navegador não suporta reconhecimento de voz.')
      return
    }

    if (escutando) {
      if (reconhecimentoRef.current) {
        reconhecimentoRef.current.stop()
      }
      return
    }

    // Cancela qualquer fala da IA antes de começar a ouvir
    window.speechSynthesis.cancel()
    setFalando(false)
    setResposta('')
    setTranscricao('...') // Feedback visual imediato
    transcricaoRef.current = ''

    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const rec = new SR()
    
    rec.lang = 'pt-BR'
    rec.interimResults = true
    rec.maxAlternatives = 1
    rec.continuous = false

    rec.onstart = () => {
      setEscutando(true)
      setTranscricao('Ouvindo...')
      tocarSom('ligar')
    }

    rec.onresult = (e: any) => {
      let transcricaoAtual = ''
      for (let i = 0; i < e.results.length; i++) {
        transcricaoAtual += e.results[i][0].transcript
      }
      
      setTranscricao(transcricaoAtual)
      transcricaoRef.current = transcricaoAtual
      
      // Se for o resultado final (pausa longa detectada pelo browser), para e processa
      if (e.results[e.results.length - 1].isFinal) {
        rec.stop()
      }
    }

    rec.onend = () => {
      setEscutando(false)
      tocarSom('desligar')
      
      // Processa o que foi capturado
      const textoFinal = transcricaoRef.current.trim()
      if (textoFinal && textoFinal !== 'Ouvindo...') {
        enviarParaIA(textoFinal)
      } else {
        setTranscricao('') // Limpa se não capturou nada
      }
    }

    rec.onerror = (e: any) => {
      console.error('Erro no microfone:', e.error)
      if (e.error === 'not-allowed') {
        alert('Por favor, permita o acesso ao microfone.')
      }
      setEscutando(false)
      setTranscricao('')
      tocarSom('desligar')
    }

    try {
      reconhecimentoRef.current = rec
      rec.start()
    } catch (err) {
      console.error('Erro ao iniciar reconhecimento:', err)
      setEscutando(false)
    }
  }

  const enviarParaIA = async (pergunta: string) => {
    setCarregando(true)
    setResposta('') // Limpa resposta anterior
    try {
      const data = await enviarPerguntaIA(pergunta, faixaEtaria);
      
      if (data.resposta) {
        falarIA(data.resposta)
      } else {
        throw new Error('Resposta vazia da IA')
      }
    } catch (err) {
      console.error(err)
      const msgErro = 'Tive um probleminha de rede, amiguinho. Pode tentar de novo?'
      setResposta(msgErro)
      falarIA(msgErro)
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
    // Não limpamos a transcrição aqui imediatamente para o balão não sumir
    // setTranscricao('') 

    let index = 0
    const falarProximaFrase = () => {
      if (index >= frases.length) {
        setFalando(false)
        return
      }

      // Quando começar a primeira frase, aí sim limpamos a transcrição do usuário
      if (index === 0) setTranscricao('')
      
      setResposta(frases[index])

      const utter = new SpeechSynthesisUtterance(frases[index])
      utter.lang = 'pt-BR'
      
      // Tenta encontrar uma voz em português mais amigável
      const vozes = window.speechSynthesis.getVoices()
      const vozPT = vozes.find(v => v.lang.includes('pt-BR') && v.name.includes('Google')) || 
                    vozes.find(v => v.lang.includes('pt-BR'))
      if (vozPT) utter.voice = vozPT

      utter.rate = (faixaEtaria === '7-9' ? 0.9 : 1.0)
      utter.pitch = 1.1

      utter.onstart = () => {
        setFalando(true)
      }

      utter.onend = () => {
        index++
        setTimeout(falarProximaFrase, 300)
      }

      utter.onerror = (e) => {
        console.error('Erro na síntese de voz:', e)
        setFalando(false)
      }
      
      window.speechSynthesis.speak(utter)
    }

    // Algumas vezes as vozes demoram a carregar
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => falarProximaFrase(), { once: true })
    } else {
      falarProximaFrase()
    }
  }

  const resetar = () => {
    window.speechSynthesis.cancel()
    if (reconhecimentoRef.current) {
      reconhecimentoRef.current.abort()
    }
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


    </div>
  )
}
