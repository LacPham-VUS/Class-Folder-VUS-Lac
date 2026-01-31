// filepath: components/view-mode-switcher.tsx
// Component for switching between different view modes

"use client"

import { LayoutGrid, List, LayoutList } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { NewBadge } from "@/components/ui/new-badge"
import type { ViewMode } from "@/hooks/use-user-preferences"

interface ViewModeSwitcherProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  showNewBadge?: boolean
}

export function ViewModeSwitcher({ value, onChange, showNewBadge = true }: ViewModeSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <ToggleGroup type="single" value={value} onValueChange={(v) => v && onChange(v as ViewMode)}>
        <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view" size="sm">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="compact" aria-label="Compact view" size="sm">
          <LayoutList className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      {showNewBadge && <NewBadge size="sm" />}
    </div>
  )
}
