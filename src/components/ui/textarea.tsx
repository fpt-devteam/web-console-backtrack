import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-[80px] w-full rounded-lg border border-[#dddddd] bg-white px-3 py-2 text-sm text-[#222222]",
        "placeholder:text-[#929292]",
        "transition-colors outline-none",
        "focus:border-[#222222]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[#c13515]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
