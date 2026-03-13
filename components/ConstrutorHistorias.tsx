'use client'

import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTema } from '@/contexts/ThemeContext'
import AvatarIA from './AvatarIA'

interface ConstrutorHistoriasProps {
  aoVoltar?: () => void
}

const PERSONAGENS = [
  { id: 'mago', icone: '🧙', label: 'Mago', cor: 'from-purple-400 to-purple-600' },
  { id: 'astronauta', icone: '🚀', label: 'Astronauta', cor: 'from-blue-400 to-blue-600' },
  { id: 'dinossauro', icone: '🦖', label: 'Dinossauro', cor: 'from-green-400 to-green-600' },
  { id: 'dragao', icone: '🐉', label: 'Dragão', cor: 'from-red-400 to-red-600' },
]

const LOCAIS = [
  { id: 'terra', icone: '🌍', label: 'Terra', cor: 'from-emerald-400 to-emerald-600' },
  { id: 'lua', icone: '🌙', label: 'Lua', cor: 'from-gray-400 to-gray-600' },
  { id: 'oceano', icone: '🌊', label: 'Oceano', cor: 'from-cyan-400 to-cyan-600' },
  { id: 'castelo', icone: '🏰', label: 'Castelo', cor: 'from-orange-400 to-orange-600' },
]

const TEMPLATES: Record<string, string> = {
  mago_terra: `Era uma vez um mago sábio que passeava por uma floresta encantada na Terra.\n\nCom um aceno de varinha, criaturas mágicas apareceram. O mago descobriu um livro antigo de feitiços escondido sob as raízes de uma carvalho.\n\nO que o mago fará a seguir?`,
  mago_lua: `Um mago curioso descobriu uma forma de viajar para a Lua.\n\nFlutua acima da superfície lunar e encontra cristais brilhantes com energia misteriosa.\n\nO mago percebe que esses cristais contêm o segredo do universo.`,
  astronauta_terra: `Um astronauta aventureiro retornou à Terra depois de explorar galáxias distantes.\n\nEle descobriu algo incrível - prova de alienígenas amigáveis!\n\nAgora ele deve encontrar o lugar perfeito para compartilhar essa descoberta incrível.`,
  astronauta_lua: `Um astronauta pousou na Lua e encontrou algo inesperado.\n\nDentro de uma caverna escondida, ele descobriu tecnologia antiga deixada por uma civilização anterior.\n\nQue mistérios ele irá descobrir?`,
  dinossauro_terra: `Um dinossauro amigável acordou em um mundo moderno na Terra.\n\nConfuso com carros e prédios, o dinossauro saiu em uma jornada para encontrar outros como ele.\n\nTodos ficaram amazados com essa criatura do passado!`,
  dinossauro_oceano: `Um dinossauro mergulhou no oceano profundo e descobriu ruínas submarinas.\n\nCivilizações antigas floresceram sob as ondas. O dinossauro se tornou o primeiro a revelar este mundo oculto.\n\nQue maravilhas aguardam nas profundezas?`,
  dragao_castelo: `Um jovem dragão reivindicou um castelo abandonado como sua casa.\n\nA cada dia, o dragão aprendia os segredos do castelo - passagens escondidas, câmaras de tesouro e feitiços mágicos.\n\nLogo, o castelo se tornou o lugar mais magnífico de toda a terra.`,
  dragao_lua: `Um dragão corajoso voou mais alto que qualquer dragão antes, alcançando a Lua.\n\nNa superfície lunar, o dragão descobriu dragões alienígenas vivendo em harmonia.\n\nEles se tornaram os primeiros de suas espécies a formar uma amizade entre mundos.`,
}

