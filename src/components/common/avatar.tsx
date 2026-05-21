interface AvatarProps {
  url?: string | null
  name: string
  className: string
}

export function Avatar({ url, name, className }: AvatarProps) {
  if (url) return <img src={url} alt={name} className={className} />
  return (
    <div
      className={`${className} flex items-center justify-center text-white font-semibold select-none`}
      style={{ backgroundColor: pickColor(name) }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

const AVATAR_COLORS = [
  '#E67E22', '#E74C3C', '#9B59B6', '#2980B9',
  '#27AE60', '#16A085', '#D35400', '#8E44AD',
  '#2471A3', '#1E8449',
]

function pickColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}