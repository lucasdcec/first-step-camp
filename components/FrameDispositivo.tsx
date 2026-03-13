'use client'

interface FrameDispositivoProps {
  children: React.ReactNode
  aoApertarBotao?: () => void
}

export default function FrameDispositivo({ children, aoApertarBotao }: FrameDispositivoProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-gray-950 dark:to-gray-900 p-4 transition-colors duration-300">
      <div className="relative w-full max-w-md">
        {/* Container do dispositivo com frame */}
        <div className="relative">
          {/* Efeito de brilho sutil */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl pointer-events-none" />
          
          {/* Tela principal do dispositivo: padding pra inferior evita que o botão de home cubra o conteúdo */}
          <div className="relative device-screen aspect-[9/16] flex flex-col overflow-hidden bg-white dark:bg-gray-800">
            <div className="flex flex-col h-full min-h-0 pb-20">
              {children}
            </div>
          </div>

          {/* Botão físico de home — resposta imediata, área de toque generosa */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              aoApertarBotao?.()
            }}
            onPointerDown={(e) => {
              e.currentTarget.classList.add('device-button-pressed')
            }}
            onPointerUp={(e) => {
              e.currentTarget.classList.remove('device-button-pressed')
            }}
            onPointerLeave={(e) => {
              e.currentTarget.classList.remove('device-button-pressed')
            }}
            className="device-button"
            aria-label="Voltar ao início"
            title="Voltar ao início"
          >
            <span className="device-button-dot" aria-hidden />
          </button>
        </div>

        {/* Sombra decorativa para profundidade */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black/5 dark:bg-black/20 rounded-full blur-2xl" />
      </div>
    </div>
  )
}
