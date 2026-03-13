'use client'

import { useState, useEffect } from 'react'
import FrameDispositivo from '@/components/FrameDispositivo'
import LancadorApps from '@/components/LancadorApps'
import InterfaceChat from '@/components/InterfaceChat'
import ExplorarTopicos from '@/components/ExplorarTopicos'
import JogoQuiz from '@/components/JogoQuiz'
import ConstrutorHistorias from '@/components/ConstrutorHistorias'
import TelefoneSeguro from '@/components/TelefoneSeguro'
import MissoesNatureza from '@/components/MissoesNatureza'
import PainelPais from '@/components/PainelPais'

type Tela = 'boot' | 'inicio' | 'pergunte' | 'explore' | 'quiz' | 'historias' | 'telefone' | 'missoes' | 'pais'

const CURIOSIDADES_DIARIAS = [
  { pergunta: 'Por que as baleias cantam?', icone: '🐋' },
  { pergunta: 'Como as borboletas sentem o gosto?', icone: '🦋' },
  { pergunta: 'Por que sonhamos?', icone: '💭' },
  { pergunta: 'Como as flores sabem quando desabrochar?', icone: '🌸' },
  { pergunta: 'Por que a água é molhada?', icone: '💧' },
]

export default function Inicio() {
  const [tela, setTela] = useState<Tela>('boot')
  const [emTransicao, setEmTransicao] = useState(false)
  const [contagemBotao, setContagemBotao] = useState(0)
  const [curiosidadeDiaria] = useState(
    CURIOSIDADES_DIARIAS[Math.floor(Math.random() * CURIOSIDADES_DIARIAS.length)]
  )

  // Sequência de inicialização
  useEffect(() => {
    if (tela === 'boot') {
      const timer = setTimeout(() => {
        setTela('inicio')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [tela])

  const mudarTela = (novaTela: Tela) => {
    setEmTransicao(true)
    setContagemBotao(0)
    setTimeout(() => {
      setTela(novaTela)
      setEmTransicao(false)
    }, 200)
  }

  const aoApertarBotaoDispositivo = () => {
    // Voltar para inicio de qualquer app
    if (tela !== 'inicio' && tela !== 'boot') {
      mudarTela('inicio')
    } else if (tela === 'inicio') {
      // Contar cliques para abrir painel dos pais (easter egg)
      setContagemBotao(prev => {
        const novo = prev + 1
        if (novo >= 3) {
          mudarTela('pais')
          return 0
        }
        return novo
      })
      // Resetar contador após 2 segundos
      setTimeout(() => setContagemBotao(0), 2000)
    }
  }

  return (
    <FrameDispositivo aoApertarBotao={aoApertarBotaoDispositivo}>
      {/* Tela de inicialização */}
      {tela === 'boot' && (
        <div className="flex flex-col items-center justify-center h-full bg-black dark:bg-black">
          <div className="space-y-4 text-center animate-fade-in">
            <div className="text-5xl">🎓</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Primeiro Passo</h1>
              <p className="text-sm text-gray-400 mt-2">Assistente de Aprendizado IA</p>
            </div>
          </div>
        </div>
      )}

      {/* Tela inicial - Lançador de apps */}
      {tela === 'inicio' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <LancadorApps
            aoSelecionarApp={(app) => mudarTela(app as Tela)}
            curiosidadeDiaria={curiosidadeDiaria}
          />
        </div>
      )}

      {/* Tela de Pergunte (Chat) */}
      {tela === 'pergunte' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <InterfaceChat aoExplorar={() => mudarTela('explore')} />
        </div>
      )}

      {/* Tela de Explore */}
      {tela === 'explore' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <ExplorarTopicos
            aoSelecionarPergunta={(pergunta) => mudarTela('pergunte')}
            aoVoltar={() => mudarTela('inicio')}
          />
        </div>
      )}

      {/* Tela de Quiz */}
      {tela === 'quiz' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <JogoQuiz aoVoltar={() => mudarTela('inicio')} />
        </div>
      )}

      {/* Tela de Histórias */}
      {tela === 'historias' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <ConstrutorHistorias aoVoltar={() => mudarTela('inicio')} />
        </div>
      )}

      {/* Tela de Telefone */}
      {tela === 'telefone' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <TelefoneSeguro aoVoltar={() => mudarTela('inicio')} />
        </div>
      )}

      {/* Tela de Missões */}
      {tela === 'missoes' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <MissoesNatureza aoVoltar={() => mudarTela('inicio')} />
        </div>
      )}

      {/* Painel dos Pais (Easter egg) */}
      {tela === 'pais' && (
        <div className={`h-full ${emTransicao ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          <PainelPais aoVoltar={() => mudarTela('inicio')} />
        </div>
      )}
    </FrameDispositivo>
  )
}
