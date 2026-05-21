import { cn } from "@/lib/utils"

type SpinnerSize = "sm" | "md" | "lg"

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  label?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-8 border-[3px]",
}

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-full border-[#dddddd] border-t-[#ff385c] animate-spin",
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      {label && (
        <span className="text-sm text-[#6a6a6a]">{label}</span>
      )}
    </div>
  )
}

