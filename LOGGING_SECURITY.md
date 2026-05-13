# 🔒 Sistema de Logging Seguro - MeetStranger

## 📋 Visão Geral

Sistema de logging que **sanitiza automaticamente dados sensíveis em produção** enquanto mantém logs completos em desenvolvimento.

## 🎯 Problema Resolvido

### Antes (Inseguro):
```typescript
console.log('[CHAT] New message:', {
  id: '27f47638-d754-4e0c-90b6-9007a6b1a1e2',
  text: 'mensagem privada',
  senderId: 15,
  username: 'kawanmendes',
  roomId: '65ef2fab-ba4e-4d01-8174-a0ede40c74d4'
});
```

### Depois (Seguro em Produção):
```typescript
logger.chat.log('New message:', {
  id: '[REDACTED]',
  text: 'mensagem privada',
  senderId: '[REDACTED]',
  username: 'kawanmendes',
  roomId: '[REDACTED]'
});
```

## 🛡️ Dados Sanitizados Automaticamente

### Campos Sensíveis (sempre redacted em produção):
- `token`, `password`, `email`
- `senderId`, `userId`, `roomId`, `id`

### Campos Truncados (limitados a 20-50 caracteres):
- `text`, `message` → truncado em 20 chars
- Strings longas → truncado em 50 chars
- Arrays → mostrado como `[Array(n)]`

## 📦 Como Usar

### Importar o logger:
```typescript
import { logger } from '../services/logger';
```

### Usar por módulo:
```typescript
// Autenticação
logger.auth.log('Login started');
logger.auth.error('Login failed:', error);

// WebSocket
logger.ws.log('Connected');
logger.ws.warn('Connection unstable');

// Chat
logger.chat.log('New message:', data);
logger.chat.info('Match found');

// Room
logger.room.log('Invalid category');
logger.room.error('Room error:', error);
```

## 🔧 Níveis de Log

- `log` → Informações gerais
- `info` → Informações importantes
- `warn` → Avisos
- `error` → Erros

## 🌍 Comportamento por Ambiente

### Desenvolvimento (`__DEV__ = true`):
- ✅ Logs completos e detalhados
- ✅ Todos os dados visíveis
- ✅ Facilita debugging
- ⚠️ **VOCÊ ESTÁ AQUI AGORA** - Por isso vê todos os dados

### Produção (`__DEV__ = false`):
- 🔒 Dados sensíveis redacted
- 🔒 Textos longos truncados
- 🔒 IDs e tokens ocultos
- ✅ Mantém contexto para debugging

### 🧪 Como Testar Modo Produção Localmente:

1. Abra `services/logger.ts`
2. Descomente a linha:
```typescript
// const isDev = false; // ← remova as barras //
```
3. Recarregue o app
4. Agora verá logs sanitizados mesmo em dev!

## 📊 Exemplos de Output

### Desenvolvimento:
```
[CHAT] New message: {
  id: '27f47638-d754-4e0c-90b6-9007a6b1a1e2',
  text: 'Esta é uma mensagem muito longa que será truncada',
  senderId: 15,
  username: 'kawanmendes'
}
```

### Produção:
```
[CHAT] New message: {
  id: '[REDACTED]',
  text: 'Esta é uma mensage...',
  senderId: '[REDACTED]',
  username: 'kawanmendes'
}
```

## 🚀 Próximos Passos (Recomendado)

### 1. Integração com Sentry (Monitoramento de Erros):
```typescript
import * as Sentry from '@sentry/react-native';

logger.error = (message, error) => {
  console.error(message, error);
  if (!__DEV__) {
    Sentry.captureException(error);
  }
};
```

### 2. Integração com Analytics:
```typescript
import analytics from '@react-native-firebase/analytics';

logger.info = (event, data) => {
  console.info(event, data);
  if (!__DEV__) {
    analytics().logEvent(event, sanitizeData(data));
  }
};
```

### 3. Log Remoto (Backend):
```typescript
const sendToBackend = async (level, message, data) => {
  if (!__DEV__) {
    await fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify({ level, message, data: sanitizeData(data) })
    });
  }
};
```

## ⚠️ Boas Práticas

### ✅ FAÇA:
```typescript
logger.auth.log('Login attempt');
logger.chat.log('Message sent');
logger.ws.error('Connection failed:', error);
```

### ❌ NÃO FAÇA:
```typescript
console.log('User token:', token); // ❌ Expõe token
console.log('Password:', password); // ❌ Expõe senha
console.log('Full user object:', user); // ❌ Pode conter dados sensíveis
```

## 🔐 Compliance

Este sistema ajuda a cumprir:
- ✅ **LGPD** (Lei Geral de Proteção de Dados)
- ✅ **GDPR** (General Data Protection Regulation)
- ✅ **PCI DSS** (Payment Card Industry Data Security Standard)

## 📝 Manutenção

Para adicionar novos campos sensíveis, edite `services/logger.ts`:

```typescript
const sensitiveKeys = [
  'token', 'password', 'email', 
  'senderId', 'userId', 'roomId', 'id',
  'creditCard', 'ssn', 'cpf' // ← adicione aqui
];
```

---

**Implementado em:** 13/05/2026  
**Arquivos modificados:**
- `services/logger.ts` (novo)
- `services/websocket.ts`
- `hooks/useAuth.tsx`
- `hooks/useChat.tsx`
- `app/chat/room.tsx`
