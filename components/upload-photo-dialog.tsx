"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Save, Trash2, ImagePlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface UploadedPhoto {
  id: string
  dataUrl: string
  fileName: string
  studentId?: string
  studentName?: string
}

interface UploadPhotoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classId: string
  type: "class" | "student"
  students: Array<{ id: string; fullName: string }>
  onSaveComplete: () => void
}

export function UploadPhotoDialog({
  open,
  onOpenChange,
  classId,
  type,
  students,
  onSaveComplete,
}: UploadPhotoDialogProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const selectedStudent = students.find(s => s.id === selectedStudentId)

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files || files.length === 0) return

    // For student photos, must select student first
    if (type === "student" && !selectedStudentId) {
      toast({
        title: "Chọn học sinh",
        description: "Vui lòng chọn học sinh trước khi upload ảnh",
        variant: "destructive",
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      return
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        const newPhoto: UploadedPhoto = {
          id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          dataUrl: dataUrl,
          fileName: file.name,
          studentId: type === "student" ? selectedStudentId : undefined,
          studentName: type === "student" ? selectedStudent?.fullName : undefined,
        }
        setUploadedPhotos(prev => [...prev, newPhoto])
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function deletePhoto(photoId: string) {
    setUploadedPhotos(prev => prev.filter(p => p.id !== photoId))
  }

  function clearAllPhotos() {
    setUploadedPhotos([])
  }

  async function savePhotos() {
    if (uploadedPhotos.length === 0) {
      toast({
        title: "Chưa có ảnh",
        description: "Vui lòng upload ít nhất một ảnh trước khi lưu",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const existingPhotos = JSON.parse(localStorage.getItem("vus_photos") || "[]")
      const photosToSave = uploadedPhotos.map(photo => ({
        id: photo.id,
        dataUrl: photo.dataUrl,
        timestamp: new Date().toISOString(),
        studentId: photo.studentId,
        studentName: photo.studentName,
        classId,
        type,
        fileName: photo.fileName,
        savedAt: new Date().toISOString(),
      }))

      const allPhotos = [...existingPhotos, ...photosToSave]
      localStorage.setItem("vus_photos", JSON.stringify(allPhotos))

      toast({
        title: "✅ Đã lưu ảnh!",
        description: `${uploadedPhotos.length} ảnh đã được lưu thành công`,
      })

      // Reset and close
      setUploadedPhotos([])
      setSelectedStudentId("")
      onOpenChange(false)
      onSaveComplete()
    } catch (error) {
      console.error("Error saving photos:", error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu ảnh. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  function handleClose() {
    if (uploadedPhotos.length > 0) {
      if (!confirm("Bạn có ảnh chưa lưu. Bạn có chắc muốn đóng?")) {
        return
      }
    }
    setUploadedPhotos([])
    setSelectedStudentId("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {type === "class" ? "Upload ảnh lớp học" : "Upload ảnh học sinh"}
          </DialogTitle>
          <DialogDescription>
            {type === "class" 
              ? "Chọn ảnh từ thiết bị để upload cho lớp học"
              : "Chọn học sinh, sau đó upload ảnh cho học sinh đó"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Student selector for student photos */}
          {type === "student" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Chọn học sinh</label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn học sinh..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedStudent && (
                <p className="text-sm text-muted-foreground">
                  Ảnh sẽ được lưu cho: <span className="font-medium text-primary">{selectedStudent.fullName}</span>
                </p>
              )}
            </div>
          )}

          {/* Upload area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Ảnh đã chọn ({uploadedPhotos.length})</label>
              {uploadedPhotos.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive h-7 text-xs"
                  onClick={clearAllPhotos}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Xóa tất cả
                </Button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              className="hidden"
            />

            {uploadedPhotos.length === 0 ? (
              <div
                onClick={() => {
                  if (type === "student" && !selectedStudentId) {
                    toast({
                      title: "Chọn học sinh",
                      description: "Vui lòng chọn học sinh trước khi upload ảnh",
                      variant: "destructive",
                    })
                    return
                  }
                  fileInputRef.current?.click()
                }}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  "hover:border-primary hover:bg-primary/5",
                  type === "student" && !selectedStudentId && "opacity-50 cursor-not-allowed"
                )}
              >
                <ImagePlus className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">Click để chọn ảnh</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hỗ trợ JPG, PNG, WEBP. Có thể chọn nhiều ảnh.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Photo grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                  {uploadedPhotos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-video overflow-hidden rounded-lg border bg-muted"
                    >
                      <img
                        src={photo.dataUrl}
                        alt={photo.fileName}
                        className="h-full w-full object-cover"
                      />
                      
                      {/* Delete button */}
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute right-1 top-1 h-6 w-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-md"
                        onClick={() => deletePhoto(photo.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      
                      {/* Number badge */}
                      <div className="absolute left-1 top-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        #{index + 1}
                      </div>

                      {/* Student name for student photos */}
                      {photo.studentName && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                          <p className="text-[10px] text-white truncate">
                            📸 {photo.studentName}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add more button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  disabled={type === "student" && !selectedStudentId}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Thêm ảnh
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button 
            onClick={savePhotos} 
            disabled={uploadedPhotos.length === 0 || isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Đang lưu..." : `Lưu (${uploadedPhotos.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
