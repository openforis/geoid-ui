import * as React from "react"

import { cn } from "@/lib/utils"
import { controlBase } from "@/components/ui/styles"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        controlBase,
        "w-full border border-border bg-surface px-3 text-sm text-text-primary placeholder:text-text-dim disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
