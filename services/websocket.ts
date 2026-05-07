import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';

import { API_CONFIG } from './config';

class WebSocketService {
    public socket: Socket | null = null;

    private isConnected = false;

    private isAuthenticated = false;

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
    // CONNECTION
    // =========================

    async connect(): Promise<void> {

        // evita conexão duplicada
        if (this.socket?.connected) {
            console.log('[WS] Socket already connected');
            return;
        }

        // limpa socket anterior
        if (this.socket) {

            console.log('[WS] Cleaning previous socket');

            this.socket.removeAllListeners();

            this.socket.disconnect();

            this.socket = null;
        }

        const token = await AsyncStorage.getItem('authToken');

        this.socket = io(API_CONFIG.SOCKET_URL, {
            auth: {
                token,
            },

            transports: ['websocket'],

            autoConnect: true,

            reconnection: true,

            reconnectionAttempts: 5,

            reconnectionDelay: 1000,
        });

        return new Promise((resolve, reject) => {

            // =========================
            // CONNECT
            // =========================

            this.socket!.once('connect', () => {

                console.log('[WS] Connected');

                this.isConnected = true;

                if (token) {

                    console.log('[WS] Authenticating...');

                    this.socket!.emit('authenticate', {
                        token,
                    });

                } else {

                    reject(new Error('No auth token found'));
                }
            });

            // =========================
            // AUTH SUCCESS
            // =========================

            this.socket!.once(
                'authenticated',
                (data: { userId: string }) => {

                    console.log(
                        '[WS] Authenticated:',
                        data.userId
                    );

                    this.isAuthenticated = true;

                    resolve();
                }
            );

            // =========================
            // AUTH ERROR
            // =========================

            this.socket!.once('auth-error', (error: any) => {

                console.error(
                    '[WS] Auth error:',
                    error
                );

                this.isAuthenticated = false;

                reject(
                    new Error(
                        error?.error || 'Authentication failed'
                    )
                );
            });

            // =========================
            // CONNECT ERROR
            // =========================

            this.socket!.once(
                'connect_error',
                (error: Error) => {

                    console.error(
                        '[WS] Connection error:',
                        error
                    );

                    this.isConnected = false;

                    reject(error);
                }
            );

            // =========================
            // DISCONNECT
            // =========================

            this.socket!.on('disconnect', (reason) => {

                console.log(
                    '[WS] Disconnected:',
                    reason
                );

                this.isConnected = false;

                this.isAuthenticated = false;
            });
        });
    }

    // =========================
    // WAIT FOR CONNECTION
    // =========================

    async waitForConnection(
        timeout = 5000
    ): Promise<void> {

        if (this.isConnected) {
            return;
        }

        return new Promise((resolve, reject) => {

            const timer = setTimeout(() => {

                reject(
                    new Error(
                        'WebSocket connection timeout'
                    )
                );

            }, timeout);

            this.socket?.once('connect', () => {

                clearTimeout(timer);

                console.log(
                    '[WS] waitForConnection resolved'
                );

                this.isConnected = true;

                resolve();
            });

            this.socket?.once(
                'connect_error',
                (error) => {

                    clearTimeout(timer);

                    reject(error);
                }
            );
        });
    }

    // =========================
    // DISCONNECT
    // =========================

    disconnect(): void {

        console.log('[WS] Disconnecting...');

        if (this.socket) {

            this.removeAppListeners();

            this.socket.disconnect();

            this.socket = null;
        }

        this.isConnected = false;

        this.isAuthenticated = false;
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

        events.forEach((event) => {

            this.socket?.off(event);
        });
    }

    // =========================
    // MATCHMAKING
    // =========================

    findMatch(category: string): void {

        console.log(
            '[WS] Finding match:',
            category
        );

        this.socket?.emit('find-match', {
            category,
        });
    }

    cancelMatch(): void {

        console.log('[WS] Cancel match');

        this.socket?.emit('cancel-matching');
    }

    // =========================
    // ROOM
    // =========================

    joinRoom(roomId: string): void {

        console.log(
            '[WS] Joining room:',
            roomId
        );

        this.socket?.emit('join-room', {
            roomId,
        });
    }

    leaveRoom(roomId: string): void {

        console.log(
            '[WS] Leaving room:',
            roomId
        );

        this.socket?.emit('leave-room', {
            roomId,
        });
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

        this.socket?.emit('send-message', {
            roomId,
            text,
        });
    }

    // =========================
    // TYPING
    // =========================

    typingStart(): void {

        this.socket?.emit('typing-start');
    }

    typingStop(): void {

        this.socket?.emit('typing-stop');
    }

    // =========================
    // LISTENERS
    // =========================

    onMessage(
        callback: (message: any) => void
    ): void {

        this.socket?.on(
            'new-message',
            callback
        );
    }

    onQueueStatus(
        callback: (data: any) => void
    ): void {

        this.socket?.on(
            'queue-status',
            callback
        );
    }

    onMatchingFound(
        callback: (room: any) => void
    ): void {

        this.socket?.on(
            'match-found',
            callback
        );
    }

    onMatchingCancelled(
        callback: (data: any) => void
    ): void {

        this.socket?.on(
            'matching-cancelled',
            callback
        );
    }

    onPartnerTyping(
        callback: (data: any) => void
    ): void {

        this.socket?.on(
            'partner-typing',
            callback
        );
    }

    onPartnerLeft(
        callback: (data: any) => void
    ): void {

        this.socket?.on(
            'partner-left',
            callback
        );
    }

    onPartnerDisconnected(
        callback: (data: any) => void
    ): void {

        this.socket?.on(
            'partner-disconnected',
            callback
        );
    }

    onError(
        callback: (error: any) => void
    ): void {

        this.socket?.on(
            'error',
            callback
        );
    }
}

export const wsService = new WebSocketService();