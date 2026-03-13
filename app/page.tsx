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

type Tela = 'selecao' | 'boot' | 'inicio' | 'pergunte' | 'explore' | 'quiz' | 'historias' | 'telefone' | 'missoes' | 'pais'

const CURIOSIDADES_DIARIAS = [
  { pergunta: 'Por que as baleias cantam?', icone: '🐋' },
  { pergunta: 'Como as borboletas sentem o gosto?', icone: '🦋' },
  { pergunta: 'Por que sonhamos?', icone: '💭' },
  { pergunta: 'Como as flores sabem quando desabrochar?', icone: '🌸' },
  { pergunta: 'Por que a água é molhada?', icone: '💧' },
]

export default function Inicio() {
  const { perfil, sair } = usePerfil()
  const [tela, setTela] = useState<Tela>('selecao')
  const [emTransicao, setEmTransicao] = useState(false)
  const [curiosidadeDiaria] = useState(
    CURIOSIDADES_DIARIAS[Math.floor(Math.random() * CURIOSIDADES_DIARIAS.length)]
  )

  // Reagir a mudança de perfil
  useEffect(() => {
    if (perfil === 'explorador') {
      setTela('boot')
    } else if (perfil === 'pais') {
      setTela('pais')
    } else {
      setTela('selecao')
    }
  }, [perfil])

  // Boot para exploradores
  useEffect(() => {
    if (tela === 'boot') {
      const timer = setTimeout(() => setTela('inicio'), 2500)
      return () => clearTimeout(timer)
    }
  }, [tela])

  const mudarTela = (novaTela: Tela) => {
    setEmTransicao(true)
    setTimeout(() => {
      setTela(novaTela)
      setEmTransicao(false)
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
          <div className="space-y-4 text-center animate-pulse">
            <div className="text-6xl">🚀</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Primeiro Passo</h1>
              <p className="text-sm text-purple-300 mt-2">Preparando sua aventura...</p>
            </div>
            <div className="flex gap-1 justify-center mt-4">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tela inicial */}
      {tela === 'inicio' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <LancadorApps
            aoSelecionarApp={(app) => mudarTela(app as Tela)}
            curiosidadeDiaria={curiosidadeDiaria}
            aoSair={sair}
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
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <PainelPais aoVoltar={sair} />
        </div>
      )}
    </FrameDispositivo>
  )
}
