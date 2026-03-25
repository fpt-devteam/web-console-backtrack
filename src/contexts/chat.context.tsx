import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Socket } from 'socket.io-client';
import { getChatSocket, destroyChatSocket } from '@/lib/chat-socket';
import { auth } from '@/lib/firebase';
import type { WSTypingEvent, WSMessageSeenEvent } from '@/types/chat.types';

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeConversationId, setActiveConversationIdState] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, TypingState>>({});
  const [lastSeenEvent, setLastSeenEvent] = useState<WSMessageSeenEvent | null>(null);

  // Track the currently joined room so we can leave on switch
  const joinedRoomRef = useRef<string | null>(null);
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
          // Auto-clear after 4 seconds (same as ws-test.html)
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
  }, []);

  // ── Active conversation room management ─────────────────
  const setActiveConversationId = useCallback(
    (id: string | null) => {
      if (id === activeConversationId) return;

      // Leave previous room
      if (socket && joinedRoomRef.current) {
        socket.emit('leave:conversation', joinedRoomRef.current);
        joinedRoomRef.current = null;
      }

      setActiveConversationIdState(id);

      // Join new room
      if (socket && id) {
        socket.emit('join:conversation', id);
        joinedRoomRef.current = id;
      }
    },
    [socket, activeConversationId]
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
