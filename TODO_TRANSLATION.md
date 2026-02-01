# ✅ Translation Completion Checklist

## 🎯 Progress: 4/20 Pages (20%)

---

## ✅ COMPLETED

### Core System
- [x] Language Context Provider (`lib/language-context.tsx`)
- [x] Translation Dictionary (`lib/translations.ts`)
- [x] Language Switcher Component (`components/language-switcher.tsx`)
- [x] Instant switching (useMemo fix)
- [x] localStorage persistence
- [x] SSR safety

### Pages
- [x] **Upload Page** (`app/upload/page.tsx`) - 100%
- [x] **Classes List** (`app/classes/page.tsx`) - 100%
- [x] **Class Detail** (`app/classes/[id]/page.tsx`) - 100%
- [x] **App Sidebar** (`components/app-sidebar.tsx`) - 100%

### Documentation
- [x] LANGUAGE_GUIDE.md
- [x] LANGUAGE_SWITCHING_FIX.md
- [x] TRANSLATION_PROGRESS.md
- [x] TRANSLATION_QUICK_REF.md
- [x] TRANSLATION_SESSION_SUMMARY.md
- [x] Test Page (`/test-language`)

---

## 🚀 HIGH PRIORITY (Must Do First)

### [ ] Login Page (~15 mins)
**File:** `app/login/page.tsx`
**Elements:**
- [ ] Page title "VUS Digital Class Folder"
- [ ] Subtitle "Select your role to continue"
- [ ] Role selection buttons (TA, Teacher, ASA, TQM, System Admin)
- [ ] "Continue as..." text

**Keys Needed:**
```typescript
auth: {
  selectRole: "Chọn vai trò / Select your role",
  continueAs: "Tiếp tục với vai trò / Continue as",
}
```

---

### [ ] Students List Page (~20 mins)
**File:** `app/students/page.tsx`
**Elements:**
- [ ] Page title "Students"
- [ ] Description "Manage and view all students"
- [ ] "New Student" button
- [ ] Search placeholder
- [ ] Filter dropdowns (Class, Status, Risk Level)
- [ ] Student card labels
- [ ] Empty state message

**Keys Already Available:** ✅ Most keys exist in `students.*`

---

### [ ] Camera Page (~15 mins)
**File:** `app/camera/page.tsx`
**Elements:**
- [ ] Page title
- [ ] Camera controls
- [ ] "Capture" button
- [ ] Student selection dropdown
- [ ] "Save" / "Cancel" buttons
- [ ] Instructions text

**Keys Needed:**
```typescript
camera: {
  title: "Chụp ảnh / Camera",
  capture: "Chụp / Capture",
  switchCamera: "Đổi camera / Switch Camera",
  instructions: "Hướng dẫn / Instructions",
}
```

---

### [ ] Dashboard Page - Complete (~30 mins)
**File:** `app/page.tsx` + `components/dashboard/*.tsx`
**Currently:** 50% done (header only)
**Remaining:**
- [ ] Widget titles
- [ ] Statistics labels
- [ ] Quick action buttons
- [ ] Chart labels
- [ ] Empty states

**Keys Needed:**
```typescript
dashboard: {
  recentActivity: "Hoạt động gần đây / Recent Activity",
  quickStats: "Thống kê nhanh / Quick Stats",
  upcomingClasses: "Lớp sắp tới / Upcoming Classes",
  pendingTasks: "Công việc chờ / Pending Tasks",
}
```

---

## 📋 MEDIUM PRIORITY

### [ ] Student Detail Page (~25 mins)
**File:** `app/students/[id]/student-detail-client.tsx`
**Elements:**
- [ ] Page header
- [ ] Info cards (Personal Info, Contact Info, Academic Info)
- [ ] Tabs (Overview, Classes, Sessions, Photos, Reports)
- [ ] All labels & fields
- [ ] Empty states

---

### [ ] Sessions List Page (~20 mins)
**File:** `app/sessions/page.tsx`
**Elements:**
- [ ] Page title & description
- [ ] Calendar view labels
- [ ] Session cards
- [ ] Filter dropdowns
- [ ] Status badges
- [ ] Empty state

---

