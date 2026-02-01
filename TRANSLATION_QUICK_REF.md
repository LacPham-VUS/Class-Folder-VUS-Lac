# 🚀 Quick Translation Reference Card

## 1️⃣ Setup (One Time Only)

```tsx
import { useLanguage } from "@/lib/language-context"

export function MyComponent() {
  const { t, language } = useLanguage()
  
  // ... your code
}
```

---

## 2️⃣ Common Patterns

### ✅ Simple Text
```tsx
<h1>{t("classes.title")}</h1>
// VI: "Lớp học"
// EN: "Classes"
```

### ✅ Button Labels
```tsx
<Button>{t("common.save")}</Button>
<Button>{t("common.cancel")}</Button>
<Button>{t("common.delete")}</Button>
```

### ✅ Form Labels
```tsx
<Label>{t("students.fullName")}</Label>
<Input placeholder={t("common.search")} />
```

### ✅ Empty States
```tsx
{items.length === 0 && (
  <p>{t("classes.noClasses")}</p>
)}
```

### ✅ Card Titles
```tsx
<CardTitle>{t("classes.classInformation")}</CardTitle>
<CardDescription>{t("classes.allSessions")}</CardDescription>
```

### ✅ Status Badges
```tsx
<Badge>
  {status === "Active" ? t("classes.active") : t("classes.inactive")}
</Badge>
```

### ✅ Toast Notifications
```tsx
toast({
  title: t("messages.success"),
  description: t("messages.saveSuccess")
})
```

### ✅ With Dynamic Content
```tsx
{`${count} ${t("photos.photosSelected")}`}
// VI: "5 ảnh đã chọn"
// EN: "5 photos selected"
```

### ✅ Tab Labels
```tsx
<TabsTrigger value="overview">
  {t("classes.overview")}
</TabsTrigger>
```

### ✅ Dialog Content
```tsx
<AlertDialogTitle>{t("photos.deletePhotoConfirm")}</AlertDialogTitle>
<AlertDialogDescription>{t("photos.deletePhotoDesc")}</AlertDialogDescription>
<AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
<AlertDialogAction>{t("common.delete")}</AlertDialogAction>
```

---

## 3️⃣ Available Keys (Quick Reference)

### Common Actions
```
t("common.save")       → Lưu / Save
t("common.cancel")     → Hủy / Cancel  
t("common.delete")     → Xóa / Delete
t("common.edit")       → Sửa / Edit
t("common.add")        → Thêm / Add
t("common.search")     → Tìm kiếm / Search
t("common.filter")     → Lọc / Filter
t("common.view")       → Xem / View
t("common.back")       → Quay lại / Back
t("common.next")       → Tiếp theo / Next
t("common.loading")    → Đang tải... / Loading...
```

### Navigation
```
t("nav.dashboard")    → Tổng quan / Dashboard
t("nav.classes")      → Lớp học / Classes
t("nav.students")     → Học sinh / Students
t("nav.sessions")     → Buổi học / Sessions
t("nav.reports")      → Báo cáo / Reports
t("nav.requests")     → Yêu cầu / Requests
t("nav.settings")     → Cài đặt / Settings
```

### Classes
```
t("classes.title")              → Lớp học / Classes
t("classes.addClass")           → Thêm lớp / Add Class
t("classes.editClass")          → Sửa lớp / Edit Class
t("classes.classInformation")   → Thông tin lớp học / Class Information
t("classes.students")           → Học sinh / Students
t("classes.sessions")           → Buổi học / Sessions
t("classes.status")             → Trạng thái / Status
t("classes.active")             → Đang hoạt động / Active
t("classes.inactive")           → Không hoạt động / Inactive
t("classes.overview")           → Tổng quan / Overview
```

### Students
```
t("students.title")         → Học sinh / Students
t("students.fullName")      → Họ và tên / Full Name
t("students.email")         → Email / Email
t("students.phone")         → Số điện thoại / Phone
t("students.status")        → Trạng thái / Status
t("students.enrolledStudents") → Học sinh đã đăng ký / Enrolled Students
```

