"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

interface LoadingScreenProps {
  onComplete?: () => void
  duration?: number
}

export function LoadingScreen({ onComplete, duration = 2500 }: LoadingScreenProps) {
  const { t } = useLanguage()
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, duration / 50)

    // Start fade out animation before completing
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, duration - 500)

    // Call onComplete callback
    const completeTimer = setTimeout(() => {
      onComplete?.()
    }, duration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [duration, onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo */}
      <div className="mb-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <Image
            src="/vus-logo.png"
            alt="VUS Logo"
            width={240}
            height={80}
            className="object-contain w-auto h-20 sm:h-24"
            priority
          />
          {/* Glow effect */}
          <div className="absolute inset-0 -z-10 blur-2xl opacity-30 bg-primary/50 animate-pulse" />
        </div>
      </div>

      {/* Slogan */}
      <div className="mb-12 text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
          {t("loading.workTogether")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md px-4">
          {t("loading.tagline")}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 sm:w-80 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">
          {t("loading.pleaseWait")}
        </p>
      </div>

      {/* Animated dots */}
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
