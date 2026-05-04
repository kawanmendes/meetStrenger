import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from './config';
import { io, Socket } from 'socket.io-client';
 
class webSocketService {
    public socket: Socket | null = null;
    private isConnected = false;
    async connect(): Promise<void> {
        const token = await AsyncStorage.getItem('authToken');
        this.socket = io(API_CONFIG.SOCKET_URL,{
            auth: {token},
            transports: ['websocket']
        });
        return new Promise((resolve, reject) => {
            this.socket!.on('connect', () => {
                this.isConnected = true;
                console.log('WebSocket connected'); //remover quando estiver testado e funcionando

            if(token) {
                this.socket!.emit('authenticate', { token });
            }
            resolve();
        });
        this.socket!.on('authenticated', (data) => {
            console.log(data.userId);
        });
        this.socket!.on('connect_error', (error) =>{
            reject(error);
        });
        this.socket!.on('auth_error', (error) =>{
            reject(error);
        });
        this.socket!.on('disconnect', () =>{
            this.isConnected = false;
        });
    });
    }
    disconnected(): void {
        if(this.socket){
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
    //proximas funções serão implementadas com a construção da tela de chatroom
    joinRoom(roomId: string): void { this.socket?.emit('join-Room', { roomId }); } 
    LeaveRoom(roomId: string): void { this.socket?.emit('leave-Room', { roomId }); }
    SendMessage(roomId: string, message: string): void { this.socket?.emit('send-Message', { roomId, message }); }
    onMessage(callback: (message: any) => void): void { this.socket?.on('new-Message', callback); }
    onUserJoined(callback: (user: any) => void): void { this.socket?.on('user-Joined', callback); }
    onUserLeft(callback: (data: any) => void): void { this.socket?.on('user-Left', callback); }
    onMatchingFound(callback: (room: any) => void): void { this.socket?.on('matching-Found', callback); }

    findMatch(category: string[]): void { this.socket?.emit('find-Match', { category }); }

    cancelMatch(): void{
        this.socket?.emit('cancel-Match');
    }

    removeALLListeners(): void {
        this.socket?.removeAllListeners();
    }
    get connected(): boolean {
        return this.isConnected;
    }
}    
export const wsService = new webSocketService();