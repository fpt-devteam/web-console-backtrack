import { privateClient } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api-response.type'
import type { PagedResponse } from '@/types/pagination.type'
import type { Post, PostTypeFilter, CreatePostPayload, PostSemanticSearchItem } from '@/types/post.types'

export type GetPostsParams = {
  page?: number
  pageSize?: number
  postType?: PostTypeFilter
  searchTerm?: string
}

export type SearchSemanticParams = {
  searchText: string
  page?: number
  pageSize?: number
  postType?: PostTypeFilter
  latitude?: number
  longitude?: number
  radiusInKm?: number
}

/**
 * BE endpoint semantic search không trả về field author (chỉ có nội dung post).
 * FE cần type Post có author nên gán author rỗng để dùng chung component/UI.
 */
function mapSemanticItemToPost(item: PostSemanticSearchItem): Post & { similarityScore?: number } {
  return {
    id: item.id,
    author: { id: '', displayName: null, avatarUrl: null },
    postType: item.postType,
    itemName: item.itemName,
    description: item.description,
    imageUrls: item.imageUrls ?? [],
    location: item.location ?? null,
    externalPlaceId: item.externalPlaceId ?? null,
    displayAddress: item.displayAddress ?? null,
    eventTime: item.eventTime,
    createdAt: item.createdAt,
    similarityScore: item.similarityScore,
  }
}

export const postService = {
  async getPosts(params: GetPostsParams): Promise<PagedResponse<Post>> {
    const { page = 1, pageSize = 20, postType = 'All', searchTerm } = params

    const { data } = await privateClient.get<ApiResponse<PagedResponse<Post>>>('/api/core/posts', {
      params: {
        page,
        pageSize,
        postType: postType === 'All' ? undefined : postType,
        searchTerm: searchTerm?.trim() ? searchTerm.trim() : undefined,
      },
    })

    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch posts')
    return data.data
  },

  async searchSemantic(params: SearchSemanticParams): Promise<PagedResponse<Post & { similarityScore?: number }>> {
    const { searchText, page = 1, pageSize = 20, postType = 'All', latitude, longitude, radiusInKm } = params
    const trimmed = searchText?.trim()
    if (!trimmed) throw new Error('searchText is required for semantic search')

    const { data } = await privateClient.get<ApiResponse<PagedResponse<PostSemanticSearchItem>>>(
      '/api/core/posts/search/semantic',
      {
        params: {
          searchText: trimmed,
          page,
          pageSize,
          postType: postType === 'All' ? undefined : postType,
          latitude: latitude ?? undefined,
          longitude: longitude ?? undefined,
          radiusInKm: radiusInKm ?? undefined,
        },
      }
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to semantic search posts')
    const raw = data.data
    return {
      items: raw.items.map(mapSemanticItemToPost),
      page: raw.page,
      pageSize: raw.pageSize,
      totalCount: raw.totalCount,
    }
  },

  async getById(postId: string): Promise<Post> {
    const { data } = await privateClient.get<ApiResponse<Post>>(`/api/core/posts/${postId}`)
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch post')
    return data.data
  },

  async create(payload: CreatePostPayload): Promise<Post> {
    const { data } = await privateClient.post<ApiResponse<Post>>('/api/core/posts', {
      postType: payload.postType,
      itemName: payload.itemName,
      description: payload.description,
      distinctiveMarks: payload.distinctiveMarks ?? undefined,
      imageUrls: payload.imageUrls ?? [],
      location: payload.location ?? undefined,
      externalPlaceId: payload.externalPlaceId ?? undefined,
      displayAddress: payload.displayAddress ?? undefined,
      eventTime: payload.eventTime,
    })
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create post')
    return data.data
  },

  async delete(postId: string): Promise<void> {
    await privateClient.delete(`/api/core/posts/${postId}`)
  },
}

