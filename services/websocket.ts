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
                console.log(data.userId);
            });
            
            this.socket!.on('connect_error', (error: Error) => {
                reject(error);
            });
            
            this.socket!.on('auth_error', (error: Error) => {
                reject(error);
            });
            
            this.socket!.on('disconnect', () => {
                this.isConnected = false;
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
        this.socket?.emit('join-Room', { roomId }); 
    }
    
    leaveRoom(roomId: string): void { 
        this.socket?.emit('leave-Room', { roomId }); 
    }
    
    sendMessage(roomId: string, message: string): void { 
        this.socket?.emit('send-Message', { roomId, message }); 
    }
    
    onMessage(callback: (message: any) => void): void { 
        this.socket?.on('new-Message', callback); 
    }
    
    onUserJoined(callback: (user: any) => void): void { 
        this.socket?.on('user-Joined', callback); 
    }
    
    onUserLeft(callback: (data: any) => void): void { 
        this.socket?.on('user-Left', callback); 
    }
    
    onMatchingFound(callback: (room: any) => void): void { 
        this.socket?.on('matching-Found', callback); 
    }

    findMatch(category: string[]): void { 
        this.socket?.emit('find-Match', { category }); 
    }

    cancelMatch(): void {
        this.socket?.emit('cancel-Match');
    }

    removeAllListeners(): void {
        this.socket?.removeAllListeners();
    }
    
    get connected(): boolean {
        return this.isConnected;
    }
}

export const wsService = new WebSocketService();
