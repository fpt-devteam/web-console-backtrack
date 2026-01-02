import { Spinner as HeroSpinner } from "@heroui/react"
import { cn } from "@/lib/utils"

type SpinnerSize = "sm" | "md" | "lg"

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  label?: string
}

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  return (
    <HeroSpinner
      size={size}
      className={cn("mx-auto", className)}
      label={label}
    />
  )
}
