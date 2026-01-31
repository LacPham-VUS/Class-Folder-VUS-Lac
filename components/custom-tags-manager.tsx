// filepath: components/custom-tags-manager.tsx
// Component for managing custom tags

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tag, Plus, Trash2 } from "lucide-react"
import { NewBadge } from "@/components/ui/new-badge"
import { useUserPreferences } from "@/hooks/use-user-preferences"

const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#84cc16", // lime
  "#10b981", // emerald
  "#14b8a6", // teal
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#ec4899", // pink
]

interface CustomTagsManagerProps {
  showNewBadge?: boolean
}

export function CustomTagsManager({ showNewBadge = true }: CustomTagsManagerProps) {
  const { preferences, addCustomTag, removeCustomTag } = useUserPreferences()
  const [open, setOpen] = useState(false)
  const [tagName, setTagName] = useState("")
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])

  function handleAddTag() {
    if (tagName.trim()) {
      addCustomTag(tagName.trim(), selectedColor)
      setTagName("")
      setSelectedColor(PRESET_COLORS[0])
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="relative gap-2 overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Tag className="h-4 w-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10 font-semibold">Custom Tags</span>
          {preferences.customTags.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 text-xs relative z-10 bg-white/20 text-white border-white/30">
              {preferences.customTags.length}
            </Badge>
          )}
          {showNewBadge && <NewBadge size="sm" className="relative z-10" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Manage Custom Tags
            {showNewBadge && <NewBadge />}
          </DialogTitle>
          <DialogDescription>
            Create custom tags to organize and categorize students, classes, or sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Add new tag */}
          <div className="grid gap-4 p-4 border rounded-lg bg-muted/50">
            <div className="grid gap-2">
              <Label htmlFor="tag-name">Tag Name</Label>
              <Input
                id="tag-name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g., VIP Student, Needs Attention"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTag()
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-md border-2 transition-all ${
                      selectedColor === color
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <Button onClick={handleAddTag} disabled={!tagName.trim()} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </div>

          {/* Existing tags */}
          <div className="grid gap-2">
            <Label>Your Tags ({preferences.customTags.length})</Label>
            {preferences.customTags.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg">
                No custom tags yet. Create one above!
              </div>
            ) : (
              <div className="grid gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                {preferences.customTags.map(tag => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                  >
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: tag.color,
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeCustomTag(tag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
