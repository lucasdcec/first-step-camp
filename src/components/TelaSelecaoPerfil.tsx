'use client'

import { useState } from 'react'
import { usePerfil } from '@/contexts/PerfilContext'

const ESTRELAS = [
  { top: '8%',  left: '12%', size: 3, dur: '2.1s', delay: '0s'    },
  { top: '14%', left: '78%', size: 2, dur: '1.8s', delay: '0.3s'  },
  { top: '22%', left: '45%', size: 2, dur: '2.4s', delay: '0.7s'  },
  { top: '30%', left: '88%', size: 3, dur: '1.6s', delay: '0.4s'  },
  { top: '38%', left: '6%',  size: 2, dur: '2.2s', delay: '1.1s'  },
  { top: '50%', left: '92%', size: 2, dur: '1.9s', delay: '0.2s'  },
  { top: '58%', left: '28%', size: 3, dur: '2.6s', delay: '0.9s'  },
  { top: '65%', left: '65%', size: 2, dur: '1.7s', delay: '0.5s'  },
  { top: '72%', left: '18%', size: 2, dur: '2.3s', delay: '1.3s'  },
  { top: '80%', left: '82%', size: 3, dur: '2.0s', delay: '0.6s'  },
  { top: '88%', left: '50%', size: 2, dur: '1.5s', delay: '0.8s'  },
  { top: '5%',  left: '55%', size: 2, dur: '2.5s', delay: '1.0s'  },
  { top: '42%', left: '40%', size: 3, dur: '1.8s', delay: '1.4s'  },
  { top: '75%', left: '38%', size: 2, dur: '2.1s', delay: '0.1s'  },
  { top: '18%', left: '22%', size: 2, dur: '2.3s', delay: '1.2s'  },
]

export default function TelaSelecaoPerfil() {
  const { definirPerfil } = usePerfil()
  const [passo, setPasso] = useState<'perfil' | 'idade' | 'pin'>('perfil')
  const [pin, setPin] = useState('')

  const escolherIdade = (faixa: '7-9' | '10-12') => {
    definirPerfil('explorador', faixa)
  }

  const digitarPIN = (digito: string) => {
    if (pin.length >= 4) return
    const novoPIN = pin + digito
    setPin(novoPIN)
    if (novoPIN.length === 4) {
      setTimeout(() => {
        definirPerfil('pais')
      }, 200)
    }
  }

  const apagarPIN = () => {
    setPin(prev => prev.slice(0, -1))
  }

  const tecladoNumerico = [
    ['1','2','3'],
    ['4','5','6'],
    ['7','8','9'],
    ['⌫','0','✓'],
  ]

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 relative overflow-hidden">

      {/* Círculos decorativos de fundo */}
      <div className="absolute top-[-60px] left-[-60px] w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-40px] right-[-40px] w-56 h-56 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Estrelas animadas */}
      {ESTRELAS.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle pointer-events-none"
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            ['--twinkle-duration' as string]: s.dur,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* Logo */}
      <div className="flex flex-col items-center pt-10 pb-6 relative z-10">
        <div
          className="text-7xl mb-3"
          style={{ filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.85))' }}
        >
          🎓
        </div>
        <h1 className="text-white font-bold text-xl tracking-wide">Primeiro Passo</h1>
        <p className="text-purple-300 text-xs mt-1">Assistente de Aprendizado IA</p>
      </div>

      {passo === 'perfil' && (
        /* Seleção de perfil */
        <div className="flex-1 flex flex-col justify-center px-6 gap-4 relative z-10">
          <p className="text-center text-purple-200 text-sm font-medium mb-2">Quem vai usar agora?</p>

          {/* Card Explorador */}
          <button
            onClick={() => setPasso('idade')}
            className="animate-fade-in-up group relative overflow-hidden rounded-3xl p-5 border border-purple-400/30 bg-gradient-to-br from-violet-500/30 to-purple-600/20 backdrop-blur-sm hover:from-violet-500/50 hover:to-purple-600/40 transition-all duration-300 active:scale-95 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-violet-500/30">
                🚀
              </div>
              <div>
                <p className="text-white font-bold text-base">Explorar</p>
                <p className="text-purple-300 text-xs mt-0.5">Aprender, jogar e descobrir</p>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 text-xl group-hover:translate-x-1 transition-transform">›</div>
          </button>

          {/* Card Pais */}
          <button
            onClick={() => setPasso('pin')}
            className="animate-fade-in-up group relative overflow-hidden rounded-3xl p-5 border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-cyan-600/10 backdrop-blur-sm hover:from-blue-500/40 hover:to-cyan-600/30 transition-all duration-300 active:scale-95 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30">
                🔐
              </div>
              <div>
                <p className="text-white font-bold text-base">Pais / Responsáveis</p>
                <p className="text-blue-300 text-xs mt-0.5">Acompanhar progresso e configurar</p>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl group-hover:translate-x-1 transition-transform">›</div>
          </button>
        </div>
      )}

      {passo === 'idade' && (
        <div className="flex-1 flex flex-col justify-center px-6 gap-6 relative z-10 animate-fade-in">
          <button onClick={() => setPasso('perfil')} className="text-purple-300 text-sm self-start mb-2">‹ Voltar</button>
          
          <div className="text-center space-y-1">
            <h2 className="text-white font-bold text-lg">Qual a sua idade?</h2>
            <p className="text-purple-300 text-xs">O Primo vai se ajustar para você! ✨</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => escolherIdade('7-9')}
              className="group relative overflow-hidden rounded-3xl p-6 border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 backdrop-blur-sm hover:from-emerald-500/40 hover:to-teal-600/30 transition-all duration-300 active:scale-95"
            >
              <div className="flex items-center gap-5">
                <div className="text-4xl">🐥</div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg">7 a 9 anos</p>
                  <p className="text-emerald-300 text-xs">Aprender brincando com o Primo</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => escolherIdade('10-12')}
              className="group relative overflow-hidden rounded-3xl p-6 border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-sm hover:from-blue-500/40 hover:to-indigo-600/30 transition-all duration-300 active:scale-95"
            >
              <div className="flex items-center gap-5">
                <div className="text-4xl">🦁</div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg">10 a 12 anos</p>
                  <p className="text-blue-300 text-xs">Desafios e descobertas avançadas</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {passo === 'pin' && (
        /* Teclado PIN */
        <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
          <button
            onClick={() => setPasso('perfil')}
            className="self-start text-purple-400 hover:text-white transition-colors text-sm mb-4 flex items-center gap-1"
          >
            ‹ Voltar
          </button>

          <div className="flex flex-col items-center gap-6">
            <div>
              <p className="text-white font-semibold text-center text-base mb-1">Área dos Responsáveis</p>
              <p className="text-purple-300 text-xs text-center">Digite o PIN de acesso</p>
            </div>

            {/* Pontos do PIN */}
            <div className="flex gap-4">
              {[0,1,2,3].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    i < pin.length
                      ? 'bg-white border-white scale-110'
                      : 'bg-transparent border-purple-400'
                  }`}
                />
              ))}
            </div>

            {/* Teclado numérico */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[220px]">
              {tecladoNumerico.flat().map((tecla, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (tecla === '⌫') apagarPIN()
                    else if (tecla === '✓') {}
                    else digitarPIN(tecla)
                  }}
                  className={`
                    h-14 rounded-2xl font-semibold text-lg transition-all duration-150 active:scale-90
                    ${tecla === '⌫' ? 'bg-white/5 text-red-400 hover:bg-red-500/20' :
                      tecla === '✓' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                      'bg-white/10 text-white hover:bg-white/20'}
                  `}
                >
                  {tecla}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
