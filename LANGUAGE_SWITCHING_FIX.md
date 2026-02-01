# Language Switching Troubleshooting Guide

## Problem Description

**Issue:** When clicking the language switcher (🇻🇳/🇺🇸), the UI text doesn't change immediately. Users need to refresh the page or navigate to another page to see the language change.

**Root Cause:** React components were not re-rendering when the `language` state changed in the LanguageContext.

---

## Solution Implemented

### 1. Fixed Initial State Hydration

**Before:**
```tsx
const [language, setLanguageState] = useState<Language>("vi")

useEffect(() => {
  const savedLang = localStorage.getItem("vus_language")
  if (savedLang) setLanguageState(savedLang)
}, [])
```

**Problem:** State is initialized with "vi", then changed in useEffect. This causes:
- Delay in loading saved language
- Hydration mismatch warnings
- Potential flash of wrong language

**After:**
```tsx
function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "vi"
  const savedLang = localStorage.getItem("vus_language") as Language
  return savedLang && (savedLang === "vi" || savedLang === "en") ? savedLang : "vi"
}

const [language, setLanguageState] = useState<Language>(getInitialLanguage)
```

**Benefits:**
- Language loaded immediately on mount
- No hydration mismatch
- No delay or flash of content

---

### 2. Memoized Translation Function

**Before:**
```tsx
const t = (key: string): string => {
  const keys = key.split(".")
  let value: any = translations[language]
  // ... translation logic
  return typeof value === "string" ? value : key
}
```

**Problem:** The `t` function is created once and never re-created when `language` changes. React components that call `t()` don't know they need to re-render.

**After:**
```tsx
const t = useMemo(() => {
  return (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]
    // ... translation logic
    return typeof value === "string" ? value : key
  }
}, [language]) // ← Re-create when language changes
```

**Benefits:**
- `t` function is re-created whenever `language` changes
- All components using `t()` automatically re-render
- Instant UI updates when switching languages

---

### 3. Safe Client-Side Check

**Before:**
```tsx
const setLanguage = (lang: Language) => {
  setLanguageState(lang)
  localStorage.setItem("vus_language", lang)
}
```

**Problem:** During SSR (Server-Side Rendering), `localStorage` is not available, causing errors.

**After:**
```tsx
const setLanguage = (lang: Language) => {
  setLanguageState(lang)
  if (typeof window !== "undefined") {
    localStorage.setItem("vus_language", lang)
  }
}
```

**Benefits:**
- No SSR errors
- Safe for Next.js app router
- Works in both client and server components

---

## How to Test

### Quick Test
1. Navigate to `/test-language` page
2. Click the 🇻🇳 or 🇺🇸 buttons
3. Verify all text changes **instantly** without page refresh
4. Check sidebar navigation also updates
5. Refresh page - language should persist

### Manual Component Test
```tsx
"use client"

import { useLanguage } from "@/lib/language-context"

export function TestComponent() {
  const { t, language, setLanguage } = useLanguage()
  
  return (
    <div>
      <p>Current: {language}</p>
      <p>{t("nav.dashboard")}</p>
      <button onClick={() => setLanguage("vi")}>VI</button>
      <button onClick={() => setLanguage("en")}>EN</button>
    </div>
  )
}
```

**Expected:** Clicking buttons should instantly change the text.

---

## Common Issues & Solutions

### Issue 1: Components Don't Update
**Symptom:** Text doesn't change when switching languages

**Solution:**
- Verify component is wrapped in `<LanguageProvider>`
- Check component uses `const { t } = useLanguage()` hook
- Ensure component is a Client Component (`"use client"`)

### Issue 2: Console Errors
**Symptom:** "useLanguage must be used within LanguageProvider" error

**Solution:**
- Check `app/layout.tsx` has `<LanguageProvider>` wrapping children
- Ensure hook is called inside a component, not at top level

### Issue 3: Language Doesn't Persist
**Symptom:** Language resets to Vietnamese on page refresh

**Solution:**
- Check browser localStorage is enabled
- Verify `vus_language` key is saved in localStorage
- Clear cache and try again

### Issue 4: Server-Side Rendering Errors
**Symptom:** "localStorage is not defined" error

**Solution:**
- Add `"use client"` directive to components using useLanguage
- Check `typeof window !== "undefined"` before accessing localStorage

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│         app/layout.tsx              │
│  <LanguageProvider>                 │
│    <AuthProvider>                   │
│      <App />                        │
│    </AuthProvider>                  │
│  </LanguageProvider>                │
└─────────────────────────────────────┘
              │
              ├─► Any component can use:
              │   const { t, language, setLanguage } = useLanguage()
              │
              ├─► Translation function:
              │   t("nav.dashboard") → "Tổng quan" (vi) or "Dashboard" (en)
              │
              └─► Language switcher:
                  <LanguageSwitcher /> in app-header.tsx
```

---

## Translation Flow

1. User clicks language switcher
2. `setLanguage("en")` is called
3. State updates: `language` changes from "vi" to "en"
4. `useMemo` detects dependency change, re-creates `t` function
5. Context value changes: `{ language, setLanguage, t }`
6. All components using `useLanguage()` re-render
7. `t("key")` now returns English translation
8. UI updates instantly ✨

---

## Performance Notes

- **useMemo optimization:** Translation function only re-created when language changes, not on every render
- **localStorage caching:** Language preference saved locally, no network requests
- **Lazy initialization:** `getInitialLanguage()` only runs once during initial render
- **No external dependencies:** Pure client-side solution, works offline

---

## Next Steps

1. ✅ Core system working
2. ✅ Test page created (`/test-language`)
3. ⏳ Continue translating remaining pages (see TRANSLATION_CHECKLIST.md)
4. ⏳ Add language detection from browser settings
5. ⏳ Add more languages (e.g., Korean for VUS Korea students)

---

## Related Files

- `lib/language-context.tsx` - Main context provider
- `lib/translations.ts` - Translation dictionary
- `components/language-switcher.tsx` - UI switcher component
- `app/layout.tsx` - Provider integration
- `LANGUAGE_GUIDE.md` - Usage guide
- `TRANSLATION_CHECKLIST.md` - Translation progress
