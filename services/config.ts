import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || extra.API_URL || 'https://meetstrenger-backend.onrender.com/api',
  SOCKET_URL: process.env.EXPO_PUBLIC_WS_URL || extra.WS_URL || 'https://meetstrenger-backend.onrender.com',
  TIMEOUT: 6000,
};
