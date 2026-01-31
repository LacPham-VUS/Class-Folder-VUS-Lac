// filepath: hooks/use-user-preferences.ts
// Custom hook for managing user preferences and personalization

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"

export type ViewMode = "grid" | "list" | "compact"

export interface UserPreferences {
  // View preferences
  viewMode: ViewMode
  itemsPerPage: number
  
  // Pinned/Favorite items
  pinnedStudents: string[]
  pinnedClasses: string[]
  
  // Custom tags
  customTags: Array<{
    id: string
    name: string
    color: string
  }>
  
  // Saved filters
  savedFilters: Array<{
    id: string
    name: string
    type: "student" | "class" | "session"
    filters: Record<string, any>
  }>
  
  // Theme customization
  theme: "light" | "dark" | "system"
  accentColor: string
  
  // Dashboard layout
  dashboardWidgets: Array<{
    id: string
    enabled: boolean
    order: number
  }>
  
  // Quick access
  quickAccessItems: Array<{
    id: string
    type: "student" | "class" | "session"
    label: string
  }>
}

const DEFAULT_PREFERENCES: UserPreferences = {
  viewMode: "grid",
  itemsPerPage: 12,
  pinnedStudents: [],
  pinnedClasses: [],
  customTags: [],
  savedFilters: [],
  theme: "system",
  accentColor: "#0ea5e9", // sky-500
  dashboardWidgets: [
    { id: "overview", enabled: true, order: 1 },
    { id: "riskStudents", enabled: true, order: 2 },
    { id: "upcomingSessions", enabled: true, order: 3 },
    { id: "recentNotes", enabled: true, order: 4 },
    { id: "parentCommunications", enabled: true, order: 5 },
    { id: "analytics", enabled: true, order: 6 },
  ],
  quickAccessItems: [],
}

export function useUserPreferences() {
  const { currentUser } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      loadPreferences()
    } else {
      // If no user, use defaults and stop loading
      setLoading(false)
    }
  }, [currentUser])

  function loadPreferences() {
    try {
      const stored = localStorage.getItem(`preferences_${currentUser?.id}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Merge with defaults to ensure all fields exist
        setPreferences({ 
          ...DEFAULT_PREFERENCES, 
          ...parsed,
          // Ensure dashboardWidgets has all widgets
          dashboardWidgets: mergeWidgets(DEFAULT_PREFERENCES.dashboardWidgets, parsed.dashboardWidgets || [])
        })
      } else {
        setPreferences(DEFAULT_PREFERENCES)
      }
    } catch (error) {
      console.error("Failed to load preferences:", error)
      setPreferences(DEFAULT_PREFERENCES)
    } finally {
      setLoading(false)
    }
  }

  function mergeWidgets(defaults: UserPreferences["dashboardWidgets"], saved: UserPreferences["dashboardWidgets"]) {
    const savedMap = new Map(saved.map(w => [w.id, w]))
    return defaults.map(def => savedMap.get(def.id) || def)
  }  function savePreferences(newPreferences: Partial<UserPreferences>) {
    const updated = { ...preferences, ...newPreferences }
    
    try {
      localStorage.setItem(`preferences_${currentUser?.id}`, JSON.stringify(updated))
      console.log('✅ Preferences saved:', updated)
      
      // Update state with new reference to trigger re-render
      setPreferences(updated)
      
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('preferences-updated', { 
          detail: updated 
        }))
      }
    } catch (error) {
      console.error("Failed to save preferences:", error)
    }
  }

  // View mode
  function setViewMode(mode: ViewMode) {
    savePreferences({ viewMode: mode })
  }

  // Pinned items
  function togglePinnedStudent(studentId: string) {
    const pinnedStudents = preferences.pinnedStudents.includes(studentId)
      ? preferences.pinnedStudents.filter(id => id !== studentId)
      : [...preferences.pinnedStudents, studentId]
    
    savePreferences({ pinnedStudents })
  }

  function togglePinnedClass(classId: string) {
    const pinnedClasses = preferences.pinnedClasses.includes(classId)
      ? preferences.pinnedClasses.filter(id => id !== classId)
      : [...preferences.pinnedClasses, classId]
    
    savePreferences({ pinnedClasses })
  }

  // Custom tags
  function addCustomTag(name: string, color: string) {
    const newTag = {
      id: `tag_${Date.now()}`,
      name,
      color,
    }
    
    savePreferences({
      customTags: [...preferences.customTags, newTag],
    })
    
    return newTag
  }

  function removeCustomTag(tagId: string) {
    savePreferences({
      customTags: preferences.customTags.filter(t => t.id !== tagId),
    })
  }

  // Saved filters
  function saveFilter(
    name: string,
    type: "student" | "class" | "session",
    filters: Record<string, any>
  ) {
    const newFilter = {
      id: `filter_${Date.now()}`,
      name,
      type,
      filters,
    }
    
    savePreferences({
      savedFilters: [...preferences.savedFilters, newFilter],
    })
    
    return newFilter
  }

  function removeFilter(filterId: string) {
    savePreferences({
      savedFilters: preferences.savedFilters.filter(f => f.id !== filterId),
    })
  }

  // Dashboard widgets
  function toggleWidget(widgetId: string) {
    const widgets = preferences.dashboardWidgets.map(w =>
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    )
    
    savePreferences({ dashboardWidgets: widgets })
  }

  function reorderWidgets(widgetIds: string[]) {
    const widgets = widgetIds.map((id, index) => {
      const widget = preferences.dashboardWidgets.find(w => w.id === id)
      return widget ? { ...widget, order: index + 1 } : null
    }).filter(Boolean) as UserPreferences["dashboardWidgets"]
    
    savePreferences({ dashboardWidgets: widgets })
  }

  // Quick access
  function addQuickAccess(item: {
    id: string
    type: "student" | "class" | "session"
    label: string
  }) {
    if (preferences.quickAccessItems.length >= 5) {
      return // Max 5 quick access items
    }
    
    savePreferences({
      quickAccessItems: [...preferences.quickAccessItems, item],
    })
  }

  function removeQuickAccess(itemId: string) {
    savePreferences({
      quickAccessItems: preferences.quickAccessItems.filter(i => i.id !== itemId),
    })
  }

  return {
    preferences,
    loading,
    setViewMode,
    togglePinnedStudent,
    togglePinnedClass,
    addCustomTag,
    removeCustomTag,
    saveFilter,
    removeFilter,
    toggleWidget,
    reorderWidgets,
    addQuickAccess,
    removeQuickAccess,
    savePreferences,
  }
}
