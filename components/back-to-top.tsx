"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface BackToTopProps {
  threshold?: number // Scroll threshold to show button (default 300px)
  className?: string
}

export function BackToTop({ threshold = 300, className }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [buttonLeft, setButtonLeft] = useState("50%")
  const scrollContainerRef = useRef<Element | null>(null)

  useEffect(() => {
    // Find the main scroll container (the <main> element with overflow-y-auto)
    const mainElement = document.querySelector("main.overflow-y-auto")
    scrollContainerRef.current = mainElement

    function updateButtonPosition() {
      if (mainElement) {
        const rect = mainElement.getBoundingClientRect()
        // Calculate the center of the main content area
        const centerX = rect.left + rect.width / 2
        setButtonLeft(`${centerX}px`)
      }
    }

    function handleScroll() {
      let scrollTop = 0
      
      if (mainElement) {
        // Scroll is happening in the main element
        scrollTop = mainElement.scrollTop
      } else {
        // Fallback to window scroll
        scrollTop = window.scrollY || document.documentElement.scrollTop
      }
      
      setIsVisible(scrollTop > threshold)
    }

    // Listen to scroll on main element if it exists, otherwise window
    const scrollTarget = mainElement || window
    scrollTarget.addEventListener("scroll", handleScroll, { passive: true })
    
    // Update position on resize
    window.addEventListener("resize", updateButtonPosition)
    
    // Initial position and scroll check
    updateButtonPosition()
    handleScroll()

    return () => {
      scrollTarget.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateButtonPosition)
    }
  }, [threshold])

  function scrollToTop() {
    const mainElement = scrollContainerRef.current
    
    if (mainElement) {
      mainElement.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
  }
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={scrollToTop}
      style={{ left: buttonLeft }}
      className={cn(
        // Position: center of main content area
        "fixed bottom-6 -translate-x-1/2 z-50",
        // Size and shape
        "h-12 w-12 rounded-full shadow-lg",
        // Colors
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        // Hover effects
        "hover:scale-110 hover:shadow-xl active:scale-95",
        // Transition
        "transition-all duration-300 ease-out",
        // Visibility animation
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8 pointer-events-none",
        // Bounce animation when visible
        isVisible && "animate-bounce-subtle",
        className
      )}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
