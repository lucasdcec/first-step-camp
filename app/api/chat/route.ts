import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

function gerarSystemPrompt(faixaEtaria: string = 'nenhuma') {
  const instrucoesAdicionais = {
    '7-9': "O tom deve ser EXTREMAMENTE lúdico, usando analogias com brinquedos e contos de fadas. Use frases curtas e palavras muito simples.",
    '10-12': "O tom deve ser mais desafiador e curioso, usando termos científicos (mas explicados) e analogias com tecnologia e mundo real. Pode usar frases um pouco mais complexas.",
    'nenhuma': "Tom amigável e didático para crianças."
  }[faixaEtaria] || "Tom amigável e didático para crianças.";

  return `Você é o Primo, um assistente de aprendizado educacional para crianças. Você é especialista em ciência, natureza, animais, espaço e curiosidades. Responda sempre de forma lúdica, segura e fácil de entender.
  ESTILO DE RESPOSTA ATUAL: ${instrucoesAdicionais}

  MUTO IMPORTANTE: Sua resposta DEVE ser um objeto JSON válido com EXATAMENTE estas três chaves:
  1. "resposta": O texto principal explicativo.
  2. "curiosidade": Um fato divertido que TEM que começar com o emoji "✨ ".
  3. "sugestao": Uma sugestão curta para a criança continuar a conversa.

  Se o usuário perguntar sobre tópicos fora do escopo ou inapropriados, retorne um JSON de desvio amigável.`;
}

async function chamarGemini(pergunta: string, faixaEtaria: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash-lite', 
    systemInstruction: gerarSystemPrompt(faixaEtaria) 
  });
  const promptComJSON = pergunta + "\n\nResponda APENAS com um JSON válido conforme as instruções do sistema.";
  const result = await model.generateContent(promptComJSON);
  const responseText = result.response.text();
  const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleanedText);
}

async function chamarGroq(pergunta: string, faixaEtaria: string) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: gerarSystemPrompt(faixaEtaria) },
      { role: 'user', content: pergunta }
    ],
    model: 'llama-3.1-8b-instant',
    response_format: { type: "json_object" }
  });
  const responseText = chatCompletion.choices[0]?.message?.content || '{}';
  console.log('Resposta Groq:', responseText);
  return JSON.parse(responseText);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pergunta, faixaEtaria } = body;

    if (!pergunta) {
      return NextResponse.json({ error: 'Pergunta obrigatória' }, { status: 400 });
    }

    const provedorPrincipal = process.env.PRIMARY_AI_PROVIDER || 'gemini';
    const provedorSecundario = provedorPrincipal === 'gemini' ? 'groq' : 'gemini';

    let respostaIA;

    try {
      console.log(`Tentando provedor principal: ${provedorPrincipal} para faixa: ${faixaEtaria}`);
      if (provedorPrincipal === 'gemini') {
        respostaIA = await chamarGemini(pergunta, faixaEtaria);
      } else {
        respostaIA = await chamarGroq(pergunta, faixaEtaria);
      }
    } catch (erroPrincipal) {
      console.error(`Erro no provedor principal (${provedorPrincipal}):`, erroPrincipal);
      console.log(`Iniciando fallback para o provedor secundário: ${provedorSecundario}`);
      try {
        if (provedorSecundario === 'gemini') {
          respostaIA = await chamarGemini(pergunta, faixaEtaria);
        } else {
          respostaIA = await chamarGroq(pergunta, faixaEtaria);
        }
      } catch (erroSecundario) {
        console.error(`Erro no provedor secundário (${provedorSecundario}):`, JSON.stringify(erroSecundario, null, 2) || erroSecundario);
        return NextResponse.json({
          resposta: `Oops! Meus dois cérebros artificiais (Principal e Fallback) deram uma pequena travada agora.`,
          curiosidade: '✨ Você sabia que a internet viaja por cabos gigantes no fundo do mar?',
          sugestao: 'Quer tentar novamente?'
        });
      }
    }

    return NextResponse.json(respostaIA);

  } catch (error) {
    console.error('Erro geral na API de Chat:', error);
    return NextResponse.json({
      resposta: 'Nossa, meu cérebro de computador deu uma travada total! Que tal tentar perguntar de novo?',
      curiosidade: '✨ Até os computadores precisam de um tempinho para pensar às vezes.',
      sugestao: 'Tentar perguntar novamente?'
    }, { status: 500 });
  }
}
