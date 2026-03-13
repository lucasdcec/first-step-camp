'use client'

import AvatarIA from './AvatarIA'
import { useTema } from '@/contexts/ThemeContext'

interface LancadorAppsProps {
  aoSelecionarApp: (app: 'pergunte' | 'explore' | 'quiz' | 'historias' | 'telefone' | 'missoes') => void
  curiosidadeDiaria?: {
    pergunta: string
    icone: string
  }
}

const APPS = [
  { id: 'pergunte', icone: '🧠', label: 'Pergunte', cor: 'from-blue-400 to-blue-600' },
  { id: 'explore', icone: '🌍', label: 'Explore', cor: 'from-green-400 to-green-600' },
  { id: 'quiz', icone: '🎮', label: 'Quiz', cor: 'from-purple-400 to-purple-600' },
  { id: 'historias', icone: '📖', label: 'Histórias', cor: 'from-pink-400 to-pink-600' },
  { id: 'telefone', icone: '📞', label: 'Telefonar', cor: 'from-yellow-400 to-yellow-600' },
  { id: 'missoes', icone: '🌱', label: 'Missões', cor: 'from-emerald-400 to-emerald-600' },
]

export default function LancadorApps({ aoSelecionarApp, curiosidadeDiaria }: LancadorAppsProps) {
  const { temaEscuro, alternarTema } = useTema()

  const classesdoTema = {
    bg: temaEscuro ? 'bg-gray-900' : 'bg-white',
    texto: temaEscuro ? 'text-white' : 'text-neutral-900',
    textoSecundario: temaEscuro ? 'text-gray-300' : 'text-gray-500',
    borda: temaEscuro ? 'border-gray-700' : 'border-gray-100',
    dica: temaEscuro ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-400',
    dicaTex: temaEscuro ? 'text-blue-200' : 'text-blue-900',
    rodape: temaEscuro ? 'text-gray-400' : 'text-gray-500',
  }

  return (
    <div className={`flex flex-col h-full ${classesdoTema.bg} transition-colors duration-300`}>
      {/* Cabeçalho com botão de tema */}
      <div className={`flex items-center justify-between p-4 border-b ${classesdoTema.borda}`}>
        <div className="flex items-center gap-3">
          <AvatarIA tamanho="pequeno" expressao="feliz" animado={true} />
          <div>
            <h1 className={`font-semibold text-sm ${classesdoTema.texto}`}>Primeiro Passo</h1>
            <p className={`text-xs ${classesdoTema.textoSecundario}`}>Assistente de Aprendizado</p>
          </div>
        </div>
        
        {/* Botão Sol/Lua */}
        <button
          onClick={alternarTema}
          className={`
            relative w-10 h-10 rounded-full flex items-center justify-center
            transition-all duration-300 transform hover:scale-110
            ${temaEscuro 
              ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
              : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
            }
          `}
          aria-label={temaEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
        >
          <span className="text-xl transition-all duration-300">
            {temaEscuro ? '☀️' : '🌙'}
          </span>
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${classesdoTema.texto}`}>
        {/* Saudação */}
        <div className="text-center space-y-2 mb-2">
          <p className="text-sm">
            O que você quer explorar hoje?
          </p>
        </div>

        {/* Card de Curiosidade Diária */}
        {curiosidadeDiaria && (
          <button
            onClick={() => aoSelecionarApp('pergunte')}
            className={`
              w-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 
              hover:from-blue-500/30 hover:to-blue-500/20 rounded-2xl p-4 
              border-2 border-blue-500/30 transition-all duration-200 text-left
              ${temaEscuro ? 'text-white' : 'text-neutral-900'}
            `}
          >
            <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 mb-2">✨ Curiosidade do Dia</p>
            <p className="text-sm font-medium">{curiosidadeDiaria.pergunta}</p>
          </button>
        )}

        {/* Grid de Apps */}
        <div className="grid grid-cols-3 gap-3">
          {APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => aoSelecionarApp(app.id as any)}
              className="group relative overflow-hidden rounded-2xl aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              {/* Gradiente de fundo */}
              <div className={`absolute inset-0 bg-gradient-to-br ${app.cor} opacity-90 group-hover:opacity-100 transition-opacity`} />
              
              {/* Conteúdo */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-3xl group-hover:animate-bounce">{app.icone}</span>
                <span className="text-white font-semibold text-xs text-center">{app.label}</span>
              </div>

              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Dica */}
        <div className={`mt-6 p-3 rounded-xl border-l-4 transition-colors duration-300 ${classesdoTema.dica}`}>
          <p className={`text-xs ${classesdoTema.dicaTex}`}>
            💡 <strong>Dica:</strong> Comece com a curiosidade do dia acima para aprender!
          </p>
        </div>
      </div>

      {/* Rodapé */}
      <div className={`border-t ${classesdoTema.borda} p-3 text-center text-xs transition-colors duration-300 ${classesdoTema.rodape}`}>
        <p>Aperte o botão abaixo para voltar ao início a qualquer momento</p>
      </div>
    </div>
  )
}
