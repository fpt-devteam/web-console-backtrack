import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Socket } from 'socket.io-client';
import { getChatSocket, destroyChatSocket } from '@/lib/chat-socket';
import { auth } from '@/lib/firebase';
import type { IConversation, WSTypingEvent, WSMessageSeenEvent } from '@/types/chat.types';
import { chatKeys } from '@/hooks/use-chat';

// ── Cache helper ─────────────────────────────────────────
function patchConvUnread(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: string,
  unreadCount: number,
) {
  for (const key of [chatKeys.queue(), chatKeys.assigned()] as const) {
    queryClient.setQueryData<IConversation[]>(key, (old) => {
      if (!Array.isArray(old)) return old;
      return old.map((c) => (c.id !== conversationId ? c : { ...c, unreadCount }));
    });
  }
}

// ── Types ───────────────────────────────────────────────

interface TypingState {
  userId: string;
  displayName?: string;
  conversationId: string;
}

interface ChatContextValue {
  /** The Socket.io socket instance (null while connecting) */
  socket: Socket | null;
  /** Whether the socket is currently connected */
  isConnected: boolean;
  /** The conversation ID currently visible in the chat panel */
  activeConversationId: string | null;
  /** Set the active conversation (triggers room join automatically) */
  setActiveConversationId: (id: string | null) => void;
  /** Users currently typing, keyed by userId */
  typingUsers: Record<string, TypingState>;
  /** Last seen event, useful for updating UI optimistically */
  lastSeenEvent: WSMessageSeenEvent | null;
}

// ── Context ──────────────────────────────────────────────

const ChatContext = createContext<ChatContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeConversationId, setActiveConversationIdState] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, TypingState>>({});
  const [lastSeenEvent, setLastSeenEvent] = useState<WSMessageSeenEvent | null>(null);

  // Track the currently joined room so we can leave on switch
  const joinedRoomRef = useRef<string | null>(null);
  // Mirror activeConversationId as ref — event handlers read this without stale closures
  const activeConvRef = useRef<string | null>(null);
  // Stable ref to socket so setActiveConversationId doesn't go stale
  const socketRef = useRef<Socket | null>(null);
  // Typing timeout handles keyed by userId
  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // ── Connect socket on mount ─────────────────────────────
  useEffect(() => {
    let mounted = true;

    // Only connect when Firebase user is ready
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        destroyChatSocket();
        if (mounted) {
          setSocket(null);
          setIsConnected(false);
        }
        return;
      }

      const s = await getChatSocket();
      if (!mounted) return;

      socketRef.current = s;
      setSocket(s);

      // ── System events ──
      s.on('connect', () => {
        if (mounted) setIsConnected(true);
      });

      s.on('disconnect', () => {
        if (mounted) {
          setIsConnected(false);
          joinedRoomRef.current = null;
        }
      });

      // ── message:new — auto-read if message lands in active conversation ──
      s.on('message:new', (msg: { conversationId: string }) => {
        if (!mounted) return;
        if (msg.conversationId === activeConvRef.current) {
          patchConvUnread(queryClient, msg.conversationId, 0);
          s.emit('conversation:read', { conversationId: msg.conversationId });
        }
      });

      // ── Global typing listener ──
      s.on('typing:user', (event: WSTypingEvent) => {
        if (!mounted) return;
        const key = event.userId;
        if (event.isTyping) {
          setTypingUsers((prev) => ({
            ...prev,
            [key]: {
              userId: event.userId,
              displayName: event.displayName,
              conversationId: event.conversationId,
            },
          }));
          // Auto-clear after 4 seconds
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
      });

      // ── Global seen listener ──
      s.on('message:seen', (event: WSMessageSeenEvent) => {
        if (mounted) setLastSeenEvent(event);
      });

      if (mounted) setIsConnected(s.connected);
    });

    return () => {
      mounted = false;
      unsubscribe();
      // Cleanup typing timers
      Object.values(typingTimers.current).forEach(clearTimeout);
    };
  }, [queryClient]);

  // ── Active conversation room management ─────────────────
  const setActiveConversationId = useCallback(
    (id: string | null) => {
      if (id === activeConversationId) return;

      const s = socketRef.current;

      // Leave previous room
      if (s && joinedRoomRef.current) {
        s.emit('leave:conversation', joinedRoomRef.current);
        joinedRoomRef.current = null;
      }

      // Update ref first so the message:new handler reads the correct value
      activeConvRef.current = id;
      setActiveConversationIdState(id);

      // Join new room + optimistically zero unread + emit read
      if (s && id) {
        s.emit('join:conversation', id);
        joinedRoomRef.current = id;
        // Optimistic: clear badge immediately so UI feels instant
        patchConvUnread(queryClient, id, 0);
        s.emit('conversation:read', { conversationId: id });
      }
    },
    [activeConversationId, queryClient]
  );

  // ── Context value ───────────────────────────────────────
  const value = useMemo<ChatContextValue>(
    () => ({
      socket,
      isConnected,
      activeConversationId,
      setActiveConversationId,
      typingUsers,
      lastSeenEvent,
    }),
    [socket, isConnected, activeConversationId, setActiveConversationId, typingUsers, lastSeenEvent]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// ── Hook ─────────────────────────────────────────────────

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within <ChatProvider>');
  return ctx;
}
