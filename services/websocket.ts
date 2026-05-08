import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';

import { API_CONFIG } from './config';

class WebSocketService {

    public socket: Socket | null = null;

    private isConnected = false;

    private isAuthenticated = false;

    // =========================
    // CONNECTION LOCK
    // =========================
    private isConnecting = false;

    // =========================
    // GETTERS
    // =========================

    get connected(): boolean {
        return this.isConnected;
    }

    get authenticated(): boolean {
        return this.isAuthenticated;
    }

    // =========================
    // CONNECT
    // =========================

    async connect(): Promise<void> {

        // já conectado
        if (
            this.socket?.connected &&
            this.isAuthenticated
        ) {

            console.log(
                '[WS] Already connected'
            );

            return;
        }

        // já conectando
        if (this.isConnecting) {

            console.log(
                '[WS] Connection already in progress'
            );

            return this.waitForConnection();
        }

        this.isConnecting = true;

        try {

            // limpa socket antigo
            if (this.socket) {

                console.log(
                    '[WS] Cleaning old socket'
                );

                this.socket.removeAllListeners();

                this.socket.disconnect();

                this.socket = null;
            }

            const token =
                await AsyncStorage.getItem(
                    'authToken'
                );

            if (!token) {

                throw new Error(
                    'No auth token found'
                );
            }

            console.log(
                '[WS] Creating socket connection'
            );

            // cria socket
            this.socket = io(
                API_CONFIG.SOCKET_URL,
                {
                    auth: {
                        token,
                    },

                    transports: ['websocket'],

                    autoConnect: true,

                    reconnection: true,

                    reconnectionAttempts: 5,

                    reconnectionDelay: 1000,
                }
            );

            // =========================
            // RECONNECT
            // =========================

            this.socket.on(
                'reconnect',
                () => {

                    console.log(
                        '[WS] Reconnected'
                    );

                    this.isConnected = true;

                    this.isAuthenticated = false;

                    this.socket?.emit(
                        'authenticate',
                        { token }
                    );
                }
            );

            // =========================
            // DISCONNECT
            // =========================

            this.socket.on(
                'disconnect',
                (reason) => {

                    console.log(
                        '[WS] Disconnected:',
                        reason
                    );

                    this.isConnected = false;

                    this.isAuthenticated = false;
                }
            );

            return new Promise(
                (resolve, reject) => {

                    const timeout =
                        setTimeout(() => {

                            console.error(
                                '[WS] Connection timeout'
                            );

                            this.isConnected = false;

                            this.isAuthenticated = false;

                            reject(
                                new Error(
                                    'Connection timeout'
                                )
                            );

                        }, 8000);

                    // =========================
                    // CONNECT
                    // =========================

                    this.socket!.once(
                        'connect',
                        () => {

                            console.log(
                                '[WS] Connected'
                            );

                            this.isConnected = true;

                            this.socket!.emit(
                                'authenticate',
                                { token }
                            );
                        }
                    );

                    // =========================
                    // AUTHENTICATED
                    // =========================

                    this.socket!.once(
                        'authenticated',
                        (
                            data: {
                                userId: string;
                            }
                        ) => {

                            clearTimeout(
                                timeout
                            );

                            console.log(
                                '[WS] Authenticated:',
                                data.userId
                            );

                            this.isConnected = true;

                            this.isAuthenticated = true;

                            resolve();
                        }
                    );

                    // =========================
                    // AUTH ERROR
                    // =========================

                    this.socket!.once(
                        'auth-error',
                        (error: any) => {

                            clearTimeout(
                                timeout
                            );

                            console.error(
                                '[WS] Auth error:',
                                error
                            );

                            this.isConnected = false;

                            this.isAuthenticated = false;

                            reject(
                                new Error(
                                    error?.error ||
                                    'Authentication failed'
                                )
                            );
                        }
                    );

                    // =========================
                    // CONNECT ERROR
                    // =========================

                    this.socket!.once(
                        'connect_error',
                        (
                            error: Error
                        ) => {

                            clearTimeout(
                                timeout
                            );

                            console.error(
                                '[WS] Connect error:',
                                error
                            );

                            this.isConnected = false;

                            this.isAuthenticated = false;

                            reject(error);
                        }
                    );
                }
            );

        } finally {

            // libera lock
            this.isConnecting = false;
        }
    }

    // =========================
    // WAIT FOR CONNECTION
    // =========================
    
