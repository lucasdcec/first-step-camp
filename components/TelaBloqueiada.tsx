'use client'

import { useState } from 'react'
import { MotivoBloqueio } from '@/contexts/PerfilContext'

interface TelaBloqueidaProps {
  motivo: MotivoBloqueio
  aoDesbloquear: () => void
}

const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

export default function TelaBloqueiada({ motivo, aoDesbloquear }: TelaBloqueidaProps) {
  const [pin, setPin] = useState('')
  const [liberando, setLiberando] = useState(false)

  const apertar = (t: string) => {
    if (liberando) return
    if (t === '⌫') { setPin(p => p.slice(0, -1)); return }
    if (t === '' || pin.length >= 4) return

    const novo = pin + t
    setPin(novo)
    if (novo.length === 4) {
      setLiberando(true)
      setTimeout(() => {
        aoDesbloquear()
        setPin('')
        setLiberando(false)
      }, 400)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between h-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-6 py-8 animate-fade-in-up">

      {/* Ícone + mensagem */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          <div className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
            liberando
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/40'
              : 'bg-gradient-to-br from-red-600 to-rose-700 shadow-red-500/40'
          }`}>
            <span className="text-5xl">{liberando ? '🔓' : '🔒'}</span>
          </div>
        </div>

        <div>
          <h1 className="text-white font-bold text-xl">
            {liberando ? 'Desbloqueando...' : 'Acesso Bloqueado'}
          </h1>
          <p className="text-gray-400 text-sm mt-1.5 max-w-[230px] leading-relaxed">
            {motivo === 'pausado'
              ? 'O responsável pausou o acesso ao dispositivo.'
              : 'O limite de tempo de tela para hoje foi atingido.'}
          </p>
        </div>

        <div className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
          motivo === 'pausado'
            ? 'bg-orange-900/40 text-orange-300 border border-orange-800/40'
            : 'bg-blue-900/40 text-blue-300 border border-blue-800/40'
        }`}>
          {motivo === 'pausado' ? '⏸ Pausado pelo responsável' : '⏱ Limite diário atingido'}
        </div>
      </div>

      {/* PIN dots + teclado */}
      <div className="w-full space-y-5">

        <p className="text-center text-gray-500 text-xs">
          Digite o PIN do responsável para desbloquear
        </p>

        {/* Dots */}
        <div className="flex justify-center gap-5">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                i < pin.length
                  ? 'bg-violet-400 border-violet-400 scale-110'
                  : 'bg-transparent border-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Teclado numérico */}
        <div className="grid grid-cols-3 gap-2.5">
          {TECLAS.map((t, i) => (
            <button
              key={i}
              onClick={() => apertar(t)}
              disabled={t === '' || liberando}
              className={`h-14 rounded-2xl text-xl font-semibold transition-all duration-150 active:scale-95 ${
                t === ''
                  ? 'invisible'
                  : t === '⌫'
                  ? 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
                  : 'bg-gray-700/60 text-white hover:bg-gray-600/60 active:bg-violet-700/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <p className="text-center text-gray-700 text-[10px]">
          💡 Dica para demo: qualquer PIN de 4 dígitos
        </p>
      </div>
    </div>
  )
}
