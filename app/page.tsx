'use client'

import { useState, useEffect } from 'react'
import { usePerfil } from '@/contexts/PerfilContext'
import FrameDispositivo from '@/components/FrameDispositivo'
import TelaSelecaoPerfil from '@/components/TelaSelecaoPerfil'
import LancadorApps from '@/components/LancadorApps'
import InterfaceChat from '@/components/InterfaceChat'
import ExplorarTopicos from '@/components/ExplorarTopicos'
import JogoQuiz from '@/components/JogoQuiz'
import ConstrutorHistorias from '@/components/ConstrutorHistorias'
import TelefoneSeguro from '@/components/TelefoneSeguro'
import MissoesNatureza from '@/components/MissoesNatureza'
import PainelPais from '@/components/PainelPais'
import VozInterface from '../components/VozInterface'

type Tela = 'selecao' | 'boot' | 'boot-pais' | 'inicio' | 'pergunte' | 'explore' | 'quiz' | 'historias' | 'telefone' | 'missoes' | 'pais' | 'voz'

const CURIOSIDADES_DIARIAS = [
  { pergunta: 'Por que as baleias cantam?', icone: '🐋' },
  { pergunta: 'Como as borboletas sentem o gosto?', icone: '🦋' },
  { pergunta: 'Por que sonhamos?', icone: '💭' },
  { pergunta: 'Como as flores sabem quando desabrochar?', icone: '🌸' },
  { pergunta: 'Por que a água é molhada?', icone: '💧' },
]

const BOOT_MSGS = [
  'Carregando quizzes...',
  'Conectando com a IA...',
  'Preparando missões...',
  'Pronto para explorar! 🚀',
]

