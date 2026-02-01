# 📋 Translation Implementation Checklist

## ✅ Completed
- [x] Language Context System
- [x] Translation Files  
- [x] Language Switcher Component
- [x] Upload Page (fully translated)
- [x] App Header (language switcher added)

## 🚀 Priority 1: Critical Pages (Start Here!)

### 1. Login Page (`app/login/page.tsx`)
**Lines to translate:**
```tsx
// Line 40-42
toast.success("Đăng nhập thành công!")  → t("messages.loginSuccess")
toast.error("Email hoặc mật khẩu không đúng")  → t("messages.loginError")
toast.error("Có lỗi xảy ra, vui lòng thử lại")  → t("messages.error")

// Line 77
<CardDescription>Đăng nhập để quản lý lớp học của bạn</CardDescription>
→ <CardDescription>{t("auth.welcome")}</CardDescription>

// Line 82
<Label htmlFor="email">Email</Label>  → <Label>{t("auth.email")}</Label>

// Line 94
<Label htmlFor="password">Mật khẩu</Label>  → <Label>{t("auth.password")}</Label>

// Line 118
{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
→ {isLoading ? t("common.loading") : t("auth.signIn")}

// Line 128
<span>Tài khoản Demo</span>  → <span>{t("auth.demoAccounts")}</span>

// Line 150
Demo password: <span>demo123</span>
→ {t("auth.demoPassword")}: <span>demo123</span>
```

**Add to translations.ts:**
```tsx
auth: {
  // ... existing
  loginSuccess: "Đăng nhập thành công!",  // en: "Login successful!"
  loginError: "Email hoặc mật khẩu không đúng",  // en: "Invalid email or password"
  demoAccounts: "Tài khoản Demo",  // en: "Demo Accounts"
  demoPassword: "Demo password",  // en: "Demo password"
}
```

### 2. App Sidebar (`components/app-sidebar.tsx`)
**Critical translations:**
- Navigation menu items
- "Collapse Sidebar" button
- Footer text

**Implementation:**
```tsx
// Add at top
import { useLanguage } from "@/lib/language-context"

// In component
const { t } = useLanguage()

// Replace navigation items (around line 50-100)
const navigation = [
  { name: t("nav.dashboard"), href: "/", icon: LayoutDashboard },
  { name: t("nav.classes"), href: "/classes", icon: GraduationCap },
  { name: t("nav.students"), href: "/students", icon: Users },
  // ... etc
]
```

### 3. Classes List Page (`app/classes/page.tsx`)
**Key areas:**
- Page title: "Lớp học" → `{t("classes.title")}`
- Filter labels
- Empty state message
- Button labels

### 4. Students List Page (`app/students/page.tsx`)
Similar to Classes page.

## 📝 Quick Reference: Common Replacements

### Buttons
```tsx
"Lưu" → {t("common.save")}
"Hủy" → {t("common.cancel")}
"Xóa" → {t("common.delete")}
"Sửa" → {t("common.edit")}
"Thêm" → {t("common.add")}
"Tìm kiếm" → {t("common.search")}
"Lọc" → {t("common.filter")}
```

### Toast Messages
```tsx
toast.success("Lưu thành công") → toast.success(t("messages.saveSuccess"))
toast.error("Có lỗi xảy ra") → toast.error(t("messages.error"))
```

### Loading States
```tsx
"Đang tải..." → {t("common.loading")}
"Đang lưu..." → {t("common.saving")}
```

## 🎯 Translation Strategy

### For Each Page:
1. **Import the hook**
   ```tsx
   import { useLanguage } from "@/lib/language-context"
   ```

2. **Use in component**
   ```tsx
   const { t } = useLanguage()
   ```

3. **Find all hardcoded text**
   - Search for Vietnamese text in quotes
   - Look for English button labels
   - Check toast notifications
   - Review empty states

4. **Replace with translation keys**
   ```tsx
   <h1>Lớp học</h1>  →  <h1>{t("classes.title")}</h1>
   ```

5. **Test both languages**
   - Switch to English in UI
   - Verify all text changed
   - Check for layout issues

## 📋 Page-by-Page Checklist

### Priority 1 (Week 1)
- [ ] Login Page
- [ ] App Sidebar
- [ ] Dashboard
- [ ] Classes List
- [ ] Students List

### Priority 2 (Week 2)
- [ ] Class Detail
- [ ] Student Detail
- [ ] Sessions List
- [ ] Session Detail
- [ ] Requests List

### Priority 3 (Week 3)
- [ ] Request Detail
- [ ] Camera Page
- [ ] Reports Page
- [ ] Templates Page
- [ ] Settings Page

### Priority 4 (Week 4)
- [ ] All Dashboard Components
- [ ] Photo Dialog
- [ ] Guidelines Page
- [ ] All remaining components

## 🔧 Adding Missing Translations

If you need a translation that doesn't exist:

1. Open `lib/translations.ts`
2. Add to BOTH `vi` and `en` sections
3. Use descriptive key names
4. Group related translations

Example:
```tsx
// In lib/translations.ts
vi: {
  classes: {
    // ... existing
    enrollmentDate: "Ngày nhập học",
    capacity: "Sức chứa",
  }
},
en: {
  classes: {
    // ... existing
    enrollmentDate: "Enrollment Date",
    capacity: "Capacity",
  }
}
```

## 🎨 Best Practices

1. **Always translate in pairs** - Add both VI and EN at same time
2. **Use existing keys** - Check if translation already exists before adding new
3. **Keep consistent** - Use same translation for same concept
4. **Test frequently** - Switch language after each page
5. **No hardcoding** - All user-facing text should use `t()`

## ⚡ Quick Wins (Easy Translations)

Start with these for quick progress:

1. **Button labels** - Most are already in `common.*`
2. **Toast messages** - Use `messages.*`
3. **Navigation items** - Use `nav.*`
4. **Form labels** - Usually in section-specific keys
5. **Empty states** - Add to section keys

## 🐛 Common Issues

### Issue: "Key not found"
**Fix:** Add the key to `translations.ts`

### Issue: Text not changing
**Fix:** Make sure component is using `t()` function

### Issue: Layout broken in English
**Fix:** English text is usually longer - adjust CSS if needed

## 📊 Progress Tracking

Track your progress:
- Start: ~10% (Upload page only)
- Target: 100% of user-facing text
- Current pages: 1/20
- Current components: 1/15

## 🎓 Learning Resources

See full examples in:
- ✅ `app/upload/page.tsx` - Fully translated page
- ✅ `lib/translations.ts` - All available translations
- ✅ `LANGUAGE_GUIDE.md` - Complete usage guide

---

**Remember:** Every string of user-facing text should go through the translation system!

Happy translating! 🌍
