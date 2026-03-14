<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Configurações (Substitua pelas suas chaves ou use um .env)
$GEMINI_API_KEY = getenv('GEMINI_API_KEY') ?: 'SUA_CHAVE_AQUI';
$GROQ_API_KEY = getenv('GROQ_API_KEY') ?: 'SUA_CHAVE_AQUI';
$PRIMARY_AI_PROVIDER = getenv('PRIMARY_AI_PROVIDER') ?: 'gemini';

$input = json_decode(file_get_contents('php://input'), true);
$pergunta = $input['pergunta'] ?? '';
$faixaEtaria = $input['faixaEtaria'] ?? 'nenhuma';

if (empty($pergunta)) {
    echo json_encode(['error' => 'Pergunta obrigatória']);
    exit;
}

function gerarSystemPrompt($faixaEtaria) {
    $instrucoes = [
        '7-9' => "O tom deve ser EXTREMAMENTE lúdico, usando analogias com brinquedos e contos de fadas. Use frases curtas e palavras muito simples.",
        '10-12' => "O tom deve ser mais desafiador e curioso, usando termos científicos (mas explicados) e analogias com tecnologia e mundo real. Pode usar frases um pouco mais complexas.",
        'nenhuma' => "Tom amigável e didático para crianças."
    ];
    
    $instrucao = $instrucoes[$faixaEtaria] ?? $instrucoes['nenhuma'];
    
    return "Você é o Primo, um assistente de aprendizado educacional para crianças. Você é especialista em ciência, natureza, animais, espaço e curiosidades. Responda sempre de forma lúdica, segura e fácil de entender.
    ESTILO DE RESPOSTA ATUAL: $instrucao

    MUTO IMPORTANTE: Sua resposta DEVE ser um objeto JSON válido com EXATAMENTE estas três chaves:
    1. \"resposta\": O texto principal explicativo.
    2. \"curiosidade\": Um fato divertido que TEM que começar com o emoji \"✨ \".
    3. \"sugestao\": Uma sugestão curta para a criança continuar a conversa.

    Se o usuário perguntar sobre tópicos fora do escopo ou inapropriados, retorne um JSON de desvio amigável.";
}

function chamarGemini($pergunta, $faixaEtaria, $apiKey) {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=$apiKey";
    
    $data = [
        "contents" => [
            ["parts" => [["text" => $pergunta . "\n\nResponda APENAS com um JSON válido conforme as instruções do sistema."]]]
        ],
        "systemInstruction" => [
            "parts" => [["text" => gerarSystemPrompt($faixaEtaria)]]
        ]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception("Erro Gemini: " . $response);
    }

    $result = json_decode($response, true);
    $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
    $text = preg_replace('/```json\s?/', '', $text);
    $text = preg_replace('/```/', '', $text);
    return json_decode(trim($text), true);
}

function chamarGroq($pergunta, $faixaEtaria, $apiKey) {
    $url = "https://api.groq.com/openai/v1/chat/completions";
    
    $data = [
        "model" => "llama-3.1-8b-instant",
        "messages" => [
            ["role" => "system", "content" => gerarSystemPrompt($faixaEtaria)],
            ["role" => "user", "content" => $pergunta]
        ],
        "response_format" => ["type" => "json_object"]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception("Erro Groq: " . $response);
    }

    $result = json_decode($response, true);
    return json_decode($result['choices'][0]['message']['content'], true);
}

try {
    if ($PRIMARY_AI_PROVIDER === 'gemini') {
        try {
            echo json_encode(chamarGemini($pergunta, $faixaEtaria, $GEMINI_API_KEY));
        } catch (Exception $e) {
            echo json_encode(chamarGroq($pergunta, $faixaEtaria, $GROQ_API_KEY));
        }
    } else {
        try {
            echo json_encode(chamarGroq($pergunta, $faixaEtaria, $GROQ_API_KEY));
        } catch (Exception $e) {
            echo json_encode(chamarGemini($pergunta, $faixaEtaria, $GEMINI_API_KEY));
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'resposta' => 'Nossa, meu cérebro de computador deu uma travada total! Que tal tentar perguntar de novo?',
        'curiosidade' => '✨ Até os computadores precisam de um tempinho para pensar às vezes.',
        'sugestao' => 'Tentar perguntar novamente?'
    ]);
}
