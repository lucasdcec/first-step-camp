'use client'

import { useState, useEffect } from 'react'

interface FrameDispositivoProps {
  children: React.ReactNode
  aoApertarBotao?: () => void
}

function StatusBar() {
  const [hora, setHora] = useState('')

  useEffect(() => {
    const atualizar = () => {
      const agora = new Date()
      setHora(agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }
    atualizar()
    const intervalo = setInterval(atualizar, 1000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-black/30 text-white text-[10px] font-semibold flex-shrink-0">
      <span>{hora}</span>
      <div className="flex items-center gap-1.5">
        {/* WiFi */}
        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
          <path d="M7 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          <path d="M4.5 6.8A3.5 3.5 0 0 1 7 5.8a3.5 3.5 0 0 1 2.5 1l.9-.9A4.8 4.8 0 0 0 7 4.6a4.8 4.8 0 0 0-3.4 1.3l.9.9z"/>
          <path d="M2 4.3A6.5 6.5 0 0 1 7 2.3a6.5 6.5 0 0 1 5 2l.9-.9A7.8 7.8 0 0 0 7 1.1 7.8 7.8 0 0 0 1.1 3.4L2 4.3z"/>
        </svg>
        {/* Bateria */}
        <div className="flex items-center gap-0.5">
          <div className="relative w-5 h-3 border border-white/80 rounded-[2px]">
            <div className="absolute inset-[1px] right-[3px] bg-green-400 rounded-[1px]" />
          </div>
          <div className="w-0.5 h-1.5 bg-white/60 rounded-r-sm" />
        </div>
      </div>
    </div>
  )
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
            <StatusBar />
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
