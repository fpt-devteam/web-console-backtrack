import type { ApiResponse } from '@/types/api-response.type';
import type {
  ConversationListResponse,
  IConversation,
  MessageListResponse,
  SupportFormData,
} from '@/types/chat.types';
import { privateClient } from '@/lib/api-client';

const BASE = '/api/chat';

// ── Raw backend shape ──────────────────────────────────────────────────────
interface RawConversation {
  conversationId?: string;
  _id?: string;
  id?: string;
  type?: string;
  orgId?: string;
  orgName?: string;
  orgSlug?: string;
  orgLogoUrl?: string;
  assignedStaff?: {
    id: string;
    displayName: string | null;
    email: string | null;
    avatarUrl: string | null;
  } | null;
  supportFormData?: SupportFormData;
  status?: string;
  partner?: {
    id: string;
    displayName: string | null;
    email: string | null;
    avatarUrl: string | null;
  };
  lastMessage?: {
    senderId: string | null;
    content: string;
    timestamp: string | null;
  } | null;
  unreadCount?: number;
  firstAssignedAt?: string | null;
  verifiedAt?: string | null;
  resolvedAt?: string | null;
  rejectedAt?: string | null;
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
    orgId: obj.orgId ?? '',
    orgName: obj.orgName ?? '',
    orgSlug: obj.orgSlug ?? '',
    orgLogoUrl: obj.orgLogoUrl ?? '',
    assignedStaff: obj.assignedStaff ?? undefined,
    supportFormData: obj.supportFormData!,
    partner: obj.partner!,
    lastMessage: obj.lastMessage ?? null,
    lastMessageAt: obj.lastMessage?.timestamp ?? null,
    lastMessageContent: obj.lastMessage?.content ?? null,
    unreadCount: obj.unreadCount ?? 0,
    status: obj.status as IConversation['status'],
    firstAssignedAt: obj.firstAssignedAt ?? null,
    verifiedAt: obj.verifiedAt ?? null,
    resolvedAt: obj.resolvedAt ?? null,
    rejectedAt: obj.rejectedAt ?? null,
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
    const { data } = await privateClient.get<ApiResponse<IConversation>>(
      `${BASE}/conversations/organization/queue`,
      {
        headers: orgId ? { 'X-Org-Id': orgId } : undefined,
      }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch queue');
    return toList(data.data).conversations;
  },

  /** List conversations currently assigned to the authenticated staff member. */
  async listAssigned({ isMe }: { isMe: boolean }): Promise<Array<IConversation>> {
    const { data } = await privateClient.get<ApiResponse<IConversation>>(
      `${BASE}/conversations/organization/assigned`,
      {
        params: {
          isMe,
        }
      }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch assigned conversations');
    return toList(data.data).conversations;
  },

  // ── Conversation detail ─────────────────────────────────

  async getConversation(conversationId: string, orgId?: string): Promise<IConversation> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/${conversationId}`,
      orgId ? { params: { orgId } } : undefined
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

  /**
   * Mark a conversation as verified (claimant ownership confirmed).
   * Pass `postId` to attach/confirm the matched inventory item on the claim
   * (used for the unlinked case; omit when the claim is already linked).
   */
  async verifyConversation(conversationId: string, postId?: string): Promise<void> {
    const { data } = await privateClient.post<ApiResponse<void>>(
      `${BASE}/conversations/${conversationId}/verify`,
      postId ? { postId } : undefined
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to verify conversation');
  },

  /** Resolve (close) a conversation. */
  async resolveConversation(conversationId: string): Promise<void> {
    const { data } = await privateClient.post<ApiResponse<void>>(
      `${BASE}/conversations/${conversationId}/resolve`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to resolve conversation');
  },

  /** Reject (deny & close) a conversation. */
  async rejectConversation(conversationId: string): Promise<void> {
    const { data } = await privateClient.post<ApiResponse<void>>(
      `${BASE}/conversations/${conversationId}/reject`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to reject conversation');
  },

  /** List resolved conversations assigned to the authenticated staff member. */
  async listResolved({ isMe }: { isMe: boolean }): Promise<Array<IConversation>> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/organization/resolved`,
      {
        params: {
          isMe,
        }
      }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch resolved conversations');
    return toList(data.data).conversations;
  },

  /** List rejected conversations assigned to the authenticated staff member. */
  async listRejected({ isMe }: { isMe: boolean }): Promise<Array<IConversation>> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/organization/rejected`,
      {
        params: {
          isMe,
        }
      }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch rejected conversations');
    return toList(data.data).conversations;
  },

  /** List verified conversations for the org (claimant ownership confirmed, not yet resolved). */
  async listVerified({ isMe }: { isMe: boolean }): Promise<Array<IConversation>> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/organization/verified`,
      {
        params: {
          isMe,
        }
      }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch verified conversations');
    return toList(data.data).conversations;
  },

  /** List all conversations related to a specific inventory post (item). */
  async listByPostId(postId: string, orgId?: string): Promise<Array<IConversation>> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/organization/posts/${postId}`,
      {
        headers: orgId ? { 'X-Org-Id': orgId } : undefined,
      }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch conversations');
    return toList(data.data).conversations;
  },

  /** List all conversations whose claim request targets the given subcategory. */
  async listBySubcategoryId(subcategoryId: string, orgId?: string): Promise<Array<IConversation>> {
    const { data } = await privateClient.get<ApiResponse<unknown>>(
      `${BASE}/conversations/organization/subcategories/${subcategoryId}`,
      {
        headers: orgId ? { 'X-Org-Id': orgId } : undefined,
      }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch conversations');
    return toList(data.data).conversations;
  },

  /** Close all queued conversations linked to a post (called after handover). */
  async closePostConversations(postId: string): Promise<void> {
    const { data } = await privateClient.post<ApiResponse<void>>(
      `${BASE}/conversations/organization/posts/${postId}/close`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to close conversations');
  },
};
