// ─────────────────────────────────────────────────────────
//  Chat types — mirrors Backtrack.Chat backend interfaces
// ─────────────────────────────────────────────────────────

// ── Enums ──────────────────────────────────────────────

export enum ConversationType {
  PERSONAL = 'personal',
  ORGANIZATION = 'organization',
}

/** Server-side conversation status values */
export enum ConversationStatus {
  QUEUE = 'queue',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VIDEO = 'video',
}

export enum MessageStatus {
  SENT = 'sent',
  SEEN = 'seen',
  FAILED = 'failed',
}

// ── Core domain models ──────────────────────────────────

export interface IMessageAttachment {
  type: MessageType;
  url: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnail?: string;
  duration?: number;
  width?: number;
  height?: number;
}

export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  attachments?: Array<IMessageAttachment>;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/** Mirrors ConversationPartner from Backtrack.Chat backend */
export interface IConversationPartner {
  id: string;
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
}

/** Mirrors ConversationLastMessage from Backtrack.Chat backend */
export interface IConversationLastMessage {
  senderId: string | null;
  content: string;
  timestamp: string | null;
}

/**
 * Frontend conversation model — mirrors ConversationResponse from Backtrack.Chat.
 * The `id` field is normalised from backend's `conversationId` by chatService.
 */
export interface IConversation {
  /** Normalised from backend's `conversationId` */
  id: string;
  type: ConversationType;
  orgId?: string | null;
  orgName?: string | null;
  orgSlug?: string | null;
  orgLogoUrl?: string | null;
  assignedStaffId?: string | null;
  /** The other participant in the conversation */
  partner?: IConversationPartner | null;
  /** Flattened from lastMessage.timestamp for convenience */
  lastMessageAt?: string | null;
  /** Flattened from lastMessage.content for convenience */
  lastMessageContent?: string | null;
  /** The full lastMessage object from the backend */
  lastMessage?: IConversationLastMessage | null;
  unreadCount?: number;
  /** Conversation lifecycle status: queue | in_progress | closed */
  status?: ConversationStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ── WebSocket event payloads ────────────────────────────

export interface WSSendSupportMessagePayload {
  conversationId: string;
  type?: MessageType;
  content: string;
  attachments?: Array<IMessageAttachment>;
}

/** Legacy generic payload — kept for non-support WS flows */
export interface WSSendMessagePayload {
  conversationId?: string;
  recipientId?: string;
  orgId?: string;
  type: MessageType;
  content: string;
  attachments?: Array<IMessageAttachment>;
}

export interface WSTypingPayload {
  conversationId: string;
  displayName?: string;
}

export interface WSTypingEvent {
  conversationId: string;
  userId: string;
  displayName?: string;
  isTyping: boolean;
}

export interface WSMessageSeenEvent {
  conversationId: string;
  readBy: string;
  readAt: string;
}

export interface WSMessageSendSuccess {
  conversationId: string;
  message: IMessage;
  isNewConversation?: boolean;
}

export interface WSJoinSuccess {
  conversationId: string;
}

export interface WSError {
  code: string;
  message: string;
}

/** Pushed to user:{userId} room when a conversation's last message or unread count changes */
export interface WSConversationUpdatedEvent {
  conversationId: string;
  unreadCount: number;
  lastMessage?: {
    senderId: string;
    content: string;
    timestamp: string;
  } | null;
}

// ── API response shapes ─────────────────────────────────

export interface ConversationListResponse {
  conversations: Array<IConversation>;
  nextCursor?: string | null;
  hasMore?: boolean;
}

export interface MessageListResponse {
  messages: Array<IMessage>;
  nextCursor?: string | null;
  hasMore?: boolean;
}

// ── UI-enriched types (frontend only) ──────────────────

/** Conversation enriched with basic sender info for display */
export interface ConversationDisplay extends IConversation {
  senderName?: string;
  senderAvatar?: string;
}
