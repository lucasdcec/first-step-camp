import { useState, useEffect } from 'react'

interface AvatarIAProps {
  tamanho?: 'pequeno' | 'medio' | 'grande'
  expressao?: 'neutro' | 'feliz' | 'pensando' | 'animado'
  animado?: boolean
  estaFalando?: boolean
}

export default function AvatarIA({
  tamanho = 'medio',
  expressao = 'neutro',
  animado = true,
  estaFalando = false,
}: AvatarIAProps) {
  const [posicaoOlhos, setPosicaoOlhos] = useState({ x: 0, y: 0 })
  const [piscando, setPiscando] = useState(false)

  // Movimento natural e espontâneo dos olhos
  useEffect(() => {
    if (!animado) return

    const moverOlhos = () => {
      // Pequenos desvios aleatórios para parecer natural
      const x = (Math.random() - 0.5) * 4
      const y = (Math.random() - 0.5) * 4
      setPosicaoOlhos({ x, y })

      // Agenda o próximo movimento entre 2 a 5 segundos
      setTimeout(moverOlhos, 2000 + Math.random() * 3000)
    }

    const piscarNatural = () => {
      setPiscando(true)
      setTimeout(() => setPiscando(false), 150)
      // Pisca a cada 3 a 7 segundos
      setTimeout(piscarNatural, 3000 + Math.random() * 4000)
    }

    moverOlhos()
    piscarNatural()
  }, [animado])

  const tamanhoClasses = {
    pequeno: 'w-12 h-12',
    medio: 'w-20 h-20',
    grande: 'w-32 h-32',
  }

  const tamanhoOlho = tamanho === 'pequeno' ? 'w-1.5 h-2' : tamanho === 'medio' ? 'w-2.5 h-3' : 'w-4 h-5'
  const posicaoOlhoGap = tamanho === 'pequeno' ? 'gap-2' : tamanho === 'medio' ? 'gap-3' : 'gap-6'
  const alturaBoca = tamanho === 'pequeno' ? 'h-0.5' : tamanho === 'medio' ? 'h-1' : 'h-2'

  return (
    <div className={`${tamanhoClasses[tamanho]} flex items-center justify-center relative`}>
      {/* Container do avatar com gradiente de profundidade */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100/50 to-transparent blur-md" />

      {/* Círculo principal do avatar (Rosto) */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white via-blue-200 to-blue-300 flex flex-col items-center justify-center border-2 border-white/50 shadow-inner">
        
        {/* Container dos olhos com movimento transform dinâmico */}
        <div 
          className={`flex ${posicaoOlhoGap} mb-2 transition-transform duration-700 ease-out`}
          style={{ transform: `translate(${posicaoOlhos.x}px, ${posicaoOlhos.y}px)` }}
        >
          {/* Olho esquerdo */}
          <div
            className={`
              ${tamanhoOlho} rounded-full bg-slate-800 transition-all duration-150
              ${piscando ? 'scale-y-[0.1]' : 'scale-y-100'}
            `}
          />
          
          {/* Olho direito */}
          <div
            className={`
              ${tamanhoOlho} rounded-full bg-slate-800 transition-all duration-150
              ${piscando ? 'scale-y-[0.1]' : 'scale-y-100'}
            `}
          />
        </div>

        {/* Boca Dinâmica */}
        <div className={`w-6 flex items-center justify-center relative ${alturaBoca}`}>
          {estaFalando ? (
            /* Boca falando (Animação de elipse abrindo e fechando) */
            <div className={`w-4 h-3 bg-slate-800 rounded-full animate-talk`} />
          ) : (
            /* Expressões estáticas */
            <>
              {expressao === 'feliz' && (
                <div className="w-full h-3 border-b-2 border-slate-800 rounded-full mt-[-6px]" />
              )}
              {expressao === 'animado' && (
                <div className="w-4 h-2 bg-slate-800 rounded-full" />
              )}
              {expressao === 'pensando' && (
                <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
              )}
              {expressao === 'neutro' && (
                <div className="w-4 h-0.5 bg-slate-800 rounded-full" />
              )}
            </>
          )}
        </div>
      </div>

      {/* Brilho da "Vida" */}
      <div className={`absolute inset-0 rounded-full border-2 border-white/30 ${animado ? 'animate-pulse' : ''}`} />


    </div>
  )
}
