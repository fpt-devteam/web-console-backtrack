import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postService  } from '@/services/post.service'
import type {GetPostsParams} from '@/services/post.service';
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

export type PinnedPostData = {
  id: string
  postType: string
  postTitle: string | null
  category: string | null
  imageUrls: string[]
}

export function useGetPost(postId: string | null) {
  return useQuery<PinnedPostData>({
    queryKey: [...POST_KEYS.byId(postId ?? ''), 'pinned'] as const,
    queryFn: async () => {
      // Post type is incomplete — the endpoint also returns postTitle and category
      const raw = await postService.getById(postId!) as unknown as Record<string, unknown>
      return {
        id: raw['id'] as string,
        postType: raw['postType'] as string,
        postTitle: (raw['postTitle'] ?? raw['itemName'] ?? null) as string | null,
        category: (raw['category'] ?? null) as string | null,
        imageUrls: (raw['imageUrls'] ?? []) as string[],
      }
    },
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

