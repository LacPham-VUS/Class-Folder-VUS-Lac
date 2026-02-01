"use client"

import React, { createContext, useContext, useState, useEffect, useMemo } from "react"
import { Language, translations } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Helper to get initial language from localStorage (only on client side)
function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "vi"
  const savedLang = localStorage.getItem("vus_language") as Language
  return savedLang && (savedLang === "vi" || savedLang === "en") ? savedLang : "vi"
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)
  const [mounted, setMounted] = useState(false)

  // Set mounted flag to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("vus_language", lang)
    }
  }

  // Translation function - memoized to re-create when language changes
  const t = useMemo(() => {
    return (key: string): string => {
      const keys = key.split(".")
      let value: any = translations[language]
      
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k]
        } else {
          // Fallback to English if key not found
          let fallback: any = translations.en
          for (const fk of keys) {
            if (fallback && typeof fallback === "object" && fk in fallback) {
              fallback = fallback[fk]
            } else {
              return key // Return key itself if not found
            }
          }
          return fallback
        }
      }
      
      return typeof value === "string" ? value : key
    }
  }, [language]) // Re-create when language changes

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
