import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatMessage } from "../constants/types";
import { wsService } from "../services/websocket";

export function useChat(category: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isMatching, setIsMatching] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
    const [partnerName, setPartnerName] = useState<string>('procurando...');
    const [queuePosition, setQueuePosition] = useState<number | null>(null);
    const [estimatedWait, setEstimatedWait] = useState<string>('');
    const [partnerTyping, setPartnerTyping] = useState(false);

    const handleNewMessage = useCallback((data : any) => {
        console.log('New message received:', data);
        const newMessage: ChatMessage = {
            id: data.id,
            text: data.text,  // ✅ Backend envia 'text'
            isUser: false,
            timestamp: new Date(data.timestamp),
            userName: data.username || 'desconhecido',  // ✅ Backend envia 'username'
        };
        setMessages(prev => [...prev, newMessage]);
    }, []);

    const handleMatchFound = useCallback((data: any) => {
        console.log('Match found:', data);
        setCurrentRoomId(data.roomId);
        setIsMatching(false);
        setIsConnected(true);
        setMessages([]);
        setPartnerName(data.partner?.username|| 'usuario');
        setQueuePosition(null);
        setEstimatedWait('');
        wsService.joinRoom(data.roomId);
    }, []);

    const handleQueueStatus = useCallback((data: any) => {
        console.log('Queue status:', data);
        setQueuePosition(data.position || 1);
        setEstimatedWait(data.estimatedWait || '...');
    }, []);

    const handleMatchingCancelled = useCallback(() => {
        console.log('Matching cancelled');
        setIsMatching(false);
        setQueuePosition(null);
        setEstimatedWait('');
    }, []);

    const handlePartnerTyping = useCallback((data: any) => {
        console.log('Partner typing:', data);
        setPartnerTyping(data.isTyping || false);
    }, []);

    const handlePartnerLeft = useCallback((data: any) => {
        console.log('Partner left:', data);
        setIsConnected(false);
        setCurrentRoomId(null);
        setMessages([]);
        setPartnerName('procurando...');
    }, []);

    const handlePartnerDisconnected = useCallback((data: any) => {
        console.log('Partner disconnected:', data);
        setIsConnected(false);
        setCurrentRoomId(null);
        setMessages([]);
        setPartnerName('procurando...');
    }, []);

    const startMatch = useCallback(() => {
        setIsMatching(true);
        setPartnerName('procurando...');

        wsService.findMatch(category);  // ✅ Categoria string, não array
    }, [category]);

    const cancelMatch = useCallback(() => {
        setIsMatching(false);
        wsService.cancelMatch();
    }, []);

    const sendMessage = useCallback((text: string) => {
        if (!currentRoomId || !text.trim()) return;

        const newMessage: ChatMessage = {
            id: `${Date.now()}`,
            text: text.trim(),
            isUser: true,
            timestamp: new Date(),
            userName: 'Você',
        };

        setMessages(prev => [...prev, newMessage]);
        wsService.sendMessage(text.trim());  // ✅ Apenas texto
    }, [currentRoomId]);

    useEffect(() => {
        wsService.onMessage(handleNewMessage);
        wsService.onMatchingFound(handleMatchFound);
        wsService.onQueueStatus(handleQueueStatus);
        wsService.onMatchingCancelled(handleMatchingCancelled);
        wsService.onPartnerTyping(handlePartnerTyping);
        wsService.onPartnerLeft(handlePartnerLeft);
        wsService.onPartnerDisconnected(handlePartnerDisconnected);

        if (wsService.connected) {
            startMatch();
        }

        return () => {
            if (currentRoomId) {
                wsService.leaveRoom(currentRoomId);
            }
            wsService.removeAllListeners();
        };
    }, [currentRoomId, handleMatchFound, handleNewMessage, handleQueueStatus, handleMatchingCancelled, handlePartnerTyping, handlePartnerLeft, handlePartnerDisconnected, startMatch]);

    return useMemo(() => ({
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
    }), [cancelMatch, currentRoomId, isConnected, isMatching, messages, partnerName, queuePosition, estimatedWait, partnerTyping, sendMessage, startMatch]);
}