export default function Inicio() {
  const { perfil, sair } = usePerfil()
  const [tela, setTela] = useState<Tela>('selecao')
  const [emTransicao, setEmTransicao] = useState(false)
  const [saindo, setSaindo] = useState(false)
  const [voltando, setVoltando] = useState(false)
  const [bootMsgIdx, setBootMsgIdx] = useState(0)
  const [bootMsgVisivel, setBootMsgVisivel] = useState(true)
  const [curiosidadeDiaria] = useState(
    CURIOSIDADES_DIARIAS[Math.floor(Math.random() * CURIOSIDADES_DIARIAS.length)]
  )

  const handleSair = () => {
    setSaindo(true)
    setTimeout(() => {
      sair()
      setSaindo(false)
    }, 300)
  }

  // Reagir a mudança de perfil
  useEffect(() => {
    if (perfil === 'explorador') {
      setBootMsgIdx(0)
      setTela('boot')
    } else if (perfil === 'pais') {
      setTela('boot-pais')
    } else {
      setTela('selecao')
    }
  }, [perfil])

  // Boot para exploradores — mensagens progressivas com fade suave
  useEffect(() => {
    if (tela !== 'boot') return
    let idx = 0
    const avancar = () => {
      if (idx >= BOOT_MSGS.length - 1) return
      setBootMsgVisivel(false)
      setTimeout(() => {
        idx += 1
        setBootMsgIdx(idx)
        setBootMsgVisivel(true)
      }, 180)
    }
    const intervalo = setInterval(avancar, 650)
    const timer = setTimeout(() => {
      clearInterval(intervalo)
      setTela('inicio')
    }, 2800)
    return () => {
      clearTimeout(timer)
      clearInterval(intervalo)
    }
  }, [tela])

  // Boot para pais
  useEffect(() => {
    if (tela === 'boot-pais') {
      const timer = setTimeout(() => setTela('pais'), 1800)
      return () => clearTimeout(timer)
    }
  }, [tela])

  const mudarTela = (novaTela: Tela) => {
    const voltandoParaInicio = novaTela === 'inicio'
    setEmTransicao(true)
    setTimeout(() => {
      setTela(novaTela)
      setEmTransicao(false)
      if (voltandoParaInicio) {
        setVoltando(true)
        setTimeout(() => setVoltando(false), 300)
      }
    }, 200)
  }

  const aoApertarBotaoDispositivo = () => {
    if (perfil === 'pais') return // no modo pais o botão não faz nada
    if (tela !== 'inicio' && tela !== 'boot' && tela !== 'selecao') {
      mudarTela('inicio')
    }
  }

  return (
    <FrameDispositivo aoApertarBotao={aoApertarBotaoDispositivo}>
      {/* Tela de seleção de perfil */}
      {tela === 'selecao' && <TelaSelecaoPerfil />}

      {/* Boot do explorador */}
      {tela === 'boot' && (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-950">
          <div className="space-y-4 text-center">
            <div className="text-6xl animate-pulse">🚀</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Primeiro Passo</h1>
              <p className={`text-sm text-purple-300 mt-2 transition-opacity duration-150 ${bootMsgVisivel ? 'opacity-100' : 'opacity-0'}`}>
                {BOOT_MSGS[bootMsgIdx]}
              </p>
            </div>
            <div className="flex gap-1 justify-center mt-4">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Boot do painel dos pais */}
      {tela === 'boot-pais' && (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900">
          <div className="flex flex-col items-center gap-5 text-center">

            {/* Ícone com anel pulsante */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
                <span className="text-4xl">🔓</span>
              </div>
            </div>

            <div>
              <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase mb-1">Acesso autorizado</p>
              <h1 className="text-white font-bold text-xl">Painel dos Pais</h1>
            </div>

            {/* Barra de progresso */}
            <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full animate-[progress_1.6s_ease-out_forwards]" />
            </div>

          </div>
        </div>
      )}

      {/* Tela inicial */}
      {tela === 'inicio' && (
        <div className={`h-full transition-all duration-300 ${
          emTransicao ? 'opacity-0' :
          saindo ? 'opacity-0 scale-[0.97]' :
          voltando ? 'animate-slide-in-left' :
          'opacity-100 scale-100'
        }`}>
          <LancadorApps
            aoSelecionarApp={(app) => mudarTela(app as Tela)}
            curiosidadeDiaria={curiosidadeDiaria}
            aoSair={handleSair}
          />
        </div>
      )}

      {/* Chat */}
      {tela === 'pergunte' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <InterfaceChat aoExplorar={() => mudarTela('explore')} aoVoltar={() => mudarTela('inicio')} />
        </div>
      )}

      {/* Explore */}
      {tela === 'explore' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <ExplorarTopicos
            aoSelecionarPergunta={() => mudarTela('pergunte')}
            aoVoltar={() => mudarTela('inicio')}
          />
        </div>
      )}

      {/* Quiz */}
      {tela === 'quiz' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <JogoQuiz aoVoltar={() => mudarTela('inicio')} />
        </div>
      )}

      {/* Histórias */}
      {tela === 'historias' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <ConstrutorHistorias aoVoltar={() => mudarTela('inicio')} />
        </div>
      )}

      {/* Telefone */}
      {tela === 'telefone' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <TelefoneSeguro aoVoltar={() => mudarTela('inicio')} />
        </div>
      )}

      {/* Missões */}
      {tela === 'missoes' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <MissoesNatureza aoVoltar={() => mudarTela('inicio')} />
        </div>
      )}

      {/* Painel dos Pais */}
      {tela === 'pais' && (
        <div className={`h-full transition-all duration-300 ${emTransicao ? 'opacity-0' : saindo ? 'opacity-0 scale-[0.97]' : 'opacity-100 scale-100'}`}>
          <PainelPais aoVoltar={handleSair} />
        </div>
      )}

      {/* Modo Voz */}
      {tela === 'voz' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <VozInterface aoVoltar={() => mudarTela('inicio')} />
        </div>
      )}
    </FrameDispositivo>
  )
}
