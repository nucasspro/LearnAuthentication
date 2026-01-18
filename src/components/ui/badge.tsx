import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-none border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-neon-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-neon-500/50 bg-neon-500/10 text-neon-400 hover:bg-neon-500/20",
        secondary:
          "border-white/20 bg-white/5 text-gray-300 hover:bg-white/10",
        destructive:
          "border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20",
        outline: "border-white/20 text-white hover:bg-white/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
