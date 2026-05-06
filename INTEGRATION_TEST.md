# 🧪 Teste de Integração Frontend ↔ Backend

## 📋 Checklist de Teste

### ✅ 1️⃣ TESTE DE AUTENTICAÇÃO

**Objetivo:** Validar que login funciona e token é salvo

```bash
# No terminal, rodar:
npm start
# ou
expo start --web
```

**Passos:**
1. Acesse a aplicação no navegador/iOS/Android
2. Clique em "Entrar"
3. Use credenciais:
   - Email: `test@example.com`
   - Senha: `test123`
4. **Esperado:** Redirecionado para `/home`
5. **Se falhar:** Ver console para erros

**Debug:**
```javascript
// No console do dev tools:
// Verificar se token foi salvo
await AsyncStorage.getItem('authToken')
```

---

### ✅ 2️⃣ TESTE DE WEBSOCKET

**Objetivo:** Validar que WebSocket conecta e autentica

**Passos:**
1. Após fazer login, abra DevTools (F12)
2. Vá em "Network" → "WS"
3. Procure por conexão `wss://meetstrenger-backend.onrender.com/socket.io/...`
4. **Esperado:** Status 101 Switching Protocols
5. Procure por mensagem "authenticated" nos frames

**Se não conectar:**
- Verifique se o backend está rodando: https://meetstrenger-backend.onrender.com/api/health
- Procure por erro `auth-error` nos WebSocket frames

---

### ✅ 3️⃣ TESTE DE FILA (QUEUE)

**Objetivo:** Validar que find-match funciona

**Passos:**
1. Na tela de chat, selecione categoria "Movies"
2. Clique em "Procurar"
3. Abra DevTools → Network → WS
4. **Esperado:** Ver eventos:
   - `find-match` → servidor
   - `queue-status` ← servidor (posição e tempo estimado)

**Resposta esperada:**
```json
{
  "position": 1,
  "estimatedWait": "45s",
  "category": "movies"
}
```

---

### ✅ 4️⃣ TESTE DE MATCHING

**Objetivo:** Validar que dois usuários conseguem matchear

**Cenário (difícil testar sozinho):**
1. Abra 2 abas da aplicação
2. Faça login em ambas com usuários diferentes
3. Ambos cliquem "Procurar" na mesma categoria
4. **Esperado:** Ambas recebem `match-found` com `roomId`

**Resposta esperada:**
```json
{
  "roomId": "uuid-aqui",
  "category": "movies",
  "partner": { "username": "outro-usuario" }
}
```

---

### ✅ 5️⃣ TESTE DE CHAT

**Objetivo:** Validar envio/recebimento de mensagens

**Passos:**
1. Após matchear, abra o chat
2. Digite "Olá" e envie
3. **Esperado:** Mensagem aparece na tela
4. Ver em DevTools → WS:
   - `send-message` → servidor
   - `new-message` ← servidor (de outro usuário, se houver)

**Evento esperado (recebido):**
```json
{
  "id": "uuid",
  "text": "Olá",
  "senderId": "user-id",
  "username": "usuario",
  "timestamp": "2026-05-06T10:00:00Z"
}
```

---

## 🐛 DEBUG OBRIGATÓRIO

### ❌ Erro: "Network Error"

```
Causa: BASE_URL incorreta ou backend offline
Solução:
1. Verifique config.ts: BASE_URL correto?
2. Teste: curl https://meetstrenger-backend.onrender.com/api/health
3. Se falhar, backend está offline (Render free tier?)
```

### ❌ Erro: "Invalid credentials"

```
Causa: Email/senha errado OU banco vazio
Solução:
1. Registre novo usuário em /auth/register
2. Guarde credenciais
3. Faça login com essas credenciais
```

### ❌ Erro: "WebSocket connection failed"

```
Causa: CORS, token inválido ou WebSocket não suportado
Solução:
1. Verifique se token foi salvo corretamente
2. Verifique se backend está rodando
3. Cheque console para erro específico
4. Se "auth-error": token expirou ou inválido
```

### ❌ Erro: "find-match não envia queue-status"

```
Causa: Evento wrong em kebab-case ou fila já tem match
Solução:
1. Verifique websocket.ts: findMatch envia 'find-match'
2. Verifique useChat.tsx: chama wsService.findMatch(category)
3. Limpe console e tente novamente
```

### ❌ Erro: "send-message não chega"

```
Causa: Payload incorreto ou currentRoomId vazio
Solução:
1. Verifique que está em chat (currentRoomId != null)
2. Verifique websocket.ts: envia apenas { text }
3. Backend quer: { text: "mensagem" }
```

---

## 📊 Validação de Produção

### Teste em Render Cold Start

```
1. Esperar 15+ minutos sem usar
2. Fazer requisição
3. Esperado: Demora 30-40s (OK para primeira vez)
4. Após warm up: Retorna rápido
```

### Teste de Reconnect

```
1. Desconecte o WiFi
2. Reconecte
3. Esperado: WebSocket reconecta automaticamente
4. Chat continua funcionando
```

---

## ✅ Quando Passar em Todos os Testes

Você pode considerar integração completa quando:

- ✅ Login funciona
- ✅ Token salvo em AsyncStorage
- ✅ WebSocket conecta e autentica
- ✅ find-match envia evento corretamente
- ✅ Recebe queue-status e match-found
- ✅ Chat envia e recebe mensagens
- ✅ Typing indicators funcionam
- ✅ Desconexão é tratada corretamente
