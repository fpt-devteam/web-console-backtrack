import type { ApiResponse } from '@/types/api-response.type';
import type {
  ConversationListResponse,
  IConversation,
  MessageListResponse,
} from '@/types/chat.types';
import { privateClient } from '@/lib/api-client';

const BASE = '/api/chat';

// ── Raw backend shape ──────────────────────────────────────────────────────

interface RawConversation {
  conversationId?: string;
  _id?: string;
  id?: string;
  type?: string;
  orgId?: string | null;
  orgName?: string | null;
  orgSlug?: string | null;
  orgLogoUrl?: string | null;
  assignedStaffId?: string | null;
  status?: string;
  partner?: {
    id: string;
    displayName: string | null;
    email: string | null;
    avatarUrl: string | null;
  } | null;
  lastMessage?: {
    senderId: string | null;
    content: string;
    timestamp: string | null;
  } | null;
  unreadCount?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/**
 * Normalise the raw backend ConversationResponse into the frontend IConversation.
 * Handles two backend shapes:
 *   1. List responses   → { conversationId, type, partner, lastMessage, … }
 *   2. Single GET/assign → { conversation: { conversationId, … } }
 */
export function normalizeConv(raw: unknown): IConversation {
  const obj = (
    raw && typeof raw === 'object' && 'conversation' in raw
      ? (raw as { conversation: unknown }).conversation
      : raw
  ) as RawConversation;

  return {
    id: (obj.conversationId ?? obj._id ?? obj.id ?? ''),
    type: obj.type as IConversation['type'],
    orgId: obj.orgId ?? null,
    orgName: obj.orgName ?? null,
    orgSlug: obj.orgSlug ?? null,
    orgLogoUrl: obj.orgLogoUrl ?? null,
    assignedStaffId: obj.assignedStaffId ?? null,
    partner: obj.partner ?? null,
    lastMessage: obj.lastMessage ?? null,
    lastMessageAt: obj.lastMessage?.timestamp ?? null,
    lastMessageContent: obj.lastMessage?.content ?? null,
    unreadCount: obj.unreadCount ?? 0,
    status: obj.status as IConversation['status'],
    createdAt: (obj.createdAt ?? ''),
    updatedAt: (obj.updatedAt ?? ''),
    deletedAt: obj.deletedAt ?? null,
  };
}

interface RawListPayload {
  conversations?: Array<unknown>;
  nextCursor?: string | null;
  hasMore?: boolean;
}

/** Normalise a `{ conversations, nextCursor, hasMore }` wrapper or plain array. */
export function toList(data: unknown): ConversationListResponse {
  if (!data) return { conversations: [] };
  const items: Array<unknown> = Array.isArray(data)
    ? data
    : ((data as RawListPayload).conversations ?? []);
  const payload = data as RawListPayload;
  return {
    conversations: items.map(normalizeConv),
    nextCursor: payload.nextCursor ?? null,
    hasMore: payload.hasMore ?? false,
  };
}


export const chatService = {
  // ── Support conversation ────────────────────────────────

  /**
   * Create or find an active support conversation with the given organisation.
   * If an active conversation already exists for the current user + org, it is returned.
   */
  async createOrFindConversation(orgId: string): Promise<IConversation> {
    const { data } = await privateClient.post<ApiResponse<unknown>>(
      `${BASE}/conversations/organization`,
      { orgId }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create conversation');
    return normalizeConv(data.data);
  },

  // ── Queue ──────────────────────────────────────────────

  /**
   * List support conversations currently waiting in queue for the caller's org.
   * Requires X-Org-Id header (injected automatically by the Axios interceptor).
   */
  async listQueue(orgId?: string): Promise<Array<IConversation>> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/organization/queue`,
      {
        headers: orgId ? { 'X-Org-Id': orgId } : undefined,
      }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch queue');
    return toList(data.data).conversations;
  },

  /** List conversations currently assigned to the authenticated staff member. */
  async listAssigned(): Promise<Array<IConversation>> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/organization/assigned`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch assigned conversations');
    return toList(data.data).conversations;
  },

  // ── Conversation detail ─────────────────────────────────

  async getConversation(conversationId: string): Promise<IConversation> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/${conversationId}`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch conversation');
    return normalizeConv(data.data);
  },

  // ── Messages ────────────────────────────────────────────

  /** Get messages for a conversation (newest first, cursor-based pagination). */
  async getMessages(
    conversationId: string,
    params?: { cursor?: string; limit?: number }
  ): Promise<MessageListResponse> {
    const { data } = await privateClient.get<ApiResponse<MessageListResponse>>(
      `${BASE}/conversations/${conversationId}/messages`,
      { params: { ...params } }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch messages');
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return data.data ?? { messages: [] };
  },

  // ── Assignment actions ──────────────────────────────────

  /** Staff assigns themselves to a queued conversation. */
  async assignSelf(conversationId: string): Promise<IConversation> {
    const { data } = await privateClient.post<ApiResponse<unknown>>(
      `${BASE}/conversations/${conversationId}/assign-staff`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to assign conversation');
    return normalizeConv(data.data);
  },

  /** Return a conversation back to the queue. */
  async returnToQueue(conversationId: string): Promise<void> {
    const { data } = await privateClient.post<ApiResponse<void>>(
      `${BASE}/conversations/${conversationId}/unassign-staff`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to return conversation to queue');
  },

  /** Resolve (close) a conversation. */
  async resolveConversation(conversationId: string): Promise<void> {
    const { data } = await privateClient.post<ApiResponse<void>>(
      `${BASE}/conversations/${conversationId}/resolve`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to resolve conversation');
  },

  /** List resolved conversations assigned to the authenticated staff member. */
  async listResolved(): Promise<Array<IConversation>> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/organization/resolved`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch resolved conversations');
    return toList(data.data).conversations;
  },
};
