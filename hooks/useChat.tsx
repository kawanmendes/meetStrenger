import { useCallback, useEffect, useState } from "react";
import { ChatMessage } from "../constants/types";
import { wsService } from "../services/wabsocket";

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
            UserName: data.UserName || 'desconhecido',
        };
        setMessages(prev => [...prev, newMessage]);
    }, []);

    const handLeMatchFound = useCallback((data: any) => {
        console.log('Match found:', data);
        setCurrentRoomId(data.roomId);
        setIsMatching(false);
        setIsConnected(true);
        setMessages([]);
        setPartnerName(data.partner?.username|| 'usuario');
        wsService.joinRoom(data.roomId);
    }, []);
}