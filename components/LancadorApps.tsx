'use client'

import { useState } from 'react'
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

const CONQUISTAS = ['🌟 Primeiro Quiz', '🧠 Curioso do Dia', '🌍 Explorador']

export default function LancadorApps({ aoSelecionarApp, curiosidadeDiaria, aoSair }: LancadorAppsProps) {
  const { temaEscuro, alternarTema } = useTema()
  const [mostraPerfil, setMostraPerfil] = useState(false)

  const bg      = temaEscuro ? 'bg-gray-900' : 'bg-gradient-to-b from-indigo-50 to-white'
  const texto   = temaEscuro ? 'text-white' : 'text-neutral-900'
  const borda   = temaEscuro ? 'border-gray-700' : 'border-gray-100'

  const minUsados = 32
  const minLimite = 60
  const pctUso = Math.round((minUsados / minLimite) * 100)

  return (
    <div className={`flex flex-col h-full ${bg} transition-colors duration-300 relative`}>

      {/* Overlay de perfil do explorador */}
      {mostraPerfil && (
        <div
          className="absolute inset-0 z-50 flex items-end"
          onClick={() => setMostraPerfil(false)}
        >
          <div
            className={`w-full rounded-t-3xl p-5 shadow-2xl animate-fade-in-up ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-3xl shadow-lg">
                🚀
              </div>
              <div>
                <p className={`font-bold text-base ${texto}`}>Explorador</p>
                <p className={`text-xs ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>Nível 3 · Aprendiz Curioso</p>
              </div>
              <div className={`ml-auto flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${temaEscuro ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-600'}`}>
                ⭐ 248 XP
              </div>
            </div>

            {/* Barra de XP */}
            <div className="mb-4">
              <div className={`flex justify-between text-[10px] mb-1 ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>Progresso para Nível 4</span>
                <span>248 / 300 XP</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${temaEscuro ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" style={{ width: '83%' }} />
              </div>
            </div>

            {/* Conquistas */}
            <p className={`text-xs font-semibold mb-2 ${temaEscuro ? 'text-gray-300' : 'text-gray-600'}`}>🏆 Conquistas</p>
            <div className="flex gap-2 flex-wrap">
              {CONQUISTAS.map((c, i) => (
                <span key={i} className={`text-xs px-3 py-1 rounded-full ${temaEscuro ? 'bg-gray-700 text-violet-300' : 'bg-violet-50 text-violet-700'}`}>
                  {c}
                </span>
              ))}
            </div>

            <button
              onClick={() => setMostraPerfil(false)}
              className="mt-4 w-full py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${borda}`}>
        {/* Lado esquerdo: avatar + títulos + speech bubble */}
        <div className="flex items-start gap-2 min-w-0 mt-4">
          <button onClick={() => setMostraPerfil(true)} className="flex-shrink-0 active:scale-90 transition-transform">
            <AvatarIA tamanho="pequeno" expressao="feliz" animado={true} />
          </button>
          <div className="min-w-0">
            <h1 className={`font-bold text-sm ${texto}`}>Primeiro Passo</h1>
            <p className={`text-xs ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>Modo Explorador 🚀</p>
            {/* Speech bubble da IA */}
            <div className={`mt-1 text-[10px] px-2 py-0.5 rounded-xl rounded-tl-none inline-block font-medium
              ${temaEscuro ? 'bg-gray-700 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>
              Pronto para aprender hoje? ✨
            </div>
          </div>
        </div>

        {/* Lado direito: XP + tema + logout */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Badge XP */}
          <div className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full
            ${temaEscuro ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-600'}`}>
            ⭐ 248
          </div>

          {/* Botão tema */}
          <button
            onClick={alternarTema}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
              ${temaEscuro ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'}`}
            aria-label={temaEscuro ? 'Modo claro' : 'Modo escuro'}
          >
            <span className="text-sm">{temaEscuro ? '☀️' : '🌙'}</span>
          </button>

          {/* Logout */}
          {aoSair && (
            <button
              onClick={aoSair}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
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
          <p className={`text-sm font-bold`}>
            <span className={`bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent`}>
              Olá, Explorador! 👋
            </span>
          </p>
          <p className={`text-xs mt-0.5 ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>
            O que vamos descobrir hoje?
          </p>
        </div>

        {/* Uso diário */}
        <div className={`rounded-xl px-3 py-2 border ${temaEscuro ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className={`text-[10px] font-semibold ${temaEscuro ? 'text-gray-400' : 'text-gray-500'}`}>⏱ Uso hoje</span>
            <span className={`text-[10px] font-bold ${pctUso >= 80 ? 'text-orange-500' : temaEscuro ? 'text-gray-300' : 'text-gray-600'}`}>
              {minUsados}/{minLimite} min
            </span>
          </div>
          <div className={`h-1.5 rounded-full overflow-hidden ${temaEscuro ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${pctUso >= 80 ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-violet-400 to-purple-500'}`}
              style={{ width: `${pctUso}%` }}
            />
          </div>
        </div>

        {/* Missão do Dia */}
        {curiosidadeDiaria && (
          <button
            onClick={() => aoSelecionarApp('missoes')}
            className={`w-full rounded-2xl p-4 border-2 transition-all duration-200 text-left active:scale-[0.98]
              ${temaEscuro
                ? 'bg-amber-900/20 border-amber-700/50 hover:bg-amber-900/40'
                : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400'}`}
          >
            <p className="text-xs font-bold text-amber-500 mb-1.5">🎯 Missão do Dia</p>
            <p className={`text-sm font-semibold ${texto}`}>{curiosidadeDiaria.pergunta}</p>

            {/* Barra de progresso */}
            <div className="mt-2.5">
              <div className={`flex justify-between text-[10px] mb-1 ${temaEscuro ? 'text-amber-400' : 'text-amber-600'}`}>
                <span>2/3 missões completas</span>
                <span>67%</span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${temaEscuro ? 'bg-gray-700' : 'bg-amber-100'}`}>
                <div className="h-full w-2/3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
              </div>
            </div>

            <p className={`text-[10px] mt-1.5 ${temaEscuro ? 'text-amber-400' : 'text-amber-600'}`}>
              Toque para continuar →
            </p>
          </button>
        )}

        {/* Grid de Apps */}
        <div className="grid grid-cols-3 gap-3">
          {APPS.map((app, idx) => (
            <button
              key={app.id}
              onClick={() => aoSelecionarApp(app.id as any)}
              className={`animate-fade-in-up group relative overflow-hidden rounded-2xl aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 shadow-md ${app.sombra}`}
              style={{ animationDelay: `${idx * 70}ms` }}
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
        <div className={`p-3 rounded-xl border-l-4 ${temaEscuro ? 'bg-violet-900/30 border-violet-700' : 'bg-violet-50 border-violet-300'}`}>
          <p className={`text-xs ${temaEscuro ? 'text-violet-200' : 'text-violet-900'}`}>
            💡 <strong>Dica:</strong> Converse com a IA ou explore tópicos para aprender!
          </p>
        </div>
      </div>

    </div>
  )
}
