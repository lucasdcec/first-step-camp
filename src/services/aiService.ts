export interface AIResponse {
  resposta: string;
  curiosidade?: string;
  sugestao?: string;
}

export const enviarPerguntaIA = async (pergunta: string, faixaEtaria: string): Promise<AIResponse> => {
  try {
    const url = 'api/chat.php';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta, faixaEtaria })
    });

    if (!res.ok) {
      console.error(`HTTP Error: ${res.status} em ${url}`);
      throw new Error('Erro na comunicação com o servidor');
    }

    const data = await res.json();
    console.log('IA Response:', data);
    return data;
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      resposta: 'Tive um probleminha de rede ao tentar falar com meu cérebro (API). Verifique se o arquivo api/chat.php existe no servidor.',
      curiosidade: '✨ Erros de rede podem acontecer se o servidor PHP estiver desligado ou o arquivo sumir.',
      sugestao: 'Quer tentar novamente?'
    };
  }
};
