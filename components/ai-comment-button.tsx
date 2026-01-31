"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface AICommentButtonProps {
  studentData: {
    id: string
    fullName: string
    attendanceRate?: number
    skillsBreakdown?: {
      speaking: number
      listening: number
      reading: number
      writing: number
    }
    riskLevel?: string
  }
  type: "positive" | "improvement"
  onSelect: (suggestion: string) => void
}

export function AICommentButton({ studentData, type, onSelect }: AICommentButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleGenerate = async () => {
    setIsLoading(true)
    setSuggestions([])

    try {
      console.log("[v0] Fetching AI suggestions from API for:", studentData.fullName, "type:", type)

      const response = await fetch("/api/ai-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentData, type }),
      })

      const result = await response.json()
      console.log("[v0] API response:", result)

      if (result.success && result.suggestions?.length > 0) {
        setSuggestions(result.suggestions)
        toast.success("✨ AI suggestions generated!")
      } else {
        const errorMsg = result.error || "No suggestions available"
        console.warn("[v0] AI generation failed:", errorMsg)
        toast.error(errorMsg.includes("API key") ? "AI service not configured" : "Failed to generate suggestions")
      }
    } catch (error) {
      console.error("[v0] Error generating suggestions:", error)
      toast.error("Error connecting to AI service. Using mock suggestions instead.")

      if (type === "positive") {
        setSuggestions([
          `Em ${studentData.fullName} rất tích cực tham gia các hoạt động nhóm và nhiệt tình giúp đỡ bạn.`,
          `Em thể hiện khả năng speaking tốt với phát âm rõ ràng và tự tin khi trình bày.`,
          `Em có thái độ học tập nghiêm túc và luôn hoàn thành bài tập đầy đủ.`,
        ])
      } else {
        setSuggestions([
          `Em cần chú ý hơn đến việc tập trung trong lớp và hoàn thành homework đúng hạn.`,
          `Em nên luyện tập thêm phát âm và intonation trong câu hỏi.`,
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    onSelect(suggestion)
    setIsOpen(false)
    toast.success("Suggestion applied!")
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10"
          onClick={(e) => {
            e.stopPropagation()
            if (!isOpen) handleGenerate()
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI Suggest
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Comment Suggestions
            </h4>
            <Badge variant="secondary" className="text-xs">
              {type === "positive" ? "Positive" : "Improvement"}
            </Badge>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
              <p className="text-sm">Generating suggestions...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full text-left p-3 rounded-md border border-border hover:border-primary hover:bg-accent/50 transition-colors text-sm"
                  >
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5 shrink-0">
                        {index + 1}
                      </Badge>
                      <p className="text-foreground leading-relaxed">{suggestion}</p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground">Click to generate AI suggestions</div>
          )}

          <div className="pt-2 border-t text-xs text-muted-foreground">
            <p>💡 Tip: Select a suggestion to insert it into the comment field</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
