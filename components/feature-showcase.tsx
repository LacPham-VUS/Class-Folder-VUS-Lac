// filepath: components/feature-showcase.tsx
// Showcase component to introduce new personalization features

"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NewBadge } from "@/components/ui/new-badge"
import {
  LayoutGrid,
  Star,
  Zap,
  Filter,
  Tag,
  Settings2,
  ChevronRight,
  CheckCircle,
} from "lucide-react"

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "View Modes",
    description: "Switch between Grid, List, and Compact views for students",
    benefit: "Find the perfect layout for your workflow",
  },
  {
    icon: Star,
    title: "Pin Students",
    description: "Pin important students to the top of your list",
    benefit: "Quick access to students requiring attention",
  },
  {
    icon: Zap,
    title: "Quick Access Bar",
    description: "Add students, classes, or sessions for instant access",
    benefit: "Navigate to frequent items with one click",
  },
  {
    icon: Filter,
    title: "Saved Filters",
    description: "Save your filter combinations for quick reuse",
    benefit: "No need to reapply filters every time",
  },
  {
    icon: Tag,
    title: "Custom Tags",
    description: "Create personalized tags with custom colors",
    benefit: "Organize students your way",
  },
  {
    icon: Settings2,
    title: "Dashboard Customization",
    description: "Enable/disable and reorder dashboard widgets",
    benefit: "Focus on what matters most to you",
  },
]

interface FeatureShowcaseProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function FeatureShowcase({ open: controlledOpen, onOpenChange }: FeatureShowcaseProps) {
  const [internalOpen, setInternalOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? onOpenChange! : setInternalOpen

  const handleNext = () => {
    if (currentStep < FEATURES.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handleSkip = () => {
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
    // Mark as seen in localStorage
    localStorage.setItem("feature_showcase_seen", "true")
  }

  const currentFeature = FEATURES[currentStep]
  const Icon = currentFeature.icon

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-2xl">Welcome to Your Personalized Experience!</DialogTitle>
            <NewBadge size="md" />
          </div>
          <DialogDescription>
            We've added powerful new features to help you work more efficiently
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {FEATURES.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Feature showcase */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-8 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{currentFeature.title}</h3>
                <p className="text-muted-foreground mb-3">{currentFeature.description}</p>
                <div className="flex items-start gap-2 bg-white/50 dark:bg-gray-900/50 rounded-md p-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{currentFeature.benefit}</p>
                </div>
              </div>
            </div>
          </div>

          {/* All features preview */}
          <div className="grid grid-cols-3 gap-3">
            {FEATURES.map((feature, index) => {
              const FeatureIcon = feature.icon
              return (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    index === currentStep
                      ? "border-primary bg-primary/5"
                      : index < currentStep
                        ? "border-green-200 bg-green-50 dark:bg-green-950/20"
                        : "border-muted hover:border-primary/50"
                  }`}
                >
                  <FeatureIcon
                    className={`h-5 w-5 mb-2 ${
                      index === currentStep
                        ? "text-primary"
                        : index < currentStep
                          ? "text-green-600"
                          : "text-muted-foreground"
                    }`}
                  />
                  <p className="text-xs font-medium truncate">{feature.title}</p>
                </button>
              )
            })}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Tour
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {FEATURES.length}
            </span>
            <Button onClick={handleNext}>
              {currentStep < FEATURES.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook to show showcase on first visit
export function useFeatureShowcase() {
  const [showShowcase, setShowShowcase] = useState(false)

  useState(() => {
    const seen = localStorage.getItem("feature_showcase_seen")
    if (!seen) {
      setShowShowcase(true)
    }
  })

  return { showShowcase, setShowShowcase }
}
