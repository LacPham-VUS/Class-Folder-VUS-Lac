# Photo Limits Implementation Summary

## Overview
Implemented photo upload/capture limits to prevent excessive storage usage:
- **Class Photos**: Maximum 20 photos per class
- **Student Photos**: Maximum 6 photos per student

## Changes Made

### 1. Class Details Page (`app/classes/[id]/page.tsx`)

#### Added Constants
```typescript
const MAX_CLASS_PHOTOS = 20
const MAX_STUDENT_PHOTOS_PER_STUDENT = 6
const isClassPhotosLimitReached = classPhotos.length >= MAX_CLASS_PHOTOS
```

#### Features Added
- **Warning Alert**: Shows red alert when class photo limit is reached
- **Disabled Buttons**: Upload and Camera buttons disabled when limit reached
- **Badge Counter**: Shows current/max count (e.g., "15/20")
  - Green (secondary) when under limit
  - Red (destructive) when limit reached
- **Toast Notifications**: Shows warning when trying to exceed limit

#### UI Changes
```tsx
// Warning alert at top of Files tab
{isClassPhotosLimitReached && (
  <Alert variant="destructive">
    ⚠️ Đã đạt giới hạn 20 ảnh lớp học...
  </Alert>
)}

// Badge with limit indicator
<Badge variant={isClassPhotosLimitReached ? "destructive" : "secondary"}>
  {classPhotos.length}/{MAX_CLASS_PHOTOS}
  {isClassPhotosLimitReached && " ⚠️"}
</Badge>

// Disabled buttons with toast warnings
<Button disabled={isClassPhotosLimitReached} onClick={...}>
```

### 2. Upload Page (`app/upload/page.tsx`)

#### Enhanced `processFiles()` Function
- Checks existing photos in localStorage before processing
- Validates against limits based on photo type
- Shows detailed error messages with current counts

#### Class Photo Validation
```typescript
const existingPhotos = JSON.parse(localStorage.getItem("vus_photos") || "[]")
const classPhotos = existingPhotos.filter(p => p.classId === classId && p.type === "class")
const currentCount = classPhotos.length + uploadedPhotos.length

if (currentCount + newFilesCount > MAX_CLASS_PHOTOS) {
  // Show error toast
}
```

#### Student Photo Validation
```typescript
const studentPhotos = existingPhotos.filter(p => p.studentId === selectedStudentId)
if (currentCount + newFilesCount > MAX_STUDENT_PHOTOS) {
  // Show error with student name
}
```

### 3. Camera Page (`app/camera/page.tsx`)

#### Enhanced `capturePhoto()` Function
- Checks limits before capturing each photo
- Counts both saved photos and photos in current session
- Prevents capture when limit reached

#### Real-time Validation
```typescript
// For class photos
const classPhotos = existingPhotos.filter(p => p.classId === classId && p.type === "class")
const totalCount = classPhotos.length + capturedPhotos.length

// For student photos
const studentPhotos = existingPhotos.filter(p => p.studentId === selectedStudentId)
const currentSessionPhotos = capturedPhotos.filter(p => p.studentId === selectedStudentId)
const totalCount = studentPhotos.length + currentSessionPhotos.length
```

### 4. Photo Capture Dialog (`components/photo-dialog.tsx`)

#### Pre-flight Validation
- Checks limits before navigating to camera page
- Shows error and closes dialog if limit reached
- Validates both class and student photo limits

#### Implementation
```typescript
function next() {
  if (photoType === "class") {
    const classPhotos = existingPhotos.filter(...)
    if (classPhotos.length >= 20) {
      toast({ title: "⚠️ Đã đạt giới hạn" })
      onOpenChange(false)
      return
    }
  }
  // Similar for student photos
}
```

## User Experience Improvements

### 1. Clear Visual Feedback
- ✅ Red alert banner when limit reached
- ✅ Badge color changes (green → red)
- ✅ Warning icon (⚠️) in badge
- ✅ Disabled buttons with reduced opacity

### 2. Informative Messages
- Shows current count vs. maximum
- Identifies which photos (class/student)
- Mentions student name for student photos
- Suggests action (delete old photos)

### 3. Multiple Validation Points
1. **Dialog**: Checks before opening camera
2. **Camera Page**: Validates on each capture
3. **Upload Page**: Checks on file selection
4. **Class Details**: Disables actions when full

## Technical Details

### Data Storage
- Uses localStorage key: `"vus_photos"`
- Photo objects have:
  - `classId`: Class identifier
  - `type`: "class" | "student"
  - `studentId`: Student identifier (for student photos)

### Limit Constants
```typescript
const MAX_CLASS_PHOTOS = 20                    // Per class
const MAX_STUDENT_PHOTOS_PER_STUDENT = 6       // Per student
```

### Validation Logic
```typescript
// Count existing saved photos
const existing = JSON.parse(localStorage.getItem("vus_photos") || "[]")
const filtered = existing.filter(p => /* match criteria */)

// Count current session photos
const current = capturedPhotos.length  // or uploadedPhotos.length

// Total check
if (filtered.length + current >= LIMIT) {
  // Block action
}
```

## Error Messages (Vietnamese)

### Class Photos
```
⚠️ Đã đạt giới hạn
Lớp học này đã có 20 ảnh (tối đa). Vui lòng xóa ảnh cũ trước khi chụp thêm.
```

### Student Photos
```
⚠️ Đã đạt giới hạn
[Tên học sinh] đã có 6 ảnh (tối đa). Vui lòng xóa ảnh cũ trước khi chụp thêm.
```

### Upload Attempt
```
⚠️ Vượt quá giới hạn
Chỉ có thể upload tối đa 20 ảnh lớp học. 
Hiện có 15 ảnh, đang upload 3 ảnh.
```

## Testing Checklist

- [ ] Class photo limit (20) - Upload page
- [ ] Class photo limit (20) - Camera page
- [ ] Class photo limit (20) - Photo dialog
- [ ] Student photo limit (6) - Upload page
- [ ] Student photo limit (6) - Camera page
- [ ] Student photo limit (6) - Photo dialog
- [ ] Badge shows correct count
- [ ] Badge turns red at limit
- [ ] Buttons disabled at limit
- [ ] Alert appears at limit
- [ ] Toast messages are clear
- [ ] Multi-file upload respects limit
- [ ] Camera session respects limit
- [ ] Different students have separate limits

## Future Enhancements

1. **Admin Override**: Allow managers to increase limits
2. **Compression**: Auto-compress images to save space
3. **Cloud Storage**: Move to cloud instead of localStorage
4. **Bulk Delete**: Delete multiple photos at once
5. **Archive**: Archive old photos instead of delete
6. **Analytics**: Track photo usage per class/student

## Files Modified

1. ✅ `app/classes/[id]/page.tsx` - Main limits UI
2. ✅ `app/upload/page.tsx` - Upload validation
3. ✅ `app/camera/page.tsx` - Capture validation
4. ✅ `components/photo-dialog.tsx` - Pre-flight checks

## Dependencies

- No new dependencies added
- Uses existing:
  - `useToast` for notifications
  - `localStorage` for storage
  - `Alert` component for warnings
  - `Badge` component for counters
