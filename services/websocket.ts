import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from './config';
import { io, Socket } from 'socket.io-client';

class WebSocketService {
    public socket: Socket | null = null;
    private isConnected = false;
    
    async connect(): Promise<void> {
        const token = await AsyncStorage.getItem('authToken');
        this.socket = io(API_CONFIG.SOCKET_URL, {
            auth: { token },
            transports: ['websocket']
        });
        
        return new Promise((resolve, reject) => {
            this.socket!.on('connect', () => {
                this.isConnected = true;
                console.log('WebSocket connected');

                if(token) {
                    this.socket!.emit('authenticate', { token });
                }
                resolve();
            });
            
            this.socket!.on('authenticated', (data: { userId: string }) => {
                console.log('Authenticated as userId:', data.userId);
            });

            this.socket!.on('auth-error', (error: any) => {
                console.error('WebSocket auth error:', error);
                reject(new Error(error?.error || 'Auth failed'));
            });
            
            this.socket!.on('connect_error', (error: Error) => {
                console.error('WebSocket connect error:', error);
                reject(error);
            });
            
            this.socket!.on('disconnect', () => {
                this.isConnected = false;
                console.log('WebSocket disconnected');
            });
        });
    }
    
    disconnected(): void {
        if(this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
    
    // Métodos para chat room
    joinRoom(roomId: string): void { 
        this.socket?.emit('join-room', { roomId }); 
    }
    
    leaveRoom(roomId: string): void { 
        this.socket?.emit('leave-room', { roomId }); 
    }
    
    sendMessage(text: string): void { 
        this.socket?.emit('send-message', { text }); 
    }
    
    onMessage(callback: (message: any) => void): void { 
        this.socket?.on('new-message', callback); 
    }
    
    onQueueStatus(callback: (data: any) => void): void { 
        this.socket?.on('queue-status', callback); 
    }
    
    onMatchingFound(callback: (room: any) => void): void { 
        this.socket?.on('match-found', callback); 
    }

    onMatchingCancelled(callback: (data: any) => void): void { 
        this.socket?.on('matching-cancelled', callback); 
    }

    onPartnerTyping(callback: (data: any) => void): void { 
        this.socket?.on('partner-typing', callback); 
    }

    onPartnerLeft(callback: (data: any) => void): void { 
        this.socket?.on('partner-left', callback); 
    }

    onPartnerDisconnected(callback: (data: any) => void): void { 
        this.socket?.on('partner-disconnected', callback); 
    }

    findMatch(category: string): void { 
        this.socket?.emit('find-match', { category }); 
    }

    cancelMatch(): void {
        this.socket?.emit('cancel-matching');
    }

    typingStart(): void {
        this.socket?.emit('typing-start');
    }

    typingStop(): void {
        this.socket?.emit('typing-stop');
    }

    removeAllListeners(): void {
        this.socket?.removeAllListeners();
    }
    
    get connected(): boolean {
        return this.isConnected;
    }
}

export const wsService = new WebSocketService();