### [ ] Session Detail Page (~25 mins)
**File:** `app/sessions/[id]/page.tsx`
**Elements:**
- [ ] Page header
- [ ] Session info section
- [ ] Attendance section
- [ ] Class report section
- [ ] Action buttons

---

### [ ] Requests List Page (~20 mins)
**File:** `app/requests/page.tsx`
**Elements:**
- [ ] Page title & description
- [ ] Filter dropdowns (Status, Priority, Type)
- [ ] Request cards
- [ ] Status badges
- [ ] Empty state

---

### [ ] Request Detail Page (~25 mins)
**File:** `app/requests/[id]/request-detail-client.tsx`
**Elements:**
- [ ] Page header
- [ ] Request details
- [ ] Comments section
- [ ] Action buttons
- [ ] Status history

---

## 🔧 LOWER PRIORITY

### [ ] Reports Page (~20 mins)
**File:** `app/reports/page.tsx`
**Elements:**
- [ ] Page title & description
- [ ] Report filters
- [ ] Report cards
- [ ] Export buttons
- [ ] Empty state

---

### [ ] Settings Page (~20 mins)
**File:** `app/settings/page.tsx`
**Elements:**
- [ ] Page title
- [ ] Settings sections
- [ ] Form labels
- [ ] Save buttons
- [ ] Confirmation messages

---

### [ ] Templates Page (~15 mins)
**File:** `app/templates/page.tsx`
**Elements:**
- [ ] Page title & description
- [ ] Template cards
- [ ] Download buttons
- [ ] Empty state

---

### [ ] Guidelines Page (~15 mins)
**File:** `app/guidelines/page.tsx`
**Elements:**
- [ ] Page title & description
- [ ] Guideline categories
- [ ] Content sections
- [ ] Navigation

---

## 🎨 COMPONENTS

### [ ] App Header (~10 mins)
**File:** `components/app-header.tsx`
**Currently:** Only Language Switcher done
**Remaining:**
- [ ] Notification dropdown title
- [ ] Notification messages
- [ ] User menu items
- [ ] "Mark all as read" button

---

### [ ] Photo Dialog (~15 mins)
**File:** `components/photo-dialog.tsx`
**Elements:**
- [ ] Dialog title
- [ ] Camera controls
- [ ] Student selection
- [ ] Save/Cancel buttons
- [ ] Capture instructions

---

## 📊 ESTIMATED TIME

| Priority | Pages | Time |
|----------|-------|------|
| High | 4 | ~1.5 hrs |
| Medium | 5 | ~2.0 hrs |
| Low | 4 | ~1.0 hr |
| **Total** | **13** | **~4.5 hrs** |

---

## 🎯 COMPLETION STRATEGY

### Week 1 (This Week)
- [x] Day 1: Fix system + Classes pages (Done!)
- [ ] Day 2: Login + Students List + Camera
- [ ] Day 3: Dashboard widgets

### Week 2 (Next Week)
- [ ] Student Detail
- [ ] Sessions List & Detail
- [ ] Requests List & Detail

### Week 3 (Following Week)
- [ ] Reports, Settings, Templates, Guidelines
- [ ] App Header & Photo Dialog
- [ ] Final testing & polish

---

## ✅ VERIFICATION CHECKLIST

After translating each page:

- [ ] All hardcoded text removed
- [ ] All buttons translated
- [ ] All labels translated
- [ ] All placeholders translated
- [ ] All empty states translated
- [ ] All error messages translated
- [ ] All toast notifications translated
- [ ] All dialog content translated
- [ ] Tested in Vietnamese
- [ ] Tested in English
- [ ] Tested on mobile
- [ ] No text overflow issues
- [ ] No console errors

---

## 📝 QUICK REFERENCE

### Add Translation
```typescript
// 1. Add to translations.ts
vi: { section: { key: "Tiếng Việt" } }
en: { section: { key: "English" } }

// 2. Use in component
const { t } = useLanguage()
{t("section.key")}
```

### Test Translation
```bash
1. Open page in browser
2. Click 🇻🇳 in header
3. Select English
4. Verify text changes
5. Check mobile view
```

---

**Current Status:** 4/20 pages complete (20%)
**Next Goal:** Complete High Priority pages (4 pages, ~1.5 hours)
**Final Target:** 100% by end of Week 3

---

Let's do this! 🚀