    async waitForConnection(
        timeout = 8000
    ): Promise<void> {
    
        // já conectado
        if (
            this.isConnected &&
            this.isAuthenticated
        ) {
        
            console.log(
                '[WS] Already connected/authenticated'
            );
        
            return;
        }
    
        return new Promise(
            (resolve, reject) => {
            
                const deadline =
                    Date.now() + timeout;
            
                const check = () => {
                
                    // conexão concluída
                    if (
                        this.isConnected &&
                        this.isAuthenticated
                    ) {
                    
                        console.log(
                            '[WS] waitForConnection resolved'
                        );
                    
                        resolve();
                    
                        return;
                    }
                
                    // timeout
                    if (
                        Date.now() >
                        deadline
                    ) {
                    
                        console.error(
                            '[WS] waitForConnection timeout'
                        );
                    
                        reject(
                            new Error(
                                'WebSocket timeout'
                            )
                        );
                    
                        return;
                    }
                
                    // continua verificando
                    setTimeout(
                        check,
                        100
                    );
                };
            
                check();
            }
        );
    }

    // =========================
    // DISCONNECT
    // =========================

    disconnect(): void {

        console.log(
            '[WS] Disconnecting...'
        );

        if (this.socket) {

            this.removeAppListeners();

            this.socket.disconnect();

            this.socket = null;
        }

        this.isConnected = false;

        this.isAuthenticated = false;

        this.isConnecting = false;
    }

    // =========================
    // REMOVE APP LISTENERS
    // =========================

    removeAppListeners(): void {

        const events = [

            'new-message',

            'queue-status',

            'match-found',

            'matching-cancelled',

            'partner-typing',

            'partner-left',

            'partner-disconnected',

            'room-joined',

            'error',
        ];

        events.forEach(
            (event) => {

                this.socket?.off(event);
            }
        );
    }

    // =========================
    // MATCHMAKING
    // =========================

    findMatch(category: string): void {

        console.log(
            '[WS] Finding match:',
            category
        );

        this.socket?.emit(
            'find-match',
            {
                category,
            }
        );
    }

    cancelMatch(): void {

        console.log(
            '[WS] Cancel matching'
        );

        this.socket?.emit(
            'cancel-matching'
        );
    }

    // =========================
    // ROOM
    // =========================

    joinRoom(roomId: string): void {

        console.log(
            '[WS] Joining room:',
            roomId
        );

        this.socket?.emit(
            'join-room',
            {
                roomId,
            }
        );
    }

    leaveRoom(roomId: string): void {

        console.log(
            '[WS] Leaving room:',
            roomId
        );

        this.socket?.emit(
            'leave-room',
            {
                roomId,
            }
        );
    }

    // =========================
    // MESSAGES
    // =========================

    sendMessage(
        roomId: string,
        text: string
    ): void {

        console.log(
            '[WS] Sending message:',
            text
        );

        this.socket?.emit(
            'send-message',
            {
                roomId,
                text,
            }
        );
    }

    // =========================
    // TYPING
    // =========================

    typingStart(): void {

        this.socket?.emit(
            'typing-start'
        );
    }

    typingStop(): void {

        this.socket?.emit(
            'typing-stop'
        );
    }

    // =========================
    // LISTENERS
    // =========================

    onMessage(
        callback: (
            message: any
        ) => void
    ): void {

        this.socket?.on(
            'new-message',
            callback
        );
    }

    onQueueStatus(
        callback: (
            data: any
        ) => void
    ): void {

        this.socket?.on(
            'queue-status',
            callback
        );
    }

    onMatchingFound(
        callback: (
            room: any
        ) => void
    ): void {

        this.socket?.on(
            'match-found',
            callback
        );
    }

    onMatchingCancelled(
        callback: (
            data: any
        ) => void
    ): void {

        this.socket?.on(
            'matching-cancelled',
            callback
        );
    }

    onPartnerTyping(
        callback: (
            data: any
        ) => void
    ): void {

        this.socket?.on(
            'partner-typing',
            callback
        );
    }

    onPartnerLeft(
        callback: (
            data: any
        ) => void
    ): void {

        this.socket?.on(
            'partner-left',
            callback
        );
    }

    onPartnerDisconnected(
        callback: (
            data: any
        ) => void
    ): void {

        this.socket?.on(
            'partner-disconnected',
            callback
        );
    }

    onError(
        callback: (
            error: any
        ) => void
    ): void {

        this.socket?.on(
            'error',
            callback
        );
    }
}

export const wsService =
    new WebSocketService();