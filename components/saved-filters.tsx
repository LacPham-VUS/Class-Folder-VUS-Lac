// filepath: components/saved-filters.tsx
// Component for managing saved filters

"use client"

import { useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Filter, Save, Trash2, Check } from "lucide-react"
import { NewBadge } from "@/components/ui/new-badge"
import { useUserPreferences } from "@/hooks/use-user-preferences"

interface SavedFiltersProps {
  type: "student" | "class" | "session"
  currentFilters: Record<string, any>
  onApplyFilter: (filters: Record<string, any>) => void
  showNewBadge?: boolean
}

export function SavedFilters({
  type,
  currentFilters,
  onApplyFilter,
  showNewBadge = true,
}: SavedFiltersProps) {
  const { preferences, saveFilter, removeFilter } = useUserPreferences()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [filterName, setFilterName] = useState("")

  const relevantFilters = preferences.savedFilters.filter(f => f.type === type)

  function handleSaveFilter() {
    if (filterName.trim()) {
      saveFilter(filterName.trim(), type, currentFilters)
      setFilterName("")
      setShowSaveDialog(false)
    }
  }

  const hasActiveFilters = Object.keys(currentFilters).some(
    key => currentFilters[key] !== "all" && currentFilters[key] !== ""
  )

  return (
    <>      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="sm" 
              className="relative gap-2 overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Filter className="h-4 w-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10 font-semibold">Saved Filters</span>
              {relevantFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs relative z-10 bg-white/20 text-white border-white/30">
                  {relevantFilters.length}
                </Badge>
              )}
              {showNewBadge && <NewBadge size="sm" className="relative z-10" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">            <DropdownMenuLabel className="flex items-center justify-between">
              <span>My Saved Filters</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {relevantFilters.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No saved filters yet
              </div>
            ) : (
              relevantFilters.map(filter => (
                <DropdownMenuItem
                  key={filter.id}
                  className="flex items-center justify-between cursor-pointer"
                  onSelect={() => onApplyFilter(filter.filters)}
                >
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 opacity-0" />
                    <span>{filter.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFilter(filter.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>        {hasActiveFilters && (
          <Button
            size="sm"
            className="relative gap-2 overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 group"
            onClick={() => setShowSaveDialog(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Save className="h-4 w-4 relative z-10 group-hover:-rotate-12 transition-transform duration-300" />
            <span className="relative z-10 font-semibold">Save Current</span>
          </Button>
        )}
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Filter</DialogTitle>
            <DialogDescription>
              Give your filter a name to save it for quick access later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filter-name">Filter Name</Label>
              <Input
                id="filter-name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="e.g., Red Risk Students"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveFilter()
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFilter} disabled={!filterName.trim()}>
              Save Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
