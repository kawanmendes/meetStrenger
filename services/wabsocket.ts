import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "./config";
import {io, Socket} from 'socket.io-client';

class webSocketService {
    public socket : Socket | null = null;
    private isConnected  = false;

    async connect(): Promise<void>{
        const token = await AsyncStorage.getItem("authToken");
        this.socket = io(API_CONFIG.SOCKET_URL, {
            auth: {token},
            transports: ['websocket']
        });
        return new Promise ((resolve, reject) => {
            this.socket!.on('connect', () => {
                this.isConnected = true;
                console.log('WebSocket connected'); 
            
            if (token) {
                this.socket!.emit('authenticate', {token});
            }
            resolve();
        });
        this.socket!.on('authenticate', (data) => {
            console.log(data.userId);
        })
        this.socket!.on('connect_error', (error) => {
            reject(error);
        });
        this.socket!.on('auth_error', (error) => {
            reject(error);
        });
        this.socket!.on('disconnect', () => {
            this.isConnected = false;
        });
    });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
    //proximas funcoes a seres implementadas
}
export const wsService = new webSocketService();