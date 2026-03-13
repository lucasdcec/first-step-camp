'use client'

interface FrameDispositivoProps {
  children: React.ReactNode
  aoApertarBotao?: () => void
}

export default function FrameDispositivo({ children, aoApertarBotao }: FrameDispositivoProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-gray-950 dark:to-gray-900 p-4 transition-colors duration-300">
      <div className="relative w-full max-w-md">

        {/* Efeito de brilho sutil ao redor do dispositivo */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Corpo completo do dispositivo — borda + tela + chin em um bloco só */}
        <div className="relative rounded-[2.5rem] border-[12px] border-gray-800 dark:border-gray-700 shadow-device flex flex-col overflow-hidden">

          {/* Tela de vidro */}
          <div className="aspect-[9/16] bg-white dark:bg-gray-800 overflow-hidden flex flex-col">
            {children}
          </div>

          {/* Chin — parte física abaixo da tela */}
          <div className="bg-gray-800 dark:bg-gray-700 flex items-center justify-center py-3.5">
            <button
              onClick={aoApertarBotao}
              className="w-11 h-11 rounded-full border-2 border-gray-600 dark:border-gray-500 bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 active:scale-90 transition-all duration-150 flex items-center justify-center shadow-inner"
              aria-label="Botão de inicio do dispositivo"
              title="Aperte para voltar ao início"
            >
              {/* Ícone interno: quadrado arredondado estilo físico */}
              <div className="w-4 h-4 rounded-[4px] border-2 border-gray-500 dark:border-gray-400" />
            </button>
          </div>

        </div>

        {/* Sombra decorativa de profundidade */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black/5 dark:bg-black/20 rounded-full blur-2xl" />

      </div>
    </div>
  )
}
