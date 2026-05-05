import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ThemeProvider } from '../design-system/context/ThemeContext';
import { AuthProvider, useAuth } from '../hooks/useAuth';

// Guard de rota — redireciona baseado em autenticação
function RouteGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === 'auth';
    const isPublicEntry = !segments[0] || segments[0] === 'index';
    if (!isAuthenticated && !inAuthGroup && !isPublicEntry) {
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/home');
    }
  }, [isAuthenticated, isLoading, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <ThemeProvider initialMode="light">
      <AuthProvider>
        <RouteGuard />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ThemeProvider>
  );
} 
