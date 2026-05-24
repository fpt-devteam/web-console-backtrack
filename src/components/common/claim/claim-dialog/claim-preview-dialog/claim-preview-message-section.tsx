interface ClaimPreviewMessageSectionProps {
  message?: string | null
}

export function ClaimPreviewMessageSection({ message }: ClaimPreviewMessageSectionProps) {
  return (
    <div className="px-5 flex flex-col gap-2">
      <span className="text-[10px] font-semibold tracking-widest text-mute uppercase">Latest Message</span>
      <div className="bg-[#f7f7f7] rounded-xl px-4 py-3">
        <p className="text-sm text-ink line-clamp-2">{message ?? 'No messages yet'}</p>
      </div>
    </div>
  )
}
