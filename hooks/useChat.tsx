import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { ChatMessage } from '../constants/types';

import { wsService } from '../services/websocket';

export function useChat(category: string) {

    // =========================
    // STATES
    // =========================

    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const [isConnected, setIsConnected] =
        useState(false);

    const [isMatching, setIsMatching] =
        useState(false);

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

    // =========================
    // MATCH LOCK
    // =========================

    const matchStarted =
        useRef(false);

    // =========================
    // MESSAGE HANDLER
    // =========================

    const handleNewMessage =
        useCallback(
            (data: any) => {

                console.log(
                    '[CHAT] New message:',
                    data
                );

                const newMessage: ChatMessage = {
                    id:
                        data.id ||
                        `${Date.now()}`,

                    text: data.text,

                    isUser: false,

                    timestamp:
                        new Date(
                            data.timestamp
                        ),

                    userName:
                        data.username ||
                        'desconhecido',
                };

                setMessages(
                    (prev) => [
                        ...prev,
                        newMessage,
                    ]
                );
            },
            []
        );

    // =========================
    // MATCH FOUND
    // =========================

    const handleMatchFound =
        useCallback(
            (data: any) => {

                console.log(
                    '[CHAT] Match found:',
                    data
                );

                setCurrentRoomId(
                    data.roomId
                );

                setIsConnected(true);

                setIsMatching(false);

                setMessages([]);

                setPartnerName(
                    data.partner
                        ?.username ||
                        'usuário'
                );

                setQueuePosition(
                    null
                );

                setEstimatedWait('');

                // backend já faz socket.join()
                // NÃO chamar:
                // wsService.joinRoom(data.roomId);

                matchStarted.current =
                    false;
            },
            []
        );

    // =========================
    // QUEUE STATUS
    // =========================

    const handleQueueStatus =
        useCallback(
            (data: any) => {

                console.log(
                    '[CHAT] Queue status:',
                    data
                );

                setQueuePosition(
                    data.position || 1
                );

                setEstimatedWait(
                    data.estimatedWait ||
                        '...'
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

            setQueuePosition(
                null
            );

            setEstimatedWait('');

            matchStarted.current =
                false;
        }, []);

    // =========================
    // PARTNER TYPING
    // =========================

    const handlePartnerTyping =
        useCallback(
            (data: any) => {

                console.log(
                    '[CHAT] Partner typing:',
                    data
                );

                setPartnerTyping(
                    data.isTyping ||
                        false
                );
            },
            []
        );

    // =========================
    // PARTNER LEFT
    // =========================

    const handlePartnerLeft =
        useCallback(
            (data: any) => {

                console.log(
                    '[CHAT] Partner left:',
                    data
                );

                setIsConnected(
                    false
                );

                setCurrentRoomId(
                    null
                );

                setMessages([]);

                setPartnerName(
                    'procurando...'
                );

                setIsMatching(
                    false
                );

                matchStarted.current =
                    false;
            },
            []
        );

    // =========================
    // PARTNER DISCONNECTED
    // =========================

    const handlePartnerDisconnected =
        useCallback(
            (data: any) => {

                console.log(
                    '[CHAT] Partner disconnected:',
                    data
                );

                setIsConnected(
                    false
                );

                setCurrentRoomId(
                    null
                );

                setMessages([]);

                setPartnerName(
                    'procurando...'
                );

                setIsMatching(
                    false
                );

                matchStarted.current =
                    false;
            },
            []
        );

    // =========================
    // SOCKET ERROR
    // =========================

    const handleSocketError =
        useCallback(
            (error: any) => {

                console.error(
                    '[CHAT] Socket error:',
                    error
                );

                setIsMatching(
                    false
                );

                matchStarted.current =
                    false;
            },
            []
        );

    // =========================
    // START MATCH
    // =========================

    const startMatch = useCallback(
    async () => {
        // matchStarted.current já serve de lock
        // a condição no useEffect verifica isMatching
        if (matchStarted.current) {
            console.log('[CHAT] Match already started');
            return;
        }

        try {
            console.log('[CHAT] Starting match...');
            matchStarted.current = true;
            setIsMatching(true);
            setPartnerName('procurando...');
            await wsService.waitForConnection();
            wsService.findMatch(category);
        } catch (error) {
            console.error('[CHAT] Match error:', error);
            setIsMatching(false);
            matchStarted.current = false;
        }
    },
    [category]  // ← APENAS category. isMatching fora
);

    // =========================
    // CANCEL MATCH
    // =========================

    const cancelMatch =
        useCallback(() => {

            console.log(
                '[CHAT] Cancel match'
            );

            setIsMatching(
                false
            );

            matchStarted.current =
                false;

            wsService.cancelMatch();

        }, []);

    // =========================
    // SEND MESSAGE
    // =========================

    const sendMessage =
        useCallback(
            (text: string) => {

                if (
                    !currentRoomId ||
                    !text.trim()
                ) {
                    return;
                }

                const newMessage: ChatMessage = {
                    id:
                        `${Date.now()}`,

                    text:
                        text.trim(),

                    isUser: true,

                    timestamp:
                        new Date(),

                    userName:
                        'Você',
                };

                setMessages(
                    (prev) => [
                        ...prev,
                        newMessage,
                    ]
                );

                wsService.sendMessage(
                    currentRoomId,
                    text.trim()
                );
            },
            [currentRoomId]
        );

    // =========================
    // REGISTER LISTENERS
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
    // AUTO START MATCH
    // =========================

    useEffect(() => {

        if (
            wsService.connected &&
            !currentRoomId &&
            !isMatching &&
            !matchStarted.current
        ) {

            console.log(
                '[CHAT] Auto starting match'
            );

            startMatch().catch(
                () => {

                    matchStarted.current =
                        false;
                }
            );
        }

    }, [
        currentRoomId,
        isMatching,
        startMatch,
    ]);

    // =========================
    // RESET LOCK
    // =========================

    useEffect(() => {

        if (currentRoomId) {

            console.log(
                '[CHAT] Match found, resetting lock'
            );

            matchStarted.current =
                false;
        }

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