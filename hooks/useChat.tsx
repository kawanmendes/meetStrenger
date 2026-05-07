import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { ChatMessage } from '../constants/types';
import { wsService } from '../services/websocket';
export function useChat(category: string) {
    // =========================
    // STATES
    // =========================
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isMatching, setIsMatching] = useState(false);
    const [currentRoomId, setCurrentRoomId] =
        useState<string | null>(null);
    const [partnerName, setPartnerName] =
        useState('procurando...');
    const [queuePosition, setQueuePosition] =
        useState<number | null>(null);
    const [estimatedWait, setEstimatedWait] =
        useState('');
    const [partnerTyping, setPartnerTyping] =
        useState(false);
    // ========================
    // MESSAGE HANDLER
    // =========================
    const handleNewMessage = useCallback(
        (data: any) => {
            console.log(
                '[CHAT] New message:',
                data
            );
            const newMessage: ChatMessage = {
                id: data.id || `${Date.now()}`,
                text: data.text,
                isUser: false,
                timestamp: new Date(
                    data.timestamp
                ),
                userName:
                    data.username ||
                    'desconhecido',
            };
            setMessages((prev) => [
                ...prev,
                newMessage,
            ]);
        },
        []
    );
    // =========================
    // MATCH FOUND
    // =========================
    const handleMatchFound = useCallback(
        (data: any) => {
            console.log(
                '[CHAT] Match found:',
                data
            );
            setCurrentRoomId(data.roomId);
            setIsConnected(true);
            setIsMatching(false);
            setMessages([]);
            setPartnerName(
                data.partner?.username ||
                'usuário'
            );
            setQueuePosition(null);
            setEstimatedWait('');
            wsService.joinRoom(data.roomId);
        },
        []
    );
    // =========================
    // QUEUE STATUS
    // =========================
    const handleQueueStatus = useCallback(
        (data: any) => {
            console.log(
                '[CHAT] Queue status:',
                data
            );
            setQueuePosition(
                data.position || 1
            );
            setEstimatedWait(
                data.estimatedWait || '...'
            );
        },
        []
    );
    // =========================
    // MATCH CANCELLED
    // =========================
    const handleMatchingCancelled =
        useCallback(() => {
            console.log(
                '[CHAT] Matching cancelled'
            );
            setIsMatching(false);
            setQueuePosition(null);
            setEstimatedWait('');
        }, []);
    // =========================
    // PARTNER TYPING
    // =========================
    const handlePartnerTyping =
        useCallback((data: any) => {
            console.log(
                '[CHAT] Partner typing:',
                data
            );
            setPartnerTyping(
                data.isTyping || false
            );
        }, []);
    // =========================
    // PARTNER LEFT
    // =========================
    const handlePartnerLeft =
        useCallback((data: any) => {
            console.log(
                '[CHAT] Partner left:',
                data
            );
            setIsConnected(false);
            setCurrentRoomId(null);
            setMessages([]);
            setPartnerName(
                'procurando...'
            );
        }, []);
    // =========================
    // PARTNER DISCONNECTED
    // =========================
    const handlePartnerDisconnected =
        useCallback((data: any) => {
            console.log(
                '[CHAT] Partner disconnected:',
                data
            );
            setIsConnected(false);
            setCurrentRoomId(null);
            setMessages([]);
            setPartnerName(
                'procurando...'
            );
        }, []);
    // =========================
    // SOCKET ERROR
    // =========================
    const handleSocketError =
        useCallback((error: any) => {
            console.error(
                '[CHAT] Socket error:',
                error
            );
            setIsMatching(false);
        }, []);
    // =========================
    // START MATCH
    // =========================
    const startMatch = useCallback(
        async () => {
            try {
                console.log(
                    '[CHAT] Starting match...'
                );
                setIsMatching(true);
                setPartnerName(
                    'procurando...'
                );
                await wsService.waitForConnection();
                wsService.findMatch(category);
            } catch (error) {
                console.error(
                    '[CHAT] Match error:',
                    error
                );
                setIsMatching(false);
            }
        },
        [category]
    );
    // =========================
    // CANCEL MATCH
    // =========================
    const cancelMatch = useCallback(() => {
        console.log(
            '[CHAT] Cancel match'
        );
        setIsMatching(false);
        wsService.cancelMatch();
    }, []);
    // =========================
    // SEND MESSAGE
    // =========================
    const sendMessage = useCallback(
        (text: string) => {
            if (
                !currentRoomId ||
                !text.trim()
            ) {
                return;
            }
            const newMessage: ChatMessage = {
                id: `${Date.now()}`,
                text: text.trim(),
                isUser: true,
                timestamp: new Date(),
                userName: 'Você',
            };
            setMessages((prev) => [
                ...prev,
                newMessage,
            ]);
            wsService.sendMessage(
                currentRoomId,
                text.trim()
            );
        },
        [currentRoomId]
    );
    // =========================
    // REGISTER LISTENERS
    // RODA APENAS UMA VEZ
    // =========================
    useEffect(() => {
        console.log(
            '[CHAT] Registering listeners'
        );
        wsService.onMessage(
            handleNewMessage
        );
        wsService.onMatchingFound(
            handleMatchFound
        );
        wsService.onQueueStatus(
            handleQueueStatus
        );
        wsService.onMatchingCancelled(
            handleMatchingCancelled
        );
        wsService.onPartnerTyping(
            handlePartnerTyping
        );
        wsService.onPartnerLeft(
            handlePartnerLeft
        );
        wsService.onPartnerDisconnected(
            handlePartnerDisconnected
        );
        wsService.onError(
            handleSocketError
        );
        return () => {
            console.log(
                '[CHAT] Removing listeners'
            );
            wsService.removeAppListeners();
        };
    }, []);
    // =========================
    // START MATCH EFFECT
    // =========================
    useEffect(() => {
        const initializeMatch =
            async () => {
                if (
                    wsService.connected &&
                    !currentRoomId &&
                    !isMatching
                ) {
                    console.log(
                        '[CHAT] Auto start match'
                    );
                    await startMatch();
                }
            };
        initializeMatch();
    }, [
        currentRoomId,
        isMatching,
        startMatch,
    ]);
    // =========================
    // ROOM CLEANUP
    // =========================
    useEffect(() => {
        return () => {
            if (currentRoomId) {
                console.log(
                    '[CHAT] Leaving room:',
                    currentRoomId
                );
                wsService.leaveRoom(
                    currentRoomId
                );
            }
        };
    }, [currentRoomId]);
    // =========================
    // MEMO
    // =========================
    return useMemo(
        () => ({
            messages,
            isConnected,
            isMatching,
            currentRoomId,
            partnerName,
            queuePosition,
            estimatedWait,
            partnerTyping,
            startMatch,
            cancelMatch,
            sendMessage,
        }),
        [
            messages,
            isConnected,
            isMatching,
            currentRoomId,
            partnerName,
            queuePosition,
            estimatedWait,
            partnerTyping,
            startMatch,
            cancelMatch,
            sendMessage,
        ]
    );
}