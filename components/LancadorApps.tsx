'use client'

import AvatarIA from './AvatarIA'
import { useTema } from '@/contexts/ThemeContext'

interface LancadorAppsProps {
  aoSelecionarApp: (app: 'pergunte' | 'explore' | 'quiz' | 'historias' | 'telefone' | 'missoes') => void
  aoSair?: () => void
  curiosidadeDiaria?: {
    pergunta: string
    icone: string
  }
}

const APPS = [
  { id: 'pergunte', icone: '🧠', label: 'Pergunte', cor: 'from-violet-500 to-purple-600', sombra: 'shadow-violet-500/30' },
  { id: 'explore',  icone: '🌍', label: 'Explore',  cor: 'from-emerald-400 to-green-600', sombra: 'shadow-green-500/30' },
  { id: 'quiz',     icone: '🎮', label: 'Quiz',     cor: 'from-blue-400 to-blue-600',     sombra: 'shadow-blue-500/30' },
  { id: 'historias',icone: '📖', label: 'Histórias',cor: 'from-pink-400 to-rose-600',    sombra: 'shadow-pink-500/30' },
  { id: 'telefone', icone: '📞', label: 'Telefonar',cor: 'from-amber-400 to-orange-500', sombra: 'shadow-amber-500/30' },
  { id: 'missoes',  icone: '🌱', label: 'Missões',  cor: 'from-teal-400 to-cyan-600',    sombra: 'shadow-teal-500/30' },
]

export default function LancadorApps({ aoSelecionarApp, curiosidadeDiaria, aoSair }: LancadorAppsProps) {
  const { temaEscuro, alternarTema } = useTema()

  const bg       = temaEscuro ? 'bg-gray-900' : 'bg-gradient-to-b from-indigo-50 to-white'
  const texto    = temaEscuro ? 'text-white' : 'text-neutral-900'
  const borda    = temaEscuro ? 'border-gray-700' : 'border-gray-100'
  const dicaBg   = temaEscuro ? 'bg-violet-900/30 border-violet-700' : 'bg-violet-50 border-violet-300'
  const dicaTxt  = temaEscuro ? 'text-violet-200' : 'text-violet-900'

  return (
    <div className={`flex flex-col h-full ${bg} transition-colors duration-300`}>
      {/* Cabeçalho */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${borda}`}>
        <div className="flex items-center gap-2">
          <AvatarIA tamanho="pequeno" expressao="feliz" animado={true} />
          <div>
            <h1 className={`font-bold text-sm ${texto}`}>Primeiro Passo</h1>
            <p className={`text-xs ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>Modo Explorador 🚀</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão tema */}
          <button
            onClick={alternarTema}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
              ${temaEscuro ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'}`}
            aria-label={temaEscuro ? 'Modo claro' : 'Modo escuro'}
          >
            <span className="text-base">{temaEscuro ? '☀️' : '🌙'}</span>
          </button>
          {/* Logout */}
          {aoSair && (
            <button
              onClick={aoSair}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                ${temaEscuro ? 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-neutral-900'}`}
              aria-label="Trocar perfil"
              title="Trocar perfil"
            >
              <span className="text-sm">↩️</span>
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className={`flex-1 overflow-y-auto px-4 py-3 space-y-4 ${texto}`}>
        {/* Saudação */}
        <div className="text-center">
          <p className={`text-sm font-medium ${temaEscuro ? 'text-gray-300' : 'text-gray-600'}`}>
            O que vamos descobrir hoje? ✨
          </p>
        </div>

        {/* Curiosidade do Dia */}
        {curiosidadeDiaria && (
          <button
            onClick={() => aoSelecionarApp('pergunte')}
            className={`w-full rounded-2xl p-4 border-2 transition-all duration-200 text-left active:scale-98
              ${temaEscuro
                ? 'bg-violet-900/30 border-violet-700/50 hover:bg-violet-900/50'
                : 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 hover:border-violet-400'}`}
          >
            <p className="text-xs font-bold text-violet-500 mb-1.5">✨ Curiosidade do Dia</p>
            <p className={`text-sm font-semibold ${texto}`}>{curiosidadeDiaria.pergunta}</p>
            <p className={`text-xs mt-1 ${temaEscuro ? 'text-violet-300' : 'text-violet-600'}`}>Toque para descobrir →</p>
          </button>
        )}

        {/* Grid de Apps */}
        <div className="grid grid-cols-3 gap-3">
          {APPS.map((app, idx) => (
            <button
              key={app.id}
              onClick={() => aoSelecionarApp(app.id as any)}
              className={`group relative overflow-hidden rounded-2xl aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 shadow-md ${app.sombra}`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${app.cor} opacity-90 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-3xl drop-shadow-lg group-hover:scale-110 transition-transform duration-200">{app.icone}</span>
                <span className="text-white font-bold text-xs text-center drop-shadow">{app.label}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Dica */}
        <div className={`p-3 rounded-xl border-l-4 ${dicaBg}`}>
          <p className={`text-xs ${dicaTxt}`}>
            💡 <strong>Dica:</strong> Converse com a IA ou explore tópicos para aprender!
          </p>
        </div>
      </div>

      {/* Rodapé */}
      <div className={`border-t ${borda} py-2 text-center text-xs ${temaEscuro ? 'text-gray-500' : 'text-gray-400'}`}>
        Aperte o botão abaixo para voltar ao início
      </div>
    </div>
  )
}
