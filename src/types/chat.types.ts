// ─────────────────────────────────────────────────────────
//  Chat types — mirrors Backtrack.Chat backend interfaces
// ─────────────────────────────────────────────────────────

// ── Enums ──────────────────────────────────────────────

export enum ConversationType {
  PERSONAL = 'personal',
  ORGANIZATION = 'organization',
}

export enum TicketStatus {
  QUEUED = 'queued',
  ASSIGNED = 'assigned',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
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
  attachments?: IMessageAttachment[];
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
  /** The other participant in the conversation */
  partner?: IConversationPartner | null;
  /** Flattened from lastMessage.timestamp for convenience */
  lastMessageAt?: string | null;
  /** Flattened from lastMessage.content for convenience */
  lastMessageContent?: string | null;
  /** The full lastMessage object from the backend */
  lastMessage?: IConversationLastMessage | null;
  unreadCount?: number;
  ticketStatus?: TicketStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface IConversationQueue {
  id: string;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  takenAt?: string | null;
  takenBy?: string | null;
}

// ── WebSocket event payloads ────────────────────────────

export interface WSSendMessagePayload {
  conversationId?: string;
  recipientId?: string;
  orgId?: string;
  type: MessageType;
  content: string;
  attachments?: IMessageAttachment[];
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

// ── API response shapes ─────────────────────────────────

export interface ConversationListResponse {
  conversations: IConversation[];
  nextCursor?: string | null;
}

export interface MessageListResponse {
  messages: IMessage[];
  nextCursor?: string | null;
}

// ── UI-enriched types (frontend only) ──────────────────

/** Conversation enriched with basic sender info for display */
export interface ConversationDisplay extends IConversation {
  senderName?: string;
  senderAvatar?: string;
}
