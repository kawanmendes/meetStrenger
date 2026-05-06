# 🧪 GUIA COMPLETO DE TESTES END-TO-END

## 📋 Sumário

- ✅ [Teste Manual no Navegador](#teste-manual)
- ✅ [Teste Automático com Script](#teste-automático)
- ✅ [Teste Real da Aplicação](#teste-real)
- ✅ [Troubleshooting](#troubleshooting)

---

## 🌐 Teste Manual

### 1️⃣ Usar Teste Interativo no Navegador

**Abra em qualquer navegador:**
```
file:///c:/MeetStranger%20mobile(front)/meetStranger-mobile/tests/integration-test.html
```

Ou no terminal:
```bash
cd c:\MeetStranger\ mobile\(front\)\meetStranger-mobile
# Windows
start tests/integration-test.html

# macOS
open tests/integration-test.html

# Linux
xdg-open tests/integration-test.html
```

**O que testar:**
1. Clique em cada teste individualmente OU
2. Clique em "RUN ALL TESTS" para rodar tudo

**Esperado:**
```
✅ Health Check
✅ User Registration
✅ User Login
✅ Get Profile (JWT Auth)
✅ Get Queue Stats
✅ WebSocket Connection
✅ User Logout

Passed: 7/7 ✓
```

---

## 🚀 Teste Real da Aplicação

### 2️⃣ Rodar Frontend Localmente

```bash
cd c:\MeetStranger\ mobile\(front\)\meetStranger-mobile

# Instalar dependências (se necessário)
npm install

# Executar desenvolvimento web
npm start
# ou
expo start --web
```

**Vai abrir:**
```
http://localhost:19006  (Expo)
ou
http://localhost:3000   (se usar webpack)
```

### 3️⃣ Teste de Fluxo Completo

Siga esta sequência:

#### 🔐 **Step 1: Register**
```
URL: http://localhost:19006
1. Clique em "Criar conta"
2. Preencha:
   - Username: testuser_2026
   - Email: test2026@example.com
   - Password: test123456
3. Clique em "Registrar"
4. ✅ Esperado: Redirecionar para /home
```

#### 🔑 **Step 2: Login**
```
1. Se ainda logado, clique em "Sair" primeiro
2. Clique em "Entrar"
3. Preencha:
   - Email: test2026@example.com
   - Password: test123456
4. Clique em "Entrar"
5. ✅ Esperado: Redirecionar para /home, token salvo
```

#### 🎬 **Step 3: Select Category**
```
1. Após login, vá em /chat
2. Selecione categoria: "Movies"
3. Clique em "Procurar"
4. ✅ Esperado: 
   - Estado muda para "searching"
   - Vê posição na fila
```

#### 💬 **Step 4: Wait for Match**
```
1. Aguarde:
   - queue-status com posição
   - match-found com roomId
2. ✅ Esperado:
   - Entra automaticamente no chat
   - Vê nome do parceiro
```

#### 📨 **Step 5: Send Message**
```
1. Digite: "Olá, como vai?"
2. Clique em "Enviar"
3. ✅ Esperado:
   - Mensagem aparece na tela
   - Seu nome é "Você"
```

#### 🏃 **Step 6: Partner Leaves**
```
1. Em outra aba (outro usuário), clique "Sair"
2. ✅ Esperado na primeira aba:
   - "Partner left"
   - Opção de procurar novo match
```

#### 🚪 **Step 7: Logout**
```
1. Clique em "Sair" no app
2. ✅ Esperado:
   - Token removido
   - Volta para /auth/login
```

---

## 🔍 Debugging

### **Abra DevTools (F12)**

#### Verificar Console
```javascript
// 1. Checar URLs
fetch('https://meetstrenger-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log(d))

// 2. Checar se token está salvo (se usar AsyncStorage)
// Na app real, use:
import AsyncStorage from '@react-native-async-storage/async-storage';
const token = await AsyncStorage.getItem('authToken');
console.log('Token:', token);

// 3. Checar WebSocket no console
// Procure logs de websocket
```

#### Verificar Network Tab
```
1. Vá em Network → XHR/Fetch
2. Procure por:
   - POST /api/auth/register → Status 201
   - POST /api/auth/login → Status 200
   - GET /api/auth/profile → Status 200
   - GET /api/matching/stats → Status 200

3. Vá em Network → WS
4. Procure por:
   - wss://meetstrenger-backend.onrender.com/socket.io/
   - Status: 101 Switching Protocols
```

#### Verificar Headers
```
1. Clique em uma requisição autenticada
2. Procure em "Request Headers":
   Authorization: Bearer eyJhbGciOi...

3. Procure em "Response Headers":
   access-control-allow-origin: *
```

---

## 🐛 Troubleshooting

### ❌ Erro: "Network Error"

```
Sintoma: Fetch falha ao conectar
Causas Possíveis:
  1. Backend offline
  2. URL incorreta
  3. CORS bloqueado
  4. Internet desconectada

Solução:
  1. Cheque se https://meetstrenger-backend.onrender.com/api/health retorna 200
  2. Verifique config.ts tem URLs corretas
  3. Ver console do navegador para erro específico
```

### ❌ Erro: "Invalid token"

```
Sintoma: GET /api/auth/profile retorna 401
Causas:
  1. Token não foi salvo em AsyncStorage
  2. Token expirou (24h)
  3. Token foi alterado

Solução:
  1. Faça login novamente
  2. Verifique que token foi salvo:
     await AsyncStorage.getItem('authToken')
```

### ❌ Erro: "WebSocket connection failed"

```
Sintoma: wss://... falha ao conectar
Causas:
  1. Backend dormindo (Render free tier)
  2. Proxy ou firewall bloqueando WS
  3. Token inválido

Solução:
  1. Aguarde 30-40s (warm up)
  2. Tente reconectar
  3. Verifique se token é válido
  4. Ver console para erro: auth-error ou connect_error
```

### ❌ Erro: "find-match não funciona"

```
Sintoma: Clica em "Procurar", nada acontece
Causas:
  1. WebSocket não conectou
  2. Categoria inválida
  3. Evento não foi emitido

Debug:
  1. Abra DevTools → Network → WS
  2. Procure por frame: { "find-match", { "category": "movies" } }
  3. Se não vê, WebSocket não conectou
  4. Verifique: wsService.connected === true

Solução:
  1. Aguarde conexão WebSocket
  2. Use categoria válida: movies, gaming, music, study
  3. Recarregue a página
```

### ❌ Erro: "send-message não chega"

```
Sintoma: Envia mensagem, não aparece ou não chega ao parceiro
Causas:
  1. WebSocket desconectou
  2. currentRoomId inválido
  3. Payload incorreto

Debug:
  1. DevTools → Network → WS → procure frame send-message
  2. Payload esperado: { "text": "hello" }
  3. Se não vê frame, evento não foi emitido

Solução:
  1. Verifique que está em chat (currentRoomId != null)
  2. Verifique que websocket está conectado
  3. Tente novamente
```

### ⚠️ Render Free Tier Dormindo

```
Sintoma: Primeira requisição demora 30-40s
Solução: É normal! Render free tier hiberna a app
  1. Espere ou faça warm-up: curl https://meetstrenger-backend.onrender.com/api/health
  2. Próximas requisições serão rápidas
  3. Para produção, faça upgrade do Render
```

### ⚠️ CORS Error em Localhost

```
Sintoma: "Access-Control-Allow-Origin" error
Causa: Frontend em http://localhost:3000, backend em HTTPS

Solução:
  1. Backend tem CORS configurado
  2. Se erro persiste, verifique ALLOWED_ORIGINS no backend
  3. Adicione seu localhost se necessário
```

---

## ✅ Checklist Final

Antes de considerar "pronto":

```
API REST:
  ✅ POST /api/auth/register → 201 + token
  ✅ POST /api/auth/login → 200 + token
  ✅ GET /api/auth/profile → 200 + user (com Bearer token)
  ✅ POST /api/auth/logout → 200
  ✅ GET /api/matching/stats → 200 + stats
  ✅ GET /api/health → 200 + services

WebSocket:
  ✅ connect → 101 Switching Protocols
  ✅ authenticate { token } → authenticated
  ✅ find-match { category } → queue-status
  ✅ join-room { roomId } → room-joined
  ✅ send-message { text } → new-message
  ✅ leave-room → partner-left
  ✅ disconnect → partner-disconnected

Frontend:
  ✅ Login funciona
  ✅ Token salvo em AsyncStorage
  ✅ WebSocket conecta
  ✅ Matching funciona
  ✅ Chat funciona
  ✅ Typing indicators funcionam
  ✅ Desconexão tratada
```

---

## 🎉 Resultado

Se **todos os testes passarem**:

```
✅ Frontend está 100% integrado com backend
✅ Pronto para testes com usuários reais
✅ Pronto para deploy em produção
✅ API funciona corretamente
✅ WebSocket funciona em tempo real
```

**Parabéns! 🎊 Integração completa! 🚀**

---

## 📞 Suporte

Se algum teste falhar:
1. Verifique o troubleshooting acima
2. Cheque DevTools → Console e Network
3. Valide que backend está online
4. Tente de novo
