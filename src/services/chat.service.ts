import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type { IConversation, MessageListResponse } from '@/types/chat.types';

const BASE = '/api/chat';

// ── Raw backend shape ──────────────────────────────────────────────────────

interface RawConversation {
  conversationId?: string;
  _id?: string;
  id?: string;
  type?: string;
  orgId?: string | null;
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
  ticketStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/**
 * Normalise the raw backend ConversationResponse into the frontend IConversation.
 * Handles two backend shapes:
 *   1. Queue/assigned lists  → { conversationId, type, partner, lastMessage, … }
 *   2. Single GET / assign   → { conversation: { conversationId, … } }
 */
function normalizeConv(raw: unknown): IConversation {
  const obj = (
    raw && typeof raw === 'object' && 'conversation' in raw
      ? (raw as { conversation: unknown }).conversation
      : raw
  ) as RawConversation;

  return {
    id: (obj.conversationId ?? obj._id ?? obj.id ?? '') as string,
    type: obj.type as IConversation['type'],
    orgId: obj.orgId ?? null,
    partner: obj.partner ?? null,
    lastMessage: obj.lastMessage ?? null,
    lastMessageAt: obj.lastMessage?.timestamp ?? null,
    lastMessageContent: obj.lastMessage?.content ?? null,
    unreadCount: obj.unreadCount ?? 0,
    ticketStatus: obj.ticketStatus as IConversation['ticketStatus'],
    createdAt: (obj.createdAt ?? '') as string,
    updatedAt: (obj.updatedAt ?? '') as string,
    deletedAt: obj.deletedAt ?? null,
  };
}

/** Normalise either a plain array or a `{ conversations: [] }` wrapper. */
function toArray(data: unknown): IConversation[] {
  if (!data) return [];
  const items: unknown[] = Array.isArray(data)
    ? data
    : ((data as { conversations?: unknown[] }).conversations ?? []);
  return items.map(normalizeConv);
}


export const chatService = {
  // ── Queue ──────────────────────────────────────────────

  /**
   * Get all conversations in the org queue (not yet assigned).
   *
   * [B1 FIX] Backend constant `Constants.HEADERS.ORG_ID = 'x-org-id'`.
   * The correct request header is therefore `X-Org-Id`.
   */
  async listQueue(orgId?: string): Promise<IConversation[]> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/queue/staff`,
      {
        headers: orgId ? { 'X-Org-Id': orgId } : undefined,
      }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch queue');
    return toArray(data.data);
  },


  /** Get conversations currently assigned to the authenticated staff. */
  async listAssigned(): Promise<IConversation[]> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/assigned/staff`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch assigned conversations');
    return toArray(data.data);
  },

  // ── Conversation detail ─────────────────────────────────

  /**
   * Get a single conversation by ID.
   *
   * [B3 FIX] Backend wraps the object: { success, data: { conversation: … } }.
   * normalizeConv automatically unwraps the inner `conversation` key.
   */
  async getConversation(conversationId: string): Promise<IConversation> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/${conversationId}`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch conversation');
    return normalizeConv(data.data);
  },

  // ── Messages ────────────────────────────────────────────

  /** Get messages for a conversation (most recent first, cursor-based pagination). */
  async getMessages(
    conversationId: string,
    params?: { cursor?: string; limit?: number }
  ): Promise<MessageListResponse> {
    const { data } = await privateClient.get<ApiResponse<MessageListResponse>>(
      `${BASE}/conversations/${conversationId}/messages`,
      { params: { ...params } }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch messages');
    return data.data ?? { messages: [] };
  },



  // ── Assignment actions ──────────────────────────────────

  /**
   * Staff assigns themselves to a conversation from the queue.
   *
   * [B4 FIX] Backend wraps response: { success, data: { conversation: … } }.
   * normalizeConv automatically unwraps.
   */
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
};
