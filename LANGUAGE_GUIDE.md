# 🌍 Language System Guide - VUS Digital Class Folder

## Overview
The VUS Digital Class Folder now supports **bilingual** interface (Vietnamese & English) with seamless switching.

## ✅ What's Already Implemented

### 1. Core Language System
- ✅ **Language Context** (`lib/language-context.tsx`) - Manages language state
- ✅ **Translations** (`lib/translations.ts`) - Contains all Vietnamese & English text
- ✅ **Language Switcher** (`components/language-switcher.tsx`) - UI component for switching
- ✅ **Integrated in Layout** - Language provider wraps entire app

### 2. Already Translated Pages
- ✅ **Upload Page** (`app/upload/page.tsx`) - Fully translated

### 3. Language Switcher Location
The language switcher (🇻🇳/🇺🇸) is located in the **top-right header** next to notifications and user menu.

## 📝 How to Use Translations in Your Code

### Step 1: Import the hook
```tsx
import { useLanguage } from "@/lib/language-context"
```

### Step 2: Use in component
```tsx
function MyComponent() {
  const { t, language } = useLanguage()
  
  return (
    <div>
      <h1>{t("common.save")}</h1>  {/* Shows "Lưu" or "Save" */}
      <p>{t("messages.success")}</p>
    </div>
  )
}
```

### Step 3: Available Translation Keys
See `lib/translations.ts` for all available keys. Structure:
```
common.* - Common actions (save, cancel, delete, etc.)
nav.* - Navigation items
classes.* - Class-related text
students.* - Student-related text
sessions.* - Session-related text
requests.* - Request-related text
photos.* - Photo-related text
reports.* - Report-related text
settings.* - Settings-related text
auth.* - Authentication text
roles.* - User roles
messages.* - Toast/alert messages
```

## 🚀 Quick Translation Examples

### Example 1: Button with Translation
```tsx
// Before
<Button>Lưu</Button>

// After
<Button>{t("common.save")}</Button>
```

### Example 2: Toast Notification
```tsx
// Before
toast({
  title: "Thành công",
  description: "Đã lưu thành công"
})

// After
toast({
  title: t("messages.success"),
  description: t("messages.saveSuccess")
})
```

### Example 3: Page Title
```tsx
// Before
<h1>Danh sách lớp học</h1>

// After
<h1>{t("classes.classList")}</h1>
```

### Example 4: Placeholder Text
```tsx
// Before
<Input placeholder="Tìm kiếm..." />

// After
<Input placeholder={t("common.search") + "..."} />
```

## 📋 Pages That Need Translation

### High Priority Pages
1. ⏳ **Login Page** (`app/login/page.tsx`)
2. ⏳ **Dashboard** (`app/page.tsx`)
3. ⏳ **Classes Page** (`app/classes/page.tsx`)
4. ⏳ **Class Detail** (`app/classes/[id]/page.tsx`)
5. ⏳ **Students Page** (`app/students/page.tsx`)
6. ⏳ **Student Detail** (`app/students/[id]/student-detail-client.tsx`)
7. ⏳ **Sessions Page** (`app/sessions/page.tsx`)
8. ⏳ **Session Detail** (`app/sessions/[id]/page.tsx`)
9. ⏳ **Requests Page** (`app/requests/page.tsx`)
10. ⏳ **Request Detail** (`app/requests/[id]/request-detail-client.tsx`)
11. ⏳ **Camera Page** (`app/camera/page.tsx`)

### Medium Priority
12. ⏳ **Reports Page** (`app/reports/page.tsx`)
13. ⏳ **Templates Page** (`app/templates/page.tsx`)
14. ⏳ **Guidelines Page** (`app/guidelines/page.tsx`)
15. ⏳ **Settings Page** (`app/settings/page.tsx`)

### Components
16. ⏳ **App Header** (`components/app-header.tsx`)
17. ⏳ **App Sidebar** (`components/app-sidebar.tsx`)
18. ⏳ **Photo Dialog** (`components/photo-dialog.tsx`)
19. ⏳ **Dashboard Components** (`components/dashboard/*.tsx`)

## 🔧 Adding New Translations

If you need a translation that doesn't exist:

### 1. Add to `lib/translations.ts`
```tsx
export const translations = {
  vi: {
    // ... existing translations
    myNewSection: {
      myNewKey: "Văn bản tiếng Việt",
    }
  },
  en: {
    // ... existing translations
    myNewSection: {
      myNewKey: "English text",
    }
  },
}
```

### 2. Use in your component
```tsx
const { t } = useLanguage()
return <p>{t("myNewSection.myNewKey")}</p>
```

## 🎯 Translation Patterns

### Pattern 1: Static Text
```tsx
{t("common.save")}
```

### Pattern 2: Text with Variables
```tsx
{`${count} ${t("photos.photosSelected")}`}
// Vi: "5 ảnh đã chọn"
// En: "5 photos selected"
```

### Pattern 3: Conditional Text
```tsx
{isSaving ? t("common.saving") : t("common.save")}
```

### Pattern 4: Array Items
```tsx
const items = [
  { label: t("nav.dashboard"), href: "/" },
  { label: t("nav.classes"), href: "/classes" },
]
```

## 🌐 Language Persistence

Language preference is automatically saved to `localStorage` as `vus_language`.
- Default: `"vi"` (Vietnamese)
- Options: `"vi"` | `"en"`

## 🔍 Testing Translations

1. Open app
2. Click language switcher in top-right (🇻🇳 icon)
3. Select English (🇺🇸)
4. Verify all text changes to English
5. Switch back to Vietnamese (🇻🇳)
6. Refresh page - language should persist

## 📝 Common Translation Checklist

When translating a page, check these elements:
- [ ] Page title
- [ ] Section headings
- [ ] Button labels
- [ ] Form labels
- [ ] Placeholder text
- [ ] Toast notifications
- [ ] Error messages
- [ ] Success messages
- [ ] Empty state messages
- [ ] Confirmation dialogs
- [ ] Table headers
- [ ] Filter labels
- [ ] Dropdown options
- [ ] Badge text
- [ ] Link text

## 🐛 Troubleshooting

### Issue: Translation not showing
**Solution**: Make sure:
1. Key exists in `lib/translations.ts` for both `vi` and `en`
2. You're using `t("correct.key.path")`
3. Component is wrapped in `<LanguageProvider>` (should be automatic via `layout.tsx`)

### Issue: Language not persisting
**Solution**: Check browser's localStorage - `vus_language` should exist

### Issue: Translation shows key instead of text
**Solution**: Key path is incorrect. Check spelling and structure in `translations.ts`

## 📚 Full Translation Coverage Goal

Target: **100% of user-facing text** should use translation system
- Current: ~10% (Upload page only)
- Goal: 100% by end of development

## 🎨 Best Practices

1. **Always use translations** - Never hardcode Vietnamese or English text
2. **Keep keys organized** - Group related translations together
3. **Be consistent** - Use same translation for same concept across app
4. **Test both languages** - Always verify both VI and EN work correctly
5. **Update translations.ts** - Before using new key, add it to translations file

## 🚀 Next Steps

To apply translations across the entire app, follow this order:

1. **Authentication** (Login page) - First impression
2. **Dashboard** - Main landing page
3. **Classes** - Most frequently used
4. **Students** - Core functionality
5. **Sessions** - Daily operations
6. **Requests** - Important workflow
7. **Reports, Templates, Settings** - Administrative
8. **Components** - Shared UI elements

---

**Remember**: Every piece of user-facing text should go through the translation system!

🇻🇳 Vietnamese (Tiếng Việt) | 🇺🇸 English
