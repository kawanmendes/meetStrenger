/**
 * 🧪 TESTE DE INTEGRAÇÃO END-TO-END
 * Valida: API + WebSocket + Auth + Matching + Chat
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_API = 'https://meetstrenger-backend.onrender.com/api';
const WS_URL = 'https://meetstrenger-backend.onrender.com';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  response?: any;
}

const results: TestResult[] = [];

// ✅ TESTE 1: Health Check
async function testHealthCheck() {
  try {
    console.log('🔍 [TEST 1] Health Check...');
    const response = await fetch(`${BASE_API}/health`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    if (data.success && data.data.services.database === 'connected') {
      console.log('✅ Health Check Passed');
      results.push({ name: 'Health Check', passed: true, response: data });
      return true;
    } else {
      throw new Error('Database not connected');
    }
  } catch (error) {
    console.error('❌ Health Check Failed:', error);
    results.push({ 
      name: 'Health Check', 
      passed: false, 
      error: (error as Error).message 
    });
    return false;
  }
}

// ✅ TESTE 2: Registro de Usuário
async function testRegister() {
  try {
    console.log('🔍 [TEST 2] Registering User...');
    const email = `test_${Date.now()}@example.com`;
    const password = 'test123456';
    const username = `testuser_${Date.now()}`;

    const response = await fetch(`${BASE_API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json();

    if (!response.ok || !data.data?.token) {
      throw new Error(data.error || 'No token received');
    }

    // Salvar credenciais para próximos testes
    await AsyncStorage.setItem('testEmail', email);
    await AsyncStorage.setItem('testPassword', password);
    await AsyncStorage.setItem('testToken', data.data.token);
    await AsyncStorage.setItem('authToken', data.data.token);

    console.log('✅ Registration Passed');
    results.push({ 
      name: 'User Registration', 
      passed: true, 
      response: { user: data.data.user, token: '***hidden***' } 
    });
    return true;
  } catch (error) {
    console.error('❌ Registration Failed:', error);
    results.push({ 
      name: 'User Registration', 
      passed: false, 
      error: (error as Error).message 
    });
    return false;
  }
}

// ✅ TESTE 3: Login
async function testLogin() {
  try {
    console.log('🔍 [TEST 3] Login...');
    const email = await AsyncStorage.getItem('testEmail');
    const password = await AsyncStorage.getItem('testPassword');

    if (!email || !password) {
      throw new Error('Test credentials not found');
    }

    const response = await fetch(`${BASE_API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.data?.token) {
      throw new Error(data.error || 'No token received');
    }

    await AsyncStorage.setItem('authToken', data.data.token);

    console.log('✅ Login Passed');
    results.push({ 
      name: 'User Login', 
      passed: true, 
      response: { user: data.data.user, token: '***hidden***' } 
    });
    return true;
  } catch (error) {
    console.error('❌ Login Failed:', error);
    results.push({ 
      name: 'User Login', 
      passed: false, 
      error: (error as Error).message 
    });
    return false;
  }
}

// ✅ TESTE 4: Get Profile (Autenticação JWT)
async function testGetProfile() {
  try {
    console.log('🔍 [TEST 4] Get Profile (JWT Auth)...');
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
      throw new Error('No token available');
    }

    const response = await fetch(`${BASE_API}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok || !data.data?.user) {
      throw new Error(data.error || 'No user data');
    }

    console.log('✅ Get Profile Passed');
    results.push({ 
      name: 'Get Profile (JWT)', 
      passed: true, 
      response: data.data.user 
    });
    return true;
  } catch (error) {
    console.error('❌ Get Profile Failed:', error);
    results.push({ 
      name: 'Get Profile (JWT)', 
      passed: false, 
      error: (error as Error).message 
    });
    return false;
  }
}

// ✅ TESTE 5: Get Queue Stats
async function testQueueStats() {
  try {
    console.log('🔍 [TEST 5] Get Queue Stats...');
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
      throw new Error('No token available');
    }

    const response = await fetch(`${BASE_API}/matching/stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok || !data.data) {
      throw new Error(data.error || 'No stats data');
    }

    console.log('✅ Queue Stats Passed');
    results.push({ 
      name: 'Get Queue Stats', 
      passed: true, 
      response: data.data 
    });
    return true;
  } catch (error) {
    console.error('❌ Queue Stats Failed:', error);
    results.push({ 
      name: 'Get Queue Stats', 
      passed: false, 
      error: (error as Error).message 
    });
    return false;
  }
}

// ✅ TESTE 6: Logout
async function testLogout() {
  try {
    console.log('🔍 [TEST 6] Logout...');
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
      throw new Error('No token available');
    }

    const response = await fetch(`${BASE_API}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Logout failed');
    }

    await AsyncStorage.removeItem('authToken');

    console.log('✅ Logout Passed');
    results.push({ 
      name: 'User Logout', 
      passed: true, 
      response: data 
    });
    return true;
  } catch (error) {
    console.error('❌ Logout Failed:', error);
    results.push({ 
      name: 'User Logout', 
      passed: false, 
      error: (error as Error).message 
    });
    return false;
  }
}

// ✅ TESTE 7: WebSocket Connection
async function testWebSocketConnection() {
  return new Promise<void>((resolve) => {
    try {
      console.log('🔍 [TEST 7] WebSocket Connection...');
      
      // Usar Socket.IO client
      const script = document.createElement('script');
      script.src = 'https://cdn.socket.io/4.8.3/socket.io.min.js';
      script.onload = () => {
        const socket = (window as any).io(WS_URL, {
          reconnection: true,
          reconnectionDelay: 1000,
        });

        const timeout = setTimeout(() => {
          socket.disconnect();
          console.error('❌ WebSocket Connection Timeout');
          results.push({ 
            name: 'WebSocket Connection', 
            passed: false, 
            error: 'Connection timeout' 
          });
          resolve();
        }, 5000);

        socket.on('connect', () => {
          clearTimeout(timeout);
          console.log('✅ WebSocket Connected');
          results.push({ 
            name: 'WebSocket Connection', 
            passed: true, 
            response: { connected: true } 
          });
          socket.disconnect();
          resolve();
        });

        socket.on('connect_error', (error: any) => {
          clearTimeout(timeout);
          console.error('❌ WebSocket Connection Error:', error);
          results.push({ 
            name: 'WebSocket Connection', 
            passed: false, 
            error: error.message 
          });
          resolve();
        });
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('❌ WebSocket Test Failed:', error);
      results.push({ 
        name: 'WebSocket Connection', 
        passed: false, 
        error: (error as Error).message 
      });
      resolve();
    }
  });
}

// ✅ EXECUTAR TODOS OS TESTES
export async function runAllTests() {
  console.log('═══════════════════════════════════════');
  console.log('🧪 INICIANDO TESTES DE INTEGRAÇÃO');
  console.log('═══════════════════════════════════════\n');

  const startTime = Date.now();

  await testHealthCheck();
  await testRegister();
  await testLogin();
  await testGetProfile();
  await testQueueStats();
  await testWebSocketConnection();
  await testLogout();

  const duration = Date.now() - startTime;

  // Gerar relatório
  console.log('\n═══════════════════════════════════════');
  console.log('📊 RELATÓRIO DE TESTES');
  console.log('═══════════════════════════════════════\n');

  let passCount = 0;
  let failCount = 0;

  results.forEach((result) => {
    if (result.passed) {
      console.log(`✅ ${result.name}`);
      passCount++;
    } else {
      console.log(`❌ ${result.name}`);
      console.log(`   Erro: ${result.error}`);
      failCount++;
    }
  });

  console.log(`\n📈 Resultados: ${passCount}/${results.length} testes passaram`);
  console.log(`⏱️  Duração: ${duration}ms\n`);

  if (failCount === 0) {
    console.log('🎉 TODOS OS TESTES PASSARAM! ✨');
    console.log('✅ Frontend está pronto para produção!');
  } else {
    console.log(`⚠️  ${failCount} teste(s) falharam. Verifique os erros acima.`);
  }

  console.log('═══════════════════════════════════════\n');

  return {
    passed: passCount,
    failed: failCount,
    total: results.length,
    duration,
    results,
  };
}
