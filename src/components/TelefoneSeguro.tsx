'use client'

import { useState, useRef, useEffect } from 'react'
import { useContatos, Contato } from '@/hooks/useContatos'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface TelefoneSeguroProps {
  aoVoltar?: () => void
}

interface Mensagem {
  tipo: 'usuario' | 'contato'
  texto: string
  horario: string
}

interface ChamadaAtiva {
  contatoId: string
  duracao: number
}

export default function TelefoneSeguro({ aoVoltar }: TelefoneSeguroProps) {
  const { contatos } = useContatos()
  const [contatoSelecionado, setContatoSelecionado] = useState<string | null>(null)
  const [modo, setModo] = useState<'contatos' | 'mensagens' | 'chamada'>('contatos')
  const [mensagem, setMensagem] = useState('')
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [chamadaAtiva, setChamadaAtiva] = useState<ChamadaAtiva | null>(null)
  const [historicoMensagens, setHistoricoMensagens] = useLocalStorage<Record<string, Mensagem[]>>('primeiro-passo-mensagens', {})
  const mensagensEndRef = useRef<HTMLDivElement>(null)
  const intervaloRef = useRef<NodeJS.Timeout | null>(null)

  const contatoAtual = contatos.find(c => c.id === contatoSelecionado)

  // Auto-scroll para última mensagem
  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  // Timer para chamada
  useEffect(() => {
    if (chamadaAtiva) {
      intervaloRef.current = setInterval(() => {
        setChamadaAtiva(prev => prev ? { ...prev, duracao: prev.duracao + 1 } : null)
      }, 1000)
    }
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current)
    }
  }, [chamadaAtiva])

  const formatarHorario = () => {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatarDuracao = (segundos: number) => {
    const minutos = Math.floor(segundos / 60)
    const segs = segundos % 60
    return `${minutos}:${segs.toString().padStart(2, '0')}`
  }

  const enviarMensagem = () => {
    if (!mensagem.trim() || !contatoSelecionado) return

    const novaMensagem: Mensagem = {
      tipo: 'usuario',
      texto: mensagem,
      horario: formatarHorario()
    }

    const novasMensagens = [...mensagens, novaMensagem]
    setMensagens(novasMensagens)
    setHistoricoMensagens(prev => ({
      ...prev,
      [contatoSelecionado]: novasMensagens
    }))
    setMensagem('')

    // Resposta automática após 1s
    setTimeout(() => {
      const respostas = [
        'Que legais as descobertas de hoje! 🎉',
        'Estou muito orgulhoso de você! ❤️',
        'Continue aprendendo sempre! 📚',
        'Você está sendo muito curioso! 🧠',
        'Adorei saber sobre tudo que aprendeu! 💕'
      ]
      const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)]
      
      const respostaMensagem: Mensagem = {
        tipo: 'contato',
        texto: respostaAleatoria,
        horario: formatarHorario()
      }
      
      const mensagensAtualizadas = [...novasMensagens, respostaMensagem]
      setMensagens(mensagensAtualizadas)
      setHistoricoMensagens(prev => ({
        ...prev,
        [contatoSelecionado]: mensagensAtualizadas
      }))
    }, 1000)
  }

  const iniciarChamada = (contatoId: string) => {
    setContatoSelecionado(contatoId)
    setChamadaAtiva({ contatoId, duracao: 0 })
    setModo('chamada')
  }

  const encerrarChamada = () => {
    setChamadaAtiva(null)
    setContatoSelecionado(null)
    setModo('contatos')
  }

  const abrirMensagens = (contatoId: string) => {
    setContatoSelecionado(contatoId)
    setModo('mensagens')
    // Carregar histórico de mensagens
    const historico = historicoMensagens[contatoId] || []
    setMensagens(historico)
  }

  // MODO: CHAMADA ATIVA
  if (modo === 'chamada' && chamadaAtiva && contatoAtual) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Conteúdo da chamada */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-6">
          {/* Avatar do contato grande */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-300 to-blue-200 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center text-6xl shadow-lg animate-pulse">
            {contatoAtual.icone}
          </div>

          {/* Nome do contato */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {contatoAtual.nome}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              📞 Em chamada...
            </p>
            <p className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {formatarDuracao(chamadaAtiva.duracao)}
            </p>
          </div>

          {/* Indicadores de chamada */}
          <div className="flex gap-4">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>

          {/* Botões de ação */}
          <div className="flex gap-4 mt-8">
            <button className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 flex items-center justify-center text-white text-2xl transition-all transform hover:scale-110">
              🔊
            </button>
            <button className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 flex items-center justify-center text-white text-2xl transition-all transform hover:scale-110">
              🎤
            </button>
            <button
              onClick={encerrarChamada}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-2xl transition-all transform hover:scale-110"
            >
              ❌
            </button>
          </div>
        </div>
      </div>
    )
  }

  // MODO: MENSAGENS
  if (modo === 'mensagens' && contatoAtual) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-800">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={() => {
              setContatoSelecionado(null)
              setModo('contatos')
              setMensagens([])
            }}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xl"
          >
            ←
          </button>
          <div className="text-center">
            <h1 className="font-semibold text-sm text-gray-900 dark:text-white">{contatoAtual.nome}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Online agora</p>
          </div>
          <span className="text-2xl">{contatoAtual.icone}</span>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
          {mensagens.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <span className="text-5xl block mb-2">{contatoAtual.icone}</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Envie uma mensagem para {contatoAtual.nome}
                </p>
              </div>
            </div>
          ) : (
            <>
              {mensagens.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-3 ${
                      msg.tipo === 'usuario'
                        ? 'bg-blue-500 text-white rounded-tr-none'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm break-words">{msg.texto}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.horario}</p>
                  </div>
                </div>
              ))}
              <div ref={mensagensEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2 bg-white dark:bg-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
              placeholder="Digite uma mensagem..."
              maxLength={150}
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={enviarMensagem}
              disabled={!mensagem.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-2xl px-4 py-2 transition-colors duration-200 font-medium text-sm"
            >
              Enviar
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{mensagem.length}/150</p>
        </div>
      </div>
    )
  }

  // MODO: LISTA DE CONTATOS
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <button
          onClick={aoVoltar}
          className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xl"
        >
          ←
        </button>
        <h1 className="font-semibold text-sm text-gray-900 dark:text-white">Telefonar 📞</h1>
        <div className="w-6" />
      </div>

      {/* Contatos */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {contatos.map((contato) => (
          <div
            key={contato.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <button
              onClick={() => abrirMensagens(contato.id)}
              className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity"
            >
              <span className="text-3xl">{contato.icone}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{contato.nome}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{contato.ultimaMensagem}</p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{contato.ultimoHorario}</span>
            </button>

            {/* Botão de chamada */}
            <button
              onClick={() => iniciarChamada(contato.id)}
              className="ml-2 w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors transform hover:scale-110"
              title={`Chamar ${contato.nome}`}
            >
              ☎️
            </button>
          </div>
        ))}
      </div>

      {/* Rodapé */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 text-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border-l-4 border-blue-500">
          <p className="text-xs text-blue-900 dark:text-blue-200">
            <strong>👨‍👩‍👧:</strong> Todos os contatos são gerenciados pelos pais
          </p>
        </div>
      </div>
    </div>
  )
}
