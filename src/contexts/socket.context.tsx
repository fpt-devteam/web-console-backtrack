import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import type { Socket } from 'socket.io-client';
import type {
  IConversation,
  IMessage,
  MessageListResponse,
  WSConversationUpdatedEvent,
  WSMessageSendSuccess,
  WSMessageSeenEvent,
  WSTypingEvent,
} from '@/types/chat.types';
import { getChatSocket, destroyChatSocket } from '@/lib/chat-socket';
import { auth } from '@/lib/firebase';
import { chatKeys } from '@/hooks/use-chat';

// ─── Payload types ────────────────────────────────────────────────────────────

export interface SendMessagePayload {
  conversationId: string;
  type?: string;
  content: string;
  attachments?: unknown;
  /** Routes to message:send:support when true, otherwise message:send */
  isSupport?: boolean;
}

// ─── Context interface ────────────────────────────────────────────────────────

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  /** Conversation currently open in the chat panel */
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  /** Users currently typing, keyed by userId */
  typingUsers: Record<string, WSTypingEvent>;
  /** Latest message:seen event — useful for optimistic read-receipt UI */
  lastSeenEvent: WSMessageSeenEvent | null;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (payload: SendMessagePayload) => void;
  markConversationAsRead: (conversationId: string) => void;
  sendTypingStart: (conversationId: string) => void;
  sendTypingStop: (conversationId: string) => void;
  /** Subscribe to message:send:success for UI side-effects (toast, navigation, etc.) */
  onMessageSendSuccess: (handler: (data: WSMessageSendSuccess) => void) => () => void;
  /** Subscribe to message:send:support:success for UI side-effects */
  onMessageSendSupportSuccess: (handler: (data: WSMessageSendSuccess) => void) => () => void;
  /** Subscribe to message send errors */
  onMessageSendError: (handler: (data: { code: string; message: string }) => void) => () => void;
  /** Subscribe to message:seen events */
  onMessageSeen: (handler: (data: WSMessageSeenEvent) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

// ─── Cache helpers ────────────────────────────────────────────────────────────

/** Prepend a message to the first page of a messages infinite query. */
function prependMessage(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: string,
  msg: IMessage,
) {
  queryClient.setQueryData<InfiniteData<MessageListResponse>>(
    chatKeys.messages(conversationId),
    (old) => {
      if (!old) {
        return {
          pages: [{ messages: [msg], nextCursor: null, hasMore: false }],
          pageParams: [undefined],
        };
      }
      const [first, ...rest] = old.pages;
      // Deduplicate — server sometimes echoes the same message twice
      if (first.messages.some((m) => m.id === msg.id)) return old;
      return {
        ...old,
        pages: [{ ...first, messages: [msg, ...first.messages] }, ...rest],
      };
    },
  );
}

/** Patch a single conversation in a flat IConversation[] query cache. */
function patchConversation(
  queryClient: ReturnType<typeof useQueryClient>,
  key: readonly unknown[],
  conversationId: string,
  patch: Partial<IConversation>,
) {
  queryClient.setQueryData<IConversation[]>(key, (old) => {
    if (!Array.isArray(old)) return old;
    return old.map((c) => (c.id !== conversationId ? c : { ...c, ...patch }));
  });
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SocketProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeConversationId, setActiveConversationIdState] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, WSTypingEvent>>({});
  const [lastSeenEvent, setLastSeenEvent] = useState<WSMessageSeenEvent | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const joinedRoomRef = useRef<string | null>(null);
  // Mirror of activeConversationId as a ref so event handlers can read it without stale closures
  const activeConvRef = useRef<string | null>(null);
  // Auto-clear timers for typing indicators, keyed by userId
  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // ── Socket lifecycle ─────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        destroyChatSocket();
        socketRef.current = null;
        if (mounted) {
          setSocket(null);
          setIsConnected(false);
        }
        return;
      }

      try {
        const s = await getChatSocket();
        if (!mounted) return;

        socketRef.current = s;
        setSocket(s);

        // ── System events ──────────────────────────────────────────────────
        const handleConnect = () => { if (mounted) setIsConnected(true); };
        const handleDisconnect = () => {
          if (mounted) {
            setIsConnected(false);
            joinedRoomRef.current = null;
          }
        };
        const handleConnectError = (err: Error) => {
          console.error('[Socket] connect_error:', err.message);
          if (mounted) setIsConnected(false);
        };

        // ── message:new — inject incoming message into cache ─────────────
        // If the message belongs to the conversation currently open, auto-mark
        // as read so the unread badge never flickers for the active chat.
        const handleMessageNew = (msg: IMessage) => {
          prependMessage(queryClient, msg.conversationId, msg);
          if (msg.conversationId === activeConvRef.current) {
            s.emit('conversation:read', { conversationId: msg.conversationId });
          }
        };

        // ── message:send:success — inject sender's own message ────────────
        const handleSendSuccess = ({ conversationId, message }: WSMessageSendSuccess) => {
          prependMessage(queryClient, conversationId, message);
        };

        // ── message:send:support:success — same, support channel ─────────
        const handleSendSupportSuccess = ({ conversationId, message }: WSMessageSendSuccess) => {
          prependMessage(queryClient, conversationId, message);
        };

        // ── conversation:updated — patch queue + assigned caches ──────────
        // If the updated conversation is currently active, always show 0
        // unread — the user is looking at it, so it's already "read".
        const handleConversationUpdated = ({
          conversationId,
          unreadCount,
          lastMessage,
        }: WSConversationUpdatedEvent) => {
          const effectiveUnread =
            conversationId === activeConvRef.current ? 0 : unreadCount;

          const patch: Partial<IConversation> = {
            unreadCount: effectiveUnread,
            ...(lastMessage
              ? {
                  lastMessage,
                  lastMessageAt: lastMessage.timestamp,
                  lastMessageContent: lastMessage.content,
                }
              : {}),
          };

          for (const key of [chatKeys.queue(), chatKeys.assigned()] as const) {
            if (queryClient.getQueryData(key)) {
              patchConversation(queryClient, key, conversationId, patch);
            } else {
              void queryClient.invalidateQueries({ queryKey: key });
            }
          }
        };

        // ── conversation:new — invalidate list caches ─────────────────────
        const handleConversationNew = () => {
          void queryClient.invalidateQueries({ queryKey: chatKeys.queue() });
          void queryClient.invalidateQueries({ queryKey: chatKeys.assigned() });
        };

        // ── typing:user — update typing state with auto-clear ─────────────
        const handleTypingUser = (event: WSTypingEvent) => {
          if (!mounted) return;
          const key = event.userId;
          if (event.isTyping) {
            setTypingUsers((prev) => ({ ...prev, [key]: event }));
            clearTimeout(typingTimers.current[key]);
            typingTimers.current[key] = setTimeout(() => {
              setTypingUsers((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
              });
            }, 4000);
          } else {
            clearTimeout(typingTimers.current[key]);
            setTypingUsers((prev) => {
              const next = { ...prev };
              delete next[key];
              return next;
            });
          }
        };

        // ── message:seen ───────────────────────────────────────────────────
        const handleMessageSeen = (event: WSMessageSeenEvent) => {
          if (mounted) setLastSeenEvent(event);
        };

        s.on('connect', handleConnect);
        s.on('disconnect', handleDisconnect);
        s.on('connect_error', handleConnectError);
        s.on('message:new', handleMessageNew);
        s.on('message:send:success', handleSendSuccess);
        s.on('message:send:support:success', handleSendSupportSuccess);
        s.on('conversation:updated', handleConversationUpdated);
        s.on('conversation:new', handleConversationNew);
        s.on('typing:user', handleTypingUser);
        s.on('message:seen', handleMessageSeen);

        if (mounted) setIsConnected(s.connected);

        // Cleanup is registered here so it runs when auth changes or unmount
        const off = () => {
          s.off('connect', handleConnect);
          s.off('disconnect', handleDisconnect);
          s.off('connect_error', handleConnectError);
          s.off('message:new', handleMessageNew);
          s.off('message:send:success', handleSendSuccess);
          s.off('message:send:support:success', handleSendSupportSuccess);
          s.off('conversation:updated', handleConversationUpdated);
          s.off('conversation:new', handleConversationNew);
          s.off('typing:user', handleTypingUser);
          s.off('message:seen', handleMessageSeen);
        };

        // Store cleanup for the unsubscribe callback below
        cleanupRef.current = off;
      } catch (err) {
        console.error('[Socket] init failed:', err);
        if (mounted) setIsConnected(false);
      }
    });

    return () => {
      mounted = false;
      cleanupRef.current?.();
      unsubscribe();
      Object.values(typingTimers.current).forEach(clearTimeout);
    };
  }, [queryClient]);

  const cleanupRef = useRef<(() => void) | null>(null);

  // ── Active conversation + room management ────────────────────────────────────
  const setActiveConversationId = useCallback(
    (id: string | null) => {
      if (id === activeConversationId) return;

      if (socketRef.current && joinedRoomRef.current) {
        socketRef.current.emit('leave:conversation', joinedRoomRef.current);
        joinedRoomRef.current = null;
      }

      activeConvRef.current = id;
      setActiveConversationIdState(id);

      if (socketRef.current && id) {
        socketRef.current.emit('join:conversation', id);
        joinedRoomRef.current = id;
        // Mark as read immediately when opening a conversation
        for (const key of [chatKeys.queue(), chatKeys.assigned()] as const) {
          patchConversation(queryClient, key, id, { unreadCount: 0 });
        }
        socketRef.current.emit('conversation:read', { conversationId: id });
      }
    },
    [activeConversationId, queryClient],
  );

  // ── Room management (manual) ─────────────────────────────────────────────────
  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('join:conversation', conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('leave:conversation', conversationId);
  }, []);

  // ── Mark as read ─────────────────────────────────────────────────────────────
  // Optimistically zero the badge before the server confirms, so there's no
  // visible delay when the user opens a conversation.
  const markConversationAsRead = useCallback(
    (conversationId: string) => {
      for (const key of [chatKeys.queue(), chatKeys.assigned()] as const) {
        patchConversation(queryClient, key, conversationId, { unreadCount: 0 });
      }
      socketRef.current?.emit('conversation:read', { conversationId });
    },
    [queryClient],
  );

  // ── Messaging ────────────────────────────────────────────────────────────────
  const sendMessage = useCallback((payload: SendMessagePayload) => {
    const { isSupport, ...rest } = payload;
    socketRef.current?.emit(isSupport ? 'message:send:support' : 'message:send', rest);
  }, []);

  // ── Typing ───────────────────────────────────────────────────────────────────
  const sendTypingStart = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing:start', {
      conversationId,
      displayName: auth.currentUser?.displayName ?? undefined,
    });
  }, []);

  const sendTypingStop = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing:stop', {
      conversationId,
      displayName: auth.currentUser?.displayName ?? undefined,
    });
  }, []);

  // ── Event subscriptions (for UI side-effects only) ───────────────────────────
  // Cache updates are handled centrally above. These allow components to react
  // to specific events (e.g. navigate on new conversation, show error toast).
  // Call inside useEffect([socket]) to re-subscribe on reconnect.
  const makeSubscriber = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: string) => (handler: (data: any) => void): (() => void) => {
      const s = socketRef.current;
      if (!s) return () => {};
      s.on(event, handler);
      return () => s.off(event, handler);
    },
    [],
  );

  const onMessageSendSuccess = useCallback(
    (handler: (data: WSMessageSendSuccess) => void) =>
      makeSubscriber('message:send:success')(handler),
    [makeSubscriber],
  );

  const onMessageSendSupportSuccess = useCallback(
    (handler: (data: WSMessageSendSuccess) => void) =>
      makeSubscriber('message:send:support:success')(handler),
    [makeSubscriber],
  );

  const onMessageSendError = useCallback(
    (handler: (data: { code: string; message: string }) => void) =>
      makeSubscriber('message:send:error')(handler),
    [makeSubscriber],
  );

  const onMessageSeen = useCallback(
    (handler: (data: WSMessageSeenEvent) => void) =>
      makeSubscriber('message:seen')(handler),
    [makeSubscriber],
  );

  // ── Context value ────────────────────────────────────────────────────────────
  const value = useMemo<SocketContextValue>(
    () => ({
      socket,
      isConnected,
      activeConversationId,
      setActiveConversationId,
      typingUsers,
      lastSeenEvent,
      joinConversation,
      leaveConversation,
      sendMessage,
      markConversationAsRead,
      sendTypingStart,
      sendTypingStop,
      onMessageSendSuccess,
      onMessageSendSupportSuccess,
      onMessageSendError,
      onMessageSeen,
    }),
    [
      socket,
      isConnected,
      activeConversationId,
      setActiveConversationId,
      typingUsers,
      lastSeenEvent,
      joinConversation,
      leaveConversation,
      sendMessage,
      markConversationAsRead,
      sendTypingStart,
      sendTypingStop,
      onMessageSendSuccess,
      onMessageSendSupportSuccess,
      onMessageSendError,
      onMessageSeen,
    ],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSocket(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within <SocketProvider>');
  return ctx;
}
