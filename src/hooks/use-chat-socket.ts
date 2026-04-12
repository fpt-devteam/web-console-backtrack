import { useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { chatKeys } from './use-chat';
import type {
  IMessage,
  WSConversationUpdatedEvent,
  WSMessageSendSuccess,
  WSSendSupportMessagePayload,
} from '@/types/chat.types';
import { useChatContext } from '@/contexts/chat.context';
import { auth } from '@/lib/firebase';
import { MessageType } from '@/types/chat.types';

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
        chatKeys.messages(conversationId),
        (old: { pages: Array<{ messages: Array<IMessage> }> } | undefined) => {
          if (!old) return old;
          const [firstPage, ...rest] = old.pages;
          return {
            ...old,
            pages: [
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              { ...firstPage, messages: [msg, ...(firstPage.messages ?? [])] },
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
 * Returns a `send` function that emits a `message:send:support` WS event.
 * On `message:send:support:success` the returned message is injected into cache.
 * On `message:send:support:error` the optional `onError` callback is called.
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

      queryClient.setQueryData(
        chatKeys.messages(conversationId),
        (old: { pages: Array<{ messages: Array<IMessage> }>; pageParams: unknown[] } | undefined) => {
          if (!old) {
            return {
              pages: [{ messages: [message], nextCursor: null }],
              pageParams: [undefined],
            };
          }
          const [firstPage, ...rest] = old.pages;
          return {
            ...old,
            pages: [
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              { ...firstPage, messages: [message, ...(firstPage.messages ?? [])] },
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

    socket.on('message:send:support:success', handleSuccess);
    socket.on('message:send:support:error', handleError);

    return () => {
      socket.off('message:send:support:success', handleSuccess);
      socket.off('message:send:support:error', handleError);
    };
  }, [socket, queryClient]);

  const send = useCallback(
    (payload: Omit<WSSendSupportMessagePayload, 'conversationId'> & { conversationId?: string }) => {
      if (!socket?.connected) {
        console.warn('[useSendMessage] Socket not connected');
        return;
      }
      const conversationId = payload.conversationId ?? activeConversationId;
      if (!conversationId) {
        console.warn('[useSendMessage] No conversationId');
        return;
      }
      const finalPayload: WSSendSupportMessagePayload = {
        conversationId,
        type: payload.type ?? MessageType.TEXT,
        content: payload.content,
        attachments: payload.attachments,
      };

      socket.emit('message:send:support', finalPayload);
    },
    [socket, activeConversationId]
  );

  return { send };
}

// ── useTypingIndicator ─────────────────────────────────

/**
 * Returns `startTyping` / `stopTyping` helpers that emit WS events,
 * with debounce so `stopTyping` fires automatically after 3 s of silence.
 * Includes the current user's displayName in the payload per API spec.
 */
export function useTypingIndicator() {
  const { socket, activeConversationId } = useChatContext();
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTyping = useCallback(() => {
    if (!socket?.connected || !activeConversationId) return;
    if (stopTimer.current) { clearTimeout(stopTimer.current); stopTimer.current = null; }
    socket.emit('typing:stop', {
      conversationId: activeConversationId,
      displayName: auth.currentUser?.displayName ?? undefined,
    });
  }, [socket, activeConversationId]);

  const startTyping = useCallback(() => {
    if (!socket?.connected || !activeConversationId) return;
    socket.emit('typing:start', {
      conversationId: activeConversationId,
      displayName: auth.currentUser?.displayName ?? undefined,
    });

    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(stopTyping, 3000);
  }, [socket, activeConversationId, stopTyping]);

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

// ── useConversationUpdates ─────────────────────────────

/**
 * Listen to `conversation:updated` events pushed to the user's personal room.
 * Updates the conversation's lastMessage and unreadCount in the React Query cache
 * for both queue and assigned lists without requiring a full refetch.
 *
 * Mount once at the chat page level.
 */
export function useConversationUpdates() {
  const { socket } = useChatContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    function handleConversationUpdated(event: WSConversationUpdatedEvent) {
      const { conversationId, unreadCount, lastMessage } = event;

      type ConvEntry = { id?: string; unreadCount?: number; lastMessage?: unknown; lastMessageAt?: string; lastMessageContent?: string };

      // Patch both queue and assigned caches in-place
      const patchList = (queryKey: ReadonlyArray<unknown>) => {
        queryClient.setQueryData(
          queryKey,
          (old: Array<ConvEntry> | undefined) => {
            if (!Array.isArray(old)) return old;
            return old.map((conv) => {
              if (conv.id !== conversationId) return conv;
              return {
                ...conv,
                unreadCount,
                ...(lastMessage != null && {
                  lastMessage,
                  lastMessageAt: lastMessage.timestamp,
                  lastMessageContent: lastMessage.content,
                }),
              };
            });
          }
        );
      };

      patchList(chatKeys.queue());
      patchList(chatKeys.assigned());
    }

    socket.on('conversation:updated', handleConversationUpdated);
    return () => { socket.off('conversation:updated', handleConversationUpdated); };
  }, [socket, queryClient]);
}
