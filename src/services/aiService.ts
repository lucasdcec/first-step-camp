export interface AIResponse {
  resposta: string;
  curiosidade?: string;
  sugestao?: string;
}

export const enviarPerguntaIA = async (pergunta: string, faixaEtaria: string): Promise<AIResponse> => {
  try {
    const res = await fetch('/api/chat.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta, faixaEtaria })
    });

    if (!res.ok) throw new Error('Erro na comunicação com o servidor');

    return await res.json();
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      resposta: 'Tive um probleminha de rede, amiguinho. Pode tentar de novo?',
      curiosidade: '✨ Você sabia que a internet viaja por cabos gigantes no fundo do mar?',
      sugestao: 'Quer tentar novamente?'
    };
  }
};
