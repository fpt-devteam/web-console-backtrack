import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postService, type GetPostsParams } from '@/services/post.service'
import type { CreatePostPayload } from '@/types/post.types'

export const POST_KEYS = {
  list: (params: GetPostsParams) => ['posts', 'list', params] as const,
  byId: (id: string) => ['posts', 'byId', id] as const,
}

export function usePosts(params: GetPostsParams) {
  return useQuery({
    queryKey: POST_KEYS.list(params),
    queryFn: async () => {
      const searchTerm = params.searchTerm?.trim()
      if (searchTerm) {
        return postService.searchSemantic({
          searchText: searchTerm,
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 20,
          postType: params.postType ?? 'All',
        })
      }
      return postService.getPosts(params)
    },
  })
}

export function usePost(postId: string | null) {
  return useQuery({
    queryKey: POST_KEYS.byId(postId ?? ''),
    queryFn: () => postService.getById(postId!),
    enabled: !!postId,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => postService.delete(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.removeQueries({ queryKey: POST_KEYS.byId(postId) })
    },
  })
}

