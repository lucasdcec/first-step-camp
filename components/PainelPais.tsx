'use client'

import { useState } from 'react'
import { usePerfil } from '@/contexts/PerfilContext'

interface PainelPaisProps {
  aoVoltar?: () => void
}

type SubTela = 'painel' | 'telefone-log' | 'aprendizado'

// ─── Dados mockados ────────────────────────────────────────────────────────────

const STATS = [
  { label: 'Uso de Hoje',  valor: '32 min',  icone: '⏱️', cor: 'from-blue-500 to-cyan-500'    },
  { label: 'Perguntas',    valor: '12',       icone: '❓', cor: 'from-violet-500 to-purple-600' },
  { label: 'Tópicos',      valor: '4',        icone: '🎓', cor: 'from-emerald-500 to-green-600' },
  { label: 'Sequência',    valor: '5 dias',   icone: '🔥', cor: 'from-orange-400 to-red-500'    },
]

const ATIVIDADE_HOJE = [
  { hora: '07:42', acao: 'Perguntou sobre dinossauros 🦕',              tipo: 'chat'    },
  { hora: '07:51', acao: 'Completou Quiz — 4/5 corretas 🎮',            tipo: 'quiz'    },
  { hora: '08:05', acao: 'Explorou tópico: Espaço 🚀',                  tipo: 'explore' },
  { hora: '08:18', acao: 'Gerou história: Astronauta no fundo do mar 📖', tipo: 'historia'},
  { hora: '08:29', acao: 'Completou missão: Observar natureza 🌱',       tipo: 'missao'  },
]

const BARRA_SEMANA = [
  { dia: 'Seg', min: 20 }, { dia: 'Ter', min: 35 }, { dia: 'Qua', min: 15 },
  { dia: 'Qui', min: 40 }, { dia: 'Sex', min: 32 }, { dia: 'Sáb', min: 55 },
  { dia: 'Dom', min: 10 },
]
const MAX_BARRA = 55

const COR_TIPO: Record<string, string> = {
  chat: 'bg-violet-500', quiz: 'bg-blue-500', explore: 'bg-emerald-500',
  historia: 'bg-pink-500', missao: 'bg-orange-500',
}

const MATERIAS = ['🔬 Ciências', '🌌 Espaço', '📖 Histórias', '🔢 Matemática']

const CHAMADAS = [
  { contato: 'Mamãe',     emoji: '👩', hora: '07:35', duracao: '3 min',  bloqueado: false },
  { contato: 'Vovó',      emoji: '👵', hora: '08:52', duracao: '7 min',  bloqueado: false },
]
const MENSAGENS = [
  { contato: 'Mamãe', emoji: '👩', hora: '07:34', texto: '"Bom dia filhinho! 🌞"', bloqueado: false },
  { contato: 'Papai', emoji: '👨', hora: '09:10', texto: '"Vai bem na escola!"',   bloqueado: false },
]
const CONTATOS_APROVADOS = [
  { nome: 'Mamãe', emoji: '👩' }, { nome: 'Papai', emoji: '👨' },
  { nome: 'Vovó',  emoji: '👵' }, { nome: 'Tio Pedro', emoji: '👦' },
]

const DESEMPENHO = [
  { materia: '🔬 Ciências',   pct: 92, cor: 'bg-emerald-500' },
  { materia: '🌌 Espaço',     pct: 88, cor: 'bg-blue-500'    },
  { materia: '📖 Histórias',  pct: 78, cor: 'bg-pink-500'    },
  { materia: '🔢 Matemática', pct: 72, cor: 'bg-violet-500'  },
]

// ─── Header reutilizável ───────────────────────────────────────────────────────

function HeaderPainel({
  titulo, subtitulo, aoVoltar,
}: { titulo: string; subtitulo: string; aoVoltar: () => void }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-4 py-4 text-white flex items-center gap-3 flex-shrink-0">
      <button
        onClick={aoVoltar}
        className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all flex-shrink-0"
      >
        ‹
      </button>
      <div>
        <h2 className="font-bold text-sm">{titulo}</h2>
        <p className="text-blue-200 text-[10px]">{subtitulo}</p>
      </div>
    </div>
  )
}

// ─── Sub-tela: Telefone Seguro ─────────────────────────────────────────────────

