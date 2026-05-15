/**
 * 🧪 Script de Teste - Logger Seguro
 * 
 * Execute este arquivo para ver a diferença entre logs de dev e produção
 */

// Simular ambiente de desenvolvimento
(globalThis as typeof globalThis & { __DEV__: boolean }).__DEV__ = true;

const sanitizeData = (data: any): any => {
  if (!data) return data;
  if (typeof data === 'string') return data.length > 50 ? `${data.substring(0, 50)}...` : data;
  if (Array.isArray(data)) return `[Array(${data.length})]`;
  if (typeof data === 'object') {
    const sanitized: any = {};
    const sensitiveKeys = ['token', 'password', 'email', 'senderId', 'userId', 'roomId', 'id'];
    for (const key in data) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]';
      } else if (key === 'text' || key === 'message') {
        sanitized[key] = typeof data[key] === 'string' && data[key].length > 20 ? `${data[key].substring(0, 20)}...` : data[key];
      } else {
        sanitized[key] = data[key];
      }
    }
    return sanitized;
  }
  return data;
};

// Dados de exemplo (como vêm do backend)
const exampleData = {
  id: '699f7b2d-5226-45e2-93c9-df8c4c042f49',
  text: 'wdadwa',
  senderId: 14,
  username: 'kawanmendes',
  timestamp: '2026-05-13T22:55:06.316Z',
  roomId: '9f7a965e-aefa-469f-ad7b-14fb74a74b5d'
};

console.log('\n🔧 ===== MODO DESENVOLVIMENTO (__DEV__ = true) =====');
console.log('[CHAT] New message:', exampleData);

console.log('\n🔒 ===== MODO PRODUÇÃO (__DEV__ = false) =====');
console.log('[CHAT] New message:', sanitizeData(exampleData));

console.log('\n📊 ===== COMPARAÇÃO =====');
console.log('Desenvolvimento:', JSON.stringify(exampleData, null, 2));
console.log('\nProdução:', JSON.stringify(sanitizeData(exampleData), null, 2));

console.log('\n✅ Em produção, os seguintes campos são protegidos:');
console.log('   - id: [REDACTED]');
console.log('   - senderId: [REDACTED]');
console.log('   - roomId: [REDACTED]');
console.log('   - text: truncado se > 20 caracteres');
console.log('   - username: mantido (não sensível)');
console.log('   - timestamp: mantido (não sensível)');
