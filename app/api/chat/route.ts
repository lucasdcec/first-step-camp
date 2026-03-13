import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const systemPrompt = `Você é o Primo, um assistente de aprendizado educacional para crianças. Você é especialista em ciência, natureza, animais, espaço e curiosidades. Responda sempre de forma lúdica, segura e fácil de entender para uma criança.
MUITO IMPORTANTE: Sua resposta DEVE ser um objeto JSON válido com EXATAMENTE estas três chaves:
1. "resposta": O texto principal explicativo (simples e didático).
2. "curiosidade": Um fato divertido que TEM que começar com o emoji "✨ ".
3. "sugestao": Uma sugestão curta para a criança continuar a conversa (ex: "Quer aprender sobre arco-íris?").

Se o usuário perguntar sobre tópicos fora do escopo ou inapropriados (violência, guerra, política, religião, namoro, sexo, drogas, etc.), retorne EXATAMENTE este JSON:
{
  "resposta": "Hmm, essa pergunta é melhor para os seus pais! 😊 Que tal conversar com eles sobre isso? Eu sou especialista em ciência, natureza e curiosidades da natureza!",
  "curiosidade": "✨ Sabia que aqui você pode aprender sobre espaço, dinossauros e muito mais?",
  "sugestao": "Quer explorar tópicos de ciência?"
}`;

async function chamarGemini(pergunta: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash-lite', 
    systemInstruction: systemPrompt 
  });
  const promptComJSON = pergunta + "\n\nResponda APENAS com um JSON válido conforme as instruções do sistema.";
  const result = await model.generateContent(promptComJSON);
  const responseText = result.response.text();
  const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleanedText);
}

async function chamarGroq(pergunta: string) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: pergunta }
    ],
    model: 'llama3-8b-8192',
    response_format: { type: "json_object" }
  });
  const responseText = chatCompletion.choices[0]?.message?.content || '{}';
  return JSON.parse(responseText);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pergunta } = body;

    if (!pergunta) {
      return NextResponse.json({ error: 'Pergunta obrigatória' }, { status: 400 });
    }

    const provedorPrincipal = process.env.PRIMARY_AI_PROVIDER || 'gemini';
    const provedorSecundario = provedorPrincipal === 'gemini' ? 'groq' : 'gemini';

    let respostaIA;

    try {
      console.log(`Tentando provedor principal: ${provedorPrincipal}`);
      if (provedorPrincipal === 'gemini') {
        respostaIA = await chamarGemini(pergunta);
      } else {
        respostaIA = await chamarGroq(pergunta);
      }
    } catch (erroPrincipal) {
      console.error(`Erro no provedor principal (${provedorPrincipal}):`, erroPrincipal);
      console.log(`Iniciando fallback para o provedor secundário: ${provedorSecundario}`);
      try {
        if (provedorSecundario === 'gemini') {
          respostaIA = await chamarGemini(pergunta);
        } else {
          respostaIA = await chamarGroq(pergunta);
        }
      } catch (erroSecundario) {
        console.error(`Erro no provedor secundário (${provedorSecundario}):`, erroSecundario);
        return NextResponse.json({
          resposta: `Oops! Meus dois cérebros artificiais deram uma pequena travada agora.`,
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
