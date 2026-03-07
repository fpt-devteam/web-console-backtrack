import { privateClient } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api-response.type'
import type { PagedResponse } from '@/types/pagination.type'
import type { Post, PostTypeFilter, CreatePostPayload } from '@/types/post.types'

export type GetPostsParams = {
  page?: number
  pageSize?: number
  postType?: PostTypeFilter
  searchTerm?: string
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
}