### Photos
```
t("photos.uploadPhoto")      → Upload ảnh / Upload Photo
t("photos.takePhoto")        → Chụp ảnh / Take Photo
t("photos.classPhotos")      → Ảnh lớp học / Class Photos
t("photos.studentPhotos")    → Ảnh học sinh / Student Photos
t("photos.noPhotos")         → Chưa có ảnh / No photos
t("photos.photoDeleted")     → Đã xóa ảnh / Photo Deleted
t("photos.deletePhotoConfirm") → Xóa ảnh này? / Delete this photo?
```

### Messages
```
t("messages.success")       → Thành công / Success
t("messages.error")         → Lỗi / Error
t("messages.saveSuccess")   → Lưu thành công / Saved successfully
t("messages.deleteSuccess") → Xóa thành công / Deleted successfully
```

---

## 4️⃣ Testing Checklist

After translating a page, verify:

- [ ] Switch to English - all text changes
- [ ] Switch to Vietnamese - all text changes  
- [ ] No hardcoded English/Vietnamese text remaining
- [ ] Toast notifications translated
- [ ] Error messages translated
- [ ] Empty states translated
- [ ] Button labels translated
- [ ] Form labels translated
- [ ] Dialog content translated
- [ ] Tab labels translated
- [ ] Card titles translated
- [ ] Test on mobile (check text doesn't overflow)

---

## 5️⃣ Adding New Keys

### Step 1: Add to Vietnamese section
```typescript
// lib/translations.ts
vi: {
  mySection: {
    myNewKey: "Tiếng Việt text",
  }
}
```

### Step 2: Add to English section
```typescript
en: {
  mySection: {
    myNewKey: "English text",
  }
}
```

### Step 3: Use in component
```tsx
{t("mySection.myNewKey")}
```

---

## 6️⃣ Common Mistakes to Avoid

### ❌ Don't Do This
```tsx
// Hardcoded text
<h1>Lớp học</h1>

// Mixed languages
<Button>Save</Button>
toast({ title: "Đã lưu" })

// Inconsistent keys
t("button.save")  // Different from common.save
```

### ✅ Do This Instead
```tsx
// Use translation
<h1>{t("classes.title")}</h1>

// Consistent language
<Button>{t("common.save")}</Button>
toast({ title: t("messages.saveSuccess") })

// Follow existing structure
t("common.save")  // Use existing common section
```

---

## 7️⃣ Quick Commands

### Test translation instantly
```
1. Open app in browser
2. Click language icon (🇻🇳) in top-right
3. Select English (🇺🇸)
4. Verify text changes immediately
5. Switch back to Vietnamese
```

### View all available keys
```
Open: lib/translations.ts
Search for the section you need
Copy the key path
```

### Test specific page
```
Navigate to: /test-language
Click language buttons
Watch all text change instantly
```

---

## 8️⃣ File Locations

```
📁 Core Files
├── lib/language-context.tsx     ← Language provider
├── lib/translations.ts          ← All translations
└── components/language-switcher.tsx  ← UI switcher

📁 Translated Pages  
├── app/upload/page.tsx          ← ✅ 100% done
├── app/classes/[id]/page.tsx    ← ✅ 100% done
└── ... (other pages pending)

📁 Documentation
├── LANGUAGE_GUIDE.md            ← Full guide
├── TRANSLATION_PROGRESS.md      ← Progress tracker
├── LANGUAGE_SWITCHING_FIX.md    ← Technical docs
└── TRANSLATION_CHECKLIST.md     ← Step-by-step
```

---

## 9️⃣ Emergency Help

### Language not switching?
1. Check `app/layout.tsx` has `<LanguageProvider>`
2. Verify component uses `const { t } = useLanguage()`
3. Make sure component has `"use client"` directive
4. Check browser console for errors

### Translation shows key instead of text?
1. Verify key exists in `lib/translations.ts`
2. Check spelling (case-sensitive!)
3. Make sure key exists in both `vi` and `en`

### Text not updating instantly?
1. Clear browser cache
2. Restart dev server
3. Check `LANGUAGE_SWITCHING_FIX.md`

---

**Pro Tip:** Use `/test-language` page to verify translations work before deploying! 🚀
