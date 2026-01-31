"use client"

import { CheckCircle2, Star } from "lucide-react"
import type React from "react" // Import React to declare JSX

interface GuidelineContentRendererProps {
  content: string
}

export function GuidelineContentRenderer({ content }: GuidelineContentRendererProps) {
  const renderFormattedContent = (text: string) => {
    const lines = text.split("\n")
    const elements: React.JSX.Element[] = [] // Declare JSX.Element with React namespace
    let listItems: string[] = []
    let listType: "bullet" | "number" | null = null

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="my-3 ml-6 space-y-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-green-600" />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>,
        )
        listItems = []
        listType = null
      }
    }

    lines.forEach((line, idx) => {
      const trimmed = line.trim()

      // Empty line
      if (!trimmed) {
        flushList()
        elements.push(<div key={`space-${idx}`} className="h-2" />)
        return
      }

      // Main section headers with **text**
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        flushList()
        const headerText = trimmed.slice(2, -2)
        elements.push(
          <div key={`header-${idx}`} className="mb-3 mt-6 first:mt-0">
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-3">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">{headerText}</h3>
            </div>
          </div>,
        )
        return
      }

      // Bullet points starting with - or *
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const text = trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        listItems.push(text)
        listType = "bullet"
        return
      }

      // Regular paragraph with inline formatting
      flushList()
      let formatted = trimmed

      // Handle inline bold **text**
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')

      // Handle inline italic *text* (but not already in **)
      formatted = formatted.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>')

      elements.push(
        <p
          key={`para-${idx}`}
          className="mb-3 text-sm leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />,
      )
    })

    flushList()
    return elements
  }

  return <div className="prose prose-sm max-w-none">{renderFormattedContent(content)}</div>
}
