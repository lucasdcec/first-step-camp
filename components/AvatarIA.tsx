'use client'

interface AvatarIAProps {
  tamanho?: 'pequeno' | 'medio' | 'grande'
  expressao?: 'neutro' | 'feliz' | 'pensando' | 'animado'
  animado?: boolean
}

export default function AvatarIA({
  tamanho = 'medio',
  expressao = 'neutro',
  animado = true,
}: AvatarIAProps) {
  const tamanhoClasses = {
    pequeno: 'w-12 h-12',
    medio: 'w-20 h-20',
    grande: 'w-32 h-32',
  }

  const tamanhoOlho = tamanho === 'pequeno' ? 'w-1.5 h-2' : tamanho === 'medio' ? 'w-2.5 h-3' : 'w-4 h-5'
  const posicaoOlho = tamanho === 'pequeno' ? 'gap-2' : tamanho === 'medio' ? 'gap-3' : 'gap-6'
  const alturaBoca = tamanho === 'pequeno' ? 'h-0.5' : tamanho === 'medio' ? 'h-1' : 'h-2'

  return (
    <div className={`${tamanhoClasses[tamanho]} flex items-center justify-center relative`}>
      {/* Container do avatar com gradiente */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200 to-blue-100 blur-xl" />

      {/* Círculo principal do avatar */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-300 to-blue-200 flex flex-col items-center justify-center border-2 border-blue-400">
        
        {/* Container dos olhos */}
        <div className={`flex ${posicaoOlho} mb-2`}>
          {/* Olho esquerdo */}
          <div
            className={`${tamanhoOlho} rounded-full bg-gray-800 ${animado ? 'animate-blink' : ''}`}
            style={animado ? { animationDelay: '0s' } : {}}
          />
          
          {/* Olho direito */}
          <div
            className={`${tamanhoOlho} rounded-full bg-gray-800 ${animado ? 'animate-blink' : ''}`}
            style={animado ? { animationDelay: '0.1s' } : {}}
          />
        </div>

        {/* Boca - muda de acordo com a expressão */}
        <div className={`${alturaBoca} w-6 rounded-full`}>
          {expressao === 'feliz' && (
            <div className={`w-full h-full rounded-full border-2 border-t-0 border-gray-800`} />
          )}
          {expressao === 'animado' && (
            <div className="w-full h-full bg-gray-800 rounded-full" />
          )}
          {expressao === 'pensando' && (
            <div className={`w-1.5 h-1.5 bg-gray-800 rounded-full mx-auto`} />
          )}
          {expressao === 'neutro' && (
            <div className="w-full h-0.5 bg-gray-800 rounded-full" />
          )}
        </div>
      </div>

      {/* Brilho sutil quando animado */}
      {animado && (
        <div className="absolute inset-0 rounded-full animate-pulse bg-blue-200/30" />
      )}
    </div>
  )
}
