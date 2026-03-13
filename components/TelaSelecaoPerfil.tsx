'use client'

import { useState } from 'react'
import { usePerfil } from '@/contexts/PerfilContext'

const PIN_CORRETO = '1234'

export default function TelaSelecaoPerfil() {
  const { definirPerfil } = usePerfil()
  const [mostraPIN, setMostraPIN] = useState(false)
  const [pin, setPin] = useState('')
  const [erro, setErro] = useState(false)
  const [shake, setShake] = useState(false)

  const entrarComoExplorador = () => {
    definirPerfil('explorador')
  }

  const abrirPIN = () => {
    setMostraPIN(true)
    setPin('')
    setErro(false)
  }

  const digitarPIN = (digito: string) => {
    if (pin.length >= 4) return
    const novoPIN = pin + digito
    setPin(novoPIN)
    setErro(false)

    if (novoPIN.length === 4) {
      setTimeout(() => {
        if (novoPIN === PIN_CORRETO) {
          definirPerfil('pais')
        } else {
          setErro(true)
          setShake(true)
          setTimeout(() => {
            setShake(false)
            setPin('')
          }, 600)
        }
      }, 200)
    }
  }

  const apagarPIN = () => {
    setPin(prev => prev.slice(0, -1))
    setErro(false)
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

      {/* Logo */}
      <div className="flex flex-col items-center pt-10 pb-6 relative z-10">
        <div className="text-5xl mb-3">🎓</div>
        <h1 className="text-white font-bold text-xl tracking-wide">Primeiro Passo</h1>
        <p className="text-purple-300 text-xs mt-1">Assistente de Aprendizado IA</p>
      </div>

      {!mostraPIN ? (
        /* Seleção de perfil */
        <div className="flex-1 flex flex-col justify-center px-6 gap-4 relative z-10">
          <p className="text-center text-purple-200 text-sm font-medium mb-2">Quem vai usar agora?</p>

          {/* Card Explorador */}
          <button
            onClick={entrarComoExplorador}
            className="group relative overflow-hidden rounded-3xl p-5 border border-purple-400/30 bg-gradient-to-br from-violet-500/30 to-purple-600/20 backdrop-blur-sm hover:from-violet-500/50 hover:to-purple-600/40 transition-all duration-300 active:scale-95 text-left"
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
            onClick={abrirPIN}
            className="group relative overflow-hidden rounded-3xl p-5 border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-cyan-600/10 backdrop-blur-sm hover:from-blue-500/40 hover:to-cyan-600/30 transition-all duration-300 active:scale-95 text-left"
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

          <p className="text-center text-purple-400/60 text-xs mt-4">
            Versão MVP — Bootcamp Unifor 2026
          </p>
        </div>
      ) : (
        /* Teclado PIN */
        <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
          <button
            onClick={() => setMostraPIN(false)}
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
            <div className={`flex gap-4 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
              {[0,1,2,3].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    i < pin.length
                      ? erro ? 'bg-red-400 border-red-400' : 'bg-white border-white scale-110'
                      : 'bg-transparent border-purple-400'
                  }`}
                />
              ))}
            </div>

            {erro && (
              <p className="text-red-400 text-xs font-medium animate-pulse">PIN incorreto. Tente novamente.</p>
            )}

            {/* Teclado numérico */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[220px]">
              {tecladoNumerico.flat().map((tecla, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (tecla === '⌫') apagarPIN()
                    else if (tecla === '✓') {} // handled by auto-validate
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

            <p className="text-purple-400/50 text-xs">💡 Dica para demo: PIN é 1234</p>
          </div>
        </div>
      )}
    </div>
  )
}
