// filepath: components/dashboard-customizer.tsx
// Component for customizing dashboard layout and widgets

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings2, GripVertical } from "lucide-react"
import { NewBadge } from "@/components/ui/new-badge"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { cn } from "@/lib/utils"

const WIDGET_INFO = {
  overview: {
    name: "Overview Statistics",
    description: "Key metrics and summary cards",
  },
  riskStudents: {
    name: "At-Risk Students",
    description: "Students requiring attention",
  },
  upcomingSessions: {
    name: "Upcoming Sessions",
    description: "Next scheduled classes",
  },
  recentNotes: {
    name: "Recent Notes",
    description: "Latest student observations",
  },
  parentCommunications: {
    name: "Parent Communications",
    description: "Recent parent interactions",
  },
  analytics: {
    name: "Analytics & Insights",
    description: "Data visualizations and trends",
  },
}

export function DashboardCustomizer() {
  const { preferences, toggleWidget, reorderWidgets } = useUserPreferences()
  const [open, setOpen] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const sortedWidgets = [...preferences.dashboardWidgets].sort((a, b) => a.order - b.order)

  function handleDragStart(widgetId: string) {
    setDraggedId(widgetId)
  }

  function handleDragOver(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return

    const draggedIndex = sortedWidgets.findIndex(w => w.id === draggedId)
    const targetIndex = sortedWidgets.findIndex(w => w.id === targetId)

    const newWidgets = [...sortedWidgets]
    const [removed] = newWidgets.splice(draggedIndex, 1)
    newWidgets.splice(targetIndex, 0, removed)

    reorderWidgets(newWidgets.map(w => w.id))
  }
  function handleDragEnd() {
    setDraggedId(null)
  }

  async function handleDone() {
    setIsApplying(true)
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Close dialog
    setOpen(false)
    
    // Reload the page to apply changes
    window.location.reload()
  }
  return (
    <>
      {isApplying && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <div className="text-center">
              <p className="text-lg font-semibold">Applying Changes...</p>
              <p className="text-sm text-muted-foreground">Your dashboard will refresh shortly</p>
            </div>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="default"
          className="relative gap-2 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Settings2 className="h-4 w-4 relative z-10 animate-spin-slow group-hover:rotate-180 transition-transform duration-500" />
          <span className="relative z-10 font-semibold">Customize Dashboard</span>
          <NewBadge size="sm" className="relative z-10" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Customize Dashboard
            <NewBadge />
          </DialogTitle>
          <DialogDescription>
            Choose which widgets to display and arrange them in your preferred order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <Label>Dashboard Widgets</Label>
          <div className="space-y-2">
            {sortedWidgets.map((widget) => {
              const info = WIDGET_INFO[widget.id as keyof typeof WIDGET_INFO]
              return (
                <div
                  key={widget.id}
                  draggable
                  onDragStart={() => handleDragStart(widget.id)}
                  onDragOver={(e) => handleDragOver(e, widget.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg bg-card cursor-move transition-all",
                    draggedId === widget.id && "opacity-50",
                    widget.enabled ? "border-primary/50" : "opacity-60"
                  )}
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{info?.name || widget.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {info?.description || "Dashboard widget"}
                    </div>
                  </div>

                  <Switch
                    checked={widget.enabled}
                    onCheckedChange={() => toggleWidget(widget.id)}
                  />
                </div>
              )
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            💡 Tip: Drag widgets to reorder them on your dashboard
          </p>
        </div>        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleDone}
            disabled={isApplying}
            className="min-w-[100px]"
          >
            {isApplying ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Applying...
              </>
            ) : (
              "Done"
            )}          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
