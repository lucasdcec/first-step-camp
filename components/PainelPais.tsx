'use client'

import { useTema } from '@/contexts/ThemeContext'

interface PainelPaisProps {
  aoVoltar?: () => void
}

export default function PainelPais({ aoVoltar }: PainelPaisProps) {
  const { temaEscuro } = useTema()

  const stats = [
    { label: "Uso de Hoje", valor: '25 min', icone: '⏱️' },
    { label: 'Perguntas Feitas', valor: '7', icone: '❓' },
    { label: 'Tópicos Explorados', valor: '3', icone: '🎓' },
    { label: 'Sequência de Aprendizado', valor: '5 dias', icone: '🔥' },
  ]

  const topicos = ['Dinossauros', 'Espaço', 'Animais']

  return (
    <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`flex items-center justify-between p-4 border-b ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
        <h1 className={`text-lg font-semibold ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Painel dos Pais</h1>
        <button onClick={aoVoltar} className={`transition-colors ${temaEscuro ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-neutral-900'}`}>✕</button>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 space-y-6 ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Mensagem de boas-vindas */}
        <div className={`rounded-2xl p-6 ${temaEscuro ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
          <h3 className={`font-display text-lg font-bold mb-2 ${temaEscuro ? 'text-white' : 'text-blue-900'}`}>Bem-vindo ao painel de monitoramento!</h3>
          <p className={`text-sm font-body ${temaEscuro ? 'text-gray-300' : 'text-blue-800'}`}>Aqui você pode acompanhar a atividade educacional do seu filho no Primeiro Passo.</p>
        </div>

        {/* Grade de estatísticas */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className={`rounded-2xl p-4 border transition-colors ${temaEscuro ? 'bg-gray-700 border-gray-600 hover:border-blue-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400'}`}>
              <p className="text-2xl mb-2">{stat.icone}</p>
              <p className={`text-xs mb-1 ${temaEscuro ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
              <p className={`text-xl font-bold ${temaEscuro ? 'text-blue-400' : 'text-blue-600'}`}>{stat.valor}</p>
            </div>
          ))}
        </div>

        {/* Seção de tópicos */}
        <div>
          <h3 className={`text-sm font-semibold mb-3 ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Tópicos Explorados Hoje</h3>
          <div className="space-y-2">
            {topicos.map((topic, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl hover:opacity-80 transition-opacity ${temaEscuro ? 'bg-gray-700 text-white' : 'bg-gray-50 text-neutral-900'}`}>
                <div className={`w-2 h-2 rounded-full ${temaEscuro ? 'bg-blue-400' : 'bg-blue-600'}`} />
                <span className="text-sm font-medium">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className={`rounded-2xl p-4 border-l-4 ${temaEscuro ? 'bg-blue-900/30 border-blue-700 text-blue-200' : 'bg-blue-50 border-l-4 border-blue-400 text-blue-900'}`}>
          <h4 className="font-semibold text-sm mb-1">💡 Insight</h4>
          <p className="text-xs leading-relaxed">Seu filho está mostrando curiosidade sobre tópicos de natureza e ciência. Continue incentivando perguntas - ele está desenvolvendo habilidades de pensamento crítico!</p>
        </div>
      </div>

      {/* Rodapé */}
      <div className={`border-t p-4 text-center text-xs ${temaEscuro ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-500'}`}>
        <p>Primeiro Passo é projetado para inspirar curiosidade e aprendizado</p>
      </div>
    </div>
  )
}
