import { ChatMessage, User } from './types';

export const MOCK_AUTH_ENABLED = true;

export const mockUser: User = {
  id: 'mock-user-1',
  username: 'Kawan',
  email: 'kawan@meetstranger.dev',
  createdAt: new Date().toISOString(),
};

export const mockPartner: User = {
  id: 'mock-user-2',
  username: 'Piauzinho',
  email: 'piauzinho@meetstranger.dev',
  createdAt: new Date().toISOString(),
};

export const mockMessages: ChatMessage[] = [
  {
    id: 'mock-message-1',
    text: 'Piau piau! Bem-vindo ao chat de teste.',
    isUser: false,
    timestamp: new Date(),
    userName: mockPartner.username,
  },
  {
    id: 'mock-message-2',
    text: 'Agora voce consegue navegar e testar o layout sem backend.',
    isUser: false,
    timestamp: new Date(),
    userName: mockPartner.username,
  },
];
