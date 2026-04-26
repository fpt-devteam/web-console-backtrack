import { pickColor } from './utils'

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
