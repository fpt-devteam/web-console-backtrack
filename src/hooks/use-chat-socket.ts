import { useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useChatContext } from '@/contexts/chat.context';
import { chatKeys } from './use-chat';
import type {
  IMessage,
  WSSendMessagePayload,
  WSMessageSendSuccess,
} from '@/types/chat.types';

// ── useIncomingMessages ─────────────────────────────────

/**
 * Subscribe to real-time incoming messages and inject them
 * into the TanStack Query cache for the active conversation.
 *
 * Must be mounted in a component that is inside ChatProvider.
 */
export function useIncomingMessages(conversationId: string | null) {
  const { socket } = useChatContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !conversationId) return;

    function handleNewMessage(msg: IMessage) {
      if (msg.conversationId !== conversationId) return;

      // Prepend to first (newest) page of the infinite query
      queryClient.setQueryData(
        chatKeys.messages(conversationId!),
        (old: { pages: { messages: IMessage[] }[] } | undefined) => {
          if (!old) return old;
          const [firstPage, ...rest] = old.pages;
          return {
            ...old,
            pages: [
              { ...firstPage, messages: [msg, ...(firstPage?.messages ?? [])] },
              ...rest,
            ],
          };
        }
      );
    }

    socket.on('message:new', handleNewMessage);
    return () => { socket.off('message:new', handleNewMessage); };
  }, [socket, conversationId, queryClient]);
}

// ── useSendMessage ─────────────────────────────────────

/**
 * Returns a `send` function that emits a `message:send` WS event.
 * On `message:send:success` the returned message is injected into cache.
 * On `message:send:error` the optional `onError` callback is called.
 */
export function useSendMessage(options?: {
  onSuccess?: (data: WSMessageSendSuccess) => void;
  onError?: (err: { code: string; message: string }) => void;
}) {
  const { socket, activeConversationId } = useChatContext();
  const queryClient = useQueryClient();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!socket) return;

    function handleSuccess(data: WSMessageSendSuccess) {
      const { conversationId, message } = data;

      // Inject sent message into cache.
      // If the infinite query hasn't fetched yet (old === undefined),
      // seed it with an initial page so the message is visible immediately.
      queryClient.setQueryData(
        chatKeys.messages(conversationId),
        (old: { pages: { messages: IMessage[] }[]; pageParams: unknown[] } | undefined) => {
          if (!old) {
            // No pages yet — create the first page
            return {
              pages: [{ messages: [message], nextCursor: null }],
              pageParams: [undefined],
            };
          }
          const [firstPage, ...rest] = old.pages;
          return {
            ...old,
            pages: [
              { ...firstPage, messages: [message, ...(firstPage?.messages ?? [])] },
              ...rest,
            ],
          };
        }
      );

      optionsRef.current?.onSuccess?.(data);
    }

    function handleError(err: { code: string; message: string }) {
      optionsRef.current?.onError?.(err);
    }

    socket.on('message:send:success', handleSuccess);
    socket.on('message:send:error', handleError);

    return () => {
      socket.off('message:send:success', handleSuccess);
      socket.off('message:send:error', handleError);
    };
  }, [socket, queryClient]);

  const send = useCallback(
    (payload: WSSendMessagePayload) => {
      if (!socket?.connected) {
        console.warn('[useSendMessage] Socket not connected');
        return;
      }
      // Fill conversationId from context if sending to current room
      const finalPayload: WSSendMessagePayload =
        !payload.conversationId && !payload.recipientId && !payload.orgId && activeConversationId
          ? { ...payload, conversationId: activeConversationId }
          : payload;

      socket.emit('message:send', finalPayload);
    },
    [socket, activeConversationId]
  );

  return { send };
}

// ── useTypingIndicator ─────────────────────────────────

/**
 * Returns `startTyping` / `stopTyping` helpers that emit WS events,
 * with debounce so `stopTyping` fires automatically after 3 s of silence.
 */
export function useTypingIndicator() {
  const { socket, activeConversationId } = useChatContext();
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTyping = useCallback(() => {
    if (!socket?.connected || !activeConversationId) return;
    if (stopTimer.current) { clearTimeout(stopTimer.current); stopTimer.current = null; }
    socket.emit('typing:stop', { conversationId: activeConversationId });
  }, [socket, activeConversationId]);

  const startTyping = useCallback(() => {
    if (!socket?.connected || !activeConversationId) return;
    socket.emit('typing:start', { conversationId: activeConversationId });

    // Auto-stop after 3 seconds
    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(stopTyping, 3000);
  }, [socket, activeConversationId, stopTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, []);

  return { startTyping, stopTyping };
}

// ── useMarkSeen ────────────────────────────────────────

/** Emit conversation:read to mark all messages as seen */
export function useMarkSeen() {
  const { socket } = useChatContext();

  return useCallback(
    (conversationId: string) => {
      if (!socket?.connected) return;
      socket.emit('conversation:read', { conversationId });
    },
    [socket]
  );
}
