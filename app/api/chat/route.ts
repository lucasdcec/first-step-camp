import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import Groq from 'groq-sdk'

const SYSTEM_PROMPT = `Você é o "Primeiro Passo", um assistente de aprendizado amigável para crianças de 7 a 12 anos. Responda sempre em português do Brasil.
Regras:
- Use linguagem simples, clara e divertida.
- Respostas curtas (2 a 4 frases), fáceis de entender.
- Quando fizer sentido, inclua uma curiosidade extra (ex: "Você sabia? ...") e uma sugestão de pergunta relacionada (ex: "Quer aprender sobre...?").
Responda no formato JSON com exatamente estes campos (sem markdown, só JSON válido):
{"resposta":"sua resposta principal","curiosidade":"Você sabia? ... (opcional)","sugestao":"Quer aprender sobre...? (opcional)"}
Se não houver curiosidade ou sugestão, use string vazia "".`

type ChatBody = {
  pergunta: string
  historico?: { tipo: 'usuario' | 'ia'; texto: string }[]
}

function parseRespostaIA(texto: string): { resposta: string; curiosidade?: string; sugestao?: string } {
  const trimmed = texto.trim()
  let jsonStr = trimmed
  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) jsonStr = jsonMatch[1].trim()
  try {
    const obj = JSON.parse(jsonStr) as Record<string, string>
    return {
      resposta: obj.resposta || trimmed,
      curiosidade: obj.curiosidade || undefined,
      sugestao: obj.sugestao || undefined,
    }
  } catch {
    return { resposta: trimmed }
  }
}

async function chamarGemini(pergunta: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY não configurada')
  const ai = new GoogleGenAI({ apiKey })
  const res = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    contents: pergunta,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      maxOutputTokens: 512,
    },
  })
  const text = typeof (res as { text?: string }).text === 'string' ? (res as { text: string }).text : ''
  if (!text) throw new Error('Resposta vazia do Gemini')
  return text
}

async function chamarGroq(pergunta: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY não configurada')
  const groq = new Groq({ apiKey })
  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: pergunta },
    ],
    temperature: 0.7,
    max_tokens: 512,
  })
  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error('Resposta vazia do Groq')
  return content
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatBody
    const { pergunta } = body
    if (!pergunta || typeof pergunta !== 'string') {
      return NextResponse.json(
        { erro: 'Campo "pergunta" é obrigatório' },
        { status: 400 }
      )
    }

    const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase()
    let texto: string

    if (provider === 'groq') {
      texto = await chamarGroq(pergunta)
    } else {
      texto = await chamarGemini(pergunta)
    }

    const parsed = parseRespostaIA(texto)
    return NextResponse.json(parsed)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao chamar IA'
    console.error('[api/chat]', message, err)
    return NextResponse.json(
      { erro: message },
      { status: 500 }
    )
  }
}
