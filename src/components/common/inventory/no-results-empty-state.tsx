import type { ReactNode } from 'react'
import emptySearchImg from '@/assets/empty-search.png'

export function NoResultsEmptyState({
  title = 'No matching results found',
  description = 'Try adjusting your search terms or filters.',
  action,
  className,
}: {
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={className ?? ''}>
      <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
        <img
          src={emptySearchImg}
          alt=""
          className=" h-64 w-64 object-contain"
          loading="lazy"
          decoding="async"
        />
        <h3 className="text-xl font-semibold text-[#222222]">{title}</h3>
        <p className=" text-sm text-[#6a6a6a]">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  )
}