export default function ConstrutorHistorias({ aoVoltar }: ConstrutorHistoriasProps) {
  const { temaEscuro } = useTema()
  const [etapa, setEtapa] = useState<'personagem' | 'local' | 'historia'>('personagem')
  const [personagemSelecionado, setPersonagemSelecionado] = useState<string | null>(null)
  const [localSelecionado, setLocalSelecionado] = useState<string | null>(null)
  const [estaGerando, setEstaGerando] = useState(false)
  const [_historiasArmazenadas, _setHistoriasArmazenadas] = useLocalStorage<any[]>('primeiro-passo-historias', [])

  const aoSelecionarPersonagem = (id: string) => {
    setPersonagemSelecionado(id)
    setEtapa('local')
  }

  const aoSelecionarLocal = (id: string) => {
    setLocalSelecionado(id)
    setEstaGerando(true)
    setTimeout(() => {
      setEstaGerando(false)
      setEtapa('historia')
    }, 1500)
  }

  const obterHistoria = () => {
    if (!personagemSelecionado || !localSelecionado) return ''
    const chave = `${personagemSelecionado}_${localSelecionado}`
    return TEMPLATES[chave] || 'Era uma vez...'
  }

  const personagemAtual = PERSONAGENS.find(p => p.id === personagemSelecionado)
  const localAtual = LOCAIS.find(l => l.id === localSelecionado)

  if (etapa === 'historia' && !estaGerando) {
    return (
      <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex items-center justify-between p-4 border-b ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
          <button onClick={() => setEtapa('local')} className={`transition-colors ${temaEscuro ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-neutral-900'}`}>←</button>
          <h1 className={`font-semibold text-sm ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Sua História</h1>
          <div className="w-6" />
        </div>

        <div className={`flex-1 overflow-y-auto p-6 flex flex-col space-y-6 ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-center gap-4">
            <div className={`bg-gradient-to-br ${personagemAtual?.cor} text-white rounded-2xl p-3 flex items-center justify-center w-16 h-16`}>
              <span className="text-3xl">{personagemAtual?.icone}</span>
            </div>
            <span className={`text-2xl font-bold ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>+</span>
            <div className={`bg-gradient-to-br ${localAtual?.cor} text-white rounded-2xl p-3 flex items-center justify-center w-16 h-16`}>
              <span className="text-3xl">{localAtual?.icone}</span>
            </div>
          </div>

          <div className={`rounded-2xl p-6 border ${temaEscuro ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-neutral-900'}`}>
            <p className="leading-relaxed whitespace-pre-line text-sm">{obterHistoria()}</p>
          </div>

          <div className="space-y-2">
            <button onClick={() => { setPersonagemSelecionado(null); setLocalSelecionado(null); setEtapa('personagem') }} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition-colors">Criar Nova História</button>
            <button onClick={aoVoltar} className={`w-full font-semibold py-2 rounded-xl transition-colors ${temaEscuro ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-neutral-900'}`}>Início</button>
          </div>
        </div>
      </div>
    )
  }

  if (etapa === 'local' || estaGerando) {
    return (
      <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex items-center justify-between p-4 border-b ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
          {!estaGerando && <button onClick={() => setEtapa('personagem')} className={`transition-colors ${temaEscuro ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-neutral-900'}`}>←</button>}
          <h1 className={`font-semibold text-sm ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>{estaGerando ? 'Criando História...' : 'Onde a história acontece?'}</h1>
          <div className="w-6" />
        </div>

        <div className={`flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
          {estaGerando ? (
            <div className="space-y-4 text-center">
              <AvatarIA tamanho="grande" expressao="pensando" animado={true} />
              <p className={`text-sm font-medium ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Criando sua história...</p>
            </div>
          ) : (
            <div className="w-full max-w-md space-y-3">
              <div className="text-center mb-4">
                <p className={`text-sm ${temaEscuro ? 'text-gray-300' : 'text-gray-600'}`}>Seu herói: <span className="font-semibold">{personagemAtual?.label}</span></p>
              </div>
              {LOCAIS.map((local) => (
                <button key={local.id} onClick={() => aoSelecionarLocal(local.id)} className={`w-full text-left bg-gradient-to-br ${local.cor} hover:shadow-lg rounded-2xl p-4 transition-all active:scale-95`}>
                  <div className="flex items-center gap-3 text-white">
                    <span className="text-3xl">{local.icone}</span>
                    <div><h3 className="font-semibold">{local.label}</h3></div>
                    <span className="ml-auto text-xl">→</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`flex items-center justify-between p-4 border-b ${temaEscuro ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'}`}>
        <button onClick={aoVoltar} className={`transition-colors ${temaEscuro ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-neutral-900'}`}>←</button>
        <h1 className={`font-semibold text-sm ${temaEscuro ? 'text-white' : 'text-neutral-900'}`}>Criar uma História</h1>
        <div className="w-6" />
      </div>

      <div className={`flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center ${temaEscuro ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-4">
            <h2 className={`font-semibold ${temaEscuro ? 'text-white' : 'text-neutral-900'} text-sm`}>Escolha seu herói</h2>
          </div>
          {PERSONAGENS.map((personagem) => (
            <button key={personagem.id} onClick={() => aoSelecionarPersonagem(personagem.id)} className={`w-full text-left bg-gradient-to-br ${personagem.cor} hover:shadow-lg rounded-2xl p-4 transition-all active:scale-95`}>
              <div className="flex items-center gap-3 text-white">
                <span className="text-3xl">{personagem.icone}</span>
                <div><h3 className="font-semibold">{personagem.label}</h3></div>
                <span className="ml-auto text-xl">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
