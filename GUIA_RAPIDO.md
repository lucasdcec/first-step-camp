# ⚡ Guia Rápido - Primeiro Passo v2.0

## 3 Passos para Começar

### 1️⃣ Instalar
```bash
npm install
```

### 2️⃣ Rodar
```bash
npm run dev
```

### 3️⃣ Acessar
```
http://localhost:3000
```

### 4️⃣ (Opcional) Ativar IA real no Chat
O chat usa **Gemini** (Google) ou **Groq** para respostas. Sem chaves, o app usa respostas fixas (fallback).

1. Copie o exemplo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
2. Edite `.env` e preencha **um** dos provedores:
   - **Gemini:** Obtenha chave em [Google AI Studio](https://aistudio.google.com/apikey) e defina `GEMINI_API_KEY=...`
   - **Groq:** Obtenha chave em [Groq Console](https://console.groq.com/keys) e defina `GROQ_API_KEY=...`
3. Escolha o provedor: `AI_PROVIDER=gemini` ou `AI_PROVIDER=groq`
4. Reinicie o servidor (`npm run dev`). O app "Pergunte" passará a usar a IA configurada.

---

## 🎮 Testando Cada Funcionalidade

### localStorage ✅
```
DevTools (F12) → Application → LocalStorage
Procure por: primeiro-passo-*
Feche a aba, reabra, os dados persistem ✅
```

### Dark Mode 🌙
```
Clique em ☀️/🌙 no header
Feche a aba, reabra, tema persistido ✅
```

### Chat 🧠
```
App "Pergunte" → Faça uma pergunta
DevTools → localStorage
Veja: primeiro-passo-chat
Histórico salvo ✅
```

### Telefone 📞
```
App "Telefonar" → Selecione contato
Envie uma mensagem
Volte e reabra
Mensagens ainda aparecem ✅
```

### Quiz 🎮
```
App "Quiz" → Responda pergunta
Veja seu score persistir
Feche e reabra - score mantém ✅
```

---

## 🐛 Se Algo Não Funcionar

```bash
# Limpeza completa
rm -rf node_modules package-lock.json
npm install
npm run dev
```

```bash
# Verificar TypeScript
npm run type-check
```

---

## 📁 Estrutura Importante

```
Componentes para Traduzir (copie do projeto original):
- LancadorApps.tsx
- InterfaceChat.tsx
- ExplorarTopicos.tsx
- JogoQuiz.tsx
- ConstrutorHistorias.tsx
- MissoesNatureza.tsx
- PainelPais.tsx
```

Todos os componentes já vêm com:
- ✅ Nomes em português
- ✅ localStorage integrado
- ✅ Dark mode suportado
- ✅ Tipos TypeScript

---

## ✨ Principais Melhorias

| Item | Antes | Depois |
|------|-------|--------|
| localStorage | ❌ Bugado | ✅ Funcional |
| Português | ❌ Nenhum | ✅ 100% |
| Dark Mode | ❌ Não funciona | ✅ Perfeito |
| Telefone | ⚠️ Básico | ✅ Profissional |
| Versões | ❓ Indefinidas | ✅ Modernas |

---

## 🔧 Comandos Úteis

```bash
npm run dev        # Desenvolver (hot reload)
npm run build      # Fazer build
npm run start      # Rodar em produção
npm run lint       # Verificar código
npm run type-check # Verificar tipos TypeScript
```

---

## 💡 Dicas

1. **localStorage não aparece?**
   - Aguarde 1-2 segundos após interagir
   - Refresh (F5) e tente de novo

2. **Dark mode não muda?**
   - Abra console: `document.documentElement.classList`
   - Deve mostrar 'dark'

3. **Erro de importação?**
   - Verifique se o caminho começa com `@/`
   - Exemplo: `@/components/MeuComponente`

---

## 🎯 Próximo Passo

Leia o `README.md` completo para:
- Documentação detalhada
- Estrutura de dados
- Hooks customizados
- Solução de problemas
- Próximas melhorias opcionais

---

## ✅ Checklist

- [ ] `npm install` funcionou
- [ ] `npm run dev` está rodando
- [ ] Página abriu em localhost:3000
- [ ] localStorage aparece no DevTools
- [ ] Dark mode funciona
- [ ] Telefone salva mensagens
- [ ] Todos os apps aparecem

Se tudo marcado ✅ - Parabéns! Projeto pronto! 🚀

---

**Pronto para explorar?** Vá para `http://localhost:3000` 🎉
