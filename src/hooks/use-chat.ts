import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { IConversation } from '@/types/chat.types';
import { chatService } from '@/services/chat.service';

// ── Query key factory ───────────────────────────────────

export const chatKeys = {
  all: ['chat'] as const,
  queue: () => [...chatKeys.all, 'queue'] as const,
  assigned: () => [...chatKeys.all, 'assigned'] as const,
  resolved: () => [...chatKeys.all, 'resolved'] as const,
  conversation: (id: string) => [...chatKeys.all, 'conversation', id] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
};

// ── Queue / assigned lists ──────────────────────────────

/**
 * Fetch all conversations currently in the org queue (not yet assigned).
 * Refetches every 15 seconds to catch new tickets.
 */
export function useChatQueue(orgId?: string, options?: { poll?: boolean }) {
  return useQuery({
    queryKey: [...chatKeys.queue(), { orgId }],
    queryFn: () => chatService.listQueue(orgId),
    staleTime: 1000 * 15,
    refetchInterval: (options?.poll ?? false) ? 1000 * 15 : false,
    retry: false,
  });
}

/**
 * Fetch conversations currently assigned to the authenticated staff member.
 */
export function useChatAssigned() {
  return useQuery({
    queryKey: chatKeys.assigned(),
    queryFn: () => chatService.listAssigned(),
    staleTime: 1000 * 30,
    retry: false,
  });
}

/** Fetch resolved (closed) conversations handled by the authenticated staff member. */
export function useChatResolved() {
  return useQuery({
    queryKey: chatKeys.resolved(),
    queryFn: () => chatService.listResolved(),
    staleTime: 1000 * 30,
    retry: false,
  });
}

// ── Single conversation ─────────────────────────────────

export function useConversation(conversationId: string | null) {
  return useQuery({
    queryKey: chatKeys.conversation(conversationId ?? ''),
    queryFn: () => chatService.getConversation(conversationId!),
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Messages (infinite scroll) ──────────────────────────

/**
 * Paginated message history using cursor-based infinite scroll.
 * Pages are ordered from newest (first page) to oldest (later pages).
 */
export function useChatMessages(conversationId: string | null) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId ?? ''),
    queryFn: ({ pageParam }) =>
      chatService.getMessages(conversationId!, {
        cursor: pageParam,
        limit: 30,
      }),
    enabled: !!conversationId,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

// ── Assignment mutations ────────────────────────────────

/** Staff member takes a conversation from the queue */
export function useAssignConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => chatService.assignSelf(conversationId),
    onSuccess: () => {
      // Refresh both lists after assignment
      queryClient.invalidateQueries({ queryKey: chatKeys.queue() });
      queryClient.invalidateQueries({ queryKey: chatKeys.assigned() });
    },
  });
}

/** Staff member resolves (closes) a conversation */
export function useResolveConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => chatService.resolveConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.assigned() });
      queryClient.invalidateQueries({ queryKey: chatKeys.resolved() });
    },
  });
}

/** Staff member returns a conversation back to the queue */
export function useReturnToQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => chatService.returnToQueue(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.queue() });
      queryClient.invalidateQueries({ queryKey: chatKeys.assigned() });
    },
  });
}

/**
 * Create or find an active support conversation with an organisation.
 * Returns the existing conversation if one is already open.
 */
export function useCreateOrFindConversation(options?: {
  onSuccess?: (conv: IConversation) => void;
}) {
  return useMutation({
    mutationFn: (orgId: string) => chatService.createOrFindConversation(orgId),
    onSuccess: options?.onSuccess,
  });
}
