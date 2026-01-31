// filepath: components/ui/new-badge.tsx
// Badge component to highlight new features

import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewBadgeProps {
  variant?: "default" | "outline" | "secondary"
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  className?: string
}

export function NewBadge({ 
  variant = "default", 
  size = "sm",
  showIcon = true,
  className 
}: NewBadgeProps) {
  return (
    <Badge 
      variant={variant}
      className={cn(
        "gap-1 font-semibold animate-pulse",
        size === "sm" && "text-[10px] px-1.5 py-0",
        size === "md" && "text-xs px-2 py-0.5",
        size === "lg" && "text-sm px-2.5 py-1",
        variant === "default" && "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0",
        variant === "outline" && "border-pink-500 text-pink-600 dark:text-pink-400",
        variant === "secondary" && "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
        className
      )}
    >
      {showIcon && <Sparkles className={cn(
        size === "sm" && "h-2.5 w-2.5",
        size === "md" && "h-3 w-3",
        size === "lg" && "h-3.5 w-3.5"
      )} />}
      NEW
    </Badge>
  )
}
