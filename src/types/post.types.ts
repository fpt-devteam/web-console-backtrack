export interface PostAuthor {
  id: string
  displayName?: string | null
  avatarUrl?: string | null
}

export interface PostLocation {
  latitude: number
  longitude: number
}

/** Item trả về từ BE: GET /api/core/posts và GET /api/core/posts/{id} */
export interface Post {
  id: string
  author: PostAuthor
  postType: 'Lost' | 'Found' | string
  itemName: string
  description: string
  imageUrls: string[]
  location?: PostLocation | null
  externalPlaceId?: string | null
  displayAddress?: string | null
  eventTime: string
  createdAt: string
}

/** Item trả về từ BE: GET /api/core/posts/search/semantic (không có author, có similarityScore) */
export interface PostSemanticSearchItem {
  id: string
  postType: string
  itemName: string
  description: string
  imageUrls: string[]
  location?: PostLocation | null
  externalPlaceId?: string | null
  displayAddress?: string | null
  eventTime: string
  createdAt: string
  similarityScore: number
}

export type PostTypeFilter = 'All' | 'Lost' | 'Found'

/** Payload cho POST /api/core/posts (AuthorId do BE lấy từ token) */
export interface CreatePostPayload {
  postType: 'Lost' | 'Found'
  itemName: string
  description: string
  distinctiveMarks?: string | null
  imageUrls: string[]
  location?: { latitude: number; longitude: number } | null
  externalPlaceId?: string | null
  displayAddress?: string | null
  eventTime: string
}

