import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChatMessage } from '../constants/types';
import { wsService } from '../services/websocket';
import { logger } from '../services/logger';

export function useChat(category: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState('procurando...');
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [estimatedWait, setEstimatedWait] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);
  const matchStarted = useRef(false);

  const handleNewMessage = useCallback((data: any) => {
    logger.chat.log('New message:', data);
    const newMessage: ChatMessage = {
      id: data.id || `${Date.now()}`,
      text: data.text,
      isUser: false,
      timestamp: new Date(data.timestamp),
      userName: data.username || 'desconhecido',
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const handleMatchFound = useCallback((data: any) => {
    logger.chat.log('Match found:', data);
    setCurrentRoomId(data.roomId);
    setIsConnected(true);
    setIsMatching(false);
    setMessages([]);
    setPartnerName(data.partner?.username || 'usuário');
    setQueuePosition(null);
    setEstimatedWait('');
    matchStarted.current = false;
  }, []);

  const handleQueueStatus = useCallback((data: any) => {
    logger.chat.log('Queue status:', data);
    setQueuePosition(data.position || 1);
    setEstimatedWait(data.estimatedWait || '...');
  }, []);

  const handleMatchingCancelled = useCallback(() => {
    logger.chat.log('Matching cancelled');
    setIsMatching(false);
    setQueuePosition(null);
    setEstimatedWait('');
    matchStarted.current = false;
  }, []);

  const handlePartnerTyping = useCallback((data: any) => {
    logger.chat.log('Partner typing:', data);
    setPartnerTyping(data.isTyping || false);
  }, []);

  const handlePartnerDisconnect = useCallback((data: any) => {
    logger.chat.log('Partner disconnected/left:', data);
    setIsConnected(false);
    setCurrentRoomId(null);
    setMessages([]);
    setPartnerName('procurando...');
    setIsMatching(true);
    matchStarted.current = false;
  }, []);

  const handleSocketError = useCallback((error: any) => {
    logger.chat.error('Socket error:', error);
    setIsMatching(false);
    matchStarted.current = false;
  }, []);

  const startMatch = useCallback(async () => {
    if (matchStarted.current) {
      logger.chat.log('Match already started');
      return;
    }
    try {
      logger.chat.log('Starting match...');
      matchStarted.current = true;
      setIsMatching(true);
      setPartnerName('procurando...');
      await wsService.waitForConnection();
      wsService.findMatch(category);
    } catch (error) {
      logger.chat.error('Match error:', error);
      setIsMatching(false);
      matchStarted.current = false;
    }
  }, [category]);

  const cancelMatch = useCallback(() => {
    logger.chat.log('Cancel match');
    setIsMatching(false);
    matchStarted.current = false;
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
    setMessages((prev) => [...prev, newMessage]);
    wsService.sendMessage(currentRoomId, text.trim());
  }, [currentRoomId]);

  const skipToNext = useCallback(() => {
    if (!currentRoomId) return;
    logger.chat.log('Skipping to next chat');
    wsService.leaveRoom(currentRoomId);
    setIsConnected(false);
    setCurrentRoomId(null);
    setMessages([]);
    setPartnerName('procurando...');
    setIsMatching(true);
    matchStarted.current = false;
    startMatch();
  }, [currentRoomId, startMatch]);

  useEffect(() => {
    logger.chat.log('Registering listeners');
    wsService.onMessage(handleNewMessage);
    wsService.onMatchingFound(handleMatchFound);
    wsService.onQueueStatus(handleQueueStatus);
    wsService.onMatchingCancelled(handleMatchingCancelled);
    wsService.onPartnerTyping(handlePartnerTyping);
    wsService.onPartnerLeft(handlePartnerDisconnect);
    wsService.onPartnerDisconnected(handlePartnerDisconnect);
    wsService.onError(handleSocketError);
    return () => {
      logger.chat.log('Removing listeners');
      wsService.removeAppListeners();
    };
  }, [handleNewMessage, handleMatchFound, handleQueueStatus, handleMatchingCancelled, handlePartnerTyping, handlePartnerDisconnect, handleSocketError]);

  useEffect(() => {
    if (wsService.connected && !currentRoomId && !isMatching && !matchStarted.current) {
      logger.chat.log('Auto starting match');
      startMatch().catch(() => { matchStarted.current = false; });
    }
  }, [currentRoomId, isMatching, startMatch]);

  useEffect(() => {
    if (currentRoomId) {
      logger.chat.log('Match found, resetting lock');
      matchStarted.current = false;
    }
  }, [currentRoomId]);

  return useMemo(() => ({
    messages, isConnected, isMatching, currentRoomId, partnerName, queuePosition, estimatedWait, partnerTyping, startMatch, cancelMatch, sendMessage, skipToNext,
  }), [messages, isConnected, isMatching, currentRoomId, partnerName, queuePosition, estimatedWait, partnerTyping, startMatch, cancelMatch, sendMessage, skipToNext]);
}