function TelaLogTelefone({ aoVoltar }: { aoVoltar: () => void }) {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-gray-900">
      <HeaderPainel titulo="📞 Telefone Seguro" subtitulo="Histórico de hoje" aoVoltar={aoVoltar} />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Chamadas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3">Chamadas de hoje</h3>
          <div className="space-y-3">
            {CHAMADAS.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-base flex-shrink-0">{c.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-white">{c.contato}</p>
                  <p className="text-[10px] text-gray-400">{c.hora} · {c.duracao}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex-shrink-0">✓ Aprovado</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mensagens */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3">Mensagens de hoje</h3>
          <div className="space-y-3">
            {MENSAGENS.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-base flex-shrink-0">{m.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold text-gray-800 dark:text-white">{m.contato}</p>
                    <p className="text-[10px] text-gray-400">{m.hora}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">{m.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contatos aprovados */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3">Contatos aprovados (4/4)</h3>
          <div className="grid grid-cols-2 gap-2">
            {CONTATOS_APROVADOS.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-gray-700/50 rounded-xl px-3 py-2">
                <span className="text-base">{c.emoji}</span>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{c.nome}</p>
                <span className="ml-auto text-emerald-500 text-xs">✓</span>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  )
}

// ─── Sub-tela: Desempenho de Aprendizado ──────────────────────────────────────

function TelaAprendizado({ aoVoltar }: { aoVoltar: () => void }) {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-gray-900">
      <HeaderPainel titulo="🎓 Relatório de Aprendizado" subtitulo="Desempenho desta semana" aoVoltar={aoVoltar} />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Nota geral */}
        <div className="bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl p-5 text-white text-center shadow-lg shadow-violet-500/20">
          <p className="text-xs font-semibold text-violet-200 mb-1 uppercase tracking-wide">Média geral no Quiz</p>
          <p className="text-5xl font-bold">85<span className="text-2xl text-violet-200">%</span></p>
          <p className="text-violet-200 text-xs mt-1">de acerto esta semana 🎯</p>
          {/* Barra visual */}
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Por matéria */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3">Desempenho por matéria</h3>
          <div className="space-y-3">
            {DESEMPENHO.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{d.materia}</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-white">{d.pct}%</p>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${d.cor} rounded-full transition-all duration-700`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conquistas da semana */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3">Conquistas da semana</h3>
          <div className="space-y-2">
            {[
              { icone: '🎮', label: 'Quiz completados', valor: '7' },
              { icone: '📖', label: 'Histórias criadas', valor: '3' },
              { icone: '🌱', label: 'Missões concluídas', valor: '8/10' },
              { icone: '❓', label: 'Perguntas feitas',   valor: '47' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.icone}</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{item.label}</p>
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-white">{item.valor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sugestão da IA */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">🤖 Sugestão da IA</h4>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            Matemática está com o menor desempenho (72%). Sugira 10 minutinhos de quiz de matemática amanhã para reforçar! O histórico mostra que ela aprende melhor pela manhã.
          </p>
        </div>

      </div>
    </div>
  )
}

// ─── Painel Principal ──────────────────────────────────────────────────────────

export default function PainelPais({ aoVoltar }: PainelPaisProps) {
  const { bloqueado, bloquear, desbloquear } = usePerfil()
  const [toastVisivel, setToastVisivel] = useState(false)
  const [toastMsg, setToastMsg]       = useState('')
  const [subTela, setSubTela]         = useState<SubTela>('painel')
  const [alertaSimulado, setAlertaSimulado] = useState(false)

  const alternarAcesso = () => {
    if (bloqueado) {
      desbloquear()
      setToastMsg('▶ Acesso liberado com sucesso')
    } else {
      bloquear('pausado')
      setToastMsg('⏸ Acesso pausado com sucesso')
    }
    setToastVisivel(true)
    setTimeout(() => setToastVisivel(false), 2500)
  }

  // Sub-telas renderizadas no lugar do painel
  if (subTela === 'telefone-log')  return <TelaLogTelefone  aoVoltar={() => setSubTela('painel')} />
  if (subTela === 'aprendizado')   return <TelaAprendizado  aoVoltar={() => setSubTela('painel')} />

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-gray-900 relative">

      {/* Toast */}
      {toastVisivel && (
        <div className="animate-fade-in-up absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-4 py-2 rounded-full shadow-xl whitespace-nowrap">
          {toastMsg}
        </div>
      )}

      {/* Header principal */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-4 py-5 text-white flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="font-bold text-base">Painel dos Pais</h1>
            <p className="text-blue-200 text-xs">Acompanhe o progresso de aprendizado</p>
          </div>
          <button
            onClick={aoVoltar}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all"
            title="Sair do painel"
          >
            ↩️
          </button>
        </div>

        <div className="flex gap-2 mt-2 mb-3">
          <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full">📈 Semana excelente!</span>
          <span className="bg-green-400/25 text-green-200 text-[10px] font-semibold px-2 py-1 rounded-full">+15% vs semana passada</span>
        </div>

        <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-xl">🧒</div>
          <div>
            <p className="font-semibold text-sm">Explorador</p>
            <p className="text-blue-200 text-xs">Ativo agora · última atividade há 3 min</p>
          </div>
          <div className="ml-auto">
            <span className="bg-green-400 text-green-900 text-xs font-bold px-2 py-0.5 rounded-full">Online</span>
          </div>
        </div>
      </div>

      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* 1. Stats */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.cor} flex items-center justify-center text-base mb-2 shadow-sm`}>{s.icone}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white mt-0.5">{s.valor}</p>
            </div>
          ))}
        </div>

        {/* 2. Alerta de Segurança */}
        <div className={`rounded-2xl p-4 border transition-all duration-300 ${
          alertaSimulado
            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
            : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-xs font-bold uppercase tracking-wide ${alertaSimulado ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
              {alertaSimulado ? '⚠️ Alerta de Segurança' : '🛡️ Segurança'}
            </h3>
            {/* Botão demo discreto */}
            <button
              onClick={() => setAlertaSimulado(v => !v)}
              className="text-[9px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline transition-colors"
            >
              {alertaSimulado ? 'limpar demo' : '🎭 simular alerta'}
            </button>
          </div>

          {!alertaSimulado ? (
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">✅ Nenhum alerta hoje — tudo dentro do esperado.</p>
          ) : (
            <div className="space-y-2 mt-1">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <strong>1 ocorrência detectada</strong> e bloqueada automaticamente.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-amber-200 dark:border-amber-700">
                <p className="text-[10px] font-bold text-gray-700 dark:text-gray-200">Busca bloqueada · 08:32</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Termo: <em>"jogos online grátis"</em> — fora da lista permitida</p>
              </div>
              <button
                onClick={() => setSubTela('telefone-log')}
                className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Ver detalhes no histórico →
              </button>
            </div>
          )}
        </div>

        {/* 3. Atividade de Hoje */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-700 dark:text-white mb-3">🕐 Atividade de Hoje</h3>
          <div className="space-y-3">
            {ATIVIDADE_HOJE.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${COR_TIPO[item.tipo] ?? 'bg-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 dark:text-gray-200 leading-snug">{item.acao}</p>
                </div>
                <p className="text-[10px] text-gray-400 flex-shrink-0">{item.hora}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Telefone Seguro — mini card */}
        <button
          onClick={() => setSubTela('telefone-log')}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-left hover:border-blue-300 dark:hover:border-blue-600 transition-colors active:scale-[0.99] group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 dark:text-white">📞 Telefone Seguro</h3>
            <span className="text-xs text-blue-500 font-semibold group-hover:translate-x-0.5 transition-transform">Ver histórico →</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800 dark:text-white">2</p>
              <p className="text-[10px] text-gray-400">chamadas</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800 dark:text-white">2</p>
              <p className="text-[10px] text-gray-400">mensagens</p>
            </div>
            <div className="ml-auto">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                ✓ Todos aprovados
              </span>
            </div>
          </div>
        </button>

        {/* 5. Desempenho de Aprendizado — mini card */}
        <button
          onClick={() => setSubTela('aprendizado')}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-left hover:border-violet-300 dark:hover:border-violet-600 transition-colors active:scale-[0.99] group"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-700 dark:text-white">🎓 Desempenho no Aprendizado</h3>
            <span className="text-xs text-violet-500 font-semibold group-hover:translate-x-0.5 transition-transform">Ver relatório →</span>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">85<span className="text-base text-gray-400 font-normal">%</span></p>
              <p className="text-[10px] text-gray-400">acerto no quiz</p>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Destaque em 🔬 Ciências (92%)</p>
            </div>
          </div>
        </button>

        {/* 6. Gráfico Semanal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-700 dark:text-white mb-3">📊 Uso na Semana (minutos)</h3>
          <div className="relative mt-4">
            <div className="flex items-end gap-1.5 h-16">
              {BARRA_SEMANA.map((item, i) => {
                const hoje = i === 5
                const pct  = (item.min / MAX_BARRA) * 100
                return (
                  <div key={item.dia} className="flex-1 flex flex-col items-center gap-1 relative">
                    {hoje && (
                      <p className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-violet-500 whitespace-nowrap">{item.min}min</p>
                    )}
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${hoje ? 'bg-gradient-to-t from-violet-500 to-purple-400' : 'bg-blue-200 dark:bg-gray-600'}`}
                      style={{ height: `${pct}%` }}
                    />
                    <p className={`text-[9px] font-semibold ${hoje ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400'}`}>{item.dia}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 7. Insight da semana */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
          <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-1">💡 Insight da semana</h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
            Seu filho está se destacando em <strong>ciências e natureza</strong>! Ele já fez 12 perguntas hoje — a curiosidade é o motor do aprendizado. 🌟
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {MATERIAS.map((tag, i) => (
              <span key={i} className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        {/* 8. Botão Pausar/Liberar */}
        <button
          onClick={alternarAcesso}
          className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-95
            ${bloqueado
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/30'}`}
        >
          {bloqueado ? '▶ Liberar Acesso da Criança' : '⏸ Pausar Acesso da Criança'}
        </button>

        {/* 9. Configurações */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-700 dark:text-white mb-3">⚙️ Configurações</h3>
          <div className="space-y-3">
            {[
              { label: 'Limite diário de uso',     valor: '60 min',    icone: '⏳' },
              { label: 'Contatos permitidos',       valor: '4 contatos', icone: '👥' },
              { label: 'Notificações para pais',    valor: 'Ativado',   icone: '🔔' },
            ].map((cfg, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{cfg.icone}</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{cfg.label}</p>
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">{cfg.valor}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
