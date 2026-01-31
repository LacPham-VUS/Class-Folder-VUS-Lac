// filepath: components/quick-access-bar.tsx
// Quick access bar for frequently accessed items

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Star, X, Zap } from "lucide-react"
import { NewBadge } from "@/components/ui/new-badge"
import { useUserPreferences } from "@/hooks/use-user-preferences"

export function QuickAccessBar() {
  const { preferences, removeQuickAccess } = useUserPreferences()

  if (preferences.quickAccessItems.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium">Quick Access</span>
            <NewBadge size="sm" />
          </div>

          <div className="flex items-center gap-2 flex-1 overflow-x-auto">
            {preferences.quickAccessItems.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-1 bg-white dark:bg-gray-800 border rounded-md px-2 py-1 flex-shrink-0"
              >
                <Link
                  href={`/${item.type}s/${item.id}`}
                  className="text-sm hover:underline"
                >
                  {item.label}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeQuickAccess(item.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
