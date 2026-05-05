import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatMessage } from "../constants/types";
import { MOCK_AUTH_ENABLED, mockMessages, mockPartner } from "../constants/mock";
import { wsService } from "../services/websocket";

export function useChat(category: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isMatching, setIsMatching] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
    const [partnerName, setPartnerName] = useState<string>('procurando...');

    const handleNewMessage = useCallback((data : any) => {
        console.log('New message received:', data);
        const newMessage: ChatMessage = {
            id: data.id,
            text: data.message,
            isUser: false,
            timestamp: new Date(data.timestamp),
            userName: data.userName || 'desconhecido',
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
        wsService.joinRoom(data.roomId);
    }, []);

    const startMatch = useCallback(() => {
        setIsMatching(true);
        setPartnerName('procurando...');
        if (MOCK_AUTH_ENABLED) {
            setCurrentRoomId(`mock-room-${category}`);
            setPartnerName(mockPartner.username);
            setMessages(mockMessages);
            setIsMatching(false);
            setIsConnected(true);
            return;
        }

        wsService.findMatch([category]);
    }, [category]);

    const cancelMatch = useCallback(() => {
        setIsMatching(false);
        if (MOCK_AUTH_ENABLED) return;
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
        if (MOCK_AUTH_ENABLED) return;
        wsService.sendMessage(currentRoomId, text.trim());
    }, [currentRoomId]);

    useEffect(() => {
        wsService.onMessage(handleNewMessage);
        wsService.onMatchingFound(handleMatchFound);

        if (wsService.connected) {
            startMatch();
        }

        return () => {
            if (currentRoomId) {
                wsService.leaveRoom(currentRoomId);
            }
            wsService.removeAllListeners();
        };
    }, [currentRoomId, handleMatchFound, handleNewMessage, startMatch]);

    return useMemo(() => ({
        messages,
        isConnected,
        isMatching,
        currentRoomId,
        partnerName,
        startMatch,
        cancelMatch,
        sendMessage,
    }), [cancelMatch, currentRoomId, isConnected, isMatching, messages, partnerName, sendMessage, startMatch]);
}
