import { Stack } from 'expo-router';
import { ThemeProvider } from '../design-system/context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider initialMode="light">
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
} 