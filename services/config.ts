export const API_CONFIG = {
    BASE_URL: 'MEU SERVIDOR_AQUI', // Substitua pelo URL do seu servidor
    SOCKET_URL: 'MEU SERVIDOR_SEM_O_PREFIXO_AQUI', // Substitua pelo URL do seu servidor de WebSocket
    TIMEOUT: 6000, // Tempo limite para requisições em milissegundos
}

export interface ApiResponse<T= any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}
export interface ChatRoom {
    id: string;
    name: string;
    participants: User[];
    createdAt: string;
}
export interface Message {
    id: string;
    RoomId: string;
    userId: string;
    username: string;
    text: string;
    timestamp: string;
}