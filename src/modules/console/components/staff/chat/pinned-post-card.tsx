import { motion } from 'framer-motion'
import { PackageSearch, Pin } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useGetPost } from '@/hooks/use-post'
import { Skeleton } from '@/components/ui/skeleton'

interface PinnedPostCardProps {
  postId: string
  orgSlug: string
}

export function PinnedPostCard({ postId, orgSlug }: PinnedPostCardProps) {
  const navigate = useNavigate()
  const { data: post, isLoading } = useGetPost(postId)

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-brand-50 border-b border-brand-100">
        <Pin className="w-3.5 h-3.5 text-brand-300 shrink-0 -rotate-45" strokeWidth={2.5} />
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-2.5 w-16 rounded" />
          <Skeleton className="h-3.5 w-40 rounded" />
        </div>
      </div>
    )
  }

  if (!post) return null

  const imageUrl = post.imageUrls.at(0) ?? null
  const isLost = post.postType === 'Lost'

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onClick={() =>
        navigate({
          to: '/console/$slug/staff/item/$itemId',
          params: { slug: orgSlug, itemId: postId },
        })
      }
      className="w-full flex items-center gap-3 px-4 py-2.5
                 bg-brand-50 border-b border-brand-100
                 hover:bg-brand-100/60 active:bg-brand-100
                 transition-colors text-left overflow-hidden"
    >
      <Pin
        className="w-3.5 h-3.5 text-brand-400 shrink-0 -rotate-45"
        strokeWidth={2.5}
        aria-hidden="true"
      />

      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0 border border-brand-100 shadow-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.postTitle ?? ''}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <PackageSearch className="w-4 h-4 text-gray-300" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-brand-500 uppercase tracking-wider leading-none mb-0.5">
          Pinned item
        </p>
        <p className="text-xs font-semibold text-gray-800 truncate leading-snug">
          {post.postTitle ?? 'Unknown item'}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
              isLost ? 'bg-rose-400' : 'bg-emerald-400'
            }`}
          />
          <span className="text-[10px] text-gray-400">
            {isLost ? 'Lost item' : 'Found item'}
            {post.category ? ` · ${post.category}` : ''}
          </span>
        </div>
      </div>

      <Pin className="w-3.5 h-3.5 text-brand-300 shrink-0 rotate-45" strokeWidth={1.5} />
    </motion.button>
  )
}
